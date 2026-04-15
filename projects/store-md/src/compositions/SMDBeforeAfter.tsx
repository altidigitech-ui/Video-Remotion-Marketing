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

// Phase boundaries (30fps, 300-frame composition)
const BEFORE_START = 0
const SPLIT_PULSE_START = 60
const AFTER_START = 90
const SLAM_START = 200
const CTA_START = 240

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

// ─── Issue pill (simplified — for BEFORE side chaos) ─────────────────────────

const IssuePill: React.FC<{
  label: string
  startFrame: number
  frame: number
  exitFrame: number
}> = ({ label, startFrame, frame, exitFrame }) => {
  const op = interpolate(
    frame,
    [startFrame, startFrame + 8, exitFrame, exitFrame + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const y = interpolate(frame, [startFrame, startFrame + 12], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const strike = interpolate(frame, [exitFrame, exitFrame + 15], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'relative',
        opacity: op,
        transform: `translateY(${y}px)`,
        background: 'rgba(220, 38, 38, 0.18)',
        border: `1px solid rgba(220, 38, 38, 0.55)`,
        borderRadius: 10,
        padding: '14px 18px',
        fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
        fontSize: 20,
        fontWeight: 700,
        color: '#fecaca',
        letterSpacing: '-0.005em',
        lineHeight: 1.25,
        overflow: 'hidden',
      }}
    >
      {label}
      {/* Strike-through overlay during exit */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: `${strike}%`,
          height: 3,
          background: storeMdScoreColors.excellent,
          boxShadow: `0 0 10px ${storeMdScoreColors.excellent}`,
        }}
      />
    </div>
  )
}

// ─── BEFORE side ─────────────────────────────────────────────────────────────

const BeforeSide: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand

  const intro = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // BEFORE chaos issues with emoji icons (kept in string for simplicity).
  const ISSUES = [
    '💀 3 ghost apps billing you',
    '🐌 4.1s load (losing 53% of visitors)',
    '🚫 14 products invisible to AI',
    '💸 $2,100/month bleeding out',
  ]

  const beforeShake = shake(frame, 28, 3, 12)

  // Heartbeat on score after initial settle
  const beatStart = 60
  const beatScale = frame >= beatStart ? heartbeat(frame - beatStart, 28) : 1
  const ring =
    frame >= beatStart
      ? heartbeatRing(frame - beatStart, 28)
      : { scale: 1, opacity: 0 }

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        background:
          'linear-gradient(180deg, rgba(220, 38, 38, 0.15) 0%, rgba(139, 17, 17, 0.25) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 40px 40px',
        overflow: 'hidden',
        transform: `translate(${beforeShake.x}px, ${beforeShake.y}px)`,
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: intro,
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 22,
          fontWeight: 900,
          color: RED,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
          marginBottom: 16,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        YOUR STORE
        <br />
        RIGHT NOW
      </div>

      {/* Score 34 (heartbeat + ring) */}
      <div
        style={{
          opacity: intro,
          transform: `scale(${1.35 * beatScale})`,
          marginBottom: 50,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: `3px solid ${RED}`,
            transform: `scale(${ring.scale})`,
            opacity: ring.opacity,
            pointerEvents: 'none',
          }}
        />
        <ScoreCircle
          score={34}
          startFrame={15}
          duration={35}
          from={100}
        />
      </div>

      {/* Chaos issues — stack fast */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          width: '100%',
          maxWidth: 380,
        }}
      >
        {ISSUES.map((label, i) => (
          <IssuePill
            key={label}
            label={label}
            startFrame={30 + i * 8}
            exitFrame={110 + i * 4}
            frame={frame}
          />
        ))}
      </div>
    </div>
  )
}

// ─── AFTER side ──────────────────────────────────────────────────────────────

const AfterSide: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand

  const appear = interpolate(frame, [AFTER_START, AFTER_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Green wins — mirror each BEFORE line
  const WINS = [
    '✅ Ghost billing stopped. $47/mo saved.',
    '⚡ 1.8s load (+53% visitors back)',
    '✅ All products AI-ready',
    '💰 $2,100/month recovered',
  ]

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        background:
          'linear-gradient(180deg, rgba(22, 163, 74, 0.15) 0%, rgba(6, 95, 70, 0.25) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 40px 40px',
        overflow: 'hidden',
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: appear,
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 22,
          fontWeight: 900,
          color: storeMdScoreColors.excellent,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          textShadow: `0 0 20px rgba(22, 163, 74, 0.6)`,
          marginBottom: 16,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        AFTER 60 SECONDS
        <br />
        WITH STOREMD
      </div>

      {/* Score 91 */}
      <div
        style={{
          opacity: appear,
          transform: 'scale(1.35)',
          marginBottom: 50,
        }}
      >
        <ScoreCircle
          score={91}
          startFrame={AFTER_START + 10}
          duration={45}
          from={0}
        />
      </div>

      {/* Wins */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          width: '100%',
          maxWidth: 380,
        }}
      >
        {WINS.map((label, i) => {
          const start = AFTER_START + 60 + i * 10
          const op = interpolate(frame, [start, start + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const y = interpolate(frame, [start, start + 14], [14, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <div
              key={label}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                background: 'rgba(22, 163, 74, 0.18)',
                border: `1px solid rgba(22, 163, 74, 0.55)`,
                borderRadius: 10,
                padding: '14px 18px',
                fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                fontSize: 20,
                fontWeight: 700,
                color: '#bbf7d0',
                letterSpacing: '-0.005em',
                lineHeight: 1.25,
              }}
            >
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDBeforeAfter: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Split line pulse effect
  const splitPulse = pulse(frame, 20, 0.5, 1)
  const splitOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // SLAM text "60 seconds. $0. No excuses."
  const slamScale = spring({
    frame: Math.max(0, frame - SLAM_START),
    fps,
    from: 1.6,
    to: 1,
    config: SLAM_SPRING,
  })
  const slamOp = interpolate(
    frame,
    [SLAM_START, SLAM_START + 8, CTA_START - 10, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const slamShake = shake(frame, SLAM_START + 5, 8, 12)

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
  const ctaGlow = pulse(frame, 30, 0.6, 1.2)

  return (
    <AbsoluteFill style={{ background: brand.colors.background }}>
      {/* Background dotted grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(37, 99, 235, 0.06) 1px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Two-column split */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        <BeforeSide frame={frame} />
        <AfterSide frame={frame} />
      </div>

      {/* Split line divider — 6px white, pulsing */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 6,
          transform: 'translateX(-50%)',
          background: brand.colors.white,
          opacity: splitOp * splitPulse,
          boxShadow: `0 0 ${40 * splitPulse}px rgba(255, 255, 255, ${0.75 * splitPulse}), 0 0 ${80 * splitPulse}px rgba(6, 182, 212, ${0.45 * splitPulse})`,
          pointerEvents: 'none',
        }}
      />

      {/* SLAM text full-screen overlay */}
      <AbsoluteFill
        style={{
          opacity: slamOp,
          transform: `translate(${slamShake.x}px, ${slamShake.y}px) scale(${slamScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 60px',
          background: 'rgba(5, 5, 7, 0.88)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 130,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            textAlign: 'center',
            textShadow: '0 0 50px rgba(220, 38, 38, 0.4)',
          }}
        >
          <span style={{ color: brand.colors.accent }}>60</span> seconds.
          <br />
          <span style={{ color: brand.colors.white }}>$0.</span>
          <br />
          <span style={{ color: RED }}>No excuses.</span>
        </div>
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill
        style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(5, 5, 7, 0.88)',
          backdropFilter: 'blur(6px)',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 44,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 68,
              fontWeight: 900,
              color: brand.colors.white,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              textAlign: 'center',
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
        </div>
      </AbsoluteFill>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
