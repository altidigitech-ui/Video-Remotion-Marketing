# CLAUDE.md -- projects/leak-detector

## Ce SaaS

- **Nom** : Leak Detector
- **Tagline** : Find the CRO leaks killing your conversions
- **Description** : SaaS CRO audit tool that scans landing pages and identifies conversion rate optimization issues across 8 categories
- **Secteur** : MarTech / CRO
- **Cible** : B2B — Founders, growth marketers, indie hackers

## Brand

- **Couleur principale** : Amber #F59E0B (accent), Slate #0F172A (background)
- **Style** : Premium dark, data-driven
- **Tone of voice** : Expert, direct, data-backed
- **Font display** : Space Grotesk
- **Font body** : Inter
- **Font mono** : JetBrains Mono

## Donnees reelles (pour les compositions)

- Score CRO moyen : 73/100
- 58% des pages n'ont aucune social proof
- 42% ont des CTAs faibles
- 3.2 problemes en moyenne par page
- 8 categories d'audit : Social Proof, CTA, Copy, Urgency, Trust, Layout, Mobile UX, Page Speed

## Pricing

- Free : 1 audit/mois
- Pro : $29/mois — audits illimites
- Agency : $99/mois — multi-clients

## Assets disponibles

- [ ] logo.svg
- [ ] logo.png
- [ ] logo-white.svg
- [ ] screenshots/dashboard.png
- [ ] screenshots/audit-results.png
- [ ] sounds/background.mp3

## Compositions (13 total)

### Widescreen (1920x1080 @ 60fps)

- [x] leak-detector-logo-reveal (3s)
- [x] leak-detector-product-demo (10s)
- [x] leak-detector-launch (15s)
- [x] leak-detector-stats (8s)
- [x] leak-detector-how-it-works (12s)
- [x] leak-detector-feature-cro (10s)

### Vertical (1080x1920 @ 30fps)

- [x] leak-detector-social-vertical (15s)
- [x] leak-detector-social-stats-vertical (10s)

### Square (1080x1080 @ 30fps)

- [x] leak-detector-social-square (10s)
- [x] leak-detector-stats-square (8s)

### ScreenMockup (nécessitent les screenshots)

- [x] leak-detector-screen-dashboard (16:9 @ 60fps, 12s) — 3 slides browser style
- [x] leak-detector-screen-hero-vertical (9:16 @ 30fps, 15s) — 1 slide floating
- [x] leak-detector-screen-square (1:1 @ 30fps, 10s) — 1 slide floating

## Workflow screenshots

1. Prendre les screenshots : `bun screenshots:leak-detector`
2. Vérifier dans `projects/leak-detector/public/screenshots/`
3. Rendre les compositions : `bun render:leak-detector`
4. Les screenshots ne sont PAS dans git (gitignored)

## Notes specifiques

- Theme sombre (slate) avec accents amber pour un look data/premium
- Les stats sont basees sur des donnees reelles d'audit
- Toujours mettre en avant le score /100 comme hook principal
- Le CTA principal est "Scan your page free" ou "Free audit"
