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
