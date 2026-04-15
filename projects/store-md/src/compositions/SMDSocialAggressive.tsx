import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { RED, SLAM_SPRING, pulse } from '../utils/aggressive'

export type SMDSocialAggressiveProps = {
  /** Hook text — split on `|` markers to apply red color to a segment. */
  hookText: string
  /** Support sentence shown mid-frame. */
  bodyText: string
  /** Short CTA string for the urgency bar + CTA button. */
  ctaText: string
  /** When true (vertical format), shows bottom urgency bar. */
  showUrgencyBar?: boolean
}

// Split a hook string into word tokens, preserving `|...|` segments as a
// single highlighted unit. "14 apps. |3 are ghost billing|" → three tokens,
// middle one flagged `highlight: true`.
const tokenize = (
  text: string,
): Array<{ word: string; highlight: boolean }> => {
  const parts: Array<{ word: string; highlight: boolean }> = []
  const segments = text.split('|')
  segments.forEach((seg, i) => {
    const highlight = i % 2 === 1
    const words = seg.split(/\s+/).filter(Boolean)
    words.forEach((w) => parts.push({ word: w, highlight }))
  })
  return parts
}

const WordSlam: React.FC<{
  word: string
  highlight: boolean
  index: number
  baseStart: number
  frame: number
  fps: number
}> = ({ word, highlight, index, baseStart, frame, fps }) => {
  const brand = storeMdBrand
  const startFrame = baseStart + index * 3

  const slam = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 2,
    to: 1,
    config: SLAM_SPRING,
  })
  const op = interpolate(frame, [startFrame, startFrame + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${slam})`,
        opacity: op,
        color: highlight ? RED : brand.colors.white,
        fontWeight: highlight ? 900 : 800,
        textShadow: highlight
          ? '0 0 30px rgba(220, 38, 38, 0.55)'
          : '0 0 28px rgba(6, 182, 212, 0.35)',
        marginRight: 18,
      }}
    >
      {word}
    </span>
  )
}

const SMDLogoOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          right: 48,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 72,
            width: 72,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

export const SMDSocialAggressive: React.FC<SMDSocialAggressiveProps> = ({
  hookText,
  bodyText,
  ctaText,
  showUrgencyBar = true,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const brand = storeMdBrand

  const words = tokenize(hookText)
  const hookEnd = words.length * 3 + 20 // last word lands then a beat

  // Body appears after hook lands.
  const bodyOp = interpolate(frame, [hookEnd, hookEnd + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const bodyY = interpolate(frame, [hookEnd, hookEnd + 20], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // CTA button enters near the end.
  const ctaStart = Math.max(durationInFrames - 75, hookEnd + 40)
  const ctaScale = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    from: 0.8,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 30, 0.6, 1.2)

  // Urgency bar breathe
  const urgencyBreathe = pulse(frame, 40, 0.85, 1)
  const urgencyOp = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={brand} />

      <AbsoluteFill
        style={{
          padding: showUrgencyBar ? '100px 70px 200px 70px' : '80px 70px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        {/* HOOK — word-by-word SLAM */}
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 130,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            textAlign: 'left',
            marginTop: 40,
          }}
        >
          {words.map((w, i) => (
            <WordSlam
              key={`${w.word}-${i}`}
              word={w.word}
              highlight={w.highlight}
              index={i}
              baseStart={8}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* BODY */}
        <div
          style={{
            opacity: bodyOp,
            transform: `translateY(${bodyY}px)`,
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize: 42,
            fontWeight: 600,
            color: brand.colors.textSecondary,
            lineHeight: 1.35,
            textAlign: 'left',
          }}
        >
          {bodyText}
        </div>

        {/* CTA button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            opacity: ctaOp,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 52,
              fontWeight: 900,
              color: brand.colors.white,
              background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
              padding: '30px 62px',
              borderRadius: 18,
              boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
              letterSpacing: '-0.015em',
              textAlign: 'center',
            }}
          >
            {ctaText}
          </div>
        </div>
      </AbsoluteFill>

      {/* URGENCY BAR at bottom */}
      {showUrgencyBar && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            opacity: urgencyOp * urgencyBreathe,
            background: `linear-gradient(90deg, ${RED} 0%, #ea580c 100%)`,
            padding: '26px 40px',
            textAlign: 'center',
            boxShadow: '0 -8px 32px rgba(220, 38, 38, 0.45)',
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 42,
              fontWeight: 900,
              color: brand.colors.white,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            Your store is losing money RIGHT NOW
          </span>
        </div>
      )}

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
