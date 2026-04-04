import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { db, users, verificationDocuments, landlordProfiles, tenantProfiles, reports, listings, connections } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { generateViewUrl } from '../lib/r2';
import { sendSMS } from '../lib/sms';
import type { AppVariables } from '../types';

const adminRouter = new Hono<{ Variables: AppVariables }>();

// ALL admin routes require auth + admin role
adminRouter.use('/*', authMiddleware);
adminRouter.use('/*', adminMiddleware);

const verificationActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(200).optional(),
}).refine(
  (data) => data.action !== 'reject' || (data.reason && data.reason.length > 0),
  { message: 'Reason is required when rejecting' },
);

// GET /api/admin/verification-queue
adminRouter.get('/verification-queue', async (c) => {
  const docs = await db
    .select()
    .from(verificationDocuments)
    .innerJoin(users, eq(verificationDocuments.userId, users.id))
    .where(eq(verificationDocuments.status, 'pending'))
    .orderBy(verificationDocuments.createdAt);

  // Generate signed URLs for private verification docs
  const docsWithUrls = await Promise.all(
    docs.map(async (row) => {
      let idPhotoUrl: string | null = null;
      let selfieUrl: string | null = null;

      try {
        idPhotoUrl = await generateViewUrl(row.verification_documents.r2ObjectKey);
      } catch { /* R2 not configured */ }

      if (row.verification_documents.selfieR2Key) {
        try {
          selfieUrl = await generateViewUrl(row.verification_documents.selfieR2Key);
        } catch { /* R2 not configured */ }
      }

      return {
        id: row.verification_documents.id,
        userId: row.verification_documents.userId,
        documentType: row.verification_documents.documentType,
        idType: row.verification_documents.idType,
        status: row.verification_documents.status,
        createdAt: row.verification_documents.createdAt,
        consentAt: row.verification_documents.consentAt,
        idPhotoUrl,
        selfieUrl,
        user: {
          id: row.users.id,
          phone: row.users.phone,
          role: row.users.role,
        },
      };
    }),
  );

  return c.json({ data: docsWithUrls });
});

// PATCH /api/admin/verifications/:id
adminRouter.patch(
  '/verifications/:id',
  zValidator('json', verificationActionSchema),
  async (c) => {
    const docId = c.req.param('id');
    const { action, reason } = c.req.valid('json');
    const adminUser = c.get('user') as { id: string };

    // Get the verification document
    const [doc] = await db
      .select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.id, docId))
      .limit(1);

    if (!doc) {
      return c.json({ error: 'Document not found', code: 'NOT_FOUND' }, 404);
    }

    // Get the user who submitted
    const [submitter] = await db
      .select()
      .from(users)
      .where(eq(users.id, doc.userId))
      .limit(1);

    if (!submitter) {
      return c.json({ error: 'User not found', code: 'NOT_FOUND' }, 404);
    }

    if (action === 'approve') {
      // Update document status
      await db
        .update(verificationDocuments)
        .set({
          status: 'approved',
          reviewedBy: adminUser.id,
          reviewedAt: new Date(),
        })
        .where(eq(verificationDocuments.id, docId));

      // Update profile verification status based on role and doc type
      if (submitter.role === 'landlord') {
        // Check if this completes verification
        // Gov ID approved → at least 'partial'. Gov ID + property → 'verified'
        if (doc.documentType === 'government_id') {
          await db
            .update(landlordProfiles)
            .set({ verificationStatus: 'partial', updatedAt: new Date() })
            .where(eq(landlordProfiles.userId, submitter.id));
        } else if (doc.documentType === 'property_proof') {
          // Check if gov ID is already approved
          const approvedDocs = await db
            .select()
            .from(verificationDocuments)
            .where(eq(verificationDocuments.userId, submitter.id));
          const hasApprovedId = approvedDocs.some(
            (d) => d.documentType === 'government_id' && d.status === 'approved',
          );
          if (hasApprovedId) {
            await db
              .update(landlordProfiles)
              .set({ verificationStatus: 'verified', updatedAt: new Date() })
              .where(eq(landlordProfiles.userId, submitter.id));
          }
        }
      } else if (submitter.role === 'tenant') {
        // Tenant needs BOTH gov ID AND employment proof approved
        const approvedDocs = await db
          .select()
          .from(verificationDocuments)
          .where(eq(verificationDocuments.userId, submitter.id));

        const allApproved = [...approvedDocs.filter((d) => d.status === 'approved')];
        // Include the doc we just approved
        if (!allApproved.find((d) => d.id === docId)) {
          allApproved.push({ ...doc, status: 'approved' });
        }

        const hasId = allApproved.some((d) => d.documentType === 'government_id');
        const hasEmployment = allApproved.some((d) => d.documentType === 'employment_proof');

        if (hasId && hasEmployment) {
          await db
            .update(tenantProfiles)
            .set({ verificationStatus: 'verified', updatedAt: new Date() })
            .where(eq(tenantProfiles.userId, submitter.id));
        } else {
          await db
            .update(tenantProfiles)
            .set({ verificationStatus: 'pending', updatedAt: new Date() })
            .where(eq(tenantProfiles.userId, submitter.id));
        }
      }

      return c.json({ data: { id: docId, status: 'approved' } });
    } else {
      // Reject
      await db
        .update(verificationDocuments)
        .set({
          status: 'rejected',
          rejectionReason: reason,
          reviewedBy: adminUser.id,
          reviewedAt: new Date(),
        })
        .where(eq(verificationDocuments.id, docId));

      // Update profile status back to rejected
      if (submitter.role === 'landlord') {
        await db
          .update(landlordProfiles)
          .set({ verificationStatus: 'rejected', updatedAt: new Date() })
          .where(eq(landlordProfiles.userId, submitter.id));
      } else if (submitter.role === 'tenant') {
        await db
          .update(tenantProfiles)
          .set({ verificationStatus: 'rejected', updatedAt: new Date() })
          .where(eq(tenantProfiles.userId, submitter.id));
      }

      // Send SMS with rejection reason
      try {
        await sendSMS(
          submitter.phone,
          `RentRayda: Your ${doc.documentType.replace('_', ' ')} was not approved. Reason: ${reason}. You can resubmit in the app.`,
        );
      } catch { /* SMS failure is not critical */ }

      return c.json({ data: { id: docId, status: 'rejected', reason } });
    }
  },
);

// GET /api/admin/metrics
adminRouter.get('/metrics', async (c) => {
  const allUsers = await db.select().from(users);
  const allLandlords = await db.select().from(landlordProfiles);
  const allTenants = await db.select().from(tenantProfiles);
  const allDocs = await db.select().from(verificationDocuments);
  const allListings = await db.select().from(listings);
  const allConnections = await db.select().from(connections);
  const allReports = await db.select().from(reports);

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return c.json({
    data: {
      totalUsers: allUsers.length,
      totalLandlords: allLandlords.length,
      totalTenants: allTenants.length,
      verifiedLandlords: allLandlords.filter((l) => l.verificationStatus === 'verified').length,
      verifiedTenants: allTenants.filter((t) => t.verificationStatus === 'verified').length,
      pendingVerifications: allDocs.filter((d) => d.status === 'pending').length,
      activeListings: allListings.filter((l) => l.status === 'active').length,
      draftListings: allListings.filter((l) => l.status === 'draft').length,
      totalConnections: allConnections.length,
      connectionsThisWeek: allConnections.filter((c) => new Date(c.connectedAt) > oneWeekAgo).length,
      pendingReports: allReports.filter((r) => r.status === 'pending').length,
    },
  });
});

// GET /api/admin/reports
adminRouter.get('/reports', async (c) => {
  const allReports = await db
    .select()
    .from(reports)
    .innerJoin(users, eq(reports.reporterId, users.id))
    .orderBy(reports.createdAt);

  return c.json({
    data: allReports.map((r) => ({
      id: r.reports.id,
      reportType: r.reports.reportType,
      description: r.reports.description,
      status: r.reports.status,
      reportedUserId: r.reports.reportedUserId,
      reportedListingId: r.reports.reportedListingId,
      createdAt: r.reports.createdAt,
      reporter: {
        id: r.users.id,
        phone: r.users.phone,
        role: r.users.role,
      },
    })),
  });
});

// PATCH /api/admin/reports/:id
const reportActionSchema = z.object({
  action: z.enum(['review', 'suspend_listing', 'suspend_user']),
});

adminRouter.patch(
  '/reports/:id',
  zValidator('json', reportActionSchema),
  async (c) => {
    const reportId = c.req.param('id');
    const { action } = c.req.valid('json');

    const [report] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
    if (!report) return c.json({ error: 'Report not found', code: 'NOT_FOUND' }, 404);

    if (action === 'review') {
      await db.update(reports).set({ status: 'reviewed', updatedAt: new Date() }).where(eq(reports.id, reportId));
      return c.json({ data: { id: reportId, status: 'reviewed' } });
    }

    if (action === 'suspend_user' && report.reportedUserId) {
      // Suspend the reported user
      await db.update(users).set({ isSuspended: true, updatedAt: new Date() }).where(eq(users.id, report.reportedUserId));
      // Pause all their listings
      const [profile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, report.reportedUserId)).limit(1);
      if (profile) {
        await db.update(listings).set({ status: 'paused', updatedAt: new Date() }).where(eq(listings.landlordProfileId, profile.id));
      }
      await db.update(reports).set({ status: 'resolved', updatedAt: new Date() }).where(eq(reports.id, reportId));
      return c.json({ data: { id: reportId, status: 'resolved', action: 'user_suspended' } });
    }

    if (action === 'suspend_listing' && report.reportedListingId) {
      await db.update(listings).set({ status: 'paused', updatedAt: new Date() }).where(eq(listings.id, report.reportedListingId));
      await db.update(reports).set({ status: 'resolved', updatedAt: new Date() }).where(eq(reports.id, reportId));
      return c.json({ data: { id: reportId, status: 'resolved', action: 'listing_suspended' } });
    }

    return c.json({ error: 'Invalid action for this report', code: 'INVALID_INPUT' }, 400);
  },
);

export { adminRouter };
