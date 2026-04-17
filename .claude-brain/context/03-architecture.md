# Architecture — What Actually Exists

**Source of truth:** REPO_STATUS.md (audit dated 2026-04-10)
**Last updated:** 2026-04-12
**This file:** Grounded in real file paths and real line counts. Do not invent paths not listed here.

---

## Stack (verified)

- **Monorepo:** Turborepo 2.4.0 + pnpm 10.33.0 workspaces
- **API:** Hono 4.12 on Node.js 22 LTS
- **Web:** Next.js 16.2 with App Router
- **Mobile:** Expo SDK 55 + Expo Router 4.x + React 19
- **Database:** PostgreSQL 16.4 + Drizzle ORM 0.45
- **Auth:** better-auth 1.5.6 with 5 plugins (phoneNumber, magicLink, passkey, bearer, expo)
- **Queue:** BullMQ 5.73 on Redis (ioredis 5.10)
- **Storage:** Cloudflare R2 via `@aws-sdk/client-s3` 3.1024
- **Hosting:** DigitalOcean Singapore via Coolify
- **SMS:** PhilSMS via custom wrapper in `apps/api/src/lib/sms.ts`
- **Email:** Resend (⚠️ package missing from `apps/api/package.json`)

---

## Monorepo layout (verified)

```
apps/
├── api/              # Hono API on port 3001 — 1,626 LOC total
├── web/              # Next.js on port 3000 — 1,004 LOC pages + 4,715 LOC components
└── mobile/           # Expo app — 5,103 LOC across 26 screens

packages/
├── db/               # Drizzle schemas + migrations (@rentrayda/db)
│   ├── schema/       # 11 files (9 tables + relations + index)
│   ├── migrations/   # 0000_true_karnak.sql, 0001_moaning_texas_twister.sql
│   └── drizzle.config.ts
├── shared/           # Zod validators + constants (@rentrayda/shared)
└── ui/               # Shared UI (@rentrayda/ui) — icons only
```

⚠️ **Does NOT exist:** `packages/db/queries/` — TRD §2.13 referenced it but it was never built. All queries are inline in route handlers.

---

## API routes (verified, 1,626 LOC across 9 route files)

| File | LOC | Endpoints |
|---|---|---|
| `apps/api/src/routes/auth.ts` | 167 | `POST /send-otp`, `POST /verify-otp`, `POST /magic-link`, `POST /passkey/register`, `POST /passkey/authenticate`, `POST /logout`, `GET /me` + better-auth catch-all |
| `apps/api/src/routes/landlords.ts` | 162 | `GET /me`, `PATCH /me`, `POST /verify/id`, `POST /verify/property` |
| `apps/api/src/routes/tenants.ts` | 162 | `GET /me`, `PATCH /me`, `POST /verify/id`, `POST /verify/employment` |
| `apps/api/src/routes/listings.ts` | 272 | `GET /` (search), `POST /` (create), `GET /:id`, `PATCH /:id`, `DELETE /:id`, `POST /:id/photos` |
| `apps/api/src/routes/connections.ts` | **336** | **THE critical file.** `POST /request`, `GET /requests`, `PATCH /:id/accept`, `PATCH /:id/decline`, `GET /`, `GET /:id` |
| `apps/api/src/routes/storage.ts` | 67 | `POST /presigned-url`, `POST /confirm` |
| `apps/api/src/routes/reports.ts` | 54 | `POST /` |
| `apps/api/src/routes/users.ts` | 38 | `POST /push-token` |
| `apps/api/src/routes/admin.ts` | 305 | `GET /verification-queue`, `PATCH /verifications/:id`, `GET /metrics`, `GET /reports`, `PATCH /reports/:id` |

**Total API endpoints:** 33

### Supporting API files

| File | Purpose | Status |
|---|---|---|
| `apps/api/src/lib/auth.ts` (55 LOC) | better-auth config | Complete |
| `apps/api/src/lib/r2.ts` | R2 presigned URLs (private + public) | Complete |
| `apps/api/src/lib/sms.ts` | PhilSMS REST wrapper | Complete |
| `apps/api/src/lib/email.ts` | Resend email client | ⚠️ resend package missing |
| `apps/api/src/lib/queue.ts` | BullMQ setup | ⚠️ worker not started |
| `apps/api/src/middleware/auth.ts` | Session validation | Complete |
| `apps/api/src/middleware/admin.ts` | Admin role guard | Complete |
| `apps/api/src/middleware/rate-limit.ts` | Redis-backed rate limiting | Complete |
| `apps/api/src/jobs/auto-pause-listings.ts` | Cron for stale listings | ⚠️ not wired |
| `apps/api/src/jobs/push-notification.ts` | Push notification job | ⚠️ consumer not started |

---

## Database schema (verified, 9 tables)

All files in `packages/db/schema/`:

- `users.ts` — core identity (phone, email, role, isSuspended, pushToken, lastActiveAt)
- `landlord-profiles.ts` — landlord fields + verificationStatus
- `tenant-profiles.ts` — profile + employment + budget + verificationStatus
- `verification-documents.ts` — documentType, r2ObjectKey, selfieR2Key, status, consentAt
- `listings.ts` — unitType, rent, barangay, beds, rooms, inclusions, deposit, status, lastActiveAt
- `listing-photos.ts` — r2ObjectKey, displayOrder
- `connection-requests.ts` — tenantProfileId, listingId, landlordProfileId, message, status + unique constraint
- `connections.ts` — the post-verification handshake record with phone numbers
- `reports.ts` — reporter, reported user/listing, reportType, status
- `relations.ts` — all Drizzle relations
- `index.ts` — re-exports

**Migrations applied:**
- `0000_true_karnak.sql` (9,541 bytes)
- `0001_moaning_texas_twister.sql` (149 bytes, adds email column)

**Phase 2 future migrations** (if validation passes):
- `0002_*.sql` — adds `payments` + `match_requests` tables per `decisions/2026-04-12-escrow-via-gcash-partnership.md` (principle: never custody. GCash-specific implementation dead — 0/6 landlords accept GCash. See `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`)

---

## Mobile screens (verified, 26 files, 5,103 LOC)

Expo Router v4 routes:
- `/` — `app/index.tsx` (12 LOC, has TODO)
- `/(auth)/*` — phone, otp, role, collect-email, magic-link-verify, setup-passkey (7 files)
- `/(onboarding)/*` — landlord-profile, tenant-profile, verify-id, property-proof, employment-proof, submitted, verified (8 files)
- `/(tabs)/*` — search, listings, inbox, profile (tab layout + 4 tab sections)
- `/connections/reveal.tsx` (217 LOC — the phone reveal ceremony screen)
- `/report.tsx` (135 LOC)

**Heaviest files (know what's there before editing):**
- `apps/mobile/app/(tabs)/search/[id].tsx` — 494 LOC listing detail
- `apps/mobile/app/(onboarding)/verify-id.tsx` — 452 LOC (camera, PDPA consent, ID + selfie)
- `apps/mobile/app/(tabs)/listings/create.tsx` — 395 LOC
- `apps/mobile/app/(onboarding)/landlord-profile.tsx` — 365 LOC

**Mobile components:** ConnectionRequestModal (157), EmptyStateView, FreshnessIndicator (37), ListingCard (118), NetworkBanner (47), OptimizedImage (26), SkeletonCard (24), VerifiedBadge (115)

**Mobile libs/hooks:** auth.ts (20), compress.ts (14), mock-data.ts (338), notifications.ts (67), useNetworkQuality (28), useRetry (43)

---

## Web pages (verified, 9 pages, 30 components)

- `/` — `app/page.tsx` composing `components/LandingSections.tsx` (923 LOC — 12 sections)
- `/listings` — uses mock data (⚠️ not wired to API)
- `/listings/[id]` — uses mock data
- `/admin/dashboard` — metrics (126 LOC — ⚠️ UNPROTECTED)
- `/admin/verifications` — verification queue (330 LOC — ⚠️ UNPROTECTED)
- `/admin/reports` — reports queue (219 LOC — ⚠️ UNPROTECTED)

Heavy components: InteractiveHero (270 LOC, 3D tarsier), ListingDetail (327), PhotoCarousel (149), FilterSidebar (470), ListingsClient (209).

UI primitives: 14 Radix-based files totaling ~1,200 LOC (avatar, badge, button, card, dialog, filter-panel, input, listing-card, select, skeleton, table, tabs, textarea, toast).

---

## API response convention (enforced across all routes)

**Success:** `return c.json({ data: result }, 200)`
**Error:** `return c.json({ error: 'message', code: 'MACHINE_CODE' }, statusCode)`

Common error codes (`packages/shared/error-codes.ts`): `INVALID_OTP`, `NOT_VERIFIED`, `FORBIDDEN`, `RATE_LIMITED`.

---

## Rate limits (enforced in `apps/api/src/middleware/rate-limit.ts`, Redis-backed)

| Endpoint | Window | Max | Scope |
|----------|--------|-----|-------|
| `POST /auth/send-otp` | 15 min | 5 | Per IP |
| `POST /auth/verify-otp` | 15 min | 10 | Per IP |
| `POST /connections/request` | 1 hour | 20 | Per user |
| `POST /storage/presigned-url` | 1 hour | 30 | Per user |
| `POST /reports` | 1 hour | 10 | Per user |
| Global API | 1 second | 20 | Per IP (Nginx) |

---

## The core security mechanic (do NOT weaken)

`apps/api/src/routes/connections.ts` enforces the triple-check on the accept handler:

```typescript
if (connectionRequest.status !== 'pending') throw FORBIDDEN;
if (landlord.verificationStatus !== 'verified') throw NOT_VERIFIED;
if (tenant.verificationStatus !== 'verified') throw NOT_VERIFIED;
// Only then: reveal phones in connections table
```

**Never do:**
- Relax any of the three checks
- Add admin bypass paths
- Accept email verification as substitute
- Skip checks for "testing"

This is the core security guarantee.

---

## R2 storage (3 buckets, verified in `.env`)

- **`R2_BUCKET_VERIFICATION`** (private) — gov IDs, property proofs, employment proofs, selfies. 1-hour view TTL, 5-min upload TTL. `r2ObjectKey` NEVER returned in API responses.
- **`R2_BUCKET_LISTINGS`** (public) — listing photos, compressed to 800px wide
- **`R2_BUCKET_PROFILES`** (public) — profile avatars

---

## BullMQ jobs (defined, ⚠️ not running)

| Queue | Job | Retry | Timeout |
|-------|-----|-------|---------|
| `notifications` | `push-notification` | 3× exp backoff | 10s |
| `cleanup` | `auto-pause-listings` | 1× | 60s (cron, daily 3AM PHT) |

**⚠️ STATUS:** Handlers defined in `apps/api/src/jobs/` but workers NOT started in `apps/api/src/index.ts`. Push notifications enqueued but not processed. Auto-pause cron never runs. Week 1 cleanup.

---

## Env vars (20 variables, all in `.env.example`)

```
DATABASE_URL
REDIS_URL

R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
R2_BUCKET_VERIFICATION, R2_BUCKET_LISTINGS, R2_BUCKET_PROFILES
R2_ENDPOINT, R2_PUBLIC_URL

PHILSMS_API_KEY, PHILSMS_SENDER_ID
RESEND_API_KEY            ⚠️ package missing from dependencies

BETTER_AUTH_SECRET, BETTER_AUTH_URL

NEXT_PUBLIC_API_URL, EXPO_PUBLIC_API_URL
NODE_ENV, PORT

SENTRY_DSN                ⚠️ no @sentry/* packages installed
```

### Phase 2 additions (after validation passes, per decisions)

- `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET` — reservation card payments
- ~~`GCASH_API_KEY`, `GCASH_MERCHANT_ID`~~ — **REMOVED.** GCash hypothesis dead (0/6 landlords accept GCash, see `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`). Deposit orchestration partner TBD. Env vars will be added when a new partner is selected.
- `PHILSYS_EVERIFY_API_KEY`, `PHILSYS_EVERIFY_INSTITUTION_ID` — pending PSA onboarding
- `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID` — Page auto-posting
- `GEMINI_API_KEY` or `ANTHROPIC_API_KEY` — for listing verification managed agent

---

## Build verification (2026-04-10)

**`pnpm turbo typecheck`:** ✅ 8 tasks, zero errors
**`pnpm turbo build`:** ✅ 6 tasks

Web routes produced: `/`, `/_not-found`, `/admin/dashboard`, `/admin/reports`, `/admin/verifications`, `/listings` (dynamic), `/listings/[id]` (dynamic)

**Not tested:** API startup (needs running Postgres + Redis), mobile app startup (needs Expo dev build on device).

---

## Known bugs and gaps (REPO_STATUS.md §10)

### Brand drift — Week 1 cleanup priority
- **306 old font references** in mobile (`NotoSansOsage`, `TANNimbus`) → replace with `BeVietnamPro-Bold` and `Sentient-Medium`
- **87 old color references** in mobile (`#2563EB`, `#2B51E3`) → replace with `#2D79BF`
- Web is clean. Only mobile drifted.

### Mobile auth TODOs (8 specific file:line locations)
1. `apps/mobile/app/index.tsx:10` — auth state redirect
2. `apps/mobile/app/(onboarding)/employment-proof.tsx:40` — employmentType from profile
3. `apps/mobile/app/(onboarding)/submitted.tsx:9` — derive from auth session
4. `apps/mobile/app/(onboarding)/verified.tsx:17` — fetch from profile
5. `apps/mobile/app/(onboarding)/verified.tsx:18` — derive from auth
6. `apps/mobile/app/(tabs)/inbox/index.tsx:42` — isLandlord hardcoded
7. `apps/mobile/app/(tabs)/search/[id].tsx:305` — open connection request modal
8. `apps/mobile/app/(tabs)/_layout.tsx:8` — USER_ROLE hardcoded

**Pattern:** Auth client configured in `apps/mobile/lib/auth.ts` (20 LOC), but no screen actually uses it. Screens use mock data via `USE_MOCK_DATA` flag.

### Other gaps
- **Mock data dependency:** `apps/mobile/lib/mock-data.ts` (338 LOC) + `apps/web/lib/mock-data.ts` still active. Web listings render mocks.
- **BullMQ workers not started:** see above
- **Zero tests:** no `*.test.ts`, no `*.spec.ts`, no `__tests__/`
- **No linter:** every package.json has `"lint": "echo 'no linter configured'"`
- **No web auth:** admin pages completely unprotected
- **Mobile tab icons:** render as letters `S`/`H`/`I`/`P` instead of RaydaIcon
- **`resend` package missing** from `apps/api/package.json`
- **No Sentry integration:** DSN env var exists, no packages installed
- **No deployment:** Dockerfiles exist, never deployed

**Total Week 1 cleanup estimate:** ~40 hours.

---

## What not to change without a decision file

- The triple-check in `connections.ts` reveal logic
- The response envelope format `{ data }` / `{ error, code }`
- Database sessions (better-auth) — do NOT switch to JWTs
- Phone-only primary auth (no email as primary)
- Private R2 bucket for verification docs
- 1-hour signed URL TTL for viewing, 5-minute for uploading
- Rate limits (can adjust only with data justification)
