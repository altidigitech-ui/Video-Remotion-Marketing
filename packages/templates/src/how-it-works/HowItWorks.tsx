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
  const { durationInFrames } = useVideoConfig()

  const stepsStart = 60
  const stepsPerStep = Math.floor(
    (durationInFrames - stepsStart - (ctaText ? 90 : 0)) / steps.length,
  )

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      {/* Headline */}
      <Sequence from={0} durationInFrames={durationInFrames} name="Headline">
        <HeadlineSection brand={brand} text={headline} />
      </Sequence>

      {/* Steps */}
      {steps.map((step, i) => (
        <Sequence
          key={i}
          from={stepsStart + i * stepsPerStep}
          durationInFrames={stepsPerStep}
          name={`Step ${i + 1}`}
        >
          <StepSection brand={brand} step={step} stepNumber={i + 1} totalSteps={steps.length} />
        </Sequence>
      ))}

      {/* CTA */}
      {ctaText && (
        <Sequence from={durationInFrames - 90} durationInFrames={90} name="CTA">
          <CTAButton brand={brand} text={ctaText} />
        </Sequence>
      )}
    </AbsoluteFill>
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

const HeadlineSection: React.FC<{ brand: BrandConfig; text: string }> = ({ brand, text }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const translateY = spring({
    frame,
    fps,
    from: 30,
    to: 0,
    config: brand.motion.springSmooth,
  })

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: brand.spacing.xxl,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: brand.typography.fontDisplay,
          fontSize: brand.typography.size3xl,
          fontWeight: brand.typography.weightBold,
          color: brand.colors.textPrimary,
          letterSpacing: `${brand.typography.trackingTight}em`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

type StepData = z.infer<typeof stepSchema>

const StepSection: React.FC<{
  brand: BrandConfig
  step: StepData
  stepNumber: number
  totalSteps: number
}> = ({ brand, step, stepNumber, totalSteps }) => {
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

  const descOpacity = interpolate(frame, [15, 40], [0, 1], {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: brand.spacing.md,
        }}
      >
        {/* Step number circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: brand.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: brand.typography.fontDisplay,
            fontSize: brand.typography.sizeXl,
            fontWeight: brand.typography.weightBold,
            color: brand.colors.white,
          }}
        >
          {stepNumber}
        </div>

        {/* Step title */}
        <div
          style={{
            fontFamily: brand.typography.fontDisplay,
            fontSize: brand.typography.size2xl,
            fontWeight: brand.typography.weightBold,
            color: brand.colors.textPrimary,
            textAlign: 'center',
          }}
        >
          {step.title}
        </div>

        {/* Step description */}
        <div
          style={{
            opacity: descOpacity,
            fontFamily: brand.typography.fontBody,
            fontSize: brand.typography.sizeLg,
            color: brand.colors.textSecondary,
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          {step.description}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: brand.spacing.xs, marginTop: brand.spacing.sm }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: i + 1 === stepNumber ? brand.colors.accent : brand.colors.border,
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
