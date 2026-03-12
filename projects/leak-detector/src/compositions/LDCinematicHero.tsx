import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowButton, LogoOverlay, AIBadge } from '@altidigitech/core'

export type LDCinematicHeroProps = { brand: BrandConfig }

const SPRING = { damping: 14, stiffness: 120 }

// ── Word-by-word reveal with blur ─────────────────────────────────────────────
const WordReveal: React.FC<{
  text: string
  frame: number
  startFrame: number
  fontSize: number
  color?: string
  fontWeight?: number
  textAlign?: 'left' | 'center'
  letterSpacing?: string
}> = ({
  text, frame, startFrame, fontSize,
  color = '#F8FAFC', fontWeight = 700,
  textAlign = 'center', letterSpacing = '-0.02em',
}) => {
  const words = text.split(' ')
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: `${fontSize * 0.28}px`,
      justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
    }}>
      {words.map((word, i) => {
        const ws = startFrame + i * 9
        const op = interpolate(frame, [ws, ws + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const bl = interpolate(frame, [ws, ws + 14], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const y  = interpolate(frame, [ws, ws + 14], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return (
          <span key={i} style={{
            opacity: op, filter: `blur(${bl}px)`,
            transform: `translateY(${y}px)`, display: 'inline-block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize, fontWeight, color, lineHeight: 1.15, letterSpacing,
          }}>
            {word}
          </span>
        )
      })}
    </div>
  )
}

// ── Animated stat card ────────────────────────────────────────────────────────
const StatCard: React.FC<{
  value: number; suffix: string; label: string
  frame: number; startFrame: number; color: string
}> = ({ value, suffix, label, frame, startFrame, color }) => {
  const op = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const y  = spring({ frame: frame - startFrame, fps: 60, from: 32, to: 0, config: SPRING })
  const counter = Math.round(
    interpolate(frame, [startFrame, startFrame + 70], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  )
  return (
    <div style={{
      opacity: op, transform: `translateY(${y}px)`,
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      padding: '32px 24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}25`,
      borderTop: `3px solid ${color}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 88, fontWeight: 800, color, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 48px ${color}60`,
      }}>
        {counter}{suffix}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 20, color: '#94A3B8', textAlign: 'center', lineHeight: 1.4,
      }}>
        {label}
      </div>
    </div>
  )
}

// ── Category bar ──────────────────────────────────────────────────────────────
const CatBar: React.FC<{
  label: string; score: number; color: string
  frame: number; startFrame: number
}> = ({ label, score, color, frame, startFrame }) => {
  const op = interpolate(frame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const w  = interpolate(frame, [startFrame, startFrame + 50], [0, score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const displayed = Math.round(w)
  return (
    <div style={{ opacity: op, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 170, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: '#94A3B8', textAlign: 'right' }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${w}%`, height: '100%', backgroundColor: color, borderRadius: 5, boxShadow: `0 0 10px ${color}60` }} />
      </div>
      <div style={{ width: 50, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 17, color, fontWeight: 700, textAlign: 'right' }}>
        {displayed}
      </div>
    </div>
  )
}

// ── Main composition ──────────────────────────────────────────────────────────
export const LDCinematicHero: React.FC<LDCinematicHeroProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Phase opacities — each phase fades in then out cleanly
  const p1op = interpolate(frame, [0, 20, 150, 180], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const p2op = interpolate(frame, [180, 205, 450, 480], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const p3op = interpolate(frame, [480, 515, 1050, 1080], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const p4op = interpolate(frame, [1080, 1115, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // UI panel spring (phase 3)
  const panelY     = spring({ frame: frame - 515, fps, from: 60, to: 0, config: SPRING })
  const panelScale = spring({ frame: frame - 515, fps, from: 0.93, to: 1, config: SPRING })

  // CTA pulse
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02

  // Score circle (phase 3)
  const scoreValue = Math.round(
    interpolate(frame, [545, 640], [0, 72], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  )
  const C = 2 * Math.PI * 50
  const scoreDash = interpolate(frame, [545, 640], [C, C * (1 - 72 / 100)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* ── Phase 1 : Problem statement ── */}
      <AbsoluteFill style={{
        opacity: p1op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 180px', gap: 36,
      }}>
        {/* Pulse dot */}
        <div style={{
          width: 18, height: 18, borderRadius: '50%', backgroundColor: '#ef4444',
          boxShadow: `0 0 ${24 + Math.sin(frame * 0.25) * 10}px rgba(239,68,68,0.9)`,
        }} />
        <WordReveal
          text="Your landing page is losing customers right now"
          frame={frame} startFrame={12} fontSize={82} fontWeight={800}
        />
        <div style={{
          opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, color: '#ef4444', letterSpacing: '0.12em',
        }}>
          FIND OUT WHY →
        </div>
      </AbsoluteFill>

      {/* ── Phase 2 : Stats ── */}
      <AbsoluteFill style={{
        opacity: p2op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 100px', gap: 40,
      }}>
        <div style={{
          opacity: interpolate(frame, [188, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, letterSpacing: '0.2em', color: '#F59E0B',
        }}>
          AFTER ANALYZING 40+ SAAS LANDING PAGES
        </div>
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
          <StatCard value={73} suffix="/100" label="Average CRO score"   frame={frame} startFrame={210} color="#F59E0B" />
          <StatCard value={58} suffix="%"    label="Missing social proof" frame={frame} startFrame={240} color="#ef4444" />
          <StatCard value={42} suffix="%"    label="Weak or missing CTAs" frame={frame} startFrame={270} color="#ef4444" />
        </div>
      </AbsoluteFill>

      {/* ── Phase 3 : UI solution (3D perspective) ── */}
      <AbsoluteFill style={{
        opacity: p3op, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 56,
      }}>
        <div style={{
          width: '100%', height: '100%',
          transform: `translateY(${panelY}px) scale(${panelScale}) perspective(1400px) rotateX(5deg) rotateY(-2deg)`,
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(245,158,11,0.18)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 80px rgba(245,158,11,0.08)',
          display: 'flex',
        }}>
          {/* Sidebar */}
          <div style={{
            width: 220, flexShrink: 0,
            backgroundColor: '#0F172A',
            borderRight: '1px solid rgba(245,158,11,0.1)',
            padding: '28px 16px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: '#F59E0B',
              marginBottom: 28, padding: '0 8px',
            }}>
              Leak Detector
            </div>
            {['Dashboard', 'Analyze', 'Reports', 'Settings'].map((item, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15, fontWeight: i === 1 ? 600 : 400,
                color: i === 1 ? '#F8FAFC' : '#475569',
                backgroundColor: i === 1 ? 'rgba(245,158,11,0.1)' : 'transparent',
                borderLeft: i === 1 ? '3px solid #F59E0B' : '3px solid transparent',
                marginBottom: 4,
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div style={{
            flex: 1, backgroundColor: '#050A14',
            padding: '28px 36px', display: 'flex', flexDirection: 'column',
            gap: 20, overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              opacity: interpolate(frame, [525, 555], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                  Analysis Report
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: '#F59E0B', marginTop: 4 }}>
                  vercel.com
                </div>
              </div>
              {/* Score circle */}
              <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                <svg width={130} height={130} viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={65} cy={65} r={50} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} />
                  <circle
                    cx={65} cy={65} r={50} fill="none" stroke="#F59E0B" strokeWidth={9}
                    strokeLinecap="round" strokeDasharray={C} strokeDashoffset={scoreDash}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.7))' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>
                    {scoreValue}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#475569' }}>/100</span>
                </div>
              </div>
            </div>

            {/* Category bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
              {[
                { label: 'Headline',        score: 85, color: '#22c55e' },
                { label: 'Call-to-Action',  score: 60, color: '#F59E0B' },
                { label: 'Social Proof',    score: 40, color: '#ef4444' },
                { label: 'Visual Hierarchy', score: 90, color: '#22c55e' },
                { label: 'Trust',           score: 95, color: '#22c55e' },
              ].map((cat, i) => (
                <CatBar
                  key={i} label={cat.label} score={cat.score} color={cat.color}
                  frame={frame} startFrame={565 + i * 22}
                />
              ))}
            </div>

            {/* Critical issue card */}
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.07)',
              borderLeft: '4px solid #ef4444', borderRadius: 10,
              padding: '14px 18px',
              opacity: interpolate(frame, [710, 740], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${spring({ frame: frame - 710, fps, from: 24, to: 0, config: SPRING })}px)`,
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.9)', flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#ef4444', letterSpacing: '0.1em' }}>CRITICAL</span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#F8FAFC' }}>
                No visible customer testimonials
              </div>
            </div>

            {/* Warning card */}
            <div style={{
              backgroundColor: 'rgba(245,158,11,0.07)',
              borderLeft: '4px solid #F59E0B', borderRadius: 10,
              padding: '14px 18px',
              opacity: interpolate(frame, [760, 790], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${spring({ frame: frame - 760, fps, from: 24, to: 0, config: SPRING })}px)`,
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B', boxShadow: '0 0 8px rgba(245,158,11,0.9)', flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#F59E0B', letterSpacing: '0.1em' }}>WARNING</span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#F8FAFC' }}>
                Generic CTA lacks compelling action
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Phase 4 : CTA ── */}
      <AbsoluteFill style={{
        opacity: p4op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 160px', gap: 36,
      }}>
        <div style={{
          opacity: interpolate(frame, [1095, 1118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, letterSpacing: '0.22em', color: '#F59E0B',
        }}>
          FREE · 60 SECONDS · NO SIGNUP REQUIRED
        </div>
        <WordReveal
          text="Find what makes visitors leave your page"
          frame={frame} startFrame={1112} fontSize={78} fontWeight={800}
        />
        {/* CTA button */}
        <div style={{
          opacity: interpolate(frame, [1260, 1290], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${pulse})`,
          marginTop: 8,
        }}>
          <GlowButton text="leakdetector.tech  — Free audit →" brand={brand} />
        </div>
      </AbsoluteFill>

      {/* ALWAYS LAST */}
      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
