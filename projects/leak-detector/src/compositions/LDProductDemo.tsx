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
import { LDBackground, GlowText, GlowButton, GlassCard, LogoOverlay } from '@altidigitech/core'

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
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const introFrom = 0
  const introDuration = 90 // 1.5s at 60fps
  const featuresFrom = 90 // starts exactly when intro ends — zero overlap
  const featuresDuration = durationInFrames - featuresFrom - 90 // fill until CTA
  const ctaFrom = durationInFrames - 90 // last 1.5s
  const ctaDuration = 90

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      <Sequence from={introFrom} durationInFrames={introDuration} name="Intro">
        <IntroSection brand={brand} headline={headline} subline={subline} />
      </Sequence>

      <Sequence from={featuresFrom} durationInFrames={featuresDuration} name="Features">
        <FeaturesSection brand={brand} features={features} />
      </Sequence>

      <Sequence from={ctaFrom} durationInFrames={ctaDuration} name="CTA">
        <CTASection brand={brand} text={ctaText} />
      </Sequence>

      <LogoOverlay brand={brand} frame={frame} />
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
        gap: 24,
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <GlowText brand={brand} size={86}>
          {headline}
        </GlowText>
      </div>
      <div
        style={{
          opacity: sublineOpacity,
          transform: `translateY(${sublineY}px)`,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 36,
          color: '#94A3B8',
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.4,
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
        padding: 80,
        paddingTop: 200,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                gap: 20,
                color: '#F8FAFC',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 40,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
                  boxShadow: `0 0 12px ${brand.colors.accent}80`,
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

const CTASection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
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
      <div style={{ opacity }}>
        <GlowButton text={text} brand={brand} scale={scale} />
      </div>
    </AbsoluteFill>
  )
}
