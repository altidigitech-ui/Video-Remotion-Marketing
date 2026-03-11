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
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText, AIBadge, LogoOverlay } from '@altidigitech/core'

export const logoRevealSchema = z.object({
  brand: z.custom<BrandConfig>(),
  showTagline: z.boolean().default(true),
})

export type LogoRevealProps = z.infer<typeof logoRevealSchema>

const DATA_CHARS = ['0', '1', '<', '>', '/', '%', '#', '@', ',', '&']
const rainCols = Array.from({ length: 10 }, (_, i) => ({
  x: 4 + i * 10,
  chars: Array.from({ length: 10 }, (_, j) => DATA_CHARS[(i * 3 + j * 7) % DATA_CHARS.length]),
}))

export const LogoRevealTemplate: React.FC<LogoRevealProps> = ({ brand, showTagline = true }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const badgeOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineY = spring({
    frame: frame - 30,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springCinematic,
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Data rain columns */}
      {rainCols.map((col, ci) => (
        <div key={`rain${ci}`} style={{
          position: 'absolute',
          left: `${col.x}%`,
          top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', gap: 70,
          transform: `translateY(${((frame * 2.5 + ci * 40) % 1400) - 300}px)`,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18,
          color: '#F59E0B',
          opacity: 0.12,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {col.chars.map((c, ji) => (
            <span key={ji} style={{
              opacity: frame % 20 === (ji + ci) % 20 ? 0.7 : 0.15,
            }}>{c}</span>
          ))}
        </div>
      ))}

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Logo with amber glow */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            position: 'relative',
          }}
        >
          <Img
            src={staticFile(brand.assets.logoPng)}
            style={{
              width: 300,
              height: 300,
              borderRadius: 48,
              boxShadow: '0 0 60px rgba(245,158,11,0.5), 0 0 120px rgba(245,158,11,0.2)',
            }}
          />
        </div>

        {/* Tagline */}
        {showTagline && (
          <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}>
            <GlowText brand={brand} size={48} glow={false}>
              {brand.tagline}
            </GlowText>
          </div>
        )}

        {/* AIBadge */}
        <div style={{ opacity: badgeOpacity }}>
          <AIBadge frame={frame} />
        </div>
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
