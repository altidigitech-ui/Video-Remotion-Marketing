/** Convert seconds to frames */
export const sec = (seconds: number, fps: number): number => Math.round(seconds * fps)

/** Identity function for readability when specifying frame counts */
export const frames = (n: number): number => n

/** Convert seconds to frames with default 60fps */
export const secondsToFrames = (seconds: number, fps = 60): number => Math.round(seconds * fps)
