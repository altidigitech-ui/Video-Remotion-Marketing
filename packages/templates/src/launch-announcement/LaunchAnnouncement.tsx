import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { z } from 'zod'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText, GlowButton, GlassCard, AIBadge, LogoOverlay } from '@altidigitech/core'

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

  // ── Animations ──────────────────────────────────────────────────────────────

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

  const sublineOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const dateOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ctaStart = durationInFrames - 90
  const ctaScale = spring({
    frame: frame - ctaStart,
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20,
          padding: 80,
        }}
      >
        {/* "ANNOUNCING" label */}
        <div style={{ opacity: announcingOpacity }}>
          <AIBadge frame={frame} />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
          }}
        >
          <GlowText brand={brand} size={72}>
            {headline}
          </GlowText>
        </div>

        {/* Subline */}
        {subline && (
          <div
            style={{
              opacity: sublineOpacity,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              color: '#94A3B8',
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
              opacity: dateOpacity,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              color: '#F59E0B',
            }}
          >
            {launchDate}
          </div>
        )}

        {/* Feature pills */}
        {features && features.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 16,
            }}
          >
            {features.map((feature, i) => {
              const featureDelay = 90 + i * 12
              const featureOpacity = interpolate(
                frame,
                [featureDelay, featureDelay + 18],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              )
              const featureScale = spring({
                frame: frame - featureDelay,
                fps,
                from: 0.85,
                to: 1,
                config: brand.motion.springBouncy,
              })

              return (
                <div
                  key={i}
                  style={{
                    opacity: featureOpacity,
                    transform: `scale(${featureScale})`,
                  }}
                >
                  <GlassCard brand={brand}>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 18,
                        color: '#CBD5E1',
                      }}
                    >
                      {feature}
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        )}
      </AbsoluteFill>

      {/* CTA */}
      {frame >= ctaStart && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: ctaOpacity,
          }}
        >
          <GlowButton text={ctaText} brand={brand} scale={ctaScale} />
        </div>
      )}

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
