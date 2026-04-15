import type { BrandConfig } from '../types'
import { baseColors } from '../base/colors'
import { baseTypography } from '../base/typography'
import { baseSpacing } from '../base/spacing'
import { baseMotion } from '../base/motion'

/**
 * Couleurs custom StoreMD non incluses dans BrandColors standard.
 * A importer separement dans les compositions qui en ont besoin
 * (score circles, severity badges, etc.).
 */
export const storeMdScoreColors = {
  excellent: '#16a34a',
  good: '#65a30d',
  warning: '#ca8a04',
  poor: '#ea580c',
  critical: '#dc2626',
} as const

export const storeMdSeverityColors = {
  critical: '#dc2626',
  major: '#ea580c',
  minor: '#ca8a04',
  info: '#2563eb',
} as const

export const storeMdBrand: BrandConfig = {
  id: 'store-md',
  name: 'StoreMD',
  tagline: 'Your Shopify store health score in 60 seconds. Free.',
  description:
    'AI agent that monitors Shopify store health: performance, apps, listings, agentic readiness, accessibility.',

  colors: {
    ...baseColors,
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#06b6d4',
    accentAlt: '#16a34a',

    background: '#050507',
    backgroundAlt: '#0a0a0f',
    surface: '#0d1117',

    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    border: '#1e293b',
    overlay: 'rgba(5, 5, 7, 0.85)',
  },

  typography: {
    ...baseTypography,
    fontDisplay: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    fontMono: 'JetBrains Mono',
  },

  spacing: {
    ...baseSpacing,
  },

  motion: {
    ...baseMotion,
    springSnappy: { damping: 18, mass: 0.8, stiffness: 180, overshootClamping: false },
    springSmooth: { damping: 14, mass: 1, stiffness: 140, overshootClamping: false },
    springBouncy: { damping: 12, mass: 0.8, stiffness: 160, overshootClamping: false },
    springCinematic: { damping: 35, mass: 1.2, stiffness: 70 },
  },

  assets: {
    logoSvg: 'images/store-md-logo.png',
    logoPng: 'images/store-md-logo.png',
    logoWhite: 'images/store-md-logo-white.png',
  },
}
