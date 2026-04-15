import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'
import { ScoreCircle } from '../components/ScoreCircle'
import {
  RED,
  SLAM_SPRING,
  heartbeat,
  heartbeatRing,
  pulse,
  shake,
} from '../utils/aggressive'

// ─── Timings (30fps, 360f composition) ────────────────────────────────────────

const BEFORE_TITLE_START = 0
const BEFORE_SCORE_START = 20
const BEFORE_ISSUES_START = 50 // 4 issues at 50, 70, 90, 110
const SPLIT_PULSE_START = 130
const AFTER_TITLE_START = 150
const AFTER_SCORE_START = 170
const AFTER_WINS_START = 200 // 4 wins at 200, 220, 240, 260
const CTA_START = 320

// ─── Data ─────────────────────────────────────────────────────────────────────

const BEFORE_ISSUES: Array<{ icon: string; text: string }> = [
  { icon: '💀', text: 'Ghost billing: $47/mo' },
  { icon: '🐌', text: 'Load: 4.1s (−53% visitors)' },
  { icon: '🚫', text: '14 products invisible to AI' },
  { icon: '💸', text: '$2,100/mo in hidden costs' },
]

const AFTER_WINS: Array<{ icon: string; text: string }> = [
  { icon: '✅', text: 'Billing fixed: +$47/mo' },
  { icon: '⚡', text: 'Load: 1.8s (+53% visitors)' },
  { icon: '✅', text: 'All products AI-ready' },
  { icon: '💰', text: '$2,100/mo recovered' },
]

// ─── Logo overlay ─────────────────────────────────────────────────────────────

const SMDLogoOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 64,
            width: 64,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Row — emoji icon + text ──────────────────────────────────────────────────

const IssueRow: React.FC<{
  icon: string
  text: string
  startFrame: number
  frame: number
  isAfter: boolean
}> = ({ icon, text, startFrame, frame, isAfter }) => {
  const op = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const x = interpolate(frame, [startFrame, startFrame + 16], [isAfter ? 40 : -40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const bg = isAfter ? 'rgba(22, 163, 74, 0.18)' : 'rgba(220, 38, 38, 0.18)'
  const border = isAfter
    ? '1px solid rgba(22, 163, 74, 0.55)'
    : '1px solid rgba(220, 38, 38, 0.55)'
  const textColor = isAfter ? '#bbf7d0' : '#fecaca'

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: bg,
        border,
        borderRadius: 12,
        padding: '16px 22px',
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
          fontSize: 26,
          fontWeight: 600,
          color: textColor,
          letterSpacing: '-0.005em',
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDBeforeAfter: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // BEFORE title
  const beforeTitleOp = interpolate(
    frame,
    [BEFORE_TITLE_START, BEFORE_TITLE_START + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const beforeTitleY = interpolate(
    frame,
    [BEFORE_TITLE_START, BEFORE_TITLE_START + 20],
    [-16, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // BEFORE score
  const beforeScoreOp = interpolate(
    frame,
    [BEFORE_SCORE_START, BEFORE_SCORE_START + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const beforeBeatStart = BEFORE_SCORE_START + 30
  const beforeBeat =
    frame >= beforeBeatStart
      ? heartbeat(frame - beforeBeatStart, 28)
      : 1
  const beforeRing =
    frame >= beforeBeatStart
      ? heartbeatRing(frame - beforeBeatStart, 28)
      : { scale: 1, opacity: 0 }

  // AFTER title
  const afterTitleOp = interpolate(
    frame,
    [AFTER_TITLE_START, AFTER_TITLE_START + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const afterTitleY = interpolate(
    frame,
    [AFTER_TITLE_START, AFTER_TITLE_START + 20],
    [-16, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // AFTER score
  const afterScoreOp = interpolate(
    frame,
    [AFTER_SCORE_START, AFTER_SCORE_START + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Horizontal split line
  const splitPulse = pulse(frame, 24, 0.55, 1)
  const splitOp = interpolate(
    frame,
    [SPLIT_PULSE_START, SPLIT_PULSE_START + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Subtle shake on the BEFORE zone
  const beforeZoneShake = shake(frame, 30, 3, 14)

  // CTA SLAM
  const slamScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 1.5,
    to: 1,
    config: SLAM_SPRING,
  })
  const slamOp = interpolate(
    frame,
    [CTA_START, CTA_START + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const slamShake = shake(frame, CTA_START + 3, 10, 12)
  const ctaGlow = pulse(frame, 22, 0.6, 1.25)

  return (
    <AbsoluteFill style={{ background: brand.colors.background, overflow: 'hidden' }}>
      {/* Background dotted grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(37, 99, 235, 0.06) 1px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top/bottom split with two flex halves */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ═════════ BEFORE ZONE (top half) ═════════ */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: 'rgba(220, 38, 38, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '60px 50px 40px',
            gap: 28,
            overflow: 'hidden',
            transform: `translate(${beforeZoneShake.x}px, ${beforeZoneShake.y}px)`,
          }}
        >
          {/* Title */}
          <div
            style={{
              opacity: beforeTitleOp,
              transform: `translateY(${beforeTitleY}px)`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 36,
              fontWeight: 900,
              color: RED,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
              textAlign: 'center',
            }}
          >
            Your store now
          </div>

          {/* Score */}
          <div
            style={{
              opacity: beforeScoreOp,
              position: 'relative',
              width: 288,
              height: 288,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                transform: `scale(${1.8 * beforeBeat})`,
                transformOrigin: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: `3px solid ${RED}`,
                  transform: `scale(${beforeRing.scale})`,
                  opacity: beforeRing.opacity,
                  pointerEvents: 'none',
                }}
              />
              <ScoreCircle score={34} startFrame={BEFORE_SCORE_START} duration={35} from={100} />
            </div>
          </div>

          {/* Issues list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              maxWidth: 720,
            }}
          >
            {BEFORE_ISSUES.map((item, i) => (
              <IssueRow
                key={item.text}
                icon={item.icon}
                text={item.text}
                startFrame={BEFORE_ISSUES_START + i * 20}
                frame={frame}
                isAfter={false}
              />
            ))}
          </div>
        </div>

        {/* ═════════ AFTER ZONE (bottom half) ═════════ */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: 'rgba(22, 163, 74, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '60px 50px 40px',
            gap: 28,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              opacity: afterTitleOp,
              transform: `translateY(${afterTitleY}px)`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 36,
              fontWeight: 900,
              color: storeMdScoreColors.excellent,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(22, 163, 74, 0.6)',
              textAlign: 'center',
            }}
          >
            After 60 sec with StoreMD
          </div>

          <div
            style={{
              opacity: afterScoreOp,
              position: 'relative',
              width: 288,
              height: 288,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                transform: 'scale(1.8)',
                transformOrigin: 'center',
                filter: 'drop-shadow(0 0 20px rgba(22, 163, 74, 0.45))',
              }}
            >
              <ScoreCircle score={91} startFrame={AFTER_SCORE_START} duration={35} from={0} />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              maxWidth: 720,
            }}
          >
            {AFTER_WINS.map((item, i) => (
              <IssueRow
                key={item.text}
                icon={item.icon}
                text={item.text}
                startFrame={AFTER_WINS_START + i * 20}
                frame={frame}
                isAfter={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal split line at 50% height (6px, white, pulsing) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 6,
          transform: 'translateY(-50%)',
          background: brand.colors.white,
          opacity: splitOp * splitPulse,
          boxShadow: `0 0 ${40 * splitPulse}px rgba(255, 255, 255, ${0.75 * splitPulse}), 0 0 ${80 * splitPulse}px rgba(6, 182, 212, ${0.45 * splitPulse})`,
          pointerEvents: 'none',
        }}
      />

      {/* CTA SLAM overlay */}
      <AbsoluteFill
        style={{
          opacity: slamOp,
          transform: `translate(${slamShake.x}px, ${slamShake.y}px) scale(${slamScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          padding: '0 60px',
          background: 'rgba(5, 5, 7, 0.92)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 76,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
          }}
        >
          Same store.
          <br />
          60 seconds apart.
          <br />
          <span style={{ color: RED }}>What&apos;s your excuse?</span>
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 48,
            fontWeight: 900,
            color: brand.colors.white,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '26px 54px',
            borderRadius: 18,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
          }}
        >
          Scan free →
        </div>
      </AbsoluteFill>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
