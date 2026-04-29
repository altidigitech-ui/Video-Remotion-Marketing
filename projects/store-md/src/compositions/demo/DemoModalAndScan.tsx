import React from 'react'
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../../components/StoreMDBackground'

const FULL_URL = 'https://gymshark.com/'
const CIRCUMFERENCE = 2 * Math.PI * 80 // radius 80 → diameter 180

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

function getScanLabel(f: number): string {
  if (f < 105) return 'Checking SEO meta tags...'
  if (f < 125) return 'Analyzing page structure...'
  if (f < 145) return 'Scanning for broken links...'
  if (f < 160) return 'Checking Open Graph tags...'
  if (f < 175) return 'Running accessibility audit...'
  return 'Finalizing report...'
}

export const DemoModalAndScan: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame()
  const f = frame - startFrame

  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`
  const fontMono = `'${storeMdBrand.typography.fontMono}', monospace`

  // ── Modal fade-in ─────────────────────────────────────────────────────────
  const modalOpacity = interpolate(f, [0, 12], [0, 1], clamp)
  const modalTranslateY = interpolate(f, [0, 12], [20, 0], clamp)

  // ── URL typing ────────────────────────────────────────────────────────────
  const charCount = Math.round(interpolate(f, [25, 56], [0, FULL_URL.length], clamp))
  const typedText = FULL_URL.slice(0, charCount)
  const cursorVisible = Math.floor(f / 12) % 2 === 0

  // ── Modal ↔ Scan crossfade ────────────────────────────────────────────────
  const modalContentOpacity = interpolate(f, [65, 73], [1, 0], clamp)
  const scanContentOpacity = interpolate(f, [65, 73], [0, 1], clamp)

  // ── Scan progress ─────────────────────────────────────────────────────────
  const scanProgress = interpolate(f, [85, 175], [0, 100], clamp)
  const scanPercent = Math.round(scanProgress)
  const strokeDashoffset = CIRCUMFERENCE * (1 - scanProgress / 100)
  const progressBarWidth = interpolate(f, [85, 175], [0, 300], clamp)

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={storeMdBrand} />

      {/* ── Modal content ── */}
      <AbsoluteFill
        style={{
          opacity: modalOpacity * modalContentOpacity,
          transform: `translateY(${modalTranslateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            opacity: 0.6,
            marginBottom: 40,
          }}
        >
          <img
            src={staticFile('images/store-md-logo.png')}
            width={28}
            height={28}
            style={{ borderRadius: 6 }}
          />
          <span
            style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15, color: '#ffffff' }}
          >
            StoreMD
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 26,
            color: '#ffffff',
          }}
        >
          Enter your Shopify domain
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 15,
            color: '#94a3b8',
            lineHeight: 1.5,
            marginTop: 10,
          }}
        >
          We'll scan your store and show you exactly what to fix — for free.
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 12,
            color: '#06b6d4',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 30,
          }}
        >
          SHOPIFY DOMAIN
        </div>

        {/* Input */}
        <div
          style={{
            marginTop: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #06b6d4',
            borderRadius: 12,
            height: 52,
            paddingLeft: 18,
            paddingRight: 18,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: fontBody, fontSize: 15, color: '#ffffff' }}>
            {typedText}
            {cursorVisible && f >= 25 && f < 65 && (
              <span style={{ color: '#06b6d4' }}>|</span>
            )}
          </span>
        </div>

        {/* CTA button */}
        <div
          style={{
            marginTop: 16,
            background: '#06b6d4',
            color: '#050507',
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 16,
            height: 52,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          Start free audit →
        </div>

        {/* Sub-text */}
        <div
          style={{
            marginTop: 14,
            fontFamily: fontBody,
            fontSize: 12,
            color: '#06b6d4',
            textAlign: 'center',
          }}
        >
          No credit card required · Results in 30 seconds
        </div>
      </AbsoluteFill>

      {/* ── Scan content ── */}
      <AbsoluteFill
        style={{
          opacity: scanContentOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <img
            src={staticFile('images/store-md-logo.png')}
            width={48}
            height={48}
            style={{ borderRadius: 10 }}
          />
          <span
            style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 22, color: '#ffffff' }}
          >
            StoreMD
          </span>
        </div>

        {/* Progress circle */}
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <svg width={180} height={180} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={90}
              cy={90}
              r={80}
              fill="none"
              stroke="rgba(6,182,212,0.2)"
              strokeWidth={4}
            />
            <circle
              cx={90}
              cy={90}
              r={80}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 38,
              color: '#06b6d4',
            }}
          >
            {scanPercent}%
          </div>
        </div>

        {/* Scanning label */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <span
            style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: '#ffffff' }}
          >
            Scanning{' '}
          </span>
          <span
            style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: '#06b6d4' }}
          >
            gymshark.com
          </span>
        </div>

        {/* Current check */}
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 13,
            color: '#64748b',
          }}
        >
          {getScanLabel(f)}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 300,
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: progressBarWidth,
              height: '100%',
              background: '#06b6d4',
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
