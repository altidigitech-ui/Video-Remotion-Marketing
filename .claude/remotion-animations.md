# .claude/remotion-animations.md

# Skill : Remotion Animations — Spring, Interpolate, Easing & Motion Design

> **Quand lire ce fichier** : Avant de créer toute animation dans une composition.
> Prérequis : avoir lu `remotion-basics.md`.

---

## 1. LES DEUX FONCTIONS D'ANIMATION CORE

### `interpolate()` — Mapping linéaire (ou avec easing)

Mappe une valeur d'entrée vers une valeur de sortie.

```typescript
import { interpolate, useCurrentFrame } from 'remotion'

const frame = useCurrentFrame()

// Syntaxe de base
const value = interpolate(
  frame, // valeur d'entrée (la frame courante)
  [0, 60], // plage d'entrée [début, fin]
  [0, 1], // plage de sortie [début, fin]
  {
    extrapolateLeft: 'clamp', // TOUJOURS mettre clamp
    extrapolateRight: 'clamp', // TOUJOURS mettre clamp
  },
)
// frame 0  → 0
// frame 30 → 0.5
// frame 60 → 1
// frame 90 → 1 (clampé)
```

> ⚠️ **Règle absolue** : Toujours mettre `extrapolateLeft: 'clamp'` et
> `extrapolateRight: 'clamp'` sauf cas très spécifique documenté.
> Sans clamp, les valeurs sortent de la plage et créent des bugs visuels.

### `spring()` — Animation physique (recommandé pour les mouvements)

Simule un ressort physique. Produit des animations organiques et cinématiques.

```typescript
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'

const frame = useCurrentFrame()
const { fps } = useVideoConfig()

const value = spring({
  frame, // frame courante
  fps, // fps de la composition (OBLIGATOIRE)
  config: {
    damping: 12, // amortissement (plus élevé = s'arrête plus vite)
    mass: 1, // masse (plus élevé = plus lent et plus overshoot)
    stiffness: 100, // rigidité (plus élevé = plus rapide)
    overshootClamping: false, // true = pas de dépassement
  },
  from: 0, // valeur de départ
  to: 1, // valeur d'arrivée
  delay: 30, // délai en frames avant de démarrer
})
```

---

## 2. CONFIGURATIONS SPRING PRÊTES À L'EMPLOI

### Présets standard Altidigitech

```typescript
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'

const frame = useCurrentFrame()
const { fps } = useVideoConfig()

// 🎯 SNAPPY — Rapide et précis, idéal pour les UI elements
const snappy = spring({
  frame,
  fps,
  config: {
    damping: 200,
    mass: 0.5,
    stiffness: 400,
  },
})

// 🌊 SMOOTH — Fluide et élégant, idéal pour les titres
const smooth = spring({
  frame,
  fps,
  config: {
    damping: 12,
    mass: 1,
    stiffness: 100,
  },
})

// 💫 BOUNCY — Rebond expressif, idéal pour les logos et accents
const bouncy = spring({
  frame,
  fps,
  config: {
    damping: 8,
    mass: 0.8,
    stiffness: 150,
    overshootClamping: false,
  },
})

// 🎬 CINEMATIC — Lent et dramatique, idéal pour les reveals
const cinematic = spring({
  frame,
  fps,
  config: {
    damping: 20,
    mass: 2,
    stiffness: 80,
  },
})

// ⚡ INSTANT — Quasi-immédiat, idéal pour les micro-interactions
const instant = spring({
  frame,
  fps,
  config: {
    damping: 500,
    mass: 0.3,
    stiffness: 800,
  },
})
```

---

## 3. ANIMATIONS D'ENTRÉE (ENTER ANIMATIONS)

### Fade In

```typescript
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(
    frame,
    [delay, delay + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return <div style={{ opacity }}>{children}</div>
}
```

### Slide Up (avec spring)

```typescript
const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const translateY = spring({
    frame: frame - delay,
    fps,
    from: 80,
    to: 0,
    config: { damping: 12, mass: 1, stiffness: 100 },
  })

  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      {children}
    </div>
  )
}
```

### Scale In

```typescript
const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  })

  const opacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {children}
    </div>
  )
}
```

### Slide In depuis la gauche/droite

```typescript
type Direction = 'left' | 'right' | 'top' | 'bottom'

const SlideIn: React.FC<{
  children: React.ReactNode
  direction?: Direction
  distance?: number
  delay?: number
}> = ({ children, direction = 'left', distance = 100, delay = 0 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15, stiffness: 120, mass: 1 },
  })

  const getTransform = () => {
    const offset = distance * (1 - progress)
    switch (direction) {
      case 'left':   return `translateX(-${offset}px)`
      case 'right':  return `translateX(${offset}px)`
      case 'top':    return `translateY(-${offset}px)`
      case 'bottom': return `translateY(${offset}px)`
    }
  }

  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <div style={{ opacity, transform: getTransform() }}>
      {children}
    </div>
  )
}
```

---

## 4. ANIMATIONS DE SORTIE (EXIT ANIMATIONS)

### Pattern standard : enter + exit dans le même composant

```typescript
type AnimatedProps = {
  children: React.ReactNode
  enterAt: number      // frame de début d'entrée
  exitAt: number       // frame de début de sortie
  enterDuration?: number
  exitDuration?: number
}

const Animated: React.FC<AnimatedProps> = ({
  children,
  enterAt,
  exitAt,
  enterDuration = 30,
  exitDuration = 20,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Entrée avec spring
  const enterProgress = spring({
    frame: frame - enterAt,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 100, mass: 1 },
  })

  // Sortie avec interpolate linéaire
  const exitProgress = interpolate(
    frame,
    [exitAt, exitAt + exitDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const opacity = Math.max(0, Math.min(enterProgress, 1 - exitProgress))
  const translateY = interpolate(exitProgress, [0, 1], [0, -40])

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      {children}
    </div>
  )
}
```

---

## 5. TRANSITIONS ENTRE SCÈNES

### Cross Fade (fondu enchaîné)

```typescript
const CrossFade: React.FC<{
  sceneA: React.ReactNode
  sceneB: React.ReactNode
  transitionAt: number    // frame où commence la transition
  duration?: number       // durée de la transition en frames
}> = ({ sceneA, sceneB, transitionAt, duration = 30 }) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame,
    [transitionAt, transitionAt + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress }}>
        {sceneA}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>
        {sceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

### Wipe (balayage horizontal)

```typescript
const WipeTransition: React.FC<{
  sceneA: React.ReactNode
  sceneB: React.ReactNode
  transitionAt: number
  duration?: number
}> = ({ sceneA, sceneB, transitionAt, duration = 45 }) => {
  const frame = useCurrentFrame()
  const { width } = useVideoConfig()

  const progress = spring({
    frame: frame - transitionAt,
    fps: 60,
    from: 0,
    to: 1,
    config: { damping: 20, stiffness: 120, mass: 1 },
  })

  const clipX = progress * width

  return (
    <AbsoluteFill>
      <AbsoluteFill>{sceneA}</AbsoluteFill>
      <AbsoluteFill style={{
        clipPath: `inset(0 0 0 ${clipX}px)`,
      }}>
        {sceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

### Zoom Transition

```typescript
const ZoomTransition: React.FC<{
  scene: React.ReactNode
  transitionAt: number
  duration?: number
  direction?: 'in' | 'out'
}> = ({ scene, transitionAt, duration = 30, direction = 'in' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: frame - transitionAt,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15, stiffness: 100, mass: 1 },
  })

  const scale = direction === 'in'
    ? interpolate(progress, [0, 1], [1.1, 1])
    : interpolate(progress, [0, 1], [1, 1.1])

  const opacity = direction === 'in'
    ? interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' })
    : interpolate(progress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity,
      transform: `scale(${scale})`,
    }}>
      {scene}
    </AbsoluteFill>
  )
}
```

---

## 6. ANIMATIONS DE TEXTE

### Typewriter Effect

```typescript
const Typewriter: React.FC<{
  text: string
  startAt?: number
  charsPerFrame?: number
  color?: string
  fontSize?: number
}> = ({
  text,
  startAt = 0,
  charsPerFrame = 0.5,   // 0.5 = 1 char toutes les 2 frames
  color = '#FFFFFF',
  fontSize = 48,
}) => {
  const frame = useCurrentFrame()

  const charsToShow = Math.min(
    text.length,
    Math.floor((frame - startAt) * charsPerFrame)
  )

  const displayText = text.slice(0, charsToShow)

  // Curseur clignotant
  const cursorVisible = charsToShow < text.length
    ? Math.floor(frame / 8) % 2 === 0  // clignote pendant l'écriture
    : false                              // disparaît quand terminé

  return (
    <div style={{ color, fontSize, fontFamily: 'JetBrains Mono, monospace' }}>
      {displayText}
      {cursorVisible && (
        <span style={{ opacity: 1, color }}>|</span>
      )}
    </div>
  )
}
```

### Word by Word Reveal

```typescript
const WordReveal: React.FC<{
  text: string
  startAt?: number
  framesPerWord?: number
  color?: string
  fontSize?: number
}> = ({
  text,
  startAt = 0,
  framesPerWord = 8,
  color = '#FFFFFF',
  fontSize = 72,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const words = text.split(' ')

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.3em',
      color,
      fontSize,
    }}>
      {words.map((word, i) => {
        const wordStartAt = startAt + i * framesPerWord

        const opacity = interpolate(
          frame,
          [wordStartAt, wordStartAt + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        const translateY = spring({
          frame: frame - wordStartAt,
          fps,
          from: 20,
          to: 0,
          config: { damping: 15, stiffness: 200, mass: 0.5 },
        })

        return (
          <span key={i} style={{
            opacity,
            display: 'inline-block',
            transform: `translateY(${translateY}px)`,
          }}>
            {word}
          </span>
        )
      })}
    </div>
  )
}
```

### Character Stagger (lettre par lettre)

```typescript
const CharStagger: React.FC<{
  text: string
  startAt?: number
  staggerFrames?: number
  color?: string
  fontSize?: number
}> = ({
  text,
  startAt = 0,
  staggerFrames = 3,
  color = '#FFFFFF',
  fontSize = 64,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', color, fontSize }}>
      {text.split('').map((char, i) => {
        const charDelay = startAt + i * staggerFrames

        const scale = spring({
          frame: frame - charDelay,
          fps,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 200, mass: 0.5 },
        })

        const opacity = interpolate(
          frame,
          [charDelay, charDelay + 8],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        return (
          <span key={i} style={{
            opacity,
            display: 'inline-block',
            transform: `scale(${scale})`,
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}>
            {char}
          </span>
        )
      })}
    </div>
  )
}
```

---

## 7. ANIMATIONS DE LISTE (STAGGER)

```typescript
const StaggerList: React.FC<{
  items: string[]
  startAt?: number
  staggerFrames?: number
  brand: BrandConfig
}> = ({ items, startAt = 0, staggerFrames = 15, brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {items.map((item, i) => {
        const itemDelay = startAt + i * staggerFrames

        const translateX = spring({
          frame: frame - itemDelay,
          fps,
          from: -60,
          to: 0,
          config: { damping: 15, stiffness: 120, mass: 1 },
        })

        const opacity = interpolate(
          frame,
          [itemDelay, itemDelay + 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        return (
          <div key={i} style={{
            opacity,
            transform: `translateX(${translateX}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: brand.colors.primary,
            fontSize: 32,
          }}>
            {/* Bullet point animé */}
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: brand.colors.accent,
              flexShrink: 0,
            }} />
            {item}
          </div>
        )
      })}
    </div>
  )
}
```

---

## 8. EASING CURVES AVEC INTERPOLATE

```typescript
import { Easing, interpolate, useCurrentFrame } from 'remotion'

const frame = useCurrentFrame()

// Ease In (démarre lentement)
const easeIn = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.in(Easing.ease),
  extrapolateRight: 'clamp',
})

// Ease Out (finit lentement) — LE PLUS UTILISÉ
const easeOut = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.out(Easing.ease),
  extrapolateRight: 'clamp',
})

// Ease In Out (démarre et finit lentement)
const easeInOut = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.inOut(Easing.ease),
  extrapolateRight: 'clamp',
})

// Cubic Bezier custom (comme CSS cubic-bezier)
const custom = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1), // Expo out
  extrapolateRight: 'clamp',
})

// Elastic (overshoot dramatique)
const elastic = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.elastic(1),
  extrapolateRight: 'clamp',
})

// Back (recul avant d'avancer)
const back = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.back(2),
  extrapolateRight: 'clamp',
})
```

### Courbes Bezier recommandées pour le motion design cinématique

```typescript
// Collection de courbes pros
export const EASING = {
  // Expo out — très utilisé en motion design premium
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
  // Circ out — rapide et propre
  circOut: Easing.bezier(0, 0.55, 0.45, 1),
  // Quint out — doux et élégant
  quintOut: Easing.bezier(0.22, 1, 0.36, 1),
  // Back out — avec léger overshoot
  backOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  // Smooth — linéaire mais doux
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
} as const
```

---

## 9. ANIMATIONS DE COMPTEUR (COUNTER)

```typescript
const AnimatedCounter: React.FC<{
  from?: number
  to: number
  startAt?: number
  duration?: number
  prefix?: string
  suffix?: string
  color?: string
  fontSize?: number
}> = ({
  from = 0,
  to,
  startAt = 0,
  duration = 90,
  prefix = '',
  suffix = '',
  color = '#FFFFFF',
  fontSize = 96,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame,
    [startAt, startAt + duration],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const currentValue = Math.round(from + (to - from) * progress)

  return (
    <div style={{
      color,
      fontSize,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      fontFamily: 'Inter, sans-serif',
    }}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </div>
  )
}

// Usage
// <AnimatedCounter to={10000} prefix="+" suffix=" users" startAt={60} />
```

---

## 10. MOTION BLUR (rendu cinématique)

```typescript
import { Trail } from '@remotion/motion-blur'

// Trail crée un motion blur sur les éléments en mouvement
const MotionBlurElement: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const x = spring({
    frame,
    fps,
    from: -200,
    to: 200,
    config: { damping: 10, stiffness: 80, mass: 1 },
  })

  return (
    // Envelopper avec Trail pour le motion blur
    <Trail
      lagInFrames={3}      // Nombre de frames de blur (1-5 recommandé)
      renderOrder="last"   // Rendre la version nette en dernier
    >
      <div style={{
        transform: `translateX(${x}px)`,
        width: 100,
        height: 100,
        backgroundColor: '#6366F1',
        borderRadius: 16,
      }} />
    </Trail>
  )
}
```

---

## 11. ANIMATIONS DE FOND (BACKGROUND)

### Gradient animé

```typescript
const AnimatedGradient: React.FC<{
  colorA: string
  colorB: string
  colorC?: string
}> = ({ colorA, colorB, colorC }) => {
  const frame = useCurrentFrame()

  const angle = interpolate(frame, [0, 300], [135, 225], {
    extrapolateRight: 'extend',  // Continue au-delà de 300 frames
  })

  const gradientColors = colorC
    ? `${colorA}, ${colorB}, ${colorC}`
    : `${colorA}, ${colorB}`

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${angle}deg, ${gradientColors})`,
    }} />
  )
}
```

### Particules flottantes

```typescript
const FloatingParticles: React.FC<{
  count?: number
  color?: string
  maxSize?: number
}> = ({ count = 30, color = '#6366F1', maxSize = 8 }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const particles = Array.from({ length: count }, (_, i) => {
    const x = random(`p-x-${i}`) * width
    const startY = random(`p-sy-${i}`) * height
    const speed = random(`p-speed-${i}`) * 0.3 + 0.1
    const size = random(`p-size-${i}`) * maxSize + 2
    const opacity = random(`p-op-${i}`) * 0.5 + 0.1

    // Mouvement vers le haut avec boucle
    const y = ((startY - frame * speed * 2) % height + height) % height

    return { x, y, size, opacity }
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: p.opacity,
        }} />
      ))}
    </AbsoluteFill>
  )
}
```

### Grille / Grid animée

```typescript
const AnimatedGrid: React.FC<{
  color?: string
  opacity?: number
  cellSize?: number
}> = ({ color = '#6366F1', opacity = 0.1, cellSize = 80 }) => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  const offsetY = interpolate(frame, [0, 300], [0, cellSize], {
    extrapolateRight: 'extend',
  }) % cellSize

  const cols = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Lignes horizontales */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={`h-${i}`} style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: i * cellSize - offsetY,
          height: 1,
          backgroundColor: color,
        }} />
      ))}
      {/* Lignes verticales */}
      {Array.from({ length: cols }, (_, i) => (
        <div key={`v-${i}`} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: i * cellSize,
          width: 1,
          backgroundColor: color,
        }} />
      ))}
    </AbsoluteFill>
  )
}
```

---

## 12. HOOK CUSTOM : `useAnimationSequence`

Un hook utilitaire pour gérer facilement des séquences d'animations complexes.

```typescript
// packages/utils/src/hooks/useAnimationSequence.ts

import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

type AnimationStep = {
  id: string
  startAt: number
  duration: number
}

export const useAnimationSequence = (steps: AnimationStep[]) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const getProgress = (id: string) => {
    const step = steps.find(s => s.id === id)
    if (!step) return 0

    return interpolate(
      frame,
      [step.startAt, step.startAt + step.duration],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }

  const getSpring = (id: string, config?: object) => {
    const step = steps.find(s => s.id === id)
    if (!step) return 0

    return spring({
      frame: frame - step.startAt,
      fps,
      from: 0,
      to: 1,
      config: config ?? { damping: 12, stiffness: 100, mass: 1 },
    })
  }

  const isActive = (id: string) => {
    const step = steps.find(s => s.id === id)
    if (!step) return false
    return frame >= step.startAt && frame < step.startAt + step.duration
  }

  const isPast = (id: string) => {
    const step = steps.find(s => s.id === id)
    if (!step) return false
    return frame >= step.startAt + step.duration
  }

  return { getProgress, getSpring, isActive, isPast, frame, fps }
}

// Usage dans un template
const MyTemplate = () => {
  const anim = useAnimationSequence([
    { id: 'title',    startAt: 0,   duration: 60  },
    { id: 'subtitle', startAt: 30,  duration: 60  },
    { id: 'cta',      startAt: 90,  duration: 60  },
    { id: 'exit',     startAt: 240, duration: 30  },
  ])

  const titleOpacity = anim.getProgress('title')
  const subtitleY = anim.getSpring('subtitle')
  const ctaScale = anim.getSpring('cta', { damping: 8, stiffness: 200, mass: 0.5 })

  return (
    <AbsoluteFill>
      <div style={{ opacity: titleOpacity }}>Titre</div>
      <div style={{ transform: `translateY(${(1 - subtitleY) * 40}px)` }}>Sous-titre</div>
      <div style={{ transform: `scale(${ctaScale})` }}>CTA</div>
    </AbsoluteFill>
  )
}
```

---

## 13. CHECKLIST QUALITÉ ANIMATION

Avant de valider une animation, vérifier :

- [ ] Tous les `interpolate` ont `extrapolateLeft: 'clamp'` et `extrapolateRight: 'clamp'`
- [ ] Tous les `spring` reçoivent `fps` depuis `useVideoConfig()`
- [ ] Pas de `Math.random()` → utiliser `random()` de Remotion
- [ ] Pas de `Date.now()` ou `setTimeout` dans les composants
- [ ] Les animations d'entrée commencent **avant** que l'élément soit visible (opacity 0 → 1)
- [ ] Les animations de sortie se terminent **avant** la fin de la `<Sequence>`
- [ ] Les mouvements rapides ont du motion blur (`Trail` de `@remotion/motion-blur`)
- [ ] Les springs ont des configs différentes selon le type d'élément (titre ≠ bouton ≠ background)
- [ ] La durée totale des animations ≤ `durationInFrames` de la composition
- [ ] Testé à 1x, 0.5x et 2x vitesse dans le studio Remotion

---

_Skill : remotion-animations.md — Altidigitech Video Templates_
_Lire ensuite : `.claude/brand-system.md` pour l'application des couleurs et fonts_
