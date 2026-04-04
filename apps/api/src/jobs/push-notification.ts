import { Worker } from 'bullmq';

interface PushPayload {
  userId: string;
  pushToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

async function sendExpoPush(payload: PushPayload): Promise<boolean> {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.pushToken,
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        sound: 'default',
      }),
    });
    return response.ok;
  } catch {
    console.error('Push notification failed for user:', payload.userId);
    return false;
  }
}

const connection = {
  host: new URL(process.env.REDIS_URL || 'redis://localhost:6379').hostname,
  port: Number(new URL(process.env.REDIS_URL || 'redis://localhost:6379').port) || 6379,
};

// EXACTLY 2 notification types — DO NOT add others
const worker = new Worker(
  'notifications',
  async (job) => {
    if (job.name === 'push') {
      const payload = job.data as PushPayload;
      if (!payload.pushToken) return;
      await sendExpoPush(payload);
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: { max: 10, duration: 1000 },
  },
);

worker.on('failed', (job, err) => {
  console.error(`Push job ${job?.id} failed:`, err.message);
});

export { worker };
