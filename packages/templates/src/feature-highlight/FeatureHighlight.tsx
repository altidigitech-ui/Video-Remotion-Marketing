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
import { LogoOverlay } from '@altidigitech/core'

export const featureHighlightSchema = z.object({
  brand: z.custom<BrandConfig>(),
  featureTitle: z.string(),
  featureDescription: z.string(),
  bulletPoints: z.array(z.string()).min(1).max(6),
  ctaText: z.string().optional(),
})

export type FeatureHighlightProps = z.infer<typeof featureHighlightSchema>

export const FeatureHighlightTemplate: React.FC<FeatureHighlightProps> = ({
  brand,
  featureTitle,
  featureDescription,
  bulletPoints,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const titleY = spring({
    frame,
    fps,
    from: 40,
    to: 0,
    config: brand.motion.springSmooth,
  })

  const descOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Title */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Title">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: brand.spacing.paddingSection,
            padding: brand.spacing.paddingScreen,
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontFamily: brand.typography.fontDisplay,
              fontSize: brand.typography.size4xl,
              fontWeight: brand.typography.weightBold,
              color: brand.colors.textPrimary,
              letterSpacing: `${brand.typography.trackingTight}em`,
              textAlign: 'center',
            }}
          >
            {featureTitle}
          </div>
          <div
            style={{
              opacity: descOpacity,
              fontFamily: brand.typography.fontBody,
              fontSize: brand.typography.sizeLg,
              color: brand.colors.textSecondary,
              textAlign: 'center',
              marginTop: brand.spacing.sm,
              maxWidth: 800,
            }}
          >
            {featureDescription}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Bullet points */}
      <Sequence from={60} durationInFrames={durationInFrames - 60} name="Bullets">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 200,
            padding: brand.spacing.paddingScreen,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: brand.spacing.md }}>
            {bulletPoints.map((point, i) => (
              <BulletItem key={i} brand={brand} point={point} index={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA */}
      {ctaText && (
        <Sequence from={durationInFrames - 90} durationInFrames={90} name="CTA">
          <CTAButton brand={brand} text={ctaText} />
        </Sequence>
      )}

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}

const BulletItem: React.FC<{ brand: BrandConfig; point: string; index: number }> = ({
  brand,
  point,
  index,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const itemDelay = index * 15

  const itemOpacity = interpolate(frame, [itemDelay, itemDelay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const itemX = spring({
    frame: frame - itemDelay,
    fps,
    from: -40,
    to: 0,
    config: brand.motion.springSmooth,
  })

  return (
    <div
      style={{
        opacity: itemOpacity,
        transform: `translateX(${itemX}px)`,
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
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: brand.colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.sizeSm,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.white,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      {point}
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
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120 }}>
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
