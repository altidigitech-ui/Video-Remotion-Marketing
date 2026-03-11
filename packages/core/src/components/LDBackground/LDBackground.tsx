import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

// ── LDBackground ──────────────────────────────────────────────────────────────

export const LDBackground: React.FC<{ brand: BrandConfig }> = ({ brand }) => {
  const frame = useCurrentFrame()
  const orb1X = 75 + Math.sin(frame * 0.008) * 3
  const orb1Y = 15 + Math.cos(frame * 0.006) * 2

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: '#0A0F1E' }} />

      {/* Animated grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(248,163,32,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,163,32,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Amber orb top-right */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 600px 400px at ${orb1X}% ${orb1Y}%, rgba(245,158,11,0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Blue orb bottom-left */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 500px 350px at 15% 85%, rgba(59,130,246,0.10) 0%, transparent 70%)`,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)`,
        }}
      />
    </AbsoluteFill>
  )
}

// ── GlowText ──────────────────────────────────────────────────────────────────

export const GlowText: React.FC<{
  children: React.ReactNode
  brand: BrandConfig
  size?: number
  glow?: boolean
}> = ({ children, brand, size = 72, glow = true }) => (
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
      fontSize: 24,
      fontWeight: 700,
      padding: '20px 48px',
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
        gap: 8,
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 100,
        padding: '8px 20px',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: '#F59E0B',
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#22C55E',
          boxShadow: `0 0 ${8 * pulse}px rgba(34,197,94,0.8)`,
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
          style={{ height: 56, width: 'auto' }}
        />
      </div>
    </AbsoluteFill>
  )
}
