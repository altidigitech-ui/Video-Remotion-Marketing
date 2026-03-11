import React from 'react'
import { useCurrentFrame } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type TypewriterProps = {
  brand: BrandConfig
  text: string
  startAt?: number
  charsPerFrame?: number
  fontSize?: number
}

export const Typewriter: React.FC<TypewriterProps> = ({
  brand,
  text,
  startAt = 0,
  charsPerFrame = 0.5,
  fontSize,
}) => {
  const frame = useCurrentFrame()
  const resolvedFontSize = fontSize ?? brand.typography.sizeLg

  const charsToShow = Math.min(text.length, Math.max(0, Math.floor((frame - startAt) * charsPerFrame)))
  const displayText = text.slice(0, charsToShow)

  const cursorVisible = charsToShow < text.length ? Math.floor(frame / 8) % 2 === 0 : false

  return (
    <div
      style={{
        color: brand.colors.textPrimary,
        fontSize: resolvedFontSize,
        fontFamily: brand.typography.fontMono,
        fontWeight: brand.typography.weightRegular,
      }}
    >
      {displayText}
      {cursorVisible && <span style={{ color: brand.colors.accent }}>|</span>}
    </div>
  )
}
