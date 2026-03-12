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
import { LDBackground, GlowButton, LogoOverlay } from '@altidigitech/core'
import { ScoreCircle } from '../components/ScoreCircle'
import { CategoryScoreBar } from '../components/CategoryScoreBar'
import type { CategoryData } from '../components/CategoryScoreBar'

export type LDScreenDashboardProps = {
  brand: BrandConfig
}

const SPRING_ENTER = { damping: 14, stiffness: 120 }

const NAV_ITEMS = ['Dashboard', 'Analyze', 'Reports', 'Billing', 'Admin', 'Settings']

const CATEGORIES: CategoryData[] = [
  { label: 'Headline', score: 85 },
  { label: 'Call-to-Action', score: 60 },
  { label: 'Social Proof', score: 40 },
  { label: 'Form', score: 30 },
  { label: 'Visual Hierarchy', score: 90 },
  { label: 'Trust', score: 95 },
  { label: 'Mobile', score: 90 },
  { label: 'Performance', score: 95 },
]

const ISSUES = [
  {
    severity: 'critical' as const,
    title: 'No visible customer testimonials',
    desc: 'The page lacks customer testimonials, case studies, or specific company logos.',
  },
  {
    severity: 'warning' as const,
    title: 'Generic CTA lacks compelling action',
    desc: "The 'Get started' CTA is generic and doesn't communicate specific value.",
  },
]

export const LDScreenDashboard: React.FC<LDScreenDashboardProps> = ({ brand }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill>
      <LDBackground brand={brand} />

      {/* App UI container */}
      <AbsoluteFill style={{ padding: 40 }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(245,158,11,0.15)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
        >
          {/* Sidebar */}
          <Sidebar brand={brand} frame={frame} fps={fps} />

          {/* Main content */}
          <MainContent brand={brand} frame={frame} fps={fps} />
        </div>
      </AbsoluteFill>

      <LogoOverlay brand={brand} frame={frame} />
    </AbsoluteFill>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{ brand: BrandConfig; frame: number; fps: number }> = ({
  brand,
  frame,
  fps,
}) => {
  const sidebarOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: 240,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        opacity: sidebarOpacity,
        flexShrink: 0,
        borderRight: '1px solid rgba(245,158,11,0.1)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 8px', marginBottom: 32 }}>
        <Img
          src={staticFile(brand.assets.logoPng)}
          style={{ height: 48, width: 48, borderRadius: 10 }}
        />
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: i === 2 ? 600 : 400,
              color: i === 2 ? '#F8FAFC' : '#64748B',
              backgroundColor: i === 2 ? 'rgba(245,158,11,0.1)' : 'transparent',
              borderLeft: i === 2 ? '3px solid #F59E0B' : '3px solid transparent',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Plan badge */}
      <div
        style={{
          padding: '12px',
          borderRadius: 10,
          backgroundColor: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#A78BFA',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: 4,
          }}
        >
          CURRENT PLAN
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: '#A78BFA',
          }}
        >
          Agency
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: '#64748B',
            marginTop: 4,
          }}
        >
          10 / 200 analyses
        </div>
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: '#0A0F1E',
          }}
        >
          A
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#F8FAFC',
            }}
          >
            altidigitech
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#475569',
            }}
          >
            {'a●●●●●@●●●●.com'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Content ─────────────────────────────────────────────────────────────

const MainContent: React.FC<{ brand: BrandConfig; frame: number; fps: number }> = ({
  brand,
  frame,
  fps,
}) => {
  // Header fade
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Summary card
  const summaryY = spring({
    frame: frame - 60,
    fps,
    from: 40,
    to: 0,
    config: SPRING_ENTER,
  })
  const summaryOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Issues
  const issue1Y = spring({
    frame: frame - 300,
    fps,
    from: 40,
    to: 0,
    config: SPRING_ENTER,
  })
  const issue1Opacity = interpolate(frame, [300, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const issue2Y = spring({
    frame: frame - 330,
    fps,
    from: 40,
    to: 0,
    config: SPRING_ENTER,
  })
  const issue2Opacity = interpolate(frame, [330, 360], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // CTA
  const ctaOpacity = interpolate(frame, [480, 510], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ctaScale = spring({
    frame: frame - 480,
    fps,
    from: 0.8,
    to: 1,
    config: SPRING_ENTER,
  })

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#050A14',
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div
        style={{
          opacity: headerOpacity,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
            }}
          >
            Analysis Report
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, alignItems: 'center' }}>
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
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: '#475569',
              }}
            >
              Mar 11, 2026
            </div>
          </div>
        </div>

        {/* ScoreCircle top-right */}
        <ScoreCircle
          score={72}
          size={144}
          strokeWidth={8}
          frame={frame}
          startFrame={30}
          animDuration={90}
        />
      </div>

      {/* Summary card */}
      <div
        style={{
          opacity: summaryOpacity,
          transform: `translateY(${summaryY}px)`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderLeft: '4px solid #F59E0B',
          borderRadius: 10,
          padding: '16px 20px',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            color: '#94A3B8',
            lineHeight: 1.5,
          }}
        >
          vercel.com demonstrates strong technical performance but suffers from unclear value
          proposition and weak conversion elements.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <Badge text="1 critical issue" color="#ef4444" />
          <Badge text="2 warnings" color="#f59e0b" />
        </div>
      </div>

      {/* Category bars */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <CategoryScoreBar
            key={i}
            category={cat}
            frame={frame}
            startFrame={90 + i * 15}
            animDuration={45}
            labelWidth={160}
            fontSize={18}
          />
        ))}
      </div>

      {/* Real screenshots */}
      <ScreenshotPanel frame={frame} fps={fps} />

      {/* Issue cards */}
      <div style={{ display: 'flex', gap: 16 }}>
        {ISSUES.map((issue, i) => {
          const issueOpacity = i === 0 ? issue1Opacity : issue2Opacity
          const issueY = i === 0 ? issue1Y : issue2Y
          const borderColor = issue.severity === 'critical' ? '#ef4444' : '#f59e0b'
          const bgColor =
            issue.severity === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)'

          return (
            <div
              key={i}
              style={{
                opacity: issueOpacity,
                transform: `translateY(${issueY}px)`,
                flex: 1,
                backgroundColor: bgColor,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#F8FAFC',
                  marginBottom: 6,
                }}
              >
                {issue.title}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  color: '#64748B',
                  lineHeight: 1.4,
                }}
              >
                {issue.desc}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 4,
        }}
      >
        <GlowButton text="⟶ ANALYZE YOUR PAGE FREE" brand={brand} scale={ctaScale} />
      </div>
    </div>
  )
}

// ── Summary Cards Panel ──────────────────────────────────────────────────────

const MINI_CATEGORIES: CategoryData[] = [
  { label: 'Headline', score: 85 },
  { label: 'CTA', score: 60 },
  { label: 'Social Proof', score: 40 },
  { label: 'Form', score: 30 },
  { label: 'Visual', score: 90 },
  { label: 'Trust', score: 95 },
]

const ScreenshotPanel: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Card 1 — mini category bars
  const card1Y = spring({
    frame: frame - 220,
    fps,
    from: 40,
    to: 0,
    config: { damping: 14, stiffness: 120 },
  })
  const card1Opacity = interpolate(frame, [220, 250], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Card 2 — report summary
  const card2Y = spring({
    frame: frame - 240,
    fps,
    from: 40,
    to: 0,
    config: { damping: 14, stiffness: 120 },
  })
  const card2Opacity = interpolate(frame, [240, 270], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
      {/* Card 1: Mini category bars */}
      <div
        style={{
          flex: 1,
          opacity: card1Opacity,
          transform: `translateY(${card1Y}px)`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#F59E0B',
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}
        >
          CATEGORY SCORES
        </div>
        {MINI_CATEGORIES.map((cat, i) => (
          <CategoryScoreBar
            key={i}
            category={cat}
            frame={frame}
            startFrame={240 + i * 10}
            animDuration={35}
            labelWidth={80}
            fontSize={13}
          />
        ))}
      </div>

      {/* Card 2: Report summary */}
      <div
        style={{
          flex: 1,
          opacity: card2Opacity,
          transform: `translateY(${card2Y}px)`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#F8FAFC',
              }}
            >
              Analysis Report
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                color: '#F59E0B',
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              vercel.com
            </div>
          </div>
          <ScoreCircle
            score={72}
            size={80}
            strokeWidth={5}
            frame={frame}
            startFrame={260}
            animDuration={60}
          />
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            color: '#64748B',
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          Strong technical performance but weak conversion elements. Missing social proof and
          generic CTAs reduce conversion potential.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge text="1 critical" color="#ef4444" />
          <Badge text="2 warnings" color="#f59e0b" />
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 100,
      backgroundColor: `${color}15`,
      border: `1px solid ${color}40`,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      fontWeight: 600,
      color,
    }}
  >
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
    {text}
  </div>
)
