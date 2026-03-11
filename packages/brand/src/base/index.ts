import type { BrandConfig } from '../types'
import { baseColors } from './colors'
import { baseTypography } from './typography'
import { baseSpacing } from './spacing'
import { baseMotion } from './motion'

export { baseColors } from './colors'
export { baseTypography } from './typography'
export { baseSpacing } from './spacing'
export { baseMotion } from './motion'

export const baseBrand: BrandConfig = {
  id: 'altidigitech',
  name: 'Altidigitech',
  tagline: 'Digital innovation for modern SaaS',
  description: 'Central video template library for the Altidigitech SaaS portfolio',

  colors: baseColors,
  typography: baseTypography,
  spacing: baseSpacing,
  motion: baseMotion,
  assets: {
    logoSvg: 'images/altidigitech-logo.svg',
    logoPng: 'images/altidigitech-logo.png',
    // TODO: remplacer par les assets reels
  },
}
