import React from 'react'
import { interpolate } from 'remotion'

export type CategoryData = {
  label: string
  score: number
}

type CategoryScoreBarProps = {
  category: CategoryData
  frame: number
  startFrame: number
  animDuration?: number
  labelWidth?: number
  fontSize?: number
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

export const CategoryScoreBar: React.FC<CategoryScoreBarProps> = ({
  category,
  frame,
  startFrame,
  animDuration = 45,
  labelWidth = 200,
  fontSize = 20,
}) => {
  const barWidth = interpolate(
    frame,
    [startFrame, startFrame + animDuration],
    [0, category.score],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const color = getScoreColor(category.score)

  const displayScore = Math.round(
    interpolate(
      frame,
      [startFrame, startFrame + animDuration],
      [0, category.score],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )

  return (
    <div
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
      }}
    >
      {/* Label */}
      <div
        style={{
          width: labelWidth,
          flexShrink: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize,
          fontWeight: 500,
          color: '#CBD5E1',
          textAlign: 'right',
        }}
      >
        {category.label}
      </div>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: fontSize * 0.6,
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 4,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>

      {/* Score value */}
      <div
        style={{
          width: 60,
          flexShrink: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 700,
          color,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayScore}
      </div>
    </div>
  )
}
