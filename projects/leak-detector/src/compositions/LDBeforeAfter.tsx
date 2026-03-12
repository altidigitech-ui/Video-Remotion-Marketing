import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowButton, LogoOverlay } from '@altidigitech/core'

export type LDBeforeAfterProps = { brand: BrandConfig }

const SPRING = { damping: 14, stiffness: 120 }

const BEFORE_CATS = [
  { label: 'Headline',        before: 52, after: 85 },
  { label: 'Call-to-Action',  before: 28, after: 74 },
  { label: 'Social Proof',    before: 15, after: 68 },
  { label: 'Visual Hierarchy', before: 60, after: 88 },
  { label: 'Trust',           before: 35, after: 82 },
]

const BEFORE_SCORE = 45
const AFTER_SCORE  = 78

const getColor = (score: number) =>
  score >= 80 ? '#22c55e' : score >= 60 ? '#F59E0B' : '#ef4444'

// Panel component (reused for before & after)
const ScorePanel: React.FC<{
  title: string; subtitle: string; score: number
  categories: { label: string; score: number }[]
  frame: number; startFrame: number; fps: number
  side: 'left' | 'right'
}> = ({ title, subtitle, score, categories, frame, startFrame, fps, side }) => {
  const panelOp = interpolate(frame, [startFrame, startFrame + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const panelY  = spring({ frame: frame - startFrame, fps, from: 36, to: 0, config: SPRING })

  const scoreVal = Math.round(
    interpolate(frame, [startFrame + 30, startFrame + 110], [0, score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  )
  const C = 2 * Math.PI * 44
  const scoreDash = interpolate(
    frame, [startFrame + 30, startFrame + 110],
    [C, C * (1 - score / 100)],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const scoreColor = getColor(score)

  return (
    <div style={{
      opacity: panelOp, transform: `translateY(${panelY}px)`,
      flex: 1, display: 'flex', flexDirection: 'column', gap: 20,
      padding: '32px 36px',
      backgroundColor: 'rgba(255,255,255,0.025)',
      border: `1px solid ${side === 'left' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
      borderRadius: 20, overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.15em',
            color: side === 'left' ? '#ef4444' : '#22c55e',
            marginBottom: 6,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 600, color: '#94A3B8', lineHeight: 1.3,
          }}>
            {subtitle}
          </div>
        </div>
        {/* Score circle */}
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={50} cy={50} r={44} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle
              cx={50} cy={50} r={44} fill="none" stroke={scoreColor} strokeWidth={8}
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={scoreDash}
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor}80)` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
              {scoreVal}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {categories.map((cat, i) => {
          const barStart = startFrame + 40 + i * 20
          const barW = interpolate(frame, [barStart, barStart + 50], [0, cat.score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const barOp = interpolate(frame, [barStart, barStart + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const color = getColor(cat.score)
          return (
            <div key={i} style={{ opacity: barOp, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 155, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: '#64748B', textAlign: 'right' }}>
                {cat.label}
              </div>
              <div style={{ flex: 1, height: 9, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${barW}%`, height: '100%', backgroundColor: color, borderRadius: 5, boxShadow: `0 0 8px ${color}50` }} />
              </div>
              <div style={{ width: 44, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color, fontWeight: 700, textAlign: 'right' }}>
                {Math.round(barW)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const LDBeforeAfter: React.FC<LDBeforeAfterProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title
  const titleOp = interpolate(frame, [0, 25, 75, 100], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleY  = spring({ frame, fps, from: 32, to: 0, config: SPRING })

  // Main layout appears after title
  const layoutOp = interpolate(frame, [90, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Divider sweep (reveals AFTER panel)
  const dividerX = interpolate(frame, [480, 660], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Category arrays
  const beforeCatsBefore = BEFORE_CATS.map(c => ({ label: c.label, score: c.before }))
  const beforeCatsAfter  = BEFORE_CATS.map(c => ({ label: c.label, score: c.after }))

  // Delta badge
  const deltaOp = interpolate(frame, [720, 750], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const deltaY  = spring({ frame: frame - 720, fps, from: 24, to: 0, config: SPRING })

  // CTA
  const ctaOp    = interpolate(frame, [1020, 1050], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaScale = spring({ frame: frame - 1020, fps, from: 0.85, to: 1, config: SPRING })
  const pulse    = 1 + Math.sin(frame * 0.1) * 0.02

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Intro title */}
      <AbsoluteFill style={{
        opacity: titleOp, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          transform: `translateY(${titleY}px)`,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 88, fontWeight: 800, color: '#F8FAFC',
          letterSpacing: '-0.03em', textAlign: 'center',
        }}>
          Before vs After
        </div>
        <div style={{
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20, color: '#F59E0B', letterSpacing: '0.1em',
        }}>
          2 HOURS OF FIXES · LEAK DETECTOR REPORT
        </div>
      </AbsoluteFill>

      {/* Main layout — side by side */}
      <AbsoluteFill style={{ opacity: layoutOp, padding: '36px 48px', gap: 0 }}>
        <div style={{ display: 'flex', width: '100%', height: '100%', gap: 28, overflow: 'hidden' }}>

          {/* LEFT : BEFORE */}
          <ScorePanel
            title="BEFORE" subtitle="Landing page as-is"
            score={BEFORE_SCORE} categories={beforeCatsBefore}
            frame={frame} startFrame={95} fps={fps} side="left"
          />

          {/* Center divider */}
          <div style={{
            width: 3, flexShrink: 0,
            backgroundColor: 'rgba(245,158,11,0.15)',
            borderRadius: 2, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Sweeping highlight on divider */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: `${dividerX}%`,
              backgroundColor: '#F59E0B',
              borderRadius: 2,
              boxShadow: '0 0 12px rgba(245,158,11,0.8)',
            }} />
            {/* Arrow badge */}
            <div style={{
              position: 'absolute',
              opacity: deltaOp,
              transform: `translateY(${deltaY}px)`,
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26, fontWeight: 800, color: '#0A0F1E',
              boxShadow: '0 0 24px rgba(245,158,11,0.6)',
              zIndex: 2,
            }}>
              →
            </div>
            {/* Score delta */}
            <div style={{
              position: 'absolute', top: '55%',
              opacity: deltaOp,
              transform: `translateY(${deltaY}px)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              zIndex: 2, width: 80,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22, fontWeight: 800, color: '#22c55e',
                textShadow: '0 0 20px rgba(34,197,94,0.6)',
              }}>
                +33
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: '#22c55e', letterSpacing: '0.1em',
              }}>
                POINTS
              </div>
            </div>
          </div>

          {/* RIGHT : AFTER */}
          <ScorePanel
            title="AFTER" subtitle="2 hours of focused fixes"
            score={AFTER_SCORE} categories={beforeCatsAfter}
            frame={frame} startFrame={570} fps={fps} side="right"
          />
        </div>

        {/* Bottom CTA bar */}
        <div style={{
          position: 'absolute', bottom: 36, left: 48, right: 48,
          opacity: ctaOp, transform: `scale(${ctaScale * pulse})`,
          display: 'flex', justifyContent: 'center',
        }}>
          <GlowButton text="Find your conversion leaks — Free audit →" brand={brand} />
        </div>
      </AbsoluteFill>

      {/* ALWAYS LAST */}
      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
