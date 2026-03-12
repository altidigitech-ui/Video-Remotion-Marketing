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
import { LDBackground, GlowText, GlowButton, GlassCard } from '@altidigitech/core'

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

  const lineProgress = interpolate(frame, [80, 200], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── CTA ─────────────────────────────────────────────────────────────────────

  const ctaStart = 300
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
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <GlowText brand={brand} size={96}>
          {headline}
        </GlowText>
      </div>

      {/* Steps row */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          bottom: ctaText ? 160 : 60,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          padding: '0 60px',
        }}
      >
        {/* Connection line behind cards */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '18%',
            right: '18%',
            height: 2,
            background: 'rgba(245,158,11,0.15)',
            zIndex: 0,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${lineProgress}%`,
              background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
              boxShadow: '0 0 10px rgba(245,158,11,0.8)',
            }}
          />
        </div>

        {/* Step cards */}
        {steps.map((step, i) => {
          const cardDelay = 60 + i * 30

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
                minWidth: 0,
                zIndex: 1,
              }}
            >
              <GlassCard brand={brand} glow>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 20,
                    textAlign: 'center',
                    padding: '32px 16px',
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 100,
                      fontWeight: 800,
                      color: '#F59E0B',
                      lineHeight: 1,
                      filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.5))',
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 34,
                      fontWeight: 700,
                      color: '#F8FAFC',
                    }}
                  >
                    {step.title}
                  </div>

                  {/* Divider line */}
                  <div style={{
                    width: 60,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)',
                  }} />

                  {/* Description */}
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 24,
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
            bottom: 50,
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

    </AbsoluteFill>
  )
}
