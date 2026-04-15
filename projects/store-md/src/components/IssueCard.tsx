import React from 'react'
import { spring, useVideoConfig } from 'remotion'
import { storeMdBrand, storeMdSeverityColors } from '@altidigitech/brand'

export type IssueSeverity = 'critical' | 'major' | 'minor' | 'info'

export type IssueCardProps = {
  severity: IssueSeverity
  title: string
  impact: string
  autoFixable?: boolean
  /** Local frame for the entrance animation. 0 = start. */
  frame: number
}

/**
 * Severity chip palette — mirrors the Tailwind `bg-{color}-100 / text-{color}-700`
 * pairs used by the StoreMD frontend IssueCard.
 */
const SEVERITY_CHIP: Record<IssueSeverity, { bg: string; fg: string; label: string }> = {
  critical: { bg: '#fee2e2', fg: '#b91c1c', label: 'Critical' },
  major: { bg: '#ffedd5', fg: '#c2410c', label: 'Major' },
  minor: { bg: '#fef3c7', fg: '#a16207', label: 'Minor' },
  info: { bg: '#dbeafe', fg: '#1d4ed8', label: 'Info' },
}

// Heroicons-style filled bolt (no lucide-react dependency in Remotion).
const BOLT_PATH = 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'

export const IssueCard: React.FC<IssueCardProps> = ({
  severity,
  title,
  impact,
  autoFixable = false,
  frame,
}) => {
  const { fps } = useVideoConfig()

  const enter = spring({
    frame: Math.max(0, frame),
    fps,
    from: 0,
    to: 1,
    config: storeMdBrand.motion.springSmooth,
  })

  const opacity = enter
  const translateY = (1 - enter) * 20

  const borderColor = storeMdSeverityColors[severity]
  const chip = SEVERITY_CHIP[severity]

  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: '#ffffff',
        borderRadius: 8,
        borderLeft: `4px solid ${borderColor}`,
        boxShadow:
          '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top row: severity chip + optional auto-fix badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: chip.bg,
            color: chip.fg,
            fontFamily: fontBody,
            fontWeight: storeMdBrand.typography.weightSemibold,
            fontSize: 12,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          {chip.label}
        </span>

        {autoFixable && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: '#eff6ff',
              color: '#1d4ed8',
              fontFamily: fontBody,
              fontWeight: storeMdBrand.typography.weightSemibold,
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
              <path d={BOLT_PATH} />
            </svg>
            Auto-fix
          </span>
        )}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: fontBody,
          fontSize: 16,
          fontWeight: storeMdBrand.typography.weightSemibold,
          color: '#0f172a',
          lineHeight: 1.4,
        }}
      >
        {title}
      </div>

      {/* Impact */}
      <div
        style={{
          fontFamily: fontBody,
          fontSize: 13,
          color: '#64748b',
          lineHeight: 1.5,
        }}
      >
        {impact}
      </div>
    </div>
  )
}
