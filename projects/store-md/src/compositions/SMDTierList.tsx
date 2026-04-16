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
import { SLAM_SPRING, pulse } from '../utils/aggressive'

// ─── Types ───────────────────────────────────────────────────────────────────

export type TierRank = 'S' | 'A' | 'B' | 'C' | 'F'

export type TierRow = {
  rank: TierRank
  color: string
  items: ReadonlyArray<string>
}

export type SMDTierListProps = {
  title: string
  tiers: ReadonlyArray<TierRow>
  ctaText: string
}

// ─── Timings ─────────────────────────────────────────────────────────────────

const TITLE_START = 0
const TIERS_START = 40
const TIER_STAGGER = 30 // frames between each tier row
const CTA_DELAY_AFTER_LAST = 30

// ─── Composition ─────────────────────────────────────────────────────────────

export const SMDTierList: React.FC<SMDTierListProps> = ({
  title,
  tiers,
  ctaText,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Title
  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [TITLE_START, TITLE_START + 20], [-20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // CTA timing
  const lastTierStart = TIERS_START + (tiers.length - 1) * TIER_STAGGER
  const ctaStart = lastTierStart + TIER_STAGGER + CTA_DELAY_AFTER_LAST
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
          transform: `translateY(${titleY}px)`,
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

      {/* Tier rows */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {tiers.map((tier, tierIdx) => {
          const rowStart = TIERS_START + tierIdx * TIER_STAGGER
          const rowSlam = spring({
            frame: Math.max(0, frame - rowStart),
            fps,
            from: 0,
            to: 1,
            config: { damping: 16, mass: 0.8, stiffness: 200 },
          })
          const rowOp = interpolate(
            frame,
            [rowStart, rowStart + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
          const rowX = interpolate(
            frame,
            [rowStart, rowStart + 14],
            [-60, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )

          return (
            <div
              key={tier.rank}
              style={{
                opacity: rowOp,
                transform: `translateX(${rowX}px) scale(${0.9 + rowSlam * 0.1})`,
                display: 'flex',
                alignItems: 'stretch',
                gap: 0,
                minHeight: 80,
              }}
            >
              {/* Rank badge */}
              <div
                style={{
                  width: 80,
                  minHeight: 80,
                  background: tier.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px 0 0 12px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
                    fontSize: 44,
                    fontWeight: 900,
                    color: '#000000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {tier.rank}
                </span>
              </div>

              {/* Items */}
              <div
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '0 12px 12px 0',
                  border: `1px solid ${tier.color}33`,
                  borderLeft: 'none',
                  padding: '14px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {tier.items.map((item, itemIdx) => {
                  const itemStart = rowStart + 8 + itemIdx * 6
                  const itemOp = interpolate(
                    frame,
                    [itemStart, itemStart + 8],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                  )
                  return (
                    <span
                      key={itemIdx}
                      style={{
                        opacity: itemOp,
                        fontFamily: `'${brand.typography.fontBody}', sans-serif`,
                        fontSize: 22,
                        fontWeight: 600,
                        color: brand.colors.textPrimary,
                        background: `${tier.color}22`,
                        padding: '6px 14px',
                        borderRadius: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {item}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
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

      <SMDUrgencyBar text="Where does your store rank?" />
      <SMDLogoOverlay />
    </AbsoluteFill>
  )
}
