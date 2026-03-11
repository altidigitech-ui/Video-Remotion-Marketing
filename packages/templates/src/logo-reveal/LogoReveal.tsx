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

  // Scan line sweeps top→bottom over logo (frame 0-60)
  const scanLineY = interpolate(frame, [0, 60], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scanLineOpacity = interpolate(frame, [0, 5, 50, 60], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const badgeOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineY = spring({
    frame: frame - 40,
    fps,
    from: 20,
    to: 0,
    config: brand.motion.springCinematic,
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Logo with glow + scan line */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            filter: 'drop-shadow(0 0 60px rgba(245,158,11,0.4))',
            position: 'relative',
          }}
        >
          <Img
            src={staticFile(brand.assets.logoPng)}
            style={{ width: 200, height: 200, borderRadius: 36 }}
          />
          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: scanLineY,
              height: 2,
              backgroundColor: `rgba(245,158,11,${scanLineOpacity})`,
              boxShadow: `0 0 20px rgba(245,158,11,${scanLineOpacity * 0.8})`,
            }}
          />
        </div>

        {/* AIBadge */}
        <div style={{ opacity: badgeOpacity }}>
          <AIBadge frame={frame} />
        </div>

        {/* Tagline */}
        {showTagline && (
          <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}>
            <GlowText brand={brand} size={32} glow={false}>
              {brand.tagline}
            </GlowText>
          </div>
        )}
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
