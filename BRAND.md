# RentRayda Brand Book
Version 2.0 / April 2026

---

## 1. Who We Are

RentRayda is a rental connection app built for the Philippine informal housing market.

We exist because thousands of provincial workers relocate to Metro Manila every year for BPO jobs, and the first thing they face is a broken rental system. Facebook groups full of fake listings. Agents who collect deposits and vanish. Landlords who refuse strangers because they have no way to verify who they are talking to.

RentRayda sits between landlords and tenants. We verify both sides before they ever exchange a phone number. That is the entire product. Not property management. Not payments. Not a social feed. Just trust, then connection.

Our users are real people making real decisions about where to sleep. We treat that seriously.

---

## 2. The Tarsier

Our mascot is a Philippine tarsier. A small, wide-eyed primate found only in the Visayas and Mindanao. It is endemic to the Philippines, which matters because so is this problem.

The tarsier has the largest eyes relative to body size of any mammal. That is the metaphor. RentRayda watches so our users do not have to. Big eyes, small body. Sees everything, threatens nothing.

### Usage Rules

**Hero / Primary:**
- 3D animated version in the hero section (logo PNG with parallax tilt + glow)
- Full lockup with wordmark beneath

**Throughout the page:**
- Small tarsier silhouette as section divider element (SectionDivider variant="tarsier")
- Tarsier head watermark at ~3% opacity as background texture in dark sections
- Tarsier icon in "How It Works" step cards (replacing generic emoji where appropriate)

**Never:**
- Distort, rotate beyond parallax tilt, or recolor outside the approved palette
- Use as a button or interactive element
- Place on busy photographic backgrounds without sufficient contrast

---

## 3. Logo

### The Wordmark

"RentRayda" — one word, capital R and capital R. Set in **Sentient Bold** with `tracking-[0.5px]`. The name is a play on "rent radar" spoken with a Filipino accent.

### Logo Variants

| Variant | Use Case |
|---|---|
| Full lockup (tarsier + wordmark) | Splash screen, web hero, app store listing |
| Icon only (tarsier head) | App icon, favicon, small avatars |
| Wordmark only | Navigation bars, footers, compact spaces |
| Mono white | On dark or photographic backgrounds |
| Mono dark | On light backgrounds when blue is unavailable |

### Clear Space

Maintain a minimum clear space equal to the height of the tarsier's ear around all sides of the logo. No text, icons, or visual elements should intrude on this space.

### Minimum Size

- Full lockup: 120px wide minimum
- Icon only: 32px minimum
- Wordmark only: 80px wide minimum

### Wordmark Consistency (CRITICAL)

The wordmark MUST be rendered identically in every context:
- Font: **Ralgine** (always — no exceptions)
- Letter spacing: **1.5px**
- Line height: **1.1**
- Size: 20px in nav/headers/footers, responsive clamp for hero
- Use the shared `Wordmark` component (`apps/web/components/Wordmark.tsx`)

---

## 4. Typography

RentRayda uses two typefaces. No fallback display fonts, no seasonal swaps, no exceptions.

### Sentient (Display / Heading / Emphasis)

Our primary display and heading font. A warm serif with personality. Used for anything that should command attention, from hero headlines to card titles to the wordmark.

**Use for:**
- The "RentRayda" wordmark
- Hero headlines and section titles (28px+)
- Subheadings (18-24px)
- Card titles and section subtitles
- Testimonial quotes
- Price emphasis
- CTA headlines

**Available weights:** Regular (400), Medium (500), Bold (700)

**Files:** `apps/web/public/fonts/Sentient-Regular.otf`, `Sentient-Medium.otf`, `Sentient-Bold.otf`

### Be Vietnam Pro (Body / UI)

A clean, geometric sans-serif. Excellent legibility on budget Android screens at small sizes. Neutral enough to carry UI text without competing with Ralgine or Sentient.

**Use for:**
- All body text, descriptions, and paragraphs
- Button labels and CTAs
- Form inputs, labels, and helper text
- Navigation items and metadata
- Timestamps, captions, and badges

**Available weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

**Files:** `apps/web/public/fonts/BeVietnamPro-Regular.ttf`, `BeVietnamPro-Medium.ttf`, `BeVietnamPro-SemiBold.ttf`, `BeVietnamPro-Bold.ttf`

### Type Scale

| Level | Size | Font | Weight | CSS Class | Use |
|---|---|---|---|---|---|
| Display | 32-72px | Sentient | 700 | `font-display` | Hero headlines, section titles |
| Headline | 24-36px | Sentient | 700 | `font-display` | Page headings |
| Title | 20px | Sentient | 500 | `font-heading` | Card headers, subheadings |
| Subhead | 18px | Sentient | 400 | `font-heading` | Prices, emphasis, quotes |
| Body | 16px | Be Vietnam Pro | 400 | (default) | Default text |
| Label | 14px | Be Vietnam Pro | 500 | — | Buttons, form labels |
| Caption | 12px | Be Vietnam Pro | 400 | — | Timestamps, helper text |

**Hard rules:**
- Never render text below 12px. Budget Android phones at 720p make anything smaller unreadable.
- Body text is always 16px minimum (WHO mobile readability standard).
- Maximum line length: 45 characters on mobile, 75 on web.

### Tailwind / CSS Classes

```css
.font-display  → font-family: 'Ralgine', serif
.font-heading  → font-family: 'Sentient', serif
body default   → font-family: 'Be Vietnam Pro', sans-serif
```

### DEPRECATED FONTS

The following fonts are **no longer part of the brand**:
- ~~TANNimbus~~ → Replaced by **Sentient**
- ~~NotoSansOsage~~ → Replaced by **Be Vietnam Pro**
- ~~Ralgine~~ → Replaced by **Sentient**
- Font files may remain in `/fonts/` but should NOT be used in new code.

---

## 5. Color Palette

### Primary

| Name | Hex | Usage |
|---|---|---|
| RentRayda Blue | `#2D79BF` | UI brand blue. Primary buttons, links, active states, badges. |
| Blue Dark | `#24628F` | Hover states, pressed buttons, gradient stops. |
| Blue Bright | `#60A5FA` | Accent highlights, gradient endpoints, tag text on dark. |
| Blue Light | `#DBEAFE` | Selected states, light backgrounds, tag fills. |


### Neutral

| Name | Hex | Usage |
|---|---|---|
| Background | `#F0F2F5` | Page background, feed gaps between cards. |
| Surface | `#FFFFFF` | Cards, modals, input backgrounds. |
| Input | `#E4E6EB` | Input fields, toggle inactive backgrounds. |
| Border | `#CED0D4` | Card borders, dividers, separators. |
| Divider | `#DADDE1` | Subtle horizontal rules. |

### Text

| Name | Hex | Usage |
|---|---|---|
| Primary | `#050505` | Headings, body text, primary labels. |
| Secondary | `#65676B` | Metadata, timestamps, secondary labels. |
| Tertiary | `#8A8D91` | Placeholder text, disabled labels. |

### Semantic

| Name | Hex | Usage |
|---|---|---|
| Verified | `#16A34A` | Verified badges, success confirmations. Always green, never brand blue. |
| Verified Light | `#DCFCE7` | Verified badge background. |
| Verified Border | `#86EFAC` | Verified badge border. |
| Danger | `#E41E3F` | Errors, destructive actions, rejected status, scam warnings. |
| Danger Light | `#FEE2E2` | Danger badge/alert background. |
| Warning | `#F7B928` | Pending status, caution messages. |
| Warning Light | `#FEF3C7` | Warning badge/alert background. |

### The Verified Green Rule

The verified badge is the single most important trust signal in the product. It is always green (`#16A34A`). Never brand blue. Never any other color. Green is a universal "safe / approved" signal that works across cultures. When a user sees green on RentRayda, it means one thing: this person has been checked.

### BANNED COLORS

Do **NOT** use these — they appeared in earlier versions and are off-brand:
- `#2B51E3` (old brand blue v1) — use `#2D79BF` instead
- `#2563EB` (Tailwind blue-600) — use `#2D79BF` instead
- `#1D4ED8` (old dark blue) — use `#24628F` instead
- `#31A24C` (old verified green) — use `#16A34A` instead
- Any Tailwind default blue/green that isn't our exact hex

---

## 6. Spacing & Layout System

Inspired by award-winning sites (igloo.inc, Awwwards SOTD). Generous whitespace is premium.

### Fluid Section Spacing

| Variable | Value | Use |
|---|---|---|
| `--space-section` | `clamp(80px, 12vw, 180px)` | Between major sections |
| `--space-section-sm` | `clamp(48px, 8vw, 120px)` | Between minor sections |
| `--space-inner` | `clamp(24px, 4vw, 52px)` | Content inner padding |
| `--space-gutter` | `clamp(16px, 3vw, 28px)` | Page horizontal gutter |

### Layout Widths

| Variable | Value | Use |
|---|---|---|
| `--max-width` | `1120px` | Default content max width |
| `--max-width-narrow` | `720px` | Text-heavy sections |
| `--max-width-wide` | `1280px` | Full-width layouts |

### Utility Classes

| Class | Effect |
|---|---|
| `.section-padding` | Full section spacing (top + bottom + gutter) |
| `.section-padding-sm` | Smaller section spacing |
| `.text-fluid-display` | `clamp(2.5rem, 5vw + 1rem, 4.5rem)` — hero headlines |
| `.text-fluid-headline` | `clamp(1.75rem, 3vw + 0.5rem, 2.75rem)` — section titles |
| `.text-fluid-title` | `clamp(1.25rem, 2vw + 0.25rem, 1.5rem)` — card titles |
| `.text-fluid-body-lg` | `clamp(1rem, 1.2vw + 0.25rem, 1.25rem)` — body large |

### Premium Easing

| Name | Value | Use |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Most animations |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Subtle transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy interactions |

### Border Radius Scale

`8px → 12px → 16px → 20px → 24px → full`

All defined as CSS variables. Cards use `--radius-lg` (16px). Buttons use `--radius-xl` (20px). Badges use `--radius-full`.

---

## 7. Section Dividers

Landing page sections are separated by geometric pattern dividers, not plain lines or empty space.

### Variants

| Variant | Visual | Use Between |
|---|---|---|
| `dots` | 5 dots in a row (center dot larger, brand blue) | Most section transitions |
| `diamonds` | 3 rotated squares with line accents | Stats → content sections |
| `tarsier` | Small tarsier silhouette SVG with line accents | Before/after feature demos |
| `zigzag` | Geometric zigzag line in brand blue at 20% opacity | Dark → light transitions |

### Implementation

Use the `SectionDivider` component (`apps/web/components/SectionDivider.tsx`):
```tsx
<SectionDivider variant="dots" />
```

### Rules
- Every major section transition gets a divider
- Background color changes alone can serve as dividers (no double-divider needed)
- Dividers are decorative — they add rhythm, not information

---

## 7. Brand Patterns & Textures

### Dot Grid Pattern
Subtle dot grid at 2-3% opacity as background texture for white sections:
```css
background-image: radial-gradient(circle, #2D79BF 1px, transparent 1px);
background-size: 32px 32px;
opacity: 0.02;
```

### Tarsier Watermark
Large tarsier silhouette at 3% opacity as background in dark sections. Creates subliminal brand presence without being distracting.

### Hero Particles
Floating dot particles (35 particles, seeded random positions) animated with framer-motion. White at 25% opacity on brand blue background.

---

## 8. Voice and Tone

### Principles

**Direct.** Say what you mean in as few words as possible. Our users are scanning, not reading.

**Warm.** We are not a government form. We are the friend who already lives in the city and knows how things work.

**Protective.** Every piece of copy should reinforce that we are watching out for the user.

**Honest.** If something failed, say it failed. If verification takes 48 hours, say 48 hours.

### Examples

| Context | Do | Do Not |
|---|---|---|
| Verification pending | "We are reviewing your documents. This usually takes 1 to 2 business days." | "Thank you for your patience! Our team is working diligently on your verification." |
| Connection accepted | "You are now connected. Here is their phone number." | "Congratulations! A new connection has been established between you and your match." |
| Error state | "Something went wrong. Try again." | "Oops! An unexpected error occurred. We apologize for the inconvenience." |
| Empty listings | "No listings in this area yet. Check back soon." | "It looks like there are no results matching your search criteria at this time." |
| CTA button | "Get verified" | "Start your verification journey" |

### Language Rules

- Write in English. No Taglish mixing in the product UI (testimonials can use Taglish for authenticity).
- Use "you" and "your" freely.
- Avoid jargon. Say "phone number" not "contact information."
- Keep button text to 3 words or fewer when possible.
- Error messages: what went wrong + what to do about it. Two sentences maximum.

---

## 9. Photography

### Listing Photos

RentRayda deals with real spaces. Bedspaces, shared rooms, small apartments. The photography should be honest.

- Natural lighting. No studio setups or HDR processing.
- Show the actual space. If the room is small, show that it is small.
- Include context: the hallway, the shared bathroom door, the view from the window.
- People in photos should look like they live there, not like they are posing.

We are not selling aspiration. We are selling honesty.

### Demo/Marketing Photos

For landing page demos and marketing materials, use real-looking room photos that represent the ₱3K-15K/month market segment:
- Budget bedspaces with bunk beds
- Small private rooms with single beds
- Studio/apartment interiors
- Metro Manila neighborhood contexts

---

## 10. Testimonials

### Format

Each testimonial includes:
1. **Quote** — In Taglish for authenticity (this is how our users actually speak)
2. **Name** — Realistic Filipino name
3. **Role badge** — "Tenant" or "Landlord"
4. **Context** — Brief location/situation ("BPO worker from Pampanga", "3 bedspaces in Ugong, Pasig")
5. **Avatar** — Initials circle in brand colors (no stock photos)

### Design

- Cards with Sentient font for quotes (adds warmth)
- Be Vietnam Pro for name/role/context
- Opening quote mark in brand blue at 15% opacity
- Subtle border, slight shadow, hover lift animation

---

## 11. The Verified Badge

The heart of the product. Deserves its own section.

### Anatomy

Pill-shaped element containing:
1. A shield-check icon
2. The word "Verified" in 12px text (minimum font size rule)

### Specifications

- Background: `#DCFCE7`
- Border: `1px solid #86EFAC`
- Text color: `#16A34A`
- Icon color: `#16A34A`
- Height: 28px
- Border radius: full (pill)
- Font: Be Vietnam Pro, 12px, semibold

### Rules

- Always green. Never brand blue. Never gray. Never any other color.
- Always contains both icon and text. Icon-only badges are ambiguous at small sizes.
- Not interactive. Status indicator, not a button.
- Unverified users do not get a "not verified" badge. Absence is the signal.

---

## 12. What We Are Not

Brand boundaries. If a feature, design, or copy crosses these lines, stop.

- **Not a payment platform.** No GCash buttons. No "pay rent here." No escrow.
- **Not a broker marketplace.** No agent profiles. No commission structures. No "featured listings" for pay.
- **Not a social network.** No feeds, no likes, no followers, no comments.
- **Not Airbnb.** No star ratings. No reviews. No superhost badges. Verification is binary.
- **Not selling luxury.** Our design should feel clean and trustworthy, not premium or aspirational. Our users earn 15,000 to 30,000 pesos a month. Respect that.

---

## 13. File Reference

| Asset | Location |
|---|---|
| Logo (full lockup) | `apps/web/public/logo.png`, `apps/mobile/assets/images/icon.png` |
| App icon (3D) | `apps/web/public/icon-3d.png` |
| Tarsier 3D scene | `apps/web/public/tarsier-3d.png` |
| Sentient fonts | `apps/web/public/fonts/Sentient-{Regular,Medium,Bold}.otf` |
| Be Vietnam Pro fonts | `apps/web/public/fonts/BeVietnamPro-{Regular,Medium,SemiBold,Bold}.ttf` |
| Design tokens | `packages/ui/tokens.ts` |
| Icon system | `packages/ui/icons/RaydaIcon.tsx` (50+ icons) |
| Tarsier logo SVG | `packages/ui/icons/TarsierLogo.tsx` |
| Wordmark component | `apps/web/components/Wordmark.tsx` |
| Section dividers | `apps/web/components/SectionDivider.tsx` |
| Tailwind theme | `apps/web/app/globals.css` (@theme block) |

### DEPRECATED files (do not use in new code):
| File | Replaced by |
|---|---|
| `TAN-NIMBUS.ttf` | Ralgine |
| `NotoSansOsage-Regular.ttf` | Be Vietnam Pro |
