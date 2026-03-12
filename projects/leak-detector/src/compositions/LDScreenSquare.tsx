import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText } from '@altidigitech/core'
import { ScoreCircle, getScoreColor } from '../components/ScoreCircle'

export type LDScreenSquareProps = {
  brand: BrandConfig
}

const SPRING_ENTER = { damping: 14, stiffness: 120 }

type CategoryPill = {
  label: string
  score: number
}

const PILLS: CategoryPill[] = [
  { label: 'Headline', score: 85 },
  { label: 'CTA', score: 60 },
  { label: 'Soc. Proof', score: 40 },
  { label: 'Trust', score: 95 },
]

export const LDScreenSquare: React.FC<LDScreenSquareProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // URL + subtitle
  const urlOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // CTA bottom
  const ctaOpacity = interpolate(frame, [300, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaY = spring({
    frame: frame - 300,
    fps,
    from: 20,
    to: 0,
    config: SPRING_ENTER,
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 50,
        }}
      >
        {/* URL + subtitle */}
        <div
          style={{
            opacity: urlOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 32,
              color: '#F59E0B',
              fontWeight: 700,
              textShadow: '0 0 20px rgba(245,158,11,0.4)',
            }}
          >
            vercel.com
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              color: 'rgba(248,250,252,0.6)',
            }}
          >
            Analysis Report
          </div>
        </div>

        {/* Large ScoreCircle */}
        <ScoreCircle
          score={72}
          size={500}
          strokeWidth={20}
          frame={frame}
          startFrame={20}
          animDuration={130}
        />

        {/* Category pills 2×2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            width: '100%',
            maxWidth: 920,
          }}
        >
          {PILLS.map((pill, i) => (
            <PillCard
              key={i}
              pill={pill}
              frame={frame}
              fps={fps}
              startFrame={180 + i * 25}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <GlowText brand={brand} size={36}>
            Find your conversion leaks →
          </GlowText>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  )
}

const PillCard: React.FC<{
  pill: CategoryPill
  frame: number
  fps: number
  startFrame: number
}> = ({ pill, frame, fps, startFrame }) => {
  const scale = spring({
    frame: frame - startFrame,
    fps,
    from: 0,
    to: 1,
    config: SPRING_ENTER,
  })

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const color = getScoreColor(pill.score)

  // Mini bar animation
  const barWidth = interpolate(
    frame,
    [startFrame + 10, startFrame + 50],
    [0, pill.score],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: 440,
        height: 110,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}30`,
        borderLeft: `6px solid ${color}`,
        borderRadius: 20,
        padding: '0 24px',
        backdropFilter: 'blur(8px)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Label + mini bar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#F8FAFC',
          }}
        >
          {pill.label}
        </span>
        {/* Mini progress bar */}
        <div
          style={{
            width: 200,
            height: 6,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${barWidth}%`,
              height: '100%',
              backgroundColor: color,
              borderRadius: 3,
              boxShadow: `0 0 6px ${color}60`,
            }}
          />
        </div>
      </div>

      {/* Score */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 48,
          fontWeight: 800,
          color,
          textShadow: `0 0 12px ${color}60`,
          lineHeight: 1,
        }}
      >
        {pill.score}
      </span>
    </div>
  )
}
