import React from 'react'
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { storeMdBrand } from '@altidigitech/brand'
import { StoreMDBackground } from '../../components/StoreMDBackground'
import { DemoIssueCard } from './DemoIssueCard'
import { DemoLockedModule } from './DemoLockedModule'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const SCORE_CIRCUMFERENCE = 2 * Math.PI * 88 // radius 88, diameter 200 (inner ring)

const ISSUES = [
  {
    severity: 'critical' as const,
    category: 'SEO',
    title: 'Missing page title',
    description:
      'Your homepage has no <title> tag. Search engines use this as the primary ranking signal and display it in search results.',
  },
  {
    severity: 'critical' as const,
    category: 'SEO',
    title: 'Missing meta description',
    description:
      'No <meta name="description"> found. Google uses this as the snippet in search results, directly affecting click-through rate.',
  },
  {
    severity: 'critical' as const,
    category: 'Robots',
    title: 'robots.txt blocks all crawlers',
    description:
      "Your robots.txt contains 'Disallow: /' which blocks search engines from indexing your entire store. This will devastate your search visibility.",
  },
  {
    severity: 'major' as const,
    category: 'SEO',
    title: 'Missing Open Graph tags',
    description:
      'No og:title or og:image found. Social media shares will show broken or generic previews.',
  },
  {
    severity: 'major' as const,
    category: 'SEO',
    title: 'No H1 heading found',
    description:
      'Your homepage has no <h1> tag. Search engines rely on H1 to understand the primary topic of a page.',
  },
  {
    severity: 'major' as const,
    category: 'Accessibility',
    title: '1 link with no text',
    description:
      'Found 1 anchor element with no visible or aria text. Screen readers will announce these as empty.',
  },
  {
    severity: 'minor' as const,
    category: 'SEO',
    title: 'Missing Twitter Card tags',
    description:
      'No <meta name="twitter:card"> found. Twitter Card tags improve how your links appear when shared on X/Twitter.',
  },
  {
    severity: 'minor' as const,
    category: 'SEO',
    title: 'Missing language attribute on <html>',
    description:
      'The <html> element has no lang attribute. This helps search engines index your content in the right language and region.',
  },
]

const LOCKED_MODULES = [
  { name: 'App Impact Analysis', description: 'Find which installed apps slow your store down the most' },
  { name: 'Ghost Billing Detection', description: "Find apps you're paying for but not using" },
  { name: 'Code Residue Scanner', description: 'Detect leftover code from uninstalled apps' },
  { name: 'Listing Optimizer', description: 'AI-powered product listing improvements' },
  { name: 'Auto-Fix Engine', description: 'One-click fixes for SEO, accessibility and broken links' },
  { name: 'Email Health', description: 'SPF/DKIM/DMARC checks on your sending domain' },
  { name: 'Real Browser Testing', description: 'Playwright-based performance and visual testing' },
]

const BADGES = [
  { label: '3 critical', bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
  { label: '3 major', bg: 'rgba(251,146,60,0.15)', color: '#fb923c' },
  { label: '2 minor', bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
]

export const DemoResults: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame()
  const f = frame - startFrame

  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`

  // ── Score arc ─────────────────────────────────────────────────────────────
  const scoreProgress = interpolate(f, [5, 45], [0, 51], clamp)
  const scoreStrokeDashoffset = SCORE_CIRCUMFERENCE * (1 - scoreProgress / 100)
  const displayScore = Math.round(scoreProgress)

  // ── Badge stagger ─────────────────────────────────────────────────────────
  const badgeOpacities = BADGES.map((_, i) =>
    interpolate(f, [50 + i * 6, 56 + i * 6], [0, 1], clamp)
  )

  // ── Scroll ────────────────────────────────────────────────────────────────
  const scrollY = (() => {
    if (f <= 80) return 0
    if (f <= 200) return interpolate(f, [80, 200], [0, -1800], clamp)
    return interpolate(f, [200, 280], [-1800, -3200], clamp)
  })()

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <StoreMDBackground brand={storeMdBrand} />

      {/* ── Scrollable inner content ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${scrollY}px)`,
          paddingTop: 120,
        }}
      >
        {/* Score section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ fontFamily: fontBody, fontSize: 14, color: '#64748b', textAlign: 'center' }}>
            Preview scan for
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 22,
              color: '#ffffff',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            gymshark.com
          </div>

          {/* Score circle */}
          <div style={{ position: 'relative', width: 200, height: 200, marginTop: 30 }}>
            <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={100}
                cy={100}
                r={88}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={8}
              />
              <circle
                cx={100}
                cy={100}
                r={88}
                fill="none"
                stroke="#ea580c"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={SCORE_CIRCUMFERENCE}
                strokeDashoffset={scoreStrokeDashoffset}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 52,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {displayScore}
              </span>
              <span style={{ fontFamily: fontBody, fontSize: 18, color: '#64748b' }}>/100</span>
            </div>
          </div>

          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 18,
              color: '#ffffff',
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            Preview Score
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
              marginTop: 6,
            }}
          >
            6 of 21 checks completed
          </div>

          {/* Severity badges */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'center',
              marginTop: 20,
              flexWrap: 'wrap',
            }}
          >
            {BADGES.map((badge, i) => (
              <span
                key={badge.label}
                style={{
                  opacity: badgeOpacities[i],
                  background: badge.bg,
                  color: badge.color,
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Issues section */}
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: '#ffffff',
            padding: '30px 20px 16px',
          }}
        >
          Issues found (8)
        </div>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          {ISSUES.map((issue) => (
            <DemoIssueCard key={issue.title} {...issue} />
          ))}
        </div>

        {/* Locked modules section */}
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: '#ffffff',
            padding: '30px 20px 8px',
          }}
        >
          Locked — 7 more modules
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 14,
            color: '#94a3b8',
            padding: '0 20px 20px',
            lineHeight: 1.5,
          }}
        >
          These checks require StoreMD to be installed and connected to your Shopify store.
        </div>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          {LOCKED_MODULES.map((mod) => (
            <DemoLockedModule key={mod.name} {...mod} />
          ))}
        </div>

        {/* Bottom spacer so sticky bar doesn't clip last module */}
        <div style={{ height: 200 }} />
      </div>

      {/* ── Fixed beta banner ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 40px 10px 20px',
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
            fontFamily: fontBody,
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          ✕
        </span>
      </div>

      {/* ── Fixed navbar ── */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(5,5,7,0.9)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
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
            style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 18, color: '#ffffff' }}
          >
            StoreMD
          </span>
        </div>
        <span style={{ fontSize: 24, color: '#ffffff' }}>☰</span>
      </div>

      {/* ── Sticky bottom CTA bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(5,5,7,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 15,
            color: '#ffffff',
          }}
        >
          Get the full picture — install StoreMD
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: '#94a3b8',
            marginTop: 4,
          }}
        >
          Unlock 15 more checks + automatic fixes
        </div>
        <div
          style={{
            marginTop: 10,
            background: '#06b6d4',
            color: '#050507',
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 14,
            padding: '12px 28px',
            borderRadius: 10,
            textAlign: 'center',
          }}
        >
          Install StoreMD free →
        </div>
      </div>
    </AbsoluteFill>
  )
}
