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

// ── Phase timing constants (frames @ 30fps) ───────────────────────────────────

const P1_HOLD_END = 120   // Phase 1 fades out 120→130
const P1_FADE_END = 130
const P2_START = 140      // Phase 2 fades in 140→150 (10-frame gap after P1)
const P2_HOLD_END = 240   // Phase 2 fades out 240→250
const P2_FADE_END = 250
const P3_START = 260      // Phase 3 fades in 260→272 (10-frame gap after P2)

// ── Phase 1 element timing ────────────────────────────────────────────────────

const BLOCK1_FRAME = 15
const BLOCK2_FRAME = 40
const BLOCK3_FRAME = 65
const NUMBER_SLAM_FRAME = 90

// ── Phase 2 element timing ────────────────────────────────────────────────────

const SCAN_TITLE_FRAME = P2_START + 10
const CHECK1_FRAME = P2_START + 28
const CHECK2_FRAME = P2_START + 48
const CHECK3_FRAME = P2_START + 68
const SUBTEXT_FRAME = P2_START + 83

// ── Composition ───────────────────────────────────────────────────────────────

export const SMDBetaConfession: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // ── Phase opacities ──────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, 6, P1_HOLD_END, P1_FADE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase2Op = interpolate(
    frame,
    [P2_START, P2_START + 10, P2_HOLD_END, P2_FADE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase3Op = interpolate(
    frame,
    [P3_START, P3_START + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 — story block entries (translateY + opacity) ─────────────────────

  const block1Op = interpolate(frame, [BLOCK1_FRAME, BLOCK1_FRAME + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const block1Y = interpolate(frame, [BLOCK1_FRAME, BLOCK1_FRAME + 12], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const block2Op = interpolate(frame, [BLOCK2_FRAME, BLOCK2_FRAME + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const block2Y = interpolate(frame, [BLOCK2_FRAME, BLOCK2_FRAME + 12], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const block3Op = interpolate(frame, [BLOCK3_FRAME, BLOCK3_FRAME + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const block3Y = interpolate(frame, [BLOCK3_FRAME, BLOCK3_FRAME + 12], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  // ── Phase 1 — big number slam ─────────────────────────────────────────────────

  const numberOp = interpolate(frame, [NUMBER_SLAM_FRAME, NUMBER_SLAM_FRAME + 6], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const numberScale = spring({
    frame: Math.max(0, frame - NUMBER_SLAM_FRAME),
    fps,
    from: 1.8,
    to: 1,
    config: SLAM_SPRING,
  })

  const { x: shakeX, y: shakeY } = shake(frame, NUMBER_SLAM_FRAME, 8, 10)
  const flashOp = redFlashOpacity(frame, NUMBER_SLAM_FRAME)

  // ── Phase 2 — "I SCAN EVERYTHING" spring bounce ───────────────────────────────

  const scanTitleOp = interpolate(frame, [SCAN_TITLE_FRAME, SCAN_TITLE_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const scanTitleBounce = spring({
    frame: Math.max(0, frame - SCAN_TITLE_FRAME),
    fps,
    from: 0.6,
    to: 1,
    config: SLAM_SPRING,
  })

  const check1Op = interpolate(frame, [CHECK1_FRAME, CHECK1_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const check2Op = interpolate(frame, [CHECK2_FRAME, CHECK2_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const check3Op = interpolate(frame, [CHECK3_FRAME, CHECK3_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const subtextOp = interpolate(frame, [SUBTEXT_FRAME, SUBTEXT_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

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

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 1 — THE CONFESSION
          frames 0-130 (fade in 0-6, fade out 120-130)
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, #0d0d1a 0%, #1a0505 100%)',
          opacity: phase1Op,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* "CONFESSION TIME" label — y: 200px, centered */}
        <div
          style={{
            position: 'absolute',
            top: 200,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 24,
              fontWeight: 800,
              color: RED,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            CONFESSION TIME
          </span>
        </div>

        {/* Story blocks — top: 300px, gap: 40px */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          {/* Block 1 — frame 15 */}
          <div
            style={{
              opacity: block1Op,
              transform: `translateY(${block1Y}px)`,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 38,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              The bug that ruined me 💀
            </span>
          </div>

          {/* Block 2 — frame 40: crash + red badge "6 months" */}
          <div
            style={{
              opacity: block2Op,
              transform: `translateY(${block2Y}px)`,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 30,
                fontWeight: 500,
                color: '#94a3b8',
                lineHeight: 1.4,
              }}
            >
              My mobile checkout was crashing on iPhone for{' '}
              <span
                style={{
                  display: 'inline-block',
                  background: RED,
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: 6,
                  verticalAlign: 'middle',
                }}
              >
                6 months
              </span>
            </span>
          </div>

          {/* Block 3 — frame 65: underline + orange badge + emoji */}
          <div
            style={{
              opacity: block3Op,
              transform: `translateY(${block3Y}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 30,
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.4,
              }}
            >
              Shopify never{' '}
              <span
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: RED,
                  textUnderlineOffset: 5,
                }}
              >
                warned me
              </span>
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 30,
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.4,
              }}
            >
              I found out{' '}
              <span
                style={{
                  display: 'inline-block',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: 6,
                  verticalAlign: 'middle',
                }}
              >
                by accident
              </span>{' '}
              😤
            </span>
          </div>
        </div>

        {/* THE BIG NUMBER — y: 900px */}
        <div
          style={{
            position: 'absolute',
            top: 900,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: numberOp,
            transform: `scale(${numberScale})`,
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 32,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            I lost
          </span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 120,
              fontWeight: 900,
              color: RED,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textShadow: '0 0 60px rgba(220,38,38,0.5)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            -$11,982
          </span>
        </div>
      </AbsoluteFill>

      {/* Red flash overlay — frames NUMBER_SLAM_FRAME to +2 */}
      <AbsoluteFill
        style={{
          background: RED,
          opacity: flashOp,
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 2 — THE SOLUTION
          frames 140-250 (fade in 140-150, fade out 240-250)
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase2Op }}>
        <StoreMDBackground brand={brand} />

        {/* "NOW" top label — y: 160px */}
        <div
          style={{
            position: 'absolute',
            top: 160,
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
              color: '#facc15',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            NOW
          </span>
        </div>

        {/* Center content — vertically centered */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 60px',
            gap: 30,
          }}
        >
          {/* "I SCAN" + "EVERYTHING" badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: scanTitleOp,
              transform: `scale(${scanTitleBounce})`,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 56,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              I SCAN
            </span>
            <span
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#000000',
                fontSize: 52,
                fontWeight: 900,
                padding: '6px 20px',
                borderRadius: 8,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              EVERYTHING
            </span>
          </div>

          {/* 3 checkmarks — one by one, 20-frame intervals */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 28,
                fontWeight: 600,
                color: '#16a34a',
                opacity: check1Op,
              }}
            >
              ✓ scanning every single month
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 28,
                fontWeight: 600,
                color: '#16a34a',
                opacity: check2Op,
              }}
            >
              ✓ takes 60 seconds, free
            </span>
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 28,
                fontWeight: 600,
                color: '#16a34a',
                opacity: check3Op,
              }}
            >
              ✓ no more surprises
            </span>
          </div>

          {/* Subtext */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 24,
              fontWeight: 700,
              color: brand.colors.textMuted,
              textAlign: 'center',
              letterSpacing: 1,
              opacity: subtextOp,
            }}
          >
            SCAN BEFORE YOU LOSE MORE CASH
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          PHASE 3 — CTA
          frames 260-360 (fade in 260-272)
          Accent: red (#dc2626) instead of yellow to match confession theme
          ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase3Op }}>
        <StoreMDBackground brand={brand} />

        {/* Red radial glow matching confession palette */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(220,38,38,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* CTA content — spring bounce at entry */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${ctaBounce})`,
          }}
        >
          {/* "10 SPOTS · BETA TEST" */}
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

          {/* 'DM "BETA"' — red accent */}
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 72,
              fontWeight: 900,
              color: RED,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              textShadow: '0 0 40px rgba(220,38,38,0.7), 0 0 20px rgba(220,38,38,0.5)',
              lineHeight: 1,
            }}
          >
            DM &quot;BETA&quot;
          </span>

          <div style={{ height: 16 }} />

          {/* "@StoreMD" */}
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

          {/* "CODE: TIKTOK10" badge — red pulse */}
          <div
            style={{
              borderRadius: 12,
              border: `2px solid rgba(220,38,38,${badgeBorderOp})`,
              padding: '12px 28px',
              opacity: badgePulse,
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 28,
                fontWeight: 800,
                color: RED,
                letterSpacing: 3,
                textAlign: 'center',
              }}
            >
              CODE: TIKTOK10
            </span>
          </div>

          <div style={{ height: 16 }} />

          {/* Offer subtext */}
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

      {/* ── Persistent overlays (all phases) ─────────────────────────────────── */}
      <SMDLogoOverlay />
      <SMDUrgencyBar />
    </AbsoluteFill>
  )
}
