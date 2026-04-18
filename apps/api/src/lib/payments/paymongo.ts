/**
 * Paymongo client for reservation payments ONLY.
 *
 * RentRayda NEVER holds, transmits, or controls user funds.
 * Reservations are standard ecommerce payments for our matching service.
 * Deposits flow directly landlord-to-tenant — we don't touch them.
 *
 * See: decisions/2026-04-12-escrow-via-gcash-partnership.md (principle: never custody)
 */

const PAYMONGO_API = 'https://api.paymongo.com/v1';

function getSecretKey(): string {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new Error('PAYMONGO_SECRET_KEY not configured');
  return key;
}

function authHeader(): string {
  return 'Basic ' + Buffer.from(getSecretKey() + ':').toString('base64');
}

export interface CreateReservationIntentParams {
  amountCentavos: number;
  email?: string;
  phone?: string;
  name?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
}

export interface ReservationIntentResult {
  intentId: string;
  clientKey: string;
  status: string;
}

export async function createReservationIntent(
  params: CreateReservationIntentParams,
): Promise<ReservationIntentResult> {
  const response = await fetch(`${PAYMONGO_API}/payment_intents`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: params.amountCentavos,
          payment_method_allowed: ['card', 'gcash', 'grab_pay', 'paymaya'],
          payment_method_options: { card: { request_three_d_secure: 'any' } },
          currency: 'PHP',
          description: 'RentRayda Verified Placement reservation',
          statement_descriptor: 'RENTRAYDA',
          metadata: {
            tier: 'placement',
            email: params.email || null,
            phone: params.phone || null,
            name: params.name || null,
            utm_source: params.utmSource || null,
            utm_campaign: params.utmCampaign || null,
            utm_medium: params.utmMedium || null,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Paymongo create intent failed: ${response.status} ${JSON.stringify(err)}`);
  }

  const body = await response.json();
  const attrs = body.data.attributes;

  return {
    intentId: body.data.id,
    clientKey: attrs.client_key,
    status: attrs.status,
  };
}

export function verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) throw new Error('PAYMONGO_WEBHOOK_SECRET not configured');

  // Paymongo webhook signature format: t=timestamp,te=test_signature,li=live_signature
  const parts = signatureHeader.split(',');
  const timestampPart = parts.find((p) => p.startsWith('t='));
  const signaturePart = parts.find((p) => p.startsWith('te=') || p.startsWith('li='));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.slice(2);
  const signature = signaturePart.slice(3);

  const crypto = require('crypto') as typeof import('crypto');
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export interface CreateCheckoutSessionParams {
  amountCentavos: number;
  description: string;
  reservationId: string;
  email?: string;
  phone?: string;
  name?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string | null>;
}

export interface CheckoutSessionResult {
  checkoutSessionId: string;
  checkoutUrl: string;
  paymentIntentId: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CheckoutSessionResult> {
  const lineItems = [
    {
      amount: params.amountCentavos,
      currency: 'PHP',
      name: 'Verified Placement Reservation',
      description: params.description,
      quantity: 1,
    },
  ];

  const response = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: lineItems,
          payment_method_types: ['card', 'gcash', 'grab_pay', 'paymaya'],
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          description: params.description,
          statement_descriptor: 'RENTRAYDA',
          metadata: {
            reservation_id: params.reservationId,
            tier: 'placement',
            ...(params.metadata || {}),
          },
          ...(params.email ? { billing: { email: params.email, name: params.name || undefined, phone: params.phone || undefined } } : {}),
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Paymongo create checkout failed: ${response.status} ${JSON.stringify(err)}`);
  }

  const body = await response.json();
  const attrs = body.data.attributes;

  return {
    checkoutSessionId: body.data.id,
    checkoutUrl: attrs.checkout_url,
    paymentIntentId: attrs.payment_intent.id,
  };
}

export interface RefundParams {
  paymentIntentId: string;
  amountCentavos: number;
  reason: string;
}

export async function refund(params: RefundParams): Promise<{ refundId: string }> {
  // First, get the payment ID from the intent
  const intentResponse = await fetch(`${PAYMONGO_API}/payment_intents/${params.paymentIntentId}`, {
    headers: { 'Authorization': authHeader() },
  });

  if (!intentResponse.ok) {
    throw new Error(`Paymongo get intent failed: ${intentResponse.status}`);
  }

  const intentBody = await intentResponse.json();
  const payments = intentBody.data.attributes.payments;
  if (!payments || payments.length === 0) {
    throw new Error('No payments found on this intent — cannot refund');
  }

  const paymentId = payments[0].id;

  // Create refund
  const response = await fetch(`${PAYMONGO_API}/refunds`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: params.amountCentavos,
          payment_id: paymentId,
          reason: 'requested_by_customer',
          notes: params.reason,
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Paymongo refund failed: ${response.status} ${JSON.stringify(err)}`);
  }

  const body = await response.json();
  return { refundId: body.data.id };
}
