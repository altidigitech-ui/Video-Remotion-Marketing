import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText, GlowButton, AIBadge } from '@altidigitech/core'
import { ScoreCircle } from '../components/ScoreCircle'
import { CategoryScoreBar } from '../components/CategoryScoreBar'
import type { CategoryData } from '../components/CategoryScoreBar'

export type LDScreenHeroVerticalProps = {
  brand: BrandConfig
}

const SPRING_ENTER = { damping: 14, stiffness: 120 }

const URL_TEXT = 'vercel.com'

const LOADING_TEXTS = [
  'Scraping page...',
  'Analyzing headline...',
  'Checking CTAs...',
  'Scoring 8 categories...',
]

const RESULT_CATEGORIES: CategoryData[] = [
  { label: 'Headline', score: 85 },
  { label: 'Call-to-Action', score: 60 },
  { label: 'Social Proof', score: 40 },
  { label: 'Trust', score: 95 },
]

export const LDScreenHeroVertical: React.FC<LDScreenHeroVerticalProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // AIBadge
  const badgeOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Headline
  const headlineOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const headlineY = spring({
    frame: frame - 80,
    fps,
    from: 40,
    to: 0,
    config: SPRING_ENTER,
  })

  // Subline
  const sublineOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // URL input
  const inputOpacity = interpolate(frame, [160, 185], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const inputY = spring({
    frame: frame - 160,
    fps,
    from: 30,
    to: 0,
    config: SPRING_ENTER,
  })

  // Typing
  const typedChars = Math.min(
    URL_TEXT.length,
    Math.max(0, Math.floor((frame - 180) / 8)),
  )
  const displayUrl = frame < 180 ? '' : URL_TEXT.slice(0, typedChars)
  const showCursor = frame >= 180 && frame < 260 && Math.floor(frame / 12) % 2 === 0

  // Button pulse
  const buttonOpacity = interpolate(frame, [250, 265], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const buttonScale =
    frame >= 260 && frame < 280
      ? interpolate(frame, [260, 270, 280], [1, 1.06, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  // Loading
  const isLoading = frame >= 280 && frame < 380
  const loadingTextIndex = isLoading
    ? Math.min(LOADING_TEXTS.length - 1, Math.floor((frame - 280) / 30))
    : 0
  const loadingProgress = isLoading
    ? interpolate(frame, [280, 380], [0, 90], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0
  const spinnerRotation = frame * 9 // 360° per 40 frames

  // Results
  const showResults = frame >= 380
  const resultsOpacity = interpolate(frame, [380, 410], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Final CTA
  const ctaY = spring({
    frame: frame - 460,
    fps,
    from: 40,
    to: 0,
    config: SPRING_ENTER,
  })
  const ctaOpacity = interpolate(frame, [460, 475], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 60px',
          gap: 24,
        }}
      >
        {/* AIBadge */}
        <div style={{ opacity: badgeOpacity }}>
          <AIBadge frame={frame} />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            marginTop: 16,
          }}
        >
          <GlowText brand={brand} size={72}>
            Your landing page is leaking conversions
          </GlowText>
        </div>

        {/* Subline */}
        <div
          style={{
            opacity: sublineOpacity * 0.7,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 36,
            color: '#F8FAFC',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          AI scans 8 categories in 60 seconds
        </div>

        {/* URL Input + Button + Loading + Results */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            marginTop: 24,
            width: '100%',
          }}
        >
          {/* URL input bar */}
          {!isLoading && !showResults && (
            <div
              style={{
                opacity: inputOpacity,
                transform: `translateY(${inputY}px)`,
                width: 860,
                height: 90,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '2px solid #F59E0B',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                color: displayUrl ? '#F8FAFC' : '#475569',
              }}
            >
              {displayUrl || 'https://yoursite.com'}
              {showCursor && (
                <span style={{ color: '#F59E0B', marginLeft: 2 }}>|</span>
              )}
            </div>
          )}

          {/* Analyze button */}
          {!isLoading && !showResults && (
            <div
              style={{
                opacity: buttonOpacity,
                transform: `scale(${buttonScale})`,
                background: '#F59E0B',
                color: '#0A0F1E',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 700,
                padding: '24px 64px',
                borderRadius: 14,
                boxShadow: '0 0 40px rgba(245,158,11,0.35)',
              }}
            >
              ⟶  Analyze Your Page Free
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 28,
                marginTop: 40,
              }}
            >
              {/* Spinner */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '3px solid rgba(245,158,11,0.2)',
                  borderRightColor: 'transparent',
                  borderTopColor: '#F59E0B',
                  transform: `rotate(${spinnerRotation}deg)`,
                }}
              />

              {/* Loading text */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 28,
                  color: '#F59E0B',
                  textAlign: 'center',
                }}
              >
                {LOADING_TEXTS[loadingTextIndex]}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: 800,
                  height: 8,
                  backgroundColor: 'rgba(245,158,11,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${loadingProgress}%`,
                    height: '100%',
                    backgroundColor: '#F59E0B',
                    borderRadius: 4,
                    boxShadow: '0 0 12px rgba(245,158,11,0.6)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div
              style={{
                opacity: resultsOpacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 32,
                width: '100%',
              }}
            >
              {/* Score circle */}
              <ScoreCircle
                score={72}
                size={280}
                strokeWidth={14}
                frame={frame}
                startFrame={385}
                animDuration={60}
              />

              {/* Category bars */}
              <div
                style={{
                  width: 700,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {RESULT_CATEGORIES.map((cat, i) => (
                  <CategoryScoreBar
                    key={i}
                    category={cat}
                    frame={frame}
                    startFrame={410 + i * 12}
                    animDuration={30}
                    labelWidth={200}
                    fontSize={24}
                  />
                ))}
              </div>

              {/* Final CTA */}
              <div
                style={{
                  opacity: ctaOpacity,
                  transform: `translateY(${ctaY}px)`,
                }}
              >
                <GlowButton text="See Full Report →" brand={brand} />
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  )
}
