import React from 'react'
import { storeMdBrand } from '@altidigitech/brand'

export type DemoLockedModuleProps = {
  name: string
  description: string
}

export const DemoLockedModule: React.FC<DemoLockedModuleProps> = ({ name, description }) => {
  const fontDisplay = `'${storeMdBrand.typography.fontDisplay}', sans-serif`
  const fontBody = `'${storeMdBrand.typography.fontBody}', sans-serif`

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '20px 18px',
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'row',
        gap: 14,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 15,
            color: '#f8fafc',
            marginBottom: 4,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 13,
            color: '#94a3b8',
            lineHeight: 1.4,
            marginBottom: 8,
          }}
        >
          {description}
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: 11,
            color: '#64748b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            padding: '3px 10px',
          }}
        >
          Requires install
        </span>
      </div>
    </div>
  )
}
