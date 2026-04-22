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

// ── Timing constants (30fps, 720 frames = 24s) ────────────────────────────────

// Phase 1: "60-second Shopify scan" — 0–66f (0–2.2s)
const P1_FADE_IN_END = 12
const P1_FADE_OUT_START = 52
const P1_FADE_OUT_END = 67

// Phase 2: scan modules — 60–250f (2–8.3s)
const P2_FADE_IN = 60
const P2_FADE_IN_END = 74
const P2_FADE_OUT_START = 240
const P2_FADE_OUT_END = 256

// Module appearance frames (31f apart ≈ 1s each)
const MODULE_STARTS = [74, 105, 136, 167, 198] as const

// Phase 3: "5 modules. 43 checks." — 250–456f (8.3–15.2s)
const P3_FADE_IN = 250
const P3_FADE_IN_END = 264
const P3_LINE1_FRAME = 270
const P3_LINE2_FRAME = 320
const P3_FADE_OUT_START = 440
const P3_FADE_OUT_END = 456

// Phase 4: CTA — 450–615f (15–20.5s)
const P4_FADE_IN = 450
const P4_FADE_IN_END = 464
const P4_LINE1_FRAME = 472
const P4_LINE2_FRAME = 510
const P4_CTA_FRAME = 540
const P4_FADE_OUT_START = 600
const P4_FADE_OUT_END = 616

// Phase 5: end card — 610–720f (20.3–24s)
const P5_FADE_IN = 610
const P5_FADE_IN_END = 624
const P5_CONTENT_FRAME = 630

// ── Module data ───────────────────────────────────────────────────────────────

type ModuleData = {
  label: string
  resultText: string
  resultColor: string
}

const MODULES: ReadonlyArray<ModuleData> = [
  { label: 'Store Health', resultText: '67/100', resultColor: '#f59e0b' },
  { label: 'Ghost Billing', resultText: '3 found', resultColor: '#dc2626' },
  { label: 'AI Readiness', resultText: '42/100', resultColor: '#ea580c' },
  { label: 'Theme Code', resultText: '8 errors', resultColor: '#dc2626' },
  { label: 'Listings', resultText: '78/100', resultColor: '#16a34a' },
]

// ── ScanModule sub-component ──────────────────────────────────────────────────

type ScanModuleProps = {
  module: ModuleData
  startFrame: number
  frame: number
  fps: number
  fontMono: string
}

const SCAN_SPRING = { damping: 18, mass: 0.8, stiffness: 200 } as const
const RESULT_SPRING = { damping: 16, mass: 0.8, stiffness: 280 } as const

const ScanModule: React.FC<ScanModuleProps> = ({
  module,
  startFrame,
  frame,
  fps,
  fontMono,
}) => {
  const lf = Math.max(0, frame - startFrame)

  const cardOp = interpolate(lf, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const cardY = spring({ frame: lf, fps, from: 18, to: 0, config: SCAN_SPRING })

  // Progress bar: fills 0→100% over frames 4–30
  const barProgress = interpolate(lf, [4, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // "SCANNING..." visible while bar is filling, fades out as result arrives
  const scanningOp = interpolate(lf, [4, 12, 28, 32], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Result text fades in after bar completes
  const resultOp = interpolate(lf, [30, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const resultScale = spring({
    frame: Math.max(0, lf - 30),
    fps,
    from: 0.82,
    to: 1,
    config: RESULT_SPRING,
  })

  // Indicator dot: green while scanning, switches to result color on completion
  const dotGreenOp = interpolate(lf, [28, 34], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const dotResultOp = interpolate(lf, [28, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Animated dots suffix: "", ".", "..", "..." cycling
  const dotCount = lf < 30 ? Math.floor(lf / 6) % 4 : 3
  const scanningText = 'SCANNING' + '.'.repeat(dotCount)

  return (
    <div
      style={{
        opacity: cardOp,
        transform: `translateY(${cardY}px)`,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        padding: '13px 16px',
      }}
    >
      {/* Header row: dot + label left, status right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {/* Left: indicator dot + module name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
            {/* Green dot while scanning */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 6px rgba(34,197,94,0.7)',
                opacity: dotGreenOp,
              }}
            />
            {/* Result color dot after scan */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: module.resultColor,
                boxShadow: `0 0 6px ${module.resultColor}`,
                opacity: dotResultOp,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: `'${fontMono}', monospace`,
              fontSize: 20,
              fontWeight: 600,
              color: '#f1f5f9',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {module.label}
          </span>
        </div>

        {/* Right: scanning text OR result (overlaid at same position) */}
        <div style={{ position: 'relative', minWidth: 110, height: 26 }}>
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: scanningOp,
              fontFamily: `'${fontMono}', monospace`,
              fontSize: 14,
              color: '#22c55e',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            {scanningText}
          </span>
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              opacity: resultOp,
              transform: `translateY(-50%) scale(${resultScale})`,
              transformOrigin: 'right center',
              fontFamily: `'${fontMono}', monospace`,
              fontSize: 20,
              fontWeight: 800,
              color: module.resultColor,
              textShadow: `0 0 10px ${module.resultColor}80`,
              whiteSpace: 'nowrap',
            }}
          >
            {module.resultText}
          </span>
        </div>
      </div>

      {/* Progress bar — always green (scan progress), 4px tall */}
      <div
        style={{
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${barProgress * 100}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            borderRadius: 2,
            boxShadow: '0 0 8px rgba(34,197,94,0.45)',
          }}
        />
      </div>
    </div>
  )
}

// ── Main composition ──────────────────────────────────────────────────────────

export const SMDScanDemoAgency: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  const MONO = brand.typography.fontMono      // 'JetBrains Mono'
  const DISPLAY = brand.typography.fontDisplay // 'Outfit'

  const SMOOTH = brand.motion.springSmooth

  // ── Phase opacities ──────────────────────────────────────────────────────────

  const phase1Op = interpolate(
    frame,
    [0, P1_FADE_IN_END, P1_FADE_OUT_START, P1_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase2Op = interpolate(
    frame,
    [P2_FADE_IN, P2_FADE_IN_END, P2_FADE_OUT_START, P2_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase3Op = interpolate(
    frame,
    [P3_FADE_IN, P3_FADE_IN_END, P3_FADE_OUT_START, P3_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase4Op = interpolate(
    frame,
    [P4_FADE_IN, P4_FADE_IN_END, P4_FADE_OUT_START, P4_FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const phase5Op = interpolate(
    frame,
    [P5_FADE_IN, P5_FADE_IN_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Phase 1 animations ───────────────────────────────────────────────────────

  const p1TitleY = spring({
    frame: Math.max(0, frame - 5),
    fps,
    from: 44,
    to: 0,
    config: SMOOTH,
  })

  const p1SubOp = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Blinking cursor on the headline
  const cursorOn = Math.floor(frame * 0.5) % 2 === 0

  // ── Phase 3 animations ───────────────────────────────────────────────────────

  const line1Op = interpolate(frame, [P3_LINE1_FRAME, P3_LINE1_FRAME + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line1Y = spring({
    frame: Math.max(0, frame - P3_LINE1_FRAME),
    fps,
    from: 32,
    to: 0,
    config: { damping: 16, mass: 1, stiffness: 160 },
  })

  const line2Op = interpolate(frame, [P3_LINE2_FRAME, P3_LINE2_FRAME + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line2Scale = spring({
    frame: Math.max(0, frame - P3_LINE2_FRAME),
    fps,
    from: 0.84,
    to: 1,
    config: { damping: 16, mass: 1, stiffness: 220 },
  })

  // ── Phase 4 animations ───────────────────────────────────────────────────────

  const p4L1Op = interpolate(frame, [P4_LINE1_FRAME, P4_LINE1_FRAME + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const p4L1Y = spring({
    frame: Math.max(0, frame - P4_LINE1_FRAME),
    fps,
    from: 28,
    to: 0,
    config: SMOOTH,
  })

  const p4L2Op = interpolate(frame, [P4_LINE2_FRAME, P4_LINE2_FRAME + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const p4L2Y = spring({
    frame: Math.max(0, frame - P4_LINE2_FRAME),
    fps,
    from: 28,
    to: 0,
    config: SMOOTH,
  })

  const p4CtaOp = interpolate(frame, [P4_CTA_FRAME, P4_CTA_FRAME + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const p4CtaScale = spring({
    frame: Math.max(0, frame - P4_CTA_FRAME),
    fps,
    from: 0.88,
    to: 1,
    config: { damping: 18, mass: 0.8, stiffness: 200 },
  })

  // ── Phase 5 animations ───────────────────────────────────────────────────────

  const p5ContentOp = interpolate(frame, [P5_CONTENT_FRAME, P5_CONTENT_FRAME + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 1 — "60-second Shopify scan"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase1Op }}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            gap: 0,
          }}
        >
          {/* Terminal ready indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 36,
              opacity: p1SubOp,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.8)',
              }}
            />
            <span
              style={{
                fontFamily: `'${MONO}', monospace`,
                fontSize: 17,
                color: '#22c55e',
                letterSpacing: '0.12em',
              }}
            >
              STOREMD AGENT READY
            </span>
          </div>

          {/* Main headline */}
          <div style={{ transform: `translateY(${p1TitleY}px)` }}>
            <div
              style={{
                fontFamily: `'${DISPLAY}', sans-serif`,
                fontSize: 96,
                fontWeight: 900,
                color: '#f8fafc',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                textAlign: 'center',
              }}
            >
              60-second
            </div>
            <div
              style={{
                fontFamily: `'${DISPLAY}', sans-serif`,
                fontSize: 96,
                fontWeight: 900,
                color: brand.colors.accent,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                textAlign: 'center',
                textShadow: '0 0 48px rgba(6,182,212,0.38)',
              }}
            >
              Shopify scan{cursorOn ? '' : '​'}
            </div>
          </div>

          {/* Sub line */}
          <div
            style={{
              marginTop: 32,
              opacity: p1SubOp,
              fontFamily: `'${MONO}', monospace`,
              fontSize: 20,
              color: brand.colors.textMuted,
              letterSpacing: '0.06em',
              textAlign: 'center',
            }}
          >
            5 modules&nbsp;&nbsp;·&nbsp;&nbsp;43 checks&nbsp;&nbsp;·&nbsp;&nbsp;free
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 2 — Scan modules appearing sequentially
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase2Op }}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 52px',
          }}
        >
          {/* Terminal header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              paddingBottom: 14,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.75)',
              }}
            />
            <span
              style={{
                fontFamily: `'${MONO}', monospace`,
                fontSize: 16,
                color: '#22c55e',
                letterSpacing: '0.1em',
              }}
            >
              SCANNING
            </span>
            <span
              style={{
                fontFamily: `'${MONO}', monospace`,
                fontSize: 16,
                color: brand.colors.textMuted,
                letterSpacing: '0.04em',
              }}
            >
              storemd.vercel.app
            </span>
          </div>

          {/* Module cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MODULES.map((mod, i) => (
              <ScanModule
                key={mod.label}
                module={mod}
                startFrame={MODULE_STARTS[i]}
                frame={frame}
                fps={fps}
                fontMono={MONO}
              />
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 3 — "5 modules. 43 checks."
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase3Op }}>
        {/* Subtle glow accent behind text */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(6,182,212,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 110,
              fontWeight: 900,
              color: '#f8fafc',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              opacity: line1Op,
              transform: `translateY(${line1Y}px)`,
            }}
          >
            5 modules.
          </div>
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 110,
              fontWeight: 900,
              color: brand.colors.accent,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              textShadow: '0 0 60px rgba(6,182,212,0.32)',
              opacity: line2Op,
              transform: `scale(${line2Scale})`,
            }}
          >
            43 checks.
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 4 — "Run yours free or DM for manual scan"
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase4Op }}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 76,
              fontWeight: 900,
              color: '#f8fafc',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              opacity: p4L1Op,
              transform: `translateY(${p4L1Y}px)`,
            }}
          >
            Run yours free
          </div>
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 52,
              fontWeight: 600,
              color: brand.colors.textSecondary,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              opacity: p4L2Op,
              transform: `translateY(${p4L2Y}px)`,
            }}
          >
            or DM for manual scan
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: 24,
              opacity: p4CtaOp,
              transform: `scale(${p4CtaScale})`,
            }}
          >
            <div
              style={{
                backgroundColor: brand.colors.accent,
                borderRadius: 14,
                padding: '18px 52px',
                boxShadow: '0 0 36px rgba(6,182,212,0.28)',
              }}
            >
              <span
                style={{
                  fontFamily: `'${MONO}', monospace`,
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#050507',
                  letterSpacing: '0.04em',
                }}
              >
                storemd.vercel.app
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 5 — End card
          ════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: phase5Op }}>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.09) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            gap: 0,
            opacity: p5ContentOp,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 56,
              fontWeight: 900,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            StoreMD
          </div>

          {/* URL */}
          <div
            style={{
              fontFamily: `'${MONO}', monospace`,
              fontSize: 30,
              fontWeight: 400,
              color: brand.colors.accent,
              letterSpacing: '0.02em',
              textAlign: 'center',
              marginTop: 10,
              textShadow: '0 0 20px rgba(6,182,212,0.3)',
            }}
          >
            storemd.vercel.app
          </div>

          {/* Divider */}
          <div
            style={{
              width: 180,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.12)',
              margin: '24px 0',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily: `'${DISPLAY}', sans-serif`,
              fontSize: 26,
              fontWeight: 500,
              color: brand.colors.textMuted,
              textAlign: 'center',
              letterSpacing: '-0.01em',
              lineHeight: 1.45,
            }}
          >
            Your Shopify store health score{'\n'}in 60 seconds. Free.
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
