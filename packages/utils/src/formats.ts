export type VideoFormatId = 'widescreen' | 'square' | 'vertical' | 'ultrawide' | 'thumbnail'

export type VideoFormat = {
  id: VideoFormatId
  width: number
  height: number
  fps: number
  label: string
  aspectRatio: string
}

export const VIDEO_FORMATS: Record<VideoFormatId, VideoFormat> = {
  widescreen: {
    id: 'widescreen',
    width: 1920,
    height: 1080,
    fps: 60,
    label: 'Widescreen (YouTube, demos)',
    aspectRatio: '16:9',
  },
  square: {
    id: 'square',
    width: 1080,
    height: 1080,
    fps: 30,
    label: 'Square (Instagram, LinkedIn)',
    aspectRatio: '1:1',
  },
  vertical: {
    id: 'vertical',
    width: 1080,
    height: 1920,
    fps: 30,
    label: 'Vertical (TikTok, Reels, Shorts)',
    aspectRatio: '9:16',
  },
  ultrawide: {
    id: 'ultrawide',
    width: 2560,
    height: 1080,
    fps: 60,
    label: 'Ultrawide (banners, hero sections)',
    aspectRatio: '21:9',
  },
  thumbnail: {
    id: 'thumbnail',
    width: 1280,
    height: 720,
    fps: 30,
    label: 'Thumbnail (YouTube thumbnails)',
    aspectRatio: '16:9',
  },
} as const

export const DEFAULT_FPS = 60
export const DEFAULT_WIDTH = 1920
export const DEFAULT_HEIGHT = 1080
