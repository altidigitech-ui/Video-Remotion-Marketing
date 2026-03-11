import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const PROJECTS_DIR = path.resolve('./projects')

function main(): void {
  // Detect all SaaS projects
  const saasProjects = fs
    .readdirSync(PROJECTS_DIR)
    .filter((dir) => dir !== '_template' && !dir.startsWith('.'))
    .filter((dir) => fs.existsSync(path.join(PROJECTS_DIR, dir, 'src/index.ts')))

  if (saasProjects.length === 0) {
    console.log('No SaaS projects found in projects/.')
    console.log('Create one with: bun new:saas <name>')
    process.exit(0)
  }

  console.log(`Projects detected: ${saasProjects.join(', ')}`)
  console.log('')

  let successCount = 0
  let errorCount = 0

  for (const saas of saasProjects) {
    console.log(`Rendering ${saas}...`)
    try {
      execSync(`bun scripts/render-formats.ts --saas=${saas}`, { stdio: 'inherit' })
      successCount++
      console.log(`Done: ${saas}`)
    } catch {
      errorCount++
      console.error(`Error rendering ${saas}`)
    }
    console.log('')
  }

  console.log(`Batch complete: ${successCount} succeeded, ${errorCount} failed`)
}

main()
