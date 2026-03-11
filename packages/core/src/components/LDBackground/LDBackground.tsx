import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

// ── LDBackground ──────────────────────────────────────────────────────────────

const COLS = 22
const ROWS = 13

export const LDBackground: React.FC<{ brand: BrandConfig }> = ({ brand }) => {
  const frame = useCurrentFrame()
  const scanY = ((frame * 1.5) % 110) - 5
  const orbPulse = 0.10 + Math.sin(frame * 0.04) * 0.04

  const particles = Array.from({ length: 35 }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: (i * 97.3) % 100,
    size: 3 + (i % 3) * 2,
    speedX: 0.3 + (i % 5) * 0.12,
    speedY: 0.2 + (i % 4) * 0.08,
    opacity: 0.3 + (i % 4) * 0.15,
    color: i % 3 === 0 ? '#F59E0B' : i % 3 === 1 ? '#00FFFF' : '#FFFFFF',
  }))

  return (
    <AbsoluteFill style={{ background: '#050A14' }}>

      {/* Vertical grid lines */}
      {Array.from({ length: COLS }, (_, i) => (
        <div key={`v${i}`} style={{
          position: 'absolute',
          left: `${(i / COLS) * 100}%`,
          top: 0, bottom: 0, width: 1,
          background: 'rgba(245,158,11,0.08)',
        }} />
      ))}

      {/* Horizontal grid lines */}
      {Array.from({ length: ROWS }, (_, i) => (
        <div key={`h${i}`} style={{
          position: 'absolute',
          top: `${(i / ROWS) * 100}%`,
          left: 0, right: 0, height: 1,
          background: 'rgba(245,158,11,0.08)',
        }} />
      ))}

      {/* Amber orb top-right */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 700px 500px at 82% 8%, rgba(245,158,11,${orbPulse + 0.05}) 0%, transparent 70%)`,
      }} />

      {/* Cyan orb bottom-left */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse 600px 400px at 8% 92%, rgba(0,200,255,0.08) 0%, transparent 70%)',
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute',
        top: `${scanY}%`,
        left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0) 5%, rgba(245,158,11,0.9) 50%, rgba(245,158,11,0) 95%, transparent 100%)',
        boxShadow: '0 0 20px rgba(245,158,11,0.8), 0 0 40px rgba(245,158,11,0.3)',
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={`p${i}`} style={{
          position: 'absolute',
          left: `${(p.x + frame * p.speedX * 0.05) % 100}%`,
          top: `${(p.y + frame * p.speedY * 0.04) % 100}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          backgroundColor: p.color,
          opacity: p.opacity * (0.5 + Math.sin(frame * 0.05 + i) * 0.5),
        }} />
      ))}

      {/* Corner HUD brackets */}
      {([
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ] as Array<React.CSSProperties>).map((pos, i) => (
        <div key={`c${i}`} style={{
          position: 'absolute', width: 50, height: 50,
          borderTop: i < 2 ? '3px solid rgba(245,158,11,0.5)' : undefined,
          borderBottom: i >= 2 ? '3px solid rgba(245,158,11,0.5)' : undefined,
          borderLeft: i % 2 === 0 ? '3px solid rgba(245,158,11,0.5)' : undefined,
          borderRight: i % 2 === 1 ? '3px solid rgba(245,158,11,0.5)' : undefined,
          ...pos,
        }} />
      ))}

      {/* Vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 45%, rgba(0,0,0,0.7) 100%)',
      }} />

    </AbsoluteFill>
  )
}

// ── GlowText ──────────────────────────────────────────────────────────────────

export const GlowText: React.FC<{
  children: React.ReactNode
  brand: BrandConfig
  size?: number
  glow?: boolean
}> = ({ children, brand, size = 96, glow = true }) => (
  <div
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: size,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      background: `linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 40%, ${brand.colors.accent} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: glow ? 'drop-shadow(0 0 40px rgba(245,158,11,0.3))' : 'none',
      textAlign: 'center',
    }}
  >
    {children}
  </div>
)

// ── GlowButton ────────────────────────────────────────────────────────────────

export const GlowButton: React.FC<{
  text: string
  brand: BrandConfig
  scale?: number
}> = ({ text, brand, scale = 1 }) => (
  <div
    style={{
      transform: `scale(${scale})`,
      background: `linear-gradient(135deg, ${brand.colors.accent} 0%, ${brand.colors.accentAlt} 100%)`,
      color: '#0A0F1E',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 30,
      fontWeight: 700,
      padding: '22px 56px',
      borderRadius: 12,
      boxShadow:
        'rgba(245,158,11,0.4) 0px 0px 40px, rgba(245,158,11,0.15) 0px 0px 80px, inset 0 1px 0 rgba(255,255,255,0.2)',
      letterSpacing: '-0.01em',
    }}
  >
    {text}
  </div>
)

// ── GlassCard ─────────────────────────────────────────────────────────────────

export const GlassCard: React.FC<{
  children: React.ReactNode
  brand: BrandConfig
  glow?: boolean
}> = ({ children, brand, glow = false }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '24px 32px',
      backdropFilter: 'blur(12px)',
      boxShadow: glow
        ? '0 0 0 1px rgba(245,158,11,0.2), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}
  >
    {children}
  </div>
)

// ── AIBadge ───────────────────────────────────────────────────────────────────

export const AIBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.6 + Math.sin(frame * 0.15) * 0.4
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 100,
        padding: '10px 24px',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 20,
        fontWeight: 600,
        color: '#F59E0B',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#22C55E',
          boxShadow: `0 0 ${10 * pulse}px rgba(34,197,94,0.8)`,
        }}
      />
      AI-Powered CRO Analysis
    </div>
  )
}

// ── LogoOverlay ───────────────────────────────────────────────────────────────

export const LogoOverlay: React.FC<{ brand: BrandConfig; frame: number }> = ({
  brand,
  frame,
}) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 40, left: 60, opacity }}>
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{ height: 80, width: 'auto' }}
        />
      </div>
    </AbsoluteFill>
  )
}
