import React from 'react'
import { Easing, interpolate, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type AnimatedCounterProps = {
  brand: BrandConfig
  from?: number
  to: number
  startAt?: number
  duration?: number
  prefix?: string
  suffix?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  brand,
  from = 0,
  to,
  startAt = 0,
  duration = 90,
  prefix = '',
  suffix = '',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(frame, [startAt, startAt + duration], [0, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const currentValue = Math.round(from + (to - from) * progress)

  return (
    <div
      style={{
        color: brand.colors.textPrimary,
        fontSize: brand.typography.size5xl,
        fontWeight: brand.typography.weightBold,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: brand.typography.fontDisplay,
      }}
    >
      {prefix}
      {currentValue.toLocaleString()}
      {suffix}
    </div>
  )
}
