# Landing Hero Redesign — Design Spec

**Date:** 2026-04-24
**Owner:** Miguel Ong
**Status:** Design approved, ready for implementation plan
**Target file:** `apps/web/components/LandingSections.tsx` (`Hero` component)

## Why this redesign

The current hero is functionally correct but visually indistinguishable from every other Philippine prop-tech landing page. Competitor Dormy has 35K users to our zero — if we land visitors on a page that looks like them, the comparison collapses to "same product, they're bigger." The redesign's job is a single thing: **be the hero that Dormy literally cannot copy.**

The one asset Dormy cannot replicate is the tarsier. Everything in this spec flows from making the tarsier the structural anchor of the hero, framed by editorial-magazine bones and a warm canvas that signals "home, not marketplace."

Positioning axis is unchanged (trust infrastructure for displaced migrants). Copy is unchanged. This is a visual distinctiveness redesign.

## Design brief

- **Aesthetic direction:** Warm foundation (earth tones) + editorial bones (asymmetric two-column, serif display type, deliberate whitespace) + tarsier-forward (mascot is the emotional focal character, not a logo corner mark).
- **Discipline rule:** brand blue covers less than 8% of the hero's visible surface. Color discipline is what makes editorial design feel editorial instead of busy.
- **Motion rule:** restrained. Editorial reading rooms do not bounce. The only ambient motion is a tarsier eye-blink every ~9 seconds.

## Layout

Asymmetric two-column grid at `≥768px`, stacked at mobile.

```
┌──────────────────────────────┬───────────────────────────────┐
│                              │                               │
│   Tarsier illustration       │   Verified rentals            │
│   (~500px tall desktop,      │   in Pasig/Ortigas.           │
│    320px mobile)             │                               │
│   Direct eye contact with    │   Scam-protected.             │
│   viewer, warm ambient       │   Landlord-safe.              │
│   light                      │                               │
│                              │   [subhead paragraph]         │
│                              │                               │
│                              │   ✓ Verified landlord IDs     │
│                              │   ✓ 3 matches in 48 hours     │
│                              │   ✓ Female-only options       │
│                              │                               │
│                              │   [Find a verified place]     │
│                              │   [I'm a landlord]            │
│                              │                               │
└──────────────────────────────┴───────────────────────────────┘
```

- Left column: 45% of the max-width container. Tarsier is the anchor — confrontational eye contact, National Geographic cover energy.
- Right column: 55% of the max-width container. Text is left-aligned, never centered — left-alignment is the editorial signal.
- Container: max-width 1280px, centered, 96px top+bottom padding, 24px gutter.
- **Mobile (≤768px):** tarsier stacks on top at 320px height, text below. Tarsier never hides. At 375px portrait, tarsier scales down to 260px so the headline stays above the fold.

The current `TwoPathCTA` section is absorbed into the hero — primary and secondary CTAs now live in the hero itself, so the first screen already answers "which path am I on."

## Copy

| Element | Value | Change from current |
|---|---|---|
| Headline | `Verified rentals in Pasig/Ortigas. Scam-protected. Landlord-safe.` | Unchanged |
| Subhead | `For anyone moving to Manila without a kakilala network. Browse free. Pay only if you want our verified placement service.` | Tightened from ~2 long sentences to 2 short ones |
| Trust signals | `Verified landlord IDs (PhilSys-backed)` / `3 verified matches in 48 hours` / `Female-only options available` | Same content, vertical stacking |
| Primary CTA | `Find a verified place` → `/listings` | New (was implicit) |
| Secondary CTA | `I'm a landlord` → `/landlord/signup` | Pulled up from `TwoPathCTA` section |
| Under-CTA note | `Free to browse. Free for landlords forever.` | Trimmed from current longer note |

## Typography

| Element | Font | Weight | Desktop | Mobile | Line height |
|---|---|---|---|---|---|
| Headline | Sentient | 700 | 56px | 40px | 1.05 |
| Subhead | Be Vietnam Pro | 400 | 18px | 16px | 1.6 |
| Trust signals | Be Vietnam Pro | 500 | 14px | 14px | 1.5 |
| CTAs | Be Vietnam Pro | 600 | 15px | 15px | 1 |

All touch targets ≥48px (CLAUDE.md rule preserved). Minimum body type 16px (CLAUDE.md rule preserved).

## Color & canvas

- **Hero background:** `#F8F4EC` (warm off-white, new custom token `bg-hero-warm`). Barely noticeable on its own; unmistakable next to the pure-white dashboard pages.
- **Grain overlay:** SVG noise texture at 3% opacity across the full section. Adds warmth without looking dirty. Generated via feTurbulence in a single inline SVG data-URL, not a loaded asset.
- **Brand blue (`#2D79BF`):** confined to three surfaces — the primary CTA fill, the secondary CTA text/border, and a small iris highlight in the tarsier's eye. Total brand-blue coverage must stay under 8% of the hero's visible surface.
- **Verified green (`#16A34A`):** confined to the three trust-signal checkmarks. Communicates "approved," deliberately not brand color.
- **Text:** primary text `#1A1A2E`, secondary text `#6B7280` (existing tokens, unchanged).

## Tarsier treatment

The tarsier is this redesign's only irreplaceable asset. Get it right.

- **Style:** painterly, not flat-vector. Direct eye contact with viewer. Large natural tarsier eyes do most of the emotional work — let them.
- **Lighting:** warm ambient light from lower-right, so it reads as "evening, home, safe."
- **Ship-today fallback:** if the painterly illustration is not ready at implementation time, use a high-quality silhouette in warm brown (`#8B6F47`) against the beige canvas. Still distinctive, does not block launch.
- **Alt text:** `"Illustration of a Philippine tarsier looking directly at the viewer"` — treat as semantic content, not decorative.
- **Never smaller than 260px** at any breakpoint. The tarsier IS the hero.

## Motion

All motion respects `prefers-reduced-motion`: when set, all of the below is disabled and the hero appears static.

- On scroll-into-view: tarsier fades in over 800ms with an ease-out curve. Text fades up 200ms after, with 50ms stagger between headline, subhead, trust signals, CTAs.
- Tarsier eye blink: once every ~9 seconds, 150ms duration. Subtle enough to register subconsciously, not enough to distract.
- No parallax. No hover effects on the tarsier. CTAs have standard button hover states only.

## Accessibility

- Headline is the page's only `<h1>`.
- Tarsier `<img>` has real alt text (above).
- Brand blue on `#F8F4EC` canvas contrast ratio must be verified ≥4.5:1 before merge.
- Motion respects `prefers-reduced-motion`.
- Both CTAs are real `<a>` elements with proper href targets (not buttons), so keyboard Tab reaches them in order.

## Decisions flagged for review

1. **Dropping center alignment.** The current hero is center-aligned; the new one is asymmetric left-tarsier / right-text. Deliberate editorial signal, but it IS a visual break from existing brand pages.
2. **Absorbing `TwoPathCTA`.** That section becomes redundant once the hero carries both CTAs. It should be removed from `app/page.tsx` when the hero ships.
3. **Tarsier asset dependency.** The painterly illustration does not exist yet. Either commission/generate it, or ship with the brown silhouette fallback and upgrade later. Ship should not be blocked on illustration quality.

## Out of scope

- The other landing sections (`WhyWeExist`, `HowItWorks`, `Safety`, `BuiltForMigrants`, `FAQ`, `FinalCTA`, `Footer`). They may need alignment passes later, but this spec is hero-only.
- Changes to the mobile app's onboarding screens.
- Any copy A/B testing — positioning is locked.
- Any change to the brand token system beyond adding one new color variable (`--color-hero-warm: #F8F4EC`).

## Success criteria

1. A first-time visitor who has also visited Dormy within the past week cannot mistake the two brands.
2. Hero passes WCAG AA contrast at both default and reduced-motion states.
3. Lighthouse mobile performance score does not drop more than 3 points from current hero.
4. All CTAs keyboard-reachable via Tab with visible focus rings.
5. Under-8% brand-blue surface-area rule verified via a screenshot annotation or a quick measurement pass.

## Related

- Brand source: `BRAND.md §1-§5`
- Current hero: `apps/web/components/LandingSections.tsx:34-97`
- Competitor intel: `.claude-brain/decisions/` (Dormy reality memory, 2026-04-17)
