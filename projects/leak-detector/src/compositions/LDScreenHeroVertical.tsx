import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, AIBadge, GlowButton, LogoOverlay } from '@altidigitech/core'
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
  'Scoring categories...',
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

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Phone frame */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <PhoneFrame brand={brand} frame={frame} fps={fps} />
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}

const PhoneFrame: React.FC<{ brand: BrandConfig; frame: number; fps: number }> = ({
  brand,
  frame,
  fps,
}) => {
  const phoneScale = spring({
    frame,
    fps,
    from: 0.9,
    to: 1,
    config: SPRING_ENTER,
  })

  const phoneOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity: phoneOpacity,
        transform: `scale(${phoneScale})`,
        width: 480,
        height: 1000,
        backgroundColor: '#0F172A',
        borderRadius: 40,
        border: '3px solid rgba(245,158,11,0.2)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Notch */}
      <div
        style={{
          width: 160,
          height: 28,
          backgroundColor: '#050A14',
          borderRadius: '0 0 20px 20px',
          alignSelf: 'center',
        }}
      />

      {/* Phone content */}
      <div
        style={{
          flex: 1,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Phase 1: Input */}
        {frame < 300 && (
          <InputPhase brand={brand} frame={frame} fps={fps} />
        )}

        {/* Phase 2: Results */}
        {frame >= 300 && (
          <ResultsPhase brand={brand} frame={frame} fps={fps} />
        )}
      </div>
    </div>
  )
}

// ── Input Phase ──────────────────────────────────────────────────────────────

const InputPhase: React.FC<{ brand: BrandConfig; frame: number; fps: number }> = ({
  brand,
  frame,
  fps,
}) => {
  // Typing animation: each char every 6 frames, starts at frame 60
  const typedChars = Math.min(
    URL_TEXT.length,
    Math.max(0, Math.floor((frame - 60) / 6)),
  )
  const displayUrl = frame < 60 ? '' : URL_TEXT.slice(0, typedChars)
  const showCursor = frame >= 60 && frame < 120 && Math.floor(frame / 10) % 2 === 0

  // Button pulse at frame 120-150
  const buttonScale =
    frame >= 120 && frame < 150
      ? interpolate(frame, [120, 135, 150], [1, 1.05, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  // Loading state 150-300
  const isLoading = frame >= 150 && frame < 300
  const loadingTextIndex = isLoading
    ? Math.min(LOADING_TEXTS.length - 1, Math.floor((frame - 150) / 40))
    : 0

  const loadingProgress = isLoading
    ? interpolate(frame, [150, 300], [0, 85], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  // Spinner rotation
  const spinnerRotation = frame * 6

  return (
    <>
      {/* AIBadge */}
      <div style={{ alignSelf: 'center', marginTop: 40 }}>
        <AIBadge frame={frame} />
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#F8FAFC',
          textAlign: 'center',
          marginTop: 20,
          lineHeight: 1.3,
        }}
      >
        Analyze your
        <br />
        landing page
      </div>

      {/* URL Input */}
      <div
        style={{
          backgroundColor: 'rgba(5,10,20,0.8)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 12,
          padding: '14px 18px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 16,
          color: displayUrl ? '#F8FAFC' : '#475569',
          marginTop: 16,
        }}
      >
        {displayUrl || 'https://yoursite.com'}
        {showCursor && (
          <span style={{ color: '#F59E0B' }}>|</span>
        )}
      </div>

      {/* Analyze button */}
      {!isLoading && (
        <div
          style={{
            transform: `scale(${buttonScale})`,
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0A0F1E',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            padding: '14px 24px',
            borderRadius: 12,
            textAlign: 'center',
            marginTop: 12,
            boxShadow: '0 0 30px rgba(245,158,11,0.3)',
          }}
        >
          Analyze Your Page Free
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            marginTop: 40,
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '4px solid rgba(245,158,11,0.15)',
              borderTopColor: '#F59E0B',
              transform: `rotate(${spinnerRotation}deg)`,
            }}
          />

          {/* Loading text */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 15,
              color: '#F59E0B',
              textAlign: 'center',
            }}
          >
            {LOADING_TEXTS[loadingTextIndex]}
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '80%',
              height: 6,
              backgroundColor: 'rgba(245,158,11,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                backgroundColor: '#F59E0B',
                borderRadius: 3,
                boxShadow: '0 0 10px rgba(245,158,11,0.6)',
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

// ── Results Phase ────────────────────────────────────────────────────────────

const ResultsPhase: React.FC<{ brand: BrandConfig; frame: number; fps: number }> = ({
  brand,
  frame,
  fps,
}) => {
  const resultsFade = interpolate(frame, [300, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const badgeOpacity = interpolate(frame, [400, 420], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ctaOpacity = interpolate(frame, [430, 460], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ctaScale = spring({
    frame: frame - 430,
    fps,
    from: 0.8,
    to: 1,
    config: SPRING_ENTER,
  })

  return (
    <div
      style={{
        opacity: resultsFade,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        paddingTop: 20,
        flex: 1,
      }}
    >
      {/* URL */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 16,
          color: '#F59E0B',
          fontWeight: 600,
        }}
      >
        vercel.com
      </div>

      {/* Score circle */}
      <ScoreCircle
        score={72}
        size={160}
        strokeWidth={10}
        frame={frame}
        startFrame={310}
        animDuration={90}
      />

      {/* Category bars */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 8,
        }}
      >
        {RESULT_CATEGORIES.map((cat, i) => (
          <CategoryScoreBar
            key={i}
            category={cat}
            frame={frame}
            startFrame={350 + i * 15}
            animDuration={40}
            labelWidth={110}
            fontSize={15}
          />
        ))}
      </div>

      {/* Issues badge */}
      <div
        style={{
          opacity: badgeOpacity,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 18px',
          borderRadius: 100,
          backgroundColor: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          fontWeight: 600,
          color: '#ef4444',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
          }}
        />
        2 issues found
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          marginTop: 'auto',
          marginBottom: 20,
        }}
      >
        <GlowButton text="See Full Report →" brand={brand} />
      </div>
    </div>
  )
}
