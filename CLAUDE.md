# RentRayda — Session Boot + Technical Reference
# Primary Claude Code context file. Read BEFORE any other file.
# Deep context: .claude-brain/ (decisions, research, brand, psychographics, scripts)

---

## SESSION BOOT PROTOCOL (read FIRST, every session)

**HARD RULES (violating any = stop immediately):**
1. Never write code before reading `.claude-brain/context/00-north-star.md`.
2. Never suggest anything in `FINAL_DECISION.md` Section 3 (kill list — 19 rejected paths).
3. Never add a dependency without asking.
4. Never refactor beyond the immediate scope.
5. Never write a blueprint longer than 500 lines.

**BEFORE ANY RESPONSE INVOLVING CODE — mental checklist:**
1. Does it already exist? Check REPO_STATUS.md §9.
2. Is it a known bug? Check REPO_STATUS.md §10.
3. Is it in the build list? Check FINAL_DECISION.md Section 4.
4. Is there a decision file? Check `.claude-brain/decisions/`.
5. What's the minimum scope? Narrow it before touching any file.

**Kickoff procedure:** follow `.claude-brain/prompts/session-kickoff.md` (execute automatically at session start — no prompting needed).

For behavioral guardrails, reset protocol, and anti-patterns: see `.claude-brain/CLAUDE.md`.

---

## CURRENT FOCUS
# At the start of every Claude Code session, overwrite this section with:
# - Feature name you are building
# - Specific files you are working in
# - Acceptance criteria for today's session
# - Any decisions made in previous sessions that affect today
#
# Example:
# Working on: tenant-profile-creation
# Files: packages/db/schema/tenant-profiles.ts, apps/mobile/app/(onboarding)/tenant-profile.tsx
# Done when: Tenant can submit profile form, data saves to tenant_profiles table
# Previous: Using expo-image-picker for photo capture, quality 0.7

---

## WHAT THIS APP IS

RentRayda is a trust-first rental connection app for the Philippine informal rental market
(₱3K-15K/month). It serves displaced provincial migrants (BPO workers) who need housing
in Metro Manila but have no local connections, and informal landlords (2-10 units, cash
rent) who need to screen strangers before opening their doors. The platform verifies
both landlord identity + property ownership and tenant identity + employment, then
reveals phone numbers only when BOTH sides are verified. It is NOT a property management
tool, NOT a payment platform, NOT a social network, and NOT a broker marketplace. The
core transaction is the verified connection reveal — the moment both parties get each
other's phone number. Everything else exists to get users to that moment.

Brand: #2D79BF (RentRayda Blue). Logo: Philippine tarsier silhouette.
Verified badge: #16A34A (Green — universal "approved" signal, NOT brand blue).
NOTE: #2B51E3 is the OLD brand blue (v1) — use #2D79BF everywhere. See BRAND.md §5 for banned colors.

## TECH STACK

Backend:
- Runtime: Node.js 22 LTS
- Framework: Hono 4.12.x
- Port: 3001 (development)
- Start: pnpm --filter @rentrayda/api dev

Web Frontend:
- Framework: Next.js 16.2 App Router
- Port: 3000 (development)
- Start: pnpm --filter @rentrayda/web dev
- Config: output: 'standalone' in next.config.js (required for self-hosting)
- Font: Be Vietnam Pro (body) + Sentient (display) via next/font

Mobile Frontend:
- Framework: Expo SDK 55 with Expo Router
- React Native: 0.83 (bundled with SDK 55)
- Start: cd apps/mobile && npx expo start --dev-client
- Test on: Custom development build (NOT Expo Go — it cannot run expo-secure-store or push notifications)
- Scheme: rentrayda (deep links: rentrayda://)
- New Architecture: enabled by default in SDK 55 (do NOT disable)
- Font: Be Vietnam Pro + Sentient loaded via expo-font + useFonts() hook (see DRD.md §1.4)

Database:
- PostgreSQL 16.4 at localhost:5432
- Database name: rentrayda_dev (development), rentrayda_prod (production)
- ORM: Drizzle 0.45 (NOT v1.0-beta — use stable 0.45.x only)
- Schema files: packages/db/schema/ (one file per table, 9 files total — see TRD.md §2)
- Relations file: packages/db/schema/relations.ts (required for relational queries — see TRD.md §2.12)
- Run migrations: pnpm --filter @rentrayda/db drizzle-kit migrate
- View data: pnpm --filter @rentrayda/db drizzle-kit studio
- NEVER edit migration files manually. Generate → review SQL → apply.

File Storage:
- Cloudflare R2 (S3-compatible API)
- SDK: @aws-sdk/client-s3 configured with R2 endpoint
- Upload pattern: ALWAYS presigned URL. Client uploads directly to R2.
- NEVER proxy file uploads through the backend.
- TWO SEPARATE upload functions in apps/api/src/lib/r2.ts:
  - generatePrivateUploadUrl() → rentrayda-verification-docs (PRIVATE — signed URLs only, 1hr expiry)
  - generatePublicUploadUrl() → rentrayda-listing-photos / rentrayda-profile-photos (PUBLIC — direct URL)
- NEVER combine these into one generic function. See TRD.md §6.

Authentication:
- Package: better-auth 1.5.x with @better-auth/expo plugin
- Primary method: Phone + SMS OTP via PhilSMS (₱0.35/SMS)
- Additional methods: Passkeys (WebAuthn), Magic Links (email)
- Session: Database sessions (NOT JWT) stored in PostgreSQL. 30-day expiry, daily refresh. Instant revocation on suspension.
- Plugins: phoneNumber(), magicLink(), passkey(), bearer(), expo({ scheme: 'rentrayda' })
- OTP: 6 digits, 10-min expiry, 3 attempts → 15-min lockout, 5 sends/hr/phone
- On first verify-otp: creates user with temp email `{phone}@rentrayda.local` + auto-creates empty profile based on role

SMS:
- Provider: PhilSMS (₱0.35/SMS)
- Wrapper: apps/api/src/lib/sms.ts (custom fetch wrapper — see TRD.md §5)
- Phone normalization: normalizePhPhone() handles 09XX, +63, 63, and 9XX formats
- Fallback: iTexMo (₱0.15/SMS) for burst capacity

Code patterns (route, query, response, auth middleware): `.claude-brain/context/13-code-patterns.md`

## PROJECT STRUCTURE

```
/
├── .claude-brain/              # v6 second brain — context, decisions, prompts, scripts
│   ├── context/                # 13 context docs (north-star, research, repo-status, etc.)
│   ├── decisions/              # Decision log (kill-scraping, tenant-only-revenue, etc.)
│   ├── prompts/                # Session kickoff, pre-commit, reset, debug, wrap
│   ├── scripts/                # refresh-repo-status, check-sync, install-hooks, verify
│   ├── journal/                # Session journals (YYYY-MM-DD-topic.md)
│   └── CLAUDE.md               # Behavioral guardrails + reset protocol (secondary to this file)
├── apps/
│   ├── web/                    # Next.js 16.2 — landing page, admin dashboard, listing browse
│   ├── mobile/                 # Expo SDK 55 — all user-facing onboarding and transaction flows
│   └── api/                    # Hono 4.12.x — REST API backend serving both web and mobile
│       ├── src/
│       │   ├── index.ts        # Hono app + route mounting
│       │   ├── routes/         # auth, landlords, tenants, listings, connections, storage, reports, users, admin
│       │   ├── middleware/     # auth.ts, admin.ts, rate-limit.ts
│       │   ├── lib/            # auth.ts, r2.ts, sms.ts, email.ts, queue.ts
│       │   └── jobs/           # push-notification.ts, sms-notification.ts, auto-pause-listings.ts
├── packages/
│   ├── db/                     # Drizzle 0.45 — 9 schema files, relations, migrations
│   ├── shared/                 # Zod validators, TypeScript types, constants, error codes
│   └── ui/                     # Shared design tokens (color, spacing, typography)
├── artifacts/                  # Pre-drafted marketing/onboarding content
├── docs/archive/               # Archived docs (v1 build-phase playbook)
├── CLAUDE.md                   # This file
├── TRD.md                      # Technical Requirement Document (APIs, schemas, infra)
├── DRD.md                      # Design Requirement Document (screens, wireframes, components)
├── PLAYBOOK.md                 # 40 god-prompts: validation → scale
├── FINAL_DECISION.md           # Kill list (19 items) + build list + revenue paths
├── BRAND.md                    # Brand book v2 — colors, tarsier, typography
├── turbo.json                  # Pipeline: build, dev, lint, typecheck
├── pnpm-workspace.yaml
├── .npmrc                      # node-linker=hoisted (required for Expo)
└── .env.example                # All env vars documented
```

## DATABASE SCHEMA

Full schemas with indexes and types: TRD.md §2.
Relations for relational queries: TRD.md §2.12.
All queries are inline in route handlers (no separate queries/ directory).

Key column names (match these exactly — do NOT use alternatives):
- listings.landlordProfileId (NOT landlordId)
- listings.unitType (NOT propertyType) — values: 'bedspace' | 'room' | 'apartment' | 'studio'
  <!-- NOTE (2026-04-17): L6 claims bedspace declining — studio ₱5-7.5K with private CR is the growth segment. PROVISIONAL (n=1) — confirm with L7-L10 before changing enum priority. 'studio' added as option but bedspace NOT removed. -->
- listings.monthlyRent (integer, pesos)
- No listings.title field — listings identified by unitType + barangay

## VERIFICATION SYSTEM

Landlord (landlord_profiles.verification_status):
- 'unverified' → 'pending' → 'verified' (or 'rejected' → resubmit → 'pending')
- 'partial': Gov ID verified but property proof still pending

Tenant (tenant_profiles.verification_status):
- 'unverified' → 'pending' → 'verified' (or 'rejected')
- Requires BOTH gov ID AND employment proof approved to reach 'verified'

Connection reveal rule:
BOTH landlord AND tenant verificationStatus = 'verified' must be true BEFORE phone
numbers are revealed. This check happens SERVER-SIDE in PATCH /connections/:id/accept.
NEVER trust the client. NEVER reveal a phone number when either party is not verified.

## KEY BUSINESS RULES — NEVER VIOLATE

1. Zero deposit processing — no GCash/Maya, no escrow. Deposits flow directly landlord-to-tenant. Paymongo handles only Tier 1 reservation (₱149) + balance (₱350). We never touch deposits.
2. Phone numbers revealed ONLY when BOTH parties verified AND connection accepted
3. Government IDs stored ONLY in PRIVATE R2 bucket — signed URLs, 1hr expiry
4. Never expose r2ObjectKey to any client response — generate signed URLs server-side
5. All /admin/* routes require user.role === 'admin' middleware
6. Listings in search ONLY if landlord verified AND listing.status === 'active'
7. Connection requests ONLY from verified tenants
8. Landlord onboarding: max 5 screens
9. Never store gov ID file content in database — R2 object keys only
10. Verification status changes ONLY through admin routes
11. Listing photos → PUBLIC R2. Verification docs → PRIVATE R2. Never swap.
12. New features: check this list first. If conflict, stop and ask founder.

## DESIGN TOKENS

NativeWind (mobile) + Tailwind (web):
- Brand: bg-rayda (#2D79BF), text-rayda, border-rayda
- Brand light: bg-rayda-light (#DBEAFE)
- Verified: #16A34A (green — VerifiedBadge only, NOT brand blue)
- Background: #FAFAFA | Surface: #FFFFFF
- Text primary: #1A1A2E | Text secondary: #6B7280
- Danger: #DC2626 | Warning: #D97706

Fonts: Be Vietnam Pro (body: 400, 500, 600, 700) + Sentient (display/headings: 300, 400, 600, 700)
Body text: minimum 16px. Never below 12px on any screen.
Touch targets: minimum 48×48dp on all interactive elements.
Full design system: DRD.md §1.

## ENVIRONMENT VARIABLES

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/rentrayda_dev"
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_VERIFICATION="rentrayda-verification-docs"
R2_BUCKET_LISTINGS="rentrayda-listing-photos"
R2_BUCKET_PROFILES="rentrayda-profile-photos"
R2_ENDPOINT="https://{account-id}.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-{hash}.r2.dev"
PHILSMS_API_KEY=""
PHILSMS_SENDER_ID="PhilSMS"
RESEND_API_KEY=""
BETTER_AUTH_SECRET=""          # Generate: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_API_URL="http://localhost:3001"
NODE_ENV="development"
PORT="3001"
REDIS_URL="redis://localhost:6379"
SENTRY_DSN=""
```
# When adding new env vars: add here AND to .env.example AND to Coolify config.

## WHAT NOT TO DO

1. Never add deposit/escrow payment routes or GCash/Maya integration. Paymongo handles ONLY Tier 1 ₱149 reservation + ₱350 balance. Never custody deposits.
2. Never serve verification document files directly — presigned URLs only
3. Never reveal phone numbers without checking BOTH verification statuses server-side
4. Never use Supabase, Vercel, Firebase, or Heroku for any part of the stack
5. Never write raw SQL — use Drizzle query builder for all database operations
6. Never skip Zod validation on API routes — every input must be validated
7. Never add features that require money movement through the platform
8. Never make the landlord onboarding longer than 5 screens
9. Never store government ID file content in the database — R2 object keys only
10. Never put verification documents in the public R2 bucket
11. Never change verification_status without going through the admin verification route
12. Never add map/GPS features without founder approval (cost + complexity)
13. Never build review or rating features — excluded from MVP scope entirely

Local setup: SETUP.md §Local Development
Deployment: docs/deployment.md

---

## SESSION END PROTOCOL

At session end: follow `.claude-brain/prompts/session-wrap.md`.
