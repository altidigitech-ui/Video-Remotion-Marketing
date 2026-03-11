// INSTRUCTIONS POUR CLAUDE CODE :
// 1. Copier ce dossier _template/ vers [nom-du-saas]/
// 2. Remplacer TOUTES les valeurs TODO ci-dessous
// 3. Creer les assets dans projects/[nom-du-saas]/public/
// 4. Exporter depuis packages/brand/src/index.ts

import type { BrandConfig } from '../types'
import { baseColors } from '../base/colors'
import { baseTypography } from '../base/typography'
import { baseSpacing } from '../base/spacing'
import { baseMotion } from '../base/motion'

export const templateBrand: BrandConfig = {
  id: 'TODO_SAAS_ID',
  name: 'TODO_SAAS_NAME',
  tagline: 'TODO_TAGLINE',
  description: 'TODO_DESCRIPTION',

  colors: {
    ...baseColors,
    // TODO: Override les couleurs specifiques au SaaS
    accent: 'TODO_ACCENT_COLOR',
    accentAlt: 'TODO_ACCENT_ALT_COLOR',
    background: 'TODO_BG_COLOR',
  },

  typography: {
    ...baseTypography,
    // TODO: Override si fonts differentes du base brand
    // fontDisplay: 'TODO_FONT',
  },

  spacing: {
    ...baseSpacing,
    // TODO: Override si besoin
  },

  motion: {
    ...baseMotion,
    // TODO: Override si animations differentes
  },

  assets: {
    logoSvg: 'projects/TODO_SAAS_ID/public/logo.svg',
    logoPng: 'projects/TODO_SAAS_ID/public/logo.png',
    logoWhite: 'projects/TODO_SAAS_ID/public/logo-white.svg',
    // backgroundMusic: 'projects/TODO_SAAS_ID/public/sounds/bg.mp3',
  },
}
