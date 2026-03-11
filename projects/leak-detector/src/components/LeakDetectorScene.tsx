import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LeakDetectorBackground } from './LeakDetectorBackground'
import { LeakDetectorBadge } from './LeakDetectorBadge'

export type LeakDetectorSceneProps = {
  brand: BrandConfig
  children: React.ReactNode
  showLogo?: boolean
  showBadge?: boolean
  logoSize?: number
}

export const LeakDetectorScene: React.FC<LeakDetectorSceneProps> = ({
  brand,
  children,
  showLogo = true,
  showBadge = true,
  logoSize = 80,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const logoScale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill>
      <LeakDetectorBackground />

      {children}

      {/* Logo — top left */}
      {showLogo && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile(brand.assets.logoPng)}
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize * 0.18,
            }}
          />
        </div>
      )}

      {/* Badge — top center */}
      {showBadge && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <LeakDetectorBadge brand={brand} />
        </div>
      )}
    </AbsoluteFill>
  )
}
