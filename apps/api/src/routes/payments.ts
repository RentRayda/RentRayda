import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { rateLimiter } from '../middleware/rate-limit';
import { db, reservations, reservationEvents } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { createReservationSchema } from '@rentrayda/shared';
import { createCheckoutSession, verifyWebhookSignature } from '../lib/payments/paymongo';

const PLACEMENT_AMOUNT_CENTAVOS = 14900; // ₱149

const paymentsRouter = new Hono();

// POST /api/payments/reservations — create a Verified Placement reservation
paymentsRouter.post(
  '/reservations',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'create-reservation' }),
  zValidator('json', createReservationSchema),
  async (c) => {
    const input = c.req.valid('json');

    // Determine base URL for success/cancel redirects
    const origin = c.req.header('origin') || process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

    // Generate a temp ID for the redirect URL (will be replaced after DB insert)
    const tempId = crypto.randomUUID();

    // Create Paymongo checkout session (hosted payment page)
    const session = await createCheckoutSession({
      amountCentavos: PLACEMENT_AMOUNT_CENTAVOS,
      description: 'RentRayda Verified Placement — 3 matches in 48hrs or full refund',
      reservationId: tempId,
      email: input.email,
      phone: input.phone,
      name: input.name,
      successUrl: `${origin}/reserved/thank-you?id=${tempId}`,
      cancelUrl: `${origin}/reserved/retry?id=${tempId}`,
      metadata: {
        email: input.email || null,
        phone: input.phone || null,
        utm_source: input.utmSource || null,
        utm_campaign: input.utmCampaign || null,
        utm_medium: input.utmMedium || null,
      },
    });

    // Create DB row with the payment intent ID from the checkout session
    const [reservation] = await db.insert(reservations).values({
      id: tempId,
      tier: 'placement',
      amountCentavos: PLACEMENT_AMOUNT_CENTAVOS,
      status: 'pending',
      paymongoIntentId: session.paymentIntentId,
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
      event: 'checkout_created',
      paymongoEventId: session.checkoutSessionId,
      details: JSON.stringify({ paymentIntentId: session.paymentIntentId }),
    });

    return c.json({
      data: {
        reservationId: reservation.id,
        checkoutUrl: session.checkoutUrl,
      },
    });
  },
);

// GET /api/payments/reservations/:id — public reservation status (no PII)
paymentsRouter.get('/reservations/:id', async (c) => {
  const id = c.req.param('id');

  const [reservation] = await db
    .select({
      id: reservations.id,
      tier: reservations.tier,
      status: reservations.status,
      amountCentavos: reservations.amountCentavos,
      currency: reservations.currency,
      createdAt: reservations.createdAt,
      paidAt: reservations.paidAt,
    })
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1);

  if (!reservation) {
    return c.json({ error: 'Reservation not found', code: 'NOT_FOUND' }, 404);
  }

  return c.json({ data: reservation });
});

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

  // Handle checkout.session.payment.paid (from checkout sessions)
  // and payment.paid (from direct payment intents)
  if (eventType !== 'payment.paid' && eventType !== 'checkout_session.payment.paid') {
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
