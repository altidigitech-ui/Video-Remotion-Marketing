import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { BrowserFrame, StoreMDBackground } from '../../components'

export type DemoPhase1to3Props = {
  startFrame: number
}

const FULL_URL = 'https://gymshark.com'
const FULL_URL_LEN = FULL_URL.length // 20

export const DemoPhase1to3: React.FC<DemoPhase1to3Props> = ({ startFrame: _startFrame }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`

  // ─── Phase 1: homepage ─────────────────────────────────────────
  const bannerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ─── Phase 2: overlay + modal ──────────────────────────────────
  const overlayOpacity = interpolate(frame, [150, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const modalOpacity = interpolate(frame, [155, 163], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const modalScale = spring({
    frame: Math.max(0, frame - 155),
    fps,
    from: 0.95,
    to: 1,
    config: storeMdBrand.motion.springSmooth,
  })

  // ─── Phase 3: typing ───────────────────────────────────────────
  const charCount = Math.floor(
    interpolate(frame, [220, 270], [0, FULL_URL_LEN], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )
  const typedText = FULL_URL.slice(0, charCount)
  const showCaret = frame >= 210 && Math.floor(frame / 10) % 2 === 0

  // ─── Phase 3: button click at 295 ─────────────────────────────
  const btnScale =
    frame >= 295 && frame <= 298
      ? interpolate(frame, [295, 299], [1, 0.96], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : frame > 298
        ? spring({
            frame: frame - 299,
            fps,
            from: 0.96,
            to: 1,
            config: { damping: 15, stiffness: 200, mass: 1 },
          })
        : 1

  const showModal = frame >= 150

  return (
    <AbsoluteFill>
      {/* Full-canvas background */}
      <StoreMDBackground brand={storeMdBrand} />

      <BrowserFrame url="storemd.app" bgColor={storeMdBrand.colors.background}>
        {/* ── Website content ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Beta banner */}
          <div
            style={{
              background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
              padding: '8px 16px',
              textAlign: 'center',
              fontFamily: fontBody,
              fontSize: 12,
              color: '#ffffff',
              opacity: bannerOpacity,
              flexShrink: 0,
            }}
          >
            🔬 We&apos;re looking for 10 beta testers — Get Pro free for 3 months
          </div>

          {/* Navbar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 18,
                color: '#ffffff',
              }}
            >
              StoreMD
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {(['Features', 'Pricing', 'Blog'] as const).map((label) => (
                <span
                  key={label}
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: '#94a3b8',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Hero section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              marginTop: 60,
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            {/* Badge */}
            <span
              style={{
                background: 'rgba(37,99,235,0.15)',
                color: '#60a5fa',
                fontSize: 12,
                borderRadius: 999,
                padding: '6px 16px',
                fontFamily: fontBody,
              }}
            >
              ✨ Free Shopify Store Audit
            </span>

            {/* Headline */}
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 38,
                color: '#ffffff',
                textAlign: 'center',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              <div>One app.</div>
              <div>Five killed.</div>
              <div>Zero regrets.</div>
            </div>

            {/* Subline */}
            <div
              style={{
                fontFamily: fontBody,
                fontSize: 15,
                color: '#94a3b8',
                textAlign: 'center',
                maxWidth: 340,
                lineHeight: 1.5,
              }}
            >
              StoreMD scans your Shopify store in 60 seconds. Finds hidden issues. Fixes them
              automatically.
            </div>

            {/* CTA button */}
            <div
              style={{
                background: '#2563eb',
                color: '#ffffff',
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Show me what I can uninstall →
            </div>

            {/* Dashboard preview */}
            <div
              style={{
                marginTop: 40,
                background: '#0d1117',
                border: '1px solid #1e293b',
                borderRadius: 12,
                padding: 20,
                width: 280,
                opacity: 0.6,
              }}
            >
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 12,
                  color: '#94a3b8',
                  marginBottom: 8,
                }}
              >
                Store Health
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: 36,
                    color: '#ffffff',
                  }}
                >
                  78
                </div>
                {/* Simplified arc teaser */}
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 15 * 0.78} ${2 * Math.PI * 15}`}
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phase 2 & 3: modal overlay ── */}
        {showModal && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              opacity: overlayOpacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 32,
                width: 400,
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                opacity: modalOpacity,
                transform: `scale(${modalScale})`,
              }}
            >
              {/* Modal title */}
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 20,
                  color: '#0f172a',
                  marginBottom: 20,
                }}
              >
                Enter your Shopify domain
              </div>

              {/* Input */}
              <div
                style={{
                  height: 48,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  paddingLeft: 16,
                  fontFamily: fontBody,
                  fontSize: 14,
                  color: '#0f172a',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span>{typedText}</span>
                {showCaret && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 1,
                      height: 18,
                      background: '#0f172a',
                      marginLeft: 1,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
              </div>

              {/* Submit button */}
              <div
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  width: '100%',
                  height: 48,
                  borderRadius: 8,
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${btnScale})`,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                Start free audit
              </div>

              {/* Sub-text */}
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 11,
                  color: '#94a3b8',
                  textAlign: 'center',
                  marginTop: 12,
                }}
              >
                No credit card required · Results in 30 seconds
              </div>
            </div>
          </div>
        )}
      </BrowserFrame>
    </AbsoluteFill>
  )
}
