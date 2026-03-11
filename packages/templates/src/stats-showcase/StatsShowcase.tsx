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
import { LDBackground, GlowText, GlassCard, LogoOverlay } from '@altidigitech/core'

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
  const { fps } = useVideoConfig()

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
            top: 100,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          <GlowText brand={brand} size={48}>
            {headline}
          </GlowText>
        </div>
      )}

      {/* Stats grid */}
      <div
        style={{
          position: 'absolute',
          top: headline ? 240 : 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 80px',
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
                flex: 1,
                maxWidth: 280,
              }}
            >
              <GlassCard brand={brand} glow>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 80,
                      fontWeight: 800,
                      color: '#F59E0B',
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1,
                    }}
                  >
                    {stat.prefix}
                    {displayValue}
                    {stat.suffix}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 18,
                      color: '#94A3B8',
                      textAlign: 'center',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
