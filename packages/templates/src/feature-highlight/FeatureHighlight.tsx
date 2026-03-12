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
import { LDBackground, GlowText, GlowButton, LogoOverlay } from '@altidigitech/core'

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
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Title */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Title">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 100,
            padding: brand.spacing.paddingScreen,
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            <GlowText brand={brand} size={86}>
              {featureTitle}
            </GlowText>
          </div>
          <div
            style={{
              opacity: descOpacity,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              color: '#94A3B8',
              textAlign: 'center',
              marginTop: brand.spacing.sm,
              maxWidth: 900,
              lineHeight: 1.4,
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
            padding: brand.spacing.paddingScreen,
            paddingTop: 80,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'flex-start' }}>
            {bulletPoints.map((point, i) => (
              <BulletItem key={i} brand={brand} point={point} index={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA */}
      {ctaText && (
        <Sequence from={250} durationInFrames={durationInFrames - 250} name="CTA">
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
          backgroundColor: brand.colors.accent,
          boxShadow: `0 0 12px ${brand.colors.accent}80`,
          flexShrink: 0,
        }}
      />
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

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80 }}>
      <div style={{ opacity }}>
        <GlowButton text={text} brand={brand} scale={scale} />
      </div>
    </AbsoluteFill>
  )
}
