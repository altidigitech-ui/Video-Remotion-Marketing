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
    <LeakDetectorScene brand={brand}>
      {/* Main content area */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Content">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: brand.spacing.md,
            padding: brand.spacing.paddingScreen,
          }}
        >
          {/* "ANNOUNCING" label */}
          <div
            style={{
              opacity: announcingOpacity,
              fontFamily: brand.typography.fontDisplay,
              fontSize: brand.typography.sizeMd,
              fontWeight: brand.typography.weightSemibold,
              color: brand.colors.accent,
              letterSpacing: `${brand.typography.trackingWidest}em`,
              textTransform: 'uppercase',
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
            <div
              style={{
                background: 'linear-gradient(135deg, #FBBF24, #60A5FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: brand.typography.fontDisplay,
                fontSize: brand.typography.size5xl,
                fontWeight: brand.typography.weightBold,
                letterSpacing: `${brand.typography.trackingTight}em`,
                lineHeight: brand.typography.lineHeightTight,
                textAlign: 'center',
              }}
            >
              {headline}
            </div>
          </div>

          {/* Subline */}
          {subline && (
            <div
              style={{
                opacity: interpolate(frame, [40, 65], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                fontFamily: brand.typography.fontBody,
                fontSize: brand.typography.sizeLg,
                color: brand.colors.textSecondary,
                textAlign: 'center',
                maxWidth: 700,
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
                fontFamily: brand.typography.fontMono,
                fontSize: brand.typography.sizeLg,
                color: brand.colors.accent,
                marginTop: brand.spacing.xs,
              }}
            >
              {launchDate}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Feature pills */}
      {features && features.length > 0 && (
        <Sequence from={90} durationInFrames={durationInFrames - 180} name="Features">
          <AbsoluteFill
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 200,
              padding: brand.spacing.paddingScreen,
            }}
          >
            <div style={{ display: 'flex', gap: brand.spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
              {features.map((feature, i) => (
                <FeaturePill key={i} brand={brand} feature={feature} index={i} />
              ))}
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* CTA */}
      <Sequence from={durationInFrames - 90} durationInFrames={90} name="CTA">
        <GradientCTA brand={brand} text={ctaText} />
      </Sequence>
    </LeakDetectorScene>
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
        color: brand.colors.textSecondary,
        fontFamily: brand.typography.fontBody,
        fontSize: brand.typography.sizeMd,
        padding: `${brand.spacing.sm}px ${brand.spacing.md}px`,
        border: `1px solid ${brand.colors.border}`,
        borderRadius: brand.spacing.borderRadiusLg,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
      }}
    >
      {feature}
    </div>
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
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80 }}>
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
