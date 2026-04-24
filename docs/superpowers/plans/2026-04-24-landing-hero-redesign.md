# Landing Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current centered Hero with an asymmetric tarsier-forward editorial hero that is visually unmistakable vs. Dormy.

**Architecture:** Single-file component rewrite in `apps/web/components/LandingSections.tsx` + one new CSS custom property in `apps/web/app/globals.css` + reuse of the existing `public/tarsier-3d.png` asset. `TwoPathCTA` absorbed into the hero and removed from `app/page.tsx`. All changes scoped to the hero and page mount — no touching other landing sections.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 (`@theme` block in globals.css), framer-motion 10+ (already a dep), next/image, Be Vietnam Pro + Sentient (already wired in `next/font`).

**Spec:** [docs/superpowers/specs/2026-04-24-landing-hero-redesign-design.md](../specs/2026-04-24-landing-hero-redesign-design.md)

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `apps/web/app/globals.css` | Modify (`@theme` block) | Add `--color-hero-warm: #F8F4EC` token |
| `apps/web/components/LandingSections.tsx:34-97` | Replace `Hero` component | New asymmetric layout, tarsier, motion, CTAs |
| `apps/web/app/page.tsx` | Modify import list + JSX | Remove `TwoPathCTA` from render tree |
| `apps/web/public/tarsier-3d.png` | Read-only | Existing asset, used by new Hero via `next/image` |

No new files. The grain SVG overlay is inlined as a data-URL inside the component to avoid an extra HTTP request.

---

## Task 1: Add the warm hero canvas color token

**Files:**
- Modify: `apps/web/app/globals.css` (`@theme` block around line 29)

- [ ] **Step 1.1: Read the current `@theme` block**

Run: `head -50 apps/web/app/globals.css`
Expected: confirm the `--color-warm: #E8DFC8` line exists at line 29.

- [ ] **Step 1.2: Add the new hero canvas token after the existing warm tokens**

Edit `apps/web/app/globals.css`. Find:

```css
  /* Warm accents */
  --color-warm: #E8DFC8;
  --color-warm-text: #6B5B2E;
  --color-warm-muted: #A89875;
```

Replace with:

```css
  /* Warm accents */
  --color-warm: #E8DFC8;
  --color-warm-text: #6B5B2E;
  --color-warm-muted: #A89875;
  --color-hero-warm: #F8F4EC;
```

- [ ] **Step 1.3: Verify the token is picked up by Tailwind**

Run: `cd apps/web && pnpm dev` (if not already running) and open any page in the browser. Open DevTools → Elements → `<html>` → Computed styles. Search for `--color-hero-warm`. Expected: value `#F8F4EC`.

If Tailwind doesn't pick it up, restart the dev server. Tailwind v4 auto-generates utilities from `@theme` tokens, so `bg-hero-warm` should become available automatically.

- [ ] **Step 1.4: Commit**

```bash
git add apps/web/app/globals.css
git commit -m "feat(web): add --color-hero-warm canvas token for landing hero"
```

---

## Task 2: Replace the Hero component

**Files:**
- Modify: `apps/web/components/LandingSections.tsx:34-97` (entire `Hero` function)

The new Hero is a single component. Keep the top-level imports of `motion`, `useInView`, `useRef` — they're already there.

- [ ] **Step 2.1: Verify next/image and next/link are importable in this file**

Run: `grep "next/image\|next/link" apps/web/components/LandingSections.tsx`
Expected: either both are already imported, or nothing. If missing, you will add them in Step 2.2.

- [ ] **Step 2.2: Add imports if needed**

At the top of `apps/web/components/LandingSections.tsx`, below the existing `framer-motion` import, ensure these lines exist:

```tsx
import Image from 'next/image'
import Link from 'next/link'
```

If they're already there, skip.

- [ ] **Step 2.3: Replace the `Hero` function**

Find the existing `// ─── SECTION 1: HERO ───` comment and the entire `export function Hero() { ... }` block (lines 33–97). Replace that block with:

```tsx
// ─── SECTION 1: HERO ───
// Asymmetric tarsier-forward editorial. Spec:
// docs/superpowers/specs/2026-04-24-landing-hero-redesign-design.md
export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Subtle grain overlay — SVG inlined as a data-URL so it does not cost
  // an extra HTTP request. 3% opacity is the spec's warmth-without-dirt threshold.
  const grainStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.03'/></svg>\")",
  } as const

  return (
    <section
      ref={ref}
      style={grainStyle}
      className="relative bg-hero-warm py-24 sm:py-28 md:py-32 motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[45fr_55fr] md:gap-12 md:px-12">
        {/* LEFT — tarsier */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 flex justify-center md:order-none md:justify-start"
        >
          <Image
            src="/tarsier-3d.png"
            alt="Illustration of a Philippine tarsier looking directly at the viewer"
            width={500}
            height={500}
            priority
            className="h-[260px] w-auto sm:h-[320px] md:h-[500px]"
          />
        </motion.div>

        {/* RIGHT — text stack */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="order-2 flex flex-col items-start text-left md:order-none"
        >
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mb-6 text-[40px] font-bold leading-[1.05] tracking-tight text-text-primary md:text-[56px]"
          >
            Verified rentals in Pasig/Ortigas.
            <br />
            Scam-protected. Landlord-safe.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-[520px] text-base leading-[1.6] text-text-secondary md:text-lg"
          >
            For anyone moving to Manila without a kakilala network. Browse free. Pay only if you want our verified placement service.
          </motion.p>

          {/* Trust signals — vertical stack, green checkmarks */}
          <motion.ul
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col gap-3"
          >
            {[
              'Verified landlord IDs (PhilSys-backed)',
              '3 verified matches in 48 hours',
              'Female-only options available',
            ].map((signal) => (
              <li key={signal} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 flex-shrink-0 text-verified"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 00-1.408-1.42l-7.29 7.23-3.3-3.27a1 1 0 10-1.41 1.42l4 3.97a1 1 0 001.41 0l8-7.93z"
                    clipRule="evenodd"
                  />
                </svg>
                {signal}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              href="/listings"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-hero-warm"
            >
              Find a verified place
            </Link>
            <Link
              href="/landlord/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand bg-transparent px-6 text-[15px] font-semibold text-brand transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-hero-warm"
            >
              I&apos;m a landlord
            </Link>
          </motion.div>

          <p className="mt-6 text-xs text-text-tertiary">
            Free to browse. Free for landlords forever.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2.4: Verify dev server still builds**

Run: `cd apps/web && pnpm build` (or just check the running dev server — any compile error shows in terminal).
Expected: no TypeScript errors. If "Cannot find module 'next/image'" or similar, revisit Step 2.2.

- [ ] **Step 2.5: Commit**

```bash
git add apps/web/components/LandingSections.tsx
git commit -m "feat(web): rewrite Hero as tarsier-forward editorial layout"
```

---

## Task 3: Absorb `TwoPathCTA` into the hero by removing it from the page render

The spec decision #2 says the old `TwoPathCTA` section is redundant once the hero carries both CTAs. We remove it from the page render tree but leave the component exported so any orphan reference (tests, storybook, etc.) doesn't break.

**Files:**
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 3.1: Read the current page.tsx**

Run: `cat apps/web/app/page.tsx`
Expected: confirms the import list includes `TwoPathCTA` and the render tree uses it.

- [ ] **Step 3.2: Remove `TwoPathCTA` from the import and the render tree**

Edit `apps/web/app/page.tsx`. Find:

```tsx
import {
  Hero,
  TwoPathCTA,
  WhyWeExist,
  HowItWorks,
  Safety,
  BuiltForMigrants,
  FAQ,
  FinalCTA,
  Footer,
} from '../components/LandingSections';

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <TwoPathCTA />
      <WhyWeExist />
      <HowItWorks />
      <Safety />
      <BuiltForMigrants />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

Replace with:

```tsx
import {
  Hero,
  WhyWeExist,
  HowItWorks,
  Safety,
  BuiltForMigrants,
  FAQ,
  FinalCTA,
  Footer,
} from '../components/LandingSections';

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <WhyWeExist />
      <HowItWorks />
      <Safety />
      <BuiltForMigrants />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3.3: Verify the page still builds**

Run: `cd apps/web && pnpm build 2>&1 | tail -20`
Expected: no errors. If `unused export TwoPathCTA` warning appears, that is fine — the component stays exported by design (spec decision #2 rationale).

- [ ] **Step 3.4: Commit**

```bash
git add apps/web/app/page.tsx
git commit -m "feat(web): absorb TwoPathCTA section into new Hero"
```

---

## Task 4: Visual + accessibility verification

No code changes in this task. This is the **verification-before-completion** gate.

**Files:** None modified.

- [ ] **Step 4.1: Run the dev server**

Run: `cd apps/web && pnpm dev`
Open: http://localhost:3000

- [ ] **Step 4.2: Desktop visual check (≥1280px browser width)**

Confirm all of the following on the landing page:
- Tarsier is on the left, ~500px tall, direct eye contact
- Headline is right-aligned to the left edge of the right column (i.e. `text-left`), NOT centered
- Three green (not brand blue) checkmark trust signals, stacked vertically
- Primary "Find a verified place" CTA in brand blue, secondary "I'm a landlord" outlined
- Section background is warm off-white (`#F8F4EC`), not pure white
- Subtle grain texture visible against the background (zoom in to see)
- No `TwoPathCTA` section renders between Hero and WhyWeExist

- [ ] **Step 4.3: Mobile visual check (375px — iPhone SE in DevTools device toolbar)**

Confirm:
- Tarsier stacks on top at ~260px height, text below
- Headline fits at 40px without breaking awkwardly
- CTAs stack vertically, full width
- Trust signals stay vertical, checkmarks visible

- [ ] **Step 4.4: Keyboard navigation check**

Tab from the top of the page. Confirm:
- Primary CTA receives focus first with a visible focus ring (2px brand blue)
- Secondary CTA receives focus next with a visible focus ring
- Focus rings have 2px offset from the button (`focus-visible:ring-offset-2`) so they're clearly visible against the warm canvas

- [ ] **Step 4.5: Reduced motion check**

In browser DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload the page.
Expected: no fade-up animations. Tarsier and text appear immediately with no motion.

- [ ] **Step 4.6: Contrast check**

Open DevTools → Elements → inspect the `<h1>`. Confirm computed color is `#050505` (`text-text-primary`) on the `#F8F4EC` canvas. Required contrast ≥4.5:1.
Quick mental check: very dark near-black on warm off-white passes AA easily. If you want a formal number, paste both hex values into https://webaim.org/resources/contrastchecker/ — should be ~19:1, well above the 4.5 threshold.

Now check brand blue (`#2D79BF`) on the canvas (the secondary outlined CTA's text). Paste `#2D79BF` on `#F8F4EC` in the contrast checker. Required ≥4.5:1. If it fails (borderline), the spec allows darkening to `--color-brand-dark` (`#24628F`) for CTA text only — apply that fix inline and re-verify.

- [ ] **Step 4.7: Brand-blue surface-area spot check**

Spec rule: brand blue covers <8% of the hero's visible surface. Take a screenshot of the hero at desktop width. Eyeball it — the only brand-blue pixels should be the filled primary CTA, the outline+text of the secondary CTA, and anything inside the tarsier PNG. That's well under 8%. If it looks heavier than expected, investigate what's bleeding blue.

- [ ] **Step 4.8: Commit the verification (no code changes, so this step is informational only)**

No commit needed — no files changed in Task 4. Move on.

---

## Task 5: Run the full suite one more time

**Files:** None modified.

- [ ] **Step 5.1: Typecheck**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: no errors.

- [ ] **Step 5.2: Build**

Run: `cd apps/web && pnpm build 2>&1 | tail -20`
Expected: exits 0, "Compiled successfully" in output.

- [ ] **Step 5.3: Run the project's API tests (unrelated to hero but protects against regressions)**

Run: `cd apps/api && pnpm vitest run 2>&1 | tail -5`
Expected: 30/30 tests pass (the 10 existing + 20 connection-reveal tests from commit 7552901).

- [ ] **Step 5.4: Push**

```bash
git push
```

Expected: 3 commits land (token, hero rewrite, page simplification).

---

## Self-review

**Spec coverage:**
- [x] Asymmetric two-column layout → Task 2 grid template
- [x] Tarsier as left anchor, direct eye contact → Task 2 uses existing tarsier-3d.png with alt text
- [x] Warm canvas #F8F4EC → Task 1 adds token, Task 2 uses `bg-hero-warm`
- [x] Grain overlay 3% opacity → Task 2 inlined data-URL
- [x] Sentient/Be Vietnam Pro typography → `font-display` class preserved, sizes match spec
- [x] Restrained motion, fade-up only → Task 2 removes excess stagger variants, keeps single fade-up
- [x] `prefers-reduced-motion` → Task 2 section className has motion-reduce overrides; Task 4.5 verifies
- [x] Brand blue <8% discipline → CTAs + tarsier only, Task 4.7 verifies
- [x] Verified green for checkmarks → Task 2 uses `text-verified`
- [x] Under-8% brand-blue rule → Task 4.7 spot-check
- [x] Mobile stacked at ≤768px → Task 2 grid-cols-1 default, Task 4.3 verifies
- [x] Tarsier floor 260px at 375px → Task 2 class `h-[260px]`
- [x] CTAs 48px min touch targets → Task 2 `min-h-[48px]`
- [x] Real alt text → Task 2
- [x] `<h1>` single per page → Task 2 uses `<motion.h1>` (still semantic h1)
- [x] Keyboard reachable with focus rings → Task 2 `focus-visible:ring-2`, Task 4.4 verifies
- [x] `TwoPathCTA` absorbed → Task 3 removes from render
- [x] Eye blink motion — **GAP**. Spec calls for a ~9-second eye blink. The existing tarsier-3d.png is a static image — implementing a blink requires either a two-frame sprite swap or an SVG tarsier. **Resolution:** drop the blink from v1 per ship-today fallback in the spec. The illustration dependency is a flagged decision in the spec — static tarsier is acceptable for launch.

**Placeholder scan:** No TBDs, no "implement later", no "similar to Task N". All code blocks are complete and copy-pasteable.

**Type consistency:** All class names match existing Tailwind v4 tokens (`bg-brand`, `text-text-primary`, `text-verified`) or new tokens added in Task 1 (`bg-hero-warm`). No drift.

One inline adjustment from self-review: the spec mentions eye blink, this plan acknowledges it as out-of-scope for v1 and defers. If Miguel wants the blink in v1, he'll tell us and we swap to an SVG tarsier — not in this plan.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-24-landing-hero-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
