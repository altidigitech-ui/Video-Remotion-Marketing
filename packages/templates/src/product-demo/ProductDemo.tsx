import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'

export const productDemoSchema = z.object({
  brand: z.custom<BrandConfig>(),
  headline: z.string(),
  subline: z.string(),
  features: z.array(z.string()).min(1).max(8),
  ctaText: z.string().default('Get started'),
  ctaUrl: z.string().optional(),
})

export type ProductDemoProps = z.infer<typeof productDemoSchema>

export const ProductDemoTemplate: React.FC<ProductDemoProps> = ({
  brand,
  headline,
  subline,
  features,
  ctaText,
}) => {
  const { durationInFrames } = useVideoConfig()

  const introDuration = 90
  const featuresDuration = durationInFrames - introDuration - 90
  const ctaStart = durationInFrames - 90

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Intro: headline + subline */}
      <Sequence from={0} durationInFrames={ctaStart} name="Intro">
        <IntroSection brand={brand} headline={headline} subline={subline} />
      </Sequence>

      {/* Features stagger */}
      <Sequence from={introDuration} durationInFrames={featuresDuration} name="Features">
        <FeaturesSection brand={brand} features={features} />
      </Sequence>

      {/* CTA */}
      <Sequence from={ctaStart} durationInFrames={durationInFrames - ctaStart} name="CTA">
        <CTASection brand={brand} ctaText={ctaText} />
      </Sequence>
    </AbsoluteFill>
  )
}

const IntroSection: React.FC<{
  brand: BrandConfig
  headline: string
  subline: string
}> = ({ brand, headline, subline }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const headlineY = spring({
    frame,
    fps,
    from: 40,
    to: 0,
    config: brand.motion.springSmooth,
  })

  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const sublineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: brand.spacing.sm,
        padding: brand.spacing.paddingScreen,
      }}
    >
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.size4xl,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.textPrimary,
          letterSpacing: `${brand.typography.trackingTight}em`,
          lineHeight: brand.typography.lineHeightTight,
          textAlign: 'center',
        }}
      >
        {headline}
      </div>
      <div
        style={{
          opacity: sublineOpacity,
          fontFamily: brand.typography.fontBody,
          fontSize: brand.typography.sizeLg,
          color: brand.colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {subline}
      </div>
    </AbsoluteFill>
  )
}

const FeaturesSection: React.FC<{
  brand: BrandConfig
  features: string[]
}> = ({ brand, features }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: brand.spacing.paddingScreen,
        paddingTop: 240,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: brand.spacing.md }}>
        {features.map((feature, i) => {
          const itemDelay = i * 15

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
              {feature}
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

const CTASection: React.FC<{
  brand: BrandConfig
  ctaText: string
}> = ({ brand, ctaText }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          backgroundColor: brand.colors.accent,
          color: brand.colors.white,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.sizeLg,
          fontWeight: brand.typography.weightBold,
          padding: `${brand.spacing.md}px ${brand.spacing.xl}px`,
          borderRadius: brand.spacing.borderRadius,
        }}
      >
        {ctaText}
      </div>
    </AbsoluteFill>
  )
}
