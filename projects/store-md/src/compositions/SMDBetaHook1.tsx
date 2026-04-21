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
import { RED, SLAM_SPRING, pulse, shake } from '../utils/aggressive'

// ── Phase timing (frames @ 30fps) ─────────────────────────────────────────────

const P1_FADE_OUT_START = 130
const P1_FADE_OUT_END = 145

const P2_START = 145
const P2_FADE_IN_END = 160
const P2_FADE_OUT_START = 285
const P2_FADE_OUT_END = 295

const P3_START = 295
const P3_FADE_IN_END = 310

// ── Phase 1 sub-timing ────────────────────────────────────────────────────────

const YES_SHAKE_START = 15  // spring slams at ~15 frames with SLAM_SPRING
const LINE1_START = 65
const LINE2_START = 90
const LINE3_START = 115

// ── Phase 2 sub-timing ────────────────────────────────────────────────────────

const SCORE_ANIM_START = P2_START
const SCORE_ANIM_DURATION = 80
const LABELS_START = P2_START + 50  // 195
const WORSE_START = LABELS_START + 30 // 225

// ── Phase 3 sub-timing ────────────────────────────────────────────────────────

const E1_START = P3_START        // 295 — "WE'LL SCAN YOUR STORE"
const E2_START = P3_START + 20   // 315 — "FOR FREE."
const E3_START = P3_START + 40   // 335 — body copy
const E4_START = P3_START + 60   // 355 — divider
const E5_START = P3_START + 75   // 370 — "ONLY 10 SPOTS"
const E6_START = P3_START + 95   // 390 — CTA block

// ── Score circle geometry ─────────────────────────────────────────────────────

const SC_SIZE = 260
const SC_RADIUS = 105
const SC_STROKE = 14
const SC_CIRC = 2 * Math.PI * SC_RADIUS
const SCORE_TARGET = 34

export const SMDBetaHook1: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // ── Phase opacities ──────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, 6, P1_FADE_OUT_START, P1_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase2Op = interpolate(
    frame,
    [P2_START, P2_FADE_IN_END, P2_FADE_OUT_START, P2_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase3Op = interpolate(
    frame,
    [P3_START, P3_FADE_IN_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 — "YES." spring scale ────────────────────────────────────────────

  const yesScale = spring({
    frame: Math.max(0, frame),
    fps,
    from: 2.0,
    to: 1.0,
    config: SLAM_SPRING,
  })

  // Screen shake fires when YES slams down
  const { x: shakeX, y: shakeY } = shake(frame, YES_SHAKE_START, 10, 8)

  // ── Phase 1 — three lines (opacity + spring translateY) ───────────────────────

  const line1Op = interpolate(frame, [LINE1_START, LINE1_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line1Y = spring({
    frame: Math.max(0, frame - LINE1_START),
    fps,
    from: 30,
    to: 0,
    config: SLAM_SPRING,
  })

  const line2Op = interpolate(frame, [LINE2_START, LINE2_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line2Y = spring({
    frame: Math.max(0, frame - LINE2_START),
    fps,
    from: 30,
    to: 0,
    config: SLAM_SPRING,
  })

  const line3Op = interpolate(frame, [LINE3_START, LINE3_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line3Y = spring({
    frame: Math.max(0, frame - LINE3_START),
    fps,
    from: 30,
    to: 0,
    config: SLAM_SPRING,
  })

  // ── Phase 2 — score circle (ease-out counter) ─────────────────────────────────

  const scoreRaw = interpolate(
    frame,
    [SCORE_ANIM_START, SCORE_ANIM_START + SCORE_ANIM_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const scoreEased = 1 - (1 - scoreRaw) * (1 - scoreRaw)
  const scoreNum = Math.round(scoreEased * SCORE_TARGET)
  const scoreDash = SC_CIRC * (1 - (scoreEased * SCORE_TARGET) / 100)

  const labelsOp = interpolate(frame, [LABELS_START, LABELS_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const worseOp = interpolate(frame, [WORSE_START, WORSE_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const worseScale = spring({
    frame: Math.max(0, frame - WORSE_START),
    fps,
    from: 0.8,
    to: 1.0,
    config: SLAM_SPRING,
  })

  // ── Phase 3 — staggered reveals ───────────────────────────────────────────────

  const e1Op = interpolate(frame, [E1_START, E1_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const e2Op = interpolate(frame, [E2_START, E2_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const e2Scale = spring({
    frame: Math.max(0, frame - E2_START),
    fps,
    from: 1.6,
    to: 1.0,
    config: SLAM_SPRING,
  })

  const e3Op = interpolate(frame, [E3_START, E3_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const e4Op = interpolate(frame, [E4_START, E4_START + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const spotsPulse = pulse(frame, 30, 0.85, 1.0)
  const e5Op = interpolate(frame, [E5_START, E5_START + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const e6Op = interpolate(frame, [E6_START, E6_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Badge border opacity and glow intensity both pulse
  const badgeBorderOp = pulse(frame, 30, 0.3, 0.7)
  const badgeGlow = pulse(frame, 30, 0.2, 0.5)

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* ══ PHASE 1 — HOOK — THUMB-STOPPER YELLOW ════════════════════════════ */}
      <AbsoluteFill
        style={{
          backgroundColor: '#fbbf24',
          opacity: phase1Op,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 60px 200px',
          }}
        >
          {/* "YES." — single word slam */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 220,
              fontWeight: 900,
              color: '#000000',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              transform: `scale(${yesScale})`,
              display: 'block',
            }}
          >
            YES.
          </span>

          {/* Three lines — staggered 25 frames apart */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              marginTop: 60,
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 42,
                fontWeight: 700,
                color: '#1a0505',
                lineHeight: 1.25,
                textAlign: 'center',
                opacity: line1Op,
                transform: `translateY(${line1Y}px)`,
                display: 'block',
              }}
            >
              Your store has hidden bugs.
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 42,
                fontWeight: 700,
                color: '#1a0505',
                lineHeight: 1.25,
                textAlign: 'center',
                opacity: line2Op,
                transform: `translateY(${line2Y}px)`,
                display: 'block',
              }}
            >
              They cost you real money.
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 42,
                fontWeight: 800,
                color: '#dc2626',
                lineHeight: 1.25,
                textAlign: 'center',
                opacity: line3Op,
                transform: `translateY(${line3Y}px)`,
                display: 'block',
              }}
            >
              You just can&apos;t see them.
            </span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══ PHASE 2 — THE PROBLEM — DARK BACKGROUND ══════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase2Op }}>
        <StoreMDBackground brand={brand} />

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 60px 200px',
          }}
        >
          {/* Score circle — 260px diameter, red arc with glow */}
          <div style={{ position: 'relative', width: SC_SIZE, height: SC_SIZE }}>
            <svg
              width={SC_SIZE}
              height={SC_SIZE}
              viewBox={`0 0 ${SC_SIZE} ${SC_SIZE}`}
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Track */}
              <circle
                cx={SC_SIZE / 2}
                cy={SC_SIZE / 2}
                r={SC_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={SC_STROKE}
              />
              {/* Animated red arc */}
              <circle
                cx={SC_SIZE / 2}
                cy={SC_SIZE / 2}
                r={SC_RADIUS}
                fill="none"
                stroke={RED}
                strokeWidth={SC_STROKE}
                strokeDasharray={SC_CIRC}
                strokeDashoffset={scoreDash}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 14px rgba(220,38,38,0.85))' }}
              />
            </svg>

            {/* Number centered in circle */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 100,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {scoreNum}
              </span>
              <span
                style={{
                  fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                  fontSize: 24,
                  color: brand.colors.textMuted,
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                /100
              </span>
            </div>
          </div>

          {/* Context labels */}
          <div style={{ height: 50 }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              opacity: labelsOp,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 36,
                fontWeight: 500,
                color: '#94a3b8',
                textAlign: 'center',
              }}
            >
              This is the average
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 36,
                fontWeight: 500,
                color: '#94a3b8',
                textAlign: 'center',
              }}
            >
              Shopify health score.
            </span>
          </div>

          {/* "Yours is probably worse." — spring bounce, arrives 30 frames later */}
          <div style={{ height: 30 }} />
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 44,
              fontWeight: 800,
              color: RED,
              textAlign: 'center',
              opacity: worseOp,
              transform: `scale(${worseScale})`,
              display: 'block',
            }}
          >
            Yours is probably worse.
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══ PHASE 3 — THE OFFER — MONEY SHOT ════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase3Op }}>
        <StoreMDBackground brand={brand} />

        {/* Subtle cyan radial at center */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 60px 200px',
          }}
        >
          {/* 1 — "WE'LL SCAN YOUR STORE" */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 48,
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              opacity: e1Op,
              display: 'block',
            }}
          >
            WE&apos;LL SCAN YOUR STORE
          </span>

          {/* 2 — "FOR FREE." — cyan SLAM */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 80,
              fontWeight: 900,
              color: '#06b6d4',
              textAlign: 'center',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textShadow:
                '0 0 40px rgba(6,182,212,0.5), 0 0 20px rgba(6,182,212,0.3)',
              opacity: e2Op,
              transform: `scale(${e2Scale})`,
              display: 'block',
              marginTop: 8,
            }}
          >
            FOR FREE.
          </span>

          {/* 3 — Body copy */}
          <div style={{ height: 24 }} />
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 32,
              fontWeight: 600,
              color: '#94a3b8',
              textAlign: 'center',
              opacity: e3Op,
              display: 'block',
            }}
          >
            Full Pro scan. 60 seconds. $0.
          </span>

          {/* 4 — Divider */}
          <div style={{ height: 28 }} />
          <div
            style={{
              width: 100,
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.15)',
              opacity: e4Op,
            }}
          />

          {/* 5 — "ONLY 10 SPOTS" — pulsing */}
          <div style={{ height: 24 }} />
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 36,
              fontWeight: 800,
              color: RED,
              textAlign: 'center',
              letterSpacing: 3,
              opacity: e5Op * spotsPulse,
              display: 'block',
            }}
          >
            ONLY 10 SPOTS
          </span>

          {/* 6 — CTA block */}
          <div style={{ height: 32 }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: e6Op,
            }}
          >
            {/* DM "BETA" */}
            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 64,
                fontWeight: 900,
                color: '#facc15',
                textAlign: 'center',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textShadow:
                  '0 0 40px rgba(250,204,21,0.6), 0 0 20px rgba(250,204,21,0.4)',
              }}
            >
              DM &quot;BETA&quot;
            </span>

            {/* @StoreMD */}
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 36,
                fontWeight: 600,
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              @StoreMD
            </span>

            {/* Badge with pulsing glow */}
            <div
              style={{
                border: `2px solid rgba(250,204,21,${badgeBorderOp})`,
                borderRadius: 14,
                padding: '14px 32px',
                boxShadow: `0 0 24px rgba(250,204,21,${badgeGlow})`,
              }}
            >
              <span
                style={{
                  fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#facc15',
                  letterSpacing: 3,
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                CODE: TIKTOK10
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── Persistent overlays ───────────────────────────────────────────────── */}
      <SMDLogoOverlay bottomOffset={220} />
      <SMDUrgencyBar text="Your store is bleeding right now" />
    </AbsoluteFill>
  )
}
