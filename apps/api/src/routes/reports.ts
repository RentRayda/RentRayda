import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { db, users, reports } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { createReportSchema } from '@rentrayda/shared';
import { sendEmail } from '../lib/email';
import type { AppVariables } from '../types';

const reportsRouter = new Hono<{ Variables: AppVariables }>();
reportsRouter.use('/*', authMiddleware);

// POST /api/reports
reportsRouter.post(
  '/',
  rateLimiter({ max: 10, windowMs: 60 * 60 * 1000, keyPrefix: 'reports' }),
  zValidator('json', createReportSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!appUser) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const body = c.req.valid('json');

    const [report] = await db
      .insert(reports)
      .values({
        reporterId: appUser.id,
        reportedUserId: body.reportedUserId || null,
        reportedListingId: body.reportedListingId || null,
        reportType: body.reportType,
        description: body.description || null,
        status: 'pending',
      })
      .returning({ id: reports.id });

    // Send email notification to ops
    sendEmail(
      'ops@rentrayda.ph',
      `New Report: ${body.reportType}`,
      `<p>A new <strong>${body.reportType}</strong> report was submitted by user ${appUser.phone}.</p>
       <p>${body.description || 'No description provided.'}</p>
       <p><a href="https://rentrayda.ph/admin/reports">View in Admin Dashboard</a></p>`,
    ).catch(() => { /* email failure not critical */ });

    return c.json({ data: { reportId: report.id } }, 201);
  },
);

export { reportsRouter };
