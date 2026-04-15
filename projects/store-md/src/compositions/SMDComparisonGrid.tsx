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
import { evolvePath } from '@remotion/paths'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'
import { RED, SLAM_SPRING, pulse } from '../utils/aggressive'

type Row = { bad: string; good: string }

const ROWS: Row[] = [
  { bad: 'Guessing', good: 'Knowing — score /100' },
  { bad: '$2,100/mo in hidden costs', good: '$0 — all detected and fixed' },
  { bad: '4.1s load time', good: '1.8s — 53% more visitors' },
  { bad: 'Invisible to AI shopping', good: '100% AI-ready' },
  { bad: 'Hoping for the best', good: 'Monitored 24/7' },
]

const CHECKMARK_PATH = 'M5 12 L10 17 L19 7'

const HEADER_START = 0
const ROWS_START = 30
const ROW_STAGGER = 20
const CTA_START = 180

// ─── Logo overlay ─────────────────────────────────────────────────────────────

const SMDLogoOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const opacity = interpolate(frame, [CTA_START, CTA_START + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 32,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 54,
            width: 54,
            borderRadius: 12,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Row pair ─────────────────────────────────────────────────────────────────

const ComparisonRow: React.FC<{
  row: Row
  startFrame: number
  frame: number
  fps: number
}> = ({ row, startFrame, frame, fps }) => {
  const brand = storeMdBrand

  const badEnter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 1,
    to: 0,
    config: brand.motion.springSnappy,
  })
  const goodEnter = spring({
    frame: Math.max(0, frame - startFrame - 4),
    fps,
    from: 1,
    to: 0,
    config: brand.motion.springSnappy,
  })
  const op = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Animate the green check via evolvePath
  const checkProgress = interpolate(
    frame,
    [startFrame + 8, startFrame + 24],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    checkProgress,
    CHECKMARK_PATH,
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        opacity: op,
      }}
    >
      {/* BAD side */}
      <div
        style={{
          transform: `translateX(${badEnter * -32}px)`,
          background: 'rgba(220, 38, 38, 0.12)',
          border: `1px solid rgba(220, 38, 38, 0.4)`,
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: RED,
            fontWeight: 900,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </span>
        <span
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 22,
            fontWeight: 700,
            color: '#fecaca',
            letterSpacing: '-0.005em',
            lineHeight: 1.25,
          }}
        >
          {row.bad}
        </span>
      </div>

      {/* GOOD side */}
      <div
        style={{
          transform: `translateX(${goodEnter * 32}px)`,
          background: 'rgba(22, 163, 74, 0.14)',
          border: `1px solid rgba(22, 163, 74, 0.45)`,
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <svg
          width={26}
          height={26}
          viewBox="0 0 24 24"
          style={{ flexShrink: 0 }}
        >
          <path
            d={CHECKMARK_PATH}
            fill="none"
            stroke={storeMdScoreColors.excellent}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 22,
            fontWeight: 700,
            color: '#bbf7d0',
            letterSpacing: '-0.005em',
            lineHeight: 1.25,
          }}
        >
          {row.good}
        </span>
      </div>
    </div>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDComparisonGrid: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Headers
  const headerOp = interpolate(
    frame,
    [HEADER_START, HEADER_START + 15, CTA_START - 8, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const headerY = interpolate(frame, [HEADER_START, HEADER_START + 20], [-16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Grid container
  const gridOp = interpolate(
    frame,
    [ROWS_START - 5, ROWS_START + 10, CTA_START - 8, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)
  const ctaSlam = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })

  return (
    <AbsoluteFill style={{ background: brand.colors.background, overflow: 'hidden' }}>
      {/* Subtle dotted grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(37, 99, 235, 0.06) 1px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          padding: '64px 40px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Headers */}
        <div
          style={{
            opacity: headerOp,
            transform: `translateY(${headerY}px)`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}
        >
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.18)',
              border: `2px solid ${RED}`,
              borderRadius: 14,
              padding: '16px 18px',
              textAlign: 'center',
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 22,
              fontWeight: 900,
              color: RED,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(220, 38, 38, 0.55)',
            }}
          >
            Without StoreMD
          </div>
          <div
            style={{
              background: 'rgba(22, 163, 74, 0.2)',
              border: `2px solid ${storeMdScoreColors.excellent}`,
              borderRadius: 14,
              padding: '16px 18px',
              textAlign: 'center',
              fontFamily: `'${brand.typography.fontMono}', monospace`,
              fontSize: 22,
              fontWeight: 900,
              color: storeMdScoreColors.excellent,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(22, 163, 74, 0.55)',
            }}
          >
            With StoreMD
          </div>
        </div>

        {/* Rows */}
        <div
          style={{
            opacity: gridOp,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {ROWS.map((row, i) => (
            <ComparisonRow
              key={i}
              row={row}
              startFrame={ROWS_START + i * ROW_STAGGER}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill
        style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 50px',
          background: 'rgba(5, 5, 7, 0.92)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            transform: `scale(${ctaSlam})`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 62,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            textAlign: 'center',
          }}
        >
          Which column
          <br />
          are <span style={{ color: RED }}>you</span> in?
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 28,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            textAlign: 'center',
            letterSpacing: '-0.005em',
          }}
        >
          Scan free to find out.
        </div>
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 40,
            fontWeight: 900,
            color: brand.colors.white,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '22px 50px',
            borderRadius: 16,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
          }}
        >
          Scan my store →
        </div>
      </AbsoluteFill>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
