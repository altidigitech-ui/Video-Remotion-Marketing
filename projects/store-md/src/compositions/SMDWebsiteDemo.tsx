import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { DemoHomepage } from './demo/DemoHomepage'
import { DemoModalAndScan } from './demo/DemoModalAndScan'
import { DemoResults } from './demo/DemoResults'

// TIMING (750 frames = 25 secondes @ 30fps)
//
// Homepage      : frames 0   → 120  (4s)
// Modal+Scan    : frames 120 → 310  (6.3s)
// Results+Scroll: frames 310 → 730  (14s)
// Fade out      : frames 730 → 750  (0.7s)

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

export const SMDWebsiteDemo: React.FC = () => {
  const frame = useCurrentFrame()

  // Crossfade homepage → modal (frames 115-125)
  const homepageOpacity = interpolate(frame, [115, 125], [1, 0], clamp)

  // Crossfade modal+scan → results (frames 305-315)
  const modalScanOpacity = interpolate(frame, [305, 315], [1, 0], clamp)
  const resultsOpacity = interpolate(frame, [305, 315], [0, 1], clamp)

  // Global fade out
  const fadeOut = interpolate(frame, [730, 750], [1, 0], clamp)

  return (
    <AbsoluteFill style={{ backgroundColor: '#050507', opacity: fadeOut }}>
      {/* Homepage : visible frames 0-130 */}
      {frame < 130 && (
        <AbsoluteFill style={{ opacity: homepageOpacity }}>
          <DemoHomepage startFrame={0} />
        </AbsoluteFill>
      )}

      {/* Modal + Scan : visible frames 115-320 */}
      {frame >= 115 && frame < 320 && (
        <AbsoluteFill
          style={{
            opacity:
              frame < 125
                ? interpolate(frame, [115, 125], [0, 1], clamp)
                : modalScanOpacity,
          }}
        >
          <DemoModalAndScan startFrame={120} />
        </AbsoluteFill>
      )}

      {/* Results + Issues + Locked : visible frames 305+ */}
      {frame >= 305 && (
        <AbsoluteFill style={{ opacity: resultsOpacity }}>
          <DemoResults startFrame={310} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
