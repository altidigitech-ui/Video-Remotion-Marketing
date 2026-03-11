import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LeakDetectorScene } from '../components/LeakDetectorScene'

export type LDProductDemoProps = {
  brand: BrandConfig
  headline: string
  subline: string
  features: string[]
  ctaText: string
  ctaUrl?: string
}

export const LDProductDemo: React.FC<LDProductDemoProps> = ({
  brand,
  headline,
  subline,
  features,
  ctaText,
}) => {
  const { fps, durationInFrames } = useVideoConfig()

  const introFrom = 0
  const introDuration = Math.round(fps * 2) // 2s
  const featuresFrom = Math.round(fps * 1) // start at 1s (slight overlap for flow)
  const featuresDuration = Math.round(fps * 5) // 5s
  const ctaFrom = durationInFrames - Math.round(fps * 3) // last 3s
  const ctaDuration = durationInFrames - ctaFrom

  return (
    <LeakDetectorScene brand={brand}>
      <Sequence from={introFrom} durationInFrames={introDuration} name="Intro">
        <IntroSection brand={brand} headline={headline} subline={subline} />
      </Sequence>

      <Sequence from={featuresFrom} durationInFrames={featuresDuration} name="Features">
        <FeaturesSection brand={brand} features={features} />
      </Sequence>

      <Sequence from={ctaFrom} durationInFrames={ctaDuration} name="CTA">
        <GradientCTA brand={brand} text={ctaText} />
      </Sequence>
    </LeakDetectorScene>
  )
}

const GradientHeadline: React.FC<{
  brand: BrandConfig
  text: string
  fontSize: number
}> = ({ brand, text, fontSize }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #FBBF24, #60A5FA)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontFamily: brand.typography.fontDisplay,
      fontSize,
      fontWeight: brand.typography.weightBold,
      letterSpacing: `${brand.typography.trackingTight}em`,
      lineHeight: brand.typography.lineHeightTight,
      textAlign: 'center' as const,
    }}
  >
    {text}
  </div>
)

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
    config: brand.motion.springBouncy,
  })

  const headlineOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const sublineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const sublineY = spring({
    frame: frame - 20,
    fps,
    from: 20,
    to: 0,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: brand.spacing.md,
        padding: brand.spacing.paddingScreen,
      }}
    >
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <GradientHeadline brand={brand} text={headline} fontSize={brand.typography.size4xl} />
      </div>
      <div
        style={{
          opacity: sublineOpacity,
          transform: `translateY(${sublineY}px)`,
          fontFamily: brand.typography.fontBody,
          fontSize: brand.typography.sizeLg,
          color: brand.colors.textSecondary,
          textAlign: 'center',
          maxWidth: 800,
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
          const itemDelay = i * 12

          const translateX = spring({
            frame: frame - itemDelay,
            fps,
            from: -60,
            to: 0,
            config: brand.motion.springBouncy,
          })

          const opacity = interpolate(frame, [itemDelay, itemDelay + 18], [0, 1], {
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
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
                  boxShadow: `0 0 8px ${brand.colors.accent}60`,
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

const GradientCTA: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
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
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: brand.colors.white,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.sizeLg,
          fontWeight: brand.typography.weightBold,
          padding: `${brand.spacing.md}px ${brand.spacing.xl}px`,
          borderRadius: brand.spacing.borderRadiusLg,
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.35), 0 8px 24px rgba(245, 158, 11, 0.25)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}
