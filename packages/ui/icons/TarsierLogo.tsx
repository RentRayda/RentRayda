import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, type SvgProps } from 'react-native-svg';

/**
 * RentRayda Tarsier Logo — leaping Philippine tarsier silhouette.
 * Derived from the brand logo: white tarsier on blue gradient background.
 *
 * Usage:
 *   <TarsierLogo size={64} />                  // Full logo with gradient bg
 *   <TarsierLogo size={24} variant="icon" />   // White silhouette only (for dark bg)
 *   <TarsierLogo size={24} variant="mono" color="#050505" />  // Single color
 */

interface TarsierLogoProps extends Omit<SvgProps, 'width' | 'height'> {
  size?: number;
  variant?: 'full' | 'icon' | 'mono';
  color?: string;
}

// Tarsier silhouette path — leaping pose facing right
const TARSIER_PATH =
  'M72 38c-2-4-5-7-9-9-3-2-7-3-10-2l-3 1c-1-3-3-6-6-8-4-3-8-4-13-3' +
  'l-2-4c-1-3-4-5-7-5-4-1-7 0-10 2-2 2-4 5-4 8l0 3c-3 1-5 3-6 6' +
  'l-1 4c-1 4 0 8 2 11l3 5c0 3 1 6 3 8l4 5c2 2 4 3 7 3l3 0c2 2 5 3 8 3' +
  'l5-1 4-2c3 0 6-1 8-3l2-2c2 0 4-1 6-3l3-4c2-3 3-6 3-10l0-3c1-2 1-5 0-7' +
  'l-1-3z' +
  'M28 32c1-2 3-3 5-3 2 0 4 1 5 3 1 1 1 3 0 5-1 2-3 3-5 3-2 0-4-1-5-3-1-2-1-3 0-5z' +
  'M42 30c1-1 2-2 4-2 1 0 3 1 3 2 1 1 1 3 0 4-1 1-2 2-3 2-2 0-3-1-4-2-1-1-1-3 0-4z';

export function TarsierLogo({ size = 64, variant = 'full', color, ...props }: TarsierLogoProps) {
  const viewBox = '0 0 100 100';

  if (variant === 'mono') {
    return (
      <Svg width={size} height={size} viewBox={viewBox} {...props}>
        <Path d={TARSIER_PATH} fill={color || '#050505'} />
      </Svg>
    );
  }

  if (variant === 'icon') {
    return (
      <Svg width={size} height={size} viewBox={viewBox} {...props}>
        <Path d={TARSIER_PATH} fill={color || '#FFFFFF'} />
      </Svg>
    );
  }

  // Full variant: gradient background + white silhouette
  return (
    <Svg width={size} height={size} viewBox={viewBox} {...props}>
      <Defs>
        <LinearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#24628F" />
          <Stop offset="1" stopColor="#60A5FA" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="100" rx="22" fill="url(#logoGradient)" />
      <Path d={TARSIER_PATH} fill="#FFFFFF" />
    </Svg>
  );
}
