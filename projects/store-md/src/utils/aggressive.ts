import { interpolate, random } from 'remotion'

// Shared drama constants used across the StoreMD "aggressive" rework.

export const RED = '#dc2626'
export const RED_GLOW = 'rgba(220, 38, 38, 0.6)'
export const ORANGE = '#ea580c'
export const GREEN = '#16a34a'
export const GREEN_GLOW = 'rgba(22, 163, 74, 0.6)'

export const SLAM_SPRING = { damping: 20, mass: 1, stiffness: 400 } as const

/** Deterministic screen-shake offset for a short window after startFrame. */
export const shake = (
  frame: number,
  startFrame: number,
  intensity = 4,
  duration = 8,
): { x: number; y: number } => {
  if (frame < startFrame || frame > startFrame + duration) return { x: 0, y: 0 }
  const progress = (frame - startFrame) / duration
  const decay = 1 - progress
  const x = (random(`shake-x-${frame}-${startFrame}`) * 2 - 1) * intensity * decay
  const y = (random(`shake-y-${frame}-${startFrame}`) * 2 - 1) * intensity * decay
  return { x, y }
}

/** Opacity for a 3-frame red flash overlay at startFrame: .15 → .08 → 0. */
export const redFlashOpacity = (frame: number, startFrame: number): number => {
  if (frame === startFrame) return 0.15
  if (frame === startFrame + 1) return 0.08
  if (frame === startFrame + 2) return 0.04
  return 0
}

/** Sine-style pulse between min and max over `period` frames. */
export const pulse = (
  frame: number,
  period = 40,
  min = 0.85,
  max = 1,
): number => {
  const progress = (frame % period) / period
  return interpolate(progress, [0, 0.5, 1], [min, max, min], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/** Monotonic counter from 0 → target with optional ease-in acceleration. */
export const rampCounter = (
  frame: number,
  startFrame: number,
  durationInFrames: number,
  target: number,
  easeIn = false,
): number => {
  const raw = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const eased = easeIn ? raw * raw : raw
  return eased * target
}

/** Format a number as a USD amount with no decimals. */
export const formatDollars = (value: number): string =>
  `$${Math.round(value).toLocaleString('en-US')}`

/** Format a number as a USD amount with cents. */
export const formatDollarsCents = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// ─── Glitch effect (3-frame RGB shift + clip slice) ──────────────────────────

export type GlitchState = {
  /** CSS `clipPath` value — use to slice a section of the element. */
  clip: string
  /** Horizontal offset (px) for the red/cyan RGB-split shadow layers. */
  redShift: number
  blueShift: number
}

export const glitch = (frame: number, triggerFrame: number): GlitchState => {
  const f = frame - triggerFrame
  if (f < 0 || f > 3) {
    return { clip: 'inset(0)', redShift: 0, blueShift: 0 }
  }
  const frames: GlitchState[] = [
    { clip: 'inset(15% 0 60% 0)', redShift: -8, blueShift: 6 },
    { clip: 'inset(40% 0 20% 0)', redShift: 5, blueShift: -4 },
    { clip: 'inset(70% 0 5% 0)', redShift: -3, blueShift: 7 },
  ]
  return frames[f] ?? { clip: 'inset(0)', redShift: 0, blueShift: 0 }
}

/** Heartbeat pulse scale curve: 1 → 1.06 → 1 → 1.03 → 1 over `period` frames. */
export const heartbeat = (frame: number, period = 30): number => {
  const t = (frame % period) / period
  return interpolate(t, [0, 0.25, 0.5, 0.75, 1], [1, 1.06, 1, 1.03, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/** Expanding translucent ring timed to each heartbeat "beat" (two per period). */
export const heartbeatRing = (
  frame: number,
  period = 30,
): { scale: number; opacity: number } => {
  const t = (frame % period) / period
  // First beat peak at t=0.25, second at t=0.75
  const life1 = t < 0.5 ? t / 0.5 : -1
  const life2 = t >= 0.5 ? (t - 0.5) / 0.5 : -1
  const active = Math.max(life1, life2)
  if (active < 0) return { scale: 1, opacity: 0 }
  return { scale: 1 + active * 0.8, opacity: (1 - active) * 0.55 }
}

/**
 * Live-loss counter — cumulative $ "lost" since frame 0 of the composition.
 * At 30fps with $0.03/frame increment this yields ~$0.90/s (~$2.70 over 3s).
 * Adjust `ratePerFrame` for different paces.
 */
export const liveLoss = (frame: number, ratePerFrame = 0.024): number =>
  Math.max(0, frame) * ratePerFrame
