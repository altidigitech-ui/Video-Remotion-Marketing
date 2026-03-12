import { Config } from '@remotion/cli/config'
import path from 'path'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
Config.setPixelFormat('yuv420p')
Config.setConcurrency(2)
Config.setChromiumOpenGlRenderer('angle')
Config.setDelayRenderTimeoutInMilliseconds(30000)
Config.setJpegQuality(80)

const root = path.resolve(__dirname, '../..')

Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@altidigitech/core': path.join(root, 'packages/core/src'),
        '@altidigitech/brand': path.join(root, 'packages/brand/src'),
        '@altidigitech/templates': path.join(root, 'packages/templates/src'),
        '@altidigitech/utils': path.join(root, 'packages/utils/src'),
      },
    },
  }
})
