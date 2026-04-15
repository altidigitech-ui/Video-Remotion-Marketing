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
import { RED, SLAM_SPRING, pulse } from '../utils/aggressive'

// ─── Message data ─────────────────────────────────────────────────────────────
// Generic format (no names, no photos, no brands). The *format* — iMessage /
// DM conversation — is itself the creative device; it's not a real testimonial.

type Bubble = {
  side: 'them' | 'us'
  text: string
}

const BUBBLES: Bubble[] = [
  { side: 'them', text: 'bro I just scanned my store' },
  { side: 'them', text: 'I had 4 dead apps still charging me' },
  { side: 'them', text: '$189/month for NOTHING' },
  { side: 'us', text: 'how long?' },
  { side: 'them', text: "8 months. That's $1,512 I'll never get back" },
]

const BUBBLE_GAP = 16 // ~530ms @ 30fps — enough to read each message
const SLAM_START = 200 // 4s of chat + reading pause before SLAM lands
const CTA_START = 260

// ─── Logo overlay ─────────────────────────────────────────────────────────────

const SMDLogoOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const brand = storeMdBrand
  const opacity = interpolate(frame, [SLAM_START, SLAM_START + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 48,
          opacity,
        }}
      >
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{
            height: 64,
            width: 64,
            borderRadius: 14,
            filter:
              'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

const ChatBubble: React.FC<{
  bubble: Bubble
  startFrame: number
  frame: number
  fps: number
}> = ({ bubble, startFrame, frame, fps }) => {
  const isUs = bubble.side === 'us'

  const enter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, mass: 0.8, stiffness: 220 },
  })
  const op = interpolate(frame, [startFrame, startFrame + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUs ? 'flex-end' : 'flex-start',
        opacity: op,
        transform: `translateY(${(1 - enter) * 14}px) scale(${0.9 + enter * 0.1})`,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '22px 28px',
          borderRadius: 32,
          background: isUs ? '#0a84ff' : '#2c2c2e',
          color: '#ffffff',
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`,
          fontSize: 38,
          fontWeight: 500,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
          borderBottomLeftRadius: isUs ? 32 : 8,
          borderBottomRightRadius: isUs ? 8 : 32,
        }}
      >
        {bubble.text}
      </div>
    </div>
  )
}

// ─── Chat header (iMessage-style) ────────────────────────────────────────────

const ChatHeader: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '40px 32px 20px',
        borderBottom: '1px solid #1c1c1e',
      }}
    >
      <span
        style={{
          fontFamily: `-apple-system, sans-serif`,
          fontSize: 30,
          fontWeight: 400,
          color: '#0a84ff',
        }}
      >
        ‹
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #8e8e93 0%, #636366 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: `-apple-system, sans-serif`,
            fontSize: 28,
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          ?
        </div>
        <span
          style={{
            fontFamily: `-apple-system, sans-serif`,
            fontSize: 22,
            fontWeight: 500,
            color: '#8e8e93',
          }}
        >
          Shopify owner
        </span>
      </div>
      <span style={{ width: 30 }} />
    </div>
  )
}

// ─── Main composition ────────────────────────────────────────────────────────

export const SMDTestimonialFake: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const brand = storeMdBrand

  // Chat-window visibility — fade out as SLAM covers.
  const chatOp = interpolate(
    frame,
    [0, 15, SLAM_START - 10, SLAM_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // SLAM overlay
  const slamScale = spring({
    frame: Math.max(0, frame - SLAM_START),
    fps,
    from: 1.8,
    to: 1,
    config: SLAM_SPRING,
  })
  const slamOp = interpolate(
    frame,
    [SLAM_START, SLAM_START + 8, CTA_START - 5, CTA_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // CTA
  const ctaScale = spring({
    frame: Math.max(0, frame - CTA_START),
    fps,
    from: 0.85,
    to: 1,
    config: brand.motion.springBouncy,
  })
  const ctaOp = interpolate(frame, [CTA_START, CTA_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaGlow = pulse(frame, 20, 0.6, 1.3)

  return (
    <AbsoluteFill style={{ background: '#000000', overflow: 'hidden' }}>
      {/* iMessage-style chat window */}
      <AbsoluteFill
        style={{
          opacity: chatOp,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatHeader />

        <div
          style={{
            flex: 1,
            padding: '40px 32px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            justifyContent: 'flex-end',
          }}
        >
          {BUBBLES.map((bubble, i) => (
            <ChatBubble
              key={i}
              bubble={bubble}
              startFrame={i * BUBBLE_GAP}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* SLAM closer */}
      <AbsoluteFill
        style={{
          opacity: slamOp,
          transform: `scale(${slamScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(5, 5, 7, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
            fontSize: 112,
            fontWeight: 900,
            color: brand.colors.white,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            textAlign: 'center',
            textShadow: '0 0 40px rgba(220, 38, 38, 0.45)',
          }}
        >
          Don&apos;t be
          <br />
          <span style={{ color: RED }}>this guy.</span>
          <br />
          <span style={{ color: brand.colors.accent }}>Scan free.</span>
        </div>
      </AbsoluteFill>

      {/* CTA */}
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
              fontSize: 72,
              fontWeight: 900,
              color: brand.colors.white,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              textAlign: 'center',
            }}
          >
            60 seconds.
            <br />
            <span style={{ color: brand.colors.accent }}>$0.</span>
          </div>
          <div
            style={{
              fontFamily: `'${brand.typography.fontDisplay}', sans-serif`,
              fontSize: 48,
              fontWeight: 900,
              color: brand.colors.white,
              background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.accent} 100%)`,
              padding: '26px 54px',
              borderRadius: 18,
              boxShadow: `0 0 ${54 * ctaGlow}px rgba(37, 99, 235, ${0.6 * ctaGlow}), 0 0 ${110 * ctaGlow}px rgba(6, 182, 212, ${0.35 * ctaGlow}), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
              letterSpacing: '-0.015em',
            }}
          >
            Scan my store →
          </div>
        </div>
      </AbsoluteFill>

      <SMDLogoOverlay frame={frame} />
    </AbsoluteFill>
  )
}
