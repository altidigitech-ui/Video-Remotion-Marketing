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
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Constants ────────────────────────────────────────────────────────────────
// 12s @ 30fps = 360 frames. Reading time prioritized over speed.

const INTRO_TEXT = 'While you read your morning emails…'
const INTRO_CHAR_RATE = 0.75
const COUNTER_START = 40
const COUNTER_END = 240 // 200-frame ramp (6.7s)
const TARGET_VALUE = 2100
const FREEZE_START = 240
const SLAM_ABOVE_START = 260
const EVERY_START = 280
const SINGLE_START = 288
const MONTH_START = 296
const CTA_START = 330

// Named paliers — displayed BELOW the counter, not over it.
type Palier = { from: number; to: number; subtitle: string }
const PALIERS: Palier[] = [
  { from: 0, to: 200, subtitle: 'ghost app #1 charging…' },
  { from: 200, to: 500, subtitle: 'slow load time losing visitors…' },
  { from: 500, to: 900, subtitle: 'dead code eating performance…' },
  { from: 900, to: 1400, subtitle: 'products invisible to Google…' },
  { from: 1400, to: 2100, subtitle: 'AI shopping agents skipping your store…' },
]

// Frame at which each palier boundary is hit (ease-in: value = target * t^2).
const thresholdHitFrame = (target: number): number => {
  const ratio = target / TARGET_VALUE
  const t = Math.sqrt(ratio)
  return Math.round(COUNTER_START + t * (COUNTER_END - COUNTER_START))
}
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
          bottom: 140,
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

// ─── Main composition ─────────────────────────────────────────────────────────

export const SMDMoneyCounter: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Intro typewriter (top zone)
  const introChars = Math.floor(Math.max(0, (frame - 2) * INTRO_CHAR_RATE))
  const introDisplay = INTRO_TEXT.slice(0, Math.min(introChars, INTRO_TEXT.length))
  // Visible until SLAM_ABOVE_START (intro clears to make room for the SLAM line).
  const introOp = interpolate(
    frame,
    [2, 14, SLAM_ABOVE_START - 10, SLAM_ABOVE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Counter ramp — ease-in (t squared)
  const counterT = interpolate(
    frame,
    [COUNTER_START, COUNTER_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const easedT = counterT * counterT
  const counterValue = easedT * TARGET_VALUE

  // Counter stays fully visible from appearance through the end — no fade-out
  // until the very last few frames (keeps it anchored behind the SLAM words).
  const counterOp = interpolate(
    frame,
    [COUNTER_START - 5, COUNTER_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  // Small pulse once counter freezes.
  const frozenPulse =
    frame >= FREEZE_START ? pulse(frame, 20, 0.98, 1.04) : 1

  // Active palier
  let activePalier: Palier = PALIERS[0] as Palier
  for (const p of PALIERS) if (counterValue >= p.from) activePalier = p

  // Boundary shake + flash
  const boundaryShake = BOUNDARY_FRAMES.reduce(
    (acc, f) => {
      const s = shake(frame, f, 6, 8)
      return { x: acc.x + s.x, y: acc.y + s.y }
    },
    { x: 0, y: 0 },
  )
  const boundaryFlash = BOUNDARY_FRAMES.reduce(
    (acc, f) => Math.max(acc, redFlashOpacity(frame, f)),
    0,
  )

  // Palier subtitle opacity — hidden once SLAM words take that lower band
  const palierOp = interpolate(
    frame,
    [COUNTER_START, COUNTER_START + 20, EVERY_START - 8, EVERY_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const palierPulse = pulse(frame, 40, 0.8, 1)

  // "THIS IS YOUR STORE." SLAM above
  const aboveSlam = spring({
    frame: Math.max(0, frame - SLAM_ABOVE_START),
    fps,
    from: 1.4,
    to: 1,
    config: SLAM_SPRING,
  })
  const aboveOp = interpolate(
    frame,
    [SLAM_ABOVE_START, SLAM_ABOVE_START + 6],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const aboveShake = shake(frame, SLAM_ABOVE_START + 2, 8, 10)

  // "EVERY. SINGLE. MONTH." word-by-word below
  const mkWordOp = (start: number) =>
    interpolate(frame, [start, start + 6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  const mkWordSlam = (start: number) =>
    spring({
      frame: Math.max(0, frame - start),
      fps,
      from: 1.3,
      to: 1,
      config: SLAM_SPRING,
    })
  const everyOp = mkWordOp(EVERY_START)
  const singleOp = mkWordOp(SINGLE_START)
  const monthOp = mkWordOp(MONTH_START)
  const everySlam = mkWordSlam(EVERY_START)
  const singleSlam = mkWordSlam(SINGLE_START)
  const monthSlam = mkWordSlam(MONTH_START)

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

  // Urgency bar breath
  const urgencyBreathe = pulse(frame, 40, 0.88, 1)
  const urgencyOp = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: '#000000', overflow: 'hidden' }}>
      {/* Red-tinted radial background during counter */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.12) 0%, transparent 60%)',
          opacity:
            frame >= COUNTER_START && frame < CTA_START
              ? pulse(frame, 60, 0.5, 1)
              : 0,
          pointerEvents: 'none',
        }}
      />

      {/* ═════════ TOP ZONE (y: 180 → 360) — intro OR "THIS IS YOUR STORE." ═════════ */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 60,
          right: 60,
          textAlign: 'center',
        }}
      >
        {/* Intro */}
        <div
          style={{
            opacity: introOp,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 44,
            fontWeight: 700,
            color: brand.colors.white,
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          }}
        >
          {introDisplay}
        </div>

        {/* "THIS IS YOUR STORE." SLAM */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: aboveOp,
            transform: `translate(${aboveShake.x}px, ${aboveShake.y}px) scale(${aboveSlam})`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 72,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textShadow: '0 0 40px rgba(220, 38, 38, 0.55)',
          }}
        >
          THIS IS <span style={{ color: RED }}>YOUR STORE.</span>
        </div>
      </div>

      {/* ═════════ COUNTER ZONE (centered around y: 720) ═════════ */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          opacity: counterOp,
          transform: `translate(${boundaryShake.x}px, ${boundaryShake.y}px) scale(${frozenPulse})`,
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 120,
            fontWeight: 900,
            color: RED,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center',
            textShadow:
              '0 0 60px rgba(220, 38, 38, 0.7), 0 0 30px rgba(220, 38, 38, 0.5)',
          }}
        >
          {formatDollarsCents(counterValue)}
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 28,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            letterSpacing: '-0.005em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          per month in invisible costs
        </div>
      </div>

      {/* ═════════ LOWER BAND (y: 1040 → 1280) — palier OR EVERY/SINGLE/MONTH ═════════ */}
      <div
        style={{
          position: 'absolute',
          top: 1000,
          left: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        {/* Palier subtitle (during counter ramp) */}
        <div
          key={activePalier.subtitle}
          style={{
            opacity: palierOp * palierPulse,
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 28,
            fontWeight: 800,
            color: '#fca5a5',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(220, 38, 38, 0.45)',
            maxWidth: 900,
            lineHeight: 1.25,
          }}
        >
          ↯ {activePalier.subtitle}
        </div>

        {/* EVERY. SINGLE. MONTH. — word by word */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              opacity: everyOp,
              transform: `scale(${everySlam})`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 64,
              fontWeight: 900,
              color: brand.colors.white,
              letterSpacing: '-0.02em',
            }}
          >
            EVERY.
          </span>
          <span
            style={{
              opacity: singleOp,
              transform: `scale(${singleSlam})`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 64,
              fontWeight: 900,
              color: RED,
              letterSpacing: '-0.02em',
              textShadow: '0 0 24px rgba(220, 38, 38, 0.5)',
            }}
          >
            SINGLE.
          </span>
          <span
            style={{
              opacity: monthOp,
              transform: `scale(${monthSlam})`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 64,
              fontWeight: 900,
              color: brand.colors.white,
              letterSpacing: '-0.02em',
            }}
          >
            MONTH.
          </span>
        </div>
      </div>

      {/* BOUNDARY RED FLASH */}
      <AbsoluteFill
        style={{
          background: RED,
          opacity: boundaryFlash,
          pointerEvents: 'none',
        }}
      />

      {/* ═════════ CTA ZONE (y: 1380 → 1680) ═════════ */}
      <div
        style={{
          position: 'absolute',
          top: 1340,
          left: 40,
          right: 40,
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 48,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          60 seconds to stop the bleeding.
          <br />
          <span style={{ color: brand.colors.accent }}>Free.</span>
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 42,
            fontWeight: 900,
            color: brand.colors.white,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '22px 48px',
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
            lineHeight: 1.3,
          }}
        >
          Or keep paying.
          <br />
          Your competitor won&apos;t.
        </div>
      </div>

      {/* URGENCY BAR */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: 100,
          opacity: urgencyOp * urgencyBreathe,
          background: `linear-gradient(90deg, ${RED} 0%, #ea580c 100%)`,
          padding: '26px 40px',
          textAlign: 'center',
          boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 32,
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
