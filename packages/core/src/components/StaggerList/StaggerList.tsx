import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'

export type StaggerListProps = {
  brand: BrandConfig
  items: string[]
  startAt?: number
  staggerFrames?: number
}

export const StaggerList: React.FC<StaggerListProps> = ({
  brand,
  items,
  startAt = 0,
  staggerFrames = 15,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: brand.spacing.md }}>
      {items.map((item, i) => {
        const itemDelay = startAt + i * staggerFrames

        const translateX = spring({
          frame: frame - itemDelay,
          fps,
          from: -60,
          to: 0,
          config: brand.motion.springSmooth,
        })

        const opacity = interpolate(frame, [itemDelay, itemDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: brand.spacing.sm,
              color: brand.colors.textPrimary,
              fontFamily: brand.typography.fontBody,
              fontSize: brand.typography.sizeXl,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: brand.colors.accent,
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        )
      })}
    </div>
  )
}
