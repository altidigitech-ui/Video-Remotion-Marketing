# CONTEXT.md — Altidigitech Video Templates

> **Source de vérité absolue du repo.** Ce fichier est lu par Claude Code à chaque session.
> Il prime sur tout autre document en cas de contradiction.
> Dernière mise à jour : Mars 2026.

---

## 1. QUI SOMMES-NOUS

**Altistonegroup** est une holding qui chapeaute plusieurs filiales spécialisées.

**Altidigitech** (SASU, Marignane, France) est la filiale digitale, positionnée comme un SaaS studio — elle conçoit, développe et exploite un portfolio de produits SaaS à vocation internationale.

L'équipe est composée de **2 co-fondateurs** :
- **Alti** — Fondateur technique, stratégie, développement produit
- **Romain Delgado** — Growth & Marketing associate

L'approche est **AI-first** : Claude Code est le développeur principal de ce repo. Les fondateurs définissent la stratégie, le branding et le contenu ; Claude Code implémente, teste et livre.

---

## 2. OBJECTIF DE CE REPO

Ce repo est la **librairie centrale de templates vidéo programmatiques** pour l'ensemble du portfolio SaaS Altidigitech.

Il **ne concerne pas un SaaS spécifique** — il fournit une base commune réutilisable par tous les produits du studio. Chaque SaaS dispose de son propre `BrandConfig` (couleurs, fonts, assets) et de ses propres compositions vidéo, mais tous partagent les mêmes templates, composants et utilitaires.

**Cas d'usage concrets :**
- Vidéos marketing pour Product Hunt launch
- Reels / TikToks / Shorts pour distribution social media
- Demos produit pour landing pages et ads
- Cinématiques pour pitch deck ou brand awareness

---

## 3. STACK TECHNIQUE

| Technologie | Version | Rôle |
|---|---|---|
| **Remotion** | **4.0.434** (pinned) | Framework de rendu vidéo programmatique — chaque frame = composant React rendu par Chromium headless |
| **React** | 18.2.x | Bibliothèque UI pour les composants |
| **TypeScript** | 5.4.x | Typage strict. Zéro `any`, zéro `@ts-ignore` |
| **Bun** | 1.2.9 | Package manager ET runtime. **Jamais npm ou yarn dans ce repo** |
| **Turborepo** | 2.x | Orchestration monorepo (build, lint, typecheck en parallèle) |
| **Zod** | 4.3.6 | Validation des schemas de props pour les templates |
| **FFmpeg** | embarqué Remotion | Assemblage des frames en vidéo (géré automatiquement par Remotion) |
| **Playwright** | 1.43.x | Capture de screenshots automatique depuis une URL (`scripts/capture-screenshots.ts`) |

### Packages Remotion installés (tous à 4.0.434)

```
remotion                   — Core (spring, interpolate, Sequence, Audio, Img...)
@remotion/cli              — Studio + CLI de rendu
@remotion/renderer         — Rendu programmatique (Node.js)
@remotion/player           — Player React (embed dans une webapp)
@remotion/google-fonts     — Chargement typesafe de Google Fonts
@remotion/motion-blur      — <Trail> et <CameraMotionBlur>
@remotion/shapes           — <Star>, <Pie>, <Polygon>, <Triangle>, <Circle>, <Ellipse>
@remotion/transitions      — <TransitionSeries> avec fade, wipe, slide, flip, clockWipe, iris
@remotion/noise            — noise2D, noise3D, noise4D (Simplex Perlin noise)
@remotion/paths            — evolvePath, interpolatePath, getPointAtLength...
@remotion/sfx              — Sons intégrés : ding(), beep(), bruh(), vineBoom()...
@remotion/media-utils      — useAudioData, visualizeAudio, visualizeAudioWaveform
```

---

## 4. ARCHITECTURE DU MONOREPO

```
altidigitech-video-templates/
│
├── packages/                    Librairies partagées (generiques, sans SaaS spécifique)
│   ├── utils/                   Constantes et fonctions pures (timing, formats, math)
│   ├── brand/                   Système de design tokens + BrandConfig par SaaS
│   ├── core/                    Composants Remotion primitifs réutilisables
│   ├── templates/               Templates vidéo génériques paramétrés par BrandConfig
│   └── (compositions/)          Réservé pour assemblages partagés futurs
│
├── projects/                    Implementations spécifiques par SaaS
│   ├── _template/               Modèle vierge à copier pour chaque nouveau SaaS
│   └── leak-detector/           Projet Leak Detector (seul projet actif)
│
├── scripts/                     Automatisation
│   ├── render-formats.ts        Rendu multi-format pour un SaaS donné
│   ├── render-all.ts            Rendu de toutes les compositions de tous les SaaS
│   ├── new-saas.ts              Scaffold automatique d'un nouveau SaaS
│   └── capture-screenshots.ts   Capture de screenshots via Playwright
│
├── docs/                        Documentation
│   ├── CONTEXT.md               (voir docs/CONTEXT.md — ancienne version)
│   └── ARCH.md                  Architecture détaillée
│
├── public/                      Assets globaux Altidigitech
│   ├── fonts/                   Fonts locales (si non Google Fonts)
│   ├── images/                  Logos et images globales
│   │   ├── leak-detector-logo.png
│   │   └── leak-detector-logo-white.png
│   ├── lottie/                  Animations Lottie partagées
│   ├── screenshots/             Screenshots globaux
│   └── sounds/                  Sons globaux
│
├── .claude/                     Documentation pour Claude Code
│   ├── remotion-basics.md       API Remotion, hooks, composants de base
│   ├── remotion-animations.md   spring, interpolate, easing, patterns d'animation
│   ├── remotion-advanced-packages.md  Packages avancés (transitions, noise, shapes...)
│   ├── brand-system.md          BrandConfig, design tokens, fonts
│   ├── new-template.md          Guide création d'un nouveau template
│   └── remotion-rendering.md    Rendu, CLI, scripts, output
│
├── CLAUDE.md                    Point d'entrée principal pour Claude Code (lire en premier)
├── CONTEXT.md                   CE FICHIER — source de vérité du repo
├── package.json                 Root package.json (workspaces Bun)
├── bun.lock                     Lock file (toutes les versions pinnées ici)
├── turbo.json                   Configuration Turborepo
├── tsconfig.json                TypeScript config racine
└── renders/                     Output vidéos (gitignored)
```

---

## 5. FLUX DE DONNÉES

```
BrandConfig (packages/brand/src/[saas]/config.ts)
     │
     ▼
Template (packages/templates/src/[template]/)
     │  utilise des composants de packages/core
     │  utilise des utilitaires de packages/utils
     ▼
Composition (projects/[saas]/src/root.tsx)
     │  assemble Template + BrandConfig + props finales
     │  ou crée des compositions custom (LDCinematicHero, LDBeforeAfter...)
     ▼
Render (scripts/ ou CLI Remotion)
     │  Chromium headless → frames JPEG/PNG → FFmpeg → MP4
     ▼
Output (renders/[saas]/*.mp4)
```

---

## 6. DESCRIPTION DÉTAILLÉE DES PACKAGES

### `packages/utils`

Utilitaires purs, zéro dépendance externe hormis les types TS.

```
src/
├── timing.ts    sec(s, fps), frames(n), secondsToFrames(s, fps?)
├── formats.ts   VIDEO_FORMATS record (widescreen/square/vertical/ultrawide/thumbnail)
│                + DEFAULT_FPS, DEFAULT_WIDTH, DEFAULT_HEIGHT
├── math.ts      clamp(), lerp(), mapRange(), easeInOut()
└── index.ts     barrel export
```

**Formats vidéo définis :**

| ID | Dimensions | FPS | Usage |
|---|---|---|---|
| `widescreen` | 1920×1080 | 60 | YouTube, demos, présentations |
| `square` | 1080×1080 | 30 | Instagram feed, LinkedIn |
| `vertical` | 1080×1920 | 30 | TikTok, Reels, Shorts |
| `ultrawide` | 2560×1080 | 60 | Bannières web, hero sections |
| `thumbnail` | 1280×720 | 30 | Miniatures YouTube |

---

### `packages/brand`

Système de design tokens. **Aucune couleur, font ou espacement ne doit être hardcodé** dans les composants — tout passe par `BrandConfig`.

```
src/
├── types.ts               Tous les types TypeScript du système brand
│   ├── BrandColors        primary, secondary, accent, background, text*, border, overlay...
│   ├── BrandTypography    fontDisplay, fontBody, fontMono + tailles (xs→7xl) + weights
│   ├── BrandSpacing       xs, sm, md, lg, xl, xxl, xxxl + paddingScreen, gutter, borderRadius
│   ├── BrandMotion        durationFast/Normal/Slow/VerySlow + springs (Snappy/Smooth/Bouncy/Cinematic)
│   ├── BrandAssets        logoSvg, logoPng, logoWhite?, backgroundMusic?, transitionSound?
│   └── BrandConfig        objet racine combinant tout ce qui précède
│
├── base/                  Valeurs par défaut Altidigitech
│   ├── colors.ts          Palette de base (gris, success/warning/error/info, white/black)
│   ├── typography.ts      Inter comme font de base, échelle typographique complète
│   ├── spacing.ts         Échelle d'espacement (base 8px)
│   └── motion.ts          Springs par défaut (snappy/smooth/bouncy/cinematic)
│
├── _template/             Modèle à copier pour un nouveau SaaS (tous les champs TODO)
│
├── leak-detector/         Brand Leak Detector
│   └── config.ts          leakDetectorBrand (voir Section 8)
│
└── index.ts               Barrel export
```

**Graphe de dépendances packages :**
```
utils  ←  brand  ←  core  ←  templates  ←  projects/[saas]
```

---

### `packages/core`

Composants Remotion réutilisables. Tous acceptent `brand: BrandConfig` en prop.

```
src/
├── components/
│   ├── BrandLogo/           Logo avec animation optionnelle
│   ├── BrandHeadline/       Titre stylisé (taille, couleur, gradient optionnel)
│   ├── BrandBackground/     Fond (solid, gradient, radial)
│   ├── AnimatedText/        Texte animé (fadeIn, slideUp, scaleIn) + stagger
│   ├── StaggerList/         Liste d'éléments avec apparition en stagger
│   ├── AnimatedCounter/     Compteur animé 0 → N avec easing
│   ├── Typewriter/          Effet machine à écrire caractère par caractère
│   └── LDBackground/        Background cyberpunk Leak Detector (spécifique LD)
│       └── LDBackground.tsx  Exporte : LDBackground, GlowText, GlowButton, GlassCard,
│                              AIBadge, LogoOverlay, TiltCard (à venir)
│
├── hooks/
│   └── useAnimationSequence.ts  Hook pour gérer des séquences d'animations temporelles
│
└── index.ts                 Barrel export de tous les composants et hooks
```

**Composants LDBackground (Leak Detector uniquement) :**

| Composant | Props | Description |
|---|---|---|
| `LDBackground` | `brand: BrandConfig, burstAt?: number` | Background cyberpunk complet (grid, orbs, orbital light, particles) |
| `GlowText` | `children, brand, size?, weight?, glow?` | Texte avec glow amber optionnel |
| `GlowButton` | `children, brand, size?` | Bouton CTA avec gradient amber et hover glow |
| `GlassCard` | `children, brand, glow?` | Carte glassmorphism avec blur et border subtile |
| `AIBadge` | `frame` | Badge "AI-Powered CRO Analysis" avec dot pulsant vert |
| `LogoOverlay` | `brand, frame` | Logo en bas à droite avec fade-in sur 25 frames |

---

### `packages/templates`

Templates vidéo génériques. Chaque template a un schema Zod et accepte un `BrandConfig`.

```
src/
├── product-demo/           LDProductDemo-style — headline + features animées + CTA
├── feature-highlight/      Mise en avant d'une feature unique avec bullet points
├── launch-announcement/    Annonce de lancement (headline + date + features + CTA)
├── logo-reveal/            Animation logo + tagline (~3s)
├── stats-showcase/         Métriques animées avec AnimatedCounter
├── how-it-works/           Explication en N étapes
├── social-short/           Contenu court pour réseaux sociaux (hook + body + CTA)
├── screen-mockup/          Affichage de screenshots produit
└── index.ts                Barrel export (tous les composants + tous les types Zod)
```

**Pattern d'utilisation :**
```typescript
// Dans projects/[saas]/src/root.tsx :
import { StatsShowcaseTemplate } from '@altidigitech/templates'

const LDStatsShowcase: React.FC<StatsShowcaseProps> = (props) => (
  <LeakDetectorScene brand={ldBrand}>
    <StatsShowcaseTemplate {...props} brand={{ ...ldBrand, colors: { ...ldBrand.colors, background: 'transparent' } }} />
  </LeakDetectorScene>
)
```

---

## 7. PROJET LEAK DETECTOR

Seul projet actif dans `projects/`. C'est le premier produit du studio.

### Identité produit

```
Nom          : Leak Detector
URL          : leakdetector.tech
Tagline      : Find the CRO leaks killing your conversions
Description  : SaaS CRO audit — scanne une landing page et identifie
               les problèmes de conversion sur 8 catégories en ~60 secondes.
Secteur      : MarTech / CRO
Cible        : Founders, growth marketers, indie hackers, agences web
```

### Brand Leak Detector

```typescript
colors: {
  accent:      '#F59E0B',   // Amber — couleur dominante
  accentAlt:   '#D97706',   // Amber foncé — gradients, hover
  background:  '#050A14',   // Dark cyberpunk (note: LDBackground utilise cette valeur)
  primary:     '#0F172A',   // Bleu nuit très foncé
  secondary:   '#1E293B',   // Bleu nuit moyen
  surface:     '#334155',   // Surface des cartes
  textPrimary: '#F8FAFC',   // Blanc quasi-pur
  textSecondary:'#94A3B8',  // Gris-bleu clair
  textMuted:   '#64748B',   // Gris-bleu moyen
  border:      '#334155',   // Idem surface
}

typography: {
  fontDisplay: 'Space Grotesk',   // Chargé via @remotion/google-fonts
  fontBody:    'Inter',
  fontMono:    'JetBrains Mono',
}

motion: {
  springSnappy:    { damping: 15, mass: 0.8, stiffness: 200 }
  springSmooth:    { damping: 12, mass: 0.8, stiffness: 160 }
  springBouncy:    { damping: 10, mass: 0.8, stiffness: 180 }
  springCinematic: { damping: 30, mass: 1.2, stiffness: 80  }
  // spring par défaut (sans config explicite) : { damping: 14, stiffness: 120 }
}

assets: {
  logoPng:   'images/leak-detector-logo.png'
  logoWhite: 'images/leak-detector-logo-white.png'
}
```

### Données réelles (utiliser dans les compositions — jamais inventer)

```
Score CRO moyen : 73/100
58% des pages n'ont aucune social proof above the fold
42% ont des CTAs faibles ("Get Started", "Learn More")
3.2 problèmes en moyenne par page
8 catégories d'audit : Social Proof, CTA, Copy, Urgency,
                       Trust, Layout, Mobile UX, Page Speed
```

### Pricing

```
Free   :   3 analyses/mois — €0
Pro    :  50 analyses/mois — €29/mois
Agency : 200 analyses/mois — €99/mois
```

### Structure du projet

```
projects/leak-detector/
│
├── public/
│   ├── logo/
│   │   ├── logo.png            Logo complet (texte + icône)
│   │   └── logo-white.png      Version blanche
│   ├── screenshots/
│   │   ├── dashboard-categories.png    Dashboard avec scores par catégorie
│   │   ├── dashboard-report.png        Rapport d'analyse complet
│   │   ├── landing-hero.png            Hero de la landing page
│   │   ├── landing-how-it-works.png    Section "how it works"
│   │   ├── landing-dimensions.png      Section features/dimensions
│   │   ├── landing-stats.png           Section statistiques
│   │   ├── pricing.png                 Page pricing
│   │   └── social-proof.png            Section social proof
│   └── sounds/                         Sons (à venir — @remotion/sfx + MP3)
│
├── src/
│   ├── components/
│   │   ├── ScoreCircle.tsx         Cercle de score animé (0→N/100)
│   │   ├── CategoryScoreBar.tsx    Barre de progression par catégorie
│   │   ├── LeakDetectorScene.tsx   Wrapper LDBackground + LogoOverlay
│   │   ├── LeakDetectorBackground.tsx  Background variant alternatif
│   │   └── LeakDetectorBadge.tsx   Badge produit Leak Detector
│   │
│   ├── compositions/               16 compositions enregistrées (voir Section 7.4)
│   │   ├── LDLogoReveal.tsx
│   │   ├── LDProductDemo.tsx
│   │   ├── LDLaunchAnnouncement.tsx
│   │   ├── LDScreenDashboard.tsx
│   │   ├── LDScreenHeroVertical.tsx
│   │   ├── LDScreenSquare.tsx
│   │   ├── LDCinematicHero.tsx
│   │   ├── LDProblemAgitation.tsx
│   │   └── LDBeforeAfter.tsx
│   │
│   ├── root.tsx                    RemotionRoot — enregistre les 16 compositions
│   └── index.ts                    Entry point pour Remotion CLI
│
├── remotion.config.ts              Config Remotion du projet
│                                   (jpeg, yuv420p, concurrency 2, angle GL, 30s timeout)
│                                   ⚠️ NE JAMAIS MODIFIER — contient les aliases webpack critiques
├── tsconfig.json
└── package.json                    Dépend de @altidigitech/{brand,core,templates}
```

### remotion.config.ts — Aliases webpack (CRITIQUE)

```typescript
// Ces aliases résolvent les imports workspace → chemins locaux
// OBLIGATOIRES pour que le studio et le rendu fonctionnent
'@altidigitech/core'      → packages/core/src
'@altidigitech/brand'     → packages/brand/src
'@altidigitech/templates' → packages/templates/src
'@altidigitech/utils'     → packages/utils/src
```

### 16 Compositions enregistrées

#### Widescreen 1920×1080 @ 60fps

| ID Remotion | Composant | Durée | Type |
|---|---|---|---|
| `leak-detector-logo-reveal` | `LDLogoReveal` | 3s (180f) | Custom |
| `leak-detector-product-demo` | `LDProductDemo` | 10s (600f) | Custom |
| `leak-detector-launch` | `LDLaunchAnnouncement` | 9s (540f) | Custom |
| `leak-detector-stats` | `LDStatsShowcase` via `LeakDetectorScene` | 8s (480f) | Template wrappé |
| `leak-detector-how-it-works` | `LDHowItWorks` via `LeakDetectorScene` | 8s (480f) | Template wrappé |
| `leak-detector-feature-cro` | `LDFeatureHighlight` direct | 7s (420f) | Template direct |
| `leak-detector-cinematic-hero` | `LDCinematicHero` | 30s (1800f) | Custom premium |
| `leak-detector-before-after` | `LDBeforeAfter` | 20s (1200f) | Custom premium |
| `leak-detector-screen-dashboard` | `LDScreenDashboard` | 10s (600f) | Screen custom |

#### Vertical 1080×1920

| ID Remotion | Composant | Durée | FPS |
|---|---|---|---|
| `leak-detector-social-vertical` | `LDSocialShort` direct | 8s (240f) | 30 |
| `leak-detector-social-stats-vertical` | `LDStatsShowcase` wrappé | 10s (300f) | 30 |
| `leak-detector-problem-agitation` | `LDProblemAgitation` | 15s (450f) | 30 |
| `leak-detector-screen-hero-vertical` | `LDScreenHeroVertical` | 11s (660f) | 60 |

#### Square 1080×1080

| ID Remotion | Composant | Durée | FPS |
|---|---|---|---|
| `leak-detector-social-square` | `LDSocialShort` direct | 6s (180f) | 30 |
| `leak-detector-stats-square` | `LDStatsShowcase` wrappé | 8s (240f) | 30 |
| `leak-detector-screen-square` | `LDScreenSquare` | 6s (360f) | 60 |

---

## 8. SCRIPTS

### Commandes disponibles (depuis la racine)

```bash
bun dev                        # Studio Remotion (toutes compositions)
bun dev:leak-detector          # Studio Remotion (Leak Detector uniquement)

bun render:leak-detector       # Render tous les formats Leak Detector
bun render:all                 # Render toutes les compositions de tous les SaaS

bun new:saas [nom]             # Scaffold un nouveau projet SaaS
bun screenshots:leak-detector  # Capture screenshots depuis leakdetector.tech
bun screenshots:leak-detector:local  # Idem depuis localhost:3000

bun typecheck                  # TypeScript check (tous les packages via Turborepo)
bun lint                       # ESLint (tous les packages)
bun build                      # Build (tous les packages)
bun format                     # Prettier sur tout le repo

bun playwright:install         # Installe Chromium pour Playwright
```

### `scripts/render-formats.ts`

Rend les formats widescreen, square et vertical pour un SaaS donné.

```bash
bun scripts/render-formats.ts --saas=leak-detector
# Output : renders/leak-detector/*.mp4
```

### `scripts/capture-screenshots.ts`

Capture automatique de screenshots depuis une URL avec Playwright.
Stocke dans `projects/[saas]/public/screenshots/`.

```bash
bun scripts/capture-screenshots.ts --url=https://leakdetector.tech
```

### `scripts/new-saas.ts`

Scaffold automatique : crée `projects/[nom]/` + `packages/brand/src/[nom]/config.ts`.

---

## 9. CONVENTIONS DE CODE

### Nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composant React | PascalCase | `LDCinematicHero` |
| Fichier composant | `PascalCase.tsx` dans dossier éponyme | `LDCinematicHero/LDCinematicHero.tsx` |
| Template | PascalCase + "Template" | `StatsShowcaseTemplate` |
| ID de composition Remotion | `kebab-case` préfixé SaaS | `leak-detector-cinematic-hero` |
| Type / Interface | PascalCase | `BrandConfig`, `StatsShowcaseProps` |
| Variable / fonction | camelCase | `useAnimationSequence` |
| Constante | UPPER_SNAKE_CASE | `DEFAULT_FPS`, `VIDEO_FORMATS` |
| Package workspace | `@altidigitech/[nom]` | `@altidigitech/core` |
| Fichier de dossier | kebab-case | `packages/core/`, `social-short/` |

### TypeScript

- Zéro `any` — toujours typer explicitement
- Zéro `@ts-ignore` — corriger le problème à la source
- Types exportés systématiquement depuis chaque composant
- Props obligatoirement typées (interface ou type inline)
- `z.infer<typeof schema>` pour les types des props de templates

### Exports

- **Named exports uniquement** — jamais de `export default`
- Pattern barrel : chaque dossier a un `index.ts` qui ré-exporte
- Exports de types avec `export type { ... }`

### Remotion — Règles impératives

```
✅ Toujours utiliser useCurrentFrame() pour l'état d'animation
✅ Toujours utiliser random('seed-string') jamais Math.random()
✅ Toujours extrapolateLeft/Right: 'clamp' sur les interpolations
✅ spring() avec délai : spring({ frame: Math.max(0, frame - delay), fps, config })
✅ overflow: 'hidden' sur tout conteneur susceptible de déborder
✅ AbsoluteFill comme wrapper racine de chaque composition
✅ LDBackground toujours premier enfant
✅ LogoOverlay toujours dernier enfant (un seul par composition)
✅ Un seul LogoOverlay par composition

❌ Jamais framer-motion → utiliser interpolate() et spring() de 'remotion'
❌ Jamais Math.random() dans les composants (non déterministe)
❌ Jamais Date.now() ou setTimeout (non déterministe)
❌ Jamais useState pour l'état d'animation (frames indépendantes)
❌ Jamais de largeur fixe sur flex children → flex: 1
❌ Jamais modifier remotion.config.ts
```

---

## 10. PRINCIPES DE DESIGN

1. **Réutilisabilité maximale** — Un template fonctionne avec n'importe quel SaaS sans modification
2. **Qualité cinématique** — Animations spring physiques, motion blur, easing professionnel
3. **Automation over manual** — Scripts de scaffold, rendu batch, screenshots automatiques
4. **TypeScript strict** — Pas de valeurs hardcodées, tout typé, tout exporté
5. **BrandConfig everywhere** — Aucune couleur, font ou espacement hardcodé dans les composants
6. **Déterminisme absolu** — Même frame = même résultat garanti
7. **Données authentiques** — Jamais de stats ou témoignages inventés dans les compositions

---

## 11. AJOUTER UN NOUVEAU SAAS — Processus complet

```bash
# 1. Scaffolder le projet
bun new:saas nom-du-saas

# Résultat :
# projects/nom-du-saas/        (copie de projects/_template/)
# packages/brand/src/nom-du-saas/config.ts  (BrandConfig à remplir)
```

```
# 2. Remplir le BrandConfig
packages/brand/src/nom-du-saas/config.ts
→ Remplacer tous les TODO par les vraies valeurs (couleurs, fonts, tagline)

# 3. Ajouter les assets
projects/nom-du-saas/public/logo/logo.png
projects/nom-du-saas/public/logo/logo-white.png
projects/nom-du-saas/public/screenshots/  ← remplir via bun screenshots

# 4. Exporter le brand
packages/brand/src/index.ts
→ Ajouter : export { nomDuSaasBrand } from './nom-du-saas/config'

# 5. Créer les compositions
projects/nom-du-saas/src/root.tsx
→ Assembler les templates avec le BrandConfig

# 6. Tester
bun dev  → Vérifier dans le studio Remotion

# 7. Render
bun render:all
```

---

## 12. WORKFLOW CLAUDE CODE

### Ordre de lecture obligatoire (au début de chaque session)

```
1. CONTEXT.md (racine)                    ← CE FICHIER — contexte global
2. CLAUDE.md (racine)                     ← Règles d'agent et conventions
3. docs/ARCH.md                           ← Architecture technique détaillée
4. .claude/remotion-basics.md             ← API Remotion, hooks essentiels
5. .claude/remotion-animations.md         ← spring, interpolate, easing, patterns
6. .claude/remotion-advanced-packages.md  ← @remotion/transitions, noise, shapes, etc.
7. .claude/brand-system.md               ← BrandConfig, design tokens, fonts
8. [Si création template]                  → .claude/new-template.md
9. [Si rendu vidéo]                        → .claude/remotion-rendering.md
10. [Si travail sur Leak Detector]          → projects/leak-detector/CLAUDE.md
11. [Si travail sur un package]            → packages/[package]/CLAUDE.md
```

### Règles d'exécution

1. **Lire TOUT le contexte avant d'écrire la moindre ligne de code**
2. **Ne jamais écrire de code sans comprendre l'intention complète**
3. **Analyser l'existant avant d'ajouter du nouveau** — éviter la duplication
4. **Trade-offs explicites** — mentionner temps/qualité/complexité si pertinent
5. **Solution minimale viable d'abord, scalable ensuite**
6. **Toujours `bun typecheck` en fin de session**

---

## 13. GLOSSAIRE

| Terme | Définition |
|---|---|
| **BrandKit / BrandConfig** | Objet TypeScript contenant toutes les valeurs de design d'un SaaS (couleurs, fonts, animations, assets) |
| **Template** | Composant React générique paramétré par un BrandConfig — fonctionne pour tout SaaS |
| **Composition** | Assemblage final d'un template (ou code custom) avec un BrandConfig et des props spécifiques à un SaaS |
| **LeakDetectorScene** | Wrapper Leak Detector = `LDBackground` + `LogoOverlay` — utilisé pour wrapper les templates génériques dans le contexte LD |
| **Sequence** | Composant Remotion qui contrôle *quand* un enfant est visible dans la timeline |
| **Frame** | Unité de temps dans Remotion (1 frame = 1 screenshot React rendu par Chromium) |
| **FPS** | Frames par seconde (60 pour widescreen/screen, 30 pour social formats) |
| **Spring** | Fonction d'animation physique (ressort) de Remotion — remplace les tweens CSS |
| **Interpolate** | Fonction de mapping (linéaire ou avec easing) entre des valeurs — `interpolate(frame, [0,30], [0,1])` |
| **BrandMotion** | Partie du BrandConfig définissant les springs et durées d'animation par SaaS |
| **Barrel export** | Fichier `index.ts` qui ré-exporte tout le contenu d'un dossier |
| **LDBackground** | Composant background cyberpunk spécifique à Leak Detector (grid amber, orbs, particles) |
| **TransitionSeries** | Composant de `@remotion/transitions` — remplace `<Series>` avec transitions visuelles |
| **SFX** | Sound Effects — sons de `@remotion/sfx` (ding, beep, etc.) |

---

## 14. ÉTAT DES LIEUX — Mars 2026

### Ce qui est complet

- ✅ 16 compositions Leak Detector (widescreen, vertical, square — standard + premium)
- ✅ Système brand complet (BrandConfig, tokens, Spring configs)
- ✅ 8 templates génériques dans `packages/templates`
- ✅ 7 composants primitifs dans `packages/core`
- ✅ Scripts d'automatisation (scaffold, render, screenshots)
- ✅ Tous les screenshots Leak Detector capturés dans `public/screenshots/`
- ✅ Documentation Claude Code complète (`.claude/*.md`)
- ✅ 7 packages Remotion avancés installés (transitions, noise, shapes, paths, sfx, motion-blur, media-utils)

### Prochaines étapes identifiées

- 🔜 Intégration `@remotion/transitions` dans `LDBeforeAfter` et `LDCinematicHero`
- 🔜 Remplacement du grain SVG par `noise3D` dans `LDBackground`
- 🔜 Ajout `ding()` sur les score reveals (`ScoreCircle`, `LDScreenDashboard`)
- 🔜 `<Pie>` de `@remotion/shapes` sur les score loaders
- 🔜 Son : musique lo-fi dark techno + SFX (whoosh, beep) dans `public/sounds/`
- 🔜 Nouveau SaaS : scaffolding quand le prochain produit est défini

---

_CONTEXT.md — Altidigitech Video Templates_
_Maintenu par les co-fondateurs et Claude Code_
