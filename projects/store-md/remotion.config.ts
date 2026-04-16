import { Config } from '@remotion/cli/config'
import path from 'path'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
Config.setPixelFormat('yuv420p')
Config.setConcurrency(2)
Config.setChromiumOpenGlRenderer('angle')
Config.setDelayRenderTimeoutInMilliseconds(30000)
Config.setJpegQuality(80)

// Resolve monorepo root from the current working directory.
// remotion studio is always invoked from the project directory, so
// cwd = projects/store-md → root = ../..
const root = path.resolve(process.cwd(), '../..')

Config.overrideWebpackConfig((config) => {
  console.log('[remotion.config] Applying webpack aliases, root:', root)
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
