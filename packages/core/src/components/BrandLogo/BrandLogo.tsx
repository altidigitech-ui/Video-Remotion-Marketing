import React from 'react'
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type BrandLogoProps = {
  brand: BrandConfig
  variant?: 'default' | 'white' | 'dark'
  size?: number
  animate?: boolean
  delay?: number
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  variant = 'white',
  size = 120,
  animate = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoSrc =
    variant === 'white'
      ? (brand.assets.logoWhite ?? brand.assets.logoSvg)
      : variant === 'dark'
        ? (brand.assets.logoDark ?? brand.assets.logoPng)
        : brand.assets.logoSvg

  const scale = animate
    ? spring({
        frame: frame - delay,
        fps,
        from: 0.8,
        to: 1,
        config: brand.motion.springBouncy,
      })
    : 1

  const opacity = animate
    ? interpolate(frame, [delay, delay + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1

  return (
    <Img
      src={staticFile(logoSrc)}
      style={{
        width: size,
        height: 'auto',
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  )
}
