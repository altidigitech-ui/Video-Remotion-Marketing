import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dir, '..')

function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

function copyDirRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true })

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function replaceInFile(filePath: string, replacements: Record<string, string>): void {
  let content = fs.readFileSync(filePath, 'utf-8')
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replaceAll(search, replace)
  }
  fs.writeFileSync(filePath, content, 'utf-8')
}

function replaceInDir(dirPath: string, replacements: Record<string, string>): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      replaceInDir(fullPath, replacements)
    } else if (
      entry.name.endsWith('.ts') ||
      entry.name.endsWith('.tsx') ||
      entry.name.endsWith('.json') ||
      entry.name.endsWith('.md')
    ) {
      replaceInFile(fullPath, replacements)
    }
  }
}

function main(): void {
  const saasName = process.argv[2]

  if (!saasName) {
    console.error('Usage: bun new:saas <name>')
    console.error('Example: bun new:saas golddesk')
    process.exit(1)
  }

  // Validate name: lowercase, kebab-case only
  if (!/^[a-z][a-z0-9-]*$/.test(saasName)) {
    console.error('Error: SaaS name must be lowercase kebab-case (e.g. "gold-desk", "my-saas")')
    process.exit(1)
  }

  const projectSrc = path.join(ROOT, 'projects', '_template')
  const projectDest = path.join(ROOT, 'projects', saasName)
  const brandSrc = path.join(ROOT, 'packages', 'brand', 'src', '_template')
  const brandDest = path.join(ROOT, 'packages', 'brand', 'src', saasName)

  // Check that sources exist
  if (!fs.existsSync(projectSrc)) {
    console.error(`Error: Template not found at ${projectSrc}`)
    process.exit(1)
  }

  // Check that destinations don't already exist
  if (fs.existsSync(projectDest)) {
    console.error(`Error: Project already exists at ${projectDest}`)
    process.exit(1)
  }

  if (fs.existsSync(brandDest)) {
    console.error(`Error: Brand config already exists at ${brandDest}`)
    process.exit(1)
  }

  console.log(`Creating SaaS project: ${saasName}`)
  console.log('')

  // 1. Copy project template
  console.log(`  Copying projects/_template/ -> projects/${saasName}/`)
  copyDirRecursive(projectSrc, projectDest)

  // 2. Copy brand template
  console.log(`  Copying packages/brand/src/_template/ -> packages/brand/src/${saasName}/`)
  copyDirRecursive(brandSrc, brandDest)

  // 3. Replace placeholders
  const replacements: Record<string, string> = {
    TODO_SAAS_ID: saasName,
    '@altidigitech/project-template': `@altidigitech/project-${saasName}`,
  }

  console.log('  Replacing TODO_SAAS_ID placeholders...')
  replaceInDir(projectDest, replacements)
  replaceInDir(brandDest, replacements)

  // 4. Auto-export brand in packages/brand/src/index.ts
  const brandIndexPath = path.join(ROOT, 'packages', 'brand', 'src', 'index.ts')
  const camelName = toCamelCase(saasName)
  const exportLine = `\nexport { templateBrand as ${camelName}Brand } from './${saasName}/config'\n`

  console.log('  Adding brand export to packages/brand/src/index.ts...')
  fs.appendFileSync(brandIndexPath, exportLine, 'utf-8')

  console.log('')
  console.log('Done! Next steps:')
  console.log('')
  console.log(`  1. Fill the brand config:`)
  console.log(`     packages/brand/src/${saasName}/config.ts`)
  console.log('')
  console.log(`  2. Add assets to projects/${saasName}/public/`)
  console.log(`     - logo.svg (required)`)
  console.log(`     - logo.png (required)`)
  console.log(`     - screenshots/ (recommended)`)
  console.log('')
  console.log(`  3. Create compositions in projects/${saasName}/src/root.tsx`)
  console.log('')
  console.log(`  4. Preview: bun dev`)
  console.log(`  5. Render: bun render ${saasName}-product-demo`)
}

main()
