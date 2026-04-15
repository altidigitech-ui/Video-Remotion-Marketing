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
import {
  RED,
  SLAM_SPRING,
  formatDollarsCents,
  glitch,
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Timings (30fps, 240-frame comp) ──────────────────────────────────────────

const INTRO_TEXT = 'While you read your morning emails…'
const INTRO_CHAR_RATE = 0.8
const COUNTER_START = 30
const COUNTER_END = 180
const TARGET_VALUE = 2100
const SLAM_START = 180
const CTA_START = 210

// Named thresholds (in $). Each subtitle is shown once value crosses it.
type Palier = { from: number; to: number; subtitle: string }
const PALIERS: Palier[] = [
  { from: 0, to: 200, subtitle: 'ghost app #1 charging…' },
  { from: 200, to: 500, subtitle: 'slow load time losing visitors…' },
  { from: 500, to: 900, subtitle: 'dead code eating performance…' },
  { from: 900, to: 1400, subtitle: 'products invisible to Google…' },
  { from: 1400, to: 2100, subtitle: 'AI shopping agents skipping your store…' },
]

// Ease-in: value = target * t^2. Compute frame at which each palier boundary hits.
const thresholdHitFrame = (target: number): number => {
  const ratio = target / TARGET_VALUE
  const t = Math.sqrt(ratio)
  return Math.round(COUNTER_START + t * (COUNTER_END - COUNTER_START))
}

// Boundary frames = frames at which a new palier takes over.
const BOUNDARY_FRAMES = PALIERS.slice(1).map((p) => thresholdHitFrame(p.from))

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
          bottom: 150,
          right: 48,
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

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDMoneyCounter: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Intro typewriter
  const introChars = Math.floor(Math.max(0, frame * INTRO_CHAR_RATE))
  const introDisplay = INTRO_TEXT.slice(0, Math.min(introChars, INTRO_TEXT.length))
  const introOp = interpolate(
    frame,
    [0, 6, COUNTER_END - 20, COUNTER_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Counter value — ease-in (t squared).
  const counterT = interpolate(
    frame,
    [COUNTER_START, COUNTER_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const easedT = counterT * counterT
  const counterValue = easedT * TARGET_VALUE

  const counterOp = interpolate(
    frame,
    [COUNTER_START - 5, COUNTER_START + 5, SLAM_START - 5, SLAM_START + 5],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Active palier — last one whose `from <= counterValue`.
  let activePalier: Palier = PALIERS[0] as Palier
  for (const p of PALIERS) {
    if (counterValue >= p.from) activePalier = p
  }

  // Boundary flashes + shakes (brief red pulse when the subtitle changes).
  const boundaryShake = BOUNDARY_FRAMES.reduce(
    (acc, f) => {
      const s = shake(frame, f, 7, 10)
      return { x: acc.x + s.x, y: acc.y + s.y }
    },
    { x: 0, y: 0 },
  )
  const boundaryFlash = BOUNDARY_FRAMES.reduce(
    (acc, f) => Math.max(acc, redFlashOpacity(frame, f)),
    0,
  )

  // Freeze + SLAM block ($2,100 holds, big text appears)
  const freezeGlitch = glitch(frame, SLAM_START + 2)
  const slamScale = spring({
    frame: Math.max(0, frame - SLAM_START),
    fps,
    from: 1.6,
    to: 1,
    config: SLAM_SPRING,
  })
  const slamOp = interpolate(
    frame,
    [SLAM_START, SLAM_START + 6, CTA_START - 8, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const slamShake = shake(frame, SLAM_START + 3, 10, 14)

  // Frozen max-value number visible in background during SLAM overlay
  const frozenCounterOp = interpolate(
    frame,
    [SLAM_START, SLAM_START + 5, CTA_START - 8, CTA_START],
    [1, 0.35, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

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

  // Urgency bar
  const urgencyBreathe = pulse(frame, 40, 0.85, 1)
  const urgencyOp = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Subtitle change — fade current subtitle in when frame crosses its boundary.
  const subtitleKey = activePalier.subtitle
  const subtitleOp =
    frame >= COUNTER_START
      ? pulse(frame, 40, 0.75, 1)
      : 0

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      {/* Subtle red pulse tint during counter phase */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.12) 0%, transparent 60%)',
          opacity:
            frame >= COUNTER_START && frame < SLAM_START
              ? pulse(frame, 60, 0.5, 1)
              : frame >= SLAM_START && frame < CTA_START
                ? 0.9
                : 0,
          pointerEvents: 'none',
        }}
      />

      {/* INTRO */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          right: 0,
          opacity: introOp,
          padding: '0 60px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 52,
            fontWeight: 700,
            color: brand.colors.white,
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          }}
        >
          {introDisplay}
        </div>
      </div>

      {/* COUNTER + palier subtitle */}
      <AbsoluteFill
        style={{
          opacity: counterOp,
          transform: `translate(${boundaryShake.x}px, ${boundaryShake.y}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 200,
            fontWeight: 900,
            color: RED,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textShadow:
              '0 0 60px rgba(220, 38, 38, 0.7), 0 0 30px rgba(220, 38, 38, 0.5)',
          }}
        >
          {formatDollarsCents(counterValue)}
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 32,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            letterSpacing: '-0.005em',
            textTransform: 'uppercase',
          }}
        >
          per month in invisible costs
        </div>
        {/* Palier subtitle — changes as counter crosses each threshold */}
        <div
          key={subtitleKey}
          style={{
            marginTop: 20,
            opacity: subtitleOp,
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 34,
            fontWeight: 800,
            color: '#fca5a5',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textAlign: 'center',
            padding: '0 40px',
            textShadow: '0 0 14px rgba(220, 38, 38, 0.45)',
          }}
        >
          ↯ {activePalier.subtitle}
        </div>
      </AbsoluteFill>

      {/* BOUNDARY RED FLASH */}
      <AbsoluteFill
        style={{
          background: RED,
          opacity: boundaryFlash,
          pointerEvents: 'none',
        }}
      />

      {/* FROZEN $2,100 behind the SLAM overlay */}
      {frame >= SLAM_START && frame < CTA_START && (
        <AbsoluteFill
          style={{
            opacity: frozenCounterOp,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            clipPath: freezeGlitch.clip,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 200,
              fontWeight: 900,
              color: RED,
              letterSpacing: '-0.03em',
              transform: `translateX(${freezeGlitch.redShift}px)`,
              textShadow: '0 0 60px rgba(220, 38, 38, 0.7)',
            }}
          >
            $2,100.00
          </div>
        </AbsoluteFill>
      )}

      {/* SLAM "THIS IS YOUR STORE. EVERY. SINGLE. MONTH." */}
      <AbsoluteFill
        style={{
          opacity: slamOp,
          transform: `translate(${slamShake.x}px, ${slamShake.y}px) scale(${slamScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 50px',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 98,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.025em',
            lineHeight: 1.04,
            textAlign: 'center',
            textShadow: '0 0 50px rgba(220, 38, 38, 0.55)',
          }}
        >
          THIS IS
          <br />
          <span style={{ color: RED }}>YOUR STORE.</span>
          <br />
          EVERY.
          <br />
          <span style={{ color: RED }}>SINGLE.</span>
          <br />
          MONTH.
        </div>
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill
        style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 50px',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 68,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            textAlign: 'center',
          }}
        >
          60 seconds to
          <br />
          stop the bleeding.
          <br />
          <span style={{ color: brand.colors.accent }}>Free.</span>
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 44,
            fontWeight: 900,
            color: brand.colors.white,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '24px 52px',
            borderRadius: 18,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
          }}
        >
          Scan now →
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 22,
            color: brand.colors.textMuted,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Or keep paying.
          <br />
          Your competitor won&apos;t.
        </div>
      </AbsoluteFill>

      {/* URGENCY BAR */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          opacity: urgencyOp * urgencyBreathe,
          background: `linear-gradient(90deg, ${RED} 0%, #ea580c 100%)`,
          padding: '24px 40px',
          textAlign: 'center',
          boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 38,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}
        >
          Every second costs you money
        </span>
      </div>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
