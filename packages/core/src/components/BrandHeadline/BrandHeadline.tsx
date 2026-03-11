import React from 'react'
import type { BrandConfig } from '@altidigitech/brand'

export type BrandHeadlineProps = {
  brand: BrandConfig
  text: string
  size?: 'size2xl' | 'size3xl' | 'size4xl' | 'size5xl' | 'size6xl' | 'size7xl'
  color?: 'primary' | 'accent' | 'muted'
  gradient?: boolean
  align?: 'left' | 'center' | 'right'
}

export const BrandHeadline: React.FC<BrandHeadlineProps> = ({
  brand,
  text,
  size = 'size4xl',
  color = 'primary',
  gradient = false,
  align = 'center',
}) => {
  const colorMap = {
    primary: brand.colors.textPrimary,
    accent: brand.colors.accent,
    muted: brand.colors.textMuted,
  }

  const textStyle: React.CSSProperties = gradient
    ? {
        background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : { color: colorMap[color] }

  return (
    <div
      style={{
        ...textStyle,
        fontFamily: brand.typography.fontDisplay,
        fontSize: brand.typography[size],
        fontWeight: brand.typography.weightBold,
        letterSpacing: `${brand.typography.trackingTight}em`,
        lineHeight: brand.typography.lineHeightTight,
        textAlign: align,
      }}
    >
      {text}
    </div>
  )
}
