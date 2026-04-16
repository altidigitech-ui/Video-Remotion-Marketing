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
import { RED, ORANGE, GREEN, SLAM_SPRING, pulse } from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type FastListItem = {
  text: string
  severity?: 'red' | 'orange' | 'yellow' | 'green'
}

export type SMDFastListProps = {
  title: string
  items: ReadonlyArray<FastListItem>
  conclusion: string
  ctaText: string
}

// ─── Severity colors ─────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  red: { bg: 'rgba(220, 38, 38, 0.15)', text: '#fecaca', dot: RED },
  orange: { bg: 'rgba(234, 88, 12, 0.15)', text: '#fed7aa', dot: ORANGE },
  yellow: { bg: 'rgba(202, 138, 4, 0.15)', text: '#fef08a', dot: '#ca8a04' },
  green: { bg: 'rgba(22, 163, 74, 0.15)', text: '#bbf7d0', dot: GREEN },
}

// ─── Timings ─────────────────────────────────────────────────────────────────

const TITLE_START = 0
const ITEMS_START = 35
const ITEM_STAGGER = 22 // fast pace: ~0.73s per item @ 30fps

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDFastList: React.FC<SMDFastListProps> = ({
  title,
  items,
  conclusion,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Title
  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleSlam = spring({
    frame: Math.max(0, frame - TITLE_START),
    fps,
    from: 1.2,
    to: 1,
    config: SLAM_SPRING,
  })

  // Conclusion + CTA timing
  const lastItemStart = ITEMS_START + (items.length - 1) * ITEM_STAGGER
  const conclusionStart = lastItemStart + ITEM_STAGGER + 10
  const ctaStart = conclusionStart + 40

  const conclusionOp = interpolate(
    frame,
    [conclusionStart, conclusionStart + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const conclusionSlam = spring({
    frame: Math.max(0, frame - conclusionStart),
    fps,
    from: 1.3,
    to: 1,
    config: SLAM_SPRING,
  })

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

  // Item counter
  const currentItemIdx = Math.min(
    items.length - 1,
    Math.floor(Math.max(0, frame - ITEMS_START) / ITEM_STAGGER),
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={brand} />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 50,
          right: 50,
          textAlign: 'center',
          opacity: titleOp,
          transform: `scale(${titleSlam})`,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 40,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </span>
      </div>

      {/* Counter badge (top-right) */}
      {frame >= ITEMS_START && frame < conclusionStart && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            fontFamily: `'${brand.typography.fontMono}', monospace`,
            fontSize: 28,
            fontWeight: 800,
            color: brand.colors.accent,
            letterSpacing: '-0.02em',
          }}
        >
          {Math.min(currentItemIdx + 1, items.length)}/{items.length}
        </div>
      )}

      {/* Items list */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {items.map((item, i) => {
          const itemStart = ITEMS_START + i * ITEM_STAGGER
          const itemOp = interpolate(
            frame,
            [itemStart, itemStart + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
          const itemX = interpolate(
            frame,
            [itemStart, itemStart + 12],
            [40, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
          const severity = item.severity ?? 'yellow'
          const defaultColors = { bg: 'rgba(202, 138, 4, 0.15)', text: '#fef08a', dot: '#ca8a04' }
          const colors = SEVERITY_COLORS[severity] ?? defaultColors

          return (
            <div
              key={i}
              style={{
                opacity: itemOp,
                transform: `translateX(${itemX}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: colors.bg,
                borderRadius: 12,
                padding: '14px 20px',
                border: `1px solid ${colors.dot}33`,
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: `'${brand.typography.fontMono}', monospace`,
                  fontSize: 24,
                  fontWeight: 900,
                  color: colors.dot,
                  width: 36,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              {/* Dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: colors.dot,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${colors.dot}`,
                }}
              />
              {/* Text */}
              <span
                style={{
                  fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                  fontSize: 24,
                  fontWeight: 600,
                  color: colors.text,
                  lineHeight: 1.3,
                  letterSpacing: '-0.005em',
                }}
              >
                {item.text}
              </span>
            </div>
          )
        })}
      </div>

      {/* Conclusion */}
      <div
        style={{
          position: 'absolute',
          bottom: 260,
          left: 50,
          right: 50,
          textAlign: 'center',
          opacity: conclusionOp,
          transform: `scale(${conclusionSlam})`,
        }}
      >
        <span
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 40,
            fontWeight: 900,
            color: brand.colors.accent,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
          }}
        >
          {conclusion}
        </span>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: 40,
          right: 40,
          opacity: ctaOp,
          transform: `scale(${ctaScale})`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 36,
            fontWeight: 900,
            color: brand.colors.textPrimary,
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
            padding: '20px 44px',
            borderRadius: 18,
            boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            letterSpacing: '-0.015em',
            textAlign: 'center',
          }}
        >
          {ctaText}
        </div>
      </div>

      <SMDUrgencyBar text="How many apply to your store?" />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
