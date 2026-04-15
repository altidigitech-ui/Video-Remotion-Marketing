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
  liveLoss,
  pulse,
  redFlashOpacity,
  shake,
} from '../utils/aggressive'

// ─── Constants ────────────────────────────────────────────────────────────────
// 18s @ 60fps = 1080 frames total.
//   Hook  : 0   → 200   (money block 0-100, "Yours is probably worse." 100-200)
//   Scan  : 200 → 830
//   CTA   : 830 → 1080

const URL = 'storemd.app/scan'

const CATEGORIES: ReadonlyArray<{ label: string; score: number }> = [
  { label: 'Performance', score: 85 },
  { label: 'Apps Health', score: 60 },
  { label: 'Listings', score: 40 },
  { label: 'AI Ready', score: 35 },
  { label: 'Accessibility', score: 78 },
]

const HOOK_BLOCK_END = 100
const HOOK_YOURS_START = 100
const SCAN_START = 200
const CTA_START = 830
const CRITICAL_SCORE_THRESHOLD = 50

const CAT_START = SCAN_START + 50
const CAT_GAP = 22
const CAT_REVEAL_FRAMES = CATEGORIES.map((_, i) => CAT_START + i * CAT_GAP + 18)

const WARNING_TITLE_START = SCAN_START + 260
const ISSUE_1_START = SCAN_START + 300
const ISSUE_2_START = SCAN_START + 370
const RECOVERY_START = SCAN_START + 280

// ─── Live-loss counter (persistent, top-right) ───────────────────────────────

const LiveLossCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const op = interpolate(frame, [SCAN_START, SCAN_START + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
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

const RecoveryCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const op = interpolate(
    frame,
    [RECOVERY_START, RECOVERY_START + 25, CTA_START - 20, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
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

// ─── URL bar (fast typewriter) ───────────────────────────────────────────────

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

// ─── Category bar ─────────────────────────────────────────────────────────────

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
    ? Math.floor(frame / 8) % 2 === 0
      ? 1
      : 0.35
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

  // ── PHASE 1a: centered money block (0-100) ──
  const moneyBlockOp = interpolate(frame, [8, 20, 85, 95], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Line 1: "the average Shopify store loses..."
  const line1Op = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Line 2: "$2,100" SLAM scale + shake
  const moneySlam = spring({
    frame: Math.max(0, frame - 20),
    fps,
    from: 1.4,
    to: 1,
    config: SLAM_SPRING,
  })
  const line2Op = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const hookShake = shake(frame, 20, 8, 12)

  // Line 3: "/month" slide up from below
  const line3Op = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const line3Y = interpolate(frame, [40, 55], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Line 4: "in invisible costs" fade in (red .8)
  const line4Op = interpolate(frame, [55, 70], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── PHASE 1b: "Yours is probably worse." (100-200) ──
  const yoursSlam = spring({
    frame: Math.max(0, frame - HOOK_YOURS_START),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })
  const yoursOp = interpolate(
    frame,
    [HOOK_YOURS_START, HOOK_YOURS_START + 8, 190, 200],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── PHASE 2 + 3 ──
  const contentOp = interpolate(
    frame,
    [SCAN_START - 3, SCAN_START, SCAN_START + 8],
    [0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const scoreCardOp = interpolate(
    frame,
    [SCAN_START + 30, SCAN_START + 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const zoomStep = 1 + 0.015 * Math.sin((frame - SCAN_START) / 40)

  // "Let's expose the damage." caption
  const damageOp = interpolate(
    frame,
    [SCAN_START + 4, SCAN_START + 20, WARNING_TITLE_START - 10, WARNING_TITLE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // WARNING typewriter
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
  const ctaGlow = pulse(frame, 20, 0.55, 1.35)

  // Red flashes on low-score reveals
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

      {/* ═════════ PHASE 1a — Centered money block ═════════ */}
      <AbsoluteFill
        style={{
          opacity: moneyBlockOp,
          transform: `translate(${hookShake.x}px, ${hookShake.y}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            opacity: line1Op,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 32,
            fontWeight: 500,
            color: brand.colors.textMuted,
            letterSpacing: '0.02em',
            marginBottom: 20,
          }}
        >
          the average Shopify store loses…
        </div>

        {/* Line 2: $2,100 */}
        <div
          style={{
            opacity: line2Op,
            transform: `scale(${moneySlam})`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 240,
            fontWeight: 900,
            color: RED,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            textShadow:
              '0 0 60px rgba(220, 38, 38, 0.65), 0 0 30px rgba(220, 38, 38, 0.4)',
          }}
        >
          $2,100
        </div>

        {/* Line 3: /month */}
        <div
          style={{
            opacity: line3Op,
            transform: `translateY(${line3Y}px)`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 72,
            fontWeight: 700,
            color: brand.colors.white,
            letterSpacing: '-0.02em',
            marginTop: -10,
          }}
        >
          /month
        </div>

        {/* Line 4: in invisible costs */}
        <div
          style={{
            opacity: line4Op,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 36,
            fontWeight: 500,
            color: RED,
            letterSpacing: '-0.005em',
            marginTop: 20,
          }}
        >
          in invisible costs
        </div>
      </AbsoluteFill>

      {/* ═════════ PHASE 1b — "Yours is probably worse." ═════════ */}
      <AbsoluteFill
        style={{
          opacity: yoursOp,
          transform: `scale(${yoursSlam})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 120px',
          textAlign: 'center',
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
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          justifyContent: 'center',
        }}
      >
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

        <UrlBar frame={Math.max(0, frame - SCAN_START)} />

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
              <ScoreCircle
                score={72}
                startFrame={SCAN_START + 160}
                duration={60}
              />
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

        {/* WARNING typewriter */}
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
              marginBottom: 16,
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

      {/* Live-loss counter */}
      {frame >= SCAN_START && frame < CTA_START && (
        <LiveLossCounter frame={frame} />
      )}

      {/* Recovery counter */}
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
          padding: '80px 140px',
          textAlign: 'center',
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
