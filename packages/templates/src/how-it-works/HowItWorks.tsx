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
import { LDBackground, GlowText, GlowButton, GlassCard, LogoOverlay } from '@altidigitech/core'

const stepSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const howItWorksSchema = z.object({
  brand: z.custom<BrandConfig>(),
  headline: z.string().default('How it works'),
  steps: z.array(stepSchema).min(2).max(5),
  ctaText: z.string().optional(),
})

export type HowItWorksProps = z.infer<typeof howItWorksSchema>

export const HowItWorksTemplate: React.FC<HowItWorksProps> = ({
  brand,
  headline,
  steps,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // ── Headline ────────────────────────────────────────────────────────────────

  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineY = spring({
    frame,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springBouncy,
  })

  // ── Connection line ─────────────────────────────────────────────────────────

  const lineStart = 60
  const lineEnd = lineStart + steps.length * 25 + 40
  const lineProgress = interpolate(frame, [lineStart, lineEnd], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── CTA ─────────────────────────────────────────────────────────────────────

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

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <GlowText brand={brand} size={48}>
          {headline}
        </GlowText>
      </div>

      {/* Steps row */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          bottom: ctaText ? 180 : 80,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          padding: '0 80px',
        }}
      >
        {/* Connection line behind cards */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            right: '15%',
            height: 2,
            backgroundColor: 'rgba(245,158,11,0.15)',
            transform: 'translateY(-50%)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${lineProgress}%`,
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
              boxShadow: '0 0 12px rgba(245,158,11,0.5)',
            }}
          />
        </div>

        {/* Step cards */}
        {steps.map((step, i) => {
          const cardDelay = 60 + i * 25

          const cardScale = spring({
            frame: frame - cardDelay,
            fps,
            from: 0.8,
            to: 1,
            config: brand.motion.springBouncy,
          })

          const cardOpacity = interpolate(
            frame,
            [cardDelay, cardDelay + 20],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                flex: 1,
                maxWidth: 320,
              }}
            >
              <GlassCard brand={brand}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'center',
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 48,
                      fontWeight: 800,
                      color: '#F59E0B',
                      lineHeight: 1,
                      filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.4))',
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#F8FAFC',
                    }}
                  >
                    {step.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 16,
                      color: '#94A3B8',
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {ctaText && frame >= ctaStart && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
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
