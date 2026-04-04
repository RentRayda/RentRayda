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

**Screen edge horizontal padding:** `px-5` (20px) on all screens. Never full-bleed content except photo galleries.

### 1.2 Touch Targets

Every interactive element: **minimum 48×48dp.** This is non-negotiable — Android accessibility guidelines and WCAG 2.5.8 both require this.

| Element Type | Visual Size | Touch Target | Implementation |
|---|---|---|---|
| Primary CTA button | Full width × 48dp | Same | `h-12 w-full` |
| Icon button | 24×24dp | 48×48dp | `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}` |
| Tab bar item | 24dp icon + 12dp label | 56dp height, flex-1 width | `tabBarStyle: { height: 56 }` |
| Checkbox | 20×20dp | 48×48dp | Pressable wrapper `min-h-12 min-w-12` |
| Radio button | 20×20dp | 48×48dp | Same as checkbox |
| Badge (tappable) | 28×auto | 48×48dp | Pressable wrapper with hitSlop |
| List item (tappable) | Full width × auto | min 48dp height | `min-h-12` |
| Text link | Auto | 48dp height | `py-3` padding |

**Thumb zone:** On 5-inch budget Android phones (720×1280), the primary CTA must be in the bottom 40% of the screen. Bottom navigation at 56dp height.

### 1.3 Typography Scale (Inter via Google Fonts)

Font family: `Inter` for all texting. Loaded via `expo-font` on mobile, `@next/font/google` on web.

| Level | Size | Weight | Line Height | Letter Spacing | NativeWind Mobile | Tailwind Web | Usage |
|---|---|---|---|---|---|---|---|
| Display | 32px | 700 | 40px (1.25) | -0.5px | `text-3xl font-bold` | `text-3xl font-bold` | Ceremony title only |
| Headline | 24px | 600 | 32px (1.33) | -0.25px | `text-2xl font-semibold` | `text-2xl font-semibold` | Screen titles |
| Title | 20px | 500 | 28px (1.4) | 0 | `text-xl font-medium` | `text-xl font-medium` | Card titles, section headers |
| Subhead | 18px | 600 | 26px (1.44) | 0 | `text-lg font-semibold` | `text-lg font-semibold` | Price display |
| Body | 16px | 400 | 24px (1.5) | 0 | `text-base` | `text-base` | Body text, descriptions |
| Label | 14px | 500 | 20px (1.43) | 0.1px | `text-sm font-medium` | `text-sm font-medium` | Form labels, button text |
| Caption | 12px | 400 | 16px (1.33) | 0.2px | `text-xs` | `text-xs` | Timestamps, helper text |
| Micro | 11px | 500 | 14px (1.27) | 0.3px | `text-[11px] font-medium` | `text-[11px] font-medium` | Badge labels only |

**Rules:**
- Never below 12px on any screen. Budget Android (720p HD+) renders smaller sizes as blurry.
- Body text minimum 16px — WHO recommends this for mobile readability.
- Maximum line length: 45 characters on mobile, 75 on web.
- Filipino words can be long — test that words like "Verified" and "for rent" don't overflow.

### 1.4 Font Loading and Configuration

**Primary font:** Inter — clean, highly readable, excellent on budget Android at small sizes. Free via Google Fonts.

**Mobile (Expo SDK 55 — expo-font):**

```typescript
// apps/mobile/app/_layout.tsx
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Stack />;
}
```

**Font weight files required:**
| Weight | File | NativeWind Class | Usage |
|---|---|---|---|
| 400 Regular | `Inter_400Regular` | `font-normal` | Body text, descriptions, captions |
| 500 Medium | `Inter_500Medium` | `font-medium` | Labels, section headers, titles |
| 600 SemiBold | `Inter_600SemiBold` | `font-semibold` | Headings, CTAs, price display |
| 700 Bold | `Inter_700Bold` | `font-bold` | Display text (ceremony), emphasis |

**NativeWind fontFamily config:**
```javascript
// tailwind.config.js (mobile)
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
};
```

**Web (Next.js 16.2 — next/font/google):**
```typescript
// apps/web/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',       // Show fallback immediately, swap when loaded
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Fallback stack:** `Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`

**Budget Android rendering notes:**
- Inter renders well on HD+ (720p) displays down to 12px — tested on MediaTek Helio G50 chipsets
- Avoid font weights below 400 (light/thin) — they become unreadable on low-DPI screens
- `textAlignVertical: 'center'` may be needed on Android for vertical alignment in buttons
- Samsung Galaxy A-series and Redmi phones sometimes override font rendering — test on real devices
- Font file total size: ~120KB for all 4 weights (acceptable for 3G loading)
- Splash screen stays visible until fonts load — prevents flash of unstyled text (FOUT)

### 1.5 Color Token System

All colors specified with hex, WCAG contrast ratio against `#FAFAFA` background, and semantic name.

```
═══ PRIMARY ═══
  rayda:             #2B51E3    contrast 5.2:1 on #FAFAFA    (Forest green — trust, Filipino)
  rayda-light:       #EBF0FC    contrast 1.1:1 on #FAFAFA    (Badge/card backgrounds)
  rayda-dark:        #1A3BB0    contrast 8.1:1 on #FAFAFA    (Pressed/active states)

═══ NEUTRAL ═══
  bg:                #FAFAFA    —                             (App background)
  surface:           #FFFFFF    contrast 1.03:1 on #FAFAFA   (Cards, modals)
  text-primary:      #1A1A2E    contrast 14.8:1 on #FAFAFA   (Headings, body — AAA)
  text-secondary:    #6B7280    contrast 5.1:1 on #FAFAFA    (Captions, meta — AA)
  text-tertiary:     #9CA3AF    contrast 3.1:1 on #FAFAFA    (Placeholders — LARGE AA only)
  text-disabled:     #D1D5DB    contrast 1.8:1 on #FAFAFA    (Disabled — with disabled styling)
  border:            #E5E7EB    —                             (Card borders, dividers)
  border-focus:      #2B51E3    —                             (Input focus ring — matches primary)
  divider:           #F3F4F6    —                             (Section dividers, lighter than border)

═══ STATUS ═══
  verified:          #16A34A    (Green — universal 'verified/approved' signal)
  verified-bg:       #DCFCE7
  verified-border:   #86EFAC
  pending:           #D97706    contrast 4.6:1 on #FAFAFA    (Amber — review in progress)
  pending-bg:        #FEF3C7
  pending-border:    #FCD34D
  rejected:          #DC2626    contrast 5.4:1 on #FAFAFA    (Red — rejection, danger)
  rejected-bg:       #FEE2E2
  rejected-border:   #FCA5A5
  unverified:        #6B7280    (Same as text-secondary)
  unverified-bg:     #F3F4F6
  unverified-border: #D1D5DB

═══ SEMANTIC ═══
  warning:           #D97706    (Caution, pending actions)
  warning-bg:        #FEF3C7
  danger:            #DC2626    (Errors, scam reports, destructive actions)
  danger-bg:         #FEE2E2
  success:           #16A34A    (Confirmations, positive feedback)
  success-bg:        #DCFCE7
  info:              #1B4965    (Gabi Blue — informational callouts)
  info-bg:           #DBEAFE

═══ FRESHNESS ═══
  fresh:             #16A34A    ("Active today" — within 24h)
  recent:            #16A34A    ("Yesterday" — 24-48h)
  aging:             #D97706    ("3 days ago" / "1 week(s) ago" — 3-14 days)
  stale:             #DC2626    ("Not active" — 14+ days)
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
        'rayda': '#2B51E3',
        gabi: { DEFAULT: '#1B4965', light: '#DBEAFE' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
```

### 1.6 Icon Library

**Library:** `lucide-react-native` (tree-shakeable, consistent 24×24 stroke icons).
**Stroke width:** 2px default. 1.5px for smaller (16px) icons inside badges.
**Color:** Inherits text color via `color` prop.

| Context | Icon Name | Size | Color |
|---|---|---|---|
| Verified badge | `CheckCircle2` | 16px | `#2B51E3` |
| Pending badge | `Clock` | 16px | `#D97706` |
| Unverified badge | `Circle` | 16px | `#6B7280` |
| Rejected badge | `XCircle` | 16px | `#DC2626` |
| Search tab | `Search` | 24px | tab color |
| Inbox tab | `Inbox` | 24px | tab color |
| Listings tab | `Home` | 24px | tab color |
| Profile tab | `User` | 24px | tab color |
| Camera | `Camera` | 24px | `#6B7280` |
| Back arrow | `ArrowLeft` | 24px | `#1A1A2E` |
| Share | `Share2` | 24px | `#1A1A2E` |
| Phone call | `Phone` | 20px | `#FFFFFF` (on green bg) |
| Copy | `Copy` | 20px | `#2B51E3` |
| Report/flag | `Flag` | 20px | `#DC2626` |
| Water inclusion | `Droplets` | 16px | `#6B7280` |
| Electricity | `Zap` | 16px | `#6B7280` |
| WiFi | `Wifi` | 16px | `#6B7280` |
| Bathroom | `Bath` | 16px | `#6B7280` |
| Close/dismiss | `X` | 24px | `#6B7280` |
| Chevron right | `ChevronRight` | 20px | `#9CA3AF` |
| Add photo | `Plus` | 24px | `#6B7280` |

### 1.7 Verified Badge Component (Complete Specification)

The most important visual component in the entire app. Appears on every ListingCard, every profile view, every connection request, and the reveal screen.

**Container:** Height 28px, horizontal padding 8px (`px-2`), vertical padding 4px (`py-1`), border-radius 14px (full pill via `rounded-full`), 1px border, `flex-row items-center gap-1`.

**Content:** Icon 16px (lucide, strokeWidth 1.5) + Label 11px (`text-[11px] font-medium`).

| State | BG Class | Border Class | Icon | Icon Color | Label | Text Color |
|---|---|---|---|---|---|---|
| `verified` | `bg-green-100` | `border-green-300` | `CheckCircle2` | `#16A34A` | "Verified ✓" | `#16A34A` |
| `pending` | `bg-amber-100` | `border-amber-300` | `Clock` | `#92400E` | "Under review" | `#92400E` |
| `unverified` | `bg-gray-100` | `border-gray-300` | `Circle` | `#6B7280` | "Not verified" | `#6B7280` |
| `rejected` | `bg-red-100` | `border-red-300` | `XCircle` | `#DC2626` | "Not approved" | `#DC2626` |

**BPO Sub-badge (tenant only, when `employmentType === 'bpo'` AND `verificationStatus === 'verified'`):**
Additional pill below main badge: `bg-blue-100 border border-blue-300`, icon `Briefcase` 12px `#1E40AF`, label "BPO ✓" 10px `#1E40AF`. Height 22px.

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
- Base color: `#E5E7EB` (border color)
- Highlight color: `#F3F4F6` (divider color)
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
| Card press | Finger down on card | 100ms | Linear | `scale: 1→0.98, opacity: 1→0.95` |
| Pull-to-refresh | Pull gesture | Native | Native | `RefreshControl` component |
| Photo gallery swipe | Horizontal swipe | Native | `ScrollView` pagingEnabled | Native momentum |

### 1.10 Gesture Specifications

| Gesture | Screen | Behavior | Library |
|---|---|---|---|
| **Pull-to-refresh** | Search, Inbox | Native `RefreshControl`, tintColor="#2B51E3" | React Native built-in |
| **Photo gallery swipe** | Listing Detail | Horizontal scroll, `pagingEnabled`, `decelerationRate="fast"`. Snap to center of each photo. Overscroll: bounce on iOS, clamp on Android. | `ScrollView` |
| **Bottom sheet drag** | Connection Request Modal | Snap points: 40% (default), 0% (dismissed). Velocity threshold: >500px/s downward = dismiss. Handle bar: 4px × 40px, `#D1D5DB`, centered, `mt-2`. | `@gorhom/bottom-sheet` |
| **Card press** | ListingCard | `Pressable` with `onPressIn` → scale 0.98 (100ms), `onPressOut` → scale 1.0 (100ms). Cancel on pan (user scrolling, not tapping). | `react-native-reanimated` |
| **Swipe back** | All non-root screens | iOS: native edge swipe (Expo Router default). Android: hardware back button (see §1.12 back button table). | Expo Router |
| **Long press** | Listing photo in gallery | Open full-screen lightbox (future, not MVP). At MVP: no long press behavior. | N/A at MVP |

### 1.11 Dark Mode

**MVP: Light mode only.** Dark mode is explicitly excluded from the 30-day build scope. Reason: doubling the design surface for 18 screens is not justified at launch. The color token system in §1.5 is designed to support a dark mode extension later by adding `dark:` variants to each token.

When dark mode is added post-MVP: `bg` becomes `#121212`, `surface` becomes `#1E1E1E`, `text-primary` becomes `#E5E7EB`, and the brand blue `#2B51E3` lightens to `#5B7FFF` for sufficient contrast on dark backgrounds.

### 1.12 Navigation Structure

**Mobile — Bottom Tab Bar (Expo Router `(tabs)` layout)**

Tab bar height: 56dp. Background: `#FFFFFF`. Top border: 1px `#E5E7EB`. `tabBarHideOnKeyboard: true`.

```
LANDLORD TABS:
┌───────────┬───────────┬───────────┐
│  🏠       │  📥       │  👤       │
│ My       │ Inbox     │ Profile   │   3 tabs
│ Listings  │           │           │
└───────────┴───────────┴───────────┘

TENANT TABS:
┌───────────┬───────────┬───────────┐
│  🔍       │  📥       │  👤       │
│ Search     │ Inbox     │ Profile   │   3 tabs
└───────────┴───────────┴───────────┘
```

- Active tab: Icon + label in `rayda` green, pill indicator behind icon (`bg-rayda/10`, 48×24, rounded-full)
- Inactive tab: Icon + label in `#9CA3AF`
- Inbox badge: Red circle (10px diameter, -2px top, -2px right of icon), white text (8px), shows count of pending requests. Hides when count = 0.

**Screen hierarchy:**
```
Root (_layout.tsx)
├── (auth)/           # Unauthenticated screens
│   ├── phone.tsx     # Screen 1: PhoneEntry
│   ├── otp.tsx       # Screen 2: OTPVerify
│   └── role.tsx      # Screen 3: RoleSelection
├── (onboarding)/     # Post-auth, pre-main
│   ├── landlord-profile.tsx   # Screen 4
│   ├── tenant-profile.tsx     # Screen 8
│   ├── verify-id.tsx          # Screen 5
│   ├── property-proof.tsx     # Screen 6 (landlord only)
│   ├── employment-proof.tsx   # Screen 9 (tenant only)
│   ├── submitted.tsx          # Screen 10
│   └── verified.tsx           # Screen 11 (ceremony)
├── (tabs)/           # Main authenticated experience
│   ├── search/       # Tenant tab 1
│   │   ├── index.tsx          # Screen 12: ListingSearch
│   │   └── [id].tsx           # Screen 13: ListingDetail
│   ├── listings/     # Landlord tab 1
│   │   ├── index.tsx          # Landlord's own listings
│   │   └── create.tsx         # Screen 7: ListingCreate
│   ├── inbox/
│   │   └── index.tsx          # Screen 15: LandlordInbox / TenantSentRequests
│   └── profile/
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
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
│   └── KeyboardAvoidingView (behavior per platform)
│       └── View (className="flex-1 justify-center items-center px-5")
│           ├── Image (source={logo}, className="w-16 h-16 mb-8")
│           ├── Text (className="text-2xl font-semibold text-[#1A1A2E] text-center")
│           │   "Sign up or log in"
│           ├── Text (className="text-base text-[#6B7280] text-center mb-8")
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
│           └── Text (className="text-xs text-[#6B7280] text-center mt-4")
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
| 5 | **Offline** | Top banner: `View bg-amber-100 px-4 py-2 flex-row items-center gap-2` with `WifiOff` icon 16px + `Text "No internet. Check your connection." text-sm text-amber-800` | Disabled |
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
| 7 | **Success** | Green `CheckCircle2` icon (48px) appears center, scale 0→1 over 300ms. Auto-navigate to RoleSelection after 500ms. |

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
│   │  🏠                  │   │  Card: h-[120], border-2
│   │  "I'm renting out a place"    │   │  rounded-xl, p-4
│   │  "I have a unit     │   │  unselected: border-gray-200
│   │   for rent"      │   │  selected: border-rayda, bg-rayda-light
│   └──────────────────────┘   │  + CheckCircle2 icon top-right
│              gap-4           │
│   ┌──────────────────────┐   │
│   │  🔍                  │   │  Same card pattern
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
│       │   ├── Text (emoji 32px)
│       │   ├── Text (title — "I'm renting out a place")
│       │   ├── Text (description — caption)
│       │   └── [if selected] CheckCircle2 icon (absolute top-3 right-3, color rayda)
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
│        │  📷    │            │  bg-gray-200 placeholder
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
│  │ ℹ️ Why is this needed?    │  │  (ID → employment)
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
│  │  📷 TAKE PHOTO OF ID  │  │  CTA 1: disabled until
│  └────────────────────────┘  │  consent checked + ID type selected
│                              │  Opens back camera
│  ┌────────────────────────┐  │
│  │  📷 TAKE SELFIE        │  │  CTA 2: hidden until ID captured
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
│  │  📷 TAKE PHOTO OF DOCUMENT │  │  CTA: disabled until type selected
│  └────────────────────────┘  │
│                              │
│  "I don't have a document       │  Skip link
│   now — skip for now"     │
│                              │
│  ⚠️ "If you skip this,   │  Warning caption (text-xs, text-amber-700)
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
│  │☐ 💧Tubig  ☐ ⚡Kuryente│  │  2 columns, each h-10
│  │☐ 📶WiFi   ☐ 🚿CR     │  │
│  │☐ ❄️Aircon ☐ 🅿️Parking│  │
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
│  📷 Photos (1-5)        │
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
│        │  📷    │            │
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
│  │  📷 TAKE PHOTO OF DOCUMENT │  │  Camera CTA
│  └────────────────────────┘  │
│                              │
│  [if captured] Photo preview │  120×80 thumbnail + retake
│  [if uploading] Progress bar │
│                              │
│  "I don't have a document —     │  Skip: stays unverified
│   skip for now"              │  Cannot send connection requests
│                              │
│  ⚠️ "If you skip this,   │  Warning: text-xs text-amber-700
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
│         │ ⏳  │              │  (lucide: Clock)
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
│         │  SHIELD │          │  CheckCircle2 icon 32px white
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
│  │ 📤 SHARE WITH          │  │  Secondary CTA (border-rayda)
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
│       │       └── CheckCircle2 (32px, white)
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
**This is the primary tenant experience screen.**

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  "Find a listing"         │  Title (20px, font-medium)
│  "Hello, [Name]!"         │  Greeting (14px, text-secondary)
│                              │
│  ┌────────────────────────┐  │
│  │ 🔍 Where? (barangay)   │  │  Search input: h-11, bg-gray-100
│  └────────────────────────┘  │  rounded-lg, Search icon left
│                              │  Shows suggestions on focus
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │₱ Min │ │₱ Max │ │Type ▾│ │  Filter chips: h-9, rounded-full
│  └──────┘ └──────┘ └──────┘ │  bg-gray-100, text-sm
│                              │  Active filter: bg-rayda-light
│  "12 verified listings"     │  Results count (12px, text-secondary)
│                              │
│  ┌──────────────────────────┐│  FlashList (not FlatList)
│  │┌────────────────────────┐││  estimatedItemSize={280}
│  ││ [  PHOTO 16:9 h-48   ] │││
│  │├────────────────────────┤││  ListingCard component
│  ││ ₱5,000/month           │││  (reusable, defined below)
│  ││ Bedspace · Ugong, Pasig│││
│  ││ ┌──────────────┐       │││
│  ││ │✓ Verified │       │││  VerifiedBadge (always verified
│  ││ └──────────────┘       │││  since only verified shown)
│  ││ 🟢 Active yesterday      │││  FreshnessIndicator
│  │└────────────────────────┘││
│  │                          ││
│  │┌────────────────────────┐││  gap between cards: mb-4 (16px)
│  ││ [Next listing card...] │││
│  │└────────────────────────┘││
│  └──────────────────────────┘│
│                              │
│  ┌────────────────────────┐  │  Pagination: NOT infinite scroll
│  │   LOAD MORE (page 2)  │  │  (3G performance concern)
│  └────────────────────────┘  │  10 items per page
│                              │
├──────────┬─────────┬─────────┤
│ 🔍Search │📥Inbox  │👤Profile│  Bottom tabs (56dp)
└──────────┴─────────┴─────────┘
```

**Component Tree:**
```
ListingSearchScreen
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
│   ├── View (className="px-5 pt-4")
│   │   ├── Text (title — "Hanap ng listing")
│   │   ├── Text (greeting — "Kamusta, [Name]!")
│   │   ├── SearchInput (barangay autocomplete)
│   │   │   └── View (className="flex-row bg-gray-100 rounded-lg h-11 items-center px-3 gap-2")
│   │   │       ├── Search icon (20px, gray)
│   │   │       └── TextInput (placeholder="Saan?", flex-1)
│   │   └── FilterChips (horizontal scroll)
│   │       └── ScrollView (horizontal)
│   │           └── [for each filter] Pressable (chip — selected: bg-rayda-light)
│   ├── Text (results count — "12 verified listings")
│   ├── FlashList (estimatedItemSize={280}, data={listings})
│   │   └── [for each listing] ListingCard (component below)
│   ├── [if loading] SkeletonCards (3 shimmer placeholders)
│   ├── [if empty] EmptyStateView (icon + headline + CTA)
│   └── Pressable (load more — "I-LOAD PA (page 2)")
├── [if offline] NetworkBanner
└── BottomTabBar
```

**ListingCard TypeScript Interface:**
```typescript
interface ListingCardProps {
  id: string;
  thumbnailUrl: string;            // First photo R2 public URL
  monthlyRent: number;             // ₱ amount
  unitType: 'bedspace' | 'room' | 'apartment';
  barangay: string;
  city: string;
  landlordName: string;
  verificationStatus: 'verified';  // Only verified shown in search
  lastActiveAt: string;            // ISO timestamp for freshness calc
  onPress: () => void;             // Navigate to [id].tsx
}
```

**ListingCard NativeWind:**
```
Container: bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden
Photo: w-full h-48 (expo-image, contentFit="cover", cachePolicy="memory-disk")
ContentWrap: p-4
Price: text-lg font-semibold text-rayda
Meta: text-sm text-gray-600 mt-1  (format: "Bedspace · Ugong, Pasig")
Badge: mt-2 (VerifiedBadge component)
Freshness: text-xs mt-2 (color from freshness token system)
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
| 7 | **Refreshing** | Pull-to-refresh: RefreshControl (tintColor="#2B51E3") |

---

### SCREEN 13: ListingDetailScreen (Tenant)

**Route:** `apps/mobile/app/(tabs)/search/[id].tsx`

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  ←              [Share][Flag]│  Header: back + share + report
│                              │
│  ┌────────────────────────┐  │  Photo gallery: ScrollView
│  │                        │  │  horizontal, pagingEnabled
│  │    PHOTO GALLERY       │  │  h-64, full width
│  │    (swipeable)         │  │  expo-image, contentFit="cover"
│  │    ● ○ ○ ○             │  │  Dot indicators below
│  └────────────────────────┘  │  2px dots, 8px gap
│                              │
│  ₱5,000/month               │  Price: text-2xl font-bold text-rayda
│                              │
│  Bedspace · Ugong, Pasig    │  Meta: text-base text-secondary
│                              │
│  ┌────────────────────────┐  │  Landlord card: bg-gray-50
│  │ ┌──┐ Juan D.     │  │  rounded-xl, p-4, flex-row
│  │ │📷│ ✓ Verified     │  │  Photo 48×48 circle
│  │ │48 │                   │  │  Name: text-base font-medium
│  │ └──┘                   │  │  Badge: VerifiedBadge
│  └────────────────────────┘  │
│                              │
│  🟢 Active yesterday           │  FreshnessIndicator
│                              │
│  ────────────────────────── │  Divider: h-px bg-gray-200 my-4
│                              │
│  Included in rent:            │  Label (14px, font-medium)
│  ┌──────┐ ┌────────┐ ┌────┐ │  Chips: bg-gray-100 rounded-full
│  │💧Tubig│ │⚡Kuryente│ │📶  │ │  px-3 py-1, icon 16px + text 12px
│  └──────┘ └────────┘ └────┘ │
│                              │
│  1 bed · Available Dec 15  │  Body (16px)
│  Advance: 1 month           │
│  Deposit: 2 months           │
│                              │
│  "Malinis na bedspace malapit│  Description: text-base
│   sa Ortigas. Walking       │  text-secondary, mt-2
│   distance sa Shaw MRT."    │
│                              │
│  ────────────────────────── │
│                              │
│  ┌────────────────────────┐  │  Anti-scam card: bg-rayda-light
│  │ ✓ "This landlord is │  │  rounded-lg, p-3
│  │ verified —    │  │  text-xs text-rayda
│  │ they have a confirmed ID and     │  │  italic
│  │ property proof. You will  │  │
│  │ never be asked to pay │  │
│  │ anything on this app."          │  │
│  └────────────────────────┘  │
│                              │
│══════════════════════════════│  Fixed bottom bar: h-20
│ ┌──────────────────────────┐ │  bg-white, border-t border-gray-200
│ │  CONNECT WITH JUAN   │ │  CTA: h-12, bg-rayda (if verified)
│ └──────────────────────────┘ │  or bg-amber-500 (if unverified)
│ ⚠ Report this listing      │  or bg-gray-300 (if already sent)
│══════════════════════════════│  Report link: text-xs text-secondary
```

**Component Tree:**
```
ListingDetailScreen
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
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
│  │ ┌──────────────────┐   │  │  Optional message
│  │ │ "Hi! BPO      │   │  │  TextInput multiline
│  │ │  worker based   │   │  │  h-24, border-gray-300
│  │ │  in Ortigas..."  │   │  │  rounded-lg, p-3
│  │ └──────────────────┘   │  │  maxLength=200
│  │ 42/200                 │  │  Counter: text-xs text-right
│  │                        │  │
│  │ ┌──────────────────┐   │  │
│  │ │  SEND      │   │  │  CTA: h-12, bg-rayda
│  │ │  REQUEST          │   │  │  full width
│  │ └──────────────────┘   │  │
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

**ASCII Wireframe (Landlord View):**
```
┌──────────────────────────────┐
│  "Connection Requests"    │  Title (20px)
│  "3 pending"                │  Subtitle (14px, text-secondary)
│                              │
│  ┌──────────────────────────┐│
│  │ ┌──┐ Maria Santos       ││  Photo: 48×48 circle
│  │ │📷│ ✓ Verified       ││  Name: text-base font-medium
│  │ │  │ BPO · Concentrix    ││  Badge + employer
│  │ └──┘                     ││
│  │                          ││
│  │ "Hi! BPO worker po   ││  Message preview: text-sm
│  │  ako sa Ortigas. Inte..."││  text-secondary, numberOfLines=2
│  │                          ││
│  │ For: Bedspace Ugong  ││  Listing ref: text-xs text-secondary
│  │ Yesterday                  ││  Timestamp: text-xs text-secondary
│  │                          ││
│  │ ┌──────────┐ ┌─────────┐││  Action buttons: h-10 each
│  │ │ Accept│ │Decline│││  Accept: bg-rayda text-white
│  │ │ (Accept) │ │(Decline)│││  Decline: bg-gray-100 text-gray-700
│  │ └──────────┘ └─────────┘││  flex-row gap-3
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ [Next request card...]   ││
│  └──────────────────────────┘│
│                              │
├──────────┬─────────┬─────────┤
│🏠Listings│📥Inbox  │👤Profile│
└──────────┴─────────┴─────────┘
```

**Component Tree:**
```
LandlordInboxScreen
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
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
│         ┌─────────┐          │  Handshake icon container
│         │  🤝     │          │  64×64, bg-rayda-light
│         │         │          │  rounded-2xl
│         └─────────┘          │  ANIMATION: scale 0→1 (spring)
│                              │
│  "You are now connected! ✓"     │  Display (32px, bold, text-rayda)
│                              │  text-center
│  "You are both         │  Body (16px, text-secondary)
│   verified. Here are the   │  text-center, px-6
│   contact details:"                 │
│                              │
│  ┌────────────────────────┐  │  Contact card: bg-rayda-light
│  │ ┌──┐                  │  │  rounded-2xl, p-5
│  │ │📷│ [Other Party Name]│  │  Photo: 56×56 circle
│  │ │56 │ ✓ Verified    │  │  Name: text-lg font-semibold
│  │ └──┘                   │  │  Badge: VerifiedBadge
│  │                        │  │
│  │ 📱 +63 917 123 4567   │  │  PHONE: text-2xl font-bold
│  │                        │  │  text-rayda, mt-4
│  │ ┌──────────┐ ┌───────┐ │  │  
│  │ │ 📞 CALL  │ │📋 COPY│ │  │  Buttons: h-11 each
│  │ │(bg-rayda)│ │(border)│ │  │  Call: bg-rayda text-white
│  │ └──────────┘ └───────┘ │  │  Copy: border-rayda text-rayda
│  └────────────────────────┘  │  Call → Linking.openURL(`tel:+63...`)
│                              │  Copy → Clipboard + toast "Copied!"
│  ┌────────────────────────┐  │
│  │ 📤 SHARE WITH          │  │  Share button: border-rayda
│  │    FRIENDS       │  │  Opens native share sheet
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
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
│   ├── Header (back arrow)
│   └── View (className="flex-1 justify-center items-center px-6")
│       ├── Animated.View (handshake — spring scale 0→1, stiffness 200, damping 15)
│       │   └── View (w-16 h-16 bg-rayda-light rounded-2xl items-center justify-center)
│       │       └── Handshake icon (32px, text-rayda)
│       ├── Text ("Magkausap na kayo! ✓" text-3xl font-bold text-rayda mt-6)
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

**ASCII Wireframe:**
```
┌──────────────────────────────┐
│  "Profile"                   │  Title
│                              │
│  ┌────────────────────────┐  │  Profile card: bg-white
│  │ ┌────┐ Juan Dela Cruz  │  │  rounded-xl, shadow-sm, p-4
│  │ │PHOTO│ ✓ Verified   │  │  Photo: 56×56 circle
│  │ │ 56 │ Landlord · Pasig │  │  Name: text-lg font-semibold
│  │ └────┘                  │  │  Badge + role + city
│  └────────────────────────┘  │
│                              │
│  ── VERIFICATION STATUS ──  │  Section header: text-sm
│  ┌────────────────────────┐  │  font-medium text-secondary
│  │ Government ID   ✓ OK   >│  │  uppercase, tracking-wide
│  ├────────────────────────┤  │
│  │ Property Proof  ⏳ Pend >│  │  Each row: h-12, flex-row
│  ├────────────────────────┤  │  justify-between items-center
│  │ [Complete verification]>│  │  ChevronRight icon
│  └────────────────────────┘  │  Tap → navigate to re-upload
│                              │  if rejected
│  ── MGA CONNECTIONS ──       │
│  ┌────────────────────────┐  │
│  │ 3 active connections   >│  │  Tap → connections list
│  └────────────────────────┘  │
│                              │
│  ── SETTINGS ──              │
│  ┌────────────────────────┐  │  Settings rows
│  │ Privacy Policy         >│  │  each h-12
│  ├────────────────────────┤  │
│  │ Terms of Service       >│  │
│  ├────────────────────────┤  │
│  │ About         >│  │  (About — shows version)
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │  Logout: text-danger
│  │     LOG OUT         │  │  border-danger, bg-transparent
│  └────────────────────────┘  │  Confirmation dialog before logout
│                              │
├──────────┬─────────┬─────────┤
│🏠/🔍    │📥Inbox  │👤Profile│
└──────────┴─────────┴─────────┘
```


**Component Tree:**
```
ProfileScreen
├── SafeAreaView (className="flex-1 bg-[#FAFAFA]")
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
│  ✕  "Report"             │  X close button + title
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

### WEB SCREEN 1: Landing Page
**Route:** `apps/web/app/page.tsx`

**Sections (top to bottom):**
1. **Hero:** App name + "Here, you don't need connections" + "Download the app" button (links to Play Store)
2. **How it works:** 3-column: "Sign Up" (Phone icon) → "Get Verified" (Shield icon) → "Connect" (Handshake icon). Each with 1-sentence simple English description.
3. **Trust counter:** Live count from API: "[X] verified landlords in Pasig, [Y] verified tenants." Updated every page load (ISR not needed — just fetch).
4. **Testimonial placeholder:** "Stories from verified users" — empty at launch, filled post-launch.
5. **Anti-scam block:** "We are not Lamudi. We are not Rentpad. Here, everyone is verified — before you connect, we check first."
6. **Footer:** Privacy Policy | Terms of Service | Contact (email) | "Built in the Philippines 🇵🇭"

**Mobile responsive:** Single column below 768px. Hero CTA full-width on mobile.

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
3. **All icons:** Paired with text labels. Never icon-only buttons (except back arrow and close X — these are universally understood).
4. **All images:** `accessibilityLabel` describing content. Listing photos: "Photo of [unitType] in [barangay]."
5. **Color:** Never color-only information. Status badges use icon + text + color.
6. **Navigation:** Maximum 3 levels deep from any tab. Flat hierarchy.
7. **Language:** Simple English for all user-facing copy. English for system errors (developer debugging).
8. **Keyboard (web):** All forms navigable with Tab key. Enter submits forms. Escape closes modals.
9. **Screen readers:** All custom components have `accessibilityRole`, `accessibilityLabel`, `accessibilityState`.

