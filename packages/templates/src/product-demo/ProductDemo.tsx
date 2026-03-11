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

  // ── Headline animations ───────────────────────────────────────────────────

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

  // After intro, headline shrinks and moves up
  const headlineFontSize = interpolate(
    frame,
    [introDuration - 20, introDuration + 10],
    [brand.typography.size4xl, brand.typography.size2xl],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const headlineTopY = interpolate(
    frame,
    [introDuration - 20, introDuration + 10],
    [340, 180],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Subline ───────────────────────────────────────────────────────────────

  const sublineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Subline fades out as features come in
  const sublineFadeOut = interpolate(
    frame,
    [introDuration - 20, introDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // ── Features ──────────────────────────────────────────────────────────────

  const featuresVisible = frame >= introDuration

  // ── CTA ───────────────────────────────────────────────────────────────────

  const ctaVisible = frame >= ctaStart

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
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Headline — centered during intro, moves to top after */}
      <div
        style={{
          position: 'absolute',
          top: headlineTopY,
          left: 0,
          right: 0,
          opacity: headlineOpacity,
          transform: `translateY(${frame < introDuration ? headlineY : 0}px)`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: headlineFontSize,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.textPrimary,
          letterSpacing: `${brand.typography.trackingTight}em`,
          lineHeight: brand.typography.lineHeightTight,
          textAlign: 'center',
          padding: `0 ${brand.spacing.paddingScreen}px`,
        }}
      >
        {headline}
      </div>

      {/* Subline — visible during intro only */}
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 0,
          right: 0,
          opacity: sublineOpacity * sublineFadeOut,
          fontFamily: brand.typography.fontBody,
          fontSize: brand.typography.sizeLg,
          color: brand.colors.textSecondary,
          textAlign: 'center',
          padding: `0 ${brand.spacing.paddingScreen}px`,
        }}
      >
        {subline}
      </div>

      {/* Features list — appears after intro */}
      {featuresVisible && (
        <div
          style={{
            position: 'absolute',
            top: 320,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `0 ${brand.spacing.paddingScreen}px`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: brand.spacing.md }}>
            {features.map((feature, i) => {
              const itemDelay = i * 15
              const featureFrame = frame - introDuration

              const translateX = spring({
                frame: featureFrame - itemDelay,
                fps,
                from: -60,
                to: 0,
                config: brand.motion.springSmooth,
              })

              const opacity = interpolate(
                featureFrame,
                [itemDelay, itemDelay + 20],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              )

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
        </div>
      )}

      {/* CTA button — appears at ctaStart */}
      {ctaVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
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
        </div>
      )}
    </AbsoluteFill>
  )
}
