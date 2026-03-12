import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, LogoOverlay } from '@altidigitech/core'

export type LDProblemAgitationProps = { brand: BrandConfig }

const SPRING = { damping: 14, stiffness: 120 }

// Word reveal (adapted for vertical — smaller)
const WordReveal: React.FC<{
  text: string; frame: number; startFrame: number
  fontSize: number; color?: string; fontWeight?: number
}> = ({ text, frame, startFrame, fontSize, color = '#F8FAFC', fontWeight = 700 }) => {
  const words = text.split(' ')
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: `${fontSize * 0.28}px`,
      justifyContent: 'center',
    }}>
      {words.map((word, i) => {
        const ws = startFrame + i * 10
        const op = interpolate(frame, [ws, ws + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const bl = interpolate(frame, [ws, ws + 15], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const y  = interpolate(frame, [ws, ws + 15], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return (
          <span key={i} style={{
            opacity: op, filter: `blur(${bl}px)`,
            transform: `translateY(${y}px)`, display: 'inline-block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize, fontWeight, color, lineHeight: 1.2,
            letterSpacing: '-0.02em', textAlign: 'center',
          }}>
            {word}
          </span>
        )
      })}
    </div>
  )
}

export const LDProblemAgitation: React.FC<LDProblemAgitationProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Phase opacities
  const p1op = interpolate(frame, [0, 18, 100, 130], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const p2op = interpolate(frame, [100, 120, 260, 285], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const p3op = interpolate(frame, [270, 295, 415, 440], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Phase 2 : animated counters
  const stat1 = Math.round(interpolate(frame, [125, 185], [0, 58], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const stat2 = Math.round(interpolate(frame, [145, 205], [0, 42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const stat3 = Math.round(interpolate(frame, [165, 225], [0, 73], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))

  // Phase 3 : CTA spring
  const ctaScale = spring({ frame: frame - 330, fps, from: 0.85, to: 1, config: SPRING })
  const ctaOp    = interpolate(frame, [330, 355], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const pulse = 1 + Math.sin(frame * 0.15) * 0.025

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* ── Phase 1 : Hook ── */}
      <AbsoluteFill style={{
        opacity: p1op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px', gap: 40,
      }}>
        {/* Alert badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '12px 28px', borderRadius: 100,
          backgroundColor: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.35)',
          opacity: interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444',
            boxShadow: `0 0 ${12 + Math.sin(frame * 0.2) * 5}px rgba(239,68,68,0.9)`,
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: '#ef4444', letterSpacing: '0.1em' }}>
            CONVERSION LEAK DETECTED
          </span>
        </div>

        <WordReveal
          text="58% of landing pages have zero social proof"
          frame={frame} startFrame={18} fontSize={72} fontWeight={800}
        />

        <div style={{
          opacity: interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 30, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5,
        }}>
          Is your page one of them?
        </div>
      </AbsoluteFill>

      {/* ── Phase 2 : Stats ── */}
      <AbsoluteFill style={{
        opacity: p2op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 70px', gap: 32,
      }}>
        <div style={{
          opacity: interpolate(frame, [108, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18, letterSpacing: '0.18em', color: '#F59E0B',
        }}>
          REAL DATA · 40+ SAAS PAGES ANALYZED
        </div>

        {/* Stat cards — column layout for vertical format */}
        {[
          { val: stat1, suffix: '%',    label: 'Missing social proof', color: '#ef4444', start: 122 },
          { val: stat2, suffix: '%',    label: 'Weak or missing CTAs',  color: '#ef4444', start: 142 },
          { val: stat3, suffix: '/100', label: 'Average CRO score',     color: '#F59E0B', start: 162 },
        ].map((s, i) => {
          const cardOp = interpolate(frame, [s.start, s.start + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const cardY  = spring({ frame: frame - s.start, fps, from: 28, to: 0, config: SPRING })
          return (
            <div key={i} style={{
              opacity: cardOp, transform: `translateY(${cardY}px)`,
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '24px 32px', gap: 24,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${s.color}20`,
              borderLeft: `4px solid ${s.color}`,
              borderRadius: 16, overflow: 'hidden',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 72, fontWeight: 800, color: s.color, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 40px ${s.color}60`,
                flexShrink: 0,
              }}>
                {s.val}{s.suffix}
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 26, color: '#94A3B8', lineHeight: 1.4,
              }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </AbsoluteFill>

      {/* ── Phase 3 : Solution & CTA ── */}
      <AbsoluteFill style={{
        opacity: p3op, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px', gap: 44,
      }}>
        <WordReveal
          text="Find your conversion leaks in 60 seconds"
          frame={frame} startFrame={278} fontSize={68} fontWeight={800}
        />

        <div style={{
          opacity: interpolate(frame, [320, 340], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 30, color: '#94A3B8', textAlign: 'center', lineHeight: 1.5,
        }}>
          AI analyzes 8 CRO categories · Score /100 · Free
        </div>

        {/* CTA */}
        <div style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale * pulse})`,
          padding: '28px 56px',
          borderRadius: 16,
          backgroundColor: '#F59E0B',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 34, fontWeight: 700, color: '#0A0F1E',
          letterSpacing: '-0.01em',
          boxShadow: '0 0 60px rgba(245,158,11,0.45)',
          textAlign: 'center',
        }}>
          leakdetector.tech
        </div>

        <div style={{
          opacity: interpolate(frame, [360, 380], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, color: '#475569', letterSpacing: '0.08em',
        }}>
          FREE · LINK IN BIO
        </div>
      </AbsoluteFill>

      {/* ALWAYS LAST */}
      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
