import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { SMDLogoOverlay, SMDUrgencyBar } from '../components/SMDOverlays'
import { RED, GREEN, SLAM_SPRING, pulse, shake } from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type POVStep = {
  label: string
  reaction: string
  reactionColor?: string
}

export type SMDPOVProps = {
  title: string
  steps: ReadonlyArray<POVStep>
  slamText: string
  ctaText: string
}

// ─── Timings ─────────────────────────────────────────────────────────────────

const TITLE_START = 0
const STEPS_START = 40
const STEP_DURATION = 45 // frames per step

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDPOV: React.FC<SMDPOVProps> = ({
  title,
  steps,
  slamText,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  const slamStart = STEPS_START + steps.length * STEP_DURATION + 10
  const ctaStart = slamStart + 50

  // Title
  const titleOp = interpolate(
    frame,
    [TITLE_START, TITLE_START + 12, STEPS_START - 5, STEPS_START],
    [0, 1, 1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // SLAM
  const slamScale = spring({
    frame: Math.max(0, frame - slamStart),
    fps,
    from: 1.5,
    to: 1,
    config: SLAM_SPRING,
  })
  const slamOp = interpolate(
    frame,
    [slamStart, slamStart + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const slamShake = shake(frame, slamStart + 2, 8, 10)

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* POV Title (persistent but dims) */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 50,
          right: 50,
          textAlign: 'center',
          opacity: titleOp,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 28,
            fontWeight: 700,
            color: brand.colors.textMuted,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          POV
        </span>
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 38,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginTop: 12,
          }}
        >
          {title}
        </div>
      </div>

      {/* Steps — simulated UI scroll with reactions */}
      {steps.map((step, i) => {
        const stepStart = STEPS_START + i * STEP_DURATION
        const stepEnd = stepStart + STEP_DURATION
        const stepOp = interpolate(
          frame,
          [stepStart, stepStart + 10, stepEnd - 8, stepEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        if (stepOp <= 0) return null

        const reactionStart = stepStart + 18
        const reactionOp = interpolate(
          frame,
          [reactionStart, reactionStart + 8],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        const reactionSlam = spring({
          frame: Math.max(0, frame - reactionStart),
          fps,
          from: 1.3,
          to: 1,
          config: SLAM_SPRING,
        })

        // Simulated UI element
        const scrollY = interpolate(
          frame,
          [stepStart, stepStart + STEP_DURATION],
          [40, -20],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )

        return (
          <AbsoluteFill key={i} style={{ opacity: stepOp }}>
            {/* Simulated dashboard element */}
            <div
              style={{
                position: 'absolute',
                top: 320,
                left: 50,
                right: 50,
                transform: `translateY(${scrollY}px)`,
              }}
            >
              {/* Fake UI card */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div
                  style={{
                    fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                    fontSize: 30,
                    fontWeight: 600,
                    color: brand.colors.textPrimary,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
              </div>
            </div>

            {/* Thought bubble reaction */}
            <div
              style={{
                position: 'absolute',
                top: 620,
                left: 60,
                right: 60,
                textAlign: 'center',
                opacity: reactionOp,
                transform: `scale(${reactionSlam})`,
              }}
            >
              <span
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 52,
                  fontWeight: 900,
                  color: step.reactionColor ?? RED,
                  letterSpacing: '-0.02em',
                  fontStyle: 'italic',
                  textShadow: `0 0 30px ${step.reactionColor ?? 'rgba(220, 38, 38, 0.5)'}`,
                }}
              >
                {step.reaction}
              </span>
            </div>
          </AbsoluteFill>
        )
      })}

      {/* SLAM overlay */}
      {frame >= slamStart && (
        <AbsoluteFill
          style={{
            opacity: slamOp,
            transform: `translate(${slamShake.x}px, ${slamShake.y}px) scale(${slamScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 5, 7, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '0 50px',
            gap: 40,
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 56,
              fontWeight: 900,
              color: brand.colors.textPrimary,
              textAlign: 'center',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {slamText}
          </div>

          {/* CTA */}
          {frame >= ctaStart && (
            <div
              style={{
                opacity: ctaOp,
                transform: `scale(${ctaScale})`,
              }}
            >
              <div
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 42,
                  fontWeight: 900,
                  color: brand.colors.textPrimary,
                  background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
                  padding: '22px 48px',
                  borderRadius: 18,
                  boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
                  letterSpacing: '-0.015em',
                  textAlign: 'center',
                }}
              >
                {ctaText}
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      <SMDUrgencyBar text="This is what you're missing" />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
