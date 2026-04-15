import React from 'react'
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { StoreMDBackground } from './StoreMDBackground'

export type StoreMDSceneProps = {
  brand: BrandConfig
  children: React.ReactNode
  showLogo?: boolean
  logoSize?: number
}

export const StoreMDScene: React.FC<StoreMDSceneProps> = ({
  brand,
  children,
  showLogo = true,
  logoSize = 52,
}) => {
  const frame = useCurrentFrame()

  const logoOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      {children}

      {/* Logo overlay — bottom right, only one per composition */}
      {showLogo && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 52,
              opacity: logoOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Img
              src={staticFile(brand.assets.logoPng)}
              style={{
                height: logoSize,
                width: logoSize,
                borderRadius: 10,
                filter:
                  'drop-shadow(0 4px 16px rgba(0,0,0,0.85)) drop-shadow(0 0 8px rgba(6,182,212,0.3))',
              }}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
