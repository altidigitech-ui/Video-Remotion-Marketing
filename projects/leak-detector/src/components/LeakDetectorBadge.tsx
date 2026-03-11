import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type LeakDetectorBadgeProps = {
  brand: BrandConfig
  text?: string
}

export const LeakDetectorBadge: React.FC<LeakDetectorBadgeProps> = ({
  brand,
  text = 'AI-Powered CRO Analysis',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const enterScale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Fade out after 2 seconds
  const fadeOutStart = fps * 2 - 20
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const opacity = Math.min(enterOpacity, fadeOut)

  // Green dot pulse
  const pulse = Math.sin(frame * 0.15) * 0.4 + 0.6

  return (
    <div
      style={{
        opacity,
        transform: `scale(${enterScale})`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 999,
        padding: '8px 16px',
        fontFamily: brand.typography.fontBody,
        fontSize: brand.typography.sizeSm,
        fontWeight: brand.typography.weightMedium,
        color: brand.colors.accent,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#10B981',
          boxShadow: `0 0 ${6 + pulse * 6}px rgba(16, 185, 129, ${pulse})`,
        }}
      />
      {text}
    </div>
  )
}
