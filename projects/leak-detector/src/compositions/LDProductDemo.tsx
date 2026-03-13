import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText, GlowButton, AIBadge, LogoOverlay } from '@altidigitech/core'

export type LDProductDemoProps = {
  brand: BrandConfig
  headline: string
  subline: string
  features: string[]
  ctaText: string
  ctaUrl?: string
}

const SPRING = { damping: 14, stiffness: 120 }

// Animated URL typewriter
const UrlBar: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const url = 'leakdetector.tech/analyze'
  const chars = Math.floor(interpolate(frame, [0, 50], [0, url.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const op = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const cursorBlink = Math.floor(frame * 0.5) % 2 === 0

  return (
    <div style={{
      opacity: op,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px',
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10,
      width: '100%',
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        backgroundColor: '#22c55e',
        boxShadow: '0 0 8px rgba(34,197,94,0.8)',
        flexShrink: 0,
      }} />
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 22, color: '#F59E0B', flex: 1,
      }}>
        {url.slice(0, chars)}{chars < url.length && cursorBlink ? '|' : ''}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 18, fontWeight: 600, color: '#0A0F1E',
        backgroundColor: '#F59E0B',
        padding: '8px 20px', borderRadius: 7,
        boxShadow: '0 0 16px rgba(245,158,11,0.5)',
        flexShrink: 0,
      }}>
        Scan
      </div>
    </div>
  )
}

// Score ring
const ScoreRing: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const score = 72
  const C = 2 * Math.PI * 50
  const dash = interpolate(frame, [startFrame, startFrame + 80], [C, C * (1 - score / 100)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const counter = Math.round(interpolate(frame, [startFrame, startFrame + 80], [0, score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  const op = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <div style={{ opacity: op, position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={50} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={70} cy={70} r={50} fill="none" stroke="#F59E0B" strokeWidth={10}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={dash}
          style={{ filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.8))' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>{counter}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#475569' }}>/100</span>
      </div>
    </div>
  )
}

export const LDProductDemo: React.FC<LDProductDemoProps> = ({
  brand,
  headline,
  subline,
  features,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // ── Phase 1 : Header (0→90) ──────────────────────────────────────────────
  const headerOp = interpolate(frame, [0, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const headerY = spring({ frame, fps, from: 32, to: 0, config: SPRING })

  // Morph exit — title shrinks up instead of just fading
  const headerScale = interpolate(frame, [120, 165], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const headerTY = interpolate(frame, [120, 165], [0, -280], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // ── Phase 2 : Content layout (90+) ──────────────────────────────────────
  const contentOp = interpolate(frame, [160, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // ── Issues (frame 200+) ──────────────────────────────────────────────────
  const issue1Op = interpolate(frame, [285, 310], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const issue1Y = spring({ frame: frame - 285, fps, from: 20, to: 0, config: SPRING })
  const issue2Op = interpolate(frame, [315, 340], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const issue2Y = spring({ frame: frame - 315, fps, from: 20, to: 0, config: SPRING })

  // ── CTA (last 90 frames) ─────────────────────────────────────────────────
  const ctaStart = durationInFrames - 90
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaScale = spring({ frame: frame - ctaStart, fps, from: 0.85, to: 1, config: SPRING })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* ── Header (0→90) ── */}
      <AbsoluteFill style={{
        opacity: interpolate(frame, [0, 28, 150, 165], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `scale(${headerScale}) translateY(${headerTY}px)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        <div style={{ opacity: headerOp, transform: `translateY(${headerY}px)` }}>
          <AIBadge frame={frame} />
        </div>
        <div style={{
          opacity: headerOp, transform: `translateY(${headerY}px)`,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 96, letterSpacing: '-0.03em', textAlign: 'center',
          lineHeight: 1.1,
        }}>
          <span style={{ fontWeight: 300, color: '#64748B' }}>Leak </span>
          <span style={{
            fontWeight: 800, color: '#F8FAFC',
            textShadow: '0 0 60px rgba(245,158,11,0.35)',
          }}>Detector</span>
        </div>
        <div style={{
          opacity: interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 32, color: '#64748B', textAlign: 'center',
        }}>
          {subline}
        </div>
      </AbsoluteFill>

      {/* ── Main layout (90+) — Left panel: product UI, Right: features ── */}
      <AbsoluteFill style={{
        opacity: contentOp,
        display: 'flex', padding: '48px 64px', gap: 48, overflow: 'hidden',
      }}>

        {/* LEFT — Product UI mockup */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden',
        }}>
          {/* Title */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28, fontWeight: 700, color: '#F8FAFC',
            letterSpacing: '-0.01em',
          }}>
            {headline}
          </div>

          {/* URL Bar */}
          <UrlBar frame={Math.max(0, frame - 170)} fps={fps} />

          {/* Score result card */}
          <div style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(245,158,11,0.12)',
            borderRadius: 14, padding: '24px 28px',
            display: 'flex', flexDirection: 'column', gap: 18,
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: '#F8FAFC' }}>
                  Analysis Report
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: '#F59E0B', marginTop: 4 }}>
                  vercel.com
                </div>
              </div>
              <ScoreRing frame={frame} startFrame={205} />
            </div>

            {/* Mini bars */}
            {[
              { label: 'Headline', score: 85, color: '#22c55e' },
              { label: 'CTA', score: 60, color: '#F59E0B' },
              { label: 'Social Proof', score: 40, color: '#ef4444' },
              { label: 'Trust', score: 95, color: '#22c55e' },
            ].map((cat, i) => {
              const barStart = 220 + i * 18
              const bOp = interpolate(frame, [barStart, barStart + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              const bW = interpolate(frame, [barStart, barStart + 50], [0, cat.score], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              return (
                <div key={i} style={{ opacity: bOp, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 110, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: '#64748B', textAlign: 'right' }}>
                    {cat.label}
                  </div>
                  <div style={{ flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${bW}%`, height: '100%', backgroundColor: cat.color, borderRadius: 4, boxShadow: `0 0 6px ${cat.color}60` }} />
                  </div>
                  <div style={{ width: 36, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: cat.color, fontWeight: 700, textAlign: 'right' }}>
                    {Math.round(bW)}
                  </div>
                </div>
              )
            })}

            {/* Issue cards */}
            <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
              <div style={{
                opacity: issue1Op, transform: `translateY(${issue1Y}px)`,
                flex: 1, backgroundColor: 'rgba(239,68,68,0.08)',
                borderLeft: '4px solid #ef4444', borderRadius: 8, padding: '12px 14px', overflow: 'hidden',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#ef4444', letterSpacing: '0.1em', marginBottom: 4 }}>CRITICAL</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>No customer testimonials</div>
              </div>
              <div style={{
                opacity: issue2Op, transform: `translateY(${issue2Y}px)`,
                flex: 1, backgroundColor: 'rgba(245,158,11,0.08)',
                borderLeft: '4px solid #F59E0B', borderRadius: 8, padding: '12px 14px', overflow: 'hidden',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#F59E0B', letterSpacing: '0.1em', marginBottom: 4 }}>WARNING</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>Generic CTA copy</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Features */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', gap: 16,
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, letterSpacing: '0.18em', color: '#F59E0B',
            marginBottom: 8,
          }}>
            8 CRO CATEGORIES ANALYZED
          </div>
          {features.map((feat, i) => {
            const fStart = 105 + i * 22
            const fOp = interpolate(frame, [fStart, fStart + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            const fX = spring({ frame: frame - fStart, fps, from: 32, to: 0, config: SPRING })
            return (
              <div key={i} style={{
                opacity: fOp, transform: `translateX(${fX}px)`,
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(245,158,11,0.1)',
                borderRadius: 10,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 8px rgba(245,158,11,0.6)',
                  flexShrink: 0,
                }} />
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 19, color: '#CBD5E1', fontWeight: 500,
                }}>
                  {feat}
                </div>
              </div>
            )
          })}
          <div style={{ opacity: ctaOp, transform: `scale(${ctaScale})`, marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <GlowButton text={`⟶ ${ctaText}`} brand={brand} />
          </div>
        </div>
      </AbsoluteFill>

      {/* ALWAYS LAST */}
      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
