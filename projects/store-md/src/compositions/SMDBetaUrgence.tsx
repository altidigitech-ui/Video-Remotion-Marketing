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

// ── Brand tokens ──────────────────────────────────────────────────────────────
const brand = storeMdBrand
const CYAN = brand.colors.accent         // #06b6d4
const WHITE = brand.colors.textPrimary   // #f8fafc
const MUTED = brand.colors.textMuted     // #64748b

// ── Spring configs ────────────────────────────────────────────────────────────
const SLAM = { damping: 12, mass: 0.8, stiffness: 260, overshootClamping: false } as const
const SMOOTH = { damping: 20, mass: 1, stiffness: 160, overshootClamping: false } as const

// ── Phase timing (30fps, 360 frames = 12s) ────────────────────────────────────

// Phase 1: "StoreMD Pro Beta" — 0–64f (0–2.13s)
const P1_IN_END = 8
const P1_BRAND_F = 4
const P1_BETA_F = 18
const P1_OUT_START = 54
const P1_OUT_END = 64

// Phase 2: "Opens Monday." — 60–124f (2–4.13s)
const P2_IN = 60
const P2_IN_END = 72
const P2_OPENS_F = 74
const P2_MONDAY_F = 90
const P2_OUT_START = 114
const P2_OUT_END = 124

// Phase 3: "10 spots. That's it." — 120–212f (4–7.07s)
const P3_IN = 120
const P3_IN_END = 130
const P3_TEN_F = 122       // "10" hard slam
const P3_SPOTS_F = 152     // "spots."
const P3_THATS_F = 174     // "That's it."
const P3_OUT_START = 200
const P3_OUT_END = 212

// Phase 4: "Reserve yours now — DM @foundrytwo" — 208–302f (6.93–10.07s)
const P4_IN = 208
const P4_IN_END = 220
const P4_L1_F = 222
const P4_L2_F = 250
const P4_OUT_START = 290
const P4_OUT_END = 302

// Phase 5: end card — 298–360f (9.93–12s)
const P5_IN = 298
const P5_IN_END = 312
const P5_URL_F = 318
const P5_TAG_F = 330

// ── Animation helpers ─────────────────────────────────────────────────────────

function slideUp(
  frame: number,
  fps: number,
  startFrame: number,
  fromY = 28,
): { opacity: number; translateY: number } {
  const lf = Math.max(0, frame - startFrame)
  const s = spring({ frame: lf, fps, config: SMOOTH })
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
): { opacity: number; scale: number; translateY: number } {
  const lf = Math.max(0, frame - startFrame)
  const s = spring({ frame: lf, fps, config: SLAM })
  return {
    opacity: interpolate(lf, [0, 5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    scale: interpolate(s, [0, 1], [1.3, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    translateY: interpolate(s, [0, 1], [60, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SMDBetaUrgence: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
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
    [P5_IN, P5_IN_END, 357, 360],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 animations ──────────────────────────────────────────────────────

  const p1Brand = slideUp(frame, fps, P1_BRAND_F)
  const p1Beta = slideUp(frame, fps, P1_BETA_F)

  // ── Phase 2 animations ──────────────────────────────────────────────────────

  const p2Opens = slideUp(frame, fps, P2_OPENS_F)
  const p2Monday = slamIn(frame, fps, P2_MONDAY_F)

  // ── Phase 3 animations ──────────────────────────────────────────────────────

  const p3Ten = slamIn(frame, fps, P3_TEN_F)
  const p3Spots = slideUp(frame, fps, P3_SPOTS_F, 20)
  const p3Thats = slideUp(frame, fps, P3_THATS_F, 20)

  // Subtle scale breathe for "10" while on screen (after it settles)
  const tenBreatheLf = Math.max(0, frame - P3_TEN_F - 20)
  const tenBreatheCycle = (tenBreatheLf % 90) / 90
  const tenBreathe = interpolate(tenBreatheCycle, [0, 0.5, 1], [1, 1.012, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Phase 4 animations ──────────────────────────────────────────────────────

  const p4L1 = slideUp(frame, fps, P4_L1_F)
  const p4L2 = slideUp(frame, fps, P4_L2_F)

  // ── Phase 5 animations ──────────────────────────────────────────────────────

  const p5URL = slideUp(frame, fps, P5_URL_F)
  const p5Tag = slideUp(frame, fps, P5_TAG_F)

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <StoreMDBackground brand={brand} />

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 1 — "StoreMD Pro Beta"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase1Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '0 80px',
        }}
      >
        {/* "StoreMD" — brand mark */}
        <div
          style={{
            color: WHITE,
            fontSize: 80,
            fontWeight: 800,
            opacity: p1Brand.opacity,
            transform: `translateY(${p1Brand.translateY}px)`,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          StoreMD
        </div>

        {/* "Pro Beta" — cyan badge */}
        <div
          style={{
            opacity: p1Beta.opacity,
            transform: `translateY(${p1Beta.translateY}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 2,
              backgroundColor: CYAN,
              borderRadius: 1,
            }}
          />
          <div
            style={{
              color: CYAN,
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Pro Beta
          </div>
          <div
            style={{
              width: 36,
              height: 2,
              backgroundColor: CYAN,
              borderRadius: 1,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 2 — "Opens Monday."
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase2Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '0 80px',
        }}
      >
        <div
          style={{
            color: brand.colors.textSecondary,
            fontSize: 52,
            fontWeight: 500,
            opacity: p2Opens.opacity,
            transform: `translateY(${p2Opens.translateY}px)`,
            textAlign: 'center',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          Opens
        </div>
        <div
          style={{
            color: CYAN,
            fontSize: 110,
            fontWeight: 900,
            opacity: p2Monday.opacity,
            transform: `translateY(${p2Monday.translateY}px) scale(${p2Monday.scale})`,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          Monday.
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 3 — "10 spots. That's it."
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
        {/* Cyan glow radial behind the "10" */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(6,182,212,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* "10" — hero number */}
        <div
          style={{
            color: WHITE,
            fontSize: 320,
            fontWeight: 900,
            opacity: p3Ten.opacity,
            transform: `scale(${p3Ten.scale * tenBreathe}) translateY(${p3Ten.translateY}px)`,
            textAlign: 'center',
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            textShadow: [
              `0 0 40px rgba(6,182,212,0.9)`,
              `0 0 100px rgba(6,182,212,0.5)`,
              `0 0 200px rgba(6,182,212,0.25)`,
            ].join(', '),
            position: 'relative',
          }}
        >
          10
        </div>

        {/* "spots." — cyan */}
        <div
          style={{
            color: CYAN,
            fontSize: 72,
            fontWeight: 700,
            opacity: p3Spots.opacity,
            transform: `translateY(${p3Spots.translateY}px)`,
            textAlign: 'center',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginTop: 8,
          }}
        >
          spots.
        </div>

        {/* "That's it." — muted */}
        <div
          style={{
            color: MUTED,
            fontSize: 52,
            fontWeight: 500,
            opacity: p3Thats.opacity,
            transform: `translateY(${p3Thats.translateY}px)`,
            textAlign: 'center',
            letterSpacing: '0.01em',
            lineHeight: 1.2,
          }}
        >
          That&apos;s it.
        </div>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 4 — "Reserve yours now — DM @foundrytwo"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          opacity: phase4Op,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: '0 80px',
        }}
      >
        {/* "Reserve yours now —" */}
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontWeight: 600,
            opacity: p4L1.opacity,
            transform: `translateY(${p4L1.translateY}px)`,
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          Reserve yours now —
        </div>

        {/* "DM @foundrytwo" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            opacity: p4L2.opacity,
            transform: `translateY(${p4L2.translateY}px)`,
          }}
        >
          <span
            style={{
              color: brand.colors.textSecondary,
              fontSize: 60,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            DM
          </span>
          <span
            style={{
              color: CYAN,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            @foundrytwo
          </span>
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
        {/* Brand name */}
        <div
          style={{
            color: WHITE,
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          StoreMD
        </div>

        {/* Divider */}
        <div
          style={{
            width: 72,
            height: 2,
            backgroundColor: CYAN,
            borderRadius: 1,
          }}
        />

        {/* URL */}
        <div
          style={{
            color: CYAN,
            fontSize: 42,
            fontWeight: 700,
            opacity: p5URL.opacity,
            transform: `translateY(${p5URL.translateY}px)`,
            textAlign: 'center',
            letterSpacing: '0.01em',
          }}
        >
          storemd.vercel.app
        </div>

        {/* Tagline */}
        <div
          style={{
            color: MUTED,
            fontSize: 30,
            fontWeight: 400,
            opacity: p5Tag.opacity,
            transform: `translateY(${p5Tag.translateY}px)`,
            textAlign: 'center',
          }}
        >
          Free scan · 60 seconds
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
