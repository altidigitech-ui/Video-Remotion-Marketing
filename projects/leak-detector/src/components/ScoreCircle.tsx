import React from 'react'
import { interpolate } from 'remotion'

export type ScoreCircleProps = {
  score: number
  size: number
  strokeWidth?: number
  frame: number
  startFrame: number
  animDuration?: number
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size,
  strokeWidth = 8,
  frame,
  startFrame,
  animDuration = 90,
}) => {
  const cx = size / 2
  const cy = size / 2
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r

  const targetOffset = circumference * (1 - score / 100)

  const dashOffset = interpolate(
    frame,
    [startFrame, startFrame + animDuration],
    [circumference, targetOffset],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const counterValue = Math.round(
    interpolate(
      frame,
      [startFrame, startFrame + animDuration],
      [0, score],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )

  const color = getScoreColor(score)

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      {/* Center text */}
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
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: size * 0.3,
            fontWeight: 800,
            color,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textShadow: `0 0 20px ${color}60`,
          }}
        >
          {counterValue}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: size * 0.1,
            color: '#64748B',
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          /100
        </span>
      </div>
    </div>
  )
}

export { getScoreColor }
