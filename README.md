# Altidigitech Video Templates

Programmatic video template library for the Altidigitech SaaS portfolio.

Built with Remotion v4, React 18, TypeScript 5, Bun, and Turborepo.

---

## What is this

A monorepo containing reusable video templates, components, and brand systems
for generating marketing videos programmatically. Each SaaS in the Altidigitech
portfolio gets its own BrandKit and compositions, but shares the same templates
and components.

---

## Quickstart

```bash
git clone <repo-url>
cd altidigitech-video-templates
bun install
bun dev
```

The Remotion Studio opens at `http://localhost:3000`.

---

## Add a new SaaS

```bash
bun new:saas golddesk
```

Then:
1. Fill the brand config in `packages/brand/src/golddesk/config.ts`
2. Add assets to `projects/golddesk/public/`
3. Create compositions in `projects/golddesk/src/root.tsx`

---

## Create a video

```bash
# Preview in the studio
bun dev

# Render a specific composition
bun render golddesk-product-demo

# Render all compositions for a SaaS
bun render --saas=golddesk

# Render everything
bun render:all
```

---

## Repo structure

```
altidigitech-video-templates/
|
|-- packages/
|   |-- utils/           Timing, math, format constants
|   |-- brand/           BrandKit types, base brand, per-SaaS overrides
|   |-- core/            Reusable Remotion components
|   +-- templates/       Ready-to-use video templates
|
|-- projects/
|   |-- _template/       Template to copy for a new SaaS
|   +-- [saas-name]/     Per-SaaS compositions and assets
|
|-- scripts/             Scaffold, render, deploy automation
|-- docs/                Documentation
|-- public/              Global assets (fonts, images)
+-- renders/             Video output (gitignored)
```

---

## Documentation

- [Context](docs/CONTEXT.md) -- Who we are, why this repo exists
- [Architecture](docs/ARCH.md) -- Detailed monorepo structure and conventions
