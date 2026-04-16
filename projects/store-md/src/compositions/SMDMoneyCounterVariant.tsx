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
import {
  SMDLogoOverlay,
  SMDUrgencyBar,
  SMDLiveLossCounter,
} from '../components/SMDOverlays'
import {
  RED,
  SLAM_SPRING,
  formatDollarsCents,
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type MoneyMilestone = {
  threshold: number
  label: string
}

export type SMDMoneyCounterVariantProps = {
  introText: string
  targetAmount: number
  prefix: string
  unit: string
  milestones: ReadonlyArray<MoneyMilestone>
  finalMessage: string
  ctaText: string
}

// ─── Timings (30fps, 360 frames = 12s) ───────────────────────────────────────

const INTRO_START = 2
const INTRO_CHAR_RATE = 0.75
const COUNTER_START = 40
const COUNTER_END = 220 // 180-frame ramp (6 seconds)
const FREEZE_START = 220
const FINAL_MSG_START = 250
const CTA_START = 310
const MILESTONE_DWELL = 35 // minimum frames a milestone label stays visible

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatValue = (value: number, prefix: string, unit: string): string => {
  if (prefix === '$') {
    if (unit === '/day' || unit === '/year' || unit === '') {
      return `$${Math.round(value).toLocaleString('en-US')}`
    }
    return formatDollarsCents(value)
  }
  return `${Math.round(value)}`
}

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDMoneyCounterVariant: React.FC<SMDMoneyCounterVariantProps> = ({
  introText,
  targetAmount,
  prefix,
  unit,
  milestones,
  finalMessage,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Intro typewriter
  const introChars = Math.floor(Math.max(0, (frame - INTRO_START) * INTRO_CHAR_RATE))
  const introDisplay = introText.slice(0, Math.min(introChars, introText.length))
  const introOp = interpolate(
    frame,
    [INTRO_START, INTRO_START + 12, COUNTER_START - 5, COUNTER_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Counter ramp (ease-in)
  const counterT = interpolate(
    frame,
    [COUNTER_START, COUNTER_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const easedT = counterT * counterT
  const counterValue = easedT * targetAmount

  const counterOp = interpolate(
    frame,
    [COUNTER_START - 5, COUNTER_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const frozenPulse = frame >= FREEZE_START ? pulse(frame, 20, 0.98, 1.04) : 1

  // Active milestone with dwell time — each label stays visible at least
  // MILESTONE_DWELL frames before being replaced, with 8-frame fade transition.
  const boundaryFrames = milestones.slice(1).map((m) => {
    const ratio = m.threshold / targetAmount
    const t = Math.sqrt(ratio)
    return Math.round(COUNTER_START + t * (COUNTER_END - COUNTER_START))
  })

  // Determine which milestone SHOULD be active based on counter value
  let rawMilestoneIdx = 0
  for (let i = 0; i < milestones.length; i++) {
    if (counterValue >= (milestones[i] as MoneyMilestone).threshold) rawMilestoneIdx = i
  }

  // Apply dwell: a milestone won't change until MILESTONE_DWELL frames after it
  // was first triggered. Track the frame at which each milestone was first reached.
  let activeMilestoneIdx = 0
  for (let i = 0; i < boundaryFrames.length; i++) {
    const hitFrame = boundaryFrames[i] as number
    if (frame >= hitFrame + MILESTONE_DWELL) {
      activeMilestoneIdx = i + 1
    } else if (frame >= hitFrame) {
      // Within dwell period — stay on current milestone
      break
    }
  }
  activeMilestoneIdx = Math.min(activeMilestoneIdx, milestones.length - 1)
  const activeLabel = (milestones[activeMilestoneIdx] as MoneyMilestone).label

  // Fade between milestones: 8-frame crossfade at each boundary
  let milestoneFade = 1
  for (const bf of boundaryFrames) {
    if (frame >= bf && frame < bf + 8) {
      milestoneFade = interpolate(frame, [bf, bf + 8], [0.3, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    }
  }

  const boundaryShake = boundaryFrames.reduce(
    (acc, f) => {
      const s = shake(frame, f, 6, 8)
      return { x: acc.x + s.x, y: acc.y + s.y }
    },
    { x: 0, y: 0 },
  )
  const boundaryFlash = boundaryFrames.reduce(
    (acc, f) => Math.max(acc, redFlashOpacity(frame, f)),
    0,
  )

  // Milestone label opacity
  const milestoneOp = interpolate(
    frame,
    [COUNTER_START, COUNTER_START + 20, FINAL_MSG_START - 8, FINAL_MSG_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Final message SLAM
  const finalSlam = spring({
    frame: Math.max(0, frame - FINAL_MSG_START),
    fps,
    from: 1.4,
    to: 1,
    config: SLAM_SPRING,
  })
  const finalOp = interpolate(
    frame,
    [FINAL_MSG_START, FINAL_MSG_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const finalShake = shake(frame, FINAL_MSG_START + 2, 8, 10)

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* Red radial glow during counter */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.12) 0%, transparent 60%)',
          opacity:
            frame >= COUNTER_START && frame < CTA_START
              ? pulse(frame, 60, 0.5, 1)
              : 0,
          pointerEvents: 'none',
        }}
      />

      {/* Live-loss counter (monetary hooks only) */}
      {prefix === '$' && <SMDLiveLossCounter />}

      {/* INTRO (typewriter) */}
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: introOp,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 42,
            fontWeight: 700,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.015em',
            lineHeight: 1.25,
          }}
        >
          {introDisplay}
        </span>
      </div>

      {/* COUNTER */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          opacity: counterOp,
          transform: `translate(${boundaryShake.x}px, ${boundaryShake.y}px) scale(${frozenPulse})`,
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 110,
            fontWeight: 900,
            color: RED,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center',
            textShadow:
              '0 0 60px rgba(220, 38, 38, 0.7), 0 0 30px rgba(220, 38, 38, 0.5)',
          }}
        >
          {prefix === '$' ? '' : prefix}
          {formatValue(counterValue, prefix, unit)}
          <span style={{ fontSize: 48, color: brand.colors.textSecondary }}>
            {unit}
          </span>
        </div>
      </div>

      {/* MILESTONE LABEL */}
      <div
        style={{
          position: 'absolute',
          top: 780,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: milestoneOp * milestoneFade,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 26,
            fontWeight: 800,
            color: '#fca5a5',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(220, 38, 38, 0.45)',
          }}
        >
          {activeLabel}
        </span>
      </div>

      {/* FINAL MESSAGE SLAM */}
      <div
        style={{
          position: 'absolute',
          top: 920,
          left: 50,
          right: 50,
          textAlign: 'center',
          opacity: finalOp,
          transform: `translate(${finalShake.x}px, ${finalShake.y}px) scale(${finalSlam})`,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 52,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            textShadow: '0 0 40px rgba(220, 38, 38, 0.45)',
          }}
        >
          {finalMessage}
        </span>
      </div>

      {/* BOUNDARY RED FLASH */}
      <AbsoluteFill
        style={{ background: RED, opacity: boundaryFlash, pointerEvents: 'none' }}
      />

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          top: 1340,
          left: 40,
          right: 40,
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 42,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '22px 48px',
            borderRadius: 18,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
          }}
        >
          {ctaText}
        </div>
      </div>

      <SMDUrgencyBar />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
