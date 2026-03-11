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

export const launchAnnouncementSchema = z.object({
  brand: z.custom<BrandConfig>(),
  headline: z.string(),
  subline: z.string().optional(),
  launchDate: z.string().optional(),
  features: z.array(z.string()).optional(),
  ctaText: z.string().default('Join the waitlist'),
})

export type LaunchAnnouncementProps = z.infer<typeof launchAnnouncementSchema>

export const LaunchAnnouncementTemplate: React.FC<LaunchAnnouncementProps> = ({
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
    config: brand.motion.springCinematic,
  })

  const headlineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* "Announcing" label */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Announcing">
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

          <div
            style={{
              opacity: headlineOpacity,
              transform: `scale(${headlineScale})`,
              fontFamily: brand.typography.fontDisplay,
              fontSize: brand.typography.size5xl,
              fontWeight: brand.typography.weightBold,
              color: brand.colors.textPrimary,
              letterSpacing: `${brand.typography.trackingTight}em`,
              lineHeight: brand.typography.lineHeightTight,
              textAlign: 'center',
            }}
          >
            {headline}
          </div>

          {subline && (
            <div
              style={{
                opacity: interpolate(frame, [40, 70], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                fontFamily: brand.typography.fontBody,
                fontSize: brand.typography.sizeLg,
                color: brand.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              {subline}
            </div>
          )}

          {launchDate && (
            <div
              style={{
                opacity: interpolate(frame, [60, 90], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                fontFamily: brand.typography.fontMono,
                fontSize: brand.typography.sizeLg,
                color: brand.colors.accent,
                marginTop: brand.spacing.sm,
              }}
            >
              {launchDate}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Features */}
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
            <div
              style={{
                display: 'flex',
                gap: brand.spacing.lg,
              }}
            >
              {features.map((feature, i) => (
                <FeatureItem key={i} brand={brand} feature={feature} index={i} />
              ))}
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* CTA */}
      <Sequence from={durationInFrames - 90} durationInFrames={90} name="CTA">
        <CTAButton brand={brand} text={ctaText} />
      </Sequence>
    </AbsoluteFill>
  )
}

const FeatureItem: React.FC<{ brand: BrandConfig; feature: string; index: number }> = ({
  brand,
  feature,
  index,
}) => {
  const frame = useCurrentFrame()

  const featureOpacity = interpolate(frame, [index * 15, index * 15 + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity: featureOpacity,
        color: brand.colors.textSecondary,
        fontFamily: brand.typography.fontBody,
        fontSize: brand.typography.sizeMd,
        padding: `${brand.spacing.sm}px ${brand.spacing.md}px`,
        border: `1px solid ${brand.colors.border}`,
        borderRadius: brand.spacing.borderRadius,
      }}
    >
      {feature}
    </div>
  )
}

const CTAButton: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80 }}>
      <div
        style={{
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
        {text}
      </div>
    </AbsoluteFill>
  )
}
