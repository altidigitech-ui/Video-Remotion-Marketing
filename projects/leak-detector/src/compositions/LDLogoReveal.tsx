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
import type { BrandConfig } from '@altidigitech/brand'
import { LDBackground, GlowText } from '@altidigitech/core'

export type LDLogoRevealProps = {
  brand: BrandConfig
  showTagline?: boolean
}

// Data rain characters
const DATA_CHARS = '01アイウエオカキクケコ{}[]<>=/\\$#@!%^&*'
const DATA_COLUMNS = 10

export const LDLogoReveal: React.FC<LDLogoRevealProps> = ({
  brand,
  showTagline = true,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: brand.motion.springBouncy,
  })

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Amber glow pulse behind logo
  const glowPulse = Math.sin(frame * 0.08) * 0.15 + 0.85

  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const taglineY = spring({
    frame: frame - 40,
    fps,
    from: 20,
    to: 0,
    config: brand.motion.springBouncy,
  })

  // Data rain columns
  const columns = Array.from({ length: DATA_COLUMNS }, (_, i) => {
    const xPos = 5 + (i * 90) / DATA_COLUMNS + ((i * 7.3) % 5)
    const speed = 1.5 + (i % 4) * 0.5
    const charCount = 12 + (i % 5) * 3
    const columnOpacity = 0.15 + (i % 3) * 0.08

    return {
      x: xPos,
      speed,
      charCount,
      opacity: columnOpacity,
      chars: Array.from({ length: charCount }, (_, j) => {
        const charIndex = (i * 13 + j * 7 + Math.floor(frame * speed * 0.08)) % DATA_CHARS.length
        const yOffset = ((j * (100 / charCount)) + frame * speed * 0.3) % 120 - 10
        const charOpacity = j === 0 ? 1 : Math.max(0, 1 - j * 0.08)
        return {
          char: DATA_CHARS[charIndex],
          y: yOffset,
          opacity: charOpacity * columnOpacity,
        }
      }),
    }
  })

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* Data rain effect */}
      {columns.map((col, i) => (
        <div key={`col${i}`} style={{ position: 'absolute', left: `${col.x}%`, top: 0, bottom: 0 }}>
          {col.chars.map((c, j) => (
            <div
              key={`c${j}`}
              style={{
                position: 'absolute',
                top: `${c.y}%`,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                color: '#F59E0B',
                opacity: c.opacity,
                textShadow: j === 0 ? '0 0 10px rgba(245,158,11,0.8)' : 'none',
                fontWeight: j === 0 ? 700 : 400,
              }}
            >
              {c.char}
            </div>
          ))}
        </div>
      ))}

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Logo with amber glow */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            position: 'relative',
          }}
        >
          {/* Glow layer */}
          <div
            style={{
              position: 'absolute',
              inset: -60,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(245, 158, 11, ${0.35 * glowPulse}) 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
          />
          <Img
            src={staticFile(brand.assets.logoPng)}
            style={{
              width: 300,
              height: 300,
              borderRadius: 48,
              position: 'relative',
              boxShadow: '0 0 60px rgba(245,158,11,0.4), 0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>

        {/* Gradient tagline */}
        {showTagline && (
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            <GlowText brand={brand} size={48}>
              {brand.tagline}
            </GlowText>
          </div>
        )}

        {/* Brand name */}
        <div
          style={{
            opacity: interpolate(frame, [60, 90], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 86,
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(245,158,11,0.2)',
          }}
        >
          {brand.name}
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  )
}
