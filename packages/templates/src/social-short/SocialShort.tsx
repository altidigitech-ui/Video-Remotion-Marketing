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
import { LDBackground, GlowText, GlowButton, LogoOverlay, AIBadge } from '@altidigitech/core'

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
  const { fps, durationInFrames } = useVideoConfig()

  // ── Timings ────────────────────────────────────────────────────────────────
  // Phase 1: Badge + hook text (0 → ~60% duration)
  // Phase 2: Body text appears below hook (frame 45 onwards)
  // Phase 3: CTA appears (last 90 frames)

  const badgeOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const hookScale = spring({ frame, fps, from: 0.75, to: 1, config: brand.motion.springBouncy })
  const hookOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const bodyOp = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const bodyY = spring({ frame: frame - 50, fps, from: 24, to: 0, config: brand.motion.springBouncy })

  const ctaStart = durationInFrames - 90
  const ctaScale = spring({ frame: frame - ctaStart, fps, from: 0.85, to: 1, config: brand.motion.springBouncy })
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Pulse for CTA
  const pulse = 1 + Math.sin(frame * 0.12) * 0.02

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Full-canvas layout — 3 zones stacked */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 72px',
          gap: 56,
        }}
      >
        {/* Zone 1 — Badge top */}
        <div style={{ opacity: badgeOp }}>
          <AIBadge frame={frame} />
        </div>

        {/* Zone 2 — Hook text (main message, large) */}
        <div
          style={{
            opacity: hookOp,
            transform: `scale(${hookScale})`,
            textAlign: 'center',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GlowText brand={brand} size={88}>
            {hookText}
          </GlowText>
        </div>

        {/* Zone 3 — Body text */}
        {bodyText && (
          <div
            style={{
              opacity: bodyOp,
              transform: `translateY(${bodyY}px)`,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 38,
              color: '#94A3B8',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: 880,
            }}
          >
            {bodyText}
          </div>
        )}

        {/* Zone 4 — CTA */}
        <div
          style={{
            opacity: ctaOp,
            transform: `scale(${ctaScale * pulse})`,
          }}
        >
          <GlowButton text={ctaText} brand={brand} />
        </div>
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}
