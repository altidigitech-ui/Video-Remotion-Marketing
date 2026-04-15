import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { evolvePath } from '@remotion/paths'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { ScoreCircle } from '../components/ScoreCircle'
import {
  RED,
  formatDollarsCents,
  glitch,
  heartbeat,
  heartbeatRing,
  liveLoss,
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Constants ────────────────────────────────────────────────────────────────
// 12s @ 30fps = 360 frames. Steps 40f apart. Score reveal 260-360 (3.3s visible).

const SCORE = 38
const SCORE_REVEAL_START = 260

const FACT =
  'Right now, 3 apps you deleted are still charging your credit card. StoreMD finds them in 60 seconds.'

const CHECKMARK_PATH = 'M5 12 L10 17 L19 7'

type Step = { label: string; start: number }

// 40-frame windows, spaced 40f apart. Last step completes at 240.
const STEPS: Step[] = [
  { label: 'Theme analyzed', start: 40 },
  { label: 'Apps detected', start: 80 },
  { label: 'Products scanned', start: 120 },
  { label: 'Checking app impact', start: 160 },
  { label: 'Detecting residual code', start: 200 },
]
const DING_FRAMES = STEPS.map((s) => s.start + 30)

// Progress keyframes — 0% at 40, 100% at 240 aligned with step completion.
const SCAN_KEYFRAMES = [30, 80, 120, 160, 200, 240] as const
const SCAN_PERCENTS = [0, 20, 40, 60, 80, 100] as const

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

const DingRing: React.FC<{ frame: number; triggerFrame: number }> = ({
  frame,
  triggerFrame,
}) => {
  const life = frame - triggerFrame
  if (life < 0 || life > 14) return null
  const progress = life / 14
  const scale = 1 + progress * 1.5
  const opacity = 1 - progress
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: `3px solid ${storeMdScoreColors.excellent}`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}

const StepRow: React.FC<{ step: Step; frame: number; dingFrame: number }> = ({
  step,
  frame,
  dingFrame,
}) => {
  const { start } = step
  const brand = storeMdBrand

  const rowOpacity = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rowY = interpolate(frame, [start, start + 18], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const circleFill = interpolate(frame, [start + 8, start + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const checkProgress = interpolate(frame, [start + 18, start + 38], [0, 1], {
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
          position: 'relative',
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
        <DingRing frame={frame} triggerFrame={dingFrame} />
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
          fontSize: 36,
          color: brand.colors.textPrimary,
          letterSpacing: '-0.005em',
        }}
      >
        {step.label}
      </span>
    </div>
  )
}

// ─── Live-loss counter (persistent, top-right) ───────────────────────────────

const LiveLossCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const op = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const value = liveLoss(frame, 0.072)
  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        right: 30,
        opacity: op,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
        padding: '10px 16px',
        background: 'rgba(13, 17, 23, 0.88)',
        border: `1px solid rgba(220, 38, 38, 0.5)`,
        borderRadius: 10,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 13,
          color: brand.colors.textMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Lost while watching
      </span>
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 24,
          fontWeight: 900,
          color: RED,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 10px rgba(220, 38, 38, 0.55)',
        }}
      >
        {formatDollarsCents(value)}
      </span>
    </div>
  )
}

// ─── Urgency bar (bottom) ────────────────────────────────────────────────────

const UrgencyBar: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const op = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const breathe = pulse(frame, 40, 0.88, 1)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 100,
        opacity: op * breathe,
        background: `linear-gradient(90deg, ${RED} 0%, #ea580c 100%)`,
        padding: '26px 40px',
        textAlign: 'center',
        boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 32,
          fontWeight: 900,
          color: brand.colors.white,
          letterSpacing: '-0.01em',
        }}
      >
        2,847 stores scanned · Avg:{' '}
        <span style={{ color: '#fecaca' }}>41/100</span>
      </span>
      <span
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 24,
          fontWeight: 700,
          color: brand.colors.white,
          letterSpacing: '0.02em',
        }}
      >
        What&apos;s yours? → link in bio
      </span>
    </div>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────

export const SMDScanProgress: React.FC = () => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand

  // Title + spinner
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const spinnerRotation = frame * 9

  // Progress bar
  const progressOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const progressValue = interpolate(
    frame,
    SCAN_KEYFRAMES as unknown as number[],
    SCAN_PERCENTS as unknown as number[],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const gradientShift = (frame * 2) % 200

  // White flash when progress hits 100%
  const flashOpacity = interpolate(
    frame,
    [240, 250, 260],
    [0, 0.45, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Scan content fades out before score reveal
  const scanContentOpacity = interpolate(frame, [245, 265], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scoreOpacity = interpolate(frame, [260, 285], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scoreScale = interpolate(frame, [260, 295], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const scoreShake = shake(frame, SCORE_REVEAL_START + 10, 10, 14)
  const scoreGlitch = glitch(frame, SCORE_REVEAL_START + 10)

  const redFlashOp = Math.max(
    redFlashOpacity(frame, SCORE_REVEAL_START + 10),
    redFlashOpacity(frame, SCORE_REVEAL_START + 12),
    0,
  )
  const criticalBlink =
    Math.floor((frame - (SCORE_REVEAL_START + 20)) / 10) % 2 === 0 ? 1 : 0
  const criticalOp = interpolate(
    frame,
    [SCORE_REVEAL_START + 20, SCORE_REVEAL_START + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Heartbeat on score after reveal settles
  const beatStart = SCORE_REVEAL_START + 40
  const beatScale = frame >= beatStart ? heartbeat(frame - beatStart, 28) : 1
  const ring =
    frame >= beatStart
      ? heartbeatRing(frame - beatStart, 28)
      : { scale: 1, opacity: 0 }

  // Fact box — appears earlier (step 1 already landing)
  const factOpacity = interpolate(frame, [70, 110, 245, 260], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const factY = interpolate(frame, [70, 110], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      <AbsoluteFill
        style={{
          padding: '60px 60px 180px 60px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* TITLE + SPINNER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 120,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <Spinner rotation={spinnerRotation} primary={brand.colors.primary} />
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontWeight: 900,
              fontSize: 64,
              color: brand.colors.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Your store&apos;s{' '}
            <span style={{ color: RED }}>dirty secrets</span>
            <br />
            in 60 seconds…
          </span>
        </div>

        {/* SCAN CONTENT */}
        <div style={{ opacity: scanContentOpacity, marginTop: 80 }}>
          {/* PROGRESS BAR */}
          <div style={{ opacity: progressOpacity, marginBottom: 60 }}>
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
                height: 22,
                background: 'rgba(37, 99, 235, 0.14)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressValue}%`,
                  height: '100%',
                  backgroundImage: `linear-gradient(90deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 50%, ${brand.colors.primary} 100%)`,
                  backgroundSize: '200% 100%',
                  backgroundPosition: `${gradientShift}% 0`,
                  borderRadius: 999,
                  boxShadow: `0 0 ${22 * pulse(frame, 30, 0.7, 1.2)}px rgba(6, 182, 212, 0.55)`,
                }}
              />
            </div>
          </div>

          {/* STEPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {STEPS.map((step, i) => (
              <StepRow
                key={step.label}
                step={step}
                frame={frame}
                dingFrame={DING_FRAMES[i] as number}
              />
            ))}
          </div>
        </div>

        {/* FACT BOX — above the urgency bar, safe zone */}
        <div
          style={{
            position: 'absolute',
            bottom: 220,
            left: 60,
            right: 60,
            opacity: factOpacity,
            transform: `translateY(${factY}px)`,
            background: 'rgba(13, 17, 23, 0.88)',
            border: `1px solid ${brand.colors.border}`,
            borderRadius: 20,
            padding: '28px 32px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 22,
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
              fontSize: 30,
              fontWeight: 600,
              color: brand.colors.textPrimary,
              lineHeight: 1.35,
            }}
          >
            {FACT}
          </div>
        </div>
      </AbsoluteFill>

      {/* SCORE REVEAL (260-360) */}
      {frame >= SCORE_REVEAL_START && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 140,
            opacity: scoreOpacity,
            transform: `translate(${scoreShake.x}px, ${scoreShake.y}px)`,
            clipPath: scoreGlitch.clip,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 44,
              transform: `scale(${scoreScale})`,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontWeight: 700,
                fontSize: 34,
                color: brand.colors.textSecondary,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Your Store Score
            </span>
            <div
              style={{
                position: 'relative',
                transform: `scale(${2.5 * beatScale})`,
                transformOrigin: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: `3px solid ${RED}`,
                  transform: `scale(${ring.scale})`,
                  opacity: ring.opacity,
                  pointerEvents: 'none',
                }}
              />
              <ScoreCircle
                score={SCORE}
                startFrame={SCORE_REVEAL_START + 10}
                duration={25}
              />
            </div>
            <div
              style={{
                opacity: criticalOp * criticalBlink,
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 36,
                fontWeight: 900,
                color: RED,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textShadow: '0 0 24px rgba(220, 38, 38, 0.6)',
                lineHeight: 1.2,
              }}
            >
              CRITICAL
              <br />
              IMMEDIATE ACTION REQUIRED
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* White completion flash */}
      <AbsoluteFill
        style={{
          background: brand.colors.white,
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Red flash on score reveal */}
      <AbsoluteFill
        style={{
          background: RED,
          opacity: redFlashOp,
          pointerEvents: 'none',
        }}
      />

      <LiveLossCounter frame={frame} />
      <UrgencyBar frame={frame} />
    </AbsoluteFill>
  )
}
