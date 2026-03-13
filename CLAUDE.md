# CLAUDE.md

# Altidigitech Video Templates — Instructions pour Claude Code

> **Ce fichier est lu automatiquement par Claude Code à chaque session.**
> Lis-le intégralement avant toute action. Ne jamais skipper des sections.

---

## 0. ORDRE DE LECTURE OBLIGATOIRE

Avant d'écrire la moindre ligne de code, lis dans cet ordre :

```
1. Ce fichier (CLAUDE.md racine)          ← tu es ici
2. CONTEXT.md (racine)                    ← qui on est, pourquoi ce repo existe
3. docs/ARCH.md                           ← structure complète du monorepo
4. .claude/remotion-basics.md             ← API Remotion, hooks essentiels
5. .claude/remotion-animations.md         ← animations, spring, interpolate
5b. .claude/remotion-advanced-packages.md ← @remotion/transitions, noise, shapes, paths, sfx, motion-blur, media-utils
6. .claude/brand-system.md               ← BrandKit, couleurs, fonts
7. [Si tu crées un template]              → .claude/new-template.md
8. [Si tu rends une vidéo]                → .claude/remotion-rendering.md
9. [Si tu travailles sur un SaaS]         → projects/[saas]/CLAUDE.md
10. [Si tu travailles sur un package]     → packages/[package]/CLAUDE.md
```

> ⚠️ Si un fichier listé ci-dessus n'existe pas encore, note-le et continue.
> Ne bloque pas sur un fichier manquant — crée-le si nécessaire.

---

## 1. IDENTITÉ DU PROJET

```
Repo       : altidigitech-video-templates
Owner      : Altidigitech (filiale digitale d'Altistonegroup)
Équipe     : 2 co-fondateurs
Agent AI   : Claude Code (développeur principal)
Objectif   : Librairie centrale de templates vidéo programmatiques
             pour tout le portfolio SaaS Altidigitech
Framework  : Remotion v4 + React 18 + TypeScript 5
```

---

## 2. COMMANDES ESSENTIELLES

### Setup initial

```bash
bun install                          # Installer toutes les dépendances
bun run build                        # Build tous les packages
```

### Développement

```bash
bun dev                              # Studio Remotion (preview live)
bun dev:[saas]                       # Studio filtré sur un SaaS
# ex: bun dev:[saas-name]
```

### Linting & typage

```bash
bun lint                             # ESLint sur tout le repo
bun typecheck                        # TypeScript check sans emit
bun format                           # Prettier sur tout le repo
```

### Rendu vidéo

```bash
bun render [composition-id]          # Rendre une composition
bun render:[saas-name]               # Toutes les compositions [SaaS Name]
bun render:all                       # Tout le portfolio
bun render:lambda [composition-id]   # Rendu AWS Lambda
```

### Gestion des packages (Turborepo)

```bash
bun turbo build                      # Build en parallèle
bun turbo test                       # Tests en parallèle
bun turbo lint                       # Lint en parallèle
```

### Ajouter un nouveau SaaS

```bash
bun new:saas [nom]                   # Scaffold un nouveau projet SaaS
# ex: bun new:saas golddesk
```

---

## 3. STRUCTURE DU REPO (vue rapide)

```
altidigitech-video-templates/
│
├── CLAUDE.md                        ← CE FICHIER
├── README.md                        ← Documentation publique
│
├── .claude/                         ← Skills Claude Code
│   ├── remotion-basics.md
│   ├── remotion-animations.md
│   ├── remotion-rendering.md
│   ├── brand-system.md
│   └── new-template.md
│
├── packages/
│   ├── core/                        ← Composants primitifs réutilisables
│   │   └── CLAUDE.md
│   ├── brand/                       ← BrandKits (Altidigitech + par SaaS)
│   │   └── CLAUDE.md
│   ├── templates/                   ← Templates vidéo prêts à l'emploi
│   │   └── CLAUDE.md
│   ├── compositions/                ← Assemblages de templates (vidéos finales)
│   │   └── CLAUDE.md
│   └── utils/                       ← Utilitaires partagés
│       └── CLAUDE.md
│
├── projects/
│   ├── _template/                   ← Modèle à copier pour un nouveau SaaS
│   │   └── CLAUDE.md
│   └── [saas-name]/                 ← Projet [SaaS Name]
│       └── CLAUDE.md
│
├── scripts/                         ← Scripts de rendu et automation
├── renders/                         ← Output vidéos (gitignored)
├── public/                          ← Assets globaux
└── docs/                            ← Documentation complète
```

> Pour la structure détaillée de chaque package, lire `docs/ARCH.md`.

---

## 4. RÈGLES ABSOLUES (ne jamais enfreindre)

### TypeScript

```typescript
// ❌ INTERDIT
const data: any = props
// @ts-ignore
const value = obj.field

// ✅ OBLIGATOIRE
const data: BrandConfig = props
const value = obj?.field ?? defaultValue
```

### Couleurs et design tokens

```typescript
// ❌ INTERDIT — jamais de valeurs hardcodées
style={{ color: '#6366F1', fontFamily: 'Inter' }}

// ✅ OBLIGATOIRE — toujours depuis le BrandKit
import { brand } from '@altidigitech/brand/[saas-name]'
style={{ color: brand.colors.accent, fontFamily: brand.fonts.display }}
```

### Animations et timing

```typescript
// ❌ INTERDIT — jamais de temps réel dans les compositions
const now = Date.now()
setTimeout(() => {}, 1000)
useEffect(() => {}, []) // Jamais dans une composition Remotion

// ✅ OBLIGATOIRE — toujours basé sur les frames
const frame = useCurrentFrame()
const { fps, durationInFrames } = useVideoConfig()
const progress = frame / durationInFrames
```

### Imports

```typescript
// ❌ INTERDIT — imports relatifs profonds
import { something } from '../../../packages/core/components/Text'

// ✅ OBLIGATOIRE — imports depuis les packages
import { something } from '@altidigitech/core'
```

### Exports

```typescript
// ❌ INTERDIT — export default sur les composants
export default function MyComponent() {}

// ✅ OBLIGATOIRE — exports nommés partout
export const MyComponent: React.FC<MyComponentProps> = () => {}
export type { MyComponentProps }

// Exception : export default UNIQUEMENT sur les compositions root Remotion
```

---

## 5. CONVENTIONS DE NOMMAGE

| Contexte              | Convention                 | Exemple                               |
| --------------------- | -------------------------- | ------------------------------------- |
| Composants React      | PascalCase                 | `ProductDemo`, `HeroTitle`            |
| Fichiers composants   | PascalCase                 | `ProductDemo.tsx`                     |
| Types / Interfaces    | PascalCase + suffixe       | `BrandConfig`, `TemplateProps`        |
| Variables / fonctions | camelCase                  | `useSpringValue`, `renderConfig`      |
| Constantes globales   | UPPER_SNAKE_CASE           | `DEFAULT_FPS`, `MAX_DURATION`         |
| Fichiers de config    | kebab-case                 | `brand-config.ts`, `render-config.ts` |
| Dossiers              | kebab-case                 | `product-demo/`, `brand-kit/`         |
| Compositions Remotion | PascalCase + "Composition" | `MySaasDemoComposition`               |
| Templates             | PascalCase + "Template"    | `ProductDemoTemplate`                 |
| IDs de composition    | kebab-case                 | `[saas-name]-product-demo`            |

---

## 6. STRUCTURE D'UN COMPOSANT REMOTION (pattern obligatoire)

```typescript
// packages/core/src/components/MyComponent/MyComponent.tsx

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandColors } from '@altidigitech/brand'

// 1. Toujours définir et exporter les props
export type MyComponentProps = {
  /** Texte principal à afficher */
  text: string
  /** Couleur du texte (depuis BrandKit) */
  color: string
  /** Frame de début de l'animation d'entrée */
  enterAt?: number
  /** Frame de début de l'animation de sortie */
  exitAt?: number
}

// 2. Valeurs par défaut explicites
const DEFAULT_ENTER_AT = 0
const DEFAULT_EXIT_AT = Infinity

// 3. Composant pur, pas de side effects
export const MyComponent: React.FC<MyComponentProps> = ({
  text,
  color,
  enterAt = DEFAULT_ENTER_AT,
  exitAt = DEFAULT_EXIT_AT,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  // 4. Calculs d'animation groupés et commentés
  const fadeIn = interpolate(
    frame,
    [enterAt, enterAt + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const fadeOut = interpolate(
    frame,
    [exitAt, exitAt + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const opacity = Math.min(fadeIn, fadeOut)

  // 5. Styles séparés de la logique
  const containerStyle: React.CSSProperties = {
    opacity,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <AbsoluteFill style={containerStyle}>
      <span>{text}</span>
    </AbsoluteFill>
  )
}
```

---

## 7. STRUCTURE D'UN TEMPLATE (pattern obligatoire)

```typescript
// packages/templates/src/ProductDemo/ProductDemo.tsx

import { AbsoluteFill, Sequence } from 'remotion'
import { HeroTitle, FeatureList, CallToAction } from '@altidigitech/core'
import type { BrandConfig } from '@altidigitech/brand'

// Props du template = BrandConfig + paramètres visuels
export type ProductDemoProps = {
  brand: BrandConfig
  headline: string
  subline: string
  features: string[]
  ctaText: string
  ctaUrl?: string
  durationInFrames?: number
}

export const ProductDemoTemplate: React.FC<ProductDemoProps> = ({
  brand,
  headline,
  subline,
  features,
  ctaText,
  durationInFrames = 300, // 5 secondes à 60fps par défaut
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Intro : frames 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <HeroTitle text={headline} color={brand.colors.primary} />
      </Sequence>

      {/* Features : frames 60-240 */}
      <Sequence from={60} durationInFrames={180}>
        <FeatureList items={features} brand={brand} />
      </Sequence>

      {/* CTA : frames 240-300 */}
      <Sequence from={240} durationInFrames={60}>
        <CallToAction text={ctaText} brand={brand} />
      </Sequence>
    </AbsoluteFill>
  )
}
```

---

## 8. STRUCTURE D'UNE COMPOSITION ROOT (pattern obligatoire)

```typescript
// projects/[saas-name]/src/root.tsx

import { Composition } from 'remotion'
import { ProductDemoTemplate } from '@altidigitech/templates'
import { mySaasBrand } from './config'

// Toujours exporter une fonction RemotionRoot
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="[saas-name]-product-demo"    // kebab-case obligatoire
        component={ProductDemoTemplate}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          brand: mySaasBrand,
          headline: 'TODO: Headline du SaaS',
          subline: 'TODO: Sous-titre',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          ctaText: 'Get started',
        }}
      />
    </>
  )
}
```

---

## 9. FORMATS VIDÉO STANDARDS

| ID Format    | Width | Height | FPS | Usage                         |
| ------------ | ----- | ------ | --- | ----------------------------- |
| `widescreen` | 1920  | 1080   | 60  | YouTube, démos, présentations |
| `square`     | 1080  | 1080   | 30  | Instagram feed, LinkedIn      |
| `vertical`   | 1080  | 1920   | 30  | TikTok, Reels, Shorts         |
| `ultrawide`  | 2560  | 1080   | 60  | Bannières web, hero sections  |
| `thumbnail`  | 1280  | 720    | 30  | Miniatures YouTube            |

> Chaque template doit supporter au minimum `widescreen` et `vertical`.
> Utiliser les constantes depuis `packages/utils/src/formats.ts`.

---

## 10. GESTION DES ASSETS

### Où placer les assets

```
public/
├── fonts/           ← Fonts custom non-Google (woff2 uniquement)
├── sounds/          ← Musiques et effets sonores (mp3/wav)
├── images/          ← Images globales (logo Altidigitech, etc.)
└── lottie/          ← Animations Lottie JSON

projects/[saas]/public/
├── logo.svg         ← Logo du SaaS (SVG obligatoire)
├── logo.png         ← Fallback PNG (1024×1024 min)
├── screenshots/     ← Screenshots de l'interface du SaaS
├── sounds/          ← Sons spécifiques au SaaS
└── images/          ← Images spécifiques au SaaS
```

### Règles assets

- **Logos** : toujours fournir SVG + PNG
- **Screenshots** : résolution min 1920×1080, format PNG
- **Sons** : MP3 128kbps minimum, normalisation -14 LUFS
- **Lottie** : version LottieFiles, pas d'assets externes dans le JSON
- **Images** : PNG pour transparence, JPG pour photos (qualité 90+)

> ⚠️ **Claude Code** : si un asset est manquant, utilise un placeholder visuel
> clair et laisse un commentaire `// TODO: remplacer par l'asset réel`

---

## 11. DÉPENDANCES AUTORISÉES

### Remotion ecosystem (toujours préférer)

```json
{
  "remotion": "latest",
  "@remotion/player": "latest",
  "@remotion/lambda": "latest",
  "@remotion/renderer": "latest",
  "@remotion/google-fonts": "latest",
  "@remotion/motion-blur": "latest",
  "@remotion/noise": "latest",
  "@remotion/shapes": "latest",
  "@remotion/lottie": "latest",
  "@remotion/gif": "latest",
  "@remotion/rive": "latest",
  "@remotion/three": "latest"
}
```

### Utilitaires approuvés

```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "zod": "latest",
  "date-fns": "latest",
  "lodash-es": "latest"
}
```

### ❌ Ne jamais installer sans validation

- Librairies d'animation alternatives à Remotion (Framer Motion, GSAP, etc.)
- Librairies de state management (Redux, Zustand) — inutile dans des compositions
- Toute librairie qui fait des requêtes réseau dans les composants

---

## 12. ERREURS COURANTES À ÉVITER

### Remotion-specific

```typescript
// ❌ Les hooks Remotion ne fonctionnent que dans les compositions
// Ne JAMAIS appeler hors d'une composition Remotion
function notAComposition() {
  const frame = useCurrentFrame() // ERREUR
}

// ❌ Ne pas utiliser interpolate sans extrapolateRight: 'clamp'
// Ça peut produire des valeurs hors-range
const opacity = interpolate(frame, [0, 30], [0, 1])

// ✅ Toujours clamper
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})

// ❌ Ne pas oublier que Remotion rend chaque frame indépendamment
// Les useState persistent entre frames en preview mais PAS en rendu
const [count, setCount] = useState(0) // Comportement imprévisible au rendu
```

### TypeScript

```typescript
// ❌ Props optionnelles sans valeur par défaut
type Props = { color?: string }
const Component = ({ color }: Props) => (
  <div style={{ color }}>...</div> // color peut être undefined
)

// ✅ Toujours fournir une valeur par défaut
const Component = ({ color = '#FFFFFF' }: Props) => (
  <div style={{ color }}>...</div>
)
```

---

## 13. CHECKLIST AVANT COMMIT

Avant tout commit, vérifier :

- [ ] `bun typecheck` passe sans erreur
- [ ] `bun lint` passe sans erreur
- [ ] `bun format` appliqué
- [ ] Aucun `console.log` laissé dans le code
- [ ] Aucune valeur hardcodée (couleurs, fonts, textes)
- [ ] Tous les nouveaux composants ont leurs props typées et exportées
- [ ] Les nouveaux packages sont référencés dans `turbo.json`
- [ ] Les assets utilisés existent dans `public/` ou `projects/[saas]/public/`
- [ ] Le `CHANGELOG.md` est mis à jour si changement structurel

---

## 14. QUAND TU AS UN DOUTE

1. **Sur l'architecture** → lire `docs/ARCH.md`
2. **Sur une API Remotion** → lire `.claude/remotion-basics.md`
3. **Sur les animations** → lire `.claude/remotion-animations.md`
4. **Sur le brand d'un SaaS** → lire `projects/[saas]/CLAUDE.md`
5. **Sur le rendu** → lire `.claude/remotion-rendering.md`
6. **Sur la création d'un template** → lire `.claude/new-template.md`
7. **Si rien ne répond à ta question** → implémenter la solution la plus simple,
   laisser un commentaire `// TODO: à valider avec le fondateur` et continuer.

---

## 15. CONTEXTE SESSION

À chaque nouvelle session Claude Code, rappelle-toi :

- Tu travailles sur le repo de **templates vidéo marketing** d'Altidigitech
- L'objectif est de produire des **vidéos marketing professionnelles** pour des SaaS
- **Remotion** est le framework de rendu — chaque frame est un composant React
- **Bun** est le package manager — jamais `npm` ou `yarn`
- **TypeScript strict** — jamais de `any`, jamais de valeurs hardcodées
- L'équipe est petite (2 personnes) — la clarté et la maintenabilité priment

---

_Ce fichier est la source de vérité pour Claude Code._
_En cas de conflit avec un autre fichier, ce CLAUDE.md racine a priorité._
_Dernière mise à jour : Mars 2026 — Altidigitech_
