import React from 'react'

export type BrowserFrameProps = {
  url: string
  children: React.ReactNode
  bgColor?: string
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  children,
  bgColor = '#050507',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 50,
        left: 40,
        right: 40,
        bottom: 50,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Browser chrome bar */}
      <div
        style={{
          height: 44,
          flexShrink: 0,
          background: '#1e1e1e',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Traffic lights */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginLeft: 16,
          }}
        >
          {(['#ff5f57', '#febc2e', '#28c840'] as const).map((color, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: color,
              }}
            />
          ))}
        </div>

        {/* URL bar */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#a0a0a0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '60%',
          }}
        >
          {url}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          background: bgColor,
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
}
