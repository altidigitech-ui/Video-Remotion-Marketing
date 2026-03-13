# CLAUDE.md — projects/leak-detector

> Lis ce fichier après le CLAUDE.md racine et les `.claude/*.md`.
> Source de vérité pour tout ce qui concerne le projet Leak Detector.

---

## Ce SaaS

- **Nom** : Leak Detector
- **URL** : leakdetector.tech
- **Tagline** : Find the CRO leaks killing your conversions
- **Description** : SaaS CRO audit — scanne une landing page et identifie les problèmes de conversion sur 8 catégories. Rapport en ~60 secondes.
- **Secteur** : MarTech / CRO
- **Cible** : Founders, growth marketers, indie hackers, agences web

---

## Brand

- **Accent** : `#F59E0B` (amber)
- **AccentAlt** : `#D97706` (amber foncé — gradients)
- **Background** : `#050A14` (dark cyberpunk)
- **Primary** : `#0F172A`
- **Style** : Premium dark, cyberpunk, data-driven
- **Font display** : Space Grotesk (chargé via `@remotion/google-fonts`)
- **Font body** : Inter
- **Font mono** : JetBrains Mono

---

## Données réelles (utiliser dans les compositions)

- Score CRO moyen : **73/100**
- **58%** des pages n'ont aucune social proof above the fold
- **42%** ont des CTAs faibles ("Get Started", "Learn More")
- **3.2** problèmes en moyenne par page
- 8 catégories d'audit : Social Proof, CTA, Copy, Urgency, Trust, Layout, Mobile UX, Page Speed

---

## Pricing

- **Free** : 3 analyses/mois — €0
- **Pro** : 50 analyses/mois — €29/mois
- **Agency** : 200 analyses/mois — €99/mois

---

## Assets disponibles

### Logos
- `public/logo/logo.png` — logo complet (texte + icône)
- `public/logo/logo-white.png` — version blanche

> Dans les compositions, utiliser `staticFile('logo/logo.png')` ou passer via `brand.assets.logoPng`

### Screenshots (tous présents dans `public/screenshots/`)
- `dashboard-categories.png` — dashboard avec scores par catégorie
- `dashboard-report.png` — rapport d'analyse complet
- `landing-hero.png` — hero de la landing page
- `landing-how-it-works.png` — section "how it works"
- `landing-dimensions.png` — section dimensions/features
- `landing-stats.png` — section statistiques
- `pricing.png` — page pricing
- `social-proof.png` — section social proof

> Référencer avec `staticFile('screenshots/[nom].png')`

---

## Compositions — État actuel (16 compositions)

### Widescreen 1920×1080 @ 60fps

| ID | Composant | Durée | Props |
|---|---|---|---|
| `leak-detector-logo-reveal` | `LDLogoReveal` | 3s (180f) | `brand, showTagline?` |
| `leak-detector-product-demo` | `LDProductDemo` | 8s (480f) | `brand, headline, subline, features[], ctaText, ctaUrl?` |
| `leak-detector-launch` | `LDLaunchAnnouncement` | 9s (540f) | `brand, headline, subline?, launchDate?, features?, ctaText` |
| `leak-detector-stats` | `LDStatsShowcase` (via LeakDetectorScene) | 8s (480f) | template générique |
| `leak-detector-how-it-works` | `LDHowItWorks` (via LeakDetectorScene) | 8s (480f) | template générique |
| `leak-detector-feature-cro` | `LDFeatureHighlight` (direct) | 7s (420f) | template générique |
| `leak-detector-cinematic-hero` | `LDCinematicHero` | 30s (1800f) | `brand` |
| `leak-detector-before-after` | `LDBeforeAfter` | 20s (1200f) | `brand` |
| `leak-detector-screen-dashboard` | `LDScreenDashboard` | 10s (600f) | `brand` |

### Vertical 1080×1920 @ 30fps

| ID | Composant | Durée | FPS |
|---|---|---|---|
| `leak-detector-social-vertical` | `LDSocialShort` (direct) | 8s (240f) | 30 |
| `leak-detector-social-stats-vertical` | `LDStatsShowcase` (via LeakDetectorScene) | 10s (300f) | 30 |
| `leak-detector-problem-agitation` | `LDProblemAgitation` | 15s (450f) | 30 |
| `leak-detector-screen-hero-vertical` | `LDScreenHeroVertical` | 11s (660f) | 60 |

### Square 1080×1080 @ 30fps

| ID | Composant | Durée | FPS |
|---|---|---|---|
| `leak-detector-social-square` | `LDSocialShort` (direct) | 6s (180f) | 30 |
| `leak-detector-stats-square` | `LDStatsShowcase` (via LeakDetectorScene) | 8s (240f) | 30 |
| `leak-detector-screen-square` | `LDScreenSquare` | 6s (360f) | 60 |

---

## Composants disponibles dans `src/components/`

### `LeakDetectorScene`
Wrapper qui ajoute `LDBackground` + `LogoOverlay` autour du contenu enfant.
```typescript
import { LeakDetectorScene } from './components/LeakDetectorScene'

type LeakDetectorSceneProps = {
  brand: BrandConfig
  children: React.ReactNode
  showLogo?: boolean    // défaut: true
  showBadge?: boolean   // défaut: false
  logoSize?: number     // défaut: 52
}

// Usage
<LeakDetectorScene brand={brand}>
  {/* ton contenu — NE PAS ajouter LDBackground ni LogoOverlay ici */}
</LeakDetectorScene>
```

> ⚠️ Si tu utilises `LeakDetectorScene`, ne rajoute PAS `LDBackground` ni `LogoOverlay` à l'intérieur.

### `ScoreCircle`
Cercle de score animé (arc SVG qui se remplit).
```typescript
import { ScoreCircle } from './components/ScoreCircle'

type ScoreCircleProps = {
  score: number          // 0-100
  size: number           // diamètre en px
  strokeWidth?: number   // défaut: 8
  frame: number
  startFrame: number     // frame à partir de laquelle l'animation démarre
  animDuration?: number  // durée de l'animation en frames (défaut: 60)
}
```

### `CategoryScoreBar`
Barre de score horizontal avec label, pour lister les catégories CRO.
```typescript
import { CategoryScoreBar } from './components/CategoryScoreBar'

type CategoryData = {
  label: string
  score: number   // 0-100
}

type CategoryScoreBarProps = {
  data: CategoryData
  frame: number
  startFrame: number
  // couleur déterminée automatiquement: vert ≥80, amber ≥60, rouge <60
}
```

### `LeakDetectorBadge`
Badge "AI-Powered CRO Analysis" avec dot pulsé — version spécifique au projet.
```typescript
import { LeakDetectorBadge } from './components/LeakDetectorBadge'

type LeakDetectorBadgeProps = {
  brand: BrandConfig
  text?: string   // défaut: "AI-Powered CRO Analysis"
}
```

### `LeakDetectorBackground`
Background alternatif (sans orbital light). Préférer `LDBackground` de `@altidigitech/core`.
```typescript
import { LeakDetectorBackground } from './components/LeakDetectorBackground'
// Pas de props
```

---

## Composants core disponibles dans `@altidigitech/core`

```typescript
import {
  LDBackground,   // fond cyberpunk animé (grid + particules + orb orbital) — PREMIER enfant
  GlowText,       // texte gradient blanc→amber
  GlowButton,     // bouton CTA amber
  GlassCard,      // carte glass morphism
  AIBadge,        // badge "AI-Powered CRO Analysis" pulsé
  LogoOverlay,    // logo bottom-right, fade in — DERNIER enfant
} from '@altidigitech/core'

// Signatures
<LDBackground brand={brand} />
<GlowText brand={brand} size={96} glow={true}>{children}</GlowText>
<GlowButton text="→ Scan your page free" brand={brand} scale={1} />
<GlassCard brand={brand} glow={false}>{children}</GlassCard>
<AIBadge frame={frame} />
<LogoOverlay brand={brand} frame={frame} />
```

---

## Règles spécifiques à ce projet

1. **Un seul `LogoOverlay` ou `LeakDetectorScene` par composition** — jamais les deux
2. **`LDBackground` toujours premier enfant** si tu n'utilises pas `LeakDetectorScene`
3. **`LogoOverlay` toujours dernier enfant** si tu ne l'utilises pas via `LeakDetectorScene`
4. **Ne jamais modifier `remotion.config.ts`** — les aliases webpack sont critiques
5. **Pas de `framer-motion`** — uniquement `interpolate()` et `spring()` de `'remotion'`
6. **Toutes les `interpolate()`** : `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }`
7. **spring() avec délai** : `spring({ frame: Math.max(0, frame - delay), fps, ... })`
8. **Formats verticaux** : `flexDirection: 'column'`, `width: '100%'` sur les enfants flex

---

## Commandes

```bash
# Depuis la racine du repo
bun dev:leak-detector        # Studio Remotion — preview live
bun render:leak-detector     # Rendre toutes les compositions

# Depuis projects/leak-detector/
bun typecheck                # TypeScript check
```

---

## Ajouter une nouvelle composition

1. Créer `src/compositions/LD[Nom].tsx`
2. Exporter le composant et ses props
3. Enregistrer dans `src/root.tsx` avec `<Composition id="leak-detector-[nom]" ... />`
4. Mettre à jour le tableau "Compositions — État actuel" dans ce fichier

---

## Packages recommandés par composition

| Composition | Packages à utiliser |
|---|---|
| `LDBeforeAfter` | `@remotion/transitions` (wipe), `@remotion/sfx` (ding), `@remotion/shapes` (Pie score) |
| `LDCinematicHero` | `@remotion/transitions` (iris/clockWipe), `@remotion/noise` (particles) |
| `LDProductDemo` | `@remotion/motion-blur` (CameraMotionBlur), `@remotion/paths` (evolvePath catégories) |
| `LDStatsShowcase` | `@remotion/shapes` (Pie), `@remotion/paths` (évolution graphique) |
| `LDProblemAgitation` | `@remotion/transitions` (fade + slide), `@remotion/sfx` |
| `LDLogoReveal` | `@remotion/transitions` (flip/iris), `@remotion/shapes` (Star clipPath) |

---

## CTA principaux (à utiliser dans les compositions)

- `"→ Scan your page free"`
- `"Free audit — link in bio"` (vertical/social)
- `"Try it free"`
- `"Run your free audit"`
