import React from 'react'
import { useCurrentFrame, interpolate, Sequence } from 'remotion'
import { Cursor } from '../components/Cursor'
import { DemoPhase1to3 } from './demo/DemoPhase1to3'
import { DemoPhase4to7 } from './demo/DemoPhase4to7'

export const SMDWebsiteDemo: React.FC = () => {
  const frame = useCurrentFrame()

  const CURSOR_WAYPOINTS = [
    // Phase 1 — move toward CTA button
    { frame: 60, x: 540, y: 400 },
    { frame: 120, x: 540, y: 1050 },
    { frame: 130, x: 540, y: 1050 },
    { frame: 140, x: 540, y: 1050, click: true },
    // Phase 2 — move to modal input
    { frame: 180, x: 540, y: 870 },
    { frame: 210, x: 540, y: 870 },
    { frame: 215, x: 540, y: 870, click: true },
    // Phase 3 — move to Start button
    { frame: 275, x: 540, y: 970 },
    { frame: 290, x: 540, y: 970 },
    { frame: 295, x: 540, y: 970, click: true },
    { frame: 305, x: 540, y: 970 },
  ]

  // Fade-out final
  const fadeOut = interpolate(frame, [730, 750], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        backgroundColor: '#000000',
        overflow: 'hidden',
        opacity: fadeOut,
      }}
    >
      {/* Phases 1-3: Homepage + Modal + URL typing (frames 0-300) */}
      {frame < 310 && (
        <Sequence from={0} durationInFrames={310}>
          <DemoPhase1to3 startFrame={0} />
        </Sequence>
      )}

      {/* Phases 4-7: Scan + Results + Scroll + Locked (frames 300-730) */}
      {frame >= 290 && (
        <Sequence from={300} durationInFrames={430}>
          <DemoPhase4to7 startFrame={300} />
        </Sequence>
      )}

      {/* Cursor always on top */}
      <Cursor waypoints={CURSOR_WAYPOINTS} startFrame={60} endFrame={305} />
    </div>
  )
}
