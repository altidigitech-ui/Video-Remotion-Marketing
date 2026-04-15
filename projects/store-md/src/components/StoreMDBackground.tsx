import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type StoreMDBackgroundProps = {
  brand: BrandConfig
}

// Period (in frames) of the orb pulse: 1 → 1.05 → 1
const PULSE_PERIOD = 180

export const StoreMDBackground: React.FC<StoreMDBackgroundProps> = ({ brand }) => {
  const frame = useCurrentFrame()

  // Two orbs pulse on the same period but offset by half a cycle to keep the
  // background subtly alive without feeling synchronized.
  const progressA = (frame % PULSE_PERIOD) / PULSE_PERIOD
  const progressB = ((frame + PULSE_PERIOD / 2) % PULSE_PERIOD) / PULSE_PERIOD

  const scaleA = interpolate(progressA, [0, 0.5, 1], [1, 1.05, 1])
  const scaleB = interpolate(progressB, [0, 0.5, 1], [1, 1.05, 1])

  return (
    <AbsoluteFill style={{ background: brand.colors.background }}>
      {/* Subtle dotted grid — 40px spacing, primary blue at 6% opacity */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(37, 99, 235, 0.06) 1px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Cyan glow orb — top-right, ~550px radius */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: 1100,
            height: 1100,
            transform: `scale(${scaleA})`,
            transformOrigin: 'center',
            background:
              'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.06) 35%, transparent 65%)',
          }}
        />
      </AbsoluteFill>

      {/* Cyan glow orb — bottom-left, ~500px radius */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: 1000,
            height: 1000,
            transform: `scale(${scaleB})`,
            transformOrigin: 'center',
            background:
              'radial-gradient(circle, rgba(6, 182, 212, 0.10) 0%, rgba(6, 182, 212, 0.05) 35%, transparent 65%)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
