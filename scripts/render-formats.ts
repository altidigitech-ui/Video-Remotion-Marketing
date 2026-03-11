import { renderMedia, selectComposition, bundle } from '@remotion/renderer'
import path from 'path'
import fs from 'fs'

type RenderFormat = {
  id: string
  width: number
  height: number
  fps: number
}

const FORMATS: Record<string, RenderFormat> = {
  widescreen: { id: 'widescreen', width: 1920, height: 1080, fps: 60 },
  square: { id: 'square', width: 1080, height: 1080, fps: 30 },
  vertical: { id: 'vertical', width: 1080, height: 1920, fps: 30 },
}

function getSaasArg(): string | null {
  const arg = process.argv.find((a) => a.startsWith('--saas='))
  return arg ? arg.split('=')[1] ?? null : null
}

async function renderAllFormats(): Promise<void> {
  const saasName = getSaasArg()

  if (!saasName) {
    console.error('Usage: bun scripts/render-formats.ts --saas=<name>')
    process.exit(1)
  }

  const entryPoint = path.resolve(`./projects/${saasName}/src/index.ts`)

  if (!fs.existsSync(entryPoint)) {
    console.error(`Error: Entry point not found at ${entryPoint}`)
    process.exit(1)
  }

  console.log(`Rendering all formats for ${saasName}...`)
  console.log('')

  // Bundle the project
  console.log('  Bundling...')
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (current) => current,
  })

  const outputDir = path.resolve(`./renders/${saasName}`)
  fs.mkdirSync(outputDir, { recursive: true })

  for (const [formatId, format] of Object.entries(FORMATS)) {
    const compositionId = `${saasName}-${formatId}`
    const outputPath = path.join(outputDir, `${compositionId}-${format.width}x${format.height}.mp4`)

    console.log(`  Rendering ${formatId} (${format.width}x${format.height})...`)

    try {
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compositionId,
      })

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        imageFormat: 'jpeg',
        jpegQuality: 85,
        concurrency: 4,
        onProgress: ({ progress }) => {
          process.stdout.write(`\r    Progress: ${(progress * 100).toFixed(1)}%`)
        },
      })

      console.log(`\n    Done: ${outputPath}`)
    } catch (error) {
      console.error(`\n    Skipped ${compositionId}: composition not found or render failed`)
    }
  }

  console.log('')
  console.log('All formats rendered!')
}

renderAllFormats().catch(console.error)
