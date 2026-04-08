export const colors = {
  // Primary — RentRayda Blue (#2D79BF is THE brand blue)
  brand: '#2D79BF',
  brandDark: '#24628F',
  brandBright: '#60A5FA',
  brandLight: '#DBEAFE',

  // Neutral
  background: '#F0F2F5',
  surface: '#FFFFFF',
  inputBg: '#E4E6EB',
  border: '#CED0D4',
  divider: '#DADDE1',
  textPrimary: '#050505',
  textSecondary: '#65676B',
  textTertiary: '#8A8D91',

  // Status
  verified: '#16A34A',
  danger: '#E41E3F',
  warning: '#F7B928',
  success: '#16A34A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontDisplay: 'Sentient',
  fontHeading: 'Sentient',
  fontBody: 'Be Vietnam Pro',

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
