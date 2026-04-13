# REPO_STATUS.md — Brutally Honest Codebase Audit
Generated: 2026-04-10

---

## 1. FOLDER STRUCTURE

```
./.env
./.env.example
./.github/workflows/deploy.yml
./.gitignore
./.mcp.json
./.npmrc
./apps/api/Dockerfile
./apps/api/package.json
./apps/api/src/index.ts
./apps/api/src/jobs/auto-pause-listings.ts
./apps/api/src/jobs/push-notification.ts
./apps/api/src/lib/auth.ts
./apps/api/src/lib/email.ts
./apps/api/src/lib/magic-link-email.ts
./apps/api/src/lib/queue.ts
./apps/api/src/lib/r2.ts
./apps/api/src/lib/sms.ts
./apps/api/src/middleware/admin.ts
./apps/api/src/middleware/auth.ts
./apps/api/src/middleware/rate-limit.ts
./apps/api/src/routes/admin.ts
./apps/api/src/routes/auth.ts
./apps/api/src/routes/connections.ts
./apps/api/src/routes/landlords.ts
./apps/api/src/routes/listings.ts
./apps/api/src/routes/reports.ts
./apps/api/src/routes/storage.ts
./apps/api/src/routes/tenants.ts
./apps/api/src/routes/users.ts
./apps/api/src/types.ts
./apps/api/tsconfig.json
./apps/mobile/.gitignore
./apps/mobile/app.json
./apps/mobile/app/_layout.tsx
./apps/mobile/app/index.tsx
./apps/mobile/app/report.tsx
./apps/mobile/app/connections/reveal.tsx
./apps/mobile/app/(auth)/_layout.tsx
./apps/mobile/app/(auth)/collect-email.tsx
./apps/mobile/app/(auth)/magic-link-verify.tsx
./apps/mobile/app/(auth)/otp.tsx
./apps/mobile/app/(auth)/phone.tsx
./apps/mobile/app/(auth)/role.tsx
./apps/mobile/app/(auth)/setup-passkey.tsx
./apps/mobile/app/(onboarding)/_layout.tsx
./apps/mobile/app/(onboarding)/employment-proof.tsx
./apps/mobile/app/(onboarding)/landlord-profile.tsx
./apps/mobile/app/(onboarding)/property-proof.tsx
./apps/mobile/app/(onboarding)/submitted.tsx
./apps/mobile/app/(onboarding)/tenant-profile.tsx
./apps/mobile/app/(onboarding)/verified.tsx
./apps/mobile/app/(onboarding)/verify-id.tsx
./apps/mobile/app/(tabs)/_layout.tsx
./apps/mobile/app/(tabs)/inbox/index.tsx
./apps/mobile/app/(tabs)/listings/create.tsx
./apps/mobile/app/(tabs)/listings/index.tsx
./apps/mobile/app/(tabs)/profile/index.tsx
./apps/mobile/app/(tabs)/search/index.tsx
./apps/mobile/app/(tabs)/search/[id].tsx
./apps/mobile/components/ConnectionRequestModal.tsx
./apps/mobile/components/EmptyStateView.tsx
./apps/mobile/components/FreshnessIndicator.tsx
./apps/mobile/components/ListingCard.tsx
./apps/mobile/components/NetworkBanner.tsx
./apps/mobile/components/OptimizedImage.tsx
./apps/mobile/components/SkeletonCard.tsx
./apps/mobile/components/VerifiedBadge.tsx
./apps/mobile/eas.json
./apps/mobile/hooks/useNetworkQuality.ts
./apps/mobile/hooks/useRetry.ts
./apps/mobile/lib/auth.ts
./apps/mobile/lib/compress.ts
./apps/mobile/lib/mock-data.ts
./apps/mobile/lib/notifications.ts
./apps/mobile/package.json
./apps/mobile/tsconfig.json
./apps/web/Dockerfile
./apps/web/app/globals.css
./apps/web/app/layout.tsx
./apps/web/app/page.tsx
./apps/web/app/admin/AdminNav.tsx
./apps/web/app/admin/layout.tsx
./apps/web/app/admin/dashboard/page.tsx
./apps/web/app/admin/reports/page.tsx
./apps/web/app/admin/verifications/page.tsx
./apps/web/app/listings/page.tsx
./apps/web/app/listings/[id]/page.tsx
./apps/web/components/AnimatedBg.tsx
./apps/web/components/InteractiveHero.tsx
./apps/web/components/LandingSections.tsx
./apps/web/components/ListingDetail.tsx
./apps/web/components/PhotoCarousel.tsx
./apps/web/components/SectionDivider.tsx
./apps/web/components/StickyNav.tsx
./apps/web/components/TarsierSVG.tsx
./apps/web/components/WaveDivider.tsx
./apps/web/components/Wordmark.tsx
./apps/web/components/listings/FeedCard.tsx
./apps/web/components/listings/FilterSidebar.tsx
./apps/web/components/listings/GalleryCard.tsx
./apps/web/components/listings/ListingsClient.tsx
./apps/web/components/listings/PhotoGrid.tsx
./apps/web/components/listings/ViewToggle.tsx
./apps/web/components/ui/avatar.tsx (+ badge, button, card, dialog, filter-panel, index, input, listing-card, select, skeleton, table, tabs, textarea, toast)
./apps/web/lib/metro-manila.ts
./apps/web/lib/mock-data.ts
./apps/web/lib/utils.ts
./apps/web/next.config.js
./apps/web/postcss.config.mjs
./apps/web/public/fonts/ (BeVietnamPro + Sentient .ttf/.otf files)
./apps/web/public/logo.png (+ favicon, icon-3d, tarsier-3d, tarsier-full)
./packages/db/drizzle.config.ts
./packages/db/index.ts
./packages/db/package.json
./packages/db/tsconfig.json
./packages/db/schema/ (11 files: users, landlord-profiles, tenant-profiles, verification-documents, listings, listing-photos, connection-requests, connections, reports, relations, index)
./packages/db/migrations/ (0000_true_karnak.sql, 0001_moaning_texas_twister.sql, meta/)
./packages/shared/constants.ts
./packages/shared/error-codes.ts
./packages/shared/index.ts
./packages/shared/package.json
./packages/shared/tsconfig.json
./packages/shared/validators/ (auth, connection, listing, profile, report, index)
./packages/ui/tokens.ts
./packages/ui/icons/ (RaydaIcon.tsx, TarsierLogo.tsx)
./packages/ui/package.json
./packages/ui/tsconfig.json
./BRAND.md
./CLAUDE.md
./CLAUDE_CODE_PLAYBOOK.md
./DRD.md
./PRODUCT_DISCOVERY_DOCUMENT.md
./RESEARCH FINDINGS - INFOMRAL RENTAL MARKETPLACE.content.txt
./RESEARCH FINDINGS - INFOMRAL RENTAL MARKETPLACE.json
./TRD.md
./pnpm-workspace.yaml
./turbo.json
```

**Total source files (excl. fonts/images/node_modules/dist):** ~197

---

## 2. PACKAGE.JSON DEPENDENCIES

### Root (`rentrayda`)
- turbo ^2.4.0
- typescript ^5.7.0
- packageManager: pnpm@10.33.0

### `@rentrayda/api` (apps/api)
- hono ^4.12.0
- @hono/node-server ^1.13.0
- @hono/zod-validator ^0.7.6
- better-auth ^1.5.6
- @better-auth/expo ^1.5.6
- @better-auth/passkey ^1.6.0
- @aws-sdk/client-s3 ^3.1024.0
- @aws-sdk/s3-request-presigner ^3.1024.0
- bullmq ^5.73.0
- ioredis ^5.10.1
- zod ^3.25.76
- @rentrayda/db workspace:*
- @rentrayda/shared workspace:*
- Dev: tsx ^4.19.0

### `@rentrayda/mobile` (apps/mobile)
- expo ~55.0.0
- expo-router ~4.0.0
- react ^19.0.0
- react-native ~0.83.0
- better-auth ^1.5.6
- @better-auth/expo ^1.5.6
- @better-auth/passkey ^1.6.0
- @shopify/flash-list ^2.3.1
- expo-image ^55.0.8
- expo-image-picker ^55.0.16
- expo-image-manipulator ^55.0.13
- expo-secure-store ^55.0.11
- expo-notifications ^55.0.16
- expo-clipboard ^55.0.11
- expo-font ~55.0.0
- @react-native-community/netinfo ^12.0.1
- react-native-safe-area-context ~5.0.0
- react-native-screens ~4.0.0

### `@rentrayda/web` (apps/web)
- next ^16.2.0
- react ^19.0.0
- react-dom ^19.0.0
- tailwindcss ^4.2.2
- @tailwindcss/postcss ^4.2.2
- framer-motion ^12.38.0
- lucide-react ^1.7.0
- @radix-ui/react-slot ^1.2.4
- class-variance-authority ^0.7.1
- clsx ^2.1.1

### `@rentrayda/db` (packages/db)
- drizzle-orm ~0.45.0
- pg ^8.13.0
- Dev: drizzle-kit ~0.30.0

### `@rentrayda/shared` (packages/shared)
- zod ^3.23.0

### `@rentrayda/ui` (packages/ui)
- (no dependencies, devDependencies: typescript only)

---

## 3. DATABASE STATUS

### drizzle.config.ts
- **Exists:** Yes
- **DATABASE_URL:** `process.env.DATABASE_URL!` (from `.env`)
- **Schema dir:** `./schema`
- **Migrations dir:** `./migrations`
- **Dialect:** `postgresql`

### Schema files (packages/db/schema/)
All 11 files present:
| File | Lines | Tables/Exports |
|---|---|---|
| users.ts | 17 | `users` (id, phone, email, role, isSuspended, pushToken, lastActiveAt, timestamps) |
| landlord-profiles.ts | 23 | `landlordProfiles` (id, userId FK, fullName, barangay, city, unitCount, profilePhotoUrl, verificationStatus, timestamps) |
| tenant-profiles.ts | 31 | `tenantProfiles` (id, userId FK, fullName, profilePhotoUrl, homeProvince, searchBarangay, currentCity, employmentType, companyName, employmentVerified, moveInDate, budgetMin, budgetMax, preferredBarangays, verificationStatus, timestamps) |
| verification-documents.ts | 27 | `verificationDocuments` (id, userId FK, documentType, idType, r2ObjectKey, selfieR2Key, status, reviewerNotes, reviewedBy, reviewedAt, rejectionReason, consentAt, createdAt) |
| listings.ts | 32 | `listings` (id, landlordProfileId FK, unitType, monthlyRent, barangay, city, beds, rooms, inclusions, description, availableDate, advanceMonths, depositMonths, status, lastActiveAt, timestamps) |
| listing-photos.ts | 13 | `listingPhotos` (id, listingId FK, r2ObjectKey, displayOrder, createdAt) |
| connection-requests.ts | 24 | `connectionRequests` (id, tenantProfileId FK, listingId FK, landlordProfileId FK, message, status, createdAt, respondedAt) + unique constraint |
| connections.ts | 20 | `connections` (id, connectionRequestId FK, tenantUserId, landlordUserId, listingId FK, tenantPhone, landlordPhone, connectedAt) |
| reports.ts | 21 | `reports` (id, reporterId FK, reportedUserId FK, reportedListingId FK, reportType, description, status, timestamps) |
| relations.ts | 45 | All Drizzle relations for relational queries |
| index.ts | 10 | Re-exports all schema modules |

### Migrations
| File | Size | Purpose |
|---|---|---|
| `0000_true_karnak.sql` | 9,541 bytes | Initial schema — creates all 9 tables, indexes, constraints |
| `0001_moaning_texas_twister.sql` | 149 bytes | Adds `email` column to `users` + unique constraint |

### Database connection
**Cannot verify** — no PostgreSQL running locally during this audit. The `.env` is configured for `localhost:5432/rentrayda_dev`.

---

## 4. API ROUTES STATUS

All files exist. All have real route handlers (not stubs). **1,626 lines total** across 9 route files + index.

| File | Lines | Endpoints | Real Logic? |
|---|---|---|---|
| **auth.ts** | 167 | `POST /send-otp`, `POST /verify-otp`, `POST /magic-link`, `POST /passkey/register`, `POST /passkey/authenticate`, `POST /logout`, `GET /me` + better-auth catch-all | Yes — full OTP flow, session creation, auto-profile creation, rate limits |
| **landlords.ts** | 162 | `GET /me`, `PATCH /me`, `POST /verify/id`, `POST /verify/property` | Yes — Drizzle queries, Zod validation, verification doc creation |
| **tenants.ts** | 162 | `GET /me`, `PATCH /me`, `POST /verify/id`, `POST /verify/employment` | Yes — mirrors landlord structure |
| **listings.ts** | 272 | `GET /` (search), `POST /` (create), `GET /:id`, `PATCH /:id`, `DELETE /:id`, `POST /:id/photos` | Yes — full CRUD, verified-landlord filter on search, soft delete |
| **connections.ts** | 336 | `POST /request`, `GET /requests`, `PATCH /:id/accept`, `PATCH /:id/decline`, `GET /`, `GET /:id` | Yes — THE critical feature. Server-side triple verification check on accept. Push notification queue. |
| **storage.ts** | 67 | `POST /presigned-url`, `POST /confirm` | Yes — R2 presigned URL with private/public bucket routing |
| **reports.ts** | 54 | `POST /` | Yes — creates report, sends email to ops |
| **users.ts** | 38 | `POST /push-token` | Yes — updates user pushToken |
| **admin.ts** | 305 | `GET /verification-queue`, `PATCH /verifications/:id`, `GET /metrics`, `GET /reports`, `PATCH /reports/:id` | Yes — signed R2 URLs for doc viewing, approve/reject logic, suspension |

### Supporting files
| File | Lines | Purpose | Status |
|---|---|---|---|
| lib/auth.ts | 55 | better-auth config (phoneNumber, magicLink, passkey, bearer, expo) | Complete |
| lib/r2.ts | ? | R2 presigned URLs (private + public) | Complete |
| lib/sms.ts | ? | PhilSMS REST wrapper | Complete |
| lib/email.ts | ? | Resend email client | Complete |
| lib/magic-link-email.ts | ? | HTML email template for magic links | Complete |
| lib/queue.ts | ? | BullMQ setup | Complete |
| middleware/auth.ts | ? | Session validation | Complete |
| middleware/admin.ts | ? | Admin role guard | Complete |
| middleware/rate-limit.ts | ? | Redis-backed rate limiting | Complete |
| jobs/auto-pause-listings.ts | ? | Cron job to pause stale listings | Complete |
| jobs/push-notification.ts | ? | Push notification job handler | Complete |

**Total API endpoints: ~33** (matches updated TRD.md)

---

## 5. MOBILE SCREENS STATUS

**5,103 lines total** across 26 screen/layout files. All files exist. All have real JSX (not stubs).

| File | Lines | DRD Screen | Real Content? | Notes |
|---|---|---|---|---|
| **_layout.tsx** | 36 | Root | Yes | SafeAreaProvider, Stack navigator |
| **index.tsx** | 12 | Entry | Partial | Redirects to auth or tabs. Has `TODO: Check auth state` |
| **(auth)/phone.tsx** | 178 | Screen 1 | Yes | Phone input, +63 prefix, validation, country code |
| **(auth)/otp.tsx** | 245 | Screen 2 | Yes | 6-digit input, auto-advance, shake animation, resend cooldown |
| **(auth)/role.tsx** | 150 | Screen 3 | Yes | Landlord/Tenant card selection |
| **(auth)/collect-email.tsx** | 124 | N/A (new) | Yes | Email input for magic link/passkey |
| **(auth)/magic-link-verify.tsx** | 70 | N/A (new) | Yes | Magic link verification waiting screen |
| **(auth)/setup-passkey.tsx** | 101 | N/A (new) | Yes | WebAuthn passkey enrollment |
| **(onboarding)/landlord-profile.tsx** | 365 | Screen 4 | Yes | Photo picker, name, barangay dropdown, unit count |
| **(onboarding)/tenant-profile.tsx** | 256 | Screen 8 | Yes | Employment type, company, budget, move-in date |
| **(onboarding)/verify-id.tsx** | 452 | Screen 5 | Yes | ID type radio, PDPA consent, camera capture (ID + selfie) |
| **(onboarding)/property-proof.tsx** | 270 | Screen 6 | Yes | Property proof camera capture |
| **(onboarding)/employment-proof.tsx** | 242 | Screen 9 | Yes | Employment proof camera capture. Has `TODO: get employmentType` |
| **(onboarding)/submitted.tsx** | 100 | Screen 10 | Yes | Confirmation screen. Has `TODO: derive from auth session` |
| **(onboarding)/verified.tsx** | 169 | Screen 11 | Yes | Ceremony screen with animation. Has `TODO: fetch from profile` |
| **(tabs)/_layout.tsx** | 136 | Tab nav | Yes | 3-tab layout, role-based tabs, inbox badge. Has `TODO: derive from auth session` |
| **(tabs)/search/index.tsx** | 354 | Screen 12 | Yes | Listing search, barangay/price filters, FlashList |
| **(tabs)/search/[id].tsx** | 494 | Screen 13 | Yes | Listing detail, photo gallery, landlord card, CTA bar. Has `TODO: open connection request modal` |
| **(tabs)/listings/index.tsx** | 126 | Landlord listings | Yes | Landlord's own listings grid |
| **(tabs)/listings/create.tsx** | 395 | Screen 7 | Yes | Full listing creation form |
| **(tabs)/inbox/index.tsx** | 263 | Screen 15 | Yes | Connection requests list, accept/decline. Has `TODO: derive from auth` |
| **(tabs)/profile/index.tsx** | 199 | Screen 17 | Yes | Profile card, verification status, logout |
| **connections/reveal.tsx** | 217 | Screen 16 | Yes | Phone reveal, call/copy buttons, handshake animation |
| **report.tsx** | 135 | Screen 18 | Yes | Report type radio, description, submit |

### Mobile Components
| File | Lines | Status |
|---|---|---|
| ConnectionRequestModal.tsx | 157 | Complete |
| EmptyStateView.tsx | 55 | Complete |
| FreshnessIndicator.tsx | 37 | Complete |
| ListingCard.tsx | 118 | Complete |
| NetworkBanner.tsx | 47 | Complete |
| OptimizedImage.tsx | 26 | Complete |
| SkeletonCard.tsx | 24 | Complete |
| VerifiedBadge.tsx | 115 | Complete |

### Mobile Libs/Hooks
| File | Lines | Status |
|---|---|---|
| lib/auth.ts | 20 | Complete — better-auth client with all plugins |
| lib/compress.ts | 14 | Complete — image compression |
| lib/mock-data.ts | 338 | Complete — mock listings, requests, connections for offline dev |
| lib/notifications.ts | 67 | Complete — expo-notifications setup |
| hooks/useNetworkQuality.ts | 28 | Complete |
| hooks/useRetry.ts | 43 | Complete |

---

## 6. WEB PAGES STATUS

**1,004 lines** across 9 page/layout files. **4,715 lines** across 30 component files.

| File | Lines | Status | Notes |
|---|---|---|---|
| **layout.tsx** | 27 | Complete | Root layout with metadata |
| **page.tsx** | 42 | Complete | Landing page — composes 12 section components |
| **listings/page.tsx** | 96 | Complete | Listing browse with server-side fetch to API |
| **listings/[id]/page.tsx** | 98 | Complete | Listing detail with server-side fetch |
| **admin/layout.tsx** | 21 | Complete | Admin wrapper with nav |
| **admin/AdminNav.tsx** | 45 | Complete | Admin navigation sidebar |
| **admin/dashboard/page.tsx** | 126 | Complete | Metrics dashboard — fetches from /api/admin/metrics |
| **admin/verifications/page.tsx** | 330 | Complete | Verification queue — approve/reject with signed URLs |
| **admin/reports/page.tsx** | 219 | Complete | Reports queue — review/suspend actions |

### Key Web Components
| Component | Lines | Status |
|---|---|---|
| LandingSections.tsx | 923 | Complete — 12 sections (Hero, TrustStats, HowItWorks, VerificationDemo, etc.) |
| InteractiveHero.tsx | 270 | Complete — 3D tarsier hero with parallax |
| ListingDetail.tsx | 327 | Complete — full listing detail view |
| PhotoCarousel.tsx | 149 | Complete — image gallery |
| StickyNav.tsx | 88 | Complete |
| listings/FilterSidebar.tsx | 470 | Complete — full filter UI |
| listings/FeedCard.tsx | 179 | Complete |
| listings/GalleryCard.tsx | 161 | Complete |
| listings/ListingsClient.tsx | 209 | Complete — client-side interactivity |
| ui/* (14 files) | ~1,200 | Complete — Radix-based design system |

### Web Libs
| File | Status |
|---|---|
| lib/mock-data.ts | Complete — mock listings for dev |
| lib/metro-manila.ts | Complete — barangay/city data |
| lib/utils.ts | Complete — cn() helper |

---

## 7. WHAT ACTUALLY RUNS

### `pnpm turbo typecheck`
```
 Tasks:    8 successful, 8 total
Cached:    2 cached, 8 total
  Time:    24.436s
```
**PASSES. Zero errors.**

### `pnpm turbo build`
```
 Tasks:    6 successful, 6 total
Cached:    2 cached, 6 total
  Time:    36.975s
```
**PASSES.** Web builds successfully:
```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /admin/dashboard
├ ○ /admin/reports
├ ○ /admin/verifications
├ ƒ /listings
└ ƒ /listings/[id]
```
One warning: `no output files found for task @rentrayda/mobile#build` — mobile "build" is just `tsc --noEmit`, no emitted artifacts expected.

### API startup
Not tested (requires running PostgreSQL + Redis). The build compiles to `apps/api/dist/` successfully.

### Mobile app startup
Not tested (requires Expo development build on a real device or emulator). TypeScript compiles cleanly.

---

## 8. ENV VARS

Both `.env` and `.env.example` exist. Variable names:

```
DATABASE_URL
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_VERIFICATION
R2_BUCKET_LISTINGS
R2_BUCKET_PROFILES
R2_ENDPOINT
R2_PUBLIC_URL
PHILSMS_API_KEY
PHILSMS_SENDER_ID
RESEND_API_KEY
BETTER_AUTH_SECRET
BETTER_AUTH_URL
NEXT_PUBLIC_API_URL
EXPO_PUBLIC_API_URL
NODE_ENV
PORT
REDIS_URL
SENTRY_DSN
```

**20 variables.** All documented in `.env.example` and CLAUDE.md.

---

## 9. PLAYBOOK PROGRESS

| # | Description | Status | Evidence |
|---|---|---|---|
| 1 | Initialize Monorepo | **Done** | turbo.json, pnpm-workspace.yaml, all packages present |
| 2 | All 9 Database Schema Files | **Done** | 11 schema files + 2 migrations + relations.ts |
| 3 | Auth: better-auth + PhilSMS OTP | **Done** | lib/auth.ts with 5 plugins, sms.ts, routes/auth.ts with 7 endpoints |
| 4 | R2 Presigned URL Infrastructure | **Done** | lib/r2.ts, routes/storage.ts |
| 5 | Shared Validators + Constants | **Done** | 6 validator files, constants.ts, error-codes.ts |
| 6 | Mobile Auth Screens | **Done** | phone.tsx, otp.tsx, role.tsx + collect-email, magic-link-verify, setup-passkey |
| 7 | Landlord Profile Screen | **Done** | landlord-profile.tsx (365 lines) |
| 8 | Government ID + Selfie Upload | **Done** | verify-id.tsx (452 lines), camera capture, PDPA consent |
| 9 | Property Proof Upload | **Done** | property-proof.tsx (270 lines) |
| 10 | Listing Creation | **Done** | (tabs)/listings/create.tsx (395 lines) |
| 11 | Admin Verification Queue | **Done** | admin/verifications/page.tsx (330 lines), routes/admin.ts |
| 12 | Tenant Profile + Employment Proof | **Done** | tenant-profile.tsx (256 lines), employment-proof.tsx (242 lines) |
| 13 | Listing Search + Browse | **Done** | search/index.tsx (354 lines), FlashList, filters |
| 14 | Listing Detail Screen | **Done** | search/[id].tsx (494 lines), photo gallery, CTA states |
| 15 | Connection Request Submission | **Done** | ConnectionRequestModal.tsx (157 lines), routes/connections.ts POST /request |
| 16 | Landlord Inbox + Accept/Decline | **Done** | inbox/index.tsx (263 lines), PATCH /:id/accept, PATCH /:id/decline |
| 17 | MUTUAL VERIFIED CONNECTION REVEAL | **Done** | connections.ts triple-check (pending + landlord verified + tenant verified), reveal.tsx (217 lines) |
| 18 | VerifiedBadge Component | **Done** | VerifiedBadge.tsx (115 lines), 4 states |
| 19 | Scam Report + Admin Queue | **Done** | report.tsx (135 lines), admin/reports/page.tsx (219 lines) |
| 20 | Verification Ceremony + Share | **Done** | verified.tsx (169 lines), animation |
| 21 | Push Notifications | **Partial** | push-notification.ts job exists, queue.ts configured, mobile notifications.ts exists. No consumer wired up to process queue. |
| 22 | Freshness + Auto-Pause Cron | **Partial** | FreshnessIndicator.tsx exists, auto-pause-listings.ts job defined. Cron scheduling not wired (BullMQ worker not started in index.ts). |
| 23 | Tab Navigation Setup | **Done** | 3-tab layout, role-based, inbox badge, icons |
| 24 | Profile Screen | **Done** | profile/index.tsx (199 lines) |
| 25 | Error Handling + Empty States | **Partial** | EmptyStateView, NetworkBanner, SkeletonCard exist. No global error boundary in mobile. |
| 26 | Submitted Screen | **Done** | submitted.tsx (100 lines) |
| 27 | Expo Dev Build + EAS Config | **Partial** | eas.json exists. No evidence of a successful build. app.json configured. |
| 28 | Web Landing + Listing Browse | **Done** | page.tsx (landing), listings/page.tsx (browse), listings/[id]/page.tsx (detail) |
| 29 | Admin Metrics Dashboard | **Done** | admin/dashboard/page.tsx (126 lines) |
| 30 | 3G Performance Optimization | **Done** | OptimizedImage, compress.ts, useNetworkQuality, SkeletonCard, FlashList |
| 31 | Production Deploy + Day 30 Checklist | **Not started** | Dockerfiles exist but no evidence of actual deployment |
| 32 | App Icon + Splash Screen | **Partial** | Image assets exist (adaptive-icon.png, icon.png), app.json has scheme. No custom splash screen config observed. |

**Summary: 25 done, 5 partial, 2 not started.**

---

## 10. WHAT'S BROKEN OR MISSING

### Critical: Brand Consistency Drift (Source Code vs BRAND.md)

**306 old font references in mobile source code.** Every mobile screen still uses `fontFamily: 'NotoSansOsage'` and `fontFamily: 'TANNimbus'`. BRAND.md explicitly marks these as deprecated and replaced by `Be Vietnam Pro` and `Sentient`. The font FILES have been updated (BeVietnamPro-*.ttf and Sentient-*.otf are present), but the source code still references the old families.

**87 old brand color references in source code.** Mobile code uses `#2563EB` (Tailwind blue-600) and `#2B51E3` (old brand v1 blue). BRAND.md bans both and says to use `#2D79BF`. Web code has been updated, mobile has not. The tab layout also uses `#2563EB`.

### TODOs in Source Code (User-Authored, Not From Dependencies)

| File | TODO |
|---|---|
| `apps/mobile/app/index.tsx:10` | `// TODO: Check auth state and redirect accordingly` |
| `apps/mobile/app/(onboarding)/employment-proof.tsx:40` | `// TODO: get employmentType from profile/params` |
| `apps/mobile/app/(onboarding)/submitted.tsx:9` | `// TODO: derive from auth session` |
| `apps/mobile/app/(onboarding)/verified.tsx:17` | `// TODO: fetch from profile` |
| `apps/mobile/app/(onboarding)/verified.tsx:18` | `// TODO: derive from auth` |
| `apps/mobile/app/(tabs)/inbox/index.tsx:42` | `// TODO: derive from auth` (isLandlord hardcoded) |
| `apps/mobile/app/(tabs)/search/[id].tsx:305` | `// TODO: open connection request modal` |
| `apps/mobile/app/(tabs)/_layout.tsx:8` | `// TODO: derive from auth session` (USER_ROLE hardcoded) |

**Pattern:** All mobile TODOs are about **auth session integration**. The auth client (lib/auth.ts) is configured, but no screen actually calls it. Screens use mock data or hardcoded values instead of reading auth state.

### Mock Data Dependency

Both mobile (`lib/mock-data.ts`, 338 lines) and web (`lib/mock-data.ts`) have extensive mock data files. The mobile app uses a `USE_MOCK_DATA` flag that bypasses auth entirely. This is fine for dev, but it means:
- No screen has been tested against the real API
- The auth flow (phone → OTP → role → tabs) has never run end-to-end on a real device with real data

### BullMQ Workers Not Started

`apps/api/src/jobs/auto-pause-listings.ts` and `push-notification.ts` define job handlers, but `apps/api/src/index.ts` does not start any BullMQ worker. Push notifications are enqueued on connection accept but never processed. The auto-pause cron never runs.

### No Tests

Zero test files exist anywhere in the repo. No `__tests__/`, no `*.test.ts`, no `*.spec.ts`. The playbook's P1 test priority (auth flow + connection security) is not started.

### packages/db/queries/ Does Not Exist

TRD.md §2.13 references `packages/db/queries/` with typed query functions. This directory was never created. All queries are inline in route handlers. (Docs were updated in a prior session to reflect this, but the planned abstraction was never built.)

### No Linter Configured

Every package.json has `"lint": "echo 'no linter configured'"`. ESLint is not installed or configured anywhere.

### Admin Dashboard Uses Inline Styles (Not Brand System)

`apps/web/app/admin/dashboard/page.tsx` uses hardcoded `#2D79BF` inline styles instead of Tailwind tokens. The admin pages were built as a quick utility and don't follow the design system.

### Mobile Tab Icons Are Placeholder Text

`apps/mobile/app/(tabs)/_layout.tsx` renders tab icons as single letters (`S`, `H`, `I`, `P`) instead of actual icons from the RaydaIcon system. The `packages/ui/icons/RaydaIcon.tsx` component exists but is not imported in mobile.

### No Web Auth

The web app has no login page, no auth middleware, no session handling. Admin pages (`/admin/*`) are completely unprotected — anyone can access `/admin/dashboard`, `/admin/verifications`, `/admin/reports`.

### Listing Photos on Web Use Mock Data

`apps/web/lib/mock-data.ts` provides mock listings with placeholder image URLs. The web listing browse and detail pages render these mocks — there's no actual API integration for listing search on the web frontend.

### Missing `resend` Package

The API's `lib/email.ts` imports Resend, but `resend` is not in `apps/api/package.json` dependencies. It may be hoisted from another location or missing entirely. This would cause a runtime error when sending magic link or verification emails.

### No Sentry Integration

`SENTRY_DSN` is in `.env.example` but no `@sentry/*` packages are installed and no Sentry initialization code exists.

---

## Summary

| Layer | Status |
|---|---|
| **Database schema** | Complete (9 tables + relations, 2 migrations) |
| **API backend** | Complete (33 endpoints, auth, middleware, R2, SMS) |
| **Mobile screens** | Complete (26 screens built) but NOT connected to real auth |
| **Web frontend** | Complete (landing + listings + admin) but admin is unprotected |
| **Auth integration** | Backend complete, mobile client configured but not wired into screens |
| **Brand consistency** | Web updated to new colors/fonts. Mobile has 306 old font refs + 87 old color refs |
| **Background jobs** | Defined but not started (no BullMQ worker) |
| **Tests** | None |
| **Deployment** | Not done (Dockerfiles exist, no actual deploy) |
| **Linting** | Not configured |
