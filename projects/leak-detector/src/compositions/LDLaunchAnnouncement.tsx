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
import { LDBackground, GlowText, GlowButton, TiltCard, LogoOverlay } from '@altidigitech/core'

export type LDLaunchAnnouncementProps = {
  brand: BrandConfig
  headline: string
  subline?: string
  launchDate?: string
  features?: string[]
  ctaText: string
}

export const LDLaunchAnnouncement: React.FC<LDLaunchAnnouncementProps> = ({
  brand,
  headline,
  subline,
  launchDate,
  features,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const announcingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineScale = spring({
    frame: frame - 20,
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const headlineOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Main content area */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Content">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 24,
            padding: 80,
          }}
        >
          {/* "ANNOUNCING" label */}
          <div
            style={{
              opacity: announcingOpacity,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 28,
              fontWeight: 700,
              color: brand.colors.accent,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(245,158,11,0.5)',
            }}
          >
            Announcing
          </div>

          {/* Gradient headline */}
          <div
            style={{
              opacity: headlineOpacity,
              transform: `scale(${headlineScale})`,
            }}
          >
            <GlowText brand={brand} size={115}>
              {headline}
            </GlowText>
          </div>

          {/* Subline */}
          {subline && (
            <div
              style={{
                opacity: interpolate(frame, [40, 65], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
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
          )}

          {/* Launch date */}
          {launchDate && (
            <div
              style={{
                opacity: interpolate(frame, [60, 85], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 32,
                color: brand.colors.accent,
                marginTop: 8,
                textShadow: '0 0 20px rgba(245,158,11,0.4)',
              }}
            >
              {launchDate}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Feature pills */}
      {features && features.length > 0 && (
        <Sequence from={120} durationInFrames={durationInFrames - 210} name="Features">
          <AbsoluteFill
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 200,
              padding: 80,
            }}
          >
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 110 }}>
              {features.map((feature, i) => (
                <FeaturePill key={i} brand={brand} feature={feature} index={i} />
              ))}
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* CTA */}
      <Sequence from={360} durationInFrames={durationInFrames - 360} name="CTA">
        <CTASection brand={brand} text={ctaText} />
      </Sequence>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}

const FeaturePill: React.FC<{ brand: BrandConfig; feature: string; index: number }> = ({
  brand,
  feature,
  index,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const itemDelay = index * 12

  const opacity = interpolate(frame, [itemDelay, itemDelay + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const scale = spring({
    frame: frame - itemDelay,
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <TiltCard brand={brand} glow startFrame={itemDelay}>
        <div
          style={{
            color: '#F8FAFC',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {feature}
        </div>
      </TiltCard>
    </div>
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
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 48 }}>
      <div style={{ opacity }}>
        <GlowButton text={text} brand={brand} scale={scale} />
      </div>
    </AbsoluteFill>
  )
}
