import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

export const LeakDetectorBackground: React.FC = () => {
  const frame = useCurrentFrame()

  const orbFloat = Math.sin(frame * 0.02) * 20

  return (
    <AbsoluteFill>
      {/* Base slate */}
      <AbsoluteFill style={{ backgroundColor: '#0F172A' }} />

      {/* Amber orb — top right */}
      <div
        style={{
          position: 'absolute',
          top: -200 + orbFloat,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Blue orb — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: -200 - orbFloat,
          left: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Dot grid pattern */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148, 163, 184, 0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </AbsoluteFill>
  )
}
