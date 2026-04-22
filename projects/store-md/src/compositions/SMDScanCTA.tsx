import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'

// ── Style R palette ───────────────────────────────────────────────────────────
const WHITE = '#f8fafc'
const ORANGE = '#f97316'
const RED = '#ef4444'
const AMBER = '#f59e0b'
const MUTED = '#64748b'

// ── Spring configs ────────────────────────────────────────────────────────────
const SLAM = { damping: 11, mass: 0.7, stiffness: 280, overshootClamping: false } as const
const WORD = { damping: 18, mass: 0.8, stiffness: 200, overshootClamping: false } as const

// ── Phase timing (30fps, 420 frames = 14s) ────────────────────────────────────

// Phase 1: ghost billing — 0–88f (0–2.93s)
const P1_IN_END = 5
const P1_W1 = 6
const P1_W2 = 22
const P1_SLAM1 = 40
const P1_OUT_START = 80
const P1_OUT_END = 88

// Phase 2: AI readiness — 90–173f (3–5.77s)
const P2_IN = 90
const P2_IN_END = 96
const P2_BIG1 = 100
const P2_BIG2 = 118
const P2_SUB = 150
const P2_OUT_START = 165
const P2_OUT_END = 173

// Phase 3: App impact — 175–263f (5.83–8.77s)
const P3_IN = 175
const P3_IN_END = 181
const P3_BIG1 = 185
const P3_BIG2 = 203
const P3_SUB = 235
const P3_OUT_START = 255
const P3_OUT_END = 263

// Phase 4: DM CTA — 265–376f (8.83–12.53s)
const P4_IN = 265
const P4_IN_END = 271
const P4_L1 = 278
const P4_L2 = 308
const P4_L3 = 333
const P4_OUT_START = 368
const P4_OUT_END = 376

// Phase 5: end card — 378–420f (12.6–14s)
const P5_IN = 378
const P5_IN_END = 392
const P5_URL = 396

// ── Animation helpers ─────────────────────────────────────────────────────────

function slideIn(
  frame: number,
  fps: number,
  startFrame: number,
  fromY = 32,
): { opacity: number; translateY: number } {
  const lf = Math.max(0, frame - startFrame)
  const s = spring({ frame: lf, fps, config: WORD })
  return {
    opacity: s,
    translateY: interpolate(s, [0, 1], [fromY, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}

function slamIn(
  frame: number,
  fps: number,
  startFrame: number,
  fromY = 50,
): { opacity: number; scale: number; translateY: number } {
  const lf = Math.max(0, frame - startFrame)
  const s = spring({ frame: lf, fps, config: SLAM })
  return {
    opacity: interpolate(lf, [0, 4], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    scale: interpolate(s, [0, 1], [1.35, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    translateY: interpolate(s, [0, 1], [fromY, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SMDScanCTA: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand
  const FONT = brand.typography.fontDisplay

  // ── Phase opacities ─────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, P1_IN_END, P1_OUT_START, P1_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const phase2Op = interpolate(
    frame,
    [P2_IN, P2_IN_END, P2_OUT_START, P2_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const phase3Op = interpolate(
    frame,
    [P3_IN, P3_IN_END, P3_OUT_START, P3_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const phase4Op = interpolate(
    frame,
    [P4_IN, P4_IN_END, P4_OUT_START, P4_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const phase5Op = interpolate(
    frame,
    [P5_IN, P5_IN_END, 418, 420],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 animations ──────────────────────────────────────────────────────

  const p1W1 = slideIn(frame, fps, P1_W1)
  const p1W2 = slideIn(frame, fps, P1_W2)
  const p1Slam = slamIn(frame, fps, P1_SLAM1, 60)

  // ── Phase 2 animations ──────────────────────────────────────────────────────

  const p2Big1 = slamIn(frame, fps, P2_BIG1, 60)
  const p2Big2 = slideIn(frame, fps, P2_BIG2, 24)
  const p2Sub = slideIn(frame, fps, P2_SUB)

  // ── Phase 3 animations ──────────────────────────────────────────────────────

  const p3Big1 = slamIn(frame, fps, P3_BIG1, 60)
  const p3Big2 = slideIn(frame, fps, P3_BIG2, 24)
  const p3Sub = slideIn(frame, fps, P3_SUB)

  // ── Phase 4 animations ──────────────────────────────────────────────────────

  const p4L1 = slideIn(frame, fps, P4_L1)
  const p4L2 = slamIn(frame, fps, P4_L2)
  const p4L3 = slamIn(frame, fps, P4_L3, 70)

  // ── Phase 5 animations ──────────────────────────────────────────────────────

  const p5URL = slideIn(frame, fps, P5_URL)

  // ── Orange flash overlay at cut points ──────────────────────────────────────

  const flash1 = interpolate(frame, [82, 86, 90, 95], [0, 0.4, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const flash2 = interpolate(frame, [167, 171, 175, 180], [0, 0.4, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const flash3 = interpolate(frame, [257, 261, 265, 270], [0, 0.4, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const flashOp = Math.max(flash1, flash2, flash3)

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background, fontFamily: FONT }}>
      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 1 — "When did you last audit your Shopify for ghost billing?"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase1Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 6,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontWeight: 700,
            opacity: p1W1.opacity,
            transform: `translateY(${p1W1.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          When did you last
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontWeight: 700,
            opacity: p1W2.opacity,
            transform: `translateY(${p1W2.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          audit your Shopify
        </div>
        <div
          style={{
            color: RED,
            fontSize: 86,
            fontWeight: 900,
            opacity: p1Slam.opacity,
            transform: `translateY(${p1Slam.translateY}px) scale(${p1Slam.scale})`,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginTop: 16,
          }}
        >
          for ghost billing?
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 2 — "AI readiness?"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase2Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            color: ORANGE,
            fontSize: 176,
            fontWeight: 900,
            opacity: p2Big1.opacity,
            transform: `scale(${p2Big1.scale}) translateY(${p2Big1.translateY}px)`,
            textAlign: 'center',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
          }}
        >
          AI
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 94,
            fontWeight: 800,
            opacity: p2Big2.opacity,
            transform: `translateY(${p2Big2.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginTop: 4,
          }}
        >
          readiness?
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 38,
            fontWeight: 400,
            opacity: p2Sub.opacity,
            transform: `translateY(${p2Sub.translateY}px)`,
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          Can AI agents even find your store?
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 3 — "App impact?"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase3Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 156,
            fontWeight: 900,
            opacity: p3Big1.opacity,
            transform: `scale(${p3Big1.scale}) translateY(${p3Big1.translateY}px)`,
            textAlign: 'center',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
          }}
        >
          App
        </div>
        <div
          style={{
            color: AMBER,
            fontSize: 100,
            fontWeight: 800,
            opacity: p3Big2.opacity,
            transform: `translateY(${p3Big2.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          impact?
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 38,
            fontWeight: 400,
            opacity: p3Sub.opacity,
            transform: `translateY(${p3Sub.translateY}px)`,
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          How many apps are slowing you down?
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 4 — "DM me your URL. Free scan. 24h."
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase4Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 6,
        }}
      >
        {/* Subtle red glow behind the CTA block */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            color: WHITE,
            fontSize: 66,
            fontWeight: 700,
            opacity: p4L1.opacity,
            transform: `translateY(${p4L1.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
            position: 'relative',
          }}
        >
          DM me your URL.
        </div>
        <div
          style={{
            color: ORANGE,
            fontSize: 96,
            fontWeight: 900,
            opacity: p4L2.opacity,
            transform: `translateY(${p4L2.translateY}px) scale(${p4L2.scale})`,
            textAlign: 'center',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            position: 'relative',
          }}
        >
          Free scan.
        </div>
        <div
          style={{
            color: RED,
            fontSize: 124,
            fontWeight: 900,
            opacity: p4L3.opacity,
            transform: `translateY(${p4L3.translateY}px) scale(${p4L3.scale})`,
            textAlign: 'center',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            position: 'relative',
          }}
        >
          24h.
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 5 — End card
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase5Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          StoreMD
        </div>
        <div
          style={{
            width: 72,
            height: 3,
            backgroundColor: ORANGE,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            color: ORANGE,
            fontSize: 44,
            fontWeight: 700,
            opacity: p5URL.opacity,
            transform: `translateY(${p5URL.translateY}px)`,
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          storemd.vercel.app
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 30,
            fontWeight: 400,
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Free scan · 60 seconds · no install
        </div>
      </AbsoluteFill>

      {/* ── Orange flash at phase cut points ──────────────────────────────────── */}
      <AbsoluteFill
        style={{
          backgroundColor: ORANGE,
          opacity: flashOp,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
