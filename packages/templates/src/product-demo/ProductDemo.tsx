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
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const introDuration = 90
  const ctaStart = durationInFrames - 90

  // ── Headline ────────────────────────────────────────────────────────────────

  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineY = spring({
    frame,
    fps,
    from: 40,
    to: 0,
    config: brand.motion.springBouncy,
  })

  // Headline transitions: centered → top
  const headlineSize = interpolate(
    frame,
    [introDuration - 20, introDuration + 10],
    [96, 64],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const headlineTop = interpolate(
    frame,
    [introDuration - 20, introDuration + 10],
    [360, 140],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const headlinePostIntroOpacity = interpolate(
    frame,
    [introDuration - 20, introDuration + 10],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Subline ─────────────────────────────────────────────────────────────────

  const sublineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const sublineFadeOut = interpolate(
    frame,
    [introDuration - 20, introDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Badge ───────────────────────────────────────────────────────────────────

  const badgeOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── CTA ─────────────────────────────────────────────────────────────────────

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

      {/* Badge — top center */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: badgeOpacity,
        }}
      >
        <AIBadge frame={frame} />
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: headlineTop,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: headlineOpacity * headlinePostIntroOpacity,
          transform: `translateY(${frame < introDuration ? headlineY : 0}px)`,
          padding: '0 80px',
        }}
      >
        <GlowText brand={brand} size={headlineSize}>
          {headline}
        </GlowText>
      </div>

      {/* Subline — intro only */}
      <div
        style={{
          position: 'absolute',
          top: 460,
          left: 0,
          right: 0,
          opacity: sublineOpacity * sublineFadeOut,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 36,
          color: '#94A3B8',
          textAlign: 'center',
          padding: '0 120px',
        }}
      >
        {subline}
      </div>

      {/* Features — 2-column grid of GlassCards */}
      {frame >= introDuration && (
        <div
          style={{
            position: 'absolute',
            top: 260,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 100px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              width: '100%',
              maxWidth: 900,
            }}
          >
            {features.map((feature, i) => {
              const featureFrame = frame - introDuration
              const itemDelay = i * 12

              const itemScale = spring({
                frame: featureFrame - itemDelay,
                fps,
                from: 0.85,
                to: 1,
                config: brand.motion.springBouncy,
              })

              const itemOpacity = interpolate(
                featureFrame,
                [itemDelay, itemDelay + 18],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              )

              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    transform: `scale(${itemScale})`,
                  }}
                >
                  <GlassCard brand={brand}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 28,
                        color: '#E2E8F0',
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          boxShadow: '0 0 8px rgba(245,158,11,0.5)',
                          flexShrink: 0,
                        }}
                      />
                      {feature}
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
