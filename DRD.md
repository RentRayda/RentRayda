# DESIGN REQUIREMENT DOCUMENT (DRD)
# RentRayda — Philippine Informal Rental Marketplace
# Version 1.0 | April 4, 2026
# Canonical stack: Expo SDK 55 | Next.js 16.2 | Hono 4.12 | Drizzle 0.45 | PostgreSQL 16.4
# Audience: Developer (Claude Code in VS Code) + Designer (Figma mockup creation)

---

## 1. DESIGN SYSTEM FOUNDATION

### 1.1 Spacing System (8px Base Grid)

All spacing derives from an 8px base. Internal spacing must never exceed external spacing (padding inside a card < gap between cards).

| Token | px | rem | NativeWind | Tailwind Web | Usage |
|---|---|---|---|---|---|
| `space-0` | 0 | 0 | `p-0` | `p-0` | Reset |
| `space-0.5` | 2 | 0.125 | `p-0.5` | `p-0.5` | Micro adjustments |
| `space-1` | 4 | 0.25 | `p-1` | `p-1` | Icon-to-text gap, badge internal |
| `space-2` | 8 | 0.5 | `p-2` | `p-2` | Compact internal padding |
| `space-3` | 12 | 0.75 | `p-3` | `p-3` | Input field internal padding |
| `space-4` | 16 | 1 | `p-4` | `p-4` | Card padding, standard gap |
| `space-5` | 20 | 1.25 | `p-5` | `p-5` | Section padding |
| `space-6` | 24 | 1.5 | `p-6` | `p-6` | Between card groups |
| `space-8` | 32 | 2 | `p-8` | `p-8` | Major section separators |
| `space-10` | 40 | 2.5 | `p-10` | `p-10` | Screen edge padding (horizontal) |
| `space-12` | 48 | 3 | `p-12` | `p-12` | Touch target minimum height |
| `space-16` | 64 | 4 | `p-16` | `p-16` | Ceremony icon size |

**Screen edge horizontal padding:** `px-4` (16px) on form/onboarding screens. `px-0` for feed cards on Home/Search/Inbox (full-width, Facebook-style — cards span edge-to-edge with no horizontal margin, separated by 8px `#F0F2F5` gaps). Photo galleries and listing photos are always full-bleed.

### 1.2 Touch Targets

Every interactive element: **minimum 48×48dp.** This is non-negotiable — Android accessibility guidelines and WCAG 2.5.8 both require this.

| Element Type | Visual Size | Touch Target | Implementation |
|---|---|---|---|
| Primary CTA button | Full width × 48dp | Same | `h-12 w-full` |
| Icon button | 24×24dp | 48×48dp | `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}` |
| Tab bar item | 24dp icon (no label, Facebook-style) | 48dp height, flex-1 width | `tabBarStyle: { height: 48 }` |
| Checkbox | 20×20dp | 48×48dp | Pressable wrapper `min-h-12 min-w-12` |
| Radio button | 20×20dp | 48×48dp | Same as checkbox |
| Badge (tappable) | 28×auto | 48×48dp | Pressable wrapper with hitSlop |
| List item (tappable) | Full width × auto | min 48dp height | `min-h-12` |
| Text link | Auto | 48dp height | `py-3` padding |

**Thumb zone:** On 5-inch budget Android phones (720×1280), the primary CTA must be in the bottom 40% of the screen. Bottom navigation at 48dp height (Facebook-style, slimmer).

### 1.3 Typography — 2-Font System

RentRayda uses 2 custom fonts, each with a clear role. No Google Fonts. All fonts are bundled locally in `apps/mobile/assets/fonts/` and `apps/web/public/fonts/`.

#### Font Family Assignments

| Font | Family Name (code) | Role | Where Used |
|---|---|---|---|
| **Sentient** | `Sentient` | Brand / display | "rent rayda" wordmark, hero headlines, section titles, screen headers, ceremony text |
| **Be Vietnam Pro** | `BeVietnamPro` | Body / UI | All body text, buttons, form inputs, labels, timestamps, captions, metadata, badges |

#### Typography Scale

| Level | Size | Font Family | Weight | Usage |
|---|---|---|---|---|
| Display | 32px | `Sentient` | 700 (Bold) | Hero headlines, celebration text |
| Headline | 24px | `Sentient` | 600 (SemiBold) | Screen titles, section headers |
| Title | 20px | `Sentient` | 400 (Regular) | Card headers, page names |
| Subhead | 18px | `BeVietnamPro` | 600 (SemiBold) | Price display, emphasis |
| Body | 16px | `BeVietnamPro` | 400 (Regular) | Body text, descriptions, form inputs |
| Label | 14px | `BeVietnamPro` | 500 (Medium) | Buttons, form labels |
| Caption | 12px | `BeVietnamPro` | 400 (Regular) | Timestamps, helper text |
| Micro | 11px | `BeVietnamPro` | 600 (SemiBold) | Badge labels only |

**Rules:**
- Never below 12px on any screen. Budget Android (720p HD+) renders smaller sizes as blurry.
- Body text minimum 16px (WHO mobile readability standard).
- Maximum line length: 45 characters on mobile, 75 on web.
- Filipino words can be long. Test that words like "Verified" and "for rent" do not overflow.
- **React Native:** Use `fontFamily: 'BeVietnamPro-Regular'` etc. Full weight set bundled (Thin through Black + Italics).
- **Web:** Use `fontFamily: 'Be Vietnam Pro'` + `fontWeight`. Sentient available as .otf (Extralight, Light, Regular, Italic, Bold, BoldItalic).

### 1.4 Font Loading and Configuration

**Font files (all bundled locally, no CDN dependency):**

| File | Family Name | Format |
|---|---|---|
| `Sentient-*.otf` (7 weights) | `Sentient` | OpenType |
| `BeVietnamPro-*.ttf` (18 weights) | `BeVietnamPro` | TrueType |

**Available Sentient weights:** Extralight, ExtralightItalic, Light, LightItalic, Regular, Italic, Bold, BoldItalic
**Available Be Vietnam Pro weights:** Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black (+ Italic variants)

**Mobile (Expo SDK 55, expo-font):**

```typescript
// apps/mobile/app/_layout.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Sentient-Regular': require('../assets/fonts/Sentient-Regular.otf'),
    'Sentient-Bold': require('../assets/fonts/Sentient-Bold.otf'),
    'Sentient-Light': require('../assets/fonts/Sentient-Light.otf'),
    'BeVietnamPro-Regular': require('../assets/fonts/BeVietnamPro-Regular.ttf'),
    'BeVietnamPro-Medium': require('../assets/fonts/BeVietnamPro-Medium.ttf'),
    'BeVietnamPro-SemiBold': require('../assets/fonts/BeVietnamPro-SemiBold.ttf'),
    'BeVietnamPro-Bold': require('../assets/fonts/BeVietnamPro-Bold.ttf'),
    // Add more weights as needed
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <LoadingScreen />;
  return <Stack />;
}
```

**Mobile usage (inline styles):**
```typescript
// Brand wordmark
<Text style={{ fontFamily: 'Sentient-Bold', fontSize: 20 }}>rent rayda</Text>

// Screen header
<Text style={{ fontFamily: 'Sentient-Regular', fontSize: 18 }}>Find a listing</Text>

// Button text
<Text style={{ fontFamily: 'BeVietnamPro-SemiBold', fontSize: 16 }}>SEND CODE</Text>

// Body text
<Text style={{ fontFamily: 'BeVietnamPro-Regular', fontSize: 16 }}>Enter your phone number</Text>
```

**Web (Next.js, @font-face in layout.tsx):**
```html
<style>
  @font-face { font-family: 'Sentient'; src: url('/fonts/Sentient-Regular.otf') format('opentype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Sentient'; src: url('/fonts/Sentient-Bold.otf') format('opentype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Be Vietnam Pro'; src: url('/fonts/BeVietnamPro-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Be Vietnam Pro'; src: url('/fonts/BeVietnamPro-Medium.ttf') format('truetype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Be Vietnam Pro'; src: url('/fonts/BeVietnamPro-SemiBold.ttf') format('truetype'); font-weight: 600; font-display: swap; }
  @font-face { font-family: 'Be Vietnam Pro'; src: url('/fonts/BeVietnamPro-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
</style>
<body style="font-family: 'Be Vietnam Pro', system-ui, sans-serif">
```

**Fallback stack:** `'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`

**Budget Android rendering notes:**
- Both fonts render well on HD+ (720p) displays down to 12px
- `textAlignVertical: 'center'` may be needed on Android for vertical alignment in buttons
- Samsung Galaxy A-series and Redmi phones sometimes override font rendering. Test on real devices.
- Splash screen stays visible until fonts load to prevent flash of unstyled text (FOUT)

### 1.5 Color Token System (Facebook-Aligned)

All colors aligned with Facebook's visual language. The target market lives on Facebook — every color choice should feel immediately familiar. WCAG contrast ratios stated against the `#F0F2F5` background.

```
═══ PRIMARY (RentRayda Blue — updated v2) ═══
  rayda:             #2D79BF    contrast 4.5:1 on #F0F2F5    (Brand blue — primary buttons, links, active states)
  rayda-light:       #DBEAFE    contrast 1.2:1 on #F0F2F5    (Badge/card highlight backgrounds)
  rayda-dark:        #24628F    contrast 7.0:1 on #F0F2F5    (Pressed/active states, hover)
  rayda-bright:      #60A5FA    contrast 3.0:1 on #F0F2F5    (Accents, gradient endpoints)
  rayda-gradient:    linear-gradient(135deg, #24628F, #60A5FA) (Splash, covers, hero headers)
  NOTE: #2B51E3 is DEPRECATED (old v1 blue). See BRAND.md §5 for banned colors.

═══ NEUTRAL (Facebook-matched) ═══
  bg:                #F0F2F5    —                             (Facebook's background gray)
  surface:           #FFFFFF    contrast 1.06:1 on #F0F2F5   (Cards, modals, sheets)
  text-primary:      #050505    contrast 16.8:1 on #F0F2F5   (Headings, body — AAA)
  text-secondary:    #65676B    contrast 5.5:1 on #F0F2F5    (Captions, meta — AA)
  text-tertiary:     #8A8D91    contrast 3.4:1 on #F0F2F5    (Placeholders — LARGE AA only)
  text-disabled:     #BCC0C4    contrast 2.0:1 on #F0F2F5    (Disabled — with disabled styling)
  border:            #CED0D4    —                             (Facebook's border/divider)
  border-focus:      #2D79BF    —                             (Input focus ring — matches primary)
  divider:           #DADDE1    —                             (Section dividers, lighter variant)
  input-bg:          #E4E6EB    —                             (Facebook's search bar/input background)
  feed-gap:          #F0F2F5    —                             (8px gap between full-width feed cards)

═══ STATUS ═══
  verified:          #31A24C    (Facebook's green — universal 'verified/approved' signal)
  verified-bg:       #DCFCE7
  verified-border:   #86EFAC
  pending:           #F7B928    contrast 3.1:1 on #F0F2F5    (Facebook's amber — review in progress)
  pending-bg:        #FEF3C7
  pending-border:    #FCD34D
  rejected:          #E41E3F    contrast 5.8:1 on #F0F2F5    (Facebook's red — rejection, danger)
  rejected-bg:       #FEE2E2
  rejected-border:   #FCA5A5
  unverified:        #65676B    (Same as text-secondary)
  unverified-bg:     #E4E6EB
  unverified-border: #CED0D4

═══ SEMANTIC ═══
  warning:           #F7B928    (Caution, pending actions)
  warning-bg:        #FEF3C7
  danger:            #E41E3F    (Errors, scam reports, destructive actions)
  danger-bg:         #FEE2E2
  success:           #31A24C    (Confirmations, positive feedback)
  success-bg:        #DCFCE7
  info:              #2D79BF    (Same as primary — informational callouts)
  info-bg:           #EBF0FC

═══ FRESHNESS ═══
  fresh:             #31A24C    ("Active today" — within 24h)
  recent:            #31A24C    ("Yesterday" — 24-48h)
  aging:             #F7B928    ("3 days ago" / "1 week(s) ago" — 3-14 days)
  stale:             #E41E3F    ("Not active" — 14+ days)
```

**NativeWind tailwind.config.js:**
```javascript
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'rayda': '#2D79BF',
        'fb-bg': '#F0F2F5',
        'fb-input': '#E4E6EB',
        'fb-border': '#CED0D4',
        'fb-text': '#050505',
        'fb-secondary': '#65676B',
        'fb-green': '#31A24C',
        'fb-red': '#E41E3F',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
```

### 1.6 Custom Branded Icon System (RaydaIcon)

**NO emoji icons anywhere in the app.** NO lucide-react-native. All icons are custom SVG components rendered via `react-native-svg`, branded to RentRayda's visual identity. This gives the app a polished, Facebook-grade feel — Facebook never uses emoji for UI elements.

**Library:** `react-native-svg` for rendering. Icon path data lives in `packages/ui/icons/`.
**Design language:** 24×24 viewBox, 2px stroke, rounded caps (`strokeLinecap="round"`), rounded joins (`strokeLinejoin="round"`). Consistent with Facebook's icon weight.
**Color:** Passed via `color` prop. Active: `#2D79BF`. Inactive: `#65676B`. On dark bg: `#FFFFFF`.

**TypeScript Interface:**
```typescript
// packages/ui/icons/RaydaIcon.tsx
type RaydaIconName =
  | 'home' | 'home-filled' | 'search' | 'plus-circle' | 'bell' | 'bell-filled'
  | 'user' | 'user-filled' | 'camera' | 'shield-check' | 'clock' | 'x-circle'
  | 'circle' | 'phone' | 'copy' | 'share' | 'flag' | 'droplet' | 'zap'
  | 'wifi' | 'bath' | 'snowflake' | 'car' | 'arrow-left' | 'chevron-right'
  | 'x' | 'filter' | 'heart' | 'heart-filled' | 'bookmark' | 'bookmark-filled'
  | 'map-pin' | 'building' | 'bed' | 'calendar' | 'peso-sign' | 'image'
  | 'check' | 'info' | 'wifi-off' | 'handshake' | 'edit' | 'menu'
  | 'star' | 'eye' | 'eye-off' | 'send' | 'message-circle';

interface RaydaIconProps {
  name: RaydaIconName;
  size?: number;        // default 24
  color?: string;       // default '#65676B'
  strokeWidth?: number; // default 2 (1.5 for 16px icons in badges)
  filled?: boolean;     // for dual-state icons (heart, bookmark, home, bell)
}
```

**Icon source:** SVG paths initially derived from Lucide's open-source set (ISC license), then customized with rounded terminals and slightly heavier strokes to match Facebook's icon weight. Each icon is a pure function returning SVG path data — no external font or sprite sheet.

**Filled vs outlined (Facebook pattern):** Bottom tab icons use outlined when inactive, filled when active (exactly like Facebook). Icons with `-filled` variants: `home`, `bell`, `heart`, `bookmark`, `user`.

| Context | Icon Name | Size | Color | Notes |
|---|---|---|---|---|
| Verified badge | `shield-check` | 16px | `#31A24C` | strokeWidth 1.5 |
| Pending badge | `clock` | 16px | `#F7B928` | strokeWidth 1.5 |
| Unverified badge | `circle` | 16px | `#65676B` | strokeWidth 1.5 |
| Rejected badge | `x-circle` | 16px | `#E41E3F` | strokeWidth 1.5 |
| Home tab (active) | `home-filled` | 24px | `#2D79BF` | filled variant |
| Home tab (inactive) | `home` | 24px | `#65676B` | outline variant |
| Search tab | `search` | 24px | tab color | |
| Post/Add tab | `plus-circle` | 28px | `#2D79BF` | slightly larger |
| Notifications tab (active) | `bell-filled` | 24px | `#2D79BF` | filled variant |
| Notifications tab (inactive) | `bell` | 24px | `#65676B` | outline variant |
| Profile tab (active) | `user-filled` | 24px | `#2D79BF` | filled variant |
| Profile tab (inactive) | `user` | 24px | `#65676B` | outline variant |
| Camera | `camera` | 24px | `#65676B` | |
| Back arrow | `arrow-left` | 24px | `#050505` | |
| Share | `share` | 24px | `#050505` | |
| Phone call | `phone` | 20px | `#FFFFFF` | on green/blue bg |
| Copy | `copy` | 20px | `#2D79BF` | |
| Report/flag | `flag` | 20px | `#E41E3F` | |
| Save/favorite | `heart` / `heart-filled` | 20px | `#E41E3F` | toggle |
| Bookmark | `bookmark` / `bookmark-filled` | 20px | `#050505` | toggle |
| Water inclusion | `droplet` | 16px | `#65676B` | |
| Electricity | `zap` | 16px | `#65676B` | |
| WiFi | `wifi` | 16px | `#65676B` | |
| Bathroom | `bath` | 16px | `#65676B` | |
| Aircon | `snowflake` | 16px | `#65676B` | |
| Parking | `car` | 16px | `#65676B` | |
| Close/dismiss | `x` | 24px | `#65676B` | |
| Chevron right | `chevron-right` | 20px | `#8A8D91` | |
| Add photo | `plus-circle` | 24px | `#65676B` | |
| Location | `map-pin` | 16px | `#65676B` | |
| Bed count | `bed` | 16px | `#65676B` | |
| Calendar/date | `calendar` | 16px | `#65676B` | |
| Edit | `edit` | 20px | `#2D79BF` | |
| Send message | `send` | 20px | `#FFFFFF` | on blue bg |
| Info | `info` | 20px | `#2D79BF` | |
| No connection | `wifi-off` | 16px | `#F7B928` | offline banner |

### 1.7 Verified Badge Component (Complete Specification)

The most important visual component in the entire app. Appears on every ListingCard, every profile view, every connection request, and the reveal screen.

**Container:** Height 28px, horizontal padding 8px (`px-2`), vertical padding 4px (`py-1`), border-radius 14px (full pill via `rounded-full`), 1px border, `flex-row items-center gap-1`.

**Content:** RaydaIcon 16px (strokeWidth 1.5) + Label 11px (`text-[11px] font-medium`).

| State | BG Class | Border Class | Icon (RaydaIcon) | Icon Color | Label | Text Color |
|---|---|---|---|---|---|---|
| `verified` | `bg-green-100` | `border-green-300` | `shield-check` | `#31A24C` | "Verified" | `#31A24C` |
| `pending` | `bg-amber-100` | `border-amber-300` | `clock` | `#92400E` | "Under review" | `#92400E` |
| `unverified` | `bg-[#E4E6EB]` | `border-[#CED0D4]` | `circle` | `#65676B` | "Not verified" | `#65676B` |
| `rejected` | `bg-red-100` | `border-red-300` | `x-circle` | `#E41E3F` | "Not approved" | `#E41E3F` |

**BPO Sub-badge (tenant only, when `employmentType === 'bpo'` AND `verificationStatus === 'verified'`):**
Additional pill below main badge: `bg-blue-100 border border-blue-300`, `<RaydaIcon name="building" size={12}>` `#1E40AF`, label "BPO Verified" 10px `#1E40AF`. Height 22px.

**TypeScript Interface:**
```typescript
interface VerifiedBadgeProps {
  status: 'verified' | 'pending' | 'unverified' | 'rejected';
  showBpoSubBadge?: boolean;
  size?: 'sm' | 'md'; // sm: 24px height, md: 28px height (default)
  onPress?: () => void; // If provided, wraps in 48×48 Pressable
}
```

**Accessibility:**
```typescript
accessibilityLabel={`Verification status: ${statusLabels[status]}`}
accessibilityRole="text"
// When tappable:
accessibilityRole="button"
accessibilityHint="Tap to view verification details"
```

### 1.8 Skeleton Loading Pattern

Used on every screen that fetches data. Provides visual feedback before content loads.

**Parameters:**
- Base color: `#CED0D4` (border color, Facebook-aligned)
- Highlight color: `#E4E6EB` (input-bg color, Facebook shimmer)
- Animation: Horizontal shimmer gradient, left-to-right, 1.5s duration, infinite repeat
- Library: `react-native-skeleton-placeholder` or custom with `Animated.View`
- Bone border-radius: Match the real content (text = 4px, image = 8px, circle = full)

**Rule:** Skeleton dimensions MUST match real content dimensions. A skeleton for a ListingCard must have the same height as a real ListingCard.

### 1.9 Animation Specifications

**Library:** `react-native-reanimated` v3 for all animations.

| Animation | Trigger | Duration | Easing | Properties |
|---|---|---|---|---|
| OTP shake | Wrong code entered | 300ms | `Easing.bounce` | `translateX: [-5, 5, -5, 5, 0]` |
| Badge appear | Data loads | 200ms | `Easing.out(Easing.ease)` | `opacity: 0→1, scale: 0.8→1` |
| Ceremony shield | Verification approved | 500ms | Spring (stiffness 200, damping 15) | `scale: 0→1` |
| Ceremony bg flash | With shield | 300ms | Linear | `backgroundColor: transparent→#EBF0FC→transparent` |
| Toast slide up | After action | 300ms | `Easing.out(Easing.ease)` | `translateY: 100→0, opacity: 0→1` |
| Toast auto-dismiss | 3s after appear | 300ms | `Easing.in(Easing.ease)` | `translateY: 0→100, opacity: 1→0` |
| Bottom sheet | Tap CTA | 300ms | Spring (stiffness 300, damping 30) | `translateY: screenHeight→0` |
| Card press | Finger down on card | 100ms | Linear | `opacity: 1→0.92` (Facebook-style, no scale) |
| Long press menu | 500ms hold on card | 200ms | Spring (300, 30) | Bottom sheet with Save/Share/Report |
| Pull-to-refresh | Pull gesture | Native | Native | `RefreshControl` component |
| Photo gallery swipe | Horizontal swipe | Native | `ScrollView` pagingEnabled | Native momentum |

### 1.10 Gesture Specifications

| Gesture | Screen | Behavior | Library |
|---|---|---|---|
| **Pull-to-refresh** | Search, Inbox | Native `RefreshControl`, tintColor="#2D79BF" | React Native built-in |
| **Photo gallery swipe** | Listing Detail | Horizontal scroll, `pagingEnabled`, `decelerationRate="fast"`. Snap to center of each photo. Overscroll: bounce on iOS, clamp on Android. | `ScrollView` |
| **Bottom sheet drag** | Connection Request Modal | Snap points: 40% (default), 0% (dismissed). Velocity threshold: >500px/s downward = dismiss. Handle bar: 4px × 40px, `#D1D5DB`, centered, `mt-2`. | `@gorhom/bottom-sheet` |
| **Card press** | ListingCard | `Pressable` with `onPressIn` → scale 0.98 (100ms), `onPressOut` → scale 1.0 (100ms). Cancel on pan (user scrolling, not tapping). | `react-native-reanimated` |
| **Swipe back** | All non-root screens | iOS: native edge swipe (Expo Router default). Android: hardware back button (see §1.12 back button table). | Expo Router |
| **Long press** | Listing photo in gallery | Open full-screen lightbox (future, not MVP). At MVP: no long press behavior. | N/A at MVP |

### 1.11 Dark Mode

**MVP: Light mode only.** Dark mode is explicitly excluded from the 30-day build scope. Reason: doubling the design surface for 18 screens is not justified at launch. The color token system in §1.5 is designed to support a dark mode extension later by adding `dark:` variants to each token.

When dark mode is added post-MVP: `bg` becomes `#121212`, `surface` becomes `#1E1E1E`, `text-primary` becomes `#E5E7EB`, and the brand blue `#2D79BF` lightens to `#5B7FFF` for sufficient contrast on dark backgrounds.

### 1.12 Navigation Structure (Facebook-Style)

**Top Header Bar (persistent on all tab screens)**

Height: 48dp. Background: `#FFFFFF`. Bottom border: 1px `#CED0D4`. Fixed position.

```
┌──────────────────────────────────────┐
│ RentRayda        [search]   [bell]  │   Logo left (20px text or 24px icon)
│                  (24px)    (24px)    │   Search + notification icons right
└──────────────────────────────────────┘   Bell has red dot when unread
```

- Logo: "RentRayda" in `text-xl font-bold text-[#2D79BF]`, or tarsier icon 24px
- Search icon: `<RaydaIcon name="search" size={24} color="#050505" />` — navigates to search/filter overlay
- Bell icon: `<RaydaIcon name="bell" size={24} color="#050505" />` — navigates to inbox
- Notification dot: 10px red circle (`#E41E3F`), absolute top-0 right-0 of bell icon. Hidden when count = 0.

**Mobile — Bottom Tab Bar (Facebook-style, Expo Router `(tabs)` layout)**

Tab bar height: 48dp. Background: `#FFFFFF`. Top border: 1px `#CED0D4`. `tabBarHideOnKeyboard: true`.

**NO text labels on tabs** — icons only. Active tab indicated by a thin 2px blue line at the TOP of the tab (not a pill behind the icon).

```
TENANT TABS (3):
┌──────────┬──────────┬──────────┐
│ ═══      │          │          │   ═══ = 2px blue top-line on active
│ [search] │  [bell]  │  [user]  │   All icons 24px
│          │          │          │
└──────────┴──────────┴──────────┘
  Search     Inbox     Profile

LANDLORD TABS (3):
┌──────────┬──────────┬──────────┐
│ ═══      │          │          │
│ [home]   │  [bell]  │  [user]  │
│          │          │          │
└──────────┴──────────┴──────────┘
 MyListings  Inbox     Profile
```

- Active tab: `<RaydaIcon name="[icon]-filled" color="#2D79BF" />` + 2px top-line (`border-t-2 border-[#2D79BF]`)
- Inactive tab: `<RaydaIcon name="[icon]" color="#65676B" />` (outline variant)
- Inbox badge: Red circle (10px diameter, -2px top, -2px right of bell icon), white text (8px), shows count of pending requests. Hides when count = 0.
- Tab press feedback: No animation — instant color swap
- Listing creation accessed from MyListings tab (landlord), not a center tab

**Screen hierarchy:**
```
Root (_layout.tsx)
├── (auth)/           # Unauthenticated screens
│   ├── phone.tsx     # Screen 1: PhoneEntry
│   ├── otp.tsx       # Screen 2: OTPVerify
│   ├── role.tsx      # Screen 3: RoleSelection
│   ├── email.tsx     # Email collection (for magic link / passkey)
│   └── passkey-setup.tsx  # Passkey enrollment (optional)
├── (onboarding)/     # Post-auth, pre-main
│   ├── landlord-profile.tsx   # Screen 4
│   ├── tenant-profile.tsx     # Screen 8
│   ├── verify-id.tsx          # Screen 5
│   ├── property-proof.tsx     # Screen 6 (landlord only)
│   ├── employment-proof.tsx   # Screen 9 (tenant only)
│   ├── submitted.tsx          # Screen 10
│   └── verified.tsx           # Screen 11 (ceremony)
├── (tabs)/           # Main authenticated experience (3 tabs per role)
│   ├── search/       # Tenant: tab 1 (Search)
│   │   ├── index.tsx          # Screen 12: ListingSearch
│   │   └── [id].tsx           # Screen 13: ListingDetail
│   ├── listings/     # Landlord: tab 1 (MyListings)
│   │   └── index.tsx          # Landlord's own listings + create
│   ├── inbox/        # Both roles: tab 2 (Inbox) — has badge for pending count
│   │   └── index.tsx          # Screen 15: LandlordInbox / TenantSentRequests
│   └── profile/      # Both roles: tab 3 (Profile)
│       └── index.tsx          # Screen 17: Profile
├── connections/
│   └── reveal.tsx             # Screen 16: ConnectionReveal
└── report.tsx                 # Screen 18: ScamReport (modal)
```

**Android back button behavior per screen:**

| Screen | Back Button Action |
|---|---|
| PhoneEntry | Exit app (root screen) |
| OTPVerify | Return to PhoneEntry (confirmation dialog: "Are you sure?") |
| RoleSelection | Return to OTPVerify (re-verify needed) |
| Profile creation | Warning: "Your profile has not been saved yet. Go back anyway?" |
| Verify ID / Property / Employment | Skip step (same as "skip for now" button) |
| Submitted | Navigate to main tabs |
| Ceremony | Navigate to main tabs |
| Tab screens | Standard tab switching / exit on double-tap from first tab |
| ListingDetail | Back to search results |
| ConnectionReveal | Back to inbox |
| Report (modal) | Close modal |

---

## 2. MOBILE SCREEN SPECIFICATIONS (18 Screens)

Every screen below includes: ASCII wireframe, component tree, 7-state table, key TypeScript interfaces, and Android-specific notes.

**The 7 states for every screen:**
1. **Default** — Normal state with data loaded
2. **Loading** — Data being fetched (skeleton or spinner)
3. **Error** — API call failed or validation failed
4. **Empty** — No data available (search with no results, inbox with no requests)
5. **Offline** — No internet connection
6. **Submitting** — Form being submitted (CTA shows spinner)
7. **Success** — Action completed (toast, animation, or navigation)

---

### SCREEN 1: PhoneEntryScreen

**Route:** `apps/mobile/app/(auth)/phone.tsx`
**Purpose:** Entry point for ALL users. First impression of the app.
**Expo-specific:** `KeyboardAvoidingView` with `behavior="padding"` on iOS, `behavior="height"` on Android. Set `android.softwareKeyboardLayoutMode: "resize"` in app.json.

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│         [Status Bar]         │
│                              │
│                              │
│      ┌──────────────┐        │
│      │  APP LOGO    │        │  64×64, centered, mb-8
│      │  (64×64)     │        │
│      └──────────────┘        │
│                              │
│    "Sign up or      │  Headline (24px, semibold)
│     log in"                   │  text-center
│                              │
│   "Enter your phone number   │  Body (16px, text-secondary)
│    to get started."       │  text-center, mb-8
│                              │
│   ┌──────────────────────┐   │
│   │ +63 │ 9XX XXX XXXX   │   │  Input: h-12, border border-gray-300
│   └──────────────────────┘   │  rounded-lg, prefix "+63" in bg-gray-100
│                              │  keyboardType="phone-pad"
│   ┌──────────────────────┐   │  maxLength=10
│   │   SEND CODE  │   │  
│   └──────────────────────┘   │  Primary CTA: h-12, bg-rayda
│                              │  text-white, font-semibold, rounded-lg
│   "It's free. No fees.  │  w-full, items-center justify-center
│    No credit card needed."      │  
│                              │  Caption (12px, text-secondary)
│                              │  text-center, mt-4
└──────────────────────────────┘
```

**Component Tree:**
```
PhoneEntryScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   └── KeyboardAvoidingView (behavior per platform)
│       └── View (className="flex-1 justify-center items-center px-5")
│           ├── Image (source={logo}, className="w-16 h-16 mb-8")
│           ├── Text (className="text-2xl font-semibold text-[#050505] text-center")
│           │   "Sign up or log in"
│           ├── Text (className="text-base text-[#65676B] text-center mb-8")
│           │   "Enter your phone number to get started."
│           ├── PhoneInput (custom component)
│           │   └── View (className="flex-row border border-gray-300 rounded-lg h-12 overflow-hidden")
│           │       ├── View (className="bg-gray-100 px-3 justify-center")
│           │       │   └── Text (className="text-sm text-gray-500") "+63"
│           │       └── TextInput (className="flex-1 px-3 text-base"
│           │           keyboardType="phone-pad" maxLength={10}
│           │           placeholder="9XX XXX XXXX" placeholderTextColor="#9CA3AF")
│           ├── Pressable (className="mt-4 w-full h-12 bg-rayda rounded-lg items-center justify-center"
│           │   disabled={!isValid || isLoading})
│           │   ├── [if loading] ActivityIndicator (size="small" color="#FFFFFF")
│           │   └── [if not loading] Text (className="text-white font-semibold text-base")
│           │       "SEND CODE"
│           └── Text (className="text-xs text-[#65676B] text-center mt-4")
│               "It's free. No fees. No credit card needed."
└── StatusBar (style="dark")
```

**7 States:**

| # | State | Visual Change | CTA State |
|---|---|---|---|
| 1 | **Default** | Empty phone field, cursor blinking | Disabled (opacity-50) |
| 2 | **Loading** | Phone field disabled, no cursor | Spinner replaces text, disabled |
| 3 | **Error — Invalid Number** | Input border turns `border-red-500`. Below input: `Text "Invalid number. Must start with 09." text-xs text-red-600 mt-1` | Disabled |
| 4 | **Error — Rate Limit** | Full-screen modal overlay: "Too many codes sent. Try again in 1 hour." with dismiss button | Hidden behind modal |
| 5 | **Offline** | Top banner: `View bg-amber-100 px-4 py-2 flex-row items-center gap-2` with `RaydaIcon name="wifi-off"` 16px + `Text "No internet. Check your connection." text-sm text-amber-800` | Disabled |
| 6 | **Submitting** | Phone field disabled, CTA shows `ActivityIndicator` | Spinner, disabled |
| 7 | **Success** | Auto-navigate to OTPVerify screen (no visible success state on this screen) | N/A |

**Input Validation:**
- Must start with `9` (user types 9XXXXXXXXX, system prepends +63)
- Exactly 10 digits
- Strip spaces, dashes, parentheses
- Display format while typing: no auto-formatting (keep raw digits for simplicity on budget Android keyboards)
- Regex: `/^9\d{9}$/`
- CTA enables only when regex passes

**TypeScript:**
```typescript
// No external props — this is a root screen
// Internal state:
const [phone, setPhone] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [isOffline, setIsOffline] = useState(false);
const isValid = /^9\d{9}$/.test(phone);
```

---

### SCREEN 2: OTPVerifyScreen

**Route:** `apps/mobile/app/(auth)/otp.tsx`
**Receives:** `phone` param from PhoneEntry

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Verify your code"     │  Header: ArrowLeft 24px + Title
│                              │
│   "We sent a 6-     │  Body (16px)
│    digit code to             │
│    +63 9XX XXX XXXX"        │  Phone bold (font-semibold)
│                              │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │
│   │  │ │  │ │  │ │  │ │  │ │  │ │  6 boxes, 48×48 each
│   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ │  gap-2 (8px)
│                              │  Auto-advance on digit entry
│   ┌──────────────────────┐   │  Auto-submit on 6th digit
│   │     VERIFY         │   │
│   └──────────────────────┘   │  CTA: disabled until 6 digits
│                              │
│   "Didn't receive it?         │  Text button, hidden first 60s
│    Resend code" (45s)  │  Countdown: "(45s)" in gray
│                              │
│   ⏱ 9:42                    │  OTP expiry countdown (10 min)
│                              │  text-xs text-secondary
└──────────────────────────────┘
```

**Component Tree:**
```
OTPVerifyScreen
├── SafeAreaView
│   ├── Header (back arrow + title)
│   ├── ScrollView (keyboardShouldPersistTaps="handled")
│   │   ├── Text (body — "We sent a code...")
│   │   ├── Text (phone number — bold)
│   │   ├── OTPInput (custom component)
│   │   │   └── View (className="flex-row justify-center gap-2 my-8")
│   │   │       └── [6x] TextInput (className="w-12 h-12 border border-gray-300 rounded-lg
│   │   │           text-center text-xl font-semibold" keyboardType="number-pad"
│   │   │           maxLength={1} ref={refs[i]} autoFocus={i===0}
│   │   │           onChangeText → auto-advance to next input)
│   │   ├── Pressable (CTA — same as PhoneEntry pattern)
│   │   ├── ResendButton (conditional visibility)
│   │   │   └── Pressable (className="mt-6 py-3" disabled={resendCooldown > 0})
│   │   │       └── Text "Didn't receive it? Resend code (Xs)"
│   │   └── Text (expiry countdown — "9:42" format)
```

**7 States:**

| # | State | Visual Change |
|---|---|---|
| 1 | **Default** | First input focused, cursor blinking, CTA disabled |
| 2 | **Loading** | All inputs disabled, CTA shows spinner |
| 3 | **Error — Wrong Code** | All inputs get `border-red-500`. Shake animation (translateX ±5px, 300ms). Below inputs: "Wrong code. [X] attempts left." text-red-600. Clear all inputs after 1s. |
| 4 | **Error — Expired** | All inputs cleared. "Code expired. Request a new one." text-amber-700. Resend button becomes prominent (bg-rayda text-white). |
| 5 | **Offline** | Same top banner as PhoneEntry. Inputs disabled. |
| 6 | **Submitting** | After auto-submit on 6th digit. Inputs disabled, CTA spinner. |
| 7 | **Success** | Green `RaydaIcon name="shield-check"` (48px) appears center, scale 0→1 over 300ms. Auto-navigate to RoleSelection after 500ms. |

**Error — Locked Out (after 3 wrong codes):** Full-screen overlay: "Account temporarily locked. Try again in 15 minutes." All inputs disabled. No resend button. Timer shows minutes remaining.

---

### SCREEN 3: RoleSelectionScreen

**Route:** `apps/mobile/app/(auth)/role.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│                              │
│   "What are you looking for?"       │  Headline, center
│                              │
│   ┌──────────────────────┐   │
│   │  [home icon, 32px]    │   │  Card: h-[120], border-2
│   │  "I'm renting out a place"    │   │  rounded-xl, p-4
│   │  "I have a unit     │   │  unselected: border-[#CED0D4]
│   │   for rent"      │   │  selected: border-rayda, bg-[#EBF0FC]
│   └──────────────────────┘   │  + RaydaIcon shield-check top-right
│              gap-4           │
│   ┌──────────────────────┐   │
│   │  [search icon, 32px] │   │  Same card pattern
│   │  "Looking for a      │   │
│   │   rental"           │   │
│   │  "I want to find │   │
│   │   an apartment or room" │   │
│   └──────────────────────┘   │
│                              │
│   ┌──────────────────────┐   │
│   │     CONTINUE       │   │  CTA: disabled until selection
│   └──────────────────────┘   │
└──────────────────────────────┘
```

**Component Tree:**
```
RoleSelectionScreen
├── SafeAreaView
│   └── View (className="flex-1 justify-center px-5")
│       ├── Text (headline)
│       ├── Pressable (landlord card — onPress → setRole('landlord'))
│       │   ├── RaydaIcon (name="home" or "search", size={32})
│       │   ├── Text (title — "I'm renting out a place")
│       │   ├── Text (description — caption)
│       │   └── [if selected] RaydaIcon name="shield-check" (absolute top-3 right-3, color rayda)
│       ├── Pressable (tenant card — same pattern)
│       └── Pressable (CTA)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Both cards unselected (border-gray-200), CTA disabled |
| 2 | **Loading** | N/A (no data fetch on this screen) |
| 3 | **Error** | Toast: "Something went wrong. Try again." (API failure on role assignment) |
| 4 | **Empty** | N/A |
| 5 | **Offline** | Top banner + CTA disabled |
| 6 | **Submitting** | CTA spinner, cards disabled |
| 7 | **Success** | Auto-navigate to landlord-profile or tenant-profile |

---

### SCREEN 4: LandlordProfileScreen

**Route:** `apps/mobile/app/(onboarding)/landlord-profile.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Set up your profile"  │
│                              │
│        ┌────────┐            │  80×80 circle
│        │ SELFIE │            │  Camera icon overlay (32px, bottom-right)
│        │[camera]│            │  bg-gray-200 placeholder
│        └────────┘            │  Tap → expo-image-picker
│   "Tap to take a selfie"   │  Caption, text-center
│                              │
│   Full name *                 │  Label (14px, font-medium)
│   ┌──────────────────────┐   │  TextInput h-12, border-gray-300
│   │                      │   │  placeholder="Juan Dela Cruz"
│   └──────────────────────┘   │
│                              │
│   City *                  │  
│   ┌──────────────────────┐   │  Dropdown/Picker
│   │  ▾ Pasig             │   │  Default: Pasig
│   └──────────────────────┘   │  Options: Pasig, Mandaluyong
│                              │
│   Barangay *                 │
│   ┌──────────────────────┐   │  Dropdown with LAUNCH_BARANGAYS
│   │  ▾ Select barangay│   │  from constants.ts
│   └──────────────────────┘   │
│                              │
│   How many units?  *             │
│   ┌──┐                      │  Stepper: [-] [count] [+]
│   │ 1│ [-]  [+]             │  min 1, max 50
│   └──┘                      │
│                              │
│   ┌──────────────────────┐   │
│   │    SAVE PROFILE│   │  CTA: enabled when name + barangay filled
│   └──────────────────────┘   │
└──────────────────────────────┘
```

**Component Tree:**
```
LandlordProfileScreen
├── SafeAreaView
│   └── ScrollView (keyboardShouldPersistTaps="handled")
│       ├── Header (back + title)
│       ├── PhotoPicker
│       │   └── Pressable (className="self-center mb-6")
│       │       ├── View (className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center overflow-hidden")
│       │       │   ├── [no photo] Camera icon (32px, gray)
│       │       │   └── [has photo] Image (className="w-20 h-20", expo-image)
│       │       └── View (camera badge, absolute bottom-0 right-0, bg-rayda rounded-full w-7 h-7)
│       │           └── Camera icon (16px, white)
│       ├── Text (caption — "Tap to take a selfie")
│       ├── FormField (label="Full name" required)
│       │   └── TextInput (h-12, border, rounded-lg)
│       ├── FormField (label="City" required)
│       │   └── Picker/Dropdown
│       ├── FormField (label="Barangay" required)
│       │   └── Picker/Dropdown (LAUNCH_BARANGAYS + "Other")
│       ├── FormField (label="How many units?" required)
│       │   └── Stepper component
│       └── Pressable (CTA, mx-5 mb-8)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Empty form, photo placeholder, CTA disabled (opacity-50) |
| 2 | **Loading** | N/A (no initial data fetch for new profile) |
| 3 | **Error — Photo Upload** | Photo circle shows red border + XCircle overlay. Below: "Photo upload failed. Try again?" tappable. |
| 4 | **Empty** | N/A |
| 5 | **Offline** | Top banner. Form can be filled but CTA says "Save offline" and saves locally (sync when connected). |
| 6 | **Submitting** | CTA spinner, form inputs disabled |
| 7 | **Success** | Auto-navigate to verify-id screen |

**Photo Capture Config:**
```typescript
const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ['images'],    // SDK 55 string array format
  allowsEditing: true,       // Crop to square
  aspect: [1, 1],
  quality: 0.7,              // Compress for 3G
});
// Upload to PUBLIC R2 bucket: profile-photos/{userId}/avatar.jpg
```

---

### SCREEN 5: GovernmentIDUploadScreen

**Route:** `apps/mobile/app/(onboarding)/verify-id.tsx`
**Used by:** Both landlords AND tenants (same screen, different navigation context)

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Verify your ID"    │
│                              │
│  Step 1 of 3  ████░░░░░░░░  │  Progress bar: 33% for landlord
│                              │  (ID → property → listing)
│  ┌────────────────────────┐  │  Step X of Y for tenant
│  │ [info] Why is this needed?    │  │  (ID → employment)
│  │ "To confirm you are the    │  │
│  │  real person who     │  │  Expandable card: bg-blue-50
│  │  registered. We will   │  │  rounded-lg, p-4
│  │  never show your ID   │  │  Tap to expand/collapse
│  │  to anyone else."              │  │
│  └────────────────────────┘  │
│                              │
│  What type of ID? *         │  Label
│  ┌────────────────────────┐  │
│  │ ○ PhilSys National ID  │  │  Radio list: each item h-12
│  │ ○ UMID                 │  │  touch target 48dp
│  │ ○ Driver's License     │  │
│  │ ○ Passport             │  │  Values from ID_TYPES constant
│  │ ○ Voter's ID           │  │
│  │ ○ Other...            │  │
│  └────────────────────────┘  │
│                              │
│  ☐ I agree to store  │  PDPA consent checkbox
│    my government ID   │  MUST be checked before camera
│    for verification.     │  activates. Required.
│    Read the Privacy       │  "Privacy Policy" is a link
│    Policy.                   │  (text-rayda, underline)
│                              │
│  ┌────────────────────────┐  │  
│  │  [camera] TAKE PHOTO OF ID  │  │  CTA 1: disabled until
│  └────────────────────────┘  │  consent checked + ID type selected
│                              │  Opens back camera
│  ┌────────────────────────┐  │
│  │  [camera] TAKE SELFIE        │  │  CTA 2: hidden until ID captured
│  └────────────────────────┘  │  Opens front camera
│                              │
│  ┌────────────────────────┐  │
│  │   ▶ Upload Progress    │  │  Hidden until both captured
│  │   ████████░░░░ 65%     │  │  Shows during R2 upload
│  └────────────────────────┘  │
│                              │
│  "Skip for now — i-verify    │  TextButton: text-sm text-secondary
│   later"                  │  underline
└──────────────────────────────┘
```

**Component Tree:**
```
GovernmentIDUploadScreen
├── SafeAreaView
│   └── ScrollView
│       ├── Header (back + title)
│       ├── ProgressBar (step X of Y)
│       ├── InfoCard (expandable — "Why is this needed?")
│       ├── RadioGroup (ID types from ID_TYPES constant)
│       │   └── [for each type] Pressable (className="flex-row items-center h-12 gap-3")
│       │       ├── RadioCircle (20px, selected=filled rayda, unselected=border-gray-300)
│       │       └── Text (label, text-base)
│       ├── ConsentCheckbox
│       │   └── Pressable (className="flex-row items-start gap-3 mt-4")
│       │       ├── Checkbox (20px, checked=bg-rayda with Check icon white)
│       │       └── Text (consent text with Privacy Policy link)
│       ├── Pressable (CTA 1 — "TAKE PHOTO OF ID")
│       │   disabled={!consentChecked || !idType}
│       ├── [if idCaptured] PhotoPreview
│       │   └── View (className="flex-row gap-4 my-4")
│       │       ├── Image (ID preview, 120×80, rounded-lg, blurred slightly)
│       │       └── Pressable ("Retake" — retake button)
│       ├── [if idCaptured] Pressable (CTA 2 — "TAKE SELFIE")
│       ├── [if selfieCaptured] PhotoPreview (selfie, 80×80 circle)
│       ├── [if uploading] UploadProgress
│       │   └── View (className="bg-gray-100 rounded-full h-2 mt-4")
│       │       └── View (className="bg-rayda h-2 rounded-full" style={{width: `${progress}%`}})
│       └── Pressable (skip — "Skip for now")
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Radio list visible, consent unchecked, both CTAs disabled |
| 2 | **Loading** | N/A (no initial fetch) |
| 3 | **Error — Camera Denied** | Modal: "Camera permission needed to take a photo of your ID. Enable it in Settings." with "Open Settings" button |
| 4 | **Error — Upload Failed** | Photo preview shows red border. "Upload failed. Try again?" tappable retry. |
| 5 | **Offline** | Top banner. Camera still works (photos saved locally). Upload queued for when connected. |
| 6 | **Submitting** | Progress bar animating, both CTAs disabled, "Uploading..." text |
| 7 | **Success** | Both uploaded. Screen transforms to confirmation: ✓ icon + "Uploaded! Under review — 24-48 hours." + "CONTINUE" button navigating to next step. |

**Camera Config:**
```typescript
// ID Photo (back camera)
const idResult = await ImagePicker.launchCameraAsync({
  mediaTypes: ['images'],
  quality: 0.8,              // Higher quality for ID readability
  allowsEditing: false,      // Don't crop — admin needs to see full ID
});
// Upload to PRIVATE R2 bucket: verification-docs/{userId}/gov_id/{uuid}.jpg

// Selfie (front camera)
const selfieResult = await ImagePicker.launchCameraAsync({
  mediaTypes: ['images'],
  quality: 0.7,
  allowsEditing: true,
  aspect: [1, 1],
  cameraType: ImagePicker.CameraType.front,
});
// Upload to PRIVATE R2 bucket: verification-docs/{userId}/selfie/{uuid}.jpg
```

**PDPA consent timestamp:** Stored in `verification_documents.consent_at` as ISO timestamp of the moment checkbox was checked. This is a legal requirement under RA 10173.

---

### SCREEN 6: PropertyProofUploadScreen (Landlord Only)

**Route:** `apps/mobile/app/(onboarding)/property-proof.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Property proof"   │
│                              │
│  Step 2 of 3  ████████░░░░  │  Progress bar: 66%
│                              │
│  "Take a photo of a document    │  Body text
│   that proves you are the   │
│   owner or have         │
│   the right to this property."   │
│                              │
│  What document? *           │  Label
│  ┌────────────────────────┐  │
│  │ ○ Tax Declaration      │  │  Radio list
│  │ ○ Barangay Certificate │  │
│  │ ○ Building Admin Letter│  │
│  │ ○ Utility Bill w/ Addr │  │
│  │ ○ Land Title           │  │
│  │ ○ Lease Authorization  │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  [camera] TAKE PHOTO OF DOCUMENT │  │  CTA: disabled until type selected
│  └────────────────────────┘  │
│                              │
│  "I don't have a document       │  Skip link
│   now — skip for now"     │
│                              │
│  [warning] "If you skip this,   │  Warning caption (text-xs, text-amber-700)
│   your listing will not appear  │
│   in search results until      │
│   you are verified."           │
└──────────────────────────────┘
```

**Component Tree:**
```
PropertyProofUploadScreen
├── SafeAreaView
│   └── ScrollView
│       ├── Header + ProgressBar (step 2 of 3)
│       ├── Text (instruction body)
│       ├── RadioGroup (document types)
│       ├── Pressable (CTA — camera launch)
│       ├── [if captured] PhotoPreview + UploadProgress
│       ├── Pressable (skip link)
│       └── [if skip visible] WarningCard (amber bg, text explaining consequences)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Radio list, CTA disabled |
| 2 | **Loading** | N/A |
| 3 | **Error — Upload Failed** | Same pattern as Screen 5 |
| 4 | **Empty** | N/A |
| 5 | **Offline** | Banner + camera works, upload queued |
| 6 | **Submitting** | Progress bar, CTA disabled |
| 7 | **Success** | Confirmation + navigate to create-listing or submitted screen |

---

### SCREEN 7: ListingCreateScreen (Landlord)

**Route:** `apps/mobile/app/(landlord)/create-listing.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Create a Listing"     │
│                              │
│  What type of unit? *        │
│  ┌────────┐ ┌────┐ ┌──────┐ │  Chip selector (single select)
│  │Bedspace│ │Room│ │Apart.│ │  Each: h-10, rounded-full
│  └────────┘ └────┘ └──────┘ │  Selected: bg-rayda text-white
│                              │  Unselected: bg-gray-100 text-gray-700
│  How much is the rent? * ₱     │
│  ┌────────────────────────┐  │  Numeric input, h-12
│  │ 5,000                 │  │  keyboardType="number-pad"
│  └────────────────────────┘  │  Format with commas on blur
│                              │
│  Where is the unit? *            │
│  ┌────────────────────────┐  │  Barangay dropdown
│  │ ▾ Select barangay  │  │  LAUNCH_BARANGAYS
│  └────────────────────────┘  │
│                              │
│  Included in rent:            │
│  ┌────────────────────────┐  │  Checkbox group (INCLUSIONS const)
│  │☐ [droplet]Tubig  ☐ [zap]Kuryente│  2 columns, each h-10
│  │☐ [wifi]WiFi      ☐ [bath]CR   │  RaydaIcon 16px + label
│  │☐ [snowflake]Aircon ☐ [car]Parking│
│  └────────────────────────┘  │
│                              │
│  How many beds/rooms?          │
│  ┌──┐                       │  Stepper: min 1, max 20
│  │ 1│ [-] [+]              │
│  └──┘                       │
│                              │
│  Advance (months)    Deposit  │  Two inline steppers
│  ┌──┐               ┌──┐   │
│  │ 1│ [-][+]        │ 2│[-]│  Advance: 0-6, Deposit: 0-6
│  └──┘               └──┘   │
│                              │
│  Description (optional)      │
│  ┌────────────────────────┐  │  TextInput multiline, h-24
│  │                        │  │  maxLength=200
│  └────────────────────────┘  │  Counter: "42/200" text-xs
│                              │    text-right text-secondary
│  [camera] Photos (1-5)        │
│  ┌────┐ ┌────┐ ┌────┐ ┌──┐  │  Horizontal scroll
│  │img1│ │img2│ │img3│ │ + │  │  Each: 80×80, rounded-lg
│  └────┘ └────┘ └────┘ └──┘  │  +: dashed border, Plus icon
│                              │  Tap img: full preview + remove
│  ┌────────────────────────┐  │
│  │    PUBLISH           │  │  If verified → status='active'
│  └────────────────────────┘  │  If unverified → status='draft'
│                              │  + note below: "Will be published when
│  [if unverified]             │   you're verified"
│  "Your listing will go live  │
│   when you're verified.     │
└──────────────────────────────┘
```

**Component Tree:**
```
ListingCreateScreen
├── SafeAreaView
│   └── ScrollView (keyboardShouldPersistTaps="handled")
│       ├── Header
│       ├── ChipSelector (unitType — single select)
│       │   └── ScrollView (horizontal)
│       │       └── [for each type] Pressable (chip)
│       ├── FormField (monthlyRent — numeric with ₱ prefix)
│       ├── FormField (barangay — dropdown)
│       ├── InclusionCheckboxes (2-column grid)
│       │   └── View (className="flex-row flex-wrap gap-2")
│       │       └── [for each inclusion] Pressable
│       ├── FormField (beds/rooms — stepper)
│       ├── View (flex-row — advance + deposit steppers inline)
│       ├── FormField (description — multiline with counter)
│       ├── PhotoUploadGrid
│       │   └── ScrollView (horizontal, showsHorizontalScrollIndicator={false})
│       │       ├── [for each photo] Pressable (preview thumbnail)
│       │       │   └── Image (80×80, rounded-lg) + X remove badge
│       │       └── Pressable (add button — dashed border + Plus icon)
│       ├── Pressable (CTA)
│       └── [if unverified] Text (warning note)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Empty form, CTA disabled |
| 2 | **Loading** | N/A (no initial fetch for creation) |
| 3 | **Error — Validation** | Red borders on invalid fields. Per-field error text in simple English: "Unit type is required", "Rent amount is required (minimum ₱500)" |
| 4 | **Error — Photo Upload** | Failed photo shows red overlay + retry icon |
| 5 | **Offline** | Banner. Photos saved locally, form data cached. "Save offline" CTA. |
| 6 | **Submitting** | CTA spinner, form disabled |
| 7 | **Success** | Toast: "Your listing has been created! ✓" + navigate to listing detail or listings tab |

**Photo Upload:**
```typescript
// Client-side compression BEFORE presigned URL upload
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  quality: 0.6,              // Aggressive compression for 3G
  allowsMultipleSelection: true,
  selectionLimit: 5,
});
// Each photo → POST /api/storage/presigned-url { bucket: 'listings', contentType: 'image/jpeg' }
// Upload directly to PUBLIC R2 bucket: listing-photos/{listingId}/{uuid}.jpg
// Max 500KB per photo after compression
```


---

### SCREEN 8: TenantProfileScreen

**Route:** `apps/mobile/app/(onboarding)/tenant-profile.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Set up your profile"  │
│                              │
│        ┌────────┐            │  Same PhotoPicker as landlord
│        │ SELFIE │            │  80×80 circle
│        │[camera]│            │
│        └────────┘            │
│   "Tap to take a selfie"   │
│                              │
│  Full name *                  │  TextInput h-12
│  ┌────────────────────────┐  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Where are you looking? *       │  Dropdown: LAUNCH_BARANGAYS
│  ┌────────────────────────┐  │
│  │ ▾ Barangay             │  │
│  └────────────────────────┘  │
│                              │
│  What is your job? *       │
│  ┌──────┐ ┌───────┐ ┌─────┐ │  Chip selector
│  │ BPO  │ │Student│ │Other│ │  EMPLOYMENT_TYPES constant
│  │      │ │       │ │     │ │  + "Office" + "Freelancer"
│  └──────┘ └───────┘ └─────┘ │
│                              │
│  Company/School name         │  Conditional: visible when
│  ┌────────────────────────┐  │  BPO, Student, or Office
│  │ e.g., Concentrix      │  │  selected
│  └────────────────────────┘  │  BPO: autocomplete from
│                              │  BPO_COMPANIES constant
│  ┌────────────────────────┐  │
│  │    SAVE PROFILE │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Component Tree:**
```
TenantProfileScreen
├── SafeAreaView
│   └── ScrollView
│       ├── Header
│       ├── PhotoPicker (same component as landlord, reused)
│       ├── FormField (fullName)
│       ├── FormField (searchBarangay — dropdown)
│       ├── ChipSelector (employmentType — EMPLOYMENT_TYPES)
│       ├── [if bpo|student|office] FormField (companyName)
│       │   [if bpo] AutoComplete suggestions from BPO_COMPANIES
│       └── Pressable (CTA)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Empty form, CTA disabled |
| 2 | **Loading** | N/A |
| 3 | **Error — Validation** | Red borders, simple English messages per field |
| 4 | **Empty** | N/A |
| 5 | **Offline** | Banner, "Save offline" CTA |
| 6 | **Submitting** | CTA spinner |
| 7 | **Success** | Navigate to verify-id screen |

---

### SCREEN 9: EmploymentProofScreen (Tenant Only)

**Route:** `apps/mobile/app/(onboarding)/employment-proof.tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←  "Employment proof"    │
│                              │
│  Step 2 of 2  ████████████  │  Progress: 100% (ID done)
│                              │
│  "So landlords can see   │  Body text
│   you have a job and      │
│   are reliable."               │
│                              │
│  What type of proof? *    │
│  ┌────────────────────────┐  │
│  │ ○ Company ID           │  │  BPO-specific options first
│  │ ○ Latest Payslip       │  │  if employmentType === 'bpo'
│  │ ○ Certificate of       │  │
│  │   Employment (COE)     │  │  Student-specific:
│  │ ○ School ID +          │  │  if employmentType === 'student'
│  │   Enrollment Form      │  │
│  │ ○ Other document       │  │  Fallback for freelancer/other
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  [camera] TAKE PHOTO OF DOCUMENT │  │  Camera CTA
│  └────────────────────────┘  │
│                              │
│  [if captured] Photo preview │  120×80 thumbnail + retake
│  [if uploading] Progress bar │
│                              │
│  "I don't have a document —     │  Skip: stays unverified
│   skip for now"              │  Cannot send connection requests
│                              │
│  [warning] "If you skip this,   │  Warning: text-xs text-amber-700
│   you will not be able to connect│
│   with landlords."         │
└──────────────────────────────┘
```

**Component Tree:** Same pattern as PropertyProofUploadScreen. Reuses RadioGroup, PhotoPreview, UploadProgress, SkipButton components.

**7 States:** Same table pattern as Screen 6. Success → navigate to submitted screen.

---

### SCREEN 10: VerificationSubmittedScreen

**Route:** `apps/mobile/app/(onboarding)/submitted.tsx`
**Purpose:** Confirmation that documents are submitted and under review.

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│                              │
│         ┌─────┐              │  Clock icon, 48px, amber
│         │[clock]│             │  RaydaIcon name="clock" 48px
│         └─────┘              │
│                              │
│  "Your documents have been           │  Headline (24px, semibold)
│   submitted!"             │  text-center
│                              │
│  "We are reviewing — usually  │  Body (16px, text-secondary)
│   24-48 hours. You will get │  text-center, px-8
│   a notification when    │
│   approved."           │
│                              │
│  ┌──────────────────────┐    │
│  │[VerifiedBadge:pending]│    │  Badge preview (what they'll get)
│  └──────────────────────┘    │
│                              │
│  ┌────────────────────────┐  │  Tenant: "BROWSE LISTINGS"
│  │ PRIMARY CTA            │  │  Landlord: "CREATE A LISTING"
│  └────────────────────────┘  │
│                              │
│  "While you wait, you can  │  Caption
│   start [browsing/creating]." │
└──────────────────────────────┘
```

**Component Tree:**
```
VerificationSubmittedScreen
├── SafeAreaView
│   └── View (className="flex-1 justify-center items-center px-8")
│       ├── Clock icon (48px, className="text-amber-500 mb-6")
│       ├── Text (headline)
│       ├── Text (body, mt-4 mb-6)
│       ├── VerifiedBadge (status="pending")
│       ├── Pressable (CTA, mt-8 w-full)
│       └── Text (caption, mt-4)
```

**7 States:** Only 1 meaningful state (default). No loading, no error, no empty. Offline: hide CTA (can't navigate to listings without data). Success: this IS the success state.

---

### SCREEN 11: VerificationCeremonyScreen

**Route:** `apps/mobile/app/(onboarding)/verified.tsx`
**Trigger:** Admin approves all verification documents. User opens app → this screen shows.
**Show once:** Store `ceremony_shown_v1` in `expo-secure-store`. If true, skip to main tabs.

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│                              │
│         ┌─────────┐          │  Green shield: 64×64
│         │  ✓      │          │  bg-rayda, rounded-2xl
│         │  SHIELD │          │  RaydaIcon shield-check 32px white
│         └─────────┘          │  ANIMATION: scale 0→1
│                              │  Spring: stiffness 200, damping 15
│                              │  Background flash: #EBF0FC 300ms
│                              │
│  "[Name], verified       │  Display (32px, bold, text-rayda)
│   now! ✓"                 │  text-center, mt-6
│                              │
│  ── TENANT COPY ──           │
│  "You don't need     │  Body (16px, text-secondary)
│   connections in Manila anymore.    │  text-center, px-6, mt-4
│   You're verified — landlords │
│   can see you are real,  │  THIS copy addresses the
│   have a job, and    │  Kakilala Gap mechanism.
│   are reliable."            │
│                              │
│  ── LANDLORD COPY ──         │  (Alternative: shown if role=landlord)
│  "You are verified,        │
│   [Name]! Tenants can   │
│   see you are legitimate and     │
│   have a real property."   │
│                              │
│  ┌────────────────────────┐  │
│  │ BROWSE LISTINGS │  │  Tenant CTA (bg-rayda)
│  │ CREATE A LISTING      │  │  Landlord CTA (bg-rayda)
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ [share] SHARE WITH     │  │  Secondary CTA (border-rayda)
│  │    FRIENDS       │  │  Opens native share sheet
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Share text (pre-filled):**
- **Tenant:** "I found a verified landlord — no connections needed. Try it: [app-link]"
- **Landlord:** "Free app for landlords — verifies tenants before they connect. Free. Try it: [app-link]"

**Component Tree:**
```
VerificationCeremonyScreen
├── SafeAreaView
│   └── View (className="flex-1 justify-center items-center px-6")
│       ├── Animated.View (shield container — spring animation)
│       │   └── View (className="w-16 h-16 bg-rayda rounded-2xl items-center justify-center")
│       │       └── RaydaIcon name="shield-check" size={32} color="#FFFFFF"
│       ├── Text (headline — personalized with name)
│       ├── Text (body — role-specific copy)
│       ├── Pressable (primary CTA, mt-8 w-full)
│       └── Pressable (share CTA, mt-4 w-full, border-rayda)
│           └── Share2 icon + label
```

**7 States:** Only default. The ceremony IS the success state. Offline: show ceremony anyway (data is local from push notification payload). No error possible.

---

### SCREEN 12: ListingSearchScreen (Tenant)

**Route:** `apps/mobile/app/(tabs)/search/index.tsx`
**This is the primary tenant experience screen — modeled after Facebook Marketplace.**

**ASCII Wireframe (Facebook Marketplace Feed):**
```
┌──────────────────────────────┐
│ RentRayda       [search][bell]│  Top header bar (white, fixed, h-48)
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │  Search bar: h-10, rounded-full
│  │ [search] Search rentals│  │  bg-[#E4E6EB] (Facebook style)
│  └────────────────────────┘  │  mx-4, RaydaIcon left
│                              │
│  ┌──────┐┌──────┐┌────────┐  │  Filter chips: h-8, rounded-full
│  │Filter ││Type ▾││₱ Price▾│  │  Horizontal scroll, mx-4
│  └──────┘└──────┘└────────┘  │  Active: bg-[#2D79BF] text-white
│                              │  Inactive: bg-[#E4E6EB] text-[#050505]
│  12 verified listings        │  Count: text-xs text-[#65676B] mx-4
│                              │
│┌────────────────────────────┐│  FULL-WIDTH card (no side margins)
││ [     PHOTO 16:9 h-52    ] ││  No border-radius on photo
││                             ││
││                     [heart] ││  Save icon: absolute top-3 right-3
│├────────────────────────────┤│  white circle bg with heart icon
││ ₱5,000/mo                   ││  Price: text-lg font-bold #050505
││ Bedspace · Ugong, Pasig     ││  Meta: text-sm #65676B
││ [avatar] Juan D. · Verified ││  Seller: 20px circle + name + badge
││ Active today                ││  Freshness: text-xs
│└────────────────────────────┘│
│        8px #F0F2F5 gap       │  Gap between cards (background shows)
│┌────────────────────────────┐│
││ [     Next card...         ]││
│└────────────────────────────┘│
│                              │
│  ┌────────────────────────┐  │  Pagination: NOT infinite scroll
│  │   LOAD MORE (page 2)  │  │  (3G performance concern)
│  └────────────────────────┘  │  10 items per page
│                              │
├──────┬──────┬──┬──────┬──────┤
│[home]│[srch]│[+]│[bell]│[user]│  5-tab bar (48dp, icons only)
└──────┴──────┴──┴──────┴──────┘  2px blue top-line on active
```

**Component Tree (Facebook Marketplace style):**
```
ListingSearchScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   ├── TopHeaderBar (white, fixed)
│   │   ├── Text ("RentRayda" text-xl font-bold text-[#2D79BF])
│   │   ├── Pressable → RaydaIcon name="search" size={24} color="#050505"
│   │   └── Pressable → RaydaIcon name="bell" size={24} color="#050505"
│   │       └── [if unread] NotificationDot (10px red circle)
│   ├── View (className="px-4 pt-3 pb-2 bg-white")
│   │   ├── SearchInput (Facebook-style)
│   │   │   └── View (className="flex-row bg-[#E4E6EB] rounded-full h-10 items-center px-4 gap-2")
│   │   │       ├── RaydaIcon name="search" size={16} color="#65676B"
│   │   │       └── TextInput (placeholder="Search rentals...", flex-1, text-base)
│   │   └── FilterChips (horizontal scroll, mt-2)
│   │       └── ScrollView (horizontal)
│   │           └── [for each filter] Pressable (chip)
│   │               Active: bg-[#2D79BF] text-white rounded-full h-8 px-3
│   │               Inactive: bg-[#E4E6EB] text-[#050505] rounded-full h-8 px-3
│   ├── Text (results count — "12 verified listings" text-xs text-[#65676B] mx-4 mt-2)
│   ├── FlashList (estimatedItemSize={300}, data={listings}, ItemSeparatorComponent={FeedGap})
│   │   └── [for each listing] ListingCard (Facebook Marketplace style, below)
│   ├── [if loading] SkeletonCards (3 full-width shimmer placeholders)
│   ├── [if empty] EmptyStateView (RaydaIcon name="home" + headline + CTA)
│   └── Pressable (load more — secondary button, mx-4 mb-4)
├── [if offline] NetworkBanner (RaydaIcon name="wifi-off")
└── BottomTabBar (3 tabs, icons only)

FeedGap: View (className="h-2 bg-[#F0F2F5]")  ← 8px gray gap between cards
```

**ListingCard TypeScript Interface:**
```typescript
interface ListingCardProps {
  id: string;
  thumbnailUrl: string | null;     // First photo R2 public URL
  monthlyRent: number;             // amount in pesos
  unitType: 'bedspace' | 'room' | 'apartment';
  barangay: string;
  city: string;
  landlordName: string;
  landlordPhotoUrl: string | null;
  verificationStatus: 'verified';  // Only verified shown in search
  lastActiveAt: string;            // ISO timestamp for freshness calc
  isSaved?: boolean;               // Heart/save state
  onPress: () => void;             // Navigate to [id].tsx
  onSave?: () => void;             // Toggle save/favorite
  onLongPress?: () => void;        // Context menu (Save/Share/Report)
}
```

**ListingCard NativeWind (Facebook Marketplace style):**
```
Container: bg-white overflow-hidden (NO border, NO radius, NO shadow, NO margin)
Photo: w-full aspect-[16/9] (expo-image, contentFit="cover", cachePolicy="memory-disk")
  SaveButton: absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-sm
    RaydaIcon name="heart" or "heart-filled" size={18} color="#E41E3F"
ContentWrap: px-4 py-3
Price: text-lg font-bold text-[#050505] (dark text like Facebook Marketplace, NOT brand blue)
Meta: text-sm text-[#65676B] mt-1 (format: "Bedspace · Ugong, Pasig")
SellerRow: flex-row items-center gap-2 mt-2
  Avatar: expo-image w-5 h-5 rounded-full (landlord photo, tiny inline)
  Text: text-xs text-[#65676B] ("Juan D. · Verified")
Freshness: text-xs mt-1 (color from freshness token system)
```

**FreshnessIndicator Component:**
```typescript
interface FreshnessIndicatorProps {
  lastActiveAt: string; // ISO timestamp
}
// Labels and colors:
// < 24h:   "Active today"    text-rayda (green)
// 24-48h:  "Yesterday"          text-rayda (green)
// 3-7d:    "X days ago"        text-amber-600
// 7-14d:   "1 week(s) ago"      text-amber-600
// 14-30d:  "Not active"       text-red-600
// 30d+:    auto-paused, not shown in search
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Listings loaded, cards displayed |
| 2 | **Loading** | Skeleton cards: 3 placeholder cards with shimmer. Photo bone: w-full h-48 rounded-t-xl. Title bone: w-2/3 h-5 mt-4. Meta bone: w-1/2 h-4 mt-2. Badge bone: w-24 h-7 mt-2 rounded-full. |
| 3 | **Error — API** | Full-screen error: "Could not load listings. Try again?" with retry button (bg-rayda) |
| 4 | **Empty** | Icon: Home 48px gray. Headline: "No listings in this area yet." Body: "Try a nearby barangay or check again tomorrow." CTA: "CLEAR FILTERS" (secondary button) |
| 5 | **Offline** | Banner + show cached listings (if any) with "Offline — not updated" overlay. If no cache: empty state with offline note. |
| 6 | **Submitting** | N/A (no submit on search screen) |
| 7 | **Refreshing** | Pull-to-refresh: RefreshControl (tintColor="#2D79BF") |

---

### SCREEN 13: ListingDetailScreen (Tenant)

**Route:** `apps/mobile/app/(tabs)/search/[id].tsx`
**Design:** Facebook Marketplace product page — sectioned white cards on gray background.

**ASCII Wireframe (Facebook Marketplace Product Page):**
```
┌──────────────────────────────┐
│  [<-]            [share][flag]│  Transparent overlay header
│                              │  Icons: RaydaIcon on semi-transparent bg
│┌────────────────────────────┐│
││                             ││  Photo gallery: full-bleed
││     PHOTO GALLERY           ││  h-72 (taller), edge-to-edge
││     (swipeable)             ││  expo-image, contentFit="cover"
││                             ││
││  1/5                        ││  Photo counter: bottom-left overlay
│└────────────────────────────┘│  "1/5" text on dark scrim, NOT dots
│                              │
│┌────────────────────────────┐│  Section 1: Price card (white, full-width)
││ ₱5,000/month                ││  Price: text-2xl font-bold #050505
││ Bedspace · Ugong, Pasig     ││  Meta: text-base #65676B
││ Listed 2 days ago           ││  Freshness as relative date
││                     [save]  ││  Heart/bookmark icon right-aligned
│└────────────────────────────┘│
│        8px #F0F2F5 gap       │
│┌────────────────────────────┐│  Section 2: Seller card (white)
││ Seller Information          ││  Section label: text-sm font-semibold
││─────────────────────────────││  Divider
││ [photo]  Juan Dela Cruz     ││  Avatar: 48px circle
││  48px    Verified [badge]   ││  VerifiedBadge inline
││          Member since 2024  ││  Join date
││          [View Profile]     ││  Text button: text-[#2D79BF]
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Section 3: Details card (white)
││ Details                     ││
││─────────────────────────────││
││ [bed] 1 bed                 ││  RaydaIcon + label rows
││ [calendar] Available Dec 15 ││
││ [peso] Advance: 1 month     ││
││ [peso] Deposit: 2 months    ││
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Section 4: Inclusions card (white)
││ Included in rent            ││
││─────────────────────────────││
││ [droplet]Water [zap]Electric││  RaydaIcon + text chips
││ [wifi]WiFi     [bath]CR     ││  2-column grid, each h-10
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Section 5: Description (white)
││ Description                 ││
││─────────────────────────────││
││ "Malinis na bedspace malapit││
││  sa Ortigas. Walking        ││
││  distance sa Shaw MRT."     ││
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Trust card: bg-[#EBF0FC]
││ [shield] This landlord is   ││  RaydaIcon shield-check
││ verified. You will never be ││  text-sm text-[#2D79BF]
││ asked to pay on this app.   ││
│└────────────────────────────┘│
│                              │
│══════════════════════════════│  Fixed bottom bar: h-20
│ ┌──────────────────────────┐ │  bg-white, border-t #CED0D4
│ │  CONNECT WITH JUAN       │ │  CTA: h-12, bg-[#2D79BF] rounded-lg
│ └──────────────────────────┘ │  text-white font-semibold
│ [flag] Report this listing   │  RaydaIcon flag + text-xs #65676B
│══════════════════════════════│
```

**Component Tree:**
```
ListingDetailScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   ├── Header (absolute, transparent bg)
│   │   ├── Pressable (back — ArrowLeft 24px)
│   │   ├── Pressable (share — Share2 24px)
│   │   └── Pressable (report — Flag 20px)
│   ├── ScrollView (bounces, showsVerticalScrollIndicator={false})
│   │   ├── PhotoGallery
│   │   │   └── ScrollView (horizontal, pagingEnabled, decelerationRate="fast")
│   │   │       └── [for each photo] expo-image (w-full h-64, contentFit="cover")
│   │   ├── DotIndicators (flex-row justify-center gap-1 mt-2)
│   │   ├── View (className="px-5 pt-4")
│   │   │   ├── Text (price — "₱5,000/buwan" text-2xl font-bold text-rayda)
│   │   │   ├── Text (meta — "Bedspace · Ugong, Pasig" text-base text-secondary)
│   │   │   ├── LandlordCard (bg-gray-50 rounded-xl p-4 flex-row)
│   │   │   │   ├── expo-image (48×48 circle)
│   │   │   │   ├── Text (name — font-medium)
│   │   │   │   └── VerifiedBadge (status="verified")
│   │   │   ├── FreshnessIndicator
│   │   │   ├── View (divider — h-px bg-gray-200 my-4)
│   │   │   ├── InclusionChips (flex-row flex-wrap gap-2)
│   │   │   ├── Text (beds, advance, deposit details)
│   │   │   ├── Text (description — text-secondary)
│   │   │   └── AntiScamCard (bg-rayda-light rounded-lg p-3)
│   └── FixedBottomBar (h-20, bg-white, border-t, shadow-sm)
│       ├── Pressable (CTA — dynamic based on CTAState)
│       └── Pressable (report link — text-xs text-secondary)
```

**CTA State Logic:**
```typescript
type CTAState =
  | { type: 'connect'; landlordName: string }     // Verified tenant, no existing request
  | { type: 'verify_first' }                       // Unverified tenant
  | { type: 'already_sent' }                       // Request already exists
  | { type: 'already_connected'; phone: string }   // Connection exists
  | { type: 'own_listing' }                        // Landlord viewing own listing

// CTA rendering:
// connect       → "CONNECT WITH [NAME]"    bg-rayda, enabled
// verify_first  → "VERIFY MUNA ANG PROFILE" bg-amber-500, navigates to verify-id
// already_sent  → "REQUEST ALREADY SENT" bg-gray-300, disabled
// already_connected → "CONNECTED ✓ [phone]"   bg-rayda-light, shows phone
// own_listing   → "EDIT LISTING"         bg-rayda, navigates to edit
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | All data loaded, CTA based on tenant verification status |
| 2 | **Loading** | Skeleton: photo area shimmer (h-64), text bones below |
| 3 | **Error — Not Found** | "This listing is no longer available." + back button |
| 4 | **Error — API** | Retry screen |
| 5 | **Offline** | Show cached version (if visited before) with "Offline" badge |
| 6 | **Submitting** | N/A (submit is on the modal, Screen 14) |
| 7 | **Success** | N/A |

---

### SCREEN 14: ConnectionRequestModal (Tenant)

**Route:** Bottom sheet modal overlaying ListingDetail
**Library:** `@gorhom/bottom-sheet` or Expo Router modal

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  (dimmed background 50%)     │
│                              │
│  ┌────────────────────────┐  │  Bottom sheet: rounded-t-2xl
│  │ ━━━━ (drag handle)     │  │  bg-white, shadow-lg
│  │ 4px wide, 40px, gray   │  │
│  │                        │  │
│  │ "Introduce yourself"     │  │  Title (20px, font-medium)
│  │                        │  │
│  │ ┌──────────────────┐   │  │  Optional message (Messenger-style)
│  │ │ "Hi! BPO      │   │  │  TextInput multiline
│  │ │  worker based   │   │  │  h-24, bg-[#E4E6EB]
│  │ │  in Ortigas..."  │   │  │  rounded-2xl, p-3 (NO visible border)
│  │ └──────────────────┘   │  │  maxLength=200
│  │ 42/200                 │  │  Counter: text-xs text-right
│  │                        │  │
│  │ ┌──────────────────┐   │  │
│  │ │   SEND REQUEST   │   │  │  CTA: h-12, bg-[#2D79BF]
│  │ │                   │   │  │  rounded-full (pill, Messenger)
│  │ └──────────────────┘   │  │  full width
│  │                        │  │
│  │ "The landlord will see  │  │  Caption: text-xs text-secondary
│  │  your verified profile  │  │
│  │  along with your message."│  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```


**Component Tree:**
```
ConnectionRequestModal (Bottom Sheet)
├── BottomSheet (snapPoints={['40%']}, enablePanDownToClose)
│   ├── View (handle — w-10 h-1 bg-gray-300 rounded-full self-center mt-2)
│   ├── View (className="px-5 pt-4")
│   │   ├── Text ("Introduce yourself" text-xl font-medium)
│   │   ├── TextInput (message — multiline h-24 border-gray-300 rounded-lg p-3)
│   │   │   maxLength={200}, placeholder="Hi! I'm a BPO worker in Ortigas..."
│   │   ├── Text (counter — "42/200" text-xs text-right text-secondary)
│   │   ├── Pressable (CTA — "SEND REQUEST" h-12 bg-rayda rounded-lg w-full mt-4)
│   │   │   ├── [if submitting] ActivityIndicator (white)
│   │   │   └── [if not] Text ("SEND REQUEST" font-semibold text-white)
│   │   └── Text (caption — text-xs text-secondary text-center mt-3)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Empty message field (optional), CTA enabled |
| 2 | **Loading** | N/A |
| 3 | **Error — API** | Toast: "Could not send. Try again." (red bg, bottom) |
| 4 | **Empty** | N/A |
| 5 | **Offline** | CTA disabled + "No internet" below |
| 6 | **Submitting** | CTA spinner, message field disabled |
| 7 | **Success** | Sheet dismisses. Toast on listing detail: "Sent! Waiting for the landlord to respond. ✓" (green bg, 3s auto-dismiss) |

---

### SCREEN 15: LandlordInboxScreen

**Route:** `apps/mobile/app/(tabs)/inbox/index.tsx`
**Shows:** Landlord sees incoming requests. Tenant sees sent requests + connections.

**ASCII Wireframe (Landlord View — Facebook Post Feed Style):**
```
┌──────────────────────────────┐
│ RentRayda       [search][bell]│  Top header bar
├──────────────────────────────┤
│ Connection Requests · 3 new  │  Section header: bg-white px-4 py-3
├──────────────────────────────┤
│                              │
│┌────────────────────────────┐│  Full-width card (Facebook post style)
││ [ava] Maria Santos      2h ││  Avatar 40px + Name + relative time
││       Verified · BPO        ││  Badge + employer inline below name
││                             ││
││ "Hi! BPO worker po ako sa   ││  Full message (NOT truncated)
││  Ortigas. Interested sa     ││  text-base #050505
││  bedspace nyo."             ││
││                             ││
││ For: Bedspace, Ugong        ││  Reference: text-sm #65676B
││                             ││
││ ┌──────────┐ ┌────────────┐││  Action bar (Facebook reaction bar style)
││ │  Accept   │ │  Decline   │││  Accept: bg-[#2D79BF] text-white h-10
││ │           │ │            │││  Decline: bg-[#E4E6EB] text-[#050505] h-10
││ └──────────┘ └────────────┘││  rounded-md, flex-row gap-2, mx-4 mb-4
│└────────────────────────────┘│
│        8px #F0F2F5 gap       │
│┌────────────────────────────┐│
││ [Next request card...]      ││
│└────────────────────────────┘│
│                              │
├──────┬──────┬──┬──────┬──────┤
│[home]│[srch]│[+]│[bell]│[user]│  5-tab bar, icons only
└──────┴──────┴──┴──────┴──────┘
```

**Component Tree:**
```
LandlordInboxScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   ├── View (className="px-5 pt-4")
│   │   ├── Text (title — "Mga Connection Request" text-xl font-medium)
│   │   └── Text (subtitle — "3 pending" text-sm text-secondary)
│   ├── FlatList (data={requests})
│   │   └── [for each request] ConnectionRequestCard
│   │       ├── View (className="bg-white rounded-xl p-4 mb-3 shadow-sm")
│   │       │   ├── View (flex-row items-center gap-3)
│   │       │   │   ├── Pressable (onPress → view full profile modal)
│   │       │   │   │   └── expo-image (48×48 circle)
│   │       │   │   ├── View (flex-1)
│   │       │   │   │   ├── Text (tenant name — font-medium)
│   │       │   │   │   ├── VerifiedBadge (status="verified")
│   │       │   │   │   └── Text (employer — "BPO · Concentrix" text-sm text-secondary)
│   │       │   ├── Text (message preview — numberOfLines={2} text-sm text-secondary)
│   │       │   ├── Text (listing ref + timestamp — text-xs text-secondary)
│   │       │   └── View (className="flex-row gap-3 mt-3")
│   │       │       ├── Pressable (accept — flex-1 h-10 bg-rayda rounded-lg)
│   │       │       └── Pressable (decline — flex-1 h-10 bg-gray-100 rounded-lg)
│   ├── [if loading] SkeletonCards (3 placeholders)
│   ├── [if empty] EmptyStateView ("Wala pa kang connection request...")
│   └── [if offline] NetworkBanner
└── BottomTabBar
```

**ConnectionRequestCard Interface:**
```typescript
interface ConnectionRequestCardProps {
  id: string;
  tenantName: string;
  tenantPhotoUrl: string;
  tenantVerificationStatus: 'verified'; // Only verified can send
  employmentType: string;
  companyName?: string;
  message?: string;
  listingTitle: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
  onAccept: () => void;
  onDecline: () => void;
  onViewProfile: () => void; // Tap name/photo to view full profile
}
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | List of request cards |
| 2 | **Loading** | Skeleton cards (3 placeholders with shimmer) |
| 3 | **Error** | Retry screen |
| 4 | **Empty** | Icon: Inbox 48px gray. "No connection requests yet. When someone views your listing and connects, it will appear here." |
| 5 | **Offline** | Banner + cached list (if available) |
| 6 | **Submitting** | Accept/Decline buttons show spinner on tapped button, other disabled |
| 7 | **Success — Accepted** | Card updates: buttons replaced with "✓ Accepted" green texting. Navigate to ConnectionRevealScreen after 1s. |

**Tap on tenant name/photo:** Opens a modal/sheet showing full tenant profile: photo (large), name, verified badge, employment type, company name, search barangay. Read-only. No phone number shown here.

---

### SCREEN 16: ConnectionRevealScreen

**Route:** `apps/mobile/app/connections/reveal.tsx`
**Trigger:** Landlord accepts connection request AND both parties are verified.
**SECURITY:** Phone number comes from `GET /api/connections/:id` which enforces server-side verification checks.

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←                           │  Back to inbox
│                              │
│         ┌─────────┐          │  RaydaIcon handshake container
│         │handshake│          │  64×64, bg-[#EBF0FC]
│         │  (32px) │          │  rounded-2xl
│         └─────────┘          │  ANIMATION: scale 0→1 (spring)
│                              │
│  "You are now connected!"     │  Display (32px, bold, text-[#2D79BF])
│                              │  text-center
│  "You are both         │  Body (16px, text-secondary)
│   verified. Here are the   │  text-center, px-6
│   contact details:"                 │
│                              │
│  ┌────────────────────────┐  │  Contact card: bg-rayda-light
│  │ ┌──┐                  │  │  rounded-2xl, p-5
│  │ [photo] [Other Party Name]│ │  Photo: 56×56 circle
│  │  56px   Verified [badge] │ │  Name: text-lg font-semibold
│  │ └──┘                   │  │  Badge: VerifiedBadge
│  │                        │  │
│  │ [phone] +63 917 123 4567│  │  PHONE: text-2xl font-bold
│  │                        │  │  text-[#2D79BF], mt-4
│  │ ┌──────────┐ ┌───────┐ │  │  
│  │ │[phn]CALL │ │[cpy]  │ │  │  Buttons: h-11 each, rounded-full
│  │ │(bg-rayda)│ │ COPY  │ │  │  Call: bg-[#2D79BF] text-white
│  │ └──────────┘ └───────┘ │  │  Copy: border-[#2D79BF] text-[#2D79BF]
│  └────────────────────────┘  │  Call → Linking.openURL(`tel:+63...`)
│                              │  Copy → Clipboard + toast "Copied!"
│  ┌────────────────────────┐  │
│  │ [share] SHARE WITH     │  │  Share button: border-[#2D79BF]
│  │         FRIENDS        │  │  RaydaIcon share, opens native share
│  └────────────────────────┘  │
│                              │
│  "Tip: Schedule a viewing   │  Caption: text-xs text-secondary
│   by calling or     │  text-center, mt-4
│   texting."                    │
└──────────────────────────────┘
```


**Component Tree:**
```
ConnectionRevealScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   ├── Header (back arrow)
│   └── View (className="flex-1 justify-center items-center px-6")
│       ├── Animated.View (handshake — spring scale 0→1, stiffness 200, damping 15)
│       │   └── View (w-16 h-16 bg-[#EBF0FC] rounded-2xl items-center justify-center)
│       │       └── RaydaIcon name="handshake" size={32} color="#2D79BF"
│       ├── Text ("You are now connected!" text-3xl font-bold text-[#2D79BF] mt-6)
│       ├── Text (body — text-base text-secondary text-center px-6 mt-4)
│       ├── View (contact card — bg-rayda-light rounded-2xl p-5 w-full mt-8)
│       │   ├── View (flex-row items-center gap-3)
│       │   │   ├── expo-image (56×56 circle)
│       │   │   ├── Text (name — text-lg font-semibold)
│       │   │   └── VerifiedBadge (status="verified")
│       │   ├── Text (phone — text-2xl font-bold text-rayda mt-4)
│       │   └── View (flex-row gap-3 mt-4)
│       │       ├── Pressable (call — flex-1 h-11 bg-rayda rounded-lg)
│       │       └── Pressable (copy — flex-1 h-11 border-rayda rounded-lg)
│       └── Pressable (share — w-full h-11 border-rayda rounded-lg mt-4)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Contact card with phone number displayed |
| 2 | **Loading** | Skeleton card (phone number bone) while fetching connection data |
| 3 | **Error — Forbidden** | "One party is not verified yet. Cannot reveal the number." This should NEVER happen if backend is correct. |
| 4 | **Empty** | N/A |
| 5 | **Offline** | "Internet required to view contact details." No cached phone numbers. |
| 6 | **Submitting** | N/A |
| 7 | **Success** | Toast on copy: "Number copied! ✓" |

**SECURITY NOTE:** Never cache phone numbers in AsyncStorage or any persistent client storage. Phone number is fetched fresh each time from the API. The API enforces that both parties must still be verified (not suspended) to return the phone number.

---

### SCREEN 17: ProfileScreen (Both Roles)

**Route:** `apps/mobile/app/(tabs)/profile/index.tsx`

**ASCII Wireframe (Facebook Profile Page Style):**
```
┌──────────────────────────────┐
│ RentRayda       [search][bell]│  Top header bar
├──────────────────────────────┤
│                              │
│┌────────────────────────────┐│  Profile header card (full-width)
││ ┌──────────────────────── ┐││  Cover strip: h-16 bg-[#2D79BF]
││ │  bg-[#2D79BF] gradient  │││  or linear-gradient
││ └──────────────────────── ┘││
││                             ││
││  [PHOTO]  Juan Dela Cruz    ││  Photo: 72x72 circle, border-4 white
││   72px    Verified [badge]  ││  Overlapping the cover strip (-mt-9)
││           Landlord · Pasig  ││  Name: text-xl font-bold #050505
││                             ││
││  ┌──────────────────────┐   ││
││  │ [edit] Edit Profile  │   ││  Secondary button: bg-[#E4E6EB]
││  └──────────────────────┘   ││  text-[#050505], rounded-md, h-9
│└────────────────────────────┘│
│        8px #F0F2F5 gap       │
│┌────────────────────────────┐│  Verification section (white card)
││ VERIFICATION STATUS         ││  Section header inside card
││─────────────────────────────││
││ [shield] Gov ID        Done ││  RaydaIcon + label + status + chevron
││─────────────────────────────││  Each row: h-12, divider between
││ [shield] Property   Pending ││
││─────────────────────────────││
││ [shield] Complete    [>]    ││  Tap → navigate to verification
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Connections card (white)
││ [handshake] 3 active     [>]││
│└────────────────────────────┘│
│        8px gap               │
│┌────────────────────────────┐│  Settings card (white)
││ Privacy Policy            [>]││  Each row: h-12
││─────────────────────────────││  RaydaIcon chevron-right
││ Terms of Service          [>]││
││─────────────────────────────││
││ About               v1.0 [>]││
│└────────────────────────────┘│
│                              │
│  ┌────────────────────────┐  │  Logout: text-[#E41E3F]
│  │       LOG OUT          │  │  border-[#E41E3F], bg-transparent
│  └────────────────────────┘  │  mx-4, rounded-md, h-12
│                              │
├──────┬──────┬──┬──────┬──────┤
│[home]│[srch]│[+]│[bell]│[user]│  5-tab bar, icons only
└──────┴──────┴──┴──────┴──────┘
```


**Component Tree:**
```
ProfileScreen
├── SafeAreaView (className="flex-1 bg-[#F0F2F5]")
│   └── ScrollView (className="px-5 pt-4")
│       ├── Text ("Profile" text-xl font-medium)
│       ├── View (profile card — bg-white rounded-xl shadow-sm p-4 mt-4)
│       │   └── View (flex-row items-center gap-3)
│       │       ├── expo-image (56×56 circle)
│       │       ├── View (flex-1)
│       │       │   ├── Text (name — text-lg font-semibold)
│       │       │   ├── VerifiedBadge
│       │       │   └── Text (role + city — text-sm text-secondary)
│       ├── SectionHeader ("VERIFICATION STATUS")
│       ├── View (status rows — bg-white rounded-xl shadow-sm)
│       │   ├── StatusRow (Gov ID — icon + ChevronRight, h-12)
│       │   ├── Divider
│       │   └── StatusRow (Property/Employment — icon + ChevronRight)
│       ├── SectionHeader ("CONNECTIONS")
│       ├── Pressable (connections count → navigate to list)
│       ├── SectionHeader ("SETTINGS")
│       ├── View (settings rows — bg-white rounded-xl shadow-sm)
│       │   ├── SettingsRow ("Privacy Policy" + ChevronRight)
│       │   ├── SettingsRow ("Terms of Service" + ChevronRight)
│       │   └── SettingsRow ("About" + ChevronRight → version)
│       └── Pressable (logout — border-red-600 text-red-600 h-12 rounded-lg mt-6)
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Profile data loaded |
| 2 | **Loading** | Skeleton card for profile section |
| 3 | **Error** | Retry |
| 4 | **Empty** | N/A (user always has a profile at this point) |
| 5 | **Offline** | Cached profile data shown with "Offline" indicator |
| 6 | **Submitting** | Logout shows spinner in button |
| 7 | **Success — Logout** | Navigate to PhoneEntry (clear all state) |

**Logout flow:** Confirmation dialog: "Are you sure you want to log out?" → [Cancel] [Logout]. On confirm: destroy session via `POST /api/auth/logout`, clear expo-secure-store, navigate to (auth) stack.

---

### SCREEN 18: ScamReportScreen (Modal)

**Route:** `apps/mobile/app/report.tsx` (Expo Router modal)
**Trigger:** Tap "Report" on listing detail or profile view.

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  [x]  "Report"             │  X close button + title
│                              │
│  "What is the problem?"        │  Label
│                              │
│  ┌────────────────────────┐  │
│  │ ○ Fake listing          │  │  Radio list, h-12 per item
│  │ ○ Scam attempt          │  │  Values: REPORT_TYPES
│  │ ○ Hindi tunay ang       │  │  from constants
│  │   identity              │  │
│  │ ○ Other                │  │
│  └────────────────────────┘  │
│                              │
│  Details (optional)          │  Label
│  ┌────────────────────────┐  │
│  │                        │  │  TextInput multiline
│  │                        │  │  h-24, maxLength=500
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │    SUBMIT REPORT│  │  CTA: bg-danger text-white
│  └────────────────────────┘  │  (red — this is a serious action)
│                              │
│  "We will review this within │  Caption: text-xs text-secondary
│   24 hours. Thank you for       │  text-center
│   reporting."              │
└──────────────────────────────┘
```


**Component Tree:**
```
ScamReportScreen (Modal)
├── SafeAreaView (className="flex-1 bg-white")
│   ├── View (header — flex-row justify-between px-5 pt-4)
│   │   ├── Pressable (close — X icon 24px)
│   │   └── Text ("Report" text-xl font-medium)
│   └── ScrollView (className="px-5 pt-4")
│       ├── Text (label — "What is the problem?")
│       ├── RadioGroup (REPORT_TYPES)
│       │   └── [for each] Pressable (h-12 flex-row items-center gap-3)
│       │       ├── RadioCircle (20px)
│       │       └── Text (label)
│       ├── Text (label — "Details (optional)")
│       ├── TextInput (multiline h-24 border-gray-300 rounded-lg p-3 maxLength=500)
│       ├── Pressable (CTA — "SUBMIT REPORT" h-12 bg-red-600 rounded-lg)
│       └── Text (caption — "We'll review within 24 hours...")
```

**7 States:**

| # | State | Visual |
|---|---|---|
| 1 | **Default** | Report type unselected, CTA disabled |
| 2 | **Loading** | N/A |
| 3 | **Error** | Toast: "Could not submit. Try again." |
| 4 | **Empty** | N/A |
| 5 | **Offline** | CTA disabled, "Internet connection needed to report." |
| 6 | **Submitting** | CTA spinner |
| 7 | **Success** | Modal dismisses. Toast: "Your report has been submitted. Thank you! ✓" green, 3s |

---

## 3. WEB SCREEN SPECIFICATIONS (3 Screens)

### WEB SCREEN 1: Landing Page (Animated)
**Route:** `apps/web/app/page.tsx`
**Component:** `apps/web/components/AnimatedSections.tsx` (client component with scroll-triggered animations)

**Animation system:**
- **Scroll-triggered fade-in:** `IntersectionObserver` (threshold 0.15) triggers once per element. Fade from `opacity: 0` + `translateY(40px)` to visible. Duration: 0.7s ease. Staggered delays (0.1s increments) for child elements.
- **Step-by-step demos:** `setTimeout` chains triggered on scroll intersection. Each step animates in sequence with 1-1.2s intervals.
- **Phone mockup frame:** 280x560px rounded rectangle with notch, drop shadow. Used consistently across all feature sections.
- **Badge pop animation:** `@keyframes badgePop { 0% { scale(0) } 60% { scale(1.15) } 100% { scale(1) } }` — used for verified badges, connection reveals.
- **Hover interactions:** Cards lift with `translateY(-4px)` + shadow on hover. Store buttons lift with `translateY(-2px)`.
- **Animated counters:** Numbers count up from 0 to target value over 1.5s when scrolled into view.
- **No animation libraries.** Pure CSS transitions + IntersectionObserver + setTimeout. Zero dependencies.

**Sections (top to bottom):**

1. **Hero** — Gradient background (#1D4ED8 → #60A5FA) with subtle radial overlay. Logo, "RentRayda" in BerlinSansFB (56px), tagline in BobbyJonesSoft (26px), two CTAs: "Download the App" (white solid) + "Browse Listings" (white outline).

2. **Trust Counter** — Blue banner with live metrics from API. BerlinSansFB for numbers.

3. **How It Works (animated)** — `<HowItWorksAnimated />`. Section title in BerlinSansFB, subtitle in BobbyJonesSoft. 3 cards that fade in staggered (0.15s each). Each card: icon in blue rounded square, numbered badge, title in BerlinSansFB, description in AlteHaasGrotesk. Cards lift on hover.

4. **Verification Demo** — `<VerificationDemo />`. Left: text explaining the flow + 3 step indicators that highlight sequentially. Right: phone mockup showing animated verification flow (progress bar fills, ID photo captured, selfie captured, submit button turns green, verified badge pops in). 4-step sequence auto-plays on scroll.

5. **Browse Listings Demo** — `<BrowseListingsDemo />`. Left: phone mockup with search bar + 2-column grid where 6 listing cards fade in one by one (0.2s stagger). Right: text + filter chip preview. Alternating layout (phone on left).

6. **Connection Demo** — `<ConnectionDemo />`. Left: text + "Zero fees" callout. Right: phone mockup showing animated connection flow: two avatars (tenant + landlord) get verified badges → approach each other (gap shrinks) → connection line draws → phone number card pops in → call/text buttons appear. 4-phase sequence.

7. **Anti-Scam Block** — Static section. Title in BerlinSansFB, body in AlteHaasGrotesk, closing line in BobbyJonesSoft.

8. **Cross-Platform + Stats** — `<CrossPlatformDemo />`. Centered layout. Title in BerlinSansFB, Play Store + App Store download buttons (dark, lift on hover). Three animated stat counters below: "100%" / "0" / "48hr".

9. **Footer** — Dark background. "RentRayda" in BerlinSansFB. Links in AlteHaasGrotesk.

**Layout pattern:** Feature sections alternate text-left/phone-right and text-right/phone-left. All use `display: flex` with `flex-wrap: wrap` for mobile responsiveness. Phone mockups stack below text on narrow screens.

**Mobile responsive:** All flex containers wrap. Phone mockups center below text. Hero CTAs stack vertically. Stats wrap to 2+1 grid.

### WEB SCREEN 2: Admin Verification Queue
**Route:** `apps/web/app/admin/verifications/page.tsx`
**Auth:** `user.role === 'admin'` required. Redirect to login if not.

**Table columns:**

| Column | Width | Content |
|---|---|---|
| User | 200px | Name + role badge (Landlord/Tenant chip) |
| Type | 120px | "Gov ID" / "Property" / "Employment" |
| Submitted | 120px | Relative date ("2 hours ago") |
| ID Photo | 100px | Thumbnail (click → modal with full-size image via signed URL) |
| Selfie | 100px | Thumbnail (same) |
| Status | 100px | Badge (pending/approved/rejected) |
| Actions | 200px | [Approve] (green) + [Reject] (red) buttons |

**Reject modal:** Required reason text field. Suggestion buttons for common reasons: "ID is not clear", "Face does not match selfie", "Property proof is not sufficient", "ID is expired." Reason stored in `verification_documents.rejection_reason`.

**Side-by-side comparison:** When reviewing gov_id docs, show ID photo and selfie side-by-side in a modal for manual face comparison.

**Pagination:** 20 items per page. Sort by: submitted date (default newest first). Filter by: status (pending/approved/rejected), document type.

### WEB SCREEN 3: Admin Report Queue
**Route:** `apps/web/app/admin/reports/page.tsx`

**Table columns:**

| Column | Width | Content |
|---|---|---|
| Reporter | 160px | Name + role badge |
| Reported | 160px | User name OR listing title |
| Type | 120px | Report type chip (fake_listing, scam_attempt, identity_fraud, other) |
| Description | 250px | Truncated to 100 chars, click to expand |
| Submitted | 120px | Relative date |
| Status | 100px | Badge (pending = amber, reviewed = green, resolved = blue) |
| Actions | 250px | [Mark Reviewed] (blue) + [Suspend User] (red) + [Suspend Listing] (amber) |

**Suspend user flow:** Click "Suspend User" → confirmation dialog: "This will immediately log out the user, hide their listings, and prevent new connections. Continue?" → [Cancel] [Suspend]. Sets `users.isSuspended = true`, invalidates all sessions, sets all their listings to `status='paused'`.

**Pagination:** 20 items per page. Sort by: submitted date (newest first). Filter by: status, report type.

**Empty state:** "No pending reports. That's a good sign!"

---

## 4. ACCESSIBILITY REQUIREMENTS

**Target users include Filipinos with varying digital literacy (68-72% smartphone penetration, 16% without internet access).**

1. **All text:** Minimum 16px body, 12px minimum for any texting. Support Dynamic Type / system font scaling.
2. **All interactive elements:** 48×48dp touch targets. 8dp spacing between targets.
3. **All icons:** Paired with text labels — except bottom tab bar icons (icon-only, Facebook-style — universally understood by our target market), back arrow, and close X. All icon-only elements MUST have `accessibilityLabel` set. Every `<RaydaIcon>` component includes a built-in `accessibilityLabel` mapped from the icon name.
4. **All images:** `accessibilityLabel` describing content. Listing photos: "Photo of [unitType] in [barangay]."
5. **Color:** Never color-only information. Status badges use icon + text + color.
6. **Navigation:** Maximum 3 levels deep from any tab. Flat hierarchy.
7. **Language:** Simple English for all user-facing copy. English for system errors (developer debugging).
8. **Keyboard (web):** All forms navigable with Tab key. Enter submits forms. Escape closes modals.
9. **Screen readers:** All custom components have `accessibilityRole`, `accessibilityLabel`, `accessibilityState`.

