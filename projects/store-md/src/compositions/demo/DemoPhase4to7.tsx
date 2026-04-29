import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, Easing, staticFile } from 'remotion'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'
import { BrowserFrame, StoreMDBackground, ScoreCircle, IssueCard } from '../../components'

// ─── constants ────────────────────────────────────────────────────────────────

const SCAN_MESSAGES: Array<{ from: number; to: number; text: string }> = [
  { from: 300, to: 330, text: 'Checking SEO meta tags...' },
  { from: 330, to: 360, text: 'Analyzing page structure...' },
  { from: 360, to: 390, text: 'Scanning for broken links...' },
  { from: 390, to: 420, text: 'Checking Open Graph tags...' },
  { from: 420, to: 440, text: 'Running accessibility audit...' },
]

const ISSUES: Array<{
  severity: 'critical' | 'major' | 'minor'
  title: string
  impact: string
  borderColor: string
}> = [
  {
    severity: 'critical',
    title: 'Missing page title',
    impact: 'Pages without titles rank lower in search results and hurt CTR.',
    borderColor: '#b91c1c',
  },
  {
    severity: 'critical',
    title: 'Missing meta description',
    impact: 'Search engines generate poor snippets, reducing click-through rates.',
    borderColor: '#b91c1c',
  },
  {
    severity: 'critical',
    title: 'robots.txt blocks all crawlers',
    impact: 'Your store may be completely invisible to search engines.',
    borderColor: '#b91c1c',
  },
  {
    severity: 'major',
    title: 'Missing Open Graph tags',
    impact: 'Social shares will show broken previews on Facebook and LinkedIn.',
    borderColor: '#c2410c',
  },
  {
    severity: 'major',
    title: 'No H1 heading found',
    impact: 'Missing semantic hierarchy confuses crawlers and screen readers.',
    borderColor: '#c2410c',
  },
  {
    severity: 'major',
    title: '1 link with no text',
    impact: 'Invisible links break accessibility and reduce crawl quality.',
    borderColor: '#c2410c',
  },
  {
    severity: 'minor',
    title: 'Missing Twitter Card tags',
    impact: 'Tweet previews will show a blank card instead of your content.',
    borderColor: '#a16207',
  },
  {
    severity: 'minor',
    title: 'Missing language attribute',
    impact: 'Browsers and assistive technologies cannot detect your page language.',
    borderColor: '#a16207',
  },
]

const LOCKED_MODULES = [
  'App Impact Analysis',
  'Ghost Billing Detection',
  'Code Residue Scanner',
  'Listing Optimizer',
  'Auto-Fix Engine',
  'Email Health',
  'Real Browser Testing',
]

const SCAN_CIRCUMFERENCE = 2 * Math.PI * 70

// ─── component ────────────────────────────────────────────────────────────────

export const DemoPhase4to7: React.FC<{ startFrame: number }> = ({ startFrame: _startFrame }) => {
  const frame = useCurrentFrame()

  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`
  const fontMono = `'${storeMdBrand.typography.fontMono}', monospace`

  // ─── Phase 4: scan ────────────────────────────────────────────────
  const scanProgress = interpolate(frame, [310, 440], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scanPercent = Math.round(scanProgress)
  const scanDashOffset = SCAN_CIRCUMFERENCE * (1 - scanProgress / 100)

  const scanBarWidth = interpolate(frame, [310, 440], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const currentMsg =
    SCAN_MESSAGES.find((m) => frame >= m.from && frame < m.to)?.text ?? 'Finalizing report...'

  const scanOpacity = interpolate(frame, [300, 310], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ─── Phase 5: results crossfade ───────────────────────────────────
  // opacity crossfade between the scan layer and the results layer
  const scanLayerOpacity = interpolate(frame, [450, 460], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const resultsLayerOpacity = interpolate(frame, [450, 460], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Badges stagger: badge 0 at 490, 1 at 496, 2 at 502
  const badgeOpacities = [0, 1, 2].map((i) =>
    interpolate(frame, [490 + i * 6, 498 + i * 6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )

  // First issue slide-in at 510
  const firstIssueTranslateY = interpolate(frame, [510, 520], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const firstIssueOpacity = interpolate(frame, [510, 520], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ─── Phase 6: scroll ─────────────────────────────────────────────
  const scrollY1 = interpolate(frame, [560, 660], [0, -900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  })

  // ─── Phase 7: locked + scroll cont. ──────────────────────────────
  const scrollY2 = interpolate(frame, [660, 710], [-900, -1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  })

  const totalScrollY = frame < 560 ? 0 : frame < 660 ? scrollY1 : scrollY2

  // Locked module stagger from frame 670
  const lockedOpacities = LOCKED_MODULES.map((_, i) =>
    interpolate(frame, [670 + i * 4, 678 + i * 4], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )
  const lockedTranslates = LOCKED_MODULES.map((_, i) =>
    interpolate(frame, [670 + i * 4, 678 + i * 4], [10, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )

  return (
    <AbsoluteFill>
      <StoreMDBackground brand={storeMdBrand} />

      {/* ── Phase 4: scan layer ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: scanLayerOpacity,
          pointerEvents: 'none',
        }}
      >
        <BrowserFrame url="storemd.app" bgColor={storeMdBrand.colors.background}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              opacity: scanOpacity,
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img
                  src={staticFile('images/store-md-logo.png')}
                  width={32}
                  height={32}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 24,
                  color: '#ffffff',
                }}
              >
                StoreMD
              </span>
            </div>

            {/* Progress circle */}
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg width={160} height={160} viewBox="0 0 160 160">
                {/* Track */}
                <circle
                  cx={80}
                  cy={80}
                  r={70}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={6}
                />
                {/* Progress arc */}
                <circle
                  cx={80}
                  cy={80}
                  r={70}
                  fill="none"
                  stroke={storeMdBrand.colors.accent}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={SCAN_CIRCUMFERENCE}
                  strokeDashoffset={scanDashOffset}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              {/* Center percent */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 36,
                  color: '#ffffff',
                }}
              >
                {scanPercent}%
              </div>
            </div>

            {/* Scanning label */}
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 16,
                color: '#ffffff',
              }}
            >
              Scanning gymshark.com
            </div>

            {/* Current check */}
            <div
              style={{
                fontFamily: fontMono,
                fontSize: 12,
                color: '#94a3b8',
              }}
            >
              {currentMsg}
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: 280,
                height: 3,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${scanBarWidth}%`,
                  background: storeMdBrand.colors.accent,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        </BrowserFrame>
      </div>

      {/* ── Phase 5–7: results layer ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: resultsLayerOpacity,
        }}
      >
        <BrowserFrame url="storemd.app/results/gymshark.com" bgColor="#ffffff">
          {/* Scrollable inner content */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${totalScrollY}px)`,
            }}
          >
            {/* ── Results header ── */}
            <div style={{ padding: '24px 24px 0' }}>
              <div
                style={{
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 11,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                PREVIEW SCORE
              </div>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#0f172a',
                  marginTop: 4,
                }}
              >
                gymshark.com
              </div>
            </div>

            {/* ── Score section ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <ScoreCircle score={51} startFrame={460} duration={50} />

              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#0f172a',
                  marginTop: 12,
                }}
              >
                51 / 100
              </div>
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: '#64748b',
                  marginTop: 4,
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
                  marginTop: 16,
                  justifyContent: 'center',
                }}
              >
                {(
                  [
                    { label: '3 critical', bg: '#fee2e2', color: '#b91c1c' },
                    { label: '3 major', bg: '#ffedd5', color: '#c2410c' },
                    { label: '2 minor', bg: '#fef3c7', color: '#a16207' },
                  ] as const
                ).map((badge, i) => (
                  <span
                    key={badge.label}
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      borderRadius: 999,
                      padding: '4px 12px',
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: 12,
                      opacity: badgeOpacities[i],
                    }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── First issue (slide-in) ── */}
            <div
              style={{
                margin: '12px 24px 0',
                opacity: firstIssueOpacity,
                transform: `translateY(${firstIssueTranslateY}px)`,
              }}
            >
              <IssueCard
                severity="critical"
                title="Missing page title"
                impact="Pages without titles rank lower in search results and hurt CTR."
                frame={frame - 510}
              />
            </div>

            {/* ── Remaining issues (always in DOM, revealed by scroll) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 24px 0' }}>
              {ISSUES.slice(1).map((issue) => (
                <div
                  key={issue.title}
                  style={{
                    background: '#ffffff',
                    borderLeft: `3px solid ${issue.borderColor}`,
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#0f172a',
                      marginBottom: 4,
                    }}
                  >
                    {issue.title}
                  </div>
                  <div
                    style={{
                      fontFamily: fontBody,
                      fontSize: 12,
                      color: '#64748b',
                      lineHeight: 1.5,
                    }}
                  >
                    {issue.impact}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Email capture block ── */}
            <div
              style={{
                margin: 24,
                background: '#f0f9ff',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 24 }}>📧</div>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#0f172a',
                  marginTop: 8,
                  marginBottom: 12,
                }}
              >
                Get this report emailed to you
              </div>
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    height: 36,
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px 0 0 8px',
                    flex: 1,
                    paddingLeft: 12,
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                  }}
                >
                  email@example.com
                </div>
                <div
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    height: 36,
                    borderRadius: '0 8px 8px 0',
                    padding: '0 16px',
                    fontFamily: fontDisplay,
                    fontWeight: 600,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Send
                </div>
              </div>
            </div>

            {/* ── Phase 7: locked modules ── */}
            <div
              style={{
                padding: '16px 24px 0',
                marginTop: 16,
              }}
            >
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 18,
                  color: '#0f172a',
                  marginBottom: 16,
                }}
              >
                🔒 Locked — 7 more modules
              </div>

              {/* 2-column grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {LOCKED_MODULES.map((name, i) => (
                  <div
                    key={name}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 14,
                      opacity: lockedOpacities[i],
                      transform: `translateY(${lockedTranslates[i]}px)`,
                      // Last item spans both columns if odd count
                      gridColumn: i === LOCKED_MODULES.length - 1 && LOCKED_MODULES.length % 2 !== 0 ? '1 / -1' : undefined,
                    }}
                  >
                    <div style={{ fontSize: 14, opacity: 0.4, marginBottom: 4 }}>🔒</div>
                    <div
                      style={{
                        fontFamily: fontBody,
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#334155',
                        marginBottom: 2,
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        fontFamily: fontBody,
                        fontSize: 11,
                        color: '#94a3b8',
                      }}
                    >
                      Locked
                    </div>
                  </div>
                ))}
              </div>

              {/* bottom padding so last cards aren't clipped */}
              <div style={{ height: 40 }} />
            </div>
          </div>
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  )
}
