# Webhook tunnel setup for Paymongo local dev — 2026-04-18

## Goal
Expose localhost:3001 to the internet so Paymongo can deliver webhooks during local development.

## Setup (ngrok)

1. Install ngrok: https://ngrok.com/download (free tier is sufficient)
2. Start API server: `pnpm --filter @rentrayda/api dev`
3. Start tunnel: `ngrok http 3001`
4. Copy the https URL (e.g., `https://abc123.ngrok-free.app`)
5. In Paymongo dashboard (https://dashboard.paymongo.com):
   - Go to Developers → Webhooks
   - Create webhook: `https://abc123.ngrok-free.app/api/payments/webhook`
   - Events: `payment.paid`, `checkout_session.payment.paid`
   - Copy the webhook secret → set as PAYMONGO_WEBHOOK_SECRET in .env
6. Test with card `4343 4343 4343 4345` (Paymongo test card, always succeeds)

## Notes
- ngrok free tier URLs change every restart — update Paymongo webhook URL each time
- For persistent URLs: ngrok paid plan ($8/mo) or use Cloudflare Tunnel (free, requires domain)
- The webhook endpoint verifies HMAC-SHA256 signatures — don't skip this in production
- Paymongo sends webhooks with a `paymongo-signature` header containing `t=timestamp,te=test_sig`

## Test cards (Paymongo test mode)
- Success: `4343 4343 4343 4345` (any expiry, any CVV)
- Failure: `4000 0000 0000 0002` (declined)
- 3DS required: `4120 0000 0000 0007`

## Troubleshooting
- Webhook not arriving: check ngrok inspector at http://localhost:4040
- 401 on webhook: PAYMONGO_WEBHOOK_SECRET mismatch — re-copy from dashboard
- Timeout: API must respond in <5s for Paymongo not to retry
