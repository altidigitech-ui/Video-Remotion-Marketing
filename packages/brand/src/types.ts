export type ColorScale = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export type BrandColors = {
  primary: string
  secondary: string
  accent: string
  accentAlt: string

  background: string
  backgroundAlt: string
  surface: string

  textPrimary: string
  textSecondary: string
  textMuted: string

  success: string
  warning: string
  error: string
  info: string

  border: string
  overlay: string
  white: string
  black: string
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type BrandTypography = {
  fontDisplay: string
  fontBody: string
  fontMono: string

  sizeXs: number
  sizeSm: number
  sizeMd: number
  sizeLg: number
  sizeXl: number
  size2xl: number
  size3xl: number
  size4xl: number
  size5xl: number
  size6xl: number
  size7xl: number

  weightLight: FontWeight
  weightRegular: FontWeight
  weightMedium: FontWeight
  weightSemibold: FontWeight
  weightBold: FontWeight
  weightExtrabold: FontWeight
  weightBlack: FontWeight

  lineHeightTight: number
  lineHeightNormal: number
  lineHeightRelaxed: number

  trackingTight: number
  trackingNormal: number
  trackingWide: number
  trackingWidest: number
}

export type BrandSpacing = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
  xxxl: number

  paddingScreen: number
  paddingSection: number
  gutter: number
  borderRadius: number
  borderRadiusLg: number
}

export type SpringConfig = {
  damping: number
  mass: number
  stiffness: number
  overshootClamping?: boolean
}

export type BrandMotion = {
  durationFast: number
  durationNormal: number
  durationSlow: number
  durationVerySlow: number

  springSnappy: SpringConfig
  springSmooth: SpringConfig
  springBouncy: SpringConfig
  springCinematic: SpringConfig
}

export type BrandAssets = {
  logoSvg: string
  logoPng: string
  logoWhite?: string
  logoDark?: string
  favicon?: string
  backgroundMusic?: string
  transitionSound?: string
}

export type BrandConfig = {
  id: string
  name: string
  tagline: string
  description: string

  colors: BrandColors
  typography: BrandTypography
  spacing: BrandSpacing
  motion: BrandMotion
  assets: BrandAssets
}
