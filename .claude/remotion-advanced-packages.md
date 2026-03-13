# .claude/remotion-advanced-packages.md

# Skill : Packages Remotion Avancés — Référence complète

> **Quand lire ce fichier** : Avant d'utiliser @remotion/transitions,
> @remotion/noise, @remotion/shapes, @remotion/paths, @remotion/sfx,
> @remotion/motion-blur ou @remotion/media-utils.
> Lire APRÈS remotion-basics.md et remotion-animations.md.

---

## 1. @remotion/transitions

### Principe

`<TransitionSeries>` est un remplacement de `<Series>` qui permet des transitions
visuelles animées entre séquences. Les deux scènes sont rendues simultanément
pendant la durée de transition.

**RÈGLE CRITIQUE** : Une transition ne peut pas être plus longue que la durée
de la séquence précédente ou suivante.

### Import

```typescript
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { wipe } from '@remotion/transitions/wipe'
import { flip } from '@remotion/transitions/flip'
import { clockWipe } from '@remotion/transitions/clock-wipe'
import { iris } from '@remotion/transitions/iris'
import { none } from '@remotion/transitions/none'
```

### Usage de base

```typescript
const MyVideo = () => {
  const { fps } = useVideoConfig()

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneA />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 14, stiffness: 120 } })}
        durationInFrames={30}
      />

      <TransitionSeries.Sequence durationInFrames={120}>
        <SceneB />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  )
}
// Durée totale = 90 + 120 - 30 = 180 frames
```

### Timings disponibles

```typescript
// Spring : suit une courbe spring, durée calculée automatiquement
springTiming({
  config: { damping: 14, stiffness: 120 },  // configs brand habituelles
  durationRestThreshold: 0.001,              // précision de fin d'animation
})

// Linéaire : durée fixe, easing optionnel
linearTiming({
  durationInFrames: 30,
  easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
})
```

### Toutes les transitions disponibles

| Transition | Import | Options clés | Cas d'usage Leak Detector |
|---|---|---|---|
| `fade()` | `@remotion/transitions/fade` | `shouldFadeOutExiting?` | Intro → score reveal |
| `slide()` | `@remotion/transitions/slide` | `direction: from-left/right/top/bottom` | Séquences catégories |
| `wipe()` | `@remotion/transitions/wipe` | `direction: 8 options` | BeforeAfter |
| `flip()` | `@remotion/transitions/flip` | `direction`, `perspective` | Logo reveal |
| `clockWipe()` | `@remotion/transitions/clock-wipe` | `width`, `height` | Score reveal circulaire |
| `iris()` | `@remotion/transitions/iris` | `width`, `height` | Hero CTA reveal |
| `none()` | `@remotion/transitions/none` | — | Coupe franche avec son |

### TransitionSeries.Overlay (sans raccourcir la durée)

```typescript
// Overlay : rendu PAR-DESSUS la jonction, ne modifie PAS les durées
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneA />
  </TransitionSeries.Sequence>

  <TransitionSeries.Overlay durationInFrames={20}>
    {/* Flash amber au moment de la coupure */}
    <AbsoluteFill style={{
      background: 'rgba(245,158,11,0.3)',
      opacity: interpolate(useCurrentFrame(), [0, 10, 20], [0, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    }} />
  </TransitionSeries.Overlay>

  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
// Durée totale = 90 + 90 = 180 frames (Overlay ne raccourcit pas)
```

### Transitions custom

```typescript
import { TransitionPresentation } from '@remotion/transitions'

// Créer une transition avec clipPath en forme de cercle
const circleReveal = (): TransitionPresentation<Record<string, never>> => {
  const CirclePresentation: React.FC<{
    children: React.ReactNode
    presentationDirection: 'entering' | 'exiting'
    presentationProgress: number
  }> = ({ children, presentationDirection, presentationProgress }) => {
    const entering = presentationDirection === 'entering'
    const p = entering ? presentationProgress : 1

    return (
      <AbsoluteFill
        style={{
          clipPath: `circle(${p * 150}% at 50% 50%)`,
        }}
      >
        {children}
      </AbsoluteFill>
    )
  }

  return {
    component: CirclePresentation,
    props: {},
  }
}
```

---

## 2. @remotion/noise

### Principe

Simplex noise déterministe. Même seed + mêmes coordonnées = même valeur.
Retourne toujours une valeur entre **-1 et 1**.
Idéal pour les mouvements organiques, les backgrounds animés, les particules.

### Import

```typescript
import { noise2D, noise3D, noise4D } from '@remotion/noise'
```

### noise2D — Champ 2D

```typescript
// Paramètres : (seed: string, x: number, y: number) → [-1, 1]
const value = noise2D('grain-seed', x, y)

// Exemple : texture de grain sur un canvas
const GrainLayer = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  return (
    <AbsoluteFill style={{ mixBlendMode: 'overlay', opacity: 0.04 }}>
      <canvas
        ref={(canvas) => {
          if (!canvas) return
          const ctx = canvas.getContext('2d')!
          const imageData = ctx.createImageData(width, height)
          for (let i = 0; i < width * height; i++) {
            const x = (i % width) / width
            const y = Math.floor(i / width) / height
            // Seed change chaque frame pour un grain animé
            const n = noise2D(`grain-${frame % 60}`, x * 50, y * 50)
            const v = Math.floor((n + 1) * 127.5) // [-1,1] → [0,255]
            imageData.data[i * 4] = v
            imageData.data[i * 4 + 1] = v
            imageData.data[i * 4 + 2] = v
            imageData.data[i * 4 + 3] = 255
          }
          ctx.putImageData(imageData, 0, 0)
        }}
        width={width}
        height={height}
        style={{ position: 'absolute', inset: 0 }}
      />
    </AbsoluteFill>
  )
}
```

### noise3D — Champ 3D (recommandé pour animations)

```typescript
// Paramètres : (seed: string, x: number, y: number, z: number) → [-1, 1]
// Utiliser frame comme 3e dimension pour animer dans le temps

const OrganicParticle = ({ index }: { index: number }) => {
  const frame = useCurrentFrame()
  const speed = 0.003

  // Position qui bouge organiquement dans le temps
  const x = 50 + noise3D('px', index, 0, frame * speed) * 45
  const y = 50 + noise3D('py', index, 1, frame * speed) * 45
  const opacity = (noise3D('op', index, 2, frame * speed) + 1) / 2  // [0, 1]
  const scale = 0.5 + (noise3D('sc', index, 3, frame * speed) + 1) / 4  // [0.5, 1]

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#F59E0B',
      opacity,
      transform: `scale(${scale}) translate(-50%, -50%)`,
    }} />
  )
}

// Grille flottante avec noise3D
const FloatingGrid = () => {
  const frame = useCurrentFrame()
  const POINTS = 20

  return (
    <AbsoluteFill>
      {Array.from({ length: POINTS }, (_, i) => {
        const baseX = (i % 5) * 25
        const baseY = Math.floor(i / 5) * 25
        const offsetX = noise3D('gx', i, 0, frame * 0.005) * 5
        const offsetY = noise3D('gy', i, 1, frame * 0.005) * 5
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${baseX + offsetX}%`,
            top: `${baseY + offsetY}%`,
            width: 4, height: 4,
            borderRadius: '50%',
            background: 'rgba(245,158,11,0.4)',
          }} />
        )
      })}
    </AbsoluteFill>
  )
}
```

### noise4D — Champ 4D (orbites fluides)

```typescript
// Paramètres : (seed: string, x, y, z, w: number) → [-1, 1]
// Exemple : mouvement orbital fluide sans discontinuité
const t = frame * 0.01
const angle1 = Math.sin(t) * Math.PI
const angle2 = Math.cos(t) * Math.PI
const orbX = noise4D('orbit-x', Math.cos(angle1), Math.sin(angle1), Math.cos(angle2), Math.sin(angle2))
const orbY = noise4D('orbit-y', Math.cos(angle2), Math.sin(angle2), Math.cos(angle1), Math.sin(angle1))
```

### Remplacer le GrainOverlay SVG actuel

Le GrainOverlay actuel dans `LDBackground.tsx` utilise SVG `feTurbulence`.
**NE PAS remplacer LDBackground** — mais si on crée un nouveau composant
`NoiseBackground`, utiliser `noise3D` pour une meilleure performance.

---

## 3. @remotion/shapes

### Principe

Composants SVG purs, déterministes, sans dépendances.
Chaque shape existe en 2 formes :
- Composant React : `<Star />` — rendu direct dans JSX
- Fonction pure : `makeStar()` — retourne `{ path, width, height }` pour clipPath

### Import

```typescript
import {
  Rect, makeRect,
  Triangle, makeTriangle,
  Circle, makeCircle,
  Ellipse, makeEllipse,
  Star, makeStar,
  Pie, makePie,
  Polygon, makePolygon,
} from '@remotion/shapes'
```

### Composants React

```typescript
// Star animée — innerRadius croît de 0 à 80
<Star
  fill="#F59E0B"
  stroke="#D97706"
  strokeWidth={2}
  points={6}            // Nombre de pointes
  innerRadius={80}      // Rayon intérieur (0 = triangle)
  outerRadius={120}     // Rayon extérieur
  style={{ opacity: 0.8 }}
/>

// Pie — pour un loader de score circulaire
<Pie
  fill="#F59E0B"
  stroke="none"
  radius={80}
  progress={0.73}       // 0 à 1 — affiche 73% du cercle
  closePath             // Ferme le path vers le centre
  counterClockwise      // Direction de remplissage
/>

// Polygon
<Polygon
  fill="transparent"
  stroke="#F59E0B"
  strokeWidth={2}
  points={6}            // Hexagone
  radius={60}
/>
```

### Fonctions pures (pour clipPath et transitions)

```typescript
// makeStar retourne { path, width, height }
const { path } = makeStar({
  innerRadius: 80,
  outerRadius: 120,
  points: 6,
})

// Utiliser comme clipPath SVG pour une transition
<div style={{
  clipPath: `path('${path}')`,
  position: 'absolute',
  inset: 0,
}}>
  <SceneEntering />
</div>
```

### Pie comme score loader (pattern Leak Detector)

```typescript
// Score reveal animé avec @remotion/shapes
const ScoreReveal = ({ score }: { score: number }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 90], [0, score / 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  })

  return (
    <svg width={200} height={200} viewBox="-100 -100 200 200">
      {/* Track gris */}
      <Pie
        fill="transparent"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={12}
        radius={80}
        progress={1}
        closePath={false}
        counterClockwise={false}
      />
      {/* Progress amber */}
      <Pie
        fill="transparent"
        stroke="#F59E0B"
        strokeWidth={12}
        radius={80}
        progress={progress}
        closePath={false}
        counterClockwise={false}
      />
    </svg>
  )
}
```

---

## 4. @remotion/paths

### Principe

Manipulation pure de paths SVG. Aucune dépendance, type-safe.
Compatible avec `@remotion/shapes` (les fonctions `make*()` retournent des paths utilisables ici).

### Import

```typescript
import {
  interpolatePath,   // Morphing entre deux paths
  evolvePath,        // Dessine un path progressivement
  getLength,         // Longueur totale d'un path
  getPointAtLength,  // Point à une distance donnée
  getTangentAtLength, // Tangente à un point
  warpPath,          // Déformer un path avec une fonction
  scalePath,         // Redimensionner un path
  translatePath,     // Déplacer un path
  getBoundingBox,    // Bounding box d'un path
  normalizePath,     // Normaliser pour morphing
  reversePath,       // Inverser le sens
} from '@remotion/paths'
```

### evolvePath — Path qui se dessine

```typescript
// Un graphique ou une courbe qui s'anime progressivement
const DrawingPath = ({ d }: { d: string }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.ease,
  })

  // evolvePath retourne { strokeDasharray, strokeDashoffset }
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d)

  return (
    <svg width="100%" height="100%">
      <path
        d={d}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={3}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  )
}
```

### interpolatePath — Morphing entre shapes

```typescript
// Morphing d'une étoile vers un cercle
const MorphingShape = () => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const { path: starPath } = makeStar({ innerRadius: 40, outerRadius: 80, points: 6 })
  const { path: circlePath } = makeCircle({ radius: 80 })

  // Les deux paths doivent avoir le même nombre de commandes
  // Utiliser normalizePath() si nécessaire
  const morphedPath = interpolatePath(progress, [starPath, circlePath])

  return (
    <svg viewBox="-100 -100 200 200" width={200} height={200}>
      <path d={morphedPath} fill="#F59E0B" opacity={0.8} />
    </svg>
  )
}
```

### getPointAtLength — Objet qui suit un path

```typescript
// Logo ou point qui suit une courbe
const ObjectOnPath = ({ path: d }: { path: string }) => {
  const frame = useCurrentFrame()
  const length = getLength(d)
  const progress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const { x, y } = getPointAtLength(d, progress * length)
  const { x: tx, y: ty } = getTangentAtLength(d, progress * length)
  const angle = Math.atan2(ty, tx) * (180 / Math.PI)

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: '#F59E0B',
    }} />
  )
}
```

---

## 5. @remotion/sfx

### Principe

Sons prédéfinis, zero config, zero fichier à télécharger.
À utiliser avec `<Sequence>` pour déclencher au bon moment.

### Import

```typescript
import { Ding, Beep, Whoosh } from '@remotion/sfx'
// Ou : ding, beep, bruh, vineBoom, windowsXpError, etc.
```

### Usage

```typescript
import { ding } from '@remotion/sfx'
import { Audio } from 'remotion'

// Dans une composition
const MyComp = () => {
  return (
    <>
      {/* Ding quand le score apparaît — à la frame 90 */}
      <Sequence from={90} durationInFrames={60}>
        <Audio src={ding()} volume={0.6} />
      </Sequence>
    </>
  )
}
```

### Liste des sons disponibles (v4.0.433+)

```typescript
import {
  ding,           // Cloche claire — parfait pour score reveal
  beep,           // Bip électronique
  bruh,           // Effet meme
  vineBoom,       // Boom grave
  windowsXpError, // Erreur Windows XP
} from '@remotion/sfx'

// Chaque fonction retourne une URL (string) utilisable dans <Audio src={...} />
```

### Pattern Leak Detector : ding sur score reveal

```typescript
const ScoreSection = () => {
  return (
    <>
      {/* Score number apparaît à la frame 60 */}
      <Sequence from={60}>
        <ScoreCircle score={73} />
      </Sequence>

      {/* Ding synchronisé avec l'apparition */}
      <Sequence from={60} durationInFrames={30}>
        <Audio src={ding()} volume={0.5} />
      </Sequence>
    </>
  )
}
```

---

## 6. @remotion/motion-blur

### Principe

Deux composants :
- `<Trail>` : Blur "fantôme" — empile les frames précédentes à opacité décroissante
- `<CameraMotionBlur>` : Blur cinématique naturel — simule un obturateur de caméra

### Import

```typescript
import { Trail, CameraMotionBlur } from '@remotion/motion-blur'
```

### Trail

```typescript
// Les enfants doivent être en AbsoluteFill (required)
<Trail
  frames={8}       // Nombre de frames de trail (plus = plus de blur)
  lag={0.1}        // Décalage entre chaque frame fantôme
  opacity={1}      // Opacité maximale (la plus proche)
>
  <AbsoluteFill>
    <MyAnimatedElement />
  </AbsoluteFill>
</Trail>
```

### CameraMotionBlur (recommandé pour un rendu cinématique)

```typescript
// IMPORTANT : les enfants DOIVENT être en position absolute (AbsoluteFill)
<CameraMotionBlur
  shutterAngle={180}  // Angle d'obturateur (180° = cinéma standard). Plus élevé = plus de blur
  samples={10}        // Qualité (plus = meilleur rendu, plus lent). Garder bas (5-15)
>
  <AbsoluteFill>
    <MyMovingCard />
  </AbsoluteFill>
</CameraMotionBlur>
```

### Avertissement couleur

`<CameraMotionBlur>` est **destructif pour les couleurs** — il mélange les frames
et peut dégrader des couleurs vives. Inspecter soigneusement le rendu output.
Garder `samples` bas (5-8) et `shutterAngle` <= 180.

### Pattern recommandé pour Leak Detector

```typescript
// Sur les entrées de cartes — wrap UNIQUEMENT l'élément qui bouge
const AnimatedCard = ({ startFrame }: { startFrame: number }) => {
  const frame = useCurrentFrame()
  const entering = frame < startFrame + 30

  if (!entering) {
    // Pas de blur quand statique — économise du temps de rendu
    return <AbsoluteFill><GlassCard /></AbsoluteFill>
  }

  return (
    <CameraMotionBlur shutterAngle={120} samples={6}>
      <AbsoluteFill><GlassCard /></AbsoluteFill>
    </CameraMotionBlur>
  )
}
```

---

## 7. @remotion/media-utils

### Principe

`useAudioData()` + `visualizeAudio()` pour des éléments UI réactifs à l'audio.

### Import

```typescript
import { useAudioData, visualizeAudio } from '@remotion/media-utils'
```

### Usage avec visualizeAudio

```typescript
import { Audio, staticFile } from 'remotion'
import { useAudioData, visualizeAudio } from '@remotion/media-utils'

const AudioBars = ({ audioSrc }: { audioSrc: string }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const audioData = useAudioData(audioSrc)

  if (!audioData) return null

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 32,  // Puissance de 2 : 16, 32, 64, 128
  })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {visualization.map((v, i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: v * 80,         // v est entre 0 et 1
            backgroundColor: '#F59E0B',
            borderRadius: 2,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  )
}

// Dans la composition :
const MyMusicVideo = () => {
  const AUDIO_SRC = staticFile('sounds/bg-music.mp3')

  return (
    <>
      <Audio src={AUDIO_SRC} volume={0.4} />
      <AudioBars audioSrc={AUDIO_SRC} />
    </>
  )
}
```

### visualizeAudioWaveform (pour voix)

```typescript
import { visualizeAudioWaveform } from '@remotion/media-utils'

const waveform = visualizeAudioWaveform({
  fps,
  frame,
  audioData,
  numberOfSamples: 64,
  windowInSeconds: 0.3,  // Fenêtre temporelle affichée
  normalize: true,        // Scale pour que le max = 1
})
// waveform : tableau de valeurs [-1, 1]
```

---

## PATTERNS DE COMBINAISON (pour Leak Detector)

### Pattern A — Score reveal avec ding + clockWipe + Pie

```typescript
// Dans LDBeforeAfter ou toute composition avec score
import { TransitionSeries, springTiming } from '@remotion/transitions'
import { clockWipe } from '@remotion/transitions/clock-wipe'
import { Pie } from '@remotion/shapes'
import { Audio } from 'remotion'
import { ding } from '@remotion/sfx'

const ScoreRevealSection = ({ score }: { score: number }) => {
  const frame = useCurrentFrame()
  const { width, height, fps } = useVideoConfig()
  const progress = interpolate(frame, [0, 90], [0, score / 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  })

  return (
    <>
      <Audio src={ding()} volume={0.5} />
      <svg width={200} height={200}>
        <Pie radius={90} progress={progress} fill="none"
          stroke="#F59E0B" strokeWidth={14} closePath={false} />
      </svg>
    </>
  )
}
```

### Pattern B — Transition wipe amber entre Before et After

```typescript
import { TransitionSeries, springTiming } from '@remotion/transitions'
import { wipe } from '@remotion/transitions/wipe'

const BeforeAfterTransition = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={180}>
      <BeforeScene score={42} />
    </TransitionSeries.Sequence>

    <TransitionSeries.Transition
      presentation={wipe({ direction: 'from-left' })}
      timing={springTiming({ config: { damping: 14, stiffness: 100 } })}
      durationInFrames={45}
    />

    <TransitionSeries.Sequence durationInFrames={240}>
      <AfterScene score={87} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
)
```

### Pattern C — Particles organiques avec noise3D

```typescript
import { noise3D } from '@remotion/noise'

const OrganicParticles = ({ count = 20 }: { count?: number }) => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const x = 50 + noise3D(`px-${i}`, i * 0.1, 0, frame * 0.004) * 40
        const y = 50 + noise3D(`py-${i}`, 0, i * 0.1, frame * 0.004) * 40
        const opacity = (noise3D(`op-${i}`, i * 0.2, 1, frame * 0.005) + 1) / 2 * 0.6
        const size = 3 + (noise3D(`sz-${i}`, i * 0.3, 2, frame * 0.003) + 1) * 3

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            opacity,
            transform: 'translate(-50%, -50%)',
          }} />
        )
      })}
    </AbsoluteFill>
  )
}
```

### Pattern D — Path qui se dessine (catégories Leak Detector)

```typescript
import { evolvePath } from '@remotion/paths'
import { makePie } from '@remotion/shapes'

// Anneau de score qui se dessine frame par frame
const CategoryArc = ({ score, startFrame }: { score: number; startFrame: number }) => {
  const frame = useCurrentFrame()
  const localFrame = Math.max(0, frame - startFrame)
  const targetProgress = score / 100

  const animatedProgress = interpolate(localFrame, [0, 60], [0, targetProgress], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  })

  const { path } = makePie({ radius: 40, progress: animatedProgress, closePath: false })
  const { strokeDasharray, strokeDashoffset } = evolvePath(1, path) // evolvePath à 1 = path complet

  return (
    <svg width={100} height={100} viewBox="-50 -50 100 100">
      <path
        d={path}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={8}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  )
}
```

---

## RÈGLES IMPÉRATIVES

1. **Toujours vérifier que les packages sont importés du bon chemin** :
   - `@remotion/transitions` (pas `remotion/transitions`)
   - `@remotion/transitions/fade` (import séparé pour chaque transition)

2. **Durée de transition <= durée de la séquence** — sinon erreur runtime

3. **`<CameraMotionBlur>` et `<Trail>` nécessitent `AbsoluteFill` enfant obligatoirement**

4. **`noise3D` avec `frame * vitesse` pour animer dans le temps** — garder vitesse < 0.01

5. **`@remotion/sfx` retourne une URL, wrapper dans `<Audio src={...} />`**

6. **`evolvePath` retourne `{ strokeDasharray, strokeDashoffset }` — appliquer sur `<path>` SVG**

7. **`interpolatePath` exige que les deux paths aient la même structure** — utiliser `normalizePath()` si morphing entre shapes différentes

---

_Skill : remotion-advanced-packages.md — Altidigitech Video Templates_
_Packages : @remotion/transitions, @remotion/noise, @remotion/shapes, @remotion/paths, @remotion/sfx, @remotion/motion-blur, @remotion/media-utils_
