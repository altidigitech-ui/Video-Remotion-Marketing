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

export type QuizQuestion = {
  text: string
}

export type SMDQuizProps = {
  questions: ReadonlyArray<QuizQuestion>
  failMessage: string
  ctaText: string
}

// ─── Timings ─────────────────────────────────────────────────────────────────

const Q_START = 15
const Q_DURATION = 70 // frames per question block
const FAIL_REVEAL_DELAY = 30 // frames after question appears to show "most fail"

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDQuiz: React.FC<SMDQuizProps> = ({
  questions,
  failMessage,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  const finalStart = Q_START + questions.length * Q_DURATION + 10
  const ctaStart = finalStart + 50

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* Questions */}
      {questions.map((q, i) => {
        const qStart = Q_START + i * Q_DURATION
        const qEnd = qStart + Q_DURATION

        // Question visibility
        const qOp = interpolate(
          frame,
          [qStart, qStart + 10, qEnd - 8, qEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        if (qOp <= 0) return null

        const qSlam = spring({
          frame: Math.max(0, frame - qStart),
          fps,
          from: 1.15,
          to: 1,
          config: { damping: 16, mass: 0.8, stiffness: 200 },
        })

        // YES / NO buttons appear
        const btnOp = interpolate(
          frame,
          [qStart + 12, qStart + 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )

        // "Most stores fail this" — appears after delay
        const failOp = interpolate(
          frame,
          [qStart + FAIL_REVEAL_DELAY, qStart + FAIL_REVEAL_DELAY + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        const failShake = shake(frame, qStart + FAIL_REVEAL_DELAY + 2, 4, 6)

        // Question number
        const qNum = `${i + 1}/${questions.length}`

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: qOp,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 60px',
              gap: 40,
            }}
          >
            {/* Question number */}
            <div
              style={{
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 24,
                fontWeight: 700,
                color: brand.colors.textMuted,
                letterSpacing: '0.1em',
              }}
            >
              {qNum}
            </div>

            {/* Question text */}
            <div
              style={{
                transform: `scale(${qSlam})`,
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 44,
                fontWeight: 900,
                color: brand.colors.textPrimary,
                textAlign: 'center',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {q.text}
            </div>

            {/* YES / NO buttons */}
            <div
              style={{
                opacity: btnOp,
                display: 'flex',
                gap: 28,
              }}
            >
              <div
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#ffffff',
                  background: GREEN,
                  padding: '18px 48px',
                  borderRadius: 16,
                  boxShadow: '0 0 20px rgba(22, 163, 74, 0.4)',
                }}
              >
                YES
              </div>
              <div
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#ffffff',
                  background: RED,
                  padding: '18px 48px',
                  borderRadius: 16,
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
                }}
              >
                NO
              </div>
            </div>

            {/* "Most stores fail this" */}
            <div
              style={{
                opacity: failOp,
                transform: `translate(${failShake.x}px, ${failShake.y}px)`,
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 26,
                fontWeight: 800,
                color: RED,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: '0 0 16px rgba(220, 38, 38, 0.5)',
              }}
            >
              Most stores fail this.
            </div>
          </AbsoluteFill>
        )
      })}

      {/* Final message + CTA */}
      {frame >= finalStart && (
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [finalStart, finalStart + 12],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
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
              fontSize: 48,
              fontWeight: 900,
              color: brand.colors.textPrimary,
              textAlign: 'center',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            {failMessage}
          </div>
          {frame >= ctaStart && (
            <div
              style={{
                opacity: interpolate(
                  frame,
                  [ctaStart, ctaStart + 18],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
                transform: `scale(${spring({
                  frame: Math.max(0, frame - ctaStart),
                  fps,
                  from: 0.85,
                  to: 1,
                  config: brand.motion.springBouncy,
                })})`,
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
                  boxShadow: `0 0 ${54 * pulse(frame, 20, 0.6, 1.3)}px rgba(37, 99, 235, ${0.6 * pulse(frame, 20, 0.6, 1.3)}), 0 0 ${110 * pulse(frame, 20, 0.6, 1.3)}px rgba(6, 182, 212, ${0.35 * pulse(frame, 20, 0.6, 1.3)}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
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

      <SMDUrgencyBar text="Be honest with yourself" />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
