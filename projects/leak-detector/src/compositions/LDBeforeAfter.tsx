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

const CATS = [
  { label: 'Headline',         before: 52, after: 85 },
  { label: 'Call-to-Action',   before: 28, after: 74 },
  { label: 'Social Proof',     before: 15, after: 68 },
  { label: 'Visual Hierarchy', before: 60, after: 88 },
  { label: 'Trust',            before: 35, after: 82 },
]

const BEFORE_SCORE = 45
const AFTER_SCORE  = 78

const getColor = (score: number) =>
  score >= 80 ? '#22c55e' : score >= 60 ? '#F59E0B' : '#ef4444'

type Side = 'before' | 'after'

const ScorePanel: React.FC<{
  title: string
  subtitle: string
  score: number
  categories: { label: string; score: number }[]
  issues: { severity: string; text: string; color: string }[]
  frame: number
  startFrame: number
  fps: number
  side: Side
}> = ({ title, subtitle, score, categories, issues, frame, startFrame, fps, side }) => {
  const panelOp = interpolate(frame, [startFrame, startFrame + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const panelY  = spring({ frame: frame - startFrame, fps, from: 36, to: 0, config: SPRING })

  const accentColor = side === 'before' ? '#ef4444' : '#22c55e'
  const scoreColor  = getColor(score)

  const C         = 2 * Math.PI * 44
  const scoreVal  = Math.round(interpolate(frame, [startFrame + 30, startFrame + 110], [0, score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const scoreDash = interpolate(frame, [startFrame + 30, startFrame + 110], [C, C * (1 - score / 100)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      opacity: panelOp,
      transform: `translateY(${panelY}px)`,
      flex: 1,
      display: 'flex', flexDirection: 'column', gap: 18,
      padding: '28px 32px',
      backgroundColor: 'rgba(255,255,255,0.025)',
      border: `1px solid ${accentColor}22`,
      borderTop: `3px solid ${accentColor}`,
      borderRadius: 20, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '0.15em', color: accentColor, marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#94A3B8', lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>
        {/* Score circle */}
        <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
          <svg width={96} height={96} viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={48} cy={48} r={44} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={48} cy={48} r={44} fill="none" stroke={scoreColor} strokeWidth={8}
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={scoreDash}
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor}80)` }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{scoreVal}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        {categories.map((cat, i) => {
          const barStart = startFrame + 40 + i * 20
          const bOp = interpolate(frame, [barStart, barStart + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const bW  = interpolate(frame, [barStart, barStart + 55], [0, cat.score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const color = getColor(cat.score)
          return (
            <div key={i} style={{ opacity: bOp, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 138, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: '#64748B', textAlign: 'right' }}>
                {cat.label}
              </div>
              <div style={{ flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${bW}%`, height: '100%', backgroundColor: color, borderRadius: 4, boxShadow: `0 0 6px ${color}50` }} />
              </div>
              <div style={{ width: 36, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color, fontWeight: 700, textAlign: 'right' }}>
                {Math.round(bW)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Issue summary */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end' }}>
        {issues.map((issue, i) => {
          const iStart = startFrame + 160 + i * 25
          const iOp = interpolate(frame, [iStart, iStart + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const iY  = spring({ frame: frame - iStart, fps, from: 16, to: 0, config: SPRING })
          return (
            <div key={i} style={{
              opacity: iOp, transform: `translateY(${iY}px)`,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              backgroundColor: `${issue.color}0D`,
              borderLeft: `3px solid ${issue.color}`,
              borderRadius: 8, overflow: 'hidden',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: issue.color, boxShadow: `0 0 6px ${issue.color}90`, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: '#CBD5E1', lineHeight: 1.3 }}>
                <span style={{ fontWeight: 600, color: issue.color, marginRight: 4 }}>{issue.severity}</span>{issue.text}
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

  // Intro title
  const titleOp = interpolate(frame, [0, 25, 75, 100], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleY  = spring({ frame, fps, from: 32, to: 0, config: SPRING })

  // Layout
  const layoutOp = interpolate(frame, [90, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Divider sweep
  const dividerH = interpolate(frame, [480, 660], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Delta badge
  const deltaOp = interpolate(frame, [720, 748], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const deltaY  = spring({ frame: frame - 720, fps, from: 24, to: 0, config: SPRING })

  // CTA
  const ctaOp    = interpolate(frame, [1020, 1050], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaScale = spring({ frame: frame - 1020, fps, from: 0.85, to: 1, config: SPRING })
  const pulse    = 1 + Math.sin(frame * 0.1) * 0.02

  const beforeCategories = CATS.map(c => ({ label: c.label, score: c.before }))
  const afterCategories  = CATS.map(c => ({ label: c.label, score: c.after }))

  const beforeIssues = [
    { severity: 'CRITICAL', text: 'No customer testimonials', color: '#ef4444' },
    { severity: 'CRITICAL', text: 'CTA has no specific value', color: '#ef4444' },
    { severity: 'WARNING',  text: 'Low trust signal density', color: '#F59E0B' },
  ]

  const afterIssues = [
    { severity: 'FIXED', text: 'Added 3 customer testimonials', color: '#22c55e' },
    { severity: 'FIXED', text: 'CTA rewrites with clear value', color: '#22c55e' },
    { severity: 'FIXED', text: 'Added social proof section', color: '#22c55e' },
  ]

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} burstAt={600} />

      {/* Intro title */}
      <AbsoluteFill style={{
        opacity: titleOp, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ transform: `translateY(${titleY}px)`, fontFamily: "'Space Grotesk', sans-serif", fontSize: 88, letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 300, color: '#64748B' }}>Before</span>
          <span style={{ fontWeight: 300, color: '#475569' }}> vs </span>
          <span style={{ fontWeight: 800, color: '#F8FAFC' }}>After</span>
        </div>
        <div style={{
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: '#F59E0B', letterSpacing: '0.1em',
        }}>
          2 HOURS OF FIXES · LEAK DETECTOR REPORT
        </div>
      </AbsoluteFill>

      {/* Main layout */}
      <AbsoluteFill style={{
        opacity: layoutOp,
        display: 'flex', flexDirection: 'column',
        padding: '36px 48px', gap: 0,
      }}>
        <div style={{ flex: 1, display: 'flex', gap: 28, overflow: 'hidden' }}>

          {/* LEFT — BEFORE */}
          <ScorePanel
            title="BEFORE" subtitle="Landing page as-is"
            score={BEFORE_SCORE} categories={beforeCategories} issues={beforeIssues}
            frame={frame} startFrame={95} fps={fps} side="before"
          />

          {/* Divider */}
          <div style={{
            width: 3, flexShrink: 0,
            backgroundColor: 'rgba(245,158,11,0.12)',
            borderRadius: 2, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: `${dividerH}%`,
              backgroundColor: '#F59E0B', borderRadius: 2,
              boxShadow: '0 0 12px rgba(245,158,11,0.8)',
            }} />
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              opacity: deltaOp, transform: `translateY(${deltaY}px)`,
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: '#0A0F1E',
              boxShadow: '0 0 28px rgba(245,158,11,0.7)', zIndex: 2,
            }}>→</div>
            {/* Delta score */}
            <div style={{
              position: 'absolute', top: '55%',
              opacity: deltaOp, transform: `translateY(${deltaY}px)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 2, width: 88,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,0.6)' }}>+33</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#22c55e', letterSpacing: '0.1em' }}>POINTS</div>
            </div>
          </div>

          {/* RIGHT — AFTER */}
          <ScorePanel
            title="AFTER" subtitle="2 hours of focused fixes"
            score={AFTER_SCORE} categories={afterCategories} issues={afterIssues}
            frame={frame} startFrame={570} fps={fps} side="after"
          />
        </div>

        {/* CTA bar */}
        <div style={{
          opacity: ctaOp, transform: `scale(${ctaScale * pulse})`,
          display: 'flex', justifyContent: 'center', paddingTop: 28,
          flexShrink: 0,
        }}>
          <GlowButton text="Find your conversion leaks — Free audit →" brand={brand} />
        </div>
      </AbsoluteFill>

      {/* ALWAYS LAST */}
      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
