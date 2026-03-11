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

export const socialShortSchema = z.object({
  brand: z.custom<BrandConfig>(),
  hookText: z.string(),
  bodyText: z.string().optional(),
  ctaText: z.string().default('Link in bio'),
})

export type SocialShortProps = z.infer<typeof socialShortSchema>

export const SocialShortTemplate: React.FC<SocialShortProps> = ({
  brand,
  hookText,
  bodyText,
  ctaText,
}) => {
  const { durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Hook text -- big, centered, bouncy */}
      <Sequence from={0} durationInFrames={durationInFrames - 60} name="Hook">
        <HookSection brand={brand} text={hookText} />
      </Sequence>

      {/* Body text */}
      {bodyText && (
        <Sequence from={45} durationInFrames={durationInFrames - 105} name="Body">
          <BodySection brand={brand} text={bodyText} />
        </Sequence>
      )}

      {/* CTA */}
      <Sequence from={durationInFrames - 90} durationInFrames={90} name="CTA">
        <CTASection brand={brand} text={ctaText} />
      </Sequence>
    </AbsoluteFill>
  )
}

const HookSection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    from: 0.7,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: brand.spacing.paddingScreen,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.size4xl,
          fontWeight: brand.typography.weightBlack,
          color: brand.colors.textPrimary,
          letterSpacing: `${brand.typography.trackingTight}em`,
          lineHeight: brand.typography.lineHeightTight,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

const BodySection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 300,
        padding: brand.spacing.paddingScreen,
      }}
    >
      <div
        style={{
          opacity,
          fontFamily: brand.typography.fontBody,
          fontSize: brand.typography.sizeLg,
          color: brand.colors.textSecondary,
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        {text}
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
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          background: `linear-gradient(135deg, ${brand.colors.accent}, ${brand.colors.accentAlt})`,
          color: brand.colors.white,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.sizeLg,
          fontWeight: brand.typography.weightBold,
          padding: `${brand.spacing.md}px ${brand.spacing.xl}px`,
          borderRadius: brand.spacing.borderRadiusLg,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}
