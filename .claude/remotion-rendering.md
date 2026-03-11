# .claude/remotion-rendering.md
# Skill : Remotion Rendering — Export Local, Lambda & Automation

> **Quand lire ce fichier** : Avant tout export vidéo, configuration de rendu,
> ou mise en place d'un pipeline de génération automatisée.
> Prérequis : avoir lu `remotion-basics.md`.

---

## 1. CONCEPTS DU RENDU REMOTION

### Pipeline de rendu
```
Composition React
       ↓
Remotion Bundler (webpack)
       ↓
Chromium headless (rend chaque frame)
       ↓
Frames PNG/JPEG en mémoire ou sur disque
       ↓
FFmpeg (assemble les frames + audio → vidéo)
       ↓
MP4 / WebM / GIF / AAC
```

### Deux modes de rendu
| Mode | Usage | Commande |
|------|-------|----------|
| **Local** | Développement, petits volumes | `npx remotion render` |
| **Lambda** | Production, gros volumes, parallèle | `npx remotion lambda render` |

---

## 2. RENDU LOCAL — CLI

### Commande de base
```bash
# Rendre une composition par son ID
npx remotion render [entry-point] [composition-id] [output]

# Exemple
npx remotion render src/index.ts [saas-name]-product-demo renders/[saas-name]-product-demo.mp4
```

### Avec les scripts Bun du projet
```bash
# Rendre une composition spécifique
bun render [saas-name]-product-demo

# Rendre toutes les compositions d'un SaaS
bun render:[saas-name]

# Rendre en tous les formats (widescreen, vertical, square)
bun render:[saas-name]:all

# Rendre tout le portfolio
bun render:all
```

### Options CLI importantes
```bash
npx remotion render src/index.ts my-comp output.mp4 \
  --codec=h264 \                    # h264 | h265 | vp8 | vp9 | prores | gif
  --quality=80 \                    # 0-100 (pour jpeg frames)
  --image-format=jpeg \             # jpeg | png (jpeg = plus rapide)
  --concurrency=4 \                 # threads parallèles (= nombre de CPU cores)
  --fps-override=60 \               # override le fps de la composition
  --scale=1 \                       # 0.5 = moitié de la résolution
  --muted \                         # sans audio
  --overwrite \                     # écraser si le fichier existe
  --log=verbose \                   # verbose | info | warn | error
  --timeout=30000 \                 # timeout delayRender en ms
  --props='{"title":"Custom"}' \    # override les defaultProps en JSON
  --config=remotion.config.ts       # fichier de config custom
```

### Exemples concrets par format
```bash
# Widescreen 1920x1080
npx remotion render src/index.ts [saas-name]-product-demo \
  renders/[saas-name]/product-demo-1920x1080.mp4 \
  --codec=h264 --image-format=jpeg --concurrency=4

# Vertical 1080x1920 (Reels/TikTok)
npx remotion render src/index.ts [saas-name]-product-demo-vertical \
  renders/[saas-name]/product-demo-1080x1920.mp4 \
  --codec=h264 --image-format=jpeg

# GIF (pour previews, max 10s recommandé)
npx remotion render src/index.ts [saas-name]-logo-anim \
  renders/[saas-name]/logo-anim.gif \
  --codec=gif --scale=0.5

# ProRes (pour post-production After Effects / Premiere)
npx remotion render src/index.ts [saas-name]-product-demo \
  renders/[saas-name]/product-demo-prores.mov \
  --codec=prores --image-format=png
```

---

## 3. CONFIGURATION `remotion.config.ts`

```typescript
// remotion.config.ts — à la racine de chaque projet Remotion
import { Config } from '@remotion/cli/config'

// Format des frames (jpeg = plus rapide, png = qualité maximale)
Config.setVideoImageFormat('jpeg')

// Écraser les renders existants automatiquement
Config.setOverwriteOutput(true)

// Pixel format compatible avec la majorité des players vidéo
Config.setPixelFormat('yuv420p')

// Threads parallèles (recommandé = nombre de CPU cores)
Config.setConcurrency(4)

// Moteur de rendu OpenGL (angle = le plus stable)
Config.setChromiumOpenGlRenderer('angle')

// Timeout pour delayRender (assets externes lents)
Config.setDelayRenderTimeoutInMilliseconds(30000)

// Qualité JPEG des frames (80 = bon compromis vitesse/qualité)
Config.setJpegQuality(80)

// Mute la vidéo si pas d'audio nécessaire
// Config.setMuted(true)

// Browser executable custom (si Chromium système)
// Config.setBrowserExecutable('/usr/bin/google-chrome')
```

---

## 4. SCRIPTS DE RENDU AUTOMATISÉS

### Script de rendu multi-formats
```typescript
// scripts/render-formats.ts
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'
import fs from 'fs'

type RenderFormat = {
  id: string
  compositionId: string
  width: number
  height: number
  fps: number
  outputPath: string
}

const FORMATS: RenderFormat[] = [
  {
    id: 'widescreen',
    compositionId: '[saas-name]-product-demo',
    width: 1920,
    height: 1080,
    fps: 60,
    outputPath: 'renders/[saas-name]/product-demo-1920x1080.mp4',
  },
  {
    id: 'square',
    compositionId: '[saas-name]-product-demo-square',
    width: 1080,
    height: 1080,
    fps: 30,
    outputPath: 'renders/[saas-name]/product-demo-1080x1080.mp4',
  },
  {
    id: 'vertical',
    compositionId: '[saas-name]-product-demo-vertical',
    width: 1080,
    height: 1920,
    fps: 30,
    outputPath: 'renders/[saas-name]/product-demo-1080x1920.mp4',
  },
]

const ENTRY_POINT = path.resolve('./projects/[saas-name]/src/index.ts')

async function renderAllFormats() {
  console.log(`🎬 Rendu de ${FORMATS.length} formats...`)

  for (const format of FORMATS) {
    console.log(`\n▶ Rendu ${format.id} (${format.width}x${format.height})...`)

    // Créer le dossier output si nécessaire
    fs.mkdirSync(path.dirname(format.outputPath), { recursive: true })

    // Sélectionner la composition
    const composition = await selectComposition({
      serveUrl: ENTRY_POINT,
      id: format.compositionId,
    })

    // Rendre
    await renderMedia({
      composition,
      serveUrl: ENTRY_POINT,
      codec: 'h264',
      outputLocation: format.outputPath,
      imageFormat: 'jpeg',
      jpegQuality: 85,
      concurrency: 4,
      onProgress: ({ progress }) => {
        process.stdout.write(`\r  Progress: ${(progress * 100).toFixed(1)}%`)
      },
    })

    console.log(`\n  ✅ ${format.outputPath}`)
  }

  console.log('\n🎉 Tous les formats rendus !')
}

renderAllFormats().catch(console.error)
```

### Script de rendu avec props dynamiques
```typescript
// scripts/render-with-props.ts
import { renderMedia, selectComposition, bundle } from '@remotion/renderer'
import path from 'path'

type SaaSVideoConfig = {
  saasId: string
  compositionId: string
  props: Record<string, unknown>
  outputPath: string
}

async function renderWithConfig(config: SaaSVideoConfig) {
  const ENTRY_POINT = path.resolve(`./projects/${config.saasId}/src/index.ts`)

  console.log(`🎬 Rendu ${config.compositionId} pour ${config.saasId}...`)

  // Bundle le projet
  const bundleLocation = await bundle({
    entryPoint: ENTRY_POINT,
    webpackOverride: (current) => current,
  })

  // Sélectionner la composition avec les props custom
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: config.compositionId,
    inputProps: config.props,
  })

  // Rendre
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: config.outputPath,
    inputProps: config.props,
    imageFormat: 'jpeg',
    concurrency: 4,
    onProgress: ({ progress, renderedFrames, totalFrames }) => {
      process.stdout.write(
        `\r  ${renderedFrames}/${totalFrames} frames (${(progress * 100).toFixed(1)}%)`
      )
    },
  })

  console.log(`\n✅ Rendu terminé : ${config.outputPath}`)
}

// Usage
renderWithConfig({
  saasId: '[saas-name]',
  compositionId: '[saas-name]-product-demo',
  props: {
    headline: 'TODO: Headline du SaaS',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  outputPath: 'renders/[saas-name]/product-demo-custom.mp4',
})
```

### Script de rendu en batch (tous les SaaS)
```typescript
// scripts/render-all.ts
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Détecter automatiquement tous les projets SaaS
const PROJECTS_DIR = path.resolve('./projects')
const saasProjects = fs
  .readdirSync(PROJECTS_DIR)
  .filter(dir => dir !== '_template' && !dir.startsWith('.'))
  .filter(dir => fs.existsSync(path.join(PROJECTS_DIR, dir, 'src/index.ts')))

console.log(`🎬 Projets détectés : ${saasProjects.join(', ')}`)

for (const saas of saasProjects) {
  console.log(`\n📦 Rendu de ${saas}...`)
  try {
    execSync(`bun render:${saas}`, { stdio: 'inherit' })
    console.log(`✅ ${saas} terminé`)
  } catch (error) {
    console.error(`❌ Erreur sur ${saas}:`, error)
  }
}

console.log('\n🎉 Batch complet !')
```

---

## 5. RENDU LAMBDA (AWS)

### Setup initial Lambda
```bash
# 1. Installer les dépendances Lambda
bun add @remotion/lambda

# 2. Configurer les credentials AWS
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=eu-west-3  # Paris

# 3. Déployer la fonction Lambda (une seule fois)
npx remotion lambda functions deploy \
  --memory=3009 \
  --disk=10240 \
  --timeout=900

# 4. Déployer le site sur S3
npx remotion lambda sites create \
  --site-name=altidigitech-video-templates \
  projects/[saas-name]/src/index.ts

# 5. Vérifier le déploiement
npx remotion lambda functions ls
npx remotion lambda sites ls
```

### Rendre sur Lambda via CLI
```bash
# Rendu Lambda d'une composition
npx remotion lambda render \
  --site-name=altidigitech-video-templates \
  --function-name=remotion-render-3-3-78-mem3009mb-disk10240mb-900sec \
  [saas-name]-product-demo \
  --props='{"headline":"TODO: Headline du SaaS"}'
```

### Rendu Lambda via API (pour automation)
```typescript
// scripts/render-lambda.ts
import {
  renderMediaOnLambda,
  getRenderProgress,
  downloadMedia,
} from '@remotion/lambda/client'

type LambdaRenderConfig = {
  compositionId: string
  inputProps?: Record<string, unknown>
  outputKey: string  // Chemin dans S3
}

async function renderOnLambda(config: LambdaRenderConfig) {
  const FUNCTION_NAME = process.env.REMOTION_LAMBDA_FUNCTION_NAME!
  const BUCKET_NAME = process.env.REMOTION_S3_BUCKET!
  const SERVE_URL = process.env.REMOTION_SERVE_URL!

  console.log(`🚀 Lancement du rendu Lambda : ${config.compositionId}`)

  // Lancer le rendu
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: 'eu-west-3',
    functionName: FUNCTION_NAME,
    serveUrl: SERVE_URL,
    composition: config.compositionId,
    inputProps: config.inputProps ?? {},
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 3,
    privacy: 'private',
    outName: config.outputKey,
  })

  console.log(`📡 Render ID : ${renderId}`)

  // Polling du statut
  let done = false
  while (!done) {
    await new Promise(resolve => setTimeout(resolve, 3000))

    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: FUNCTION_NAME,
      region: 'eu-west-3',
    })

    if (progress.fatalErrorEncountered) {
      throw new Error(`Erreur Lambda : ${progress.errors[0]?.message}`)
    }

    if (progress.done) {
      done = true
      console.log(`\n✅ Rendu terminé !`)
      console.log(`📦 S3 URL : ${progress.outputFile}`)
      return progress.outputFile
    }

    const pct = ((progress.overallProgress ?? 0) * 100).toFixed(1)
    process.stdout.write(`\r  Progress : ${pct}%`)
  }
}

// Usage
renderOnLambda({
  compositionId: '[saas-name]-product-demo',
  inputProps: { headline: 'TODO: Headline du SaaS' },
  outputKey: 'renders/[saas-name]/product-demo.mp4',
}).catch(console.error)
```

### Variables d'environnement Lambda requises
```bash
# .env.local (jamais commité)
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render-3-3-78-mem3009mb-disk10240mb-900sec
REMOTION_S3_BUCKET=remotionlambda-euwest3-xxxxxxxxxx
REMOTION_SERVE_URL=https://remotionlambda-euwest3-xxxxxxxxxx.s3.eu-west-3.amazonaws.com/sites/altidigitech-video-templates/index.html
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=eu-west-3
```

---

## 6. CONFIGURATION `package.json` — SCRIPTS COMPLETS

```json
{
  "scripts": {
    "dev": "remotion studio",
    "dev:[saas-name]": "remotion studio projects/[saas-name]/src/index.ts",

    "build": "tsc --noEmit",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",

    "render": "bun scripts/render.ts",
    "render:[saas-name]": "bun scripts/render-formats.ts --saas=[saas-name]",
    "render:all": "bun scripts/render-all.ts",
    "render:lambda": "bun scripts/render-lambda.ts",

    "lambda:deploy": "npx remotion lambda functions deploy --memory=3009 --disk=10240 --timeout=900",
    "lambda:sites:deploy": "npx remotion lambda sites create --site-name=altidigitech-video-templates projects/[saas-name]/src/index.ts",
    "lambda:sites:ls": "npx remotion lambda sites ls",
    "lambda:functions:ls": "npx remotion lambda functions ls",

    "new:saas": "bun scripts/new-saas.ts"
  }
}
```

---

## 7. OPTIMISATION DES PERFORMANCES DE RENDU

### Accélérer le rendu local
```typescript
// remotion.config.ts
import os from 'os'

// Utiliser tous les CPU disponibles
Config.setConcurrency(os.cpus().length)

// JPEG est 3x plus rapide que PNG pour les frames intermédiaires
Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(80)  // 80 = bon compromis

// Désactiver le GPU si pas de WebGL nécessaire
// Config.setChromiumOpenGlRenderer('swiftshader') // Plus lent mais stable
Config.setChromiumOpenGlRenderer('angle')          // Plus rapide
```

### Estimation du temps de rendu
```
Règle approximative en local (machine standard) :
- 60fps × 1920×1080 × JPEG = ~2-4 frames/seconde
- 1 minute de vidéo (3600 frames) ≈ 15-30 minutes de rendu
- Avec concurrency=8 : ~4-8 minutes

Lambda (mem=3009MB, concurrency=200) :
- 1 minute de vidéo ≈ 30-90 secondes
- Coût estimé : ~$0.05-0.15 par minute de vidéo
```

### Éviter les re-renders inutiles
```typescript
// ❌ Recalcule à chaque frame
const MyComp = () => {
  const heavyData = computeHeavyData() // Appelé 300 fois !
  return <div>{heavyData}</div>
}

// ✅ Calculer en dehors ou avec useMemo
const precomputedData = computeHeavyData() // Calculé une seule fois

const MyComp = () => {
  return <div>{precomputedData}</div>
}

// ✅ Ou avec useMemo (recalcule uniquement si les deps changent)
const MyComp = ({ items }: { items: string[] }) => {
  const processedItems = useMemo(
    () => items.map(item => processItem(item)),
    [items]  // Stable entre les frames si items ne change pas
  )
  return <div>{processedItems.join(', ')}</div>
}
```

---

## 8. FORMATS DE SORTIE — GUIDE COMPLET

### H.264 MP4 (défaut — recommandé)
```bash
npx remotion render src/index.ts my-comp output.mp4 \
  --codec=h264 \
  --image-format=jpeg \
  --jpeg-quality=85
```
- ✅ Compatible partout (YouTube, social media, web, mobile)
- ✅ Taille de fichier raisonnable
- ✅ Rendu rapide
- ❌ Pas de transparence (canal alpha)

### H.265 HEVC (meilleure compression)
```bash
npx remotion render src/index.ts my-comp output.mp4 \
  --codec=h265
```
- ✅ 50% plus petit que H.264 à qualité égale
- ❌ Pas supporté partout (pas sur tous les navigateurs)
- Usage : archives, partage interne

### VP9 WebM (web optimisé)
```bash
npx remotion render src/index.ts my-comp output.webm \
  --codec=vp9
```
- ✅ Open source, bon pour le web
- ✅ Supporte la transparence
- ❌ Rendu lent
- Usage : embed web avec transparence

### ProRes (post-production)
```bash
npx remotion render src/index.ts my-comp output.mov \
  --codec=prores \
  --image-format=png  # PNG obligatoire pour ProRes
```
- ✅ Qualité maximale, idéal pour After Effects / Premiere
- ❌ Fichiers très volumineux
- Usage : livraison à un motion designer

### GIF (animations courtes)
```bash
npx remotion render src/index.ts my-comp output.gif \
  --codec=gif \
  --scale=0.5 \      # Réduire la résolution pour le GIF
  --fps-override=15  # 15fps suffit pour un GIF
```
- ✅ Compatible partout, pas besoin de player vidéo
- ❌ Qualité limitée, fichiers lourds
- ❌ Max 256 couleurs
- Usage : previews, Slack, Discord

---

## 9. GESTION DES ERREURS DE RENDU

### Erreurs courantes et solutions

```typescript
// Erreur : "delayRender was called but continueRender was never called"
// → Un asset n'a pas fini de charger
// Solution : vérifier que continueRender() est appelé dans tous les cas

const handle = delayRender('Loading font')
font.load()
  .then(() => {
    document.fonts.add(font)
    continueRender(handle)          // ✅ Cas succès
  })
  .catch((err) => {
    console.error('Font load error:', err)
    continueRender(handle)          // ✅ Cas erreur aussi ! Ne jamais bloquer.
  })
```

```typescript
// Erreur : "Cannot read properties of undefined"
// → Un asset est undefined au moment du rendu (race condition)
// Solution : vérifier les guards avant le rendu

const MyComp = ({ logoUrl }: { logoUrl?: string }) => {
  // ❌ Crash si logoUrl est undefined
  return <Img src={logoUrl} />

  // ✅ Guard avec fallback
  if (!logoUrl) return <div style={{ background: '#6366F1', width: 100, height: 100 }} />
  return <Img src={logoUrl} />
}
```

### Script de retry automatique
```typescript
// scripts/render-with-retry.ts
async function renderWithRetry(
  renderFn: () => Promise<void>,
  maxRetries = 3,
  delayMs = 2000
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await renderFn()
      return
    } catch (error) {
      if (attempt === maxRetries) throw error
      console.warn(`⚠️ Tentative ${attempt} échouée, retry dans ${delayMs}ms...`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

// Usage
await renderWithRetry(() => renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: 'renders/output.mp4',
}))
```

---

## 10. INTÉGRATION N8N (OPTIONNEL)

Si le pipeline n8n est activé, voici comment déclencher un rendu depuis n8n :

### Webhook endpoint (script Express minimal)
```typescript
// scripts/render-server.ts
// Serveur HTTP minimal pour recevoir les webhooks n8n

import { createServer } from 'http'
import { renderMedia, selectComposition, bundle } from '@remotion/renderer'
import path from 'path'

const server = createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/render') {
    res.writeHead(404)
    res.end()
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', async () => {
    try {
      const config = JSON.parse(body) as {
        saasId: string
        compositionId: string
        props: Record<string, unknown>
        outputPath: string
      }

      console.log(`📥 Rendu reçu de n8n :`, config)

      // Bundle + render
      const bundleLocation = await bundle({
        entryPoint: path.resolve(`./projects/${config.saasId}/src/index.ts`),
      })

      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: config.compositionId,
        inputProps: config.props,
      })

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: config.outputPath,
        inputProps: config.props,
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: true,
        outputPath: config.outputPath,
      }))
    } catch (error) {
      console.error('❌ Erreur rendu:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: String(error) }))
    }
  })
})

server.listen(3099, () => {
  console.log('🎬 Render server démarré sur http://localhost:3099')
})
```

### Payload n8n → render server
```json
{
  "saasId": "[saas-name]",
  "compositionId": "[saas-name]-product-demo",
  "props": {
    "headline": "TODO: Headline du SaaS",
    "features": ["Feature 1", "Feature 2", "Feature 3"]
  },
  "outputPath": "renders/[saas-name]/product-demo-2026-03-11.mp4"
}
```

---

## 11. `.gitignore` RECOMMANDÉ

```gitignore
# Renders (outputs vidéo — ne jamais commiter)
renders/
*.mp4
*.webm
*.mov
*.gif

# Cache Remotion
.remotion/

# Bundle cache
node_modules/
.turbo/

# Lambda
.remotion/lambda/

# Environnement
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## 12. CHECKLIST AVANT RENDU FINAL

- [ ] `bun typecheck` passe sans erreur
- [ ] Preview dans le studio validée du début à la fin
- [ ] Tous les assets (images, sons, fonts) sont bien dans `public/`
- [ ] `remotion.config.ts` configuré avec les bons paramètres
- [ ] Le dossier `renders/[saas]/` existe (ou sera créé par le script)
- [ ] Le format de sortie correspond à l'usage (H.264 pour social, ProRes pour post-prod)
- [ ] La résolution et le FPS correspondent au format cible
- [ ] Pas de `console.log` dans les compositions (ralentit le rendu)
- [ ] Pour Lambda : variables d'environnement AWS configurées
- [ ] Pour Lambda : site S3 déployé avec la dernière version du code

---

*Skill : remotion-rendering.md — Altidigitech Video Templates*
*Lire ensuite : `.claude/brand-system.md` pour la gestion des BrandKits*
