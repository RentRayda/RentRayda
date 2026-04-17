import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { rateLimiter } from '../middleware/rate-limit';
import { db, reservations, reservationEvents } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { createReservationSchema } from '@rentrayda/shared';
import { createReservationIntent, verifyWebhookSignature } from '../lib/payments/paymongo';

const PLACEMENT_AMOUNT_CENTAVOS = 14900; // ₱149

const paymentsRouter = new Hono();

// POST /api/payments/reservations — create a Verified Placement reservation
paymentsRouter.post(
  '/reservations',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'create-reservation' }),
  zValidator('json', createReservationSchema),
  async (c) => {
    const input = c.req.valid('json');

    // Create Paymongo payment intent
    const intent = await createReservationIntent({
      amountCentavos: PLACEMENT_AMOUNT_CENTAVOS,
      email: input.email,
      phone: input.phone,
      name: input.name,
      utmSource: input.utmSource,
      utmCampaign: input.utmCampaign,
      utmMedium: input.utmMedium,
    });

    // Create DB row
    const [reservation] = await db.insert(reservations).values({
      tier: 'placement',
      amountCentavos: PLACEMENT_AMOUNT_CENTAVOS,
      status: 'pending',
      paymongoIntentId: intent.intentId,
      email: input.email,
      phone: input.phone,
      name: input.name,
      utmSource: input.utmSource,
      utmCampaign: input.utmCampaign,
      utmMedium: input.utmMedium,
      referrer: input.referrer,
      variant: input.variant,
    }).returning({ id: reservations.id });

    // Audit event
    await db.insert(reservationEvents).values({
      reservationId: reservation.id,
      event: 'intent_created',
      paymongoEventId: intent.intentId,
      details: JSON.stringify({ status: intent.status }),
    });

    return c.json({
      data: {
        reservationId: reservation.id,
        clientKey: intent.clientKey,
      },
    });
  },
);

// POST /api/payments/webhook — Paymongo webhook handler
paymentsRouter.post('/webhook', async (c) => {
  // Read raw body for signature verification
  const rawBody = await c.req.text();
  const signature = c.req.header('paymongo-signature');

  if (!signature) {
    return c.json({ error: 'Missing signature', code: 'INVALID_SIGNATURE' }, 401);
  }

  // Verify signature FIRST, before any DB access
  let isValid: boolean;
  try {
    isValid = verifyWebhookSignature(rawBody, signature);
  } catch {
    return c.json({ error: 'Signature verification failed', code: 'INVALID_SIGNATURE' }, 401);
  }

  if (!isValid) {
    return c.json({ error: 'Invalid signature', code: 'INVALID_SIGNATURE' }, 401);
  }

  const event = JSON.parse(rawBody);
  const eventType = event.data?.attributes?.type;
  const eventId = event.data?.id;

  // We only care about payment.paid events
  if (eventType !== 'payment.paid') {
    return c.json({ data: { received: true } });
  }

  const paymentData = event.data?.attributes?.data;
  const intentId = paymentData?.attributes?.payment_intent_id;

  if (!intentId) {
    return c.json({ data: { received: true, note: 'no intent_id' } });
  }

  // Find reservation by Paymongo intent ID
  const [reservation] = await db
    .select()
    .from(reservations)
    .where(eq(reservations.paymongoIntentId, intentId))
    .limit(1);

  if (!reservation) {
    // Unknown intent — might be from another system. Acknowledge but don't process.
    return c.json({ data: { received: true, note: 'unknown_intent' } });
  }

  // IDEMPOTENCY: if already paid, just acknowledge
  if (reservation.status === 'paid') {
    return c.json({ data: { received: true, note: 'already_paid' } });
  }

  // Update to paid — DB transaction for atomicity
  await db.transaction(async (tx) => {
    await tx
      .update(reservations)
      .set({
        status: 'paid',
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, reservation.id));

    await tx.insert(reservationEvents).values({
      reservationId: reservation.id,
      event: 'payment_paid',
      paymongoEventId: eventId,
      details: JSON.stringify({
        amount: paymentData?.attributes?.amount,
        net_amount: paymentData?.attributes?.net_amount,
        fee: paymentData?.attributes?.fee,
      }),
    });
  });

  // Respond fast (<500ms). Heavy work (notifications, etc.) deferred to BullMQ.
  return c.json({ data: { received: true, status: 'paid' } });
});

export { paymentsRouter };
