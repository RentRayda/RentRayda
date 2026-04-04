import { Worker, Queue } from 'bullmq';
import { db, listings, landlordProfiles, users } from '@rentrayda/db';
import { eq, and, lt } from 'drizzle-orm';
import { sendSMS } from '../lib/sms';

const connection = {
  host: new URL(process.env.REDIS_URL || 'redis://localhost:6379').hostname,
  port: Number(new URL(process.env.REDIS_URL || 'redis://localhost:6379').port) || 6379,
};

const cleanupQueue = new Queue('cleanup', { connection });

// Schedule: daily 3AM PHT (UTC+8 = 19:00 UTC previous day)
export async function scheduleAutoPause() {
  // Remove existing repeatable jobs to avoid duplicates
  const existing = await cleanupQueue.getRepeatableJobs();
  for (const job of existing) {
    await cleanupQueue.removeRepeatableByKey(job.key);
  }

  await cleanupQueue.add(
    'auto-pause',
    {},
    {
      repeat: { pattern: '0 19 * * *' }, // 3AM PHT = 19:00 UTC
    },
  );
}

const worker = new Worker(
  'cleanup',
  async (job) => {
    if (job.name !== 'auto-pause') return;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtySevenDaysAgo = new Date(now.getTime() - 37 * 24 * 60 * 60 * 1000);

    // Step 1: Auto-pause listings inactive for 37+ days (30 + 7 day grace)
    const toPause = await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.status, 'active'),
          lt(listings.lastActiveAt, thirtySevenDaysAgo),
        ),
      );

    for (const listing of toPause) {
      await db
        .update(listings)
        .set({ status: 'paused', updatedAt: now })
        .where(eq(listings.id, listing.id));
    }

    // Step 2: Send SMS warning for listings inactive 30-37 days
    const toWarn = await db
      .select()
      .from(listings)
      .innerJoin(landlordProfiles, eq(listings.landlordProfileId, landlordProfiles.id))
      .innerJoin(users, eq(landlordProfiles.userId, users.id))
      .where(
        and(
          eq(listings.status, 'active'),
          lt(listings.lastActiveAt, thirtyDaysAgo),
        ),
      );

    for (const row of toWarn) {
      try {
        await sendSMS(
          row.users.phone,
          `RentRayda: Your listing in ${row.listings.barangay} has been inactive for 30+ days. Open the app to keep it visible, or it will be paused in 7 days.`,
        );
      } catch { /* SMS failure not critical */ }
    }

    console.log(`Auto-pause: warned ${toWarn.length}, paused ${toPause.length}`);
  },
  { connection },
);

worker.on('failed', (job, err) => {
  console.error(`Auto-pause job ${job?.id} failed:`, err.message);
});

export { worker as autoPauseWorker };
