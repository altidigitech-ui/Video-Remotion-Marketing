import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export type AnimationStep = {
  id: string
  startAt: number
  duration: number
}

export const useAnimationSequence = (steps: AnimationStep[]) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const getProgress = (id: string): number => {
    const step = steps.find((s) => s.id === id)
    if (!step) return 0

    return interpolate(frame, [step.startAt, step.startAt + step.duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }

  const getSpring = (id: string, config?: Record<string, number | boolean>): number => {
    const step = steps.find((s) => s.id === id)
    if (!step) return 0

    return spring({
      frame: frame - step.startAt,
      fps,
      from: 0,
      to: 1,
      config: config ?? { damping: 12, stiffness: 100, mass: 1 },
    })
  }

  const isActive = (id: string): boolean => {
    const step = steps.find((s) => s.id === id)
    if (!step) return false
    return frame >= step.startAt && frame < step.startAt + step.duration
  }

  const isPast = (id: string): boolean => {
    const step = steps.find((s) => s.id === id)
    if (!step) return false
    return frame >= step.startAt + step.duration
  }

  return { getProgress, getSpring, isActive, isPast, frame, fps }
}
