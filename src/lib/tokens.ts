// Design tokens — Moov Ninja V2 design language
// Mint + dark navy palette, Mulish font

export const colors = {
  // Brand
  mint: '#1DFB9D',
  mintDim: '#1A745A',
  mintGlow: 'rgba(29, 251, 157, 0.15)',

  // Backgrounds
  pageBg: '#0A0B1E',
  cardBg: '#171B2D',
  cardBgHover: '#1E2340',
  surfaceBg: '#1E2340',

  // Text
  textPrimary: '#FDFFFF',
  textSecondary: 'rgba(253,255,255,0.55)',
  textMuted: 'rgba(253,255,255,0.30)',

  // Borders
  borderMint: '#1DFB9D',
  borderSubtle: 'rgba(253,255,255,0.08)',
  borderDim: '#1A745A',

  // Status
  statusReady: '#1DFB9D',
  statusReadyBg: 'rgba(29, 251, 157, 0.12)',
  statusIssue: '#FF4D6A',
  statusIssueBg: 'rgba(255, 77, 106, 0.12)',
  statusProcessing: '#F5A623',
  statusProcessingBg: 'rgba(245, 166, 35, 0.12)',
  statusShipped: '#4DA6FF',
  statusShippedBg: 'rgba(77, 166, 255, 0.12)',
  statusDelivered: '#1DFB9D',
  statusDeliveredBg: 'rgba(29, 251, 157, 0.12)',

  // Channels
  tiktok: '#FF0050',
  shopify: '#96BF48',
  amazon: '#FF9900',
  etsy: '#F45800',
  woocommerce: '#7F54B3',
  ebay: '#0064D2',
  manual: '#6B7280',
} as const

export const radii = {
  card: 18,
  badge: 6,
  pill: 99,
  input: 10,
} as const

export const shadows = {
  card: '0 4px 4px rgba(0,0,0,0.25)',
  cardHover: '0 8px 24px rgba(29, 251, 157, 0.10)',
  glow: '0 0 20px rgba(29, 251, 157, 0.20)',
} as const

export const font = {
  family: 'Mulish, sans-serif',
  size: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
  weight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const

// The master card/panel style — use this as base for all cards
export const cardStyle = {
  background: colors.cardBg,
  border: `1px solid ${colors.borderMint}`,
  borderRadius: radii.card,
  boxShadow: shadows.card,
} as const
