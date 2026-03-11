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

  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineY = spring({
    frame: frame - 40,
    fps,
    from: 20,
    to: 0,
    config: brand.motion.springSmooth,
  })

  const logoSrc = brand.assets.logoPng

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: brand.spacing.lg,
      }}
    >
      <Img
        src={staticFile(logoSrc)}
        style={{
          width: 200,
          height: 'auto',
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      />

      {showTagline && (
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontFamily: brand.typography.fontDisplay,
            fontSize: brand.typography.sizeLg,
            fontWeight: brand.typography.weightMedium,
            color: brand.colors.textSecondary,
            letterSpacing: `${brand.typography.trackingWide}em`,
          }}
        >
          {brand.tagline}
        </div>
      )}
    </AbsoluteFill>
  )
}
