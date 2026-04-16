import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { RED, ORANGE, pulse } from '../utils/aggressive'

// ─── Shared logo overlay (bottom-right) ──────────────────────────────────────

export const SMDLogoOverlay: React.FC<{ bottomOffset?: number }> = ({
  bottomOffset = 140,
}) => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: bottomOffset,
          right: 40,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 64,
            width: 64,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Urgency bar (bottom, red→orange gradient) ──────────────────────────────

export type SMDUrgencyBarProps = {
  text?: string
}

export const SMDUrgencyBar: React.FC<SMDUrgencyBarProps> = ({
  text = 'Every second costs you money',
}) => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand
  const breathe = pulse(frame, 40, 0.88, 1)
  const op = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        opacity: op * breathe,
        background: `linear-gradient(90deg, ${RED} 0%, ${ORANGE} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 24,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {text}
      </span>
    </div>
  )
}

// ─── Live-loss counter (top-right) ───────────────────────────────────────────

export const SMDLiveLossCounter: React.FC<{
  ratePerFrame?: number
  prefix?: string
}> = ({ ratePerFrame = 0.024, prefix = '-$' }) => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand
  const value = Math.max(0, frame) * ratePerFrame
  const op = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 40,
        opacity: op,
        fontFamily: `'${brand.typography.fontMono}', monospace`,
        fontSize: 28,
        fontWeight: 800,
        color: RED,
        letterSpacing: '-0.02em',
        textShadow: '0 0 16px rgba(220, 38, 38, 0.6)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </div>
  )
}
