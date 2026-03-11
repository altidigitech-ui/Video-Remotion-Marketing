# .claude/remotion-basics.md

# Skill : Remotion Basics — API Core, Hooks & Patterns Fondamentaux

> **Quand lire ce fichier** : Avant de créer ou modifier tout composant Remotion.
> Ce fichier couvre l'API essentielle. Pour les animations avancées → `remotion-animations.md`.

---

## 1. CONCEPTS FONDAMENTAUX REMOTION

### Comment Remotion fonctionne

Remotion rend chaque frame **indépendamment** en prenant un screenshot React à chaque frame number.

```
Frame 0   → React render → screenshot PNG
Frame 1   → React render → screenshot PNG
Frame 2   → React render → screenshot PNG
...
Frame N   → React render → screenshot PNG
           ↓
           FFmpeg assemble les PNG → MP4
```

**Conséquences critiques :**

- Pas de `setTimeout`, `setInterval`, `Date.now()` → tout doit dépendre de `useCurrentFrame()`
- Pas de `useState` pour l'état d'animation → les frames sont indépendantes
- Pas de requêtes réseau dans les composants → tout fetch en dehors, passer en props
- Les composants doivent être **purs** et **déterministes** : même frame = même résultat toujours

---

## 2. HOOKS FONDAMENTAUX

### `useCurrentFrame()`

Retourne le numéro de frame actuel (commence à 0).

```typescript
import { useCurrentFrame } from 'remotion'

const MyComp = () => {
  const frame = useCurrentFrame()
  // frame = 0 au début, augmente de 1 à chaque frame
  return <div>Frame actuelle : {frame}</div>
}
```

### `useVideoConfig()`

Retourne la configuration de la composition courante.

```typescript
import { useVideoConfig } from 'remotion'

const MyComp = () => {
  const {
    width,            // largeur en px (ex: 1920)
    height,           // hauteur en px (ex: 1080)
    fps,              // frames par seconde (ex: 60)
    durationInFrames, // durée totale en frames (ex: 300)
  } = useVideoConfig()

  // Convertir frames en secondes
  const totalSeconds = durationInFrames / fps   // 300 / 60 = 5s
  const currentSecond = useCurrentFrame() / fps  // frame 60 / 60 = 1s

  return <div>{width}x{height} @ {fps}fps</div>
}
```

### Calculs de temps courants

```typescript
const frame = useCurrentFrame()
const { fps, durationInFrames } = useVideoConfig()

// Temps en secondes depuis le début
const seconds = frame / fps

// Progression globale (0 à 1)
const progress = frame / durationInFrames

// Est-ce qu'on est dans une fenêtre temporelle ?
const isVisible = frame >= 30 && frame < 120

// Progression dans une fenêtre (0 à 1)
const windowProgress = Math.min(1, Math.max(0, (frame - 30) / (120 - 30)))
```

---

## 3. COMPOSANTS DE LAYOUT

### `<AbsoluteFill>`

Div qui couvre 100% de la composition (position absolute, top/left/right/bottom = 0).
**C'est le wrapper de base pour tout composant Remotion.**

```typescript
import { AbsoluteFill } from 'remotion'

const MyComp = () => (
  <AbsoluteFill style={{ backgroundColor: '#000000' }}>
    {/* Contenu positionné en absolu dans la composition */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      Centré
    </div>
  </AbsoluteFill>
)
```

### `<Sequence>`

Contrôle **quand** un composant est visible dans la timeline.

```typescript
import { AbsoluteFill, Sequence } from 'remotion'

const MyComp = () => (
  <AbsoluteFill>
    {/* Visible de la frame 0 à 60 (1 seconde à 60fps) */}
    <Sequence from={0} durationInFrames={60}>
      <Intro />
    </Sequence>

    {/* Visible de la frame 60 à 240 */}
    <Sequence from={60} durationInFrames={180}>
      <MainContent />
    </Sequence>

    {/* Visible de la frame 240 jusqu'à la fin */}
    <Sequence from={240}>
      <Outro />
    </Sequence>

    {/* Nommé pour le débogage dans le studio */}
    <Sequence from={0} durationInFrames={60} name="Intro animée">
      <Intro />
    </Sequence>
  </AbsoluteFill>
)
```

> ⚠️ À l'intérieur d'une `<Sequence>`, `useCurrentFrame()` retourne
> la frame **relative** à la Sequence (commence à 0 au début de la Sequence).

```typescript
// Si Sequence from={60}
// À la frame globale 60 → useCurrentFrame() = 0 dans la Sequence
// À la frame globale 90 → useCurrentFrame() = 30 dans la Sequence
```

### `<Series>`

Enchaîne des séquences automatiquement sans calculer les offsets.

```typescript
import { Series } from 'remotion'

const MyComp = () => (
  <Series>
    <Series.Sequence durationInFrames={60}>
      <Intro />
    </Series.Sequence>
    <Series.Sequence durationInFrames={180}>
      <MainContent />
    </Series.Sequence>
    <Series.Sequence durationInFrames={60}>
      <Outro />
    </Series.Sequence>
  </Series>
)
// Remotion calcule automatiquement : Intro [0-60], Main [60-240], Outro [240-300]
```

### `<Loop>`

Répète un composant en boucle.

```typescript
import { Loop } from 'remotion'

const MyComp = () => (
  <Loop durationInFrames={30} times={5}>
    {/* Se répète 5 fois, 30 frames chacune = 150 frames total */}
    <ParticleEffect />
  </Loop>
)

// Boucle infinie (jusqu'à la fin de la composition)
const InfiniteLoop = () => (
  <Loop durationInFrames={60}>
    <BackgroundAnimation />
  </Loop>
)
```

---

## 4. COMPOSITION ROOT

### Définition d'une composition

```typescript
import { Composition } from 'remotion'
import { MyVideo } from './MyVideo'

// Le composant root DOIT s'appeler RemotionRoot
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Composition principale */}
      <Composition
        id="my-video"                    // ID unique kebab-case
        component={MyVideo}              // Composant React
        durationInFrames={300}           // 5s à 60fps
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{                  // Props par défaut (éditables dans le studio)
          title: 'Mon titre',
          subtitle: 'Mon sous-titre',
        }}
      />

      {/* Plusieurs compositions dans le même root */}
      <Composition
        id="my-video-vertical"
        component={MyVideoVertical}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Mon titre',
        }}
      />
    </>
  )
}
```

### Calculs de durée utiles

```typescript
// Convertir secondes → frames
const secondsToFrames = (seconds: number, fps: number) => Math.round(seconds * fps)

// Exemples
const INTRO_DURATION = secondsToFrames(2, 60) // 120 frames
const MAIN_DURATION = secondsToFrames(5, 60) // 300 frames
const OUTRO_DURATION = secondsToFrames(2, 60) // 120 frames
const TOTAL_DURATION = INTRO_DURATION + MAIN_DURATION + OUTRO_DURATION // 540 frames = 9s
```

---

## 5. MÉDIAS : VIDÉO, IMAGE, AUDIO

### `<OffthreadVideo>` (préféré à `<Video>`)

Pour intégrer des fichiers vidéo. `OffthreadVideo` est plus performant au rendu.

```typescript
import { OffthreadVideo, staticFile } from 'remotion'

const MyComp = () => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile('videos/my-clip.mp4')}  // depuis public/
      // ou URL directe
      src="https://example.com/video.mp4"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      volume={0.8}                             // 0 à 1
      startFrom={30}                           // Commencer à la frame 30 de la vidéo source
      endAt={150}                              // Terminer à la frame 150 de la vidéo source
    />
  </AbsoluteFill>
)
```

### `<Img>` (préféré à `<img>`)

Remotion attend que l'image soit chargée avant de rendre la frame.

```typescript
import { Img, staticFile } from 'remotion'

const MyComp = () => (
  <Img
    src={staticFile('images/logo.png')}   // depuis public/
    style={{ width: 200, height: 'auto' }}
  />
)
```

### `<Audio>`

Pour les musiques de fond et effets sonores.

```typescript
import { Audio, staticFile } from 'remotion'

const MyComp = () => (
  <>
    {/* Musique de fond */}
    <Audio
      src={staticFile('sounds/background.mp3')}
      volume={0.4}
      loop                                 // Boucle infinie
    />

    {/* Son avec fondu entrant/sortant */}
    <Audio
      src={staticFile('sounds/whoosh.mp3')}
      volume={(frame) => {
        // Fondu entrant sur 30 frames
        return interpolate(frame, [0, 30], [0, 1], {
          extrapolateRight: 'clamp'
        })
      }}
    />
  </>
)
```

### `staticFile()`

Résout le chemin vers le dossier `public/` du projet.

```typescript
import { staticFile } from 'remotion'

// public/logo.svg → staticFile('logo.svg')
// public/sounds/bg.mp3 → staticFile('sounds/bg.mp3')
// public/fonts/inter.woff2 → staticFile('fonts/inter.woff2')
```

---

## 6. FONTS

### Google Fonts (recommandé)

```typescript
import { loadFont } from '@remotion/google-fonts/Inter'

// Charger AVANT le composant, au niveau module
const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
})

const MyComp = () => (
  <div style={{ fontFamily }}>
    Texte avec Inter
  </div>
)
```

### Fonts locales (dans public/fonts/)

```typescript
// Dans un fichier de setup, ex: packages/brand/src/fonts.ts
import { continueRender, delayRender, staticFile } from 'remotion'

export const loadLocalFont = () => {
  const handle = delayRender('Loading font')

  const font = new FontFace(
    'ClashDisplay',
    `url(${staticFile('fonts/ClashDisplay-Variable.woff2')}) format('woff2')`,
  )

  font.load().then(() => {
    document.fonts.add(font)
    continueRender(handle)
  })
}
```

---

## 7. `delayRender` / `continueRender`

Utilisé pour attendre que des ressources async soient prêtes avant le rendu.

```typescript
import { continueRender, delayRender, useEffect } from 'remotion'

const MyComp = () => {
  const handle = useMemo(() => delayRender('Chargement des données'), [])

  useEffect(() => {
    fetchData().then((data) => {
      // Mettre à jour le state avec les données
      setData(data)
      // Signaler que le rendu peut continuer
      continueRender(handle)
    })
  }, [handle])

  return <div>{/* contenu */}</div>
}
```

> ⚠️ Si `continueRender` n'est jamais appelé, Remotion timeout après 30s.
> Toujours appeler `continueRender` dans un bloc finally ou catch.

---

## 8. PREFETCH & PRELOAD

Pour les compositions avec beaucoup de médias, preloader les assets.

```typescript
import { prefetch, staticFile } from 'remotion'

// Preloader un fichier vidéo
const { free, waitUntilDone } = prefetch(staticFile('videos/clip.mp4'), {
  method: 'blob-url',
})

// Attendre que le prefetch soit terminé
await waitUntilDone()

// Libérer la mémoire quand plus nécessaire
free()
```

---

## 9. RANDOM (déterministe)

Remotion fournit une fonction `random()` déterministe — même seed = même valeur.
**Ne jamais utiliser `Math.random()` dans les composants** (non-déterministe entre frames).

```typescript
import { random } from 'remotion'

const MyComp = () => {
  // Toujours la même valeur pour la même seed
  const randomX = random('particle-x-1') * 1920   // 0 à 1920
  const randomY = random('particle-y-1') * 1080   // 0 à 1080
  const randomOpacity = random('opacity-1')        // 0 à 1

  // Pour N particules
  const particles = Array.from({ length: 50 }, (_, i) => ({
    x: random(`particle-x-${i}`) * 1920,
    y: random(`particle-y-${i}`) * 1080,
    size: random(`particle-size-${i}`) * 20 + 5,
  }))

  return (
    <AbsoluteFill>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          backgroundColor: 'white',
        }} />
      ))}
    </AbsoluteFill>
  )
}
```

---

## 10. EVENTSOURCE & INPUT PROPS

### Passer des données dynamiques à une composition

```typescript
// Définir le schema des props avec Zod (obligatoire pour Lambda)
import { z } from 'zod'

export const myVideoSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  accentColor: z.string().default('#6366F1'),
  durationInSeconds: z.number().min(1).max(60),
})

export type MyVideoProps = z.infer<typeof myVideoSchema>

// Dans la Composition
<Composition
  id="my-video"
  component={MyVideo}
  schema={myVideoSchema}           // Validation automatique des props
  durationInFrames={300}
  fps={60}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Titre par défaut',
    accentColor: '#6366F1',
    durationInSeconds: 5,
  }}
  calculateMetadata={({ props }) => ({
    // Durée dynamique basée sur les props
    durationInFrames: props.durationInSeconds * 60,
  })}
/>
```

---

## 11. `calculateMetadata`

Permet de calculer dynamiquement les métadonnées de la composition (durée, fps, etc.).

```typescript
import { Composition, calculateMetadata } from 'remotion'

<Composition
  id="dynamic-duration"
  component={MyVideo}
  fps={60}
  width={1920}
  height={1080}
  defaultProps={{ slides: ['slide1', 'slide2', 'slide3'] }}
  calculateMetadata={({ props }) => {
    const framesPerSlide = 120 // 2 secondes par slide
    return {
      durationInFrames: props.slides.length * framesPerSlide,
    }
  }}
/>
```

---

## 12. STRUCTURE DE FICHIERS D'UN PACKAGE REMOTION

```
packages/core/
├── src/
│   ├── components/
│   │   ├── HeroTitle/
│   │   │   ├── HeroTitle.tsx         ← Composant principal
│   │   │   ├── HeroTitle.test.tsx    ← Tests unitaires
│   │   │   └── index.ts              ← Re-export
│   │   ├── FeatureList/
│   │   │   ├── FeatureList.tsx
│   │   │   └── index.ts
│   │   └── index.ts                  ← Barrel export de tous les composants
│   ├── hooks/
│   │   ├── useSpring.ts              ← Hooks utilitaires custom
│   │   └── index.ts
│   └── index.ts                      ← Export principal du package
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

### Barrel exports (pattern obligatoire)

```typescript
// packages/core/src/components/index.ts
export { HeroTitle } from './HeroTitle'
export type { HeroTitleProps } from './HeroTitle'

export { FeatureList } from './FeatureList'
export type { FeatureListProps } from './FeatureList'

// packages/core/src/index.ts
export * from './components'
export * from './hooks'
```

---

## 13. CONFIGURATION `remotion.config.ts`

```typescript
// remotion.config.ts (à la racine de chaque projet Remotion)
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg') // jpeg plus rapide que png en preview
Config.setOverwriteOutput(true) // Écraser les renders existants
Config.setPixelFormat('yuv420p') // Compatible avec la plupart des players
Config.setConcurrency(4) // Threads parallèles pour le rendu
Config.setChromiumOpenGlRenderer('angle') // Meilleur rendu WebGL

// Pour les compositions avec médias externes
Config.setDelayRenderTimeoutInMilliseconds(30000) // 30s timeout
```

---

## 14. DEBUGGING TIPS

### Afficher la frame courante (dev only)

```typescript
const FrameDebug: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '4px 8px',
      fontFamily: 'monospace',
      fontSize: 14,
      zIndex: 9999,
    }}>
      F:{frame} T:{(frame / fps).toFixed(2)}s
    </div>
  )
}
```

### Inspecter les valeurs d'animation

```typescript
// Wrapper pour débugger les valeurs calculées
const debugValue = (label: string, value: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Remotion Debug] ${label}:`, value)
  }
  return value
}

// Usage
const opacity = debugValue(
  'opacity',
  interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  }),
)
```

### Studio Remotion — raccourcis clavier

```
Space          → Play/Pause
← / →          → Frame précédente/suivante
Shift + ← / →  → -10 / +10 frames
Home / End     → Début / Fin
J / K / L      → Vitesse de lecture (comme Premiere Pro)
```

---

## 15. ERREURS FRÉQUENTES ET SOLUTIONS

| Erreur                                       | Cause                                | Solution                                                          |
| -------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `useCurrentFrame called outside composition` | Hook appelé hors d'une composition   | Vérifier que le composant est bien rendu dans une `<Composition>` |
| `Component did not render in time`           | `delayRender` jamais résolu          | Vérifier que `continueRender` est appelé, même en cas d'erreur    |
| Video flickers on render                     | Asset non préchargé                  | Utiliser `prefetch()` ou `<Preload>`                              |
| `NaN` dans les animations                    | Division par zéro dans `interpolate` | Vérifier que `durationInFrames > 0`                               |
| Audio out of sync                            | FPS mismatch                         | Vérifier que le FPS de la composition = FPS du rendu              |
| White flash between sequences                | Pas de background color              | Ajouter `backgroundColor` sur l'`AbsoluteFill` racine             |

---

_Skill : remotion-basics.md — Altidigitech Video Templates_
_Lire ensuite : `.claude/remotion-animations.md` pour les animations avancées_
