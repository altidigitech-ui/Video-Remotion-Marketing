import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { evolvePath } from '@remotion/paths'
import { storeMdBrand } from '@altidigitech/brand'
import { ScoreCircle } from '../components/ScoreCircle'
import { IssueCard } from '../components/IssueCard'
import type { IssueSeverity } from '../components/IssueCard'

// ─── Static dashboard data ────────────────────────────────────────────────────

const TABS = ['Health', 'Listings', 'AI Ready', 'Browser', 'Reports']
const ACTIVE_TAB_INDEX = 0

const ISSUES: ReadonlyArray<{
  severity: IssueSeverity
  title: string
  impact: string
  autoFixable?: boolean
}> = [
  {
    severity: 'critical',
    title: '3 apps still billing after uninstall',
    impact: 'Recurring charges drain $47/month from your store profit margin.',
    autoFixable: true,
  },
  {
    severity: 'major',
    title: '14 products missing alt text — SEO impact',
    impact:
      'Search engines cannot index image content; accessibility scoring drops.',
  },
  {
    severity: 'minor',
    title: 'Theme uses deprecated jQuery 1.x',
    impact: 'Will break in the next major Shopify theme platform update.',
  },
]

const TREND_DATA: ReadonlyArray<number> = [62, 65, 64, 68, 67, 70, 72]
const TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const APP_IMPACT: ReadonlyArray<{ name: string; impact: number }> = [
  { name: 'Klaviyo Email', impact: 0.42 },
  { name: 'Yotpo Reviews', impact: 0.31 },
  { name: 'Privy Popup', impact: 0.18 },
]

// ─── Stagger timing — 15-frame cadence between blocks ────────────────────────

const T_SIDEBAR = 0
const T_HEADER = 15
const T_HERO_CARD = 30
const T_HERO_SCORE = 60 // ScoreCircle starts after hero card has settled
const T_ISSUES_TITLE = 150 // after the score-circle reveal completes (~140)
const T_ISSUE_1 = 165
const T_ISSUE_2 = 180
const T_ISSUE_3 = 195
const T_TREND = 240
const T_APP_IMPACT = 285
const T_QUICK_STATS = 300

// ─── Light-theme palette (the StoreMD dashboard uses light slate) ────────────

const C = {
  bg: '#ffffff',
  sidebarBg: '#f8fafc',
  border: '#e2e8f0',
  borderSoft: '#f1f5f9',
  textHeading: '#0f172a',
  textBody: '#475569',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  primary: '#2563eb',
  primaryLight: '#eff6ff',
  trendBg: '#dcfce7',
  trendText: '#15803d',
  critical: '#dc2626',
  surface: '#ffffff',
  cardShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fadeUp = (frame: number, start: number, dur = 30) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
  y: interpolate(frame, [start, start + dur], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
})

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [T_SIDEBAR, T_SIDEBAR + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const x = interpolate(frame, [T_SIDEBAR, T_SIDEBAR + 30], [-20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        background: C.sidebarBg,
        borderRight: `1px solid ${C.border}`,
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          padding: '4px 12px',
          marginBottom: 24,
          fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
          fontSize: 26,
          letterSpacing: '-0.02em',
        }}
      >
        <span style={{ color: C.textFaint, fontWeight: 300 }}>Store</span>
        <span style={{ color: C.textHeading, fontWeight: 800 }}>MD</span>
      </div>

      {TABS.map((tab, i) => {
        const isActive = i === ACTIVE_TAB_INDEX
        return (
          <div
            key={tab}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: isActive ? C.primaryLight : 'transparent',
              color: isActive ? C.primary : C.textMuted,
              fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
              fontSize: 15,
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {tab}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page header ──────────────────────────────────────────────────────────────

const PageHeader: React.FC<{ frame: number }> = ({ frame }) => {
  const { opacity, y } = fadeUp(frame, T_HEADER, 25)
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>
      <div
        style={{
          fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
          fontSize: 36,
          fontWeight: 700,
          color: C.textHeading,
          letterSpacing: '-0.02em',
        }}
      >
        Store Health
      </div>
      <div style={{ fontSize: 16, color: C.textMuted, marginTop: 4 }}>
        Real-time monitoring of your Shopify store performance.
      </div>
    </div>
  )
}

// ─── Score hero card ──────────────────────────────────────────────────────────

const TrendBadge: React.FC<{ frame: number }> = ({ frame }) => {
  // Show after the score has counted up
  const op = interpolate(frame, [T_HERO_SCORE + 60, T_HERO_SCORE + 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        opacity: op,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: C.trendBg,
        color: C.trendText,
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
      }}
    >
      <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 14l5-5 5 5z" />
      </svg>
      +5 since last week
    </div>
  )
}

const DeviceScore: React.FC<{ label: string; score: number }> = ({
  label,
  score,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      style={{
        fontSize: 12,
        color: C.textMuted,
        fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
        fontSize: 26,
        fontWeight: 700,
        color: C.textHeading,
        marginTop: 2,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}
    >
      {score}
      <span style={{ fontSize: 14, color: C.textFaint, fontWeight: 400 }}>
        /100
      </span>
    </div>
  </div>
)

const ScoreHero: React.FC<{ frame: number }> = ({ frame }) => {
  const { opacity, y } = fadeUp(frame, T_HERO_CARD, 30)

  // Counters animate alongside the score circle
  const mobileScore = Math.round(
    interpolate(frame, [T_HERO_SCORE, T_HERO_SCORE + 80], [0, 68], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const desktopScore = Math.round(
    interpolate(frame, [T_HERO_SCORE, T_HERO_SCORE + 80], [0, 76], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const buttonOp = interpolate(
    frame,
    [T_HERO_CARD + 25, T_HERO_CARD + 55],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        boxShadow: C.cardShadow,
      }}
    >
      <ScoreCircle score={72} startFrame={T_HERO_SCORE} duration={80} />

      {/* Center column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
              fontSize: 28,
              fontWeight: 700,
              color: C.textHeading,
              letterSpacing: '-0.01em',
            }}
          >
            Store Health Score
          </span>
          <TrendBadge frame={frame} />
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 4 }}>
          <DeviceScore label="Mobile" score={mobileScore} />
          <DeviceScore label="Desktop" score={desktopScore} />
        </div>

        <div
          style={{
            fontSize: 13,
            color: C.textFaint,
            fontFamily: `'${storeMdBrand.typography.fontMono}', monospace`,
            marginTop: 4,
          }}
        >
          Last scan: 2 minutes ago
        </div>
      </div>

      {/* Scan button */}
      <div
        style={{
          opacity: buttonOp,
          background: C.primary,
          color: '#ffffff',
          fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
          fontSize: 16,
          fontWeight: 600,
          padding: '14px 28px',
          borderRadius: 10,
          boxShadow: '0 1px 3px rgba(37, 99, 235, 0.35), 0 4px 10px rgba(37, 99, 235, 0.18)',
          letterSpacing: '-0.005em',
          flexShrink: 0,
        }}
      >
        Scan now
      </div>
    </div>
  )
}

// ─── Issues list ──────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ title: string; frame: number; startFrame: number }> = ({
  title,
  frame,
  startFrame,
}) => {
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        opacity,
        fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
        fontSize: 20,
        fontWeight: 700,
        color: C.textHeading,
        marginBottom: 4,
      }}
    >
      {title}
    </div>
  )
}

const IssuesList: React.FC<{ frame: number }> = ({ frame }) => {
  // Destructure to satisfy noUncheckedIndexedAccess — array length is fixed at 3
  const [issueOne, issueTwo, issueThree] = ISSUES
  if (!issueOne || !issueTwo || !issueThree) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle title="Issues to fix" frame={frame} startFrame={T_ISSUES_TITLE} />
      <IssueCard {...issueOne} frame={frame - T_ISSUE_1} />
      <IssueCard {...issueTwo} frame={frame - T_ISSUE_2} />
      <IssueCard {...issueThree} frame={frame - T_ISSUE_3} />
    </div>
  )
}

// ─── Trend chart (animated polyline via @remotion/paths) ──────────────────────

const TrendChart: React.FC<{ frame: number }> = ({ frame }) => {
  const { opacity, y } = fadeUp(frame, T_TREND, 30)

  const W = 760
  const H = 140
  const PAD_X = 24
  const PAD_Y = 20

  // Map each score onto the chart area
  const minScore = 50
  const maxScore = 100
  const points = TREND_DATA.map((v, i) => {
    const x = PAD_X + (i / (TREND_DATA.length - 1)) * (W - PAD_X * 2)
    const yPos = PAD_Y + (1 - (v - minScore) / (maxScore - minScore)) * (H - PAD_Y * 2)
    return { x, y: yPos, v }
  })

  // Single-stroke line path for evolvePath
  const linePath = points.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    '',
  )

  // Filled area: line + close down to baseline
  const lastP = points[points.length - 1]!
  const firstP = points[0]!
  const fillPath = `${linePath} L ${lastP.x} ${H - PAD_Y} L ${firstP.x} ${H - PAD_Y} Z`

  const drawProgress = interpolate(
    frame,
    [T_TREND + 10, T_TREND + 70],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const { strokeDasharray, strokeDashoffset } = evolvePath(drawProgress, linePath)

  const fillOp = interpolate(frame, [T_TREND + 60, T_TREND + 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '20px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: C.cardShadow,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div
          style={{
            fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
            fontSize: 18,
            fontWeight: 700,
            color: C.textHeading,
          }}
        >
          Score Trend
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.textFaint,
            fontFamily: `'${storeMdBrand.typography.fontMono}', monospace`,
          }}
        >
          Last 7 days
        </div>
      </div>

      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.primary} stopOpacity="0.18" />
            <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background grid lines */}
        {[0, 0.5, 1].map((p) => (
          <line
            key={p}
            x1={PAD_X}
            y1={PAD_Y + p * (H - PAD_Y * 2)}
            x2={W - PAD_X}
            y2={PAD_Y + p * (H - PAD_Y * 2)}
            stroke={C.borderSoft}
            strokeWidth={1}
          />
        ))}

        {/* Filled area (fades in once line is mostly drawn) */}
        <path d={fillPath} fill="url(#trendFill)" opacity={fillOp} />

        {/* Animated stroke */}
        <path
          d={linePath}
          fill="none"
          stroke={C.primary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Dots — fade in as the stroke passes each point */}
        {points.map((p, i) => {
          const dotStart = T_TREND + 10 + (i / (TREND_DATA.length - 1)) * 60
          const dotOp = interpolate(frame, [dotStart, dotStart + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={C.primary}
              opacity={dotOp}
            />
          )
        })}
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 18px',
          fontSize: 12,
          color: C.textFaint,
          fontFamily: `'${storeMdBrand.typography.fontMono}', monospace`,
        }}
      >
        {TREND_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Bottom grid: App impact + Quick stats ───────────────────────────────────

const AppImpactCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { opacity, y } = fadeUp(frame, T_APP_IMPACT, 30)

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '20px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: C.cardShadow,
      }}
    >
      <div
        style={{
          fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
          fontSize: 18,
          fontWeight: 700,
          color: C.textHeading,
        }}
      >
        App Impact on Speed
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {APP_IMPACT.map((app, i) => {
          const rowStart = T_APP_IMPACT + 30 + i * 12
          const rowOp = interpolate(frame, [rowStart, rowStart + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          // Bar width — relative to a 0.5s reference
          const fillW = interpolate(
            frame,
            [rowStart + 5, rowStart + 50],
            [0, (app.impact / 0.5) * 100],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
          const sec = interpolate(
            frame,
            [rowStart + 5, rowStart + 50],
            [0, app.impact],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
          return (
            <div
              key={app.name}
              style={{
                opacity: rowOp,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 150,
                  flexShrink: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.textHeading,
                }}
              >
                {app.name}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  background: C.borderSoft,
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${fillW}%`,
                    height: '100%',
                    background: C.primary,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div
                style={{
                  width: 64,
                  flexShrink: 0,
                  fontSize: 13,
                  color: C.textBody,
                  fontFamily: `'${storeMdBrand.typography.fontMono}', monospace`,
                  fontWeight: 600,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                +{sec.toFixed(2)}s
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Stat: React.FC<{
  label: string
  value: string
  valueColor?: string
  small?: boolean
}> = ({ label, value, valueColor = C.textHeading, small = false }) => (
  <div>
    <div
      style={{
        fontSize: 12,
        color: C.textMuted,
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
        fontSize: small ? 18 : 36,
        fontWeight: 700,
        color: valueColor,
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
  </div>
)

const QuickStatsCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { opacity, y } = fadeUp(frame, T_QUICK_STATS, 30)

  const totalIssues = Math.round(
    interpolate(frame, [T_QUICK_STATS + 20, T_QUICK_STATS + 70], [0, 7], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  const critical = Math.round(
    interpolate(frame, [T_QUICK_STATS + 25, T_QUICK_STATS + 70], [0, 2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '20px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: C.cardShadow,
      }}
    >
      <div
        style={{
          fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
          fontSize: 18,
          fontWeight: 700,
          color: C.textHeading,
        }}
      >
        Quick Stats
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 16 }}>
        <Stat label="Total Issues" value={String(totalIssues)} />
        <Stat label="Critical" value={String(critical)} valueColor={C.critical} />
        <Stat label="Last scan" value="2 min ago" small />
      </div>
    </div>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDHealthDashboard: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: `'${storeMdBrand.typography.fontBody}', sans-serif`,
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar frame={frame} />

        <div
          style={{
            flex: 1,
            padding: '28px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            overflow: 'hidden',
          }}
        >
          <PageHeader frame={frame} />
          <ScoreHero frame={frame} />
          <IssuesList frame={frame} />
          <TrendChart frame={frame} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <AppImpactCard frame={frame} />
            <QuickStatsCard frame={frame} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
