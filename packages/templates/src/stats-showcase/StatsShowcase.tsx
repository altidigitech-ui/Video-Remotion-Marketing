import React from 'react'
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText } from '@altidigitech/core'

const statSchema = z.object({
  value: z.number(),
  label: z.string(),
  prefix: z.string().default(''),
  suffix: z.string().default(''),
})

export const statsShowcaseSchema = z.object({
  brand: z.custom<BrandConfig>(),
  headline: z.string().optional(),
  stats: z.array(statSchema).min(1).max(6),
})

export type StatsShowcaseProps = z.infer<typeof statsShowcaseSchema>

export const StatsShowcaseTemplate: React.FC<StatsShowcaseProps> = ({
  brand,
  headline,
  stats,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  const isVertical = height > width

  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineY = spring({
    frame,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Headline */}
      {headline && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          <GlowText brand={brand} size={56}>
            {headline}
          </GlowText>
        </div>
      )}

      {/* Stats grid */}
      <div
        style={{
          position: 'absolute',
          top: headline ? 260 : 0,
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            flexWrap: isVertical ? 'nowrap' : 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isVertical ? 32 : 48,
            width: '100%',
            maxWidth: isVertical ? 900 : 1100,
          }}
        >
          {stats.map((stat, i) => {
            const staggerDelay = (headline ? 45 : 0) + i * 20

            const cardScale = spring({
              frame: frame - staggerDelay,
              fps,
              from: 0.8,
              to: 1,
              config: brand.motion.springBouncy,
            })

            const cardOpacity = interpolate(
              frame,
              [staggerDelay, staggerDelay + 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )

            const counterProgress = interpolate(
              frame,
              [staggerDelay + 10, staggerDelay + 100],
              [0, 1],
              {
                easing: Easing.out(Easing.ease),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              },
            )

            const barProgress = interpolate(
              frame,
              [staggerDelay, staggerDelay + 80],
              [0, 100],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )

            const displayValue =
              stat.value % 1 !== 0
                ? (stat.value * counterProgress).toFixed(1)
                : Math.round(stat.value * counterProgress).toLocaleString()

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  minWidth: isVertical ? undefined : 380,
                  width: isVertical ? '100%' : undefined,
                }}
              >
                <div style={{
                  background: 'rgba(245,158,11,0.04)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderLeft: '5px solid #F59E0B',
                  borderRadius: 16,
                  padding: '40px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: '0 0 60px rgba(245,158,11,0.06)',
                }}>
                  {/* Terminal label */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 16,
                    color: '#F59E0B',
                    letterSpacing: '0.12em',
                    opacity: 0.7,
                  }}>
                    {'>>> METRIC_' + String(i).padStart(2, '0')}
                  </div>

                  {/* Big animated counter */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 96,
                    fontWeight: 800,
                    color: '#F59E0B',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: '0 0 30px rgba(245,158,11,0.8), 0 0 60px rgba(245,158,11,0.3)',
                  }}>
                    {stat.prefix}{displayValue}{stat.suffix}
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 3,
                    background: 'rgba(245,158,11,0.15)',
                    borderRadius: 2,
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 2,
                      width: `${barProgress}%`,
                      background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                      boxShadow: '0 0 10px rgba(245,158,11,0.9)',
                    }} />
                  </div>

                  {/* Label */}
                  <div style={{
                    fontSize: 22,
                    color: '#94A3B8',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </AbsoluteFill>
  )
}
