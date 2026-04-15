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
import { StoreMDBackground } from '../components/StoreMDBackground'
import { ScoreCircle, getScoreStroke } from '../components/ScoreCircle'
import { IssueCard } from '../components/IssueCard'
import {
  GREEN,
  RED,
  SLAM_SPRING,
  formatDollarsCents,
  glitch,
  liveLoss,
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Constants ────────────────────────────────────────────────────────────────

const URL = 'storemd.app/scan'

const CATEGORIES: ReadonlyArray<{ label: string; score: number }> = [
  { label: 'Performance', score: 85 },
  { label: 'Apps Health', score: 60 },
  { label: 'Listings', score: 40 },
  { label: 'AI Ready', score: 35 },
  { label: 'Accessibility', score: 78 },
]

const SCAN_START = 120
const CTA_START = 750
const CRITICAL_SCORE_THRESHOLD = 50

const CAT_START = 170
const CAT_GAP = 22
const CAT_REVEAL_FRAMES = CATEGORIES.map((_, i) => CAT_START + i * CAT_GAP + 18)

// ─── Live-loss counter (persistent, top-right) ───────────────────────────────

const LiveLossCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const op = interpolate(frame, [SCAN_START, SCAN_START + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Begin counting once the scan phase begins.
  const value = liveLoss(Math.max(0, frame - SCAN_START), 0.04)
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 52,
        opacity: op,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
        padding: '14px 20px',
        background: 'rgba(13, 17, 23, 0.85)',
        border: `1px solid rgba(220, 38, 38, 0.5)`,
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 14,
          color: brand.colors.textMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Since you started watching:
      </span>
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 28,
          fontWeight: 900,
          color: RED,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 14px rgba(220, 38, 38, 0.55)',
        }}
      >
        {formatDollarsCents(value)}
      </span>
    </div>
  )
}

// ─── Recovery counter (green, top-left during issue phase) ───────────────────

const RecoveryCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const start = 400
  const op = interpolate(frame, [start, start + 25, CTA_START - 20, CTA_START], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 52,
        opacity: op,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        padding: '14px 20px',
        background: 'rgba(13, 17, 23, 0.85)',
        border: `1px solid rgba(22, 163, 74, 0.5)`,
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 14,
          color: brand.colors.textMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Recovered if fixed today:
      </span>
      <span
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 28,
          fontWeight: 900,
          color: GREEN,
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 14px rgba(22, 163, 74, 0.55)',
        }}
      >
        +$329/mo
      </span>
    </div>
  )
}

// ─── URL bar (fast) ───────────────────────────────────────────────────────────

const UrlBar: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand

  const op = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const chars = Math.floor(
    interpolate(frame, [0, 17], [0, URL.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const cursorOn = Math.floor(frame * 0.4) % 2 === 0
  const showCursor = chars < URL.length && cursorOn

  return (
    <div
      style={{
        opacity: op,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 26px',
        background: 'rgba(13, 17, 23, 0.85)',
        border: `1px solid rgba(6, 182, 212, 0.28)`,
        borderRadius: 14,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: storeMdScoreColors.excellent,
          boxShadow: '0 0 12px rgba(22, 163, 74, 0.85)',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 28,
          color: brand.colors.accent,
          letterSpacing: '0.02em',
          flex: 1,
        }}
      >
        {URL.slice(0, chars)}
        {showCursor ? '|' : ''}
      </div>
      <div
        style={{
          fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
          fontSize: 22,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.white,
          background: brand.colors.primary,
          padding: '12px 32px',
          borderRadius: 10,
          boxShadow:
            '0 0 22px rgba(37, 99, 235, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35)',
          letterSpacing: '-0.01em',
          flexShrink: 0,
        }}
      >
        Scan
      </div>
    </div>
  )
}

// ─── Category bar with FAILING tag + Top-stores reference ────────────────────

const CategoryBar: React.FC<{
  label: string
  score: number
  startFrame: number
  frame: number
  fps: number
}> = ({ label, score, startFrame, frame, fps }) => {
  const brand = storeMdBrand
  const color = getScoreStroke(score)
  const isFailing = score < CRITICAL_SCORE_THRESHOLD

  const slam = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })
  const opacity = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fillWidth = interpolate(
    frame,
    [startFrame + 4, startFrame + 32],
    [0, score],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const topMarkOp = interpolate(
    frame,
    [startFrame + 28, startFrame + 42],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const failingOp = isFailing
    ? interpolate(frame, [startFrame + 32, startFrame + 42], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0
  const failingBlink = isFailing
    ? Math.floor(frame / 8) % 2 === 0 ? 1 : 0.35
    : 1

  return (
    <div
      style={{
        opacity,
        transform: `scale(${slam})`,
        transformOrigin: 'left center',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 200,
          flexShrink: 0,
          fontFamily: `'${brand.typography.fontBody}', sans-serif`,
          fontSize: 22,
          fontWeight: brand.typography.weightMedium,
          color: brand.colors.textSecondary,
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 12,
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 999,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${fillWidth}%`,
            height: '100%',
            background: color,
            boxShadow: `0 0 10px ${color}80`,
            borderRadius: 999,
          }}
        />
        {/* Top-stores reference marker (at 92%) */}
        <div
          style={{
            position: 'absolute',
            top: -4,
            bottom: -4,
            left: `92%`,
            width: 3,
            background: GREEN,
            opacity: topMarkOp,
            boxShadow: `0 0 6px ${GREEN}`,
          }}
        />
      </div>
      <div
        style={{
          width: 56,
          flexShrink: 0,
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 22,
          fontWeight: brand.typography.weightBold,
          color,
          textAlign: 'right',
        }}
      >
        {Math.round(fillWidth)}
      </div>
      {/* FAILING tag for low scores */}
      <div
        style={{
          width: 110,
          flexShrink: 0,
          opacity: failingOp * failingBlink,
          fontFamily: `'${brand.typography.fontMono}', monospace`,
          fontSize: 14,
          fontWeight: 900,
          color: RED,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textShadow: '0 0 8px rgba(220, 38, 38, 0.6)',
          textAlign: 'left',
        }}
      >
        {isFailing ? 'FAILING' : ''}
      </div>
    </div>
  )
}

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
          right: 52,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 72,
            width: 72,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────

export const SMDProductDemo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // ── PHASE 1: Hook timing ──
  // 0-15: black silence
  // 15-30: small gray pre-title
  // 40: SLAM $2,100 with glitch + shake
  // 55: "/month" slides from right
  // 70: "in invisible costs" fades in
  // 90-93: HARD CUT (everything drops in 4 frames)
  // 94-120: "Yours is probably worse." SLAM, then CUT.
  const preTitleOp = interpolate(frame, [15, 30, 85, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const moneySlam = spring({
    frame: Math.max(0, frame - 40),
    fps,
    from: 1.4,
    to: 1,
    config: SLAM_SPRING,
  })
  const moneyOp = interpolate(frame, [40, 48, 85, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const moneyShake = shake(frame, 40, 10, 12)
  const moneyGlitch = glitch(frame, 40)

  const monthOp = interpolate(frame, [55, 65, 85, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const monthX = interpolate(frame, [55, 65], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const subOp = interpolate(frame, [70, 82, 85, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const yoursSlam = spring({
    frame: Math.max(0, frame - 94),
    fps,
    from: 1.5,
    to: 1,
    config: SLAM_SPRING,
  })
  const yoursOp = interpolate(frame, [94, 100, 116, 120], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── PHASE 2 + 3 ──
  const contentOp = interpolate(
    frame,
    [SCAN_START - 3, SCAN_START, SCAN_START + 8],
    [0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const scoreCardOp = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const zoomStep = 1 + 0.015 * Math.sin((frame - SCAN_START) / 40)

  // "Let's expose the damage." cyan mono caption
  const damageOp = interpolate(
    frame,
    [SCAN_START + 4, SCAN_START + 20, 380, 395],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // WARNING title reveal
  const WARNING_TITLE_START = 380
  const WARNING = 'WARNING: 2 CRITICAL PROBLEMS FOUND'
  const warnChars = Math.floor(
    interpolate(
      frame,
      [WARNING_TITLE_START, WARNING_TITLE_START + 22],
      [0, WARNING.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )
  const warningSlam = spring({
    frame: Math.max(0, frame - WARNING_TITLE_START),
    fps,
    from: 1.2,
    to: 1,
    config: SLAM_SPRING,
  })
  const warningOp = interpolate(
    frame,
    [WARNING_TITLE_START, WARNING_TITLE_START + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Issue cards
  const ISSUE_1_START = 420
  const ISSUE_2_START = 490
  const issue1Slide = spring({
    frame: Math.max(0, frame - ISSUE_1_START),
    fps,
    from: 1,
    to: 0,
    config: brand.motion.springSnappy,
  })
  const issue1X = issue1Slide * 600
  const issue1Op = interpolate(
    frame,
    [ISSUE_1_START, ISSUE_1_START + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const issue2Slide = spring({
    frame: Math.max(0, frame - ISSUE_2_START),
    fps,
    from: 1,
    to: 0,
    config: brand.motion.springSnappy,
  })
  const issue2X = -issue2Slide * 600
  const issue2Op = interpolate(
    frame,
    [ISSUE_2_START, ISSUE_2_START + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Pulsing $282 cumulative tag
  const wastedPulse = pulse(frame, 36, 0.82, 1.08)
  const wastedOp = interpolate(
    frame,
    [ISSUE_1_START + 20, ISSUE_1_START + 35],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── PHASE 4: CTA ──
  const scanFade = interpolate(frame, [CTA_START - 30, CTA_START], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  // Fast-pulsing CTA button (period 20).
  const ctaGlow = pulse(frame, 20, 0.55, 1.35)

  // ── Red flashes on low-score reveals ──
  const criticalFlashFrames: number[] = CATEGORIES.flatMap((cat, i) =>
    cat.score < CRITICAL_SCORE_THRESHOLD ? [CAT_REVEAL_FRAMES[i] as number] : [],
  )
  const flashOp = Math.max(
    ...criticalFlashFrames.map((f) => redFlashOpacity(frame, f)),
    0,
  )
  const scanShake = criticalFlashFrames.reduce(
    (acc, f) => {
      const s = shake(frame, f, 5, 7)
      return { x: acc.x + s.x, y: acc.y + s.y }
    },
    { x: 0, y: 0 },
  )

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      {/* ═════════ PHASE 1 — HOOK ═════════ */}
      {/* Pre-title in gray */}
      <AbsoluteFill
        style={{
          opacity: preTitleOp,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 260,
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 36,
            fontWeight: 600,
            color: brand.colors.textMuted,
            letterSpacing: '0.04em',
            textAlign: 'center',
          }}
        >
          the average Shopify store loses…
        </div>
      </AbsoluteFill>

      {/* BIG RED NUMBER */}
      <AbsoluteFill
        style={{
          opacity: moneyOp,
          transform: `translate(${moneyShake.x}px, ${moneyShake.y}px) scale(${moneySlam})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath: moneyGlitch.clip,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
          }}
        >
          {/* RGB split ghosts */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${moneyGlitch.redShift}px)`,
              color: 'rgba(220, 38, 38, 0.65)',
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 280,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          >
            <span>$2,100</span>
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${moneyGlitch.blueShift}px)`,
              color: 'rgba(6, 182, 212, 0.55)',
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 280,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          >
            <span>$2,100</span>
          </div>
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 280,
              fontWeight: 900,
              color: RED,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              textShadow: '0 0 60px rgba(220, 38, 38, 0.65), 0 0 30px rgba(220, 38, 38, 0.4)',
            }}
          >
            $2,100
          </span>
          <span
            style={{
              opacity: monthOp,
              transform: `translateX(${monthX}px)`,
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 80,
              fontWeight: 800,
              color: brand.colors.white,
              letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
            }}
          >
            /month
          </span>
        </div>
      </AbsoluteFill>

      {/* Subtitle "in invisible costs" */}
      <AbsoluteFill
        style={{
          opacity: subOp,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 280,
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 42,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}
        >
          in invisible costs
        </div>
      </AbsoluteFill>

      {/* "Yours is probably worse." SLAM */}
      <AbsoluteFill
        style={{
          opacity: yoursOp,
          transform: `scale(${yoursSlam})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 140,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            textAlign: 'center',
            textShadow: '0 0 50px rgba(220, 38, 38, 0.45)',
          }}
        >
          Yours is{' '}
          <span style={{ color: RED }}>probably worse.</span>
        </div>
      </AbsoluteFill>

      {/* ═════════ PHASE 2 + 3 — SCAN + RESULTS ═════════ */}
      <AbsoluteFill
        style={{
          opacity: contentOp * scanFade,
          transform: `translate(${scanShake.x}px, ${scanShake.y}px) scale(${zoomStep})`,
          padding: '64px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          justifyContent: 'center',
        }}
      >
        {/* "Let's expose the damage." caption */}
        <div
          style={{
            opacity: damageOp,
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 22,
            fontWeight: 700,
            color: brand.colors.accent,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(6, 182, 212, 0.45)',
          }}
        >
          Let&apos;s expose the damage.
        </div>

        {/* URL bar */}
        <UrlBar frame={Math.max(0, frame - SCAN_START)} />

        {/* Score card */}
        <div
          style={{
            opacity: scoreCardOp,
            background: 'rgba(13, 17, 23, 0.85)',
            border: `1px solid ${brand.colors.border}`,
            borderRadius: 18,
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            gap: 56,
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
              <ScoreCircle score={72} startFrame={280} duration={60} />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 14,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.colors.accent,
                marginBottom: 4,
              }}
            >
              <span>Category Breakdown</span>
              <span style={{ color: GREEN }}>│ Top stores: 92</span>
            </div>
            {CATEGORIES.map((cat, i) => (
              <CategoryBar
                key={cat.label}
                label={cat.label}
                score={cat.score}
                startFrame={CAT_START + i * CAT_GAP}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>
        </div>

        {/* WARNING title */}
        <div
          style={{
            opacity: warningOp,
            transform: `scale(${warningSlam})`,
            transformOrigin: 'left center',
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 36,
            fontWeight: 900,
            color: RED,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(220, 38, 38, 0.65)',
          }}
        >
          {WARNING.slice(0, warnChars)}
        </div>

        {/* Issue cards */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              opacity: issue1Op,
              transform: `translateX(${issue1X}px)`,
              marginBottom: 14,
              position: 'relative',
            }}
          >
            <IssueCard
              severity="critical"
              title="3 apps billing for 6 months after uninstall"
              impact="$47/mo × 6 months = $282 wasted. Still charging your card right now."
              autoFixable
              frame={frame - ISSUE_1_START}
            />
            <div
              style={{
                position: 'absolute',
                top: -18,
                right: 20,
                opacity: wastedOp,
                transform: `scale(${wastedPulse})`,
                background: RED,
                color: brand.colors.white,
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 20,
                fontWeight: 900,
                padding: '10px 18px',
                borderRadius: 10,
                letterSpacing: '-0.01em',
                boxShadow:
                  '0 0 24px rgba(220, 38, 38, 0.7), 0 4px 14px rgba(0, 0, 0, 0.45)',
              }}
            >
              $282 WASTED
            </div>
          </div>

          <div
            style={{
              opacity: issue2Op,
              transform: `translateX(${issue2X}px)`,
            }}
          >
            <IssueCard
              severity="major"
              title="14 products INVISIBLE to Google"
              impact="That's 14 products that don't exist for 68% of shoppers."
              frame={frame - ISSUE_2_START}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Live-loss counter (top-right, persistent through scan+issues) */}
      {frame >= SCAN_START && frame < CTA_START && (
        <LiveLossCounter frame={frame} />
      )}

      {/* Recovery counter (top-left, appears during issues) */}
      <RecoveryCounter frame={frame} />

      {/* Red flash overlay */}
      <AbsoluteFill
        style={{
          background: RED,
          opacity: flashOp,
          pointerEvents: 'none',
        }}
      />

      {/* ═════════ PHASE 4 — CTA ═════════ */}
      <AbsoluteFill
        style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 44,
          padding: '0 140px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 96,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            textAlign: 'center',
            maxWidth: 1500,
          }}
        >
          Every day you wait costs you{' '}
          <span style={{ color: RED }}>$70.</span>
        </div>

        <div
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 32,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            letterSpacing: '-0.005em',
            textAlign: 'center',
            maxWidth: 1300,
          }}
        >
          2,847 stores already scanned. Average score:{' '}
          <span style={{ color: RED, fontWeight: 900 }}>41</span>.{' '}
          <span style={{ color: brand.colors.white, fontWeight: 700 }}>
            You&apos;re not special.
          </span>
        </div>

        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 44,
            fontWeight: 900,
            color: brand.colors.white,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '28px 74px',
            borderRadius: 16,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '0.02em',
          }}
        >
          SCAN FREE NOW
        </div>

        <div
          style={{
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 20,
            color: brand.colors.textMuted,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          60 seconds · No credit card · No BS
        </div>
      </AbsoluteFill>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
