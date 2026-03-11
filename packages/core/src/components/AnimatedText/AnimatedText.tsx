import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type AnimatedTextProps = {
  brand: BrandConfig
  text: string
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn'
  delay?: number
  fontSize?: number
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  brand,
  text,
  animation = 'fadeIn',
  delay = 0,
  fontSize,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const resolvedFontSize = fontSize ?? brand.typography.size3xl

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const getTransform = (): string => {
    switch (animation) {
      case 'slideUp': {
        const translateY = spring({
          frame: frame - delay,
          fps,
          from: 60,
          to: 0,
          config: brand.motion.springSmooth,
        })
        return `translateY(${translateY}px)`
      }
      case 'scaleIn': {
        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0.8,
          to: 1,
          config: brand.motion.springBouncy,
        })
        return `scale(${scale})`
      }
      case 'fadeIn':
      default:
        return 'none'
    }
  }

  return (
    <div
      style={{
        opacity,
        transform: getTransform(),
        color: brand.colors.textPrimary,
        fontFamily: brand.typography.fontDisplay,
        fontSize: resolvedFontSize,
        fontWeight: brand.typography.weightBold,
        letterSpacing: `${brand.typography.trackingTight}em`,
        lineHeight: brand.typography.lineHeightTight,
      }}
    >
      {text}
    </div>
  )
}
