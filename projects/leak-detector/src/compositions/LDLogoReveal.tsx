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
import type { BrandConfig } from '@altidigitech/brand'
import { LeakDetectorBackground } from '../components/LeakDetectorBackground'

export type LDLogoRevealProps = {
  brand: BrandConfig
  showTagline?: boolean
}

export const LDLogoReveal: React.FC<LDLogoRevealProps> = ({
  brand,
  showTagline = true,
}) => {
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

  // Amber glow pulse behind logo
  const glowPulse = Math.sin(frame * 0.08) * 0.15 + 0.85

  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineY = spring({
    frame: frame - 40,
    fps,
    from: 20,
    to: 0,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill>
      <LeakDetectorBackground />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: brand.spacing.lg,
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
          {/* Glow layer */}
          <div
            style={{
              position: 'absolute',
              inset: -40,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(245, 158, 11, ${0.25 * glowPulse}) 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <Img
            src={staticFile(brand.assets.logoPng)}
            style={{
              width: 200,
              height: 200,
              borderRadius: 36,
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>

        {/* Gradient tagline */}
        {showTagline && (
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              background: 'linear-gradient(135deg, #FBBF24, #60A5FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: brand.typography.fontDisplay,
              fontSize: brand.typography.sizeXl,
              fontWeight: brand.typography.weightSemibold,
              letterSpacing: `${brand.typography.trackingWide}em`,
            }}
          >
            {brand.tagline}
          </div>
        )}

        {/* Brand name */}
        <div
          style={{
            opacity: interpolate(frame, [60, 90], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            fontFamily: brand.typography.fontDisplay,
            fontSize: brand.typography.size3xl,
            fontWeight: brand.typography.weightBold,
            color: brand.colors.textPrimary,
            letterSpacing: `${brand.typography.trackingTight}em`,
          }}
        >
          {brand.name}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
