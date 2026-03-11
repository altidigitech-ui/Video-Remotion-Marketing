# .claude/brand-system.md

# Skill : Brand System — BrandKit, Design Tokens & Identité Visuelle

> **Quand lire ce fichier** : Avant de créer ou modifier tout composant
> qui utilise des couleurs, fonts, espacement ou assets visuels.
> Prérequis : avoir lu `remotion-basics.md`.

---

## 1. PHILOSOPHIE DU BRAND SYSTEM

### Principe fondamental

**Un seul endroit de vérité pour chaque valeur de design.**

```
packages/brand/
  └── src/
      ├── base/          ← Tokens globaux Altidigitech
      ├── [saas-name]/   ← Override du SaaS
      └── [nouveau-saas] ← Override prochain SaaS
```

### Hiérarchie des tokens

```
Base Altidigitech (défaut)
        ↓ override
  BrandKit SaaS ([saas-name], golddesk, etc.)
        ↓ utilisation
  Composants + Templates
```

> ⚠️ **Règle absolue pour Claude Code** :
> Ne jamais écrire une couleur, font ou taille en dur dans un composant.
> Toujours importer depuis `@altidigitech/brand`.

---

## 2. STRUCTURE DU PACKAGE BRAND

```
packages/brand/
├── src/
│   ├── types.ts                  ← Types TypeScript du BrandKit
│   ├── base/
│   │   ├── colors.ts             ← Palette couleurs Altidigitech
│   │   ├── typography.ts         ← Fonts et tailles de texte
│   │   ├── spacing.ts            ← Espacement et layout
│   │   ├── motion.ts             ← Durées et easing d'animation
│   │   └── index.ts              ← Export du brand de base
│   ├── [saas-name]/
│   │   ├── colors.ts             ← Couleurs du SaaS
│   │   ├── typography.ts         ← Fonts du SaaS
│   │   ├── assets.ts             ← Chemins vers les assets du SaaS
│   │   ├── config.ts             ← Config complète du SaaS
│   │   └── index.ts              ← Export du brand du SaaS
│   └── _template/
│       ├── colors.ts
│       ├── typography.ts
│       ├── assets.ts
│       ├── config.ts
│       └── index.ts
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

---

## 3. TYPES TYPESCRIPT DU BRAND SYSTEM

```typescript
// packages/brand/src/types.ts

// ─── COULEURS ────────────────────────────────────────────────────────────────

export type ColorScale = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string // Couleur principale
  600: string
  700: string
  800: string
  900: string
  950: string
}

export type BrandColors = {
  // Couleurs sémantiques
  primary: string // Couleur principale de la marque
  secondary: string // Couleur secondaire
  accent: string // Couleur d'accentuation (CTA, highlights)
  accentAlt: string // Variante accent (dégradés)

  // Backgrounds
  background: string // Fond principal
  backgroundAlt: string // Fond alternatif (cards, sections)
  surface: string // Surface élevée (modals, tooltips)

  // Texte
  textPrimary: string // Texte principal
  textSecondary: string // Texte secondaire
  textMuted: string // Texte discret

  // États
  success: string
  warning: string
  error: string
  info: string

  // Utilitaires
  border: string // Couleur des bordures
  overlay: string // Overlay semi-transparent (rgba)
  white: string
  black: string
}

// ─── TYPOGRAPHIE ─────────────────────────────────────────────────────────────

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type BrandTypography = {
  // Familles de fonts
  fontDisplay: string // Headlines, titres
  fontBody: string // Corps de texte
  fontMono: string // Code, données

  // Tailles (en px, pour Remotion)
  sizeXs: number // 12
  sizeSm: number // 16
  sizeMd: number // 20
  sizeLg: number // 24
  sizeXl: number // 32
  size2xl: number // 40
  size3xl: number // 48
  size4xl: number // 64
  size5xl: number // 80
  size6xl: number // 96
  size7xl: number // 128

  // Poids
  weightLight: FontWeight // 300
  weightRegular: FontWeight // 400
  weightMedium: FontWeight // 500
  weightSemibold: FontWeight // 600
  weightBold: FontWeight // 700
  weightExtrabold: FontWeight // 800
  weightBlack: FontWeight // 900

  // Line heights
  lineHeightTight: number // 1.1
  lineHeightNormal: number // 1.5
  lineHeightRelaxed: number // 1.75

  // Letter spacing (em)
  trackingTight: number // -0.02
  trackingNormal: number // 0
  trackingWide: number // 0.05
  trackingWidest: number // 0.15
}

// ─── ESPACEMENT ──────────────────────────────────────────────────────────────

export type BrandSpacing = {
  xs: number // 8
  sm: number // 16
  md: number // 24
  lg: number // 40
  xl: number // 64
  xxl: number // 96
  xxxl: number // 160

  // Layout
  paddingScreen: number // Padding latéral de la composition (80)
  paddingSection: number // Padding entre sections (120)
  gutter: number // Espacement entre éléments (24)
  borderRadius: number // Border radius standard (16)
  borderRadiusLg: number // Border radius large (32)
}

// ─── MOTION ──────────────────────────────────────────────────────────────────

export type SpringConfig = {
  damping: number
  mass: number
  stiffness: number
  overshootClamping?: boolean
}

export type BrandMotion = {
  // Durées en frames (à 60fps)
  durationFast: number // 20 frames (~0.33s)
  durationNormal: number // 30 frames (0.5s)
  durationSlow: number // 60 frames (1s)
  durationVerySlow: number // 120 frames (2s)

  // Configs spring prêtes à l'emploi
  springSnappy: SpringConfig
  springSmooth: SpringConfig
  springBouncy: SpringConfig
  springCinematic: SpringConfig
}

// ─── ASSETS ──────────────────────────────────────────────────────────────────

export type BrandAssets = {
  logoSvg: string // Chemin vers le logo SVG
  logoPng: string // Chemin vers le logo PNG
  logoWhite?: string // Version logo blanc (sur fond sombre)
  logoDark?: string // Version logo noir (sur fond clair)
  favicon?: string // Icône carrée
  backgroundMusic?: string // Musique de fond par défaut
  transitionSound?: string // Son de transition
}

// ─── BRAND KIT COMPLET ───────────────────────────────────────────────────────

export type BrandConfig = {
  id: string // Identifiant unique du SaaS (ex: 'my-saas')
  name: string // Nom affiché (ex: 'My SaaS')
  tagline: string // Tagline courte
  description: string // Description une phrase

  colors: BrandColors
  typography: BrandTypography
  spacing: BrandSpacing
  motion: BrandMotion
  assets: BrandAssets
}
```

---

## 4. BRAND DE BASE ALTIDIGITECH

```typescript
// packages/brand/src/base/colors.ts
import type { BrandColors } from '../types'

export const baseColors: BrandColors = {
  primary: '#FFFFFF',
  secondary: '#A5B4FC',
  accent: '#6366F1', // Indigo — couleur signature Altidigitech
  accentAlt: '#8B5CF6', // Violet

  background: '#0A0A0A', // Noir profond
  backgroundAlt: '#111111',
  surface: '#1A1A1A',

  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textMuted: '#6B7280',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  border: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#FFFFFF',
  black: '#000000',
}
```

```typescript
// packages/brand/src/base/typography.ts
import type { BrandTypography } from '../types'

export const baseTypography: BrandTypography = {
  fontDisplay: 'Inter',
  fontBody: 'Inter',
  fontMono: 'JetBrains Mono',

  sizeXs: 12,
  sizeSm: 16,
  sizeMd: 20,
  sizeLg: 24,
  sizeXl: 32,
  size2xl: 40,
  size3xl: 48,
  size4xl: 64,
  size5xl: 80,
  size6xl: 96,
  size7xl: 128,

  weightLight: 300,
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightExtrabold: 800,
  weightBlack: 900,

  lineHeightTight: 1.1,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,

  trackingTight: -0.02,
  trackingNormal: 0,
  trackingWide: 0.05,
  trackingWidest: 0.15,
}
```

```typescript
// packages/brand/src/base/spacing.ts
import type { BrandSpacing } from '../types'

export const baseSpacing: BrandSpacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  xxl: 96,
  xxxl: 160,

  paddingScreen: 80,
  paddingSection: 120,
  gutter: 24,
  borderRadius: 16,
  borderRadiusLg: 32,
}
```

```typescript
// packages/brand/src/base/motion.ts
import type { BrandMotion } from '../types'

export const baseMotion: BrandMotion = {
  durationFast: 20,
  durationNormal: 30,
  durationSlow: 60,
  durationVerySlow: 120,

  springSnappy: {
    damping: 200,
    mass: 0.5,
    stiffness: 400,
  },
  springSmooth: {
    damping: 12,
    mass: 1,
    stiffness: 100,
  },
  springBouncy: {
    damping: 8,
    mass: 0.8,
    stiffness: 150,
    overshootClamping: false,
  },
  springCinematic: {
    damping: 20,
    mass: 2,
    stiffness: 80,
  },
}
```

---

## 5. EXEMPLE DE BRAND KIT SAAS

```typescript
// packages/brand/src/[saas-name]/colors.ts
import type { BrandColors } from '../types'

export const mySaasColors: BrandColors = {
  primary: '#FFFFFF',
  secondary: '#B3B3B3',
  accent: 'TODO_ACCENT_COLOR', // ex: '#6366F1' — couleur signature du SaaS
  accentAlt: 'TODO_ACCENT_ALT_COLOR', // ex: '#8B5CF6' — variante plus foncée

  background: 'TODO_BG_COLOR', // ex: '#0A0A0A'
  backgroundAlt: '#141414',
  surface: '#1F1F1F',

  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#737373',

  success: '#10B981',
  warning: '#F5A623',
  error: '#EF4444',
  info: '#3B82F6',

  border: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.7)',
  white: '#FFFFFF',
  black: '#000000',
}
```

```typescript
// packages/brand/src/[saas-name]/config.ts
import type { BrandConfig } from '../types'
import { mySaasColors } from './colors'
import { baseTypography } from '../base/typography'
import { baseSpacing } from '../base/spacing'
import { baseMotion } from '../base/motion'

export const mySaasBrand: BrandConfig = {
  id: 'TODO_SAAS_ID', // ex: 'my-saas'
  name: 'TODO_SAAS_NAME', // ex: 'My SaaS'
  tagline: 'TODO_TAGLINE',
  description: 'TODO_DESCRIPTION',

  colors: mySaasColors,

  typography: {
    ...baseTypography,
    // TODO: Override si fonts différentes du base brand
    // fontDisplay: 'TODO_FONT',
  },

  spacing: {
    ...baseSpacing,
    // TODO: Override si besoin (ex: paddingScreen: 96)
  },

  motion: {
    ...baseMotion,
    // TODO: Override si animations spécifiques au SaaS
  },

  assets: {
    logoSvg: 'projects/TODO_SAAS_ID/public/logo.svg',
    logoPng: 'projects/TODO_SAAS_ID/public/logo.png',
    logoWhite: 'projects/TODO_SAAS_ID/public/logo-white.svg',
    // backgroundMusic: 'projects/TODO_SAAS_ID/public/sounds/bg.mp3',
    // transitionSound: 'projects/TODO_SAAS_ID/public/sounds/whoosh.mp3',
  },
}
```

---

## 6. TEMPLATE POUR NOUVEAU SAAS

```typescript
// packages/brand/src/_template/config.ts
// INSTRUCTIONS POUR CLAUDE CODE :
// 1. Copier ce dossier _template/ → [nom-du-saas]/
// 2. Remplacer TOUTES les valeurs TODO
// 3. Créer les assets dans projects/[nom-du-saas]/public/
// 4. Exporter depuis packages/brand/src/index.ts

import type { BrandConfig } from '../types'
import { baseColors } from '../base/colors'
import { baseTypography } from '../base/typography'
import { baseSpacing } from '../base/spacing'
import { baseMotion } from '../base/motion'

export const templateBrand: BrandConfig = {
  id: 'TODO_SAAS_ID', // ex: 'golddesk'
  name: 'TODO_SAAS_NAME', // ex: 'Gold Desk AI'
  tagline: 'TODO_TAGLINE', // ex: 'Trade smarter with AI'
  description: 'TODO_DESCRIPTION',

  colors: {
    ...baseColors,
    // TODO: Override les couleurs spécifiques au SaaS
    accent: 'TODO_ACCENT_COLOR', // ex: '#F59E0B' pour or/gold
    accentAlt: 'TODO_ACCENT_ALT_COLOR', // ex: '#D97706'
    background: 'TODO_BG_COLOR', // ex: '#0A0A0A'
  },

  typography: {
    ...baseTypography,
    // TODO: Override si fonts différentes
    // fontDisplay: 'TODO_FONT',
  },

  spacing: {
    ...baseSpacing,
    // TODO: Override si besoin
  },

  motion: {
    ...baseMotion,
    // TODO: Override si animations différentes
  },

  assets: {
    logoSvg: 'projects/TODO_SAAS_ID/public/logo.svg',
    logoPng: 'projects/TODO_SAAS_ID/public/logo.png',
    logoWhite: 'projects/TODO_SAAS_ID/public/logo-white.svg',
    // backgroundMusic: 'projects/TODO_SAAS_ID/public/sounds/bg.mp3',
  },
}
```

---

## 7. UTILISATION DANS LES COMPOSANTS

### Import du BrandKit

```typescript
// ✅ Import depuis le package brand — TOUJOURS comme ça
import { mySaasBrand } from '@altidigitech/brand/[saas-name]'
import type { BrandConfig } from '@altidigitech/brand'

// ✅ Pour un composant générique (accepte n'importe quel brand)
type MyComponentProps = {
  brand: BrandConfig
  text: string
}

export const MyComponent: React.FC<MyComponentProps> = ({ brand, text }) => {
  return (
    <div style={{
      color: brand.colors.textPrimary,
      backgroundColor: brand.colors.background,
      fontFamily: brand.typography.fontDisplay,
      fontSize: brand.typography.size3xl,
      fontWeight: brand.typography.weightBold,
      padding: brand.spacing.md,
      borderRadius: brand.spacing.borderRadius,
    }}>
      {text}
    </div>
  )
}
```

### Dégradés depuis les couleurs brand

```typescript
// Dégradé accent → accentAlt
const accentGradient = (brand: BrandConfig) =>
  `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`

// Dégradé sombre pour les overlays
const darkOverlay = (brand: BrandConfig, opacity = 0.8) =>
  `linear-gradient(180deg, transparent 0%, ${brand.colors.background}${Math.round(opacity * 255).toString(16)} 100%)`

// Usage
<div style={{ background: accentGradient(brand) }}>
  Texte sur dégradé
</div>
```

### Utiliser les springs brand

```typescript
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

const AnimatedTitle: React.FC<{ brand: BrandConfig; text: string }> = ({
  brand,
  text,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Utiliser les configs spring du brand — JAMAIS hardcoder
  const translateY = spring({
    frame,
    fps,
    from: 60,
    to: 0,
    config: brand.motion.springSmooth,  // ← depuis le brand
  })

  const opacity = interpolate(frame, [0, brand.motion.durationNormal], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      color: brand.colors.textPrimary,
      fontFamily: brand.typography.fontDisplay,
      fontSize: brand.typography.size4xl,
      fontWeight: brand.typography.weightBold,
      letterSpacing: `${brand.typography.trackingTight}em`,
      lineHeight: brand.typography.lineHeightTight,
    }}>
      {text}
    </div>
  )
}
```

---

## 8. COMPOSANTS DE BRAND PRÊTS À L'EMPLOI

### `<BrandLogo>`

```typescript
// packages/core/src/components/BrandLogo/BrandLogo.tsx
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type BrandLogoProps = {
  brand: BrandConfig
  variant?: 'default' | 'white' | 'dark'
  size?: number
  animate?: boolean
  delay?: number
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  variant = 'white',
  size = 120,
  animate = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoSrc = variant === 'white'
    ? brand.assets.logoWhite ?? brand.assets.logoSvg
    : variant === 'dark'
    ? brand.assets.logoDark ?? brand.assets.logoPng
    : brand.assets.logoSvg

  const scale = animate
    ? spring({
        frame: frame - delay,
        fps,
        from: 0.8,
        to: 1,
        config: brand.motion.springBouncy,
      })
    : 1

  const opacity = animate
    ? interpolate(frame, [delay, delay + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1

  return (
    <Img
      src={staticFile(logoSrc)}
      style={{
        width: size,
        height: 'auto',
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  )
}
```

### `<BrandHeadline>`

```typescript
// packages/core/src/components/BrandHeadline/BrandHeadline.tsx
import type { BrandConfig } from '@altidigitech/brand'

export type BrandHeadlineProps = {
  brand: BrandConfig
  text: string
  size?: keyof BrandConfig['typography']
  color?: 'primary' | 'accent' | 'muted'
  gradient?: boolean
  align?: 'left' | 'center' | 'right'
}

export const BrandHeadline: React.FC<BrandHeadlineProps> = ({
  brand,
  text,
  size = 'size4xl',
  color = 'primary',
  gradient = false,
  align = 'center',
}) => {
  const colorMap = {
    primary: brand.colors.textPrimary,
    accent: brand.colors.accent,
    muted: brand.colors.textMuted,
  }

  const textStyle: React.CSSProperties = gradient
    ? {
        background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : { color: colorMap[color] }

  return (
    <div style={{
      ...textStyle,
      fontFamily: brand.typography.fontDisplay,
      fontSize: brand.typography[size] as number,
      fontWeight: brand.typography.weightBold,
      letterSpacing: `${brand.typography.trackingTight}em`,
      lineHeight: brand.typography.lineHeightTight,
      textAlign: align,
    }}>
      {text}
    </div>
  )
}
```

### `<BrandBackground>`

```typescript
// packages/core/src/components/BrandBackground/BrandBackground.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type BrandBackgroundProps = {
  brand: BrandConfig
  variant?: 'solid' | 'gradient' | 'radial'
  animated?: boolean
}

export const BrandBackground: React.FC<BrandBackgroundProps> = ({
  brand,
  variant = 'solid',
  animated = false,
}) => {
  const frame = useCurrentFrame()

  const getBackground = () => {
    switch (variant) {
      case 'solid':
        return brand.colors.background

      case 'gradient':
        const angle = animated
          ? 135 + (frame * 0.1)  // rotation lente si animé
          : 135
        return `linear-gradient(${angle}deg, ${brand.colors.background}, ${brand.colors.backgroundAlt})`

      case 'radial':
        return `radial-gradient(ellipse at center, ${brand.colors.backgroundAlt} 0%, ${brand.colors.background} 70%)`

      default:
        return brand.colors.background
    }
  }

  return (
    <AbsoluteFill style={{ background: getBackground() }} />
  )
}
```

---

## 9. AJOUTER UN NOUVEAU SAAS — PROCÉDURE COMPLÈTE

```bash
# 1. Utiliser le script de scaffold
bun new:saas [nom-du-saas]
# ex: bun new:saas golddesk
```

Cela crée automatiquement :

```
packages/brand/src/golddesk/   ← BrandKit à remplir
projects/golddesk/             ← Projet Remotion
projects/golddesk/public/      ← Assets à fournir
```

Ensuite, **Claude Code doit** :

```typescript
// 1. Remplir packages/brand/src/[saas-name]/config.ts
// avec les vraies valeurs (couleurs, fonts, nom, tagline)

// 2. Exporter depuis packages/brand/src/index.ts
export { mySaasBrand } from './[saas-name]/config'

// 3. Créer les compositions dans projects/[saas-name]/src/
// en utilisant le BrandKit mySaasBrand

// 4. Ajouter les scripts dans package.json racine
// "dev:[saas-name]": "remotion studio projects/[saas-name]/src/index.ts",
// "render:[saas-name]": "bun scripts/render-formats.ts --saas=[saas-name]",
```

---

## 10. PALETTES DE COULEURS RECOMMANDÉES PAR SECTEUR

Pour créer rapidement un BrandKit cohérent selon le type de SaaS :

```typescript
// SaaS Finance / Trading (Gold Desk AI, etc.)
const financeColors = {
  accent: '#F59E0B', // Or ambré
  accentAlt: '#D97706', // Or foncé
  background: '#0A0A0A',
  surface: '#1A1A1A',
}

// SaaS Tech / Dev Tools
const techColors = {
  accent: '#6366F1', // Indigo (Altidigitech base)
  accentAlt: '#8B5CF6', // Violet
  background: '#0F0F0F',
  surface: '#1A1A1A',
}

// SaaS Créatif / Vidéo / Média
const creativeColors = {
  accent: '#E50914', // Rouge
  accentAlt: '#B20710', // Rouge foncé
  background: '#000000',
  surface: '#1F1F1F',
}

// SaaS Santé / Wellness
const healthColors = {
  accent: '#10B981', // Vert émeraude
  accentAlt: '#059669', // Vert foncé
  background: '#0A0F0E',
  surface: '#111A18',
}

// SaaS Marketing / Growth
const marketingColors = {
  accent: '#F97316', // Orange
  accentAlt: '#EA580C', // Orange foncé
  background: '#0A0805',
  surface: '#1A1410',
}

// SaaS B2B / Enterprise
const enterpriseColors = {
  accent: '#3B82F6', // Bleu
  accentAlt: '#2563EB', // Bleu foncé
  background: '#0A0C10',
  surface: '#111520',
}
```

---

## 11. CHECKLIST BRAND SYSTEM

Avant de livrer un composant ou template, vérifier :

- [ ] Aucune couleur hardcodée — tout vient de `brand.colors.*`
- [ ] Aucune font hardcodée — tout vient de `brand.typography.font*`
- [ ] Aucune taille de texte hardcodée — tout vient de `brand.typography.size*`
- [ ] Aucun espacement hardcodé — tout vient de `brand.spacing.*`
- [ ] Aucune config spring hardcodée — tout vient de `brand.motion.spring*`
- [ ] Le composant accepte `brand: BrandConfig` en prop (générique)
- [ ] Les assets sont chargés via `staticFile(brand.assets.logoSvg)`
- [ ] Le BrandKit du SaaS est exporté depuis `packages/brand/src/index.ts`
- [ ] Les overrides du BrandKit SaaS étendent bien le base brand (`...baseColors`)
- [ ] Un TODO est laissé pour chaque asset manquant

---

_Skill : brand-system.md — Altidigitech Video Templates_
_Lire ensuite : `.claude/new-template.md` pour créer un nouveau template vidéo_
