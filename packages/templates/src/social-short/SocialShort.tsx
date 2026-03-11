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
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

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

      <LogoOverlay brand={brand} frame={frame} />
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
        padding: 60,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <GlowText brand={brand} size={86}>
          {text}
        </GlowText>
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
        paddingBottom: 350,
        padding: 60,
      }}
    >
      <div
        style={{
          opacity,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 36,
          color: '#94A3B8',
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.4,
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
      <div style={{ opacity }}>
        <GlowButton text={text} brand={brand} scale={scale} />
      </div>
    </AbsoluteFill>
  )
}
