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

// Very low score for maximum drama — triggers heartbeat pulse (score < 40).
const SCORE = 38
const SCORE_REVEAL_START = 200

const FACT =
  'Right now, 3 apps you deleted are still charging your credit card. StoreMD finds them in 60 seconds.'

const CHECKMARK_PATH = 'M5 12 L10 17 L19 7'

type Step = {
  label: string
  start: number
}

const STEPS: Step[] = [
  { label: 'Theme analyzed', start: 30 },
  { label: 'Apps detected', start: 60 },
  { label: 'Products scanned', start: 90 },
  { label: 'Checking app impact', start: 120 },
  { label: 'Detecting residual code', start: 150 },
]

// Each checkmark completes at step.start + 50 — trigger the ding ring there.
const DING_FRAMES = STEPS.map((s) => s.start + 30)

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

// DING ring: expands from the check circle and fades over 14 frames.
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

  const rowOpacity = interpolate(frame, [start, start + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rowY = interpolate(frame, [start, start + 20], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const circleFill = interpolate(frame, [start + 10, start + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

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

// ─── Live-loss counter (persistent, top-right, vertical-sized) ──────────────

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
          fontSize: 12,
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
          fontSize: 22,
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
  const breathe = pulse(frame, 40, 0.85, 1)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: op * breathe,
        background: `linear-gradient(90deg, ${RED} 0%, #ea580c 100%)`,
        padding: '24px 40px',
        textAlign: 'center',
        boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 36,
          fontWeight: 900,
          color: brand.colors.white,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          lineHeight: 1.2,
          display: 'block',
        }}
      >
        2,847 stores scanned · Avg:{' '}
        <span style={{ color: '#fecaca' }}>41/100</span>
        <br />
        <span style={{ fontSize: 28, letterSpacing: '0.04em' }}>
          What&apos;s yours? → link in bio
        </span>
      </span>
    </div>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────

export const SMDScanProgress: React.FC = () => {
  const frame = useCurrentFrame()
  const brand = storeMdBrand

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const spinnerRotation = frame * 9

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
  // Gradient "flow" position for the animated bar.
  const gradientShift = (frame * 2) % 200

  const flashOpacity = interpolate(
    frame,
    [190, 200, 210],
    [0, 0.45, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

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

  // Score reveal — prolonged 14-frame shake + glitch.
  const scoreShake = shake(frame, SCORE_REVEAL_START + 10, 10, 14)
  const scoreGlitch = glitch(frame, SCORE_REVEAL_START + 10)

  // Red flash on score reveal + pulsing CRITICAL tag.
  const redFlashOp = Math.max(
    redFlashOpacity(frame, SCORE_REVEAL_START + 10),
    redFlashOpacity(frame, SCORE_REVEAL_START + 12),
    0,
  )
  // Blinking "CRITICAL — IMMEDIATE ACTION REQUIRED" every 10 frames.
  const criticalBlink =
    Math.floor((frame - (SCORE_REVEAL_START + 20)) / 10) % 2 === 0 ? 1 : 0
  const criticalOp = interpolate(
    frame,
    [SCORE_REVEAL_START + 20, SCORE_REVEAL_START + 28],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Heartbeat on score (runs after initial reveal settles).
  const beatStart = SCORE_REVEAL_START + 40
  const beatScale = frame >= beatStart ? heartbeat(frame - beatStart, 28) : 1
  const ring = frame >= beatStart ? heartbeatRing(frame - beatStart, 28) : { scale: 1, opacity: 0 }

  // Fact box — higher on screen since we now have an urgency bar at the bottom.
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

      <AbsoluteFill
        style={{ padding: 80, display: 'flex', flexDirection: 'column' }}
      >
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
              fontWeight: 900,
              fontSize: 56,
              color: brand.colors.textPrimary,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Your store&apos;s{' '}
            <span style={{ color: RED }}>dirty secrets</span>
            <br /> in 60 seconds…
          </span>
        </div>

        {/* SCAN CONTENT */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
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

        {/* SCORE REVEAL */}
        {frame >= SCORE_REVEAL_START && (
          <AbsoluteFill
            style={{
              alignItems: 'center',
              justifyContent: 'center',
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
                gap: 34,
                transform: `scale(${scoreScale})`,
              }}
            >
              <span
                style={{
                  fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                  fontWeight: 700,
                  fontSize: 32,
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
                {/* Heartbeat expanding ring */}
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
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 24px rgba(220, 38, 38, 0.6)',
                  textAlign: 'center',
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

        {/* FACT BOX */}
        <div
          style={{
            position: 'absolute',
            bottom: 220,
            left: 80,
            right: 80,
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

      {/* Live-loss counter (persistent) */}
      <LiveLossCounter frame={frame} />

      {/* URGENCY BAR — always last before logo */}
      <UrgencyBar frame={frame} />
    </AbsoluteFill>
  )
}
