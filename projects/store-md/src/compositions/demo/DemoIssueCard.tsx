import React from 'react'
import { storeMdBrand } from '@altidigitech/brand'

export type DemoIssueCardProps = {
  severity: 'critical' | 'major' | 'minor'
  category: string
  title: string
  description: string
  autoFixable?: boolean
}

export const DemoIssueCard: React.FC<DemoIssueCardProps> = ({
  severity,
  category,
  title,
  description,
  autoFixable = true,
}) => {
  const severityConfig = {
    critical: {
      label: 'CRITICAL',
      color: '#f87171',
      bgTint: 'rgba(220,38,38,0.08)',
      borderColor: 'rgba(220,38,38,0.3)',
    },
    major: {
      label: 'MAJOR',
      color: '#fb923c',
      bgTint: 'rgba(234,88,12,0.08)',
      borderColor: 'rgba(234,88,12,0.3)',
    },
    minor: {
      label: 'MINOR',
      color: '#fbbf24',
      bgTint: 'rgba(202,138,4,0.08)',
      borderColor: 'rgba(202,138,4,0.3)',
    },
  }
  const cfg = severityConfig[severity]
  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`

  return (
    <div
      style={{
        background: cfg.bgTint,
        border: `1px solid ${cfg.borderColor}`,
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 12,
            color: cfg.color,
            letterSpacing: '0.04em',
          }}
        >
          {cfg.label}
        </span>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: 11,
            color: '#94a3b8',
            background: 'rgba(148,163,184,0.15)',
            borderRadius: 6,
            padding: '3px 10px',
          }}
        >
          {category}
        </span>
        {autoFixable && (
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 11,
              color: '#06b6d4',
              background: 'rgba(6,182,212,0.12)',
              borderRadius: 6,
              padding: '3px 10px',
            }}
          >
            Auto-fixable with StoreMD
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize: 16,
          color: '#f8fafc',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: fontBody,
          fontSize: 13,
          color: '#94a3b8',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}
