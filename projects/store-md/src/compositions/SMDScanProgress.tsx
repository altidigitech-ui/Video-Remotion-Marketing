import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { evolvePath } from '@remotion/paths'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { ScoreCircle } from '../components/ScoreCircle'

// ─── Constants ────────────────────────────────────────────────────────────────

const SCORE = 72
const FACT =
  'The average Shopify store has 14 apps, each adding 200-500ms to load time.'

// Single-stroke checkmark (24x24). evolvePath draws it from start to end.
const CHECKMARK_PATH = 'M5 12 L10 17 L19 7'

type Step = {
  label: string
  /** Frame at which this step row starts appearing. */
  start: number
}

// Each step row consumes a 50-frame window:
//   start … start+20  → label/circle fade & slide in
//   start+20 … start+50 → checkmark draws via evolvePath
const STEPS: Step[] = [
  { label: 'Theme analyzed', start: 30 },
  { label: 'Apps detected', start: 60 },
  { label: 'Products scanned', start: 90 },
  { label: 'Checking app impact', start: 120 },
  { label: 'Detecting residual code', start: 150 },
]

// Frame milestones for the scan timeline (matches user spec).
const SCAN_KEYFRAMES = [20, 60, 110, 140, 170, 190, 210] as const
const SCAN_PERCENTS = [0, 20, 40, 60, 80, 95, 100] as const

// ─── Sub-components ───────────────────────────────────────────────────────────

const Spinner: React.FC<{ rotation: number; primary: string }> = ({
  rotation,
  primary,
}) => (
  <div
    style={{
      width: 64,
      height: 64,
      transform: `rotate(${rotation}deg)`,
      flexShrink: 0,
    }}
  >
    <svg width={64} height={64} viewBox="0 0 32 32">
      <circle
        cx={16}
        cy={16}
        r={13}
        fill="none"
        stroke="rgba(37,99,235,0.18)"
        strokeWidth={3}
      />
      {/* 3/4-circle arc — rotates with `frame` to give the spinner motion */}
      <path
        d="M 16 3 A 13 13 0 1 1 3 16"
        fill="none"
        stroke={primary}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  </div>
)

const StepRow: React.FC<{ step: Step; frame: number }> = ({ step, frame }) => {
  const { start } = step
  const brand = storeMdBrand

  // Row enter (label + circle slot)
  const rowOpacity = interpolate(frame, [start, start + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rowY = interpolate(frame, [start, start + 20], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Green-tinted circle background fades in just before the check draws.
  const circleFill = interpolate(frame, [start + 10, start + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Checkmark draws progressively via evolvePath.
  const checkProgress = interpolate(frame, [start + 20, start + 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    checkProgress,
    CHECKMARK_PATH,
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        opacity: rowOpacity,
        transform: `translateY(${rowY}px)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: `rgba(22, 163, 74, ${0.18 * circleFill})`,
          border: `2px solid rgba(22, 163, 74, ${0.55 * circleFill})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={32} height={32} viewBox="0 0 24 24">
          <path
            d={CHECKMARK_PATH}
            fill="none"
            stroke={storeMdScoreColors.excellent}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>

      <span
        style={{
          fontFamily: `'${brand.typography.fontBody}', sans-serif`,
          fontWeight: brand.typography.weightMedium,
          fontSize: 38,
          color: brand.colors.textPrimary,
          letterSpacing: '-0.005em',
        }}
      >
        {step.label}
      </span>
    </div>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────

export const SMDScanProgress: React.FC = () => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand

  // ── Title + spinner (frames 0-30) ──
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const spinnerRotation = frame * 9 // ≈ 1 turn per 40 frames

  // ── Progress bar (frames 20-210) ──
  const progressOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const progressValue = interpolate(
    frame,
    SCAN_KEYFRAMES as unknown as number[],
    SCAN_PERCENTS as unknown as number[],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Completion flash (frames 190-210) ──
  const flashOpacity = interpolate(
    frame,
    [190, 200, 210],
    [0, 0.45, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Scan content fades out as score reveal fades in ──
  const scanContentOpacity = interpolate(frame, [200, 220], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scoreOpacity = interpolate(frame, [205, 225], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scoreScale = interpolate(frame, [205, 235], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Fact box: appears once the first step lands ──
  const factOpacity = interpolate(frame, [60, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const factY = interpolate(frame, [60, 95], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column' }}>
        {/* TITLE + SPINNER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 200,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <Spinner rotation={spinnerRotation} primary={brand.colors.primary} />
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontWeight: brand.typography.weightBold,
              fontSize: 60,
              color: brand.colors.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Scanning your store…
          </span>
        </div>

        {/* SCAN CONTENT — fades out at frame 200-220 */}
        <div style={{ opacity: scanContentOpacity, marginTop: 100 }}>
          {/* PROGRESS BAR */}
          <div style={{ opacity: progressOpacity, marginBottom: 80 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 18,
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 28,
                color: brand.colors.textSecondary,
                letterSpacing: '0.05em',
              }}
            >
              <span style={{ textTransform: 'uppercase' }}>Progress</span>
              <span
                style={{
                  color: brand.colors.textPrimary,
                  fontWeight: brand.typography.weightSemibold,
                  fontSize: 36,
                }}
              >
                {Math.round(progressValue)}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 18,
                background: 'rgba(37, 99, 235, 0.14)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressValue}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
                  borderRadius: 999,
                  boxShadow: '0 0 18px rgba(37, 99, 235, 0.55)',
                }}
              />
            </div>
          </div>

          {/* STEPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {STEPS.map((step) => (
              <StepRow key={step.label} step={step} frame={frame} />
            ))}
          </div>
        </div>

        {/* SCORE REVEAL — overlays everything from frame 200 onwards */}
        {frame >= 200 && (
          <AbsoluteFill
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              opacity: scoreOpacity,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 56,
                transform: `scale(${scoreScale})`,
              }}
            >
              <span
                style={{
                  fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                  fontWeight: brand.typography.weightSemibold,
                  fontSize: 32,
                  color: brand.colors.textSecondary,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Your Store Score
              </span>
              {/* ScoreCircle is fixed 160px — scale up for the hero reveal */}
              <div style={{ transform: 'scale(2.5)', transformOrigin: 'center' }}>
                <ScoreCircle score={SCORE} startFrame={210} duration={30} />
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* FACT BOX — anchored at the bottom of the frame */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            right: 80,
            opacity: factOpacity,
            transform: `translateY(${factY}px)`,
            background: 'rgba(13, 17, 23, 0.85)',
            border: `1px solid ${brand.colors.border}`,
            borderRadius: 20,
            padding: '28px 32px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 18,
              color: brand.colors.accent,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Did you know
          </div>
          <div
            style={{
              fontFamily: `'${brand.typography.fontBody}', sans-serif`,
              fontSize: 28,
              fontWeight: brand.typography.weightMedium,
              color: brand.colors.textPrimary,
              lineHeight: 1.4,
            }}
          >
            {FACT}
          </div>
        </div>
      </AbsoluteFill>

      {/* Completion flash sits above all content, below the score reveal isn't needed */}
      <AbsoluteFill
        style={{
          background: brand.colors.white,
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
