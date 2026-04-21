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
import { RED, SLAM_SPRING, pulse } from '../utils/aggressive'

// ── Phase timing constants (frames) ──────────────────────────────────────────

const P1_END = 100    // Phase 1 fades out 100-110
const P2_START = 110  // Phase 2 fades in 110-120
const P2_END = 240    // Phase 2 fades out 240-250
const P3_START = 250  // Phase 3 fades in 250-262

// ── Score circle geometry (220px diameter) ────────────────────────────────────

const SC_SIZE = 220
const SC_RADIUS = 90
const SC_STROKE = 12
const SC_CIRC = 2 * Math.PI * SC_RADIUS
const SCORE = 34

// ── Issue lines for Phase 1 ───────────────────────────────────────────────────

const ISSUES = [
  "✗ 'Pay Now' button broken on mobile",
  '✗ Promo codes ignored at checkout',
  '✗ Taxes wrongly calculated (UK/EU)',
] as const

// ── Composition ───────────────────────────────────────────────────────────────

export const SMDBetaQuestionChoc: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // ── Phase opacities ──────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, 6, P1_END, P2_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase2Op = interpolate(
    frame,
    [P2_START, P2_START + 10, P2_END, P2_END + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase3Op = interpolate(
    frame,
    [P3_START, P3_START + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 — element appearances ────────────────────────────────────────────

  const shopUrlOp = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const issueOps = [
    interpolate(frame, [45, 57], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(frame, [75, 87], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  ]

  const bottomLabelOp = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Phase 2 — score circle ───────────────────────────────────────────────────

  const scoreDash = interpolate(
    frame,
    [P2_START, P2_START + 60],
    [SC_CIRC, SC_CIRC * (1 - SCORE / 100)],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const scoreNum = Math.round(
    interpolate(
      frame,
      [P2_START, P2_START + 60],
      [0, SCORE],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )

  // ── Phase 2 — text lines (spring slam-in, staggered 15 frames each) ──────────

  const TL = P2_START + 30

  const l1Op = interpolate(frame, [TL, TL + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l1Scale = spring({ frame: Math.max(0, frame - TL), fps, from: 1.2, to: 1, config: SLAM_SPRING })

  const l2Op = interpolate(frame, [TL + 15, TL + 23], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l2Scale = spring({ frame: Math.max(0, frame - (TL + 15)), fps, from: 1.2, to: 1, config: SLAM_SPRING })

  const l3Op = interpolate(frame, [TL + 30, TL + 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l3Scale = spring({ frame: Math.max(0, frame - (TL + 30)), fps, from: 1.2, to: 1, config: SLAM_SPRING })

  // ── Phase 3 — CTA spring bounce & badge pulse ─────────────────────────────────

  const ctaBounce = spring({
    frame: Math.max(0, frame - P3_START),
    fps,
    from: 0.7,
    to: 1,
    config: SLAM_SPRING,
  })

  const badgePulse = pulse(frame, 40, 0.85, 1)
  const badgeBorderOp = pulse(frame, 40, 0.3, 0.65)

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 1 — HOOK — FOND JAUNE VIF
          frames 0-110 (fade out 100-110)
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ backgroundColor: '#fbbf24', opacity: phase1Op }}>

        {/* Contenu principal centré */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 64px',
          }}
        >
          {/* "OUI." */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 180,
              fontWeight: 900,
              color: '#000000',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textAlign: 'center',
            }}
          >
            YES.
          </span>

          {/* "ton-shop.com" — apparaît à frame 20 */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 36,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.6)',
              marginTop: 20,
              opacity: shopUrlOp,
            }}
          >
            ton-shop.com
          </span>

          {/* 3 lignes ✗ — apparaissent une par une, gap 16px */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 52,
              width: '100%',
            }}
          >
            {ISSUES.map((text, i) => (
              <span
                key={text}
                style={{
                  fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#dc2626',
                  lineHeight: 1.3,
                  opacity: issueOps[i],
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </AbsoluteFill>

        {/* "EN 60 SECONDES" — bas de l'écran, position absolute */}
        <div
          style={{
            position: 'absolute',
            bottom: 160,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: bottomLabelOp,
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 36,
              fontWeight: 700,
              color: '#000000',
            }}
          >
            {'IN '}
          </span>
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 48,
              fontWeight: 900,
              color: '#dc2626',
            }}
          >
            60
          </span>
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 36,
              fontWeight: 700,
              color: '#000000',
            }}
          >
            {' SECONDS'}
          </span>
        </div>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 2 — SCORE REVEAL — FOND SOMBRE
          frames 110-250 (fade in 110-120, fade out 240-250)
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase2Op }}>
        <StoreMDBackground brand={brand} />

        {/* Label "SCORE SANTÉ" — en haut de l'écran */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 28,
              fontWeight: 800,
              color: RED,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            HEALTH SCORE
          </span>
        </div>

        {/* Score circle + texte — centrés verticalement */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {/* Score circle SVG — 220px de diamètre */}
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
              {/* Arc rouge avec glow */}
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
                style={{ filter: 'drop-shadow(0 0 12px rgba(220,38,38,0.85))' }}
              />
            </svg>

            {/* Chiffre centré dans le cercle */}
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
                  fontSize: 80,
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
                  fontSize: 20,
                  color: brand.colors.textMuted,
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                /100
              </span>
            </div>
          </div>

          {/* Texte sur 3 lignes — spring bounce staggeré */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 52,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                display: 'block',
                opacity: l1Op,
                transform: `scale(${l1Scale})`,
              }}
            >
              YOUR CHECKOUT
            </span>

            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 64,
                fontWeight: 900,
                color: RED,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                textShadow: '0 0 40px rgba(220,38,38,0.7), 0 0 20px rgba(220,38,38,0.5)',
                display: 'block',
                opacity: l2Op,
                transform: `scale(${l2Scale})`,
              }}
            >
              BLEEDS
            </span>

            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 52,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                display: 'block',
                opacity: l3Op,
                transform: `scale(${l3Scale})`,
              }}
            >
              MONEY ?
            </span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 3 — CTA BETA — FOND SOMBRE + CYAN RADIAL
          frames 250-360 (fade in 250-262)
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase3Op }}>
        <StoreMDBackground brand={brand} />

        {/* Léger radial gradient cyan au centre */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Contenu CTA — centré verticalement, spring bounce à l'entrée */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${ctaBounce})`,
          }}
        >
          {/* "10 PLACES · BETA TEST" */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 24,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: 3,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            10 SPOTS · BETA TEST
          </span>

          <div style={{ height: 20 }} />

          {/* 'DM "BETA"' */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 72,
              fontWeight: 900,
              color: '#facc15',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              textShadow: '0 0 40px rgba(250,204,21,0.7), 0 0 20px rgba(250,204,21,0.5)',
              lineHeight: 1,
            }}
          >
            DM &quot;BETA&quot;
          </span>

          <div style={{ height: 16 }} />

          {/* "@StoreMD sur Insta" */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 32,
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            @StoreMD on Instagram
          </span>

          <div style={{ height: 20 }} />

          {/* Badge "CODE: TIKTOK10" — pulse doux */}
          <div
            style={{
              borderRadius: 12,
              border: `2px solid rgba(250,204,21,${badgeBorderOp})`,
              padding: '12px 28px',
              opacity: badgePulse,
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
              }}
            >
              CODE: TIKTOK10
            </span>
          </div>

          <div style={{ height: 16 }} />

          {/* "1 mois PRO gratuit · -10% à vie" */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 22,
              fontWeight: 500,
              color: brand.colors.textMuted,
              textAlign: 'center',
            }}
          >
            1 month PRO free · -10% for life
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── Overlays persistants dès frame 0 ─────────────────────────────────── */}
      <SMDLogoOverlay />
      <SMDUrgencyBar />
    </AbsoluteFill>
  )
}
