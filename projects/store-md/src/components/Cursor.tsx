import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'

export type CursorWaypoint = {
  frame: number
  x: number
  y: number
  click?: boolean
}

export type CursorProps = {
  waypoints: CursorWaypoint[];
  startFrame?: number
  endFrame?: number
}

export const Cursor: React.FC<CursorProps> = ({
  waypoints,
  startFrame = 0,
  endFrame = Infinity,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sorted = [...waypoints].sort((a, b) => a.frame - b.frame)

  // Compute current x, y by interpolating between consecutive waypoints
  let x = sorted.length > 0 ? sorted[0].x : 0
  let y = sorted.length > 0 ? sorted[0].y : 0

  if (sorted.length >= 2) {
    const inputFrames = sorted.map((w) => w.frame)
    const xValues = sorted.map((w) => w.x)
    const yValues = sorted.map((w) => w.y)

    x = interpolate(frame, inputFrames, xValues, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    })

    y = interpolate(frame, inputFrames, yValues, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    })
  }

  // Detect active click: find the closest waypoint with click === true
  const clickFrame = sorted.find(
    (w) => w.click === true && frame >= w.frame && frame <= w.frame + 4
  )

  let scale = 1
  if (clickFrame) {
    const localFrame = frame - clickFrame.frame
    if (localFrame <= 4) {
      scale = interpolate(localFrame, [0, 4], [1, 0.85], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    }
  } else {
    // Find any recent click to spring back from
    const recentClick = sorted.find(
      (w) => w.click === true && frame > w.frame + 4 && frame <= w.frame + 20
    )
    if (recentClick) {
      const localFrame = frame - recentClick.frame - 4
      scale = spring({
        frame: localFrame,
        fps,
        from: 0.85,
        to: 1,
        config: { damping: 15, stiffness: 200, mass: 1 },
      })
    }
  }

  // Opacity: fade in over 8 frames after startFrame, fade out 8 frames before endFrame
  const fadeInOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fadeOutOpacity =
    endFrame === Infinity
      ? 1
      : interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

  const opacity = Math.min(fadeInOpacity, fadeOutOpacity)

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 20,
        height: 28,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '2px 2px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <svg width="20" height="28" viewBox="0 0 20 28">
        <path
          d="M2 2L2 24L7 19L12 26L15 24.5L10 17.5L17 17.5L2 2Z"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
