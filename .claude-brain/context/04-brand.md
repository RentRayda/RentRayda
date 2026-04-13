# Brand & Design

**Source:** DRD.md (full spec)
**This file:** The rules you must follow. Everything else is in DRD.md.

---

## COLORS

### Primary brand color
**`#2B51E3` — RentRayda Blue**

Used for:
- Logo tarsier silhouette
- Primary CTAs
- Active tab states
- Links in body text
- Verified badge backgrounds (NOT the checkmark itself)

### Verified green
**`#16A34A` — Verified Status Green**

Used for:
- Verified badge checkmark only
- "Verified ✓" text
- NEVER use for CTAs or primary elements

**Why two colors:** Green is the universal "approved" signal. Using brand blue for verification would dilute the trust signal. This is non-negotiable.

### Neutrals
- `#1A1A2E` — Primary text on light backgrounds
- `#6B7280` — Secondary text
- `#9CA3AF` — Tertiary text / placeholders
- `#E5E7EB` — Borders, dividers
- `#F9FAFB` — Background tints

### Status colors
- Amber `#D97706` — Pending states (clock icon, "Under review")
- Red `#DC2626` — Errors, rejections, reports
- Green `#16A34A` — Verified state ONLY

---

## ⚠️ BRAND DRIFT TO FIX

Mobile code currently has:
- **306 old font references** using `NotoSansOsage` and `TANNimbus` — replace with `BeVietnamPro-Bold` and `Sentient-Medium`
- **87 old color references** using `#2563EB` (Tailwind blue-600) and an older `#2B51E3` variant — replace with `#2D79BF` per DRD

These are in the Week 1 cleanup list. Do NOT introduce more of them.

---

## TYPOGRAPHY

**Sans-serif:** Be Vietnam Pro
- `BeVietnamPro-Regular` for body
- `BeVietnamPro-Medium` for emphasis
- `BeVietnamPro-Bold` for headlines

**Serif (display):** Sentient
- `Sentient-Medium` for hero headlines
- Used sparingly — branded moments only

**System fallback:** `system-ui, sans-serif`

---

## VOICE & COPY

### The two personas for tone-testing
- **"Dominic"** — accessible, direct, simple English preferred
- **"Miguel"** — values trust signals, skeptical of too-good-to-be-true

If copy confuses either persona, rewrite.

### Rules
1. **Simple English only** in app UI. NOT Taglish. This is deliberate:
   - Taglish ages badly across generations
   - English is aspirational for our BPO target
   - Research quotes preserved in Taglish — app UI in English
2. **Second person** ("You're verified") not third person ("User is verified")
3. **Active voice** ("We'll review your ID") not passive ("Your ID will be reviewed")
4. **Short sentences.** Target grade 6 reading level.
5. **No exclamation marks** except in verification ceremony moments.

### Examples

✓ Good: "Your ID is being reviewed. We'll notify you within 24 hours."
✗ Bad: "Your ID has been submitted for review and you will be notified once the review process has been completed."

✓ Good: "Find verified rentals in Manila."
✗ Bad: "Naghahanap ba kayo ng apartment sa Manila?"

✓ Good: "Add property proof"
✗ Bad: "Magsubmit ng documentasyon"

---

## ICONOGRAPHY

**Library:** `lucide-react-native` (mobile) and `lucide-react` (web)
**Stroke width:** 2px default, 1.5px for small (16px) icons inside badges

Critical icon mappings:
| Context | Icon | Size | Color |
|---------|------|------|-------|
| Verified badge | CheckCircle2 | 16px | `#16A34A` |
| Pending badge | Clock | 16px | `#D97706` |
| Unverified badge | Circle | 16px | `#6B7280` |
| Rejected badge | XCircle | 16px | `#DC2626` |

**⚠️ CURRENT BUG:** Mobile tab icons render as single letters S, H, I, P instead of actual icons. `apps/mobile/app/(tabs)/_layout.tsx` needs to import RaydaIcon. In the Week 1 cleanup list.

---

## LOGO

**Mascot:** Philippine tarsier silhouette
- Why: native to Philippines, symbolizes keen sight (trust through vigilance)
- Used as: app icon, favicon, loading state

**Wordmark:** "RentRayda" in Sentient-Medium with the tarsier to the left

---

## VERIFIED BADGE (the most important component)

This badge appears on every ListingCard, every profile, every connection request, and the reveal screen. Get it right everywhere.

**Container specs:**
- Height: 28px
- Horizontal padding: 8px (`px-2`)
- Vertical padding: 4px (`py-1`)
- Border radius: 14px (full pill via `rounded-full`)
- Border: 1px
- Layout: `flex-row items-center gap-1`

**Content:**
- Icon: 16px
- Label: 11px font-medium

**States:**

| State | Background | Border | Icon | Icon color | Label | Text color |
|-------|------------|--------|------|------------|-------|------------|
| verified | `bg-green-100` | `border-green-300` | CheckCircle2 | `#16A34A` | "Verified ✓" | `#16A34A` |
| pending | `bg-amber-100` | `border-amber-300` | Clock | `#92400E` | "Under review" | `#92400E` |
| unverified | `bg-gray-100` | `border-gray-300` | Circle | `#6B7280` | "Not verified" | `#6B7280` |
| rejected | `bg-red-100` | `border-red-300` | XCircle | `#DC2626` | "Not approved" | `#DC2626` |

**BPO sub-badge** (tenant only, when `employmentType === 'bpo'` AND verified):
- Smaller pill below main badge
- `bg-blue-100 border border-blue-300`
- Icon: Briefcase 12px `#1E40AF`
- Label: "BPO ✓" 10px `#1E40AF`
- Height: 22px

Implemented in `apps/mobile/components/VerifiedBadge.tsx` (115 lines, already done).

---

## MOTION

**Default transition:** 200ms ease-out for opacity/color changes
**Tap feedback:** 100ms scale 0.98 on press
**Verification ceremony:** Spring animation, stiffness 200, damping 15, scale 0 → 1
**No parallax.** No aggressive animations. Android 3G devices must stay smooth.

---

## ACCESSIBILITY

- Minimum tap target: 44×44 pt
- Minimum text size: 14px body, 11px labels
- Color contrast: 4.5:1 for body text, 3:1 for large text
- All verified badges have text labels — NEVER icon-only
- All form errors announce via screen reader
