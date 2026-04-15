import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'
import { storeMdBrand, storeMdScoreColors } from '@altidigitech/brand'

export type ScoreCircleProps = {
  score: number
  startFrame: number
  duration?: number
  /** Initial value to count FROM (default 0). Set higher than `score` to make
   *  the number appear to "fall" — used in dramatic dashboard reveals. */
  from?: number
}

// Mirrors the StoreMD frontend `getScoreStroke` (5-tier scale).
const getScoreStroke = (score: number): string => {
  if (score >= 80) return storeMdScoreColors.excellent
  if (score >= 60) return storeMdScoreColors.good
  if (score >= 40) return storeMdScoreColors.warning
  if (score >= 20) return storeMdScoreColors.poor
  return storeMdScoreColors.critical
}

// Component dimensions match the frontend (h-40 w-40 = 160px).
const SIZE = 160
const VIEWBOX = 128
const RADIUS = 56
const STROKE_WIDTH = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  startFrame,
  duration = 80,
  from = 0,
}) => {
  const frame = useCurrentFrame()
  const color = getScoreStroke(score)

  const fromOffset = CIRCUMFERENCE * (1 - from / 100)
  const targetOffset = CIRCUMFERENCE * (1 - score / 100)

  const dashOffset = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [fromOffset, targetOffset],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const counterValue = Math.round(
    interpolate(
      frame,
      [startFrame, startFrame + duration],
      [from, score],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  )

  return (
    <div style={{ width: SIZE, height: SIZE, position: 'relative' }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={RADIUS}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Score arc — drop-shadow uses the score color at 0x80 (~50%) alpha */}
        <circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
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
            fontFamily: `'${storeMdBrand.typography.fontDisplay}', sans-serif`,
            fontSize: 56,
            fontWeight: storeMdBrand.typography.weightBold,
            color,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counterValue}
        </span>
        <span
          style={{
            fontFamily: `'${storeMdBrand.typography.fontMono}', monospace`,
            fontSize: 14,
            color: '#64748b',
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

export { getScoreStroke }
