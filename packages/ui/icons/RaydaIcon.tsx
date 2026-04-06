import * as React from 'react';
import Svg, { Path, Circle, type SvgProps } from 'react-native-svg';

export type RaydaIconName =
  | 'home' | 'home-filled' | 'search' | 'plus-circle' | 'bell' | 'bell-filled'
  | 'user' | 'user-filled' | 'camera' | 'shield-check' | 'clock' | 'x-circle'
  | 'circle' | 'phone' | 'copy' | 'share' | 'flag' | 'droplet' | 'zap'
  | 'wifi' | 'wifi-off' | 'bath' | 'snowflake' | 'car' | 'arrow-left'
  | 'chevron-right' | 'x' | 'filter' | 'heart' | 'heart-filled'
  | 'bookmark' | 'bookmark-filled' | 'map-pin' | 'building' | 'bed'
  | 'calendar' | 'peso-sign' | 'image' | 'check' | 'info' | 'handshake'
  | 'edit' | 'menu' | 'star' | 'eye' | 'eye-off' | 'send' | 'message-circle';

export interface RaydaIconProps extends Omit<SvgProps, 'width' | 'height'> {
  name: RaydaIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Each icon defined as SVG path data for a 24x24 viewBox, 2px stroke, round caps/joins.
// Paths derived from open-source Lucide icons (ISC license), customized for RentRayda brand weight.
const ICONS: Record<RaydaIconName, (sw: number) => React.ReactNode> = {
  home: (sw) => (
    <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeWidth={sw} fill="none" />
  ),
  'home-filled': (sw) => (
    <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeWidth={sw} fill="currentColor" />
  ),
  search: (sw) => (
    <>
      <Circle cx="11" cy="11" r="7" strokeWidth={sw} fill="none" />
      <Path d="M21 21l-4.35-4.35" strokeWidth={sw} fill="none" />
    </>
  ),
  'plus-circle': (sw) => (
    <>
      <Circle cx="12" cy="12" r="10" strokeWidth={sw} fill="none" />
      <Path d="M12 8v8M8 12h8" strokeWidth={sw} fill="none" />
    </>
  ),
  bell: (sw) => (
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" strokeWidth={sw} fill="none" />
  ),
  'bell-filled': (sw) => (
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" strokeWidth={sw} fill="currentColor" />
  ),
  user: (sw) => (
    <>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="7" r="4" strokeWidth={sw} fill="none" />
    </>
  ),
  'user-filled': (sw) => (
    <>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth={sw} fill="currentColor" />
      <Circle cx="12" cy="7" r="4" strokeWidth={sw} fill="currentColor" />
    </>
  ),
  camera: (sw) => (
    <>
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="13" r="4" strokeWidth={sw} fill="none" />
    </>
  ),
  'shield-check': (sw) => (
    <>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth={sw} fill="none" />
      <Path d="M9 12l2 2 4-4" strokeWidth={sw} fill="none" />
    </>
  ),
  clock: (sw) => (
    <>
      <Circle cx="12" cy="12" r="10" strokeWidth={sw} fill="none" />
      <Path d="M12 6v6l4 2" strokeWidth={sw} fill="none" />
    </>
  ),
  'x-circle': (sw) => (
    <>
      <Circle cx="12" cy="12" r="10" strokeWidth={sw} fill="none" />
      <Path d="M15 9l-6 6M9 9l6 6" strokeWidth={sw} fill="none" />
    </>
  ),
  circle: (sw) => (
    <Circle cx="12" cy="12" r="10" strokeWidth={sw} fill="none" />
  ),
  phone: (sw) => (
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeWidth={sw} fill="none" />
  ),
  copy: (sw) => (
    <>
      <Path d="M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z" strokeWidth={sw} fill="none" />
      <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={sw} fill="none" />
    </>
  ),
  share: (sw) => (
    <>
      <Circle cx="18" cy="5" r="3" strokeWidth={sw} fill="none" />
      <Circle cx="6" cy="12" r="3" strokeWidth={sw} fill="none" />
      <Circle cx="18" cy="19" r="3" strokeWidth={sw} fill="none" />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" strokeWidth={sw} fill="none" />
    </>
  ),
  flag: (sw) => (
    <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" strokeWidth={sw} fill="none" />
  ),
  droplet: (sw) => (
    <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" strokeWidth={sw} fill="none" />
  ),
  zap: (sw) => (
    <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth={sw} fill="none" />
  ),
  wifi: (sw) => (
    <>
      <Path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="20" r="1" fill="currentColor" strokeWidth={0} />
    </>
  ),
  'wifi-off': (sw) => (
    <>
      <Path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="20" r="1" fill="currentColor" strokeWidth={0} />
    </>
  ),
  bath: (sw) => (
    <Path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h1a2 2 0 012 2v1" strokeWidth={sw} fill="none" />
  ),
  snowflake: (sw) => (
    <Path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5" strokeWidth={sw} fill="none" />
  ),
  car: (sw) => (
    <>
      <Path d="M5 17h14v-5H5v5zM5 12l2-6h10l2 6" strokeWidth={sw} fill="none" />
      <Circle cx="7.5" cy="15.5" r="1.5" strokeWidth={sw} fill="none" />
      <Circle cx="16.5" cy="15.5" r="1.5" strokeWidth={sw} fill="none" />
    </>
  ),
  'arrow-left': (sw) => (
    <Path d="M19 12H5M12 19l-7-7 7-7" strokeWidth={sw} fill="none" />
  ),
  'chevron-right': (sw) => (
    <Path d="M9 18l6-6-6-6" strokeWidth={sw} fill="none" />
  ),
  x: (sw) => (
    <Path d="M18 6L6 18M6 6l12 12" strokeWidth={sw} fill="none" />
  ),
  filter: (sw) => (
    <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeWidth={sw} fill="none" />
  ),
  heart: (sw) => (
    <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeWidth={sw} fill="none" />
  ),
  'heart-filled': (sw) => (
    <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeWidth={sw} fill="currentColor" />
  ),
  bookmark: (sw) => (
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth={sw} fill="none" />
  ),
  'bookmark-filled': (sw) => (
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth={sw} fill="currentColor" />
  ),
  'map-pin': (sw) => (
    <>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="10" r="3" strokeWidth={sw} fill="none" />
    </>
  ),
  building: (sw) => (
    <Path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" strokeWidth={sw} fill="none" />
  ),
  bed: (sw) => (
    <Path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9" strokeWidth={sw} fill="none" />
  ),
  calendar: (sw) => (
    <>
      <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" strokeWidth={sw} fill="none" />
    </>
  ),
  'peso-sign': (sw) => (
    <Path d="M6 4h6a5 5 0 010 10H6V4zM6 9h12M6 13h12" strokeWidth={sw} fill="none" />
  ),
  image: (sw) => (
    <>
      <Path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" strokeWidth={sw} fill="none" />
      <Circle cx="8.5" cy="8.5" r="1.5" strokeWidth={sw} fill="none" />
      <Path d="M21 15l-5-5L5 21" strokeWidth={sw} fill="none" />
    </>
  ),
  check: (sw) => (
    <Path d="M20 6L9 17l-5-5" strokeWidth={sw} fill="none" />
  ),
  info: (sw) => (
    <>
      <Circle cx="12" cy="12" r="10" strokeWidth={sw} fill="none" />
      <Path d="M12 16v-4M12 8h.01" strokeWidth={sw} fill="none" />
    </>
  ),
  handshake: (sw) => (
    <Path d="M11 17l-2 2-4-4 5-5 3 3M17 11l-3-3M7 7L3 11l4 4M21 13l-4-4-5 5 2 2M14 17l3 3 4-4" strokeWidth={sw} fill="none" />
  ),
  edit: (sw) => (
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth={sw} fill="none" />
  ),
  menu: (sw) => (
    <Path d="M3 12h18M3 6h18M3 18h18" strokeWidth={sw} fill="none" />
  ),
  star: (sw) => (
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth={sw} fill="none" />
  ),
  eye: (sw) => (
    <>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth={sw} fill="none" />
      <Circle cx="12" cy="12" r="3" strokeWidth={sw} fill="none" />
    </>
  ),
  'eye-off': (sw) => (
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24M1 1l22 22" strokeWidth={sw} fill="none" />
  ),
  send: (sw) => (
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth={sw} fill="none" />
  ),
  'message-circle': (sw) => (
    <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeWidth={sw} fill="none" />
  ),
};

export function RaydaIcon({
  name,
  size = 24,
  color = '#65676B',
  strokeWidth = 2,
  ...props
}: RaydaIconProps) {
  const iconFn = ICONS[name];
  if (!iconFn) return null;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      {...props}
    >
      {iconFn(strokeWidth)}
    </Svg>
  );
}
