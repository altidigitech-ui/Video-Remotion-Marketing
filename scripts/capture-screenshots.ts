/**
 * Capture automatique des screenshots de Leak Detector
 * Utilise Playwright pour prendre des screenshots reproductibles.
 *
 * Usage: bun scripts/capture-screenshots.ts [--url=https://leakdetector.tech]
 * Default URL: http://localhost:3000
 */

import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'

const DEFAULT_URL = 'http://localhost:3000'
const OUTPUT_DIR = path.resolve('./projects/leak-detector/public/screenshots')
const VIEWPORT = { width: 1920, height: 1080 }

interface ScreenshotTarget {
  name: string
  path: string
  waitFor?: string
  actions?: (page: import('playwright').Page) => Promise<void>
}

const TARGETS: ScreenshotTarget[] = [
  {
    name: 'landing',
    path: '/',
    waitFor: 'h1',
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    waitFor: '[data-testid="analysis-list"], .card',
  },
  {
    name: 'analyze',
    path: '/analyze',
    waitFor: 'form, input',
  },
  {
    name: 'pricing',
    path: '/pricing',
    waitFor: '.pricing-card, [data-plan]',
  },
]

function getBaseUrl(): string {
  const arg = process.argv.find((a) => a.startsWith('--url='))
  return arg ? (arg.split('=')[1] ?? DEFAULT_URL) : DEFAULT_URL
}

async function main(): Promise<void> {
  const baseUrl = getBaseUrl()

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log(`Capturing screenshots from: ${baseUrl}`)
  console.log(`Output directory: ${OUTPUT_DIR}`)
  console.log('')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  })

  let successCount = 0
  let errorCount = 0

  for (const target of TARGETS) {
    const url = `${baseUrl}${target.path}`
    const outputPath = path.join(OUTPUT_DIR, `${target.name}.png`)

    console.log(`  Capturing ${target.name}...`)

    try {
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

      if (target.waitFor) {
        await page.waitForSelector(target.waitFor, { timeout: 10000 }).catch(() => {
          console.warn(`    Warning: selector "${target.waitFor}" not found, capturing anyway`)
        })
      }

      if (target.actions) {
        await target.actions(page)
      }

      // Attendre que les animations soient terminées
      await page.waitForTimeout(500)

      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      })

      await page.close()
      console.log(`    Saved: ${outputPath}`)
      successCount++
    } catch (error) {
      errorCount++
      const message = error instanceof Error ? error.message : String(error)
      console.error(`    Error capturing ${target.name}: ${message}`)
    }
  }

  await browser.close()

  console.log('')
  console.log(`Done: ${successCount} captured, ${errorCount} failed`)
  console.log('')
  console.log('Note: report.png and report-detail.png must be captured manually')
  console.log('(requires a real analysis to be available in the dashboard)')
}

main().catch(console.error)
