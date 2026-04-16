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
import { RED, SLAM_SPRING, pulse, shake, redFlashOpacity } from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type RevealContent = {
  number: string
  label: string
  subtext: string
}

export type SMDCountdownRevealProps = {
  teaser: string
  countdownFrom: number
  revealContent: RevealContent
  ctaText: string
}

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDCountdownReveal: React.FC<SMDCountdownRevealProps> = ({
  teaser,
  countdownFrom,
  revealContent,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Phase timings
  const TEASER_START = 5
  const COUNTDOWN_START = 50
  const FRAMES_PER_COUNT = 20 // 20 frames per countdown number
  const REVEAL_START = COUNTDOWN_START + countdownFrom * FRAMES_PER_COUNT + 10
  const CTA_START = REVEAL_START + 80

  // Teaser text
  const teaserOp = interpolate(
    frame,
    [TEASER_START, TEASER_START + 15, COUNTDOWN_START - 8, COUNTDOWN_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Countdown — which number to show
  const countdownElapsed = Math.max(0, frame - COUNTDOWN_START)
  const currentCount = Math.max(
    0,
    countdownFrom - Math.floor(countdownElapsed / FRAMES_PER_COUNT),
  )
  const countdownOp = interpolate(
    frame,
    [COUNTDOWN_START, COUNTDOWN_START + 6, REVEAL_START - 8, REVEAL_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Per-number slam
  const countIdx = Math.floor(countdownElapsed / FRAMES_PER_COUNT)
  const countLocalFrame = countdownElapsed - countIdx * FRAMES_PER_COUNT
  const countSlam = spring({
    frame: Math.max(0, countLocalFrame),
    fps,
    from: 1.5,
    to: 1,
    config: SLAM_SPRING,
  })

  // Countdown pulse — gets more intense as we approach 0
  const urgencyScale =
    currentCount <= 3 ? pulse(frame, 12, 0.92, 1.08) : 1

  // Reveal SLAM
  const revealSlam = spring({
    frame: Math.max(0, frame - REVEAL_START),
    fps,
    from: 2,
    to: 1,
    config: SLAM_SPRING,
  })
  const revealOp = interpolate(
    frame,
    [REVEAL_START, REVEAL_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const revealShake = shake(frame, REVEAL_START + 2, 12, 14)
  const revealFlash = redFlashOpacity(frame, REVEAL_START)

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* TEASER */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: teaserOp,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 44,
            fontWeight: 700,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
          }}
        >
          {teaser}
        </span>
      </div>

      {/* COUNTDOWN */}
      {frame >= COUNTDOWN_START && frame < REVEAL_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: countdownOp,
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 240,
              fontWeight: 900,
              color: currentCount <= 3 ? RED : brand.colors.textPrimary,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              textAlign: 'center',
              transform: `scale(${countSlam * urgencyScale})`,
              textShadow:
                currentCount <= 3
                  ? '0 0 80px rgba(220, 38, 38, 0.6)'
                  : '0 0 40px rgba(6, 182, 212, 0.3)',
            }}
          >
            {currentCount}
          </div>
        </AbsoluteFill>
      )}

      {/* REVEAL */}
      {frame >= REVEAL_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: revealOp,
            transform: `translate(${revealShake.x}px, ${revealShake.y}px) scale(${revealSlam})`,
            padding: '0 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 130,
                fontWeight: 900,
                color: RED,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                textShadow:
                  '0 0 60px rgba(220, 38, 38, 0.7), 0 0 30px rgba(220, 38, 38, 0.5)',
              }}
            >
              {revealContent.number}
            </div>
            <div
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 48,
                fontWeight: 900,
                color: brand.colors.textSecondary,
                letterSpacing: '-0.02em',
              }}
            >
              {revealContent.label}
            </div>
            <div
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 36,
                fontWeight: 600,
                color: brand.colors.textMuted,
                letterSpacing: '-0.01em',
                marginTop: 8,
              }}
            >
              {revealContent.subtext}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Reveal flash */}
      <AbsoluteFill
        style={{ background: RED, opacity: revealFlash, pointerEvents: 'none' }}
      />

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 40,
          right: 40,
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 36,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '20px 44px',
            borderRadius: 18,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
            textAlign: 'center',
          }}
        >
          {ctaText}
        </div>
      </div>

      <SMDUrgencyBar text="Time's up. Scan now." />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
