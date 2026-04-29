import React from 'react'
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../../components/StoreMDBackground'

export const DemoHomepage: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame()
  const relFrame = frame - startFrame

  const opacity = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const bannerOpacity = interpolate(relFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`
  const fontMono = `'${storeMdBrand.typography.fontMono}', monospace`

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      <StoreMDBackground brand={storeMdBrand} />

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 1. Beta banner */}
        <div
          style={{
            opacity: bannerOpacity,
            background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 40px 10px 20px',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 13,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            🧪 We're looking for 10 beta testers — get StoreMD free for life. Start your free scan →
          </span>
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: fontBody,
              fontSize: 14,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ✕
          </span>
        </div>

        {/* 2. Navbar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <img
              src={staticFile('images/store-md-logo.png')}
              width={36}
              height={36}
              style={{ borderRadius: 8 }}
            />
            <span
              style={{
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 18,
                color: '#ffffff',
              }}
            >
              StoreMD
            </span>
          </div>
          <span style={{ fontSize: 24, color: '#ffffff' }}>☰</span>
        </div>

        {/* 3. Hero section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: 24,
            paddingRight: 24,
            marginTop: 50,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 40,
              color: '#ffffff',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            One app. Five killed.
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 40,
              color: '#06b6d4',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Zero regrets.
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 15,
              color: '#94a3b8',
              textAlign: 'center',
              lineHeight: 1.6,
              marginTop: 20,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            SEO, speed, accessibility, broken links, audits. You're paying 5 Shopify apps to send
            you PDFs you never read. StoreMD replaces all 5 with one AI agent that actually fixes
            what's broken. Save $852/year. Faster store. No more homework.
          </div>
        </div>

        {/* 4. CTA Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 30,
            paddingLeft: 24,
            paddingRight: 24,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: '#06b6d4',
              color: '#050507',
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 17,
              padding: '16px 36px',
              borderRadius: 14,
              width: '90%',
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            Show me what I can uninstall →
          </div>
        </div>

        {/* 5. Trust points */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            marginTop: 16,
            flexShrink: 0,
            flexWrap: 'wrap',
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          {['14-day free trial', 'No credit card', 'Free migration from your current apps'].map(
            (text) => (
              <span
                key={text}
                style={{ fontFamily: fontBody, fontSize: 12, color: '#64748b' }}
              >
                {text}
              </span>
            )
          )}
        </div>

        {/* 6. Preview browser bar */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 40,
            background: '#0d1117',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 5, flexShrink: 0 }}>
            {['#ef4444', '#eab308', '#22c55e'].map((c) => (
              <div
                key={c}
                style={{ width: 8, height: 8, borderRadius: '50%', background: c }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 12,
              color: '#64748b',
              flex: 1,
            }}
          >
            storemd.app / health
          </span>
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 11,
              color: '#06b6d4',
              background: 'rgba(6,182,212,0.15)',
              borderRadius: 8,
              padding: '3px 10px',
              flexShrink: 0,
            }}
          >
            ✦ Live scan
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
