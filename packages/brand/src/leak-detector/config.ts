import type { BrandConfig } from '../types'
import { baseColors } from '../base/colors'
import { baseTypography } from '../base/typography'
import { baseSpacing } from '../base/spacing'
import { baseMotion } from '../base/motion'

export const leakDetectorBrand: BrandConfig = {
  id: 'leak-detector',
  name: 'Leak Detector',
  tagline: 'Find the CRO leaks killing your conversions',
  description:
    'SaaS CRO audit tool that scans landing pages and identifies conversion rate optimization issues across 8 categories.',

  colors: {
    ...baseColors,
    primary: '#0F172A',
    secondary: '#1E293B',
    accent: '#F59E0B',
    accentAlt: '#D97706',

    background: '#0F172A',
    backgroundAlt: '#1E293B',
    surface: '#334155',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    border: '#334155',
    overlay: 'rgba(15, 23, 42, 0.8)',
  },

  typography: {
    ...baseTypography,
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    fontMono: 'JetBrains Mono',
  },

  spacing: {
    ...baseSpacing,
  },

  motion: {
    ...baseMotion,
    springSnappy: { damping: 15, mass: 0.8, stiffness: 200, overshootClamping: false },
    springSmooth: { damping: 12, mass: 0.8, stiffness: 160, overshootClamping: false },
    springBouncy: { damping: 10, mass: 0.8, stiffness: 180, overshootClamping: false },
    springCinematic: { damping: 30, mass: 1.2, stiffness: 80 },
  },

  assets: {
    logoSvg: 'images/leak-detector-logo.png',
    logoPng: 'images/leak-detector-logo.png',
    logoWhite: 'images/leak-detector-logo-white.png',
  },
}
