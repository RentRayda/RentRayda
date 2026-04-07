export const colors = {
  // Primary — RentRayda Blue
  brand: '#2B51E3',
  brandDark: '#1D4ED8',
  brandBright: '#60A5FA',
  brandLight: '#DBEAFE',

  // Neutral — Facebook-aligned
  background: '#F0F2F5',
  surface: '#FFFFFF',
  inputBg: '#E4E6EB',
  border: '#CED0D4',
  divider: '#DADDE1',
  textPrimary: '#050505',
  textSecondary: '#65676B',
  textTertiary: '#8A8D91',

  // Status — Facebook-aligned
  verified: '#31A24C',
  danger: '#E41E3F',
  warning: '#F7B928',
  success: '#31A24C',
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
  // TAN Nimbus — logo wordmark, headers, accent text
  fontBrand: 'TANNimbus',
  fontHeading: 'TANNimbus',
  fontAccent: 'TANNimbus',
  // Noto Sans Osage — all body text, labels, buttons, etc.
  fontBody: 'NotoSansOsage',
  fontBodyBold: 'NotoSansOsage',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
