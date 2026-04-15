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
import { SLAM_SPRING, pulse } from '../utils/aggressive'

export type SMDHowItWorksStep = {
  title: string
  description: string
}

export type SMDHowItWorksAggressiveProps = {
  headline: string
  steps: ReadonlyArray<SMDHowItWorksStep>
  ctaText?: string
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
          bottom: 40,
          right: 52,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 72,
            width: 72,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────

const StepCard: React.FC<{
  step: SMDHowItWorksStep
  index: number
  startFrame: number
  endFrame: number
  frame: number
  fps: number
}> = ({ step, index, startFrame, endFrame, frame, fps }) => {
  const brand = storeMdBrand

  const visible = frame >= startFrame && frame <= endFrame
  if (!visible) return null

  // Enter spring
  const enterSlam = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 0.9,
    to: 1,
    config: SLAM_SPRING,
  })
  const enterOp = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Exit fade (over the last 8 frames before flash)
  const exitOp = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const opacity = enterOp * exitOp

  // Title typewriter
  const titleChars = Math.floor(
    interpolate(
      frame,
      [startFrame + 12, startFrame + 12 + step.title.length * 1.5],
      [0, step.title.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )

  // Description fade-in after title
  const descStart = startFrame + 12 + step.title.length * 1.5 + 5
  const descOp = interpolate(frame, [descStart, descStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${enterSlam})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 120px',
      }}
    >
      {/* Giant background number */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 720,
          fontWeight: 900,
          color: brand.colors.white,
          opacity: 0.08,
          letterSpacing: '-0.05em',
          lineHeight: 1,
          pointerEvents: 'none',
        }}
      >
        {index + 1}
      </div>

      {/* Foreground content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 28,
          maxWidth: 1400,
        }}
      >
        {/* Step counter pill */}
        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 22,
            fontWeight: 800,
            color: brand.colors.accent,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Step {index + 1}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 108,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
          }}
        >
          {step.title.slice(0, titleChars)}
        </div>

        {/* Description */}
        <div
          style={{
            opacity: descOp,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 42,
            fontWeight: 500,
            color: brand.colors.textSecondary,
            lineHeight: 1.35,
            maxWidth: 1200,
          }}
        >
          {step.description}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDHowItWorksAggressive: React.FC<SMDHowItWorksAggressiveProps> = ({
  headline,
  steps,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const brand = storeMdBrand

  // Headline appears brief at start then fades as step 1 lands.
  const headlineOp = interpolate(frame, [0, 20, 60, 80], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Reserve ~80 frames for CTA at end.
  const CTA_RESERVE = ctaText ? 80 : 0
  const stepsWindow = durationInFrames - 80 - CTA_RESERVE // 80 for headline intro
  const perStep = Math.floor(stepsWindow / steps.length)

  // Build per-step windows. Flash transition eats 5 frames at each boundary.
  const stepRanges = steps.map((_, i) => {
    const start = 80 + i * perStep
    const end = start + perStep - 5
    return { start, end, flashAt: end }
  })

  const ctaStart = 80 + steps.length * perStep
  const ctaScale = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 30, 0.6, 1.2)

  // White flash on every step boundary (3 frames).
  const flashFrames = stepRanges.slice(0, -1).map((r) => r.flashAt)
  const flashOp = flashFrames.reduce((acc, f) => {
    if (frame >= f && frame < f + 3) return Math.max(acc, 0.85)
    return acc
  }, 0)

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      {/* Intro headline */}
      <AbsoluteFill
        style={{
          opacity: headlineOp,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 120,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            textAlign: 'center',
            textShadow: '0 0 40px rgba(6, 182, 212, 0.35)',
          }}
        >
          {headline}
        </div>
      </AbsoluteFill>

      {/* Step cards */}
      {steps.map((step, i) => {
        const range = stepRanges[i]
        if (!range) return null
        return (
          <StepCard
            key={`step-${i}`}
            step={step}
            index={i}
            startFrame={range.start}
            endFrame={range.end + 5}
            frame={frame}
            fps={fps}
          />
        )
      })}

      {/* CTA */}
      {ctaText && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ctaOp,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 56,
              fontWeight: 900,
              color: brand.colors.white,
              background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
              padding: '30px 68px',
              borderRadius: 18,
              boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
              letterSpacing: '-0.015em',
            }}
          >
            {ctaText}
          </div>
        </AbsoluteFill>
      )}

      {/* White flash between steps */}
      <AbsoluteFill
        style={{
          background: brand.colors.white,
          opacity: flashOp,
          pointerEvents: 'none',
        }}
      />

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
