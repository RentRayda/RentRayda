# CLAUDE CODE PLAYBOOK
# RentRayda — Philippine Informal Rental Marketplace
# 31 Paste-Ready Prompts | Self-Testing Verification Loops | Session Protocols
# Version 1.0 | April 4, 2026
# Stack: Next.js 16.2 | Node.js 22 LTS | Hono 4.12 | Drizzle 0.45 | Expo SDK 55 | better-auth 1.5 | PostgreSQL 16.4
# Reference: CLAUDE.md + TRD.md + DRD.md in repo root

---

## PART 1: PRE-SESSION PROTOCOL

Run BEFORE every Claude Code session. Every step. No exceptions.

### Step 1: Update CLAUDE.md CURRENT FOCUS

```
## CURRENT FOCUS
Working on: [feature-name]
Files: [exact paths]
Done when: [acceptance criteria]
Previous: [decisions from last session]
```

### Step 2: Clean Git State

```bash
git status        # Must show 'nothing to commit'
git pull origin main
```

### Step 3: Verify Dev Environment

```bash
docker ps | grep postgres   # Running?
docker ps | grep redis      # Running?
pnpm turbo typecheck        # Zero errors?
pnpm turbo build            # Passes?
```

### Step 4: Open Reference Files in VS Code

Always open: `CLAUDE.md`. Building UI → also open `DRD.md`. Building API → also open `TRD.md Section 3`. Touching DB → also open `TRD.md Section 2` + the schema file.

### Step 5: Scope the Session

One session = one feature domain. Never mix unrelated work. If you need to switch topics, run `/clear` first.

### Step 6: Context Budget

Run `/compact` proactively at ~60% context usage. Add preservation note: `/compact Focus on the [feature] changes and the schema decisions.`

---

## PART 2: POST-SESSION PROTOCOL

The 8-Step Verification Loop — run AFTER every session, BEFORE committing.

```bash
# 1. Type check
pnpm turbo typecheck

# 2. Lint
pnpm turbo lint

# 3. Build
pnpm turbo build

# 4. Test affected packages
pnpm turbo test --filter=...[changed-package]

# 5. Review diff (NEVER skip — read every line)
git diff --stat && git diff

# 6. Security scan (2 minutes, manual)
grep -r "r2_object_key\|r2ObjectKey" apps/api/src/routes/  # Must NOT be in responses
grep -r "password\|secret\|api_key" apps/ --include="*.ts" -l  # No hardcoded secrets
# Check: new routes have authMiddleware?
# Check: presigned URLs expire in 5 min (upload) or 1 hr (view)?

# 7. Functional test
# Start server, test the specific flow you built

# 8. Commit
git add -A
git commit -m "feat(scope): description"
git push origin main
```

**If any step fails after 2 attempts:** Run `/clear` and start fresh with a better prompt.

---

## PART 3: 32 PASTE-READY PROMPTS

---

### PROMPT 1: Initialize Monorepo (Day 1)

**Files:** Root config, all package.json files

```
Read CLAUDE.md and TRD.md Section 1.

Initialize Turborepo monorepo with pnpm workspaces:
- apps/api (Hono 4.12), apps/mobile (Expo SDK 55), apps/web (Next.js 16.2)
- packages/db (Drizzle 0.45), packages/shared, packages/ui
- .npmrc with node-linker=hoisted
- turbo.json with build/dev/lint/typecheck pipelines
- .env.example with ALL env vars from TRD.md Section 8

After setup:
1. pnpm install — zero errors
2. pnpm turbo build — passes
3. pnpm turbo typecheck — passes
4. ls -la apps/ packages/ — all folders exist
```

**Verify:** `pnpm install && pnpm turbo build && pnpm turbo typecheck`

---

### PROMPT 2: All 9 Database Schema Files (Day 2)

**Files:** packages/db/schema/*.ts, packages/db/index.ts, drizzle.config.ts

```
Read CLAUDE.md and TRD.md Section 2.

Create ALL 9 Drizzle schema files in packages/db/schema/ EXACTLY as written in TRD.md:
users.ts, landlord-profiles.ts, tenant-profiles.ts, verification-documents.ts,
listings.ts, listing-photos.ts, connection-requests.ts, connections.ts, reports.ts

Create index.ts re-exporting all. Create db client in packages/db/index.ts.
Create drizzle.config.ts pointing to DATABASE_URL.

Generate migration: pnpm --filter @rentrayda/db drizzle-kit generate
Show me the generated SQL — DO NOT apply. Wait for my approval.

1. pnpm turbo typecheck — zero errors
2. Migration file exists in packages/db/migrations/
```

**Verify:** `pnpm turbo typecheck && ls packages/db/migrations/`

---

### PROMPT 3: Auth: better-auth + PhilSMS OTP (Day 2)

**Files:** apps/api/src/lib/auth.ts, sms.ts, middleware/auth.ts, routes/auth.ts

```
Read CLAUDE.md and TRD.md Sections 3.1, 4, and 5.

Set up authentication:
1. better-auth config with phoneNumber, magicLink, passkey, bearer, expo plugins (TRD Section 4 code)
2. PhilSMS REST wrapper (TRD Section 5 code)
3. Auth middleware (TRD Section 4 code)
4. Auth routes: POST send-otp, verify-otp, magic-link, passkey/register, passkey/authenticate, logout; GET me
5. Rate limiting: 10/hr per IP + 5/hr per phone for send-otp, 5/15min for verify-otp
6. Session: database sessions (NOT JWT), 30-day expiry, daily refresh
7. OTP: 6 digits, 10-min expiry, 3 attempts then 15-min lockout
8. On first verify-otp: create user with temp email {phone}@rentrayda.local, auto-create empty profile

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Start API: pnpm --filter @rentrayda/api dev
3. curl -X POST localhost:3001/api/auth/send-otp -H "Content-Type: application/json" -d '{"phone":"09171234567"}'
4. Verify response shape matches TRD format
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 4: R2 Presigned URL Infrastructure (Day 3)

**Files:** apps/api/src/lib/r2.ts, routes/storage.ts

```
Read CLAUDE.md and TRD.md Sections 3.6 and 6.

Create R2 file upload infrastructure:
1. r2.ts with TWO SEPARATE functions (TRD Section 6 code):
   - generatePrivateUploadUrl() for rentrayda-verification-docs bucket
   - generatePublicUploadUrl() for rentrayda-listing-photos and rentrayda-profile-photos
   - generateViewUrl() for admin viewing of private docs
   - verifyObjectExists() for upload confirmation
2. Routes: POST /storage/presigned-url, POST /storage/confirm
3. Validate: only image/jpeg and image/png allowed
4. Upload URL expires in 5 minutes. View URL expires in 1 hour.

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Verify: private and public functions are SEPARATE (grep the file)
3. Verify: expiresIn is 300 for uploads, 3600 for views
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 5: Shared Validators + Constants (Day 2)

**Files:** packages/shared/validators/*.ts, constants.ts, types/index.ts

```
Read CLAUDE.md and TRD.md.

Create shared Zod validators and constants:
1. validators/auth.ts — phone regex, OTP schema
2. validators/listing.ts — create/update listing body
3. validators/profile.ts — landlord and tenant profile schemas
4. validators/connection.ts — connection request body
5. validators/report.ts — report body with refine
6. constants.ts: LAUNCH_BARANGAYS, UNIT_TYPES, INCLUSIONS, ID_TYPES,
   EMPLOYMENT_TYPES, BPO_COMPANIES, REPORT_TYPES
7. types/index.ts — TypeScript type re-exports

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Import a validator in apps/api — verify cross-package import works
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 6: Mobile Auth Screens (Phone + OTP + Role) (Day 3)

**Files:** apps/mobile/app/(auth)/phone.tsx, otp.tsx, role.tsx, email.tsx, passkey-setup.tsx, apps/mobile/lib/auth.ts

```
Read CLAUDE.md and DRD.md Screens 1, 2, 3.

Build the three auth screens:
1. PhoneEntryScreen — DRD Screen 1 wireframe exactly
   - Phone input with +63 prefix, keyboardType="phone-pad"
   - CTA disabled until /^9\d{9}$/ matches
   - All 7 states from DRD
2. OTPVerifyScreen — DRD Screen 2 wireframe
   - 6 individual digit inputs, auto-advance, auto-submit on 6th digit
   - Shake animation on wrong code (translateX +-5px, 300ms)
   - Resend button hidden for 60s then countdown
   - Lockout after 3 wrong attempts
3. RoleSelectionScreen — DRD Screen 3 wireframe
   - Two cards: Landlord / Tenant
   - Selected card: border-rayda, bg-rayda-light
   - CTA disabled until selection

Mobile auth client:
- Create apps/mobile/lib/auth.ts using TRD.md Section 4 mobile client code
- expo-secure-store for session token storage
- scheme: "rentrayda"

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Start mobile: cd apps/mobile && npx expo start
3. Navigate through phone → OTP → role selection
4. Verify: user created in DB with correct role
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 7: Landlord Profile Screen (Day 4)

**Files:** apps/api/src/routes/landlords.ts, apps/mobile/app/(onboarding)/landlord-profile.tsx

```
Read CLAUDE.md, TRD.md Section 3.2, DRD.md Screen 4.

Build landlord profile:
API: GET/PATCH /api/landlords/me with Zod validation
Mobile: DRD Screen 4 wireframe exactly
- PhotoPicker: expo-image-picker (quality: 0.7, allowsEditing: true, aspect [1,1])
- Upload photo to PUBLIC R2 bucket via presigned URL
- Barangay dropdown from LAUNCH_BARANGAYS constant
- Unit count stepper (1-50)
- All 7 states from DRD
- Brand color for CTA: #2D79BF (bg-rayda)

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Create profile with photo on mobile
3. Verify: landlord_profiles row in DB
4. Verify: photo in R2 profile-photos bucket (PUBLIC, not private)
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 8: Government ID + Selfie Upload (Day 4)

**Files:** apps/api/src/routes/landlords.ts, tenants.ts, apps/mobile/app/(onboarding)/verify-id.tsx

```
Read CLAUDE.md, TRD.md Sections 3.2/3.3, DRD.md Screen 5.

Build ID verification upload (shared by landlord + tenant):
API: POST /landlords/verify/id, POST /tenants/verify/id
- Create verification_documents row, set verification_status to 'pending'
- NEVER expose r2ObjectKey in response
Mobile: DRD Screen 5 wireframe exactly
- PDPA consent checkbox REQUIRED before camera activates
- Radio list: ID types from ID_TYPES constant
- Step 1: Capture ID (back camera, quality 0.8, no editing)
- Step 2: Capture selfie (front camera, quality 0.7, square crop)
- Upload both to PRIVATE R2 bucket (rentrayda-verification-docs)
- Progress bar during upload
- consent_at timestamp stored in verification_documents

SECURITY CHECKS after implementation:
1. Presigned URL uses PRIVATE bucket (verify bucket name in code)
2. r2ObjectKey NOT in any API response
3. consentAt stored (PDPA requirement)
4. pnpm turbo typecheck && pnpm turbo build
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 9: Property Proof Upload (Day 5)

**Files:** apps/mobile/app/(onboarding)/property-proof.tsx

```
Read CLAUDE.md, TRD.md Section 3.2, DRD.md Screen 6.

Build property proof upload (landlord only):
- Radio list: tax declaration, barangay cert, building admin letter, utility bill, land title, lease auth
- Camera capture → PRIVATE R2 bucket
- Skip option with warning: listing won't appear in search until verified
- Reuses presigned URL pattern from Prompt 8

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Upload test document
3. Verify: verification_documents row with type 'property_proof'
4. Verify: document in PRIVATE R2 bucket (NOT public)
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 10: Listing Creation (Day 5)

**Files:** apps/api/src/routes/listings.ts, apps/mobile/app/(landlord)/create-listing.tsx

```
Read CLAUDE.md, TRD.md Section 3.4, DRD.md Screen 7.

Build listing creation:
API: POST /api/listings with Zod validation
- Status: 'active' if landlord verified, 'draft' if unverified
- Only listing owner can update/delete
Mobile: DRD Screen 7 wireframe exactly
- Chip selector: bedspace/room/apartment (selected: bg-rayda text-white)
- Rent input: numeric with peso formatting
- Inclusions: checkbox grid from INCLUSIONS constant
- Description: max 200 chars with live counter
- Photos: 1-5, expo-image-picker, client compression quality 0.6
- Upload photos to PUBLIC R2 rentrayda-listing-photos bucket

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Create listing with 2 photos as verified landlord → status='active'
3. Create listing as unverified landlord → status='draft'
4. Photos in PUBLIC bucket (not private)
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 11: Admin Verification Queue (Day 6)

**Files:** apps/api/src/routes/admin.ts, apps/web/app/admin/verifications/page.tsx

```
Read CLAUDE.md, TRD.md Section 3.9, DRD.md Web Screen 2.

Build admin verification dashboard:
API:
- GET /api/admin/verification-queue (pending docs + signed URLs)
- PATCH /api/admin/verifications/:id (approve/reject)
- ALL admin routes: authMiddleware THEN adminMiddleware
- Approve: doc.status='approved' + profile verificationStatus + push notification
- Reject: doc.status='rejected' + SMS with reason via PhilSMS
Web:
- Table with thumbnails (click to expand via signed URL modal)
- Side-by-side ID + selfie for face comparison
- Reject requires reason text

SECURITY CHECKS:
1. curl without auth → 401
2. curl as non-admin → 403
3. curl as admin → 200
4. Approve changes verificationStatus to 'verified'
5. Reject sends SMS via PhilSMS
6. pnpm turbo typecheck && pnpm turbo build
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 12: Tenant Profile + Employment Proof (Day 8-10)

**Files:** apps/api/src/routes/tenants.ts, apps/mobile/app/(onboarding)/tenant-profile.tsx, employment-proof.tsx

```
Read CLAUDE.md, TRD.md Section 3.3, DRD.md Screens 8-9.

Build tenant profile + employment verification:
API: GET/PATCH /tenants/me, POST /tenants/verify/employment
- Tenant reaches 'verified' ONLY when BOTH gov ID AND employment approved
Mobile:
1. TenantProfileScreen (DRD Screen 8)
   - Employment type chip selector from EMPLOYMENT_TYPES
   - Company autocomplete from BPO_COMPANIES (for BPO type)
2. EmploymentProofScreen (DRD Screen 9)
   - BPO: Company ID / Payslip / COE
   - Student: School ID + Enrollment
   - Camera → PRIVATE R2 bucket

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Create tenant, upload ID + selfie + company ID
3. Verify: 3 verification_documents rows
4. Tenant stays 'pending' until admin approves ALL docs
5. Admin approves all → verificationStatus becomes 'verified'
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 13: Listing Search + Browse (Day 11)

**Files:** apps/api/src/routes/listings.ts, apps/mobile/app/(tabs)/search/index.tsx, components/ListingCard.tsx

```
Read CLAUDE.md, TRD.md Section 3.4, DRD.md Screen 12.

Build listing search:
API: GET /api/listings with filters + pagination (10/page)
- CRITICAL: Only where landlord.verificationStatus='verified' AND listing.status='active'
- Join: landlord_profiles (name + badge), listing_photos (first photo)
Mobile:
1. Search screen with barangay input + filter chips
2. ListingCard component per DRD spec
3. FreshnessIndicator component per DRD spec
4. FlashList (not FlatList) with estimatedItemSize={280}
5. Skeleton loading: 3 shimmer cards
6. Empty state: "No listings in this area yet" with "CLEAR FILTERS" CTA
7. Pagination button (not infinite scroll)

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Create 2 listings: 1 verified landlord, 1 unverified
3. Search → only verified landlord's listing appears
4. Empty search → empty state with simple English copy
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 14: Listing Detail Screen (Day 11)

**Files:** apps/mobile/app/(tabs)/search/[id].tsx

```
Read CLAUDE.md, TRD.md Section 3.4, DRD.md Screen 13.

Build listing detail:
1. Photo gallery (horizontal ScrollView, pagingEnabled, dot indicators)
2. Price: text-2xl font-bold text-rayda (#2D79BF)
3. Landlord card with photo + VerifiedBadge (green for verified)
4. FreshnessIndicator
5. Inclusions chips
6. Anti-scam card: "This landlord is verified..."
7. Fixed bottom bar (h-20) with CTA:
   - Verified tenant: "CONNECT WITH [NAME]" bg-rayda
   - Unverified: "PLEASE VERIFY YOUR PROFILE" bg-amber-500
   - Already sent: "REQUEST ALREADY SENT" bg-gray-300 disabled
8. Report link below CTA

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Tap listing card → detail shows all fields
3. Verify CTA state changes by tenant verification status
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 15: Connection Request Submission (Day 12)

**Files:** apps/api/src/routes/connections.ts, apps/mobile/components/ConnectionRequestModal.tsx

```
Read CLAUDE.md, TRD.md Section 3.5, DRD.md Screen 14.

Build connection request:
API: POST /api/connections/request
- Tenant MUST be verified (server-side, non-bypassable)
- No duplicate request to same listing
- Enqueue push notification to landlord via BullMQ
Mobile: Bottom sheet modal on listing detail
- Optional message (max 200 chars with counter)
- Toast on success: "Sent! Waiting for the landlord to respond. ✓"

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Verified tenant sends request → 201 + connection_requests row
3. Unverified tenant → 403 NOT_VERIFIED
4. Duplicate request → 409 DUPLICATE
5. Push notification job enqueued in Redis
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 16: Landlord Inbox + Accept/Decline (Day 13)

**Files:** apps/mobile/app/(tabs)/inbox/index.tsx

```
Read CLAUDE.md, TRD.md Section 3.5, DRD.md Screen 15.

Build landlord inbox:
API: GET /api/connections/requests, PATCH /:id/accept, PATCH /:id/decline
Mobile:
1. ConnectionRequestCard per DRD spec (photo, name, badge, employer, message)
2. Accept (bg-rayda) / Decline (bg-gray-100) buttons, h-10 each
3. Tap tenant name/photo → modal with full tenant profile (read-only)
4. Empty state: "No connection requests yet..."
5. Skeleton loading for list

After:
1. pnpm turbo typecheck && pnpm turbo build
2. View request in landlord inbox
3. Accept → connection_requests.status = 'accepted'
4. Decline → status = 'declined'
5. Empty inbox shows empty state with simple English copy
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 17: ⚠️ MUTUAL VERIFIED CONNECTION REVEAL — MOST CRITICAL (Day 15)

**Files:** apps/api/src/routes/connections.ts, apps/mobile/app/connections/reveal.tsx

```
Read CLAUDE.md, TRD.md Section 3.5, DRD.md Screen 16.

*** THIS IS THE MOST IMPORTANT FEATURE IN RENTRAYDA ***

Modify PATCH /api/connections/:id/accept:
1. Server-side checks (ALL must pass):
   a. connection_request.status === 'pending'
   b. landlord.verificationStatus === 'verified'
   c. tenant.verificationStatus === 'verified'
2. ONLY if all pass → create connections row with BOTH phone numbers
3. Phone numbers copied from users table at reveal time
4. Enqueue push notification to tenant

Mobile: DRD Screen 16 wireframe
1. Handshake icon with spring scale animation (stiffness 200, damping 15)
2. "You are now connected! ✓" headline (32px, bold, text-rayda #2D79BF)
3. Contact card: photo + name + badge + PHONE NUMBER (text-2xl bold)
4. Call button (opens dialer) + Copy button (clipboard + toast)
5. Share button with pre-filled English share text

SECURITY AUDIT (mandatory before committing):
1. Can unverified tenant get a phone number? → MUST BE NO
2. Can unverified landlord create a connection? → MUST BE NO
3. Does phone appear in ANY other endpoint? → MUST BE NO
4. Can connection be created without both verified? → MUST BE NO
5. Review EVERY LINE of the accept endpoint manually
6. pnpm turbo typecheck && pnpm turbo build
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build && MANUAL SECURITY REVIEW`

---

### PROMPT 18: VerifiedBadge Component (Day 16)

**Files:** apps/mobile/components/VerifiedBadge.tsx + all screens using badges

```
Read CLAUDE.md, DRD.md Section 1.6.

Create VerifiedBadge component:
1. 4 states: verified (GREEN #16A34A), pending (amber), unverified (gray), rejected (red)
   NOTE: Verified uses GREEN, not the brand blue. Green = universal "approved" signal.
2. Optional BPO sub-badge (showBpoSubBadge prop)
3. Exact dimensions: 28px height, 14px border-radius, 16px icon, 11px text
4. Icons from lucide-react-native: CheckCircle2, Clock, Circle, XCircle
5. NativeWind classes per DRD spec
6. accessibilityLabel per state

Integrate into: ListingCard, ListingDetail, ConnectionRequestCard,
ProfileScreen, ConnectionRevealScreen

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Create users in each verification state
3. Correct badge renders on every screen
4. No false positives
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 19: Scam Report + Admin Queue (Day 17)

**Files:** apps/api/src/routes/reports.ts, admin.ts, apps/mobile/app/report.tsx, apps/web/app/admin/reports/page.tsx

```
Read CLAUDE.md, TRD.md Sections 3.7/3.9, DRD.md Screen 18 + Web Screen 3.

Build report flow:
API: POST /api/reports, GET/PATCH /api/admin/reports
- Email notification to ops on new report via Resend
Mobile: Report modal (DRD Screen 18)
- Report type radios from REPORT_TYPES constant
- Optional description (max 500 chars)
- CTA: bg-red-600 text-white (red — serious action)
Web: Admin report queue table
- Mark reviewed / Suspend listing / Suspend user actions

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Submit report from mobile → appears in admin web queue
3. Suspend user → user.isSuspended = true
4. Email notification received
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 20: Verification Ceremony + Share (Day 22)

**Files:** apps/mobile/app/(onboarding)/verified.tsx

```
Read CLAUDE.md, DRD.md Screen 11.

Build verification ceremony:
1. Green shield: 64x64, bg-green-600 (#16A34A), rounded-2xl, CheckCircle2 32px white
2. Spring animation: scale 0→1 (stiffness 200, damping 15)
3. Background flash: transparent→#DCFCE7→transparent over 300ms
4. Personalized: "[Name], you're verified! ✓" (Display 32px bold)
5. Role-specific body copy (tenant vs landlord — see DRD)
6. Share button → native share sheet with pre-filled English:
   Tenant: "I found a verified landlord on RentRayda — no connections needed. Try it: [link]"
   Landlord: "Free app for landlords — RentRayda verifies tenants before they connect. It's free. [link]"
7. Show once: store "ceremony_shown_v1" in expo-secure-store

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Approve test user → open app → ceremony appears
3. Share sheet works with pre-filled text
4. Reopen → ceremony does NOT show again
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 21: Push Notifications — 2 Types Only (Day 20)

**Files:** apps/mobile/lib/notifications.ts, apps/api/src/jobs/push-notification.ts, routes/users.ts

```
Read CLAUDE.md, TRD.md Sections 3.8 and 11.

Set up push with EXACTLY two types:
1. "Someone sent a connection request for your listing" → landlord
2. "Your request was accepted! You can now connect." → tenant

Implementation:
1. expo-notifications in apps/mobile
2. FCM config in app.json (Android)
3. POST /api/users/push-token to store in users.pushToken
4. BullMQ job: push-notification
5. Trigger from: connection request + acceptance
6. DO NOT add any other notification type

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Connection request → landlord push on real device
3. Accept → tenant push on real device
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 22: Freshness + Auto-Pause Cron (Day 18)

**Files:** apps/mobile/components/FreshnessIndicator.tsx, apps/api/src/jobs/auto-pause-listings.ts

```
Read CLAUDE.md, TRD.md Section 11.

1. FreshnessIndicator: <24h green, 24-48h green, 3-7d amber, 7-14d amber, 14-30d red
2. BullMQ cron: daily 3AM PHT, lastActiveAt > 30d → SMS warning → auto-pause after 7 more days
3. Update listings.lastActiveAt on landlord actions

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Listings with varying ages show correct labels
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 23: Tab Navigation Setup (Day 19)

**Files:** apps/mobile/app/(tabs)/_layout.tsx, apps/mobile/app/_layout.tsx

```
Read CLAUDE.md, DRD.md Section 1.9.

Set up Expo Router tab navigation (3 tabs per role, NOT 5):
1. Root layout: auth guard (redirect to (auth) if no session)
2. Landlord tabs (3): MyListings | Inbox | Profile
3. Tenant tabs (3): Search | Inbox | Profile
4. Tab bar: h-48dp, bg-white, border-t, NO text labels (icons only)
5. Active: filled icon + 2px blue top-line (#2D79BF)
6. Inactive: outline icon, #65676B
7. tabBarHideOnKeyboard: true
8. Inbox badge: red circle with pending count

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Login as landlord → landlord tabs
3. Login as tenant → tenant tabs
4. Badge count updates
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 24: Profile Screen (Day 19)

**Files:** apps/mobile/app/(tabs)/profile/index.tsx

```
Read CLAUDE.md, DRD.md Screen 17.

1. Profile card: photo 56x56, name, VerifiedBadge (green), role + city
2. Verification status rows (Gov ID, Property/Employment — with re-upload if rejected)
3. Connections count link
4. Settings: Privacy Policy, Terms, About, Logout
5. Logout: confirmation → destroy session → navigate to (auth)

After:
1. pnpm turbo typecheck && pnpm turbo build
2. All verification statuses display correctly
3. Logout works
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 25: Error Handling + Empty States (Day 24)

**Files:** apps/mobile/components/EmptyStateView.tsx, NetworkBanner.tsx, SkeletonCard.tsx

```
Read CLAUDE.md, DRD.md all empty/error/offline states.

1. EmptyStateView: icon + headline + body + CTA (all simple English)
   - Search: "No listings in this area yet."
   - Inbox: "No connection requests yet."
   - Connections: "No connections yet."
2. NetworkBanner: bg-amber-100, WifiOff icon, auto-show/hide via NetInfo
3. SkeletonCard: shimmer, matches ListingCard dimensions
4. Form errors in simple English
5. Retry logic (3 attempts, exponential backoff)

After:
1. pnpm turbo typecheck && pnpm turbo build
2. No white screens, no English-only errors
3. Airplane mode → banner → off → banner hides
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 26: Submitted Screen (Day 22)

**Files:** apps/mobile/app/(onboarding)/submitted.tsx

```
Read CLAUDE.md, DRD.md Screen 10.

Build the verification submitted confirmation screen:
1. Clock icon (lucide: Clock, 48px, text-amber-500, centered, mb-6)
2. Headline: "Na-submit na ang documents mo!" (24px, semibold, text-center)
3. Body: "We're reviewing — usually 24-48 hours. You'll get a notification when approved."
   (16px, text-secondary, text-center, px-8)
4. VerifiedBadge component with status="pending" (preview of what they'll get)
5. Role-based primary CTA (mt-8, w-full, bg-rayda):
   - Tenant: "BROWSE LISTINGS" → navigate to (tabs)/search
   - Landlord: "CREATE A LISTING" → navigate to create-listing
6. Caption: "While waiting, you can already [browse/create]."
7. SafeAreaView, centered layout (flex-1 justify-center items-center px-8)
8. No back button — this is a one-way transition screen

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Complete verification as landlord → shows "CREATE A LISTING" CTA
3. Complete as tenant → shows "BROWSE LISTINGS" CTA
4. VerifiedBadge renders pending state correctly
5. CTA navigates to the correct destination
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 27: Expo Development Build + EAS Configuration (Day 19)

**Files:** apps/mobile/app.json, apps/mobile/eas.json

```
Read CLAUDE.md.

CRITICAL: Expo Go does NOT support custom native modules needed for production.
You MUST configure a development build for testing on real devices.

1. Configure app.json:
   - name: "RentRayda"
   - slug: "rentrayda"
   - scheme: "rentrayda"
   - version: "1.0.0"
   - android.package: "ph.rentrayda.app"
   - android.permissions: ["CAMERA", "NOTIFICATIONS"]
   - android.adaptiveIcon with RentRayda tarsier logo
   - plugins: ["expo-router", "expo-secure-store", "expo-image-picker",
     "expo-notifications"]
   - newArchEnabled: true (SDK 55 default)
   - splash screen config with RentRayda blue (#2D79BF) background

2. Configure eas.json:
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "android": { "buildType": "apk" }
       },
       "preview": {
         "distribution": "internal",
         "android": { "buildType": "apk" }
       },
       "production": {
         "android": { "buildType": "app-bundle" }
       }
     }
   }

3. Run: npx eas build --profile development --platform android
4. Install the APK on a test device
5. Run: npx expo start --dev-client

After:
1. eas.json exists with 3 profiles (development, preview, production)
2. Development APK installs on Android device
3. expo-image-picker camera works (fails in Expo Go)
4. expo-notifications registers push token (fails in Expo Go)
5. Deep linking with rentrayda:// scheme works
```

**Verify:** `npx expo-doctor && npx eas build --profile development --platform android`

---

### PROMPT 28: Web Landing + Listing Browse (Day 19)

**Files:** apps/web/app/page.tsx, listings/page.tsx, listings/[id]/page.tsx

```
Read CLAUDE.md, DRD.md Web Screens 1-2.

Build all web-facing pages:
1. Landing page:
   - Hero with RentRayda tarsier logo + app name + tagline
   - Brand color: #2D79BF for CTAs and accents
   - "Find verified rentals. No scams. No agents." headline
   - 3-step how-it-works: Register → Get Verified → Connect
   - Trust counter from API: "[X] verified na landlord sa Pasig"
   - Anti-scam block differentiating from Lamudi, Rentpad, Facebook
   - Footer: Privacy Policy, Terms, Contact, "Built in the Philippines"
   - "I-download ang app" CTA → Play Store link
2. Listing browse page:
   - Server component with search/filter (barangay, price range, type)
   - ListingCard similar to mobile but full-width on desktop, 2-column on tablet
   - Only verified + active listings
3. Listing detail:
   - Read-only, no connection functionality (app-only feature)
   - OG meta tags: title="[unitType] in [barangay] - ₱[rent]/month | RentRayda"
   - og:image = first listing photo
   - CTA: "I-download ang RentRayda app para mag-connect"
4. next.config.js: output: "standalone" for self-hosting
5. Mobile responsive: single column below 768px, hero CTA full-width

After:
1. pnpm turbo build (Next.js standalone)
2. Landing page loads with trust counter from API
3. Share listing URL in Messenger → OG preview shows correctly
4. Responsive on mobile viewport (Chrome DevTools)
5. Lighthouse: Performance > 90, Accessibility > 90
```

**Verify:** `pnpm turbo build`

---

### PROMPT 29: Admin Metrics Dashboard (Day 23)

**Files:** apps/api/src/routes/admin.ts, apps/web/app/admin/dashboard/page.tsx

```
Read CLAUDE.md, TRD.md Section 3.9.

Build admin metrics dashboard:
API: GET /api/admin/metrics
Returns:
- totalUsers, totalLandlords, totalTenants
- verifiedLandlords, verifiedTenants
- pendingVerifications
- activeListings, draftListings
- totalConnections (this week + all time)
- pendingReports

Web dashboard:
1. Admin auth guard on layout (redirect if not admin)
2. Card grid: each metric is a card with number + label
3. Cards grouped: Users | Listings | Connections | Reports
4. No charts at MVP — just big numbers in cards
5. Refresh button to reload metrics
6. Navigation links to verification queue and report queue

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Numbers match actual DB counts (verify with psql)
3. Non-admin user → redirected to login
4. Admin → sees all metric cards
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build`

---

### PROMPT 30: 3G Performance Optimization (Day 26)

**Files:** Multiple across apps/mobile/

```
Read CLAUDE.md.

Optimize for budget Android on 3G (the reality of BPO worker phones):
1. expo-image everywhere (not RN Image):
   - cachePolicy="memory-disk"
   - placeholder={blurhash} for listing photos
   - contentFit="cover", transition={200}
2. Client-side photo compression: quality 0.6, max 500KB before upload
3. FlashList with estimatedItemSize on ALL lists:
   - ListingSearch: estimatedItemSize={280}
   - Inbox: estimatedItemSize={200}
4. Pagination: 10 items/page, explicit "I-LOAD PA" button (not infinite scroll)
5. Skeleton loading on all list screens
6. Lazy load images below fold
7. Minimize bundle:
   - npx expo export --dump-sourcemap
   - Check tree-shaking: no full lodash imports
   - Target APK under 15MB (Facebook Lite is 1.24MB)
8. Network-aware quality:
   - Detect connection via @react-native-community/netinfo
   - On slow connection: load lower-res thumbnails

Test with Chrome DevTools → Network → Slow 3G throttle:
- Listing search first meaningful paint: under 5 seconds
- Profile screen: under 3 seconds
- OTP screen: under 2 seconds

After:
1. pnpm turbo build
2. Measure load times with throttling — all targets met
3. APK size estimate under 15MB
4. No full-library imports (lodash, moment, etc.)
```

**Verify:** `pnpm turbo build`

---

### PROMPT 31: Production Deploy + Day 30 Checklist (Day 25-30)

**Files:** Dockerfiles, nginx.conf, deploy.yml

```
Read CLAUDE.md, TRD.md Sections 7 and 15.

Deploy:
1. Set all env vars in Coolify
2. Docker images (TRD Dockerfiles)
3. Nginx config (TRD Section 7)
4. SSL via Cloudflare Full Strict
5. Backup cron → R2 (TRD backup script)
6. GitHub Actions CI/CD

DAY 30 CHECKLIST (report PASS/FAIL):
1.  Landlord register with PH phone OTP
2.  Landlord upload gov ID to PRIVATE R2
3.  Landlord upload property proof to PRIVATE R2
4.  Landlord create listing with photos in PUBLIC R2
5.  Admin approve → badge updates
6.  Verified listing appears in search
7.  Tenant register + upload ID + employment proof
8.  Verified tenant search by barangay + price
9.  Verified tenant send connection request
10. Landlord accepts → BOTH phone numbers revealed
11. Phone numbers NOT visible anywhere else
12. Gov IDs accessible ONLY via admin signed URLs
13. Push notifications work (2 types)
14. App works on 3G (search <5s)
15. Scam report submits + appears in admin
16. Production stable 48 hours

Do NOT ship until all 16 PASS.
```

**Verify:** All 16 items PASS

---

### PROMPT 32: App Icon + Splash Screen + App Metadata (Day 27)

**Files:** apps/mobile/assets/, apps/mobile/app.json, apps/mobile/app.config.ts

```
Read CLAUDE.md.

Configure RentRayda app identity and store presence:

1. App icon (RentRayda tarsier logo — provided by founder):
   - Android adaptive icon foreground: 1024×1024 PNG with tarsier silhouette
   - Android adaptive icon background color: "#2D79BF" (RentRayda Blue)
   - iOS icon: 1024×1024 PNG (no transparency, no rounded corners — iOS rounds automatically)
   - Place all in apps/mobile/assets/images/

2. Splash screen:
   - backgroundColor: "#2D79BF"
   - image: White tarsier silhouette on transparent, centered, 200×200
   - resizeMode: "contain"
   - Configure in app.json under "splash" key
   - SplashScreen.preventAutoHideAsync() already in root layout (from Prompt 6 font loading)
   - SplashScreen.hideAsync() triggers after fonts loaded

3. App metadata in app.json:
   - name: "RentRayda"
   - version: "1.0.0"
   - android.versionCode: 1
   - android.package: "ph.rentrayda.app"
   - description: "Find verified rentals near BGC and Pasig. No scams. No agents. Free."

4. OG/sharing metadata (for when app links are shared in Messenger/Viber):
   - expo-linking scheme: "rentrayda"
   - Associate domain for deep linking (future)

After:
1. pnpm turbo typecheck && pnpm turbo build
2. Run dev build → splash screen shows blue bg + white tarsier
3. App icon renders correctly in Android launcher (check both round and square)
4. About screen in Profile tab shows version "1.0.0"
```

**Verify:** `pnpm turbo typecheck && pnpm turbo build` + visual check of icon and splash

---

## PART 4: EMERGENCY PROMPTS

### Debug: User Cannot Receive OTP

```
Read CLAUDE.md. Production issue.
Symptom: User [phone] on [carrier] cannot receive OTP.
Investigate:
1. Check PhilSMS API response for this number
2. Check rate limit: locked out? (3 wrong codes = 15 min lockout)
3. Check users table: does phone exist? Is account suspended?
4. Check PhilSMS credit balance
5. Test sending to a different number on same carrier
6. DO NOT modify production data without my approval
```

### Rollback: Bad Migration

```
Read CLAUDE.md. Bad migration applied to production.
Migration: [filename]. Problem: [description].
1. Create a NEW migration reversing the damage
2. Show me the SQL BEFORE applying
3. Verify no data loss
4. DO NOT edit existing migration files
5. DO NOT apply without my explicit approval
```

### Security: Phone Number Leak Audit

```
Read CLAUDE.md. Audit phone number exposure.
Search ENTIRE codebase:
1. grep all API response objects for "phone"
2. The ONLY endpoint returning phone = GET /api/connections
3. And ONLY where BOTH parties are verified
4. Does any listing endpoint leak landlord phone?
5. Does any profile endpoint leak user phone?
6. Report ALL violations. Do NOT fix — just report.
```

### Debug: Verification Status Not Updating

```
Read CLAUDE.md. Symptom: admin approves but user stays "pending".
1. Check PATCH /admin/verifications/:id handler
2. Does it update BOTH verification_documents.status AND profile.verificationStatus?
3. Landlord: requires BOTH gov ID + property proof approved
4. Tenant: requires BOTH gov ID + employment proof approved
5. Show me the exact SQL Drizzle generates
```

### Expo Build Fails

```
Read CLAUDE.md. EAS Build failing.
Error: [paste error message]
1. Check app.json configuration
2. Check node-linker=hoisted in .npmrc
3. Run: npx expo-doctor
4. Try: npx expo prebuild --clean
5. DO NOT change SDK versions without my approval
```

---

## PART 5: TEN FAILURE MODES

| # | Failure | Problem | Fix |
|---|---|---|---|
| 1 | Kitchen Sink Session | One task pivots to unrelated work | `/clear` between unrelated tasks |
| 2 | Correction Loop | 2+ failed fixes pollute context | `/clear` and rewrite a better prompt |
| 3 | Over-long CLAUDE.md | >300 lines — Claude ignores rules | Keep <300 lines, details in TRD/DRD |
| 4 | Plausible But Wrong | Code looks right, has logic gaps | Always include verify commands |
| 5 | Architecture Drift | New deps, broken conventions | "Do NOT add dependencies without asking" |
| 6 | Context Degradation | Long session, forgets instructions | `/compact` at 60% proactively |
| 7 | Wrong Package | Edits apps/web when you mean mobile | "ONLY modify files in apps/mobile" |
| 8 | Test Disabling | Disables tests instead of fixing | "Fix the test. Do NOT skip/disable it" |
| 9 | Bucket Confusion | Private docs in public bucket | TWO separate functions in r2.ts |
| 10 | Session Type Drift | JWT instead of database sessions | TRD says "Database sessions (NOT JWT)" |

