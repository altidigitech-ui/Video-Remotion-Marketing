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

export type SMDMythRealityProps = {
  myth: string
  reality: string
  stat: string
  source: string
  ctaText: string
}

// ─── Timings (30fps, 300 frames = 10s) ───────────────────────────────────────

const MYTH_START = 10
const MYTH_HOLD = 80 // frames to show myth before reality
const REALITY_START = MYTH_START + MYTH_HOLD
const STAT_START = REALITY_START + 60
const CTA_START = STAT_START + 60

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDMythReality: React.FC<SMDMythRealityProps> = ({
  myth,
  reality,
  stat,
  source,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Myth zone (top half, red)
  const mythOp = interpolate(frame, [MYTH_START, MYTH_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const mythSlam = spring({
    frame: Math.max(0, frame - MYTH_START),
    fps,
    from: 1.2,
    to: 1,
    config: SLAM_SPRING,
  })

  // Reality zone (bottom half, green) — crashes in
  const realityOp = interpolate(
    frame,
    [REALITY_START, REALITY_START + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const realitySlam = spring({
    frame: Math.max(0, frame - REALITY_START),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })
  const realityShake = shake(frame, REALITY_START + 2, 8, 10)

  // Stat reveal
  const statOp = interpolate(frame, [STAT_START, STAT_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const statSlam = spring({
    frame: Math.max(0, frame - STAT_START),
    fps,
    from: 1.4,
    to: 1,
    config: SLAM_SPRING,
  })
  const statShake = shake(frame, STAT_START + 2, 6, 8)

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

      {/* Split layout */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          bottom: 90,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ═════ MYTH ZONE (top half, red) ═════ */}
        <div
          style={{
            flex: 1,
            background: 'rgba(220, 38, 38, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
            gap: 24,
            opacity: mythOp,
            transform: `scale(${mythSlam})`,
          }}
        >
          {/* MYTH label */}
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 32,
              fontWeight: 900,
              color: RED,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
            }}
          >
            MYTH
          </div>
          {/* Myth text */}
          <div
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 36,
              fontWeight: 700,
              color: '#fecaca',
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              maxWidth: 900,
            }}
          >
            &ldquo;{myth}&rdquo;
          </div>
          {/* Strike-through line over myth */}
          {frame >= REALITY_START && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                right: '10%',
                height: 4,
                background: RED,
                opacity: interpolate(
                  frame,
                  [REALITY_START, REALITY_START + 8],
                  [0, 0.7],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
                boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
              }}
            />
          )}
        </div>

        {/* ═════ REALITY ZONE (bottom half, green) ═════ */}
        <div
          style={{
            flex: 1,
            background: 'rgba(22, 163, 74, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
            gap: 24,
            opacity: realityOp,
            transform: `translate(${realityShake.x}px, ${realityShake.y}px) scale(${realitySlam})`,
          }}
        >
          {/* REALITY label */}
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 32,
              fontWeight: 900,
              color: GREEN,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(22, 163, 74, 0.5)',
            }}
          >
            REALITY
          </div>
          {/* Reality text */}
          <div
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 36,
              fontWeight: 700,
              color: '#bbf7d0',
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              maxWidth: 900,
            }}
          >
            {reality}
          </div>

          {/* STAT slam */}
          <div
            style={{
              opacity: statOp,
              transform: `translate(${statShake.x}px, ${statShake.y}px) scale(${statSlam})`,
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 42,
              fontWeight: 900,
              color: brand.colors.textPrimary,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
              padding: '14px 28px',
              background: 'rgba(6, 182, 212, 0.12)',
              borderRadius: 14,
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            {stat}
          </div>

          {/* Source */}
          <div
            style={{
              opacity: statOp * 0.5,
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 22,
              color: brand.colors.textMuted,
              textAlign: 'center',
            }}
          >
            {source}
          </div>
        </div>
      </div>

      {/* Split line */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 45px)',
          left: 0,
          right: 0,
          height: 4,
          background: brand.colors.textPrimary,
          opacity: realityOp * pulse(frame, 24, 0.5, 1),
          boxShadow: `0 0 30px rgba(255, 255, 255, 0.5)`,
          pointerEvents: 'none',
        }}
      />

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
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

      <SMDUrgencyBar text="Stop believing myths. Start scanning." />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
