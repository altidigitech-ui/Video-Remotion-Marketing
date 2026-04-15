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
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { ScoreCircle, getScoreStroke } from '../components/ScoreCircle'
import { IssueCard } from '../components/IssueCard'

// ─── Constants ────────────────────────────────────────────────────────────────

const URL = 'storemd.app/scan'

const CATEGORIES: ReadonlyArray<{ label: string; score: number }> = [
  { label: 'Performance', score: 85 },
  { label: 'Apps Health', score: 60 },
  { label: 'Listings', score: 40 },
  { label: 'AI Ready', score: 35 },
  { label: 'Accessibility', score: 78 },
]

// Phase 4 (CTA) starts at frame 750 → last 150f = 2.5s @ 60fps.
const CTA_START = 750

// ─── Sub-components ───────────────────────────────────────────────────────────

const UrlBar: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand

  const op = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const chars = Math.floor(
    interpolate(frame, [0, 50], [0, URL.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )
  // Cursor blinks ~5x per second — keep it deterministic per frame.
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
          background: '#16a34a',
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
          color: '#ffffff',
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

const CategoryBar: React.FC<{
  label: string
  score: number
  startFrame: number
  frame: number
}> = ({ label, score, startFrame, frame }) => {
  const brand = storeMdBrand
  const color = getScoreStroke(score)

  const opacity = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const x = interpolate(frame, [startFrame, startFrame + 30], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fillWidth = interpolate(
    frame,
    [startFrame + 8, startFrame + 60],
    [0, score],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
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
    </div>
  )
}

// Logo overlay — same pattern as StoreMDScene's inline logo (cyan-tinted glow).
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
            height: 56,
            width: 56,
            borderRadius: 12,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
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

  // ── PHASE 1: Hook (0-180) ──
  const titleY = spring({
    frame,
    fps,
    from: 32,
    to: 0,
    config: brand.motion.springSmooth,
  })
  const titleOp = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const subtitleOp = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Hook morph exit — shrink + translate up, then fade out container
  const hookScale = interpolate(frame, [145, 180], [1, 0.32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const hookY = interpolate(frame, [145, 180], [0, -360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const hookOp = interpolate(frame, [0, 30, 165, 185], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── PHASE 2: Layout fade in ──
  const contentOp = interpolate(frame, [165, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Score card fade in (after URL typewriter)
  const scoreCardOp = interpolate(frame, [220, 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Issues container fade in (frame 410 — just before issue 1 enters)
  const issuesOp = interpolate(frame, [410, 430], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── PHASE 4: CTA exit transition ──
  // Scan content fades & zooms out; CTA fades in.
  const scanZoomOut = interpolate(
    frame,
    [CTA_START - 40, CTA_START + 30],
    [1, 0.92],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const scanFade = interpolate(
    frame,
    [CTA_START - 30, CTA_START + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springSmooth,
  })

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      {/* ── PHASE 1: Hook ── */}
      <AbsoluteFill
        style={{
          opacity: hookOp,
          transform: `scale(${hookScale}) translateY(${hookY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 200,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontWeight: brand.typography.weightLight,
              color: brand.colors.textMuted,
            }}
          >
            Store
          </span>
          <span
            style={{
              fontWeight: brand.typography.weightExtrabold,
              color: brand.colors.textPrimary,
              textShadow:
                '0 0 60px rgba(6, 182, 212, 0.55), 0 0 28px rgba(6, 182, 212, 0.35)',
            }}
          >
            MD
          </span>
        </div>
        <div
          style={{
            opacity: subtitleOp,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 38,
            fontWeight: brand.typography.weightMedium,
            color: brand.colors.textSecondary,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            maxWidth: 1300,
          }}
        >
          Your Shopify store health score in 60 seconds.
        </div>
      </AbsoluteFill>

      {/* ── PHASE 2 + 3: Scan + results ── */}
      <AbsoluteFill
        style={{
          opacity: contentOp * scanFade,
          transform: `scale(${scanZoomOut})`,
          padding: '64px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          justifyContent: 'center',
        }}
      >
        {/* URL bar */}
        <UrlBar frame={Math.max(0, frame - 180)} />

        {/* Score card: ScoreCircle on the left, category bars on the right */}
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
          }}
        >
          {/* ScoreCircle (160px native, scaled to ~260px for hero presence) */}
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
              <ScoreCircle score={72} startFrame={280} duration={80} />
            </div>
          </div>

          {/* Categories */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: `'${brand.typography.fontMono}', monospace`,
                fontSize: 14,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.colors.accent,
                marginBottom: 4,
              }}
            >
              Category Breakdown
            </div>
            {CATEGORIES.map((cat, i) => (
              <CategoryBar
                key={cat.label}
                label={cat.label}
                score={cat.score}
                startFrame={320 + i * 22}
                frame={frame}
              />
            ))}
          </div>
        </div>

        {/* Issue cards (Phase 3) */}
        <div
          style={{
            opacity: issuesOp,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <IssueCard
            severity="critical"
            title="3 apps still billing after uninstall — $47/month wasted"
            impact="Recurring charges from uninstalled apps drain margin every month."
            autoFixable
            frame={frame - 420}
          />
          <IssueCard
            severity="major"
            title="14 products missing alt text — SEO impact"
            impact="Missing alt text hurts image search ranking and accessibility scoring."
            frame={frame - 480}
          />
        </div>
      </AbsoluteFill>

      {/* ── PHASE 4: CTA ── */}
      <AbsoluteFill
        style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 64,
          padding: '0 140px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 84,
            fontWeight: brand.typography.weightBold,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textAlign: 'center',
            maxWidth: 1500,
          }}
        >
          Detects what kills your conversions.{' '}
          <span
            style={{
              backgroundImage: `linear-gradient(135deg, ${brand.colors.accent} 0%, ${brand.colors.primary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Automatically.
          </span>
        </div>

        {/* CTA button */}
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 36,
            fontWeight: brand.typography.weightBold,
            color: '#ffffff',
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '24px 64px',
            borderRadius: 16,
            boxShadow:
              '0 0 44px rgba(37, 99, 235, 0.55), 0 0 90px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            letterSpacing: '-0.01em',
          }}
        >
          Scan your store free →
        </div>
      </AbsoluteFill>

      {/* ── ALWAYS LAST ── */}
      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
