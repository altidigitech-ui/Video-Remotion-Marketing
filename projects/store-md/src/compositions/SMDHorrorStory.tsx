import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../components/StoreMDBackground'
import { SMDLogoOverlay, SMDUrgencyBar } from '../components/SMDOverlays'
import { RED, SLAM_SPRING, pulse, shake } from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type HorrorChapter = {
  text: string
  duration: number
  emphasis?: 'money' | 'shock' | 'normal'
}

export type SMDHorrorStoryProps = {
  chapters: ReadonlyArray<HorrorChapter>
  resolution: string
  ctaText: string
}

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDHorrorStory: React.FC<SMDHorrorStoryProps> = ({
  chapters,
  resolution,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Compute cumulative start frames for each chapter
  const chapterStarts: number[] = []
  let cumulative = 10 // small initial delay
  for (const ch of chapters) {
    chapterStarts.push(cumulative)
    cumulative += ch.duration
  }

  const resolutionStart = cumulative + 10
  const ctaStart = resolutionStart + 60

  // Determine which chapter is active
  let activeIndex = -1
  for (let i = 0; i < chapters.length; i++) {
    const start = chapterStarts[i] as number
    const ch = chapters[i] as HorrorChapter
    if (frame >= start && frame < start + ch.duration) {
      activeIndex = i
    }
  }

  // Chapter text rendering
  const renderChapter = (ch: HorrorChapter, startFrame: number, idx: number) => {
    const localFrame = frame - startFrame
    // Phase 1: typewriter (2 chars/frame → 32-char text done in 16 frames)
    const charRate = 2.0
    const typewriterEnd = Math.ceil(ch.text.length / charRate)
    const chars = Math.floor(Math.max(0, localFrame * charRate))
    const display = ch.text.slice(0, Math.min(chars, ch.text.length))

    // Phase 2: reading pause (text stays fully visible)
    // Phase 3: fade out (last 8 frames)
    const FADE_OUT_FRAMES = 8
    const fadeIn = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    const fadeOut = interpolate(
      frame,
      [startFrame + ch.duration - FADE_OUT_FRAMES, startFrame + ch.duration],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    )
    const op = Math.min(fadeIn, fadeOut)

    const color =
      ch.emphasis === 'money'
        ? RED
        : ch.emphasis === 'shock'
          ? '#fca5a5'
          : brand.colors.textPrimary

    const fontSize = ch.emphasis === 'money' ? 56 : ch.emphasis === 'shock' ? 48 : 44
    const shk =
      ch.emphasis === 'shock' ? shake(frame, startFrame + 2, 4, 6) : { x: 0, y: 0 }

    return (
      <div
        key={idx}
        style={{
          position: 'absolute',
          top: 600,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: op,
          transform: `translate(${shk.x}px, ${shk.y}px)`,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontBody}', sans-serif`,
            fontSize,
            fontWeight: ch.emphasis === 'money' ? 900 : 700,
            color,
            letterSpacing: '-0.015em',
            lineHeight: 1.3,
            textShadow:
              ch.emphasis === 'money'
                ? '0 0 40px rgba(220, 38, 38, 0.5)'
                : 'none',
          }}
        >
          {display}
        </span>
      </div>
    )
  }

  // Resolution SLAM
  const resSlam = spring({
    frame: Math.max(0, frame - resolutionStart),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })
  const resOp = interpolate(
    frame,
    [resolutionStart, resolutionStart + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const resShake = shake(frame, resolutionStart + 2, 6, 8)

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)

  // Progress dots (top center)
  const dotsOp = interpolate(frame, [0, 20], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* Progress dots */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          opacity: dotsOp,
        }}
      >
        {chapters.map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background:
                i <= activeIndex
                  ? brand.colors.accent
                  : 'rgba(255, 255, 255, 0.2)',
              transition: 'none',
            }}
          />
        ))}
      </div>

      {/* Chapters */}
      {chapters.map((ch, i) => {
        const start = chapterStarts[i] as number
        if (frame < start - 5 || frame > start + ch.duration + 5) return null
        return renderChapter(ch, start, i)
      })}

      {/* Resolution */}
      {frame >= resolutionStart && frame < ctaStart && (
        <div
          style={{
            position: 'absolute',
            top: 560,
            left: 50,
            right: 50,
            textAlign: 'center',
            opacity: resOp,
            transform: `translate(${resShake.x}px, ${resShake.y}px) scale(${resSlam})`,
          }}
        >
          <span
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 46,
              fontWeight: 900,
              color: brand.colors.accent,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
            }}
          >
            {resolution}
          </span>
        </div>
      )}

      {/* CTA */}
      {frame >= ctaStart && (
        <AbsoluteFill
          style={{
            opacity: ctaOp,
            transform: `scale(${ctaScale})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 5, 7, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '0 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 46,
                fontWeight: 900,
                color: brand.colors.accent,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textAlign: 'center',
                textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
              }}
            >
              {resolution}
            </div>
            <div
              style={{
                fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                fontSize: 42,
                fontWeight: 900,
                color: brand.colors.textPrimary,
                background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
                padding: '22px 48px',
                borderRadius: 18,
                boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
                letterSpacing: '-0.015em',
              }}
            >
              {ctaText}
            </div>
          </div>
        </AbsoluteFill>
      )}

      <SMDUrgencyBar text="This could be your store right now" />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
