import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { RED, SLAM_SPRING, pulse, shake } from '../utils/aggressive'

export type SMDStatIconId = 'warning' | 'bug' | 'dollar-slash' | 'robot-x'

export type SMDStat = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  icon: SMDStatIconId
}

export type SMDStatsAggressiveProps = {
  headline: string
  stats: ReadonlyArray<SMDStat>
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const StatIcon: React.FC<{ id: SMDStatIconId; size?: number }> = ({
  id,
  size = 96,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: RED,
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: {
      filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.55))',
    },
  }

  switch (id) {
    case 'warning':
      return (
        <svg {...common}>
          <path d="M24 6 L44 40 L4 40 Z" />
          <line x1="24" y1="20" x2="24" y2="29" />
          <circle cx="24" cy="34" r="1.5" fill={RED} stroke="none" />
        </svg>
      )
    case 'bug':
      return (
        <svg {...common}>
          <ellipse cx="24" cy="26" rx="10" ry="12" />
          <line x1="24" y1="14" x2="24" y2="9" />
          <line x1="22" y1="9" x2="26" y2="9" />
          <line x1="14" y1="22" x2="8" y2="20" />
          <line x1="14" y1="26" x2="8" y2="26" />
          <line x1="14" y1="30" x2="8" y2="32" />
          <line x1="34" y1="22" x2="40" y2="20" />
          <line x1="34" y1="26" x2="40" y2="26" />
          <line x1="34" y1="30" x2="40" y2="32" />
          <line x1="24" y1="18" x2="24" y2="34" />
        </svg>
      )
    case 'dollar-slash':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" />
          <path d="M29 17 C29 15 27 13 24 13 C21 13 19 15 19 17 C19 22 29 22 29 26 C29 28 27 30 24 30 C21 30 19 28 19 26" />
          <line x1="24" y1="9" x2="24" y2="39" />
          <line x1="9" y1="39" x2="39" y2="9" strokeWidth={4} />
        </svg>
      )
    case 'robot-x':
      return (
        <svg {...common}>
          <rect x="10" y="14" width="28" height="22" rx="4" />
          <circle cx="18" cy="24" r="2" fill={RED} stroke="none" />
          <circle cx="30" cy="24" r="2" fill={RED} stroke="none" />
          <line x1="24" y1="10" x2="24" y2="14" />
          <circle cx="24" cy="8" r="2" fill={RED} stroke="none" />
          <line x1="4" y1="4" x2="44" y2="44" strokeWidth={4} />
          <line x1="44" y1="4" x2="4" y2="44" strokeWidth={4} />
        </svg>
      )
  }
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

const StatTile: React.FC<{
  stat: SMDStat
  startFrame: number
  frame: number
  fps: number
  size: 'lg' | 'md'
}> = ({ stat, startFrame, frame, fps, size }) => {
  const brand = storeMdBrand

  const countupFrames = 28
  const arriveFrame = startFrame + countupFrames

  const slam = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 1.2,
    to: 1,
    config: SLAM_SPRING,
  })
  const op = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const value = interpolate(
    frame,
    [startFrame, arriveFrame],
    [0, stat.value],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const tileShake = shake(frame, arriveFrame, 5, 7)

  // Tile-level 2x ratio: numberSize = 2x labelSize.
  const numberSize = size === 'lg' ? 180 : 140
  const labelSize = size === 'lg' ? 32 : 24
  const iconSize = size === 'lg' ? 110 : 84

  const displayValue =
    stat.value >= 1000 ? Math.round(value).toLocaleString('en-US') : Math.round(value)

  return (
    <div
      style={{
        opacity: op,
        transform: `translate(${tileShake.x}px, ${tileShake.y}px) scale(${slam})`,
        background: 'rgba(13, 17, 23, 0.75)',
        border: `1px solid ${brand.colors.border}`,
        borderRadius: 24,
        padding: '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 18,
        backdropFilter: 'blur(10px)',
        minHeight: size === 'lg' ? 380 : 280,
      }}
    >
      <StatIcon id={stat.icon} size={iconSize} />

      <div
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: numberSize,
          fontWeight: 900,
          color: brand.colors.white,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 40px rgba(220, 38, 38, 0.35)',
        }}
      >
        {stat.prefix ?? ''}
        {displayValue}
        {stat.suffix ?? ''}
      </div>

      <div
        style={{
          fontFamily: `'${brand.typography.fontBody}', sans-serif`,
          fontSize: labelSize,
          fontWeight: 600,
          color: brand.colors.textSecondary,
          letterSpacing: '-0.005em',
          lineHeight: 1.25,
          maxWidth: 520,
        }}
      >
        {stat.label}
      </div>
    </div>
  )
}

// ─── Logo overlay ─────────────────────────────────────────────────────────────

const SMDLogoOverlay: React.FC<{ frame: number }> = ({ frame }) => {
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
          bottom: 44,
          right: 52,
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

// ─── Red flash stack on arrival frames ────────────────────────────────────────

const FlashOverlay: React.FC<{ frame: number; triggerFrames: number[] }> = ({
  frame,
  triggerFrames,
}) => {
  const op = triggerFrames.reduce((acc, f) => {
    if (frame === f) return Math.max(acc, 0.15)
    if (frame === f + 1) return Math.max(acc, 0.08)
    if (frame === f + 2) return Math.max(acc, 0.04)
    return acc
  }, 0)
  return (
    <AbsoluteFill
      style={{ background: RED, opacity: op, pointerEvents: 'none' }}
    />
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDStatsAggressive: React.FC<SMDStatsAggressiveProps> = ({
  headline,
  stats,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const brand = storeMdBrand

  const isVertical = height > width
  const isSquare = width === height
  // Widescreen uses a 2-column grid; vertical stacks; square uses 2x2.
  const columns = isVertical ? 1 : 2
  const tileSize: 'lg' | 'md' = isSquare || isVertical ? 'md' : 'lg'

  // Headline appears first, stats stagger.
  const headlineOp = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headlineY = interpolate(frame, [0, 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headlinePulseGlow = pulse(frame, 50, 0.5, 1)

  // Stat start frames — staggered by 30, first at ~40.
  const STAT_GAP = 30
  const STAT_BASE = 40
  const statStartFrames = stats.map((_, i) => STAT_BASE + i * STAT_GAP)
  const arriveFrames = statStartFrames.map((s) => s + 28)

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      <AbsoluteFill
        style={{
          padding: isVertical ? '90px 60px 90px 60px' : '70px 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: isVertical ? 30 : 50,
        }}
      >
        {/* HEADLINE */}
        <div
          style={{
            opacity: headlineOp,
            transform: `translateY(${headlineY}px)`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: isVertical ? 72 : 84,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            textShadow: `0 0 40px rgba(6, 182, 212, ${0.35 * headlinePulseGlow})`,
          }}
        >
          {headline}
        </div>

        {/* STATS GRID */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: isVertical ? 24 : 32,
            alignContent: 'center',
          }}
        >
          {stats.map((stat, i) => (
            <StatTile
              key={`${stat.label}-${i}`}
              stat={stat}
              startFrame={statStartFrames[i] as number}
              frame={frame}
              fps={fps}
              size={tileSize}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* Red flash overlay on each arrival */}
      <FlashOverlay frame={frame} triggerFrames={arriveFrames} />

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
