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
import { SLAM_SPRING, pulse, shake } from '../utils/aggressive'

// ─── Style variants ───────────────────────────────────────────────────────────
// R = orange/red/black (urgent, Romain's account)
// F = dark blue/terminal green (cold & credible, F account)
// F2 = StoreMD brand palette (clean pro, F2 account — mutualisée)

export type BetaCounterVariant = 'R' | 'F' | 'F2'

type VariantStyle = {
  bg: string
  bgOverlay: string
  counterColor: string
  counterFont: 'display' | 'mono'
  counterGlow: string
  subtitleColor: string
  accentColor: string
  accentGlow: string
  impactColor: string
  bottomBarBg: string
  urlColor: string
}

const VARIANT_STYLES: Record<BetaCounterVariant, VariantStyle> = {
  R: {
    bg: '#060000',
    bgOverlay:
      'radial-gradient(ellipse at center, rgba(220,38,38,0.18) 0%, transparent 68%)',
    counterColor: '#F97316',
    counterFont: 'display',
    counterGlow: 'rgba(249,115,22,0.55)',
    subtitleColor: '#FFFFFF',
    accentColor: '#F97316',
    accentGlow: 'rgba(249,115,22,0.4)',
    impactColor: '#DC2626',
    bottomBarBg: 'linear-gradient(90deg, #DC2626 0%, #F97316 100%)',
    urlColor: '#F97316',
  },
  F: {
    bg: '#050A14',
    bgOverlay:
      'radial-gradient(ellipse at center, rgba(74,222,128,0.07) 0%, transparent 65%)',
    counterColor: '#4ADE80',
    counterFont: 'mono',
    counterGlow: 'rgba(74,222,128,0.5)',
    subtitleColor: '#94A3B8',
    accentColor: '#06B6D4',
    accentGlow: 'rgba(6,182,212,0.4)',
    impactColor: '#4ADE80',
    bottomBarBg: 'linear-gradient(90deg, #064e3b 0%, #065f46 100%)',
    urlColor: '#06B6D4',
  },
  F2: {
    bg: storeMdBrand.colors.background,
    bgOverlay:
      'radial-gradient(ellipse at center, rgba(37,99,235,0.13) 0%, transparent 65%)',
    counterColor: '#2563EB',
    counterFont: 'display',
    counterGlow: 'rgba(37,99,235,0.5)',
    subtitleColor: storeMdBrand.colors.textSecondary,
    accentColor: '#06B6D4',
    accentGlow: 'rgba(6,182,212,0.4)',
    impactColor: '#2563EB',
    bottomBarBg: 'linear-gradient(90deg, #1d4ed8 0%, #06b6d4 100%)',
    urlColor: '#06B6D4',
  },
}

// ─── Phase timing @ 30fps ────────────────────────────────────────────────────
// P1:   0 – 90  (0s – 3s)  "10 Pro beta spots"
// P2:  80 – 180 (3s – 6s)  "Full scan. Your real Shopify store."
// P3: 170 – 285 (6s – 9.5s) "30 days. Free."
// P4: 275 – 390 (9.2s – 13s) End card — logo + URL

const P1_FADE_START = 80
const P1_FADE_END = 95

const P2_START = 80
const P2_FADE_IN_END = 95
const P2_FADE_START = 170
const P2_FADE_END = 185

const P3_START = 170
const P3_FADE_IN_END = 185
const P3_FADE_START = 275
const P3_FADE_END = 290

const P4_START = 275
const P4_FADE_IN_END = 295

// Within Phase 1
const SHAKE_FRAME = 14
const LABEL_START = 22
const URGENCY_BADGE_START = 50

// Within Phase 2
const P2_LINE1_ANIM = P2_START + 10
const P2_LINE2_ANIM = P2_START + 28

// Within Phase 3
const P3_DAYS_ANIM = P3_START + 8
const P3_FREE_ANIM = P3_START + 26

// Within Phase 4
const P4_LOGO_ANIM = P4_START
const P4_TEXT_ANIM = P4_START + 16

export const BETA_COUNTER_DURATION = 390

// ─── Component ───────────────────────────────────────────────────────────────

export type SMDBetaCounterProps = {
  variant?: BetaCounterVariant
}

export const SMDBetaCounter: React.FC<SMDBetaCounterProps> = ({
  variant = 'R',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand
  const vs = VARIANT_STYLES[variant as BetaCounterVariant]

  const displayFont = `'${brand.typography.fontDisplay}', sans-serif`
  const bodyFont = `'${brand.typography.fontBody}', sans-serif`
  const monoFont = `'${brand.typography.fontMono}', monospace`
  const counterFont = vs.counterFont === 'mono' ? monoFont : displayFont

  // ── Phase opacities ──────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, 8, P1_FADE_START, P1_FADE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase2Op = interpolate(
    frame,
    [P2_START, P2_FADE_IN_END, P2_FADE_START, P2_FADE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase3Op = interpolate(
    frame,
    [P3_START, P3_FADE_IN_END, P3_FADE_START, P3_FADE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase4Op = interpolate(
    frame,
    [P4_START, P4_FADE_IN_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 — counter animations ────────────────────────────────────────────

  const counterScale = spring({
    frame: Math.max(0, frame),
    fps,
    from: 2.8,
    to: 1.0,
    config: SLAM_SPRING,
  })

  const { x: shakeX, y: shakeY } = shake(frame, SHAKE_FRAME, 14, 10)

  // Subtle heartbeat pulse once settled
  const counterPulse = frame > 45 ? pulse(frame, 22, 0.97, 1.03) : 1

  const labelOp = interpolate(
    frame,
    [LABEL_START, LABEL_START + 16],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const labelY = spring({
    frame: Math.max(0, frame - LABEL_START),
    fps,
    from: 28,
    to: 0,
    config: brand.motion.springSmooth,
  })

  const urgencyBadgeOp = interpolate(
    frame,
    [URGENCY_BADGE_START, URGENCY_BADGE_START + 14],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const urgencyPulse = pulse(frame, 28, 0.75, 1.0)
  const bottomBarOp = interpolate(
    frame,
    [URGENCY_BADGE_START + 4, URGENCY_BADGE_START + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 2 — text animations ────────────────────────────────────────────────

  const p2Line1Op = interpolate(
    frame,
    [P2_LINE1_ANIM, P2_LINE1_ANIM + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const p2Line1Scale = spring({
    frame: Math.max(0, frame - P2_LINE1_ANIM),
    fps,
    from: 0.82,
    to: 1,
    config: SLAM_SPRING,
  })

  const p2Line2Op = interpolate(
    frame,
    [P2_LINE2_ANIM, P2_LINE2_ANIM + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const p2Line2Y = spring({
    frame: Math.max(0, frame - P2_LINE2_ANIM),
    fps,
    from: 32,
    to: 0,
    config: brand.motion.springSmooth,
  })

  // ── Phase 3 — "30 days. Free." ───────────────────────────────────────────────

  const p3DaysOp = interpolate(
    frame,
    [P3_DAYS_ANIM, P3_DAYS_ANIM + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const p3DaysScale = spring({
    frame: Math.max(0, frame - P3_DAYS_ANIM),
    fps,
    from: 1.5,
    to: 1,
    config: SLAM_SPRING,
  })

  const p3FreeOp = interpolate(
    frame,
    [P3_FREE_ANIM, P3_FREE_ANIM + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const p3FreeScale = spring({
    frame: Math.max(0, frame - P3_FREE_ANIM),
    fps,
    from: 2.2,
    to: 1,
    config: SLAM_SPRING,
  })
  const freePulse = frame > P3_FREE_ANIM + 18 ? pulse(frame, 26, 0.97, 1.03) : 1

  // ── Phase 4 — end card ───────────────────────────────────────────────────────

  const logoScale = spring({
    frame: Math.max(0, frame - P4_LOGO_ANIM),
    fps,
    from: 0.65,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const textOp = interpolate(
    frame,
    [P4_TEXT_ANIM, P4_TEXT_ANIM + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const textY = spring({
    frame: Math.max(0, frame - P4_TEXT_ANIM),
    fps,
    from: 24,
    to: 0,
    config: brand.motion.springSmooth,
  })

  const urlGlow = pulse(frame, 35, 0.5, 1.0)

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 1 — "10 Pro beta spots"
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase1Op,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Background */}
        <AbsoluteFill style={{ backgroundColor: vs.bg }}>
          <AbsoluteFill
            style={{ background: vs.bgOverlay, pointerEvents: 'none' }}
          />
        </AbsoluteFill>

        {/* Content */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 60px 160px',
          }}
        >
          {/* "10" — hero counter */}
          <div
            style={{
              fontFamily: counterFont,
              fontSize: 300,
              fontWeight: 900,
              color: vs.counterColor,
              lineHeight: 0.85,
              letterSpacing: '-0.06em',
              textShadow: `0 0 90px ${vs.counterGlow}, 0 0 45px ${vs.counterGlow}`,
              fontVariantNumeric: 'tabular-nums',
              transform: `scale(${counterScale * counterPulse})`,
              transformOrigin: 'center center',
            }}
          >
            10
          </div>

          {/* "Pro beta spots" */}
          <div
            style={{
              marginTop: 36,
              opacity: labelOp,
              transform: `translateY(${labelY}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            <span
              style={{
                fontFamily: displayFont,
                fontSize: 60,
                fontWeight: 800,
                color: vs.subtitleColor,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              Pro beta spots
            </span>
          </div>

          {/* Urgency badge */}
          <div
            style={{
              marginTop: 48,
              opacity: urgencyBadgeOp * urgencyPulse,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: vs.impactColor,
                boxShadow: `0 0 14px ${vs.impactColor}, 0 0 6px ${vs.impactColor}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: 28,
                fontWeight: 700,
                color: vs.impactColor,
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
              }}
            >
              Spots closing fast
            </span>
          </div>
        </AbsoluteFill>

        {/* Bottom urgency bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: vs.bottomBarBg,
            opacity: bottomBarOp,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}
          >
            Limited beta access
          </span>
        </div>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 2 — "Full scan. Your real Shopify store."
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase2Op }}>
        <AbsoluteFill style={{ backgroundColor: vs.bg }}>
          <AbsoluteFill
            style={{ background: vs.bgOverlay, pointerEvents: 'none' }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 60px',
            gap: 28,
          }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontSize: 96,
              fontWeight: 900,
              color: vs.accentColor,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              textShadow: `0 0 50px ${vs.accentGlow}`,
              textAlign: 'center',
              opacity: p2Line1Op,
              transform: `scale(${p2Line1Scale})`,
              display: 'block',
            }}
          >
            Full scan.
          </span>

          <span
            style={{
              fontFamily: bodyFont,
              fontSize: 52,
              fontWeight: 700,
              color: vs.subtitleColor,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textAlign: 'center',
              opacity: p2Line2Op,
              transform: `translateY(${p2Line2Y}px)`,
              display: 'block',
            }}
          >
            Your real Shopify store.
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 3 — "30 days. Free."
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase3Op }}>
        <AbsoluteFill style={{ backgroundColor: vs.bg }}>
          <AbsoluteFill
            style={{ background: vs.bgOverlay, pointerEvents: 'none' }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 60px',
          }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontSize: 110,
              fontWeight: 900,
              color: vs.accentColor,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              textAlign: 'center',
              textShadow: `0 0 50px ${vs.accentGlow}`,
              opacity: p3DaysOp,
              transform: `scale(${p3DaysScale})`,
              display: 'block',
            }}
          >
            30 days.
          </span>

          <span
            style={{
              fontFamily: displayFont,
              fontSize: 148,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.055em',
              lineHeight: 1,
              textAlign: 'center',
              marginTop: 20,
              textShadow: '0 0 80px rgba(255,255,255,0.2)',
              opacity: p3FreeOp,
              transform: `scale(${p3FreeScale * freePulse})`,
              display: 'block',
            }}
          >
            Free.
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 4 — End card — StoreMD logo + URL
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase4Op }}>
        <AbsoluteFill style={{ backgroundColor: vs.bg }}>
          <AbsoluteFill
            style={{ background: vs.bgOverlay, pointerEvents: 'none' }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            padding: '80px 60px',
          }}
        >
          {/* Logo */}
          <div style={{ transform: `scale(${logoScale})`, transformOrigin: 'center' }}>
            <Img
              src={staticFile(brand.assets.logoPng)}
              style={{
                width: 108,
                height: 108,
                borderRadius: 22,
                filter:
                  'drop-shadow(0 8px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 28px rgba(6,182,212,0.4))',
              }}
            />
          </div>

          {/* "StoreMD" */}
          <span
            style={{
              fontFamily: displayFont,
              fontSize: 56,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              opacity: textOp,
              transform: `translateY(${textY}px)`,
              display: 'block',
            }}
          >
            StoreMD
          </span>

          {/* URL */}
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 36,
              fontWeight: 600,
              color: vs.urlColor,
              letterSpacing: '-0.01em',
              textDecoration: 'underline',
              textUnderlineOffset: 7,
              textShadow: `0 0 ${28 * urlGlow}px ${vs.accentGlow}`,
              opacity: textOp,
              transform: `translateY(${textY}px)`,
              display: 'block',
            }}
          >
            storemd.vercel.app
          </span>

          {/* Badge */}
          <div
            style={{
              border: `2px solid ${vs.accentColor}55`,
              borderRadius: 18,
              padding: '16px 40px',
              boxShadow: `0 0 28px ${vs.accentGlow}`,
              opacity: textOp,
              transform: `translateY(${textY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: displayFont,
                fontSize: 26,
                fontWeight: 800,
                color: vs.accentColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                display: 'block',
                textAlign: 'center',
              }}
            >
              Pro Beta · 30 days free
            </span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
