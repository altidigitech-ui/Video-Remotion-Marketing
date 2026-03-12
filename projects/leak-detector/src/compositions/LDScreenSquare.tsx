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
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText, LogoOverlay } from '@altidigitech/core'
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
  { label: 'Social Proof', score: 40 },
  { label: 'Trust', score: 95 },
]

export const LDScreenSquare: React.FC<LDScreenSquareProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // URL
  const urlOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // CTA bottom
  const ctaOpacity = interpolate(frame, [240, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
          gap: 32,
          padding: 60,
        }}
      >
        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 28,
            color: '#F59E0B',
            fontWeight: 700,
            textShadow: '0 0 20px rgba(245,158,11,0.4)',
            marginBottom: -8,
          }}
        >
          vercel.com
        </div>

        {/* Screenshot with amber glow */}
        <ScreenshotWithGlow frame={frame} fps={fps} />

        {/* Large ScoreCircle */}
        <ScoreCircle
          score={72}
          size={340}
          strokeWidth={14}
          frame={frame}
          startFrame={30}
          animDuration={150}
        />

        {/* Category pills 2×2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            width: '100%',
            maxWidth: 500,
          }}
        >
          {PILLS.map((pill, i) => (
            <PillCard
              key={i}
              pill={pill}
              frame={frame}
              fps={fps}
              startFrame={180 + i * 20}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ opacity: ctaOpacity }}>
          <GlowText brand={brand} size={32} glow={false}>
            Find your conversion leaks →
          </GlowText>
        </div>
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}

const ScreenshotWithGlow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({
    frame: frame - 10,
    fps,
    from: 0.95,
    to: 1,
    config: SPRING_ENTER,
  })

  const opacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Pulsing glow
  const glowIntensity = 0.3 + Math.sin(frame * 0.06) * 0.15

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        position: 'absolute',
        top: 80,
        left: 60,
        right: 60,
        bottom: 80,
        borderRadius: 16,
        overflow: 'hidden',
        border: `2px solid rgba(245,158,11,${glowIntensity + 0.1})`,
        boxShadow: `0 0 ${40 * glowIntensity}px rgba(245,158,11,${glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(245,158,11,${glowIntensity * 0.4}), 0 20px 60px rgba(0,0,0,0.5)`,
        zIndex: 0,
      }}
    >
      <Img
        src={staticFile('screenshots/landing-stats.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.25,
        }}
      />
    </div>
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

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}30`,
        borderRadius: 14,
        padding: '16px 20px',
        boxShadow: `0 0 20px ${color}10`,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: '#CBD5E1',
        }}
      >
        {pill.label}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 26,
          fontWeight: 800,
          color,
          textShadow: `0 0 12px ${color}60`,
        }}
      >
        {pill.score}
      </span>
    </div>
  )
}
