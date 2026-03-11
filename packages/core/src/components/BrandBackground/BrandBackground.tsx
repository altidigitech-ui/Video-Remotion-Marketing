import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type BrandBackgroundProps = {
  brand: BrandConfig
  variant?: 'solid' | 'gradient' | 'radial'
  animated?: boolean
}

export const BrandBackground: React.FC<BrandBackgroundProps> = ({
  brand,
  variant = 'solid',
  animated = false,
}) => {
  const frame = useCurrentFrame()

  const getBackground = (): string => {
    switch (variant) {
      case 'gradient': {
        const angle = animated ? 135 + frame * 0.1 : 135
        return `linear-gradient(${angle}deg, ${brand.colors.background}, ${brand.colors.backgroundAlt})`
      }
      case 'radial':
        return `radial-gradient(ellipse at center, ${brand.colors.backgroundAlt} 0%, ${brand.colors.background} 70%)`
      case 'solid':
      default:
        return brand.colors.background
    }
  }

  return <AbsoluteFill style={{ background: getBackground() }} />
}
