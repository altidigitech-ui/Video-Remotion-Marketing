import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'

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
  const { durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Headline */}
      {headline && (
        <Sequence from={0} durationInFrames={durationInFrames} name="Headline">
          <HeadlineSection brand={brand} text={headline} />
        </Sequence>
      )}

      {/* Stats */}
      <Sequence from={headline ? 45 : 0} durationInFrames={durationInFrames} name="Stats">
        <StatsGrid brand={brand} stats={stats} hasHeadline={!!headline} />
      </Sequence>
    </AbsoluteFill>
  )
}

const HeadlineSection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const translateY = spring({
    frame,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springSmooth,
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: brand.spacing.paddingSection,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.size3xl,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.textPrimary,
          letterSpacing: `${brand.typography.trackingTight}em`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

type StatItem = z.infer<typeof statSchema>

const StatsGrid: React.FC<{
  brand: BrandConfig
  stats: StatItem[]
  hasHeadline: boolean
}> = ({ brand, stats, hasHeadline }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hasHeadline ? 100 : 0,
        flexDirection: 'row',
        gap: brand.spacing.xl,
        padding: brand.spacing.paddingScreen,
      }}
    >
      {stats.map((stat, i) => {
        const staggerDelay = i * 20

        const scale = spring({
          frame: frame - staggerDelay,
          fps,
          from: 0.8,
          to: 1,
          config: brand.motion.springBouncy,
        })

        const opacity = interpolate(frame, [staggerDelay, staggerDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

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

        const currentValue = Math.round(stat.value * counterProgress)

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `scale(${scale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: brand.spacing.xs,
            }}
          >
            <div
              style={{
                fontFamily: brand.typography.fontDisplay,
                fontSize: brand.typography.size5xl,
                fontWeight: brand.typography.weightBold,
                color: brand.colors.accent,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {stat.prefix}
              {currentValue.toLocaleString()}
              {stat.suffix}
            </div>
            <div
              style={{
                fontFamily: brand.typography.fontBody,
                fontSize: brand.typography.sizeMd,
                color: brand.colors.textSecondary,
              }}
            >
              {stat.label}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
