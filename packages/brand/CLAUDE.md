# CLAUDE.md -- packages/brand

## Ce package

Contient tous les BrandKit (design tokens) pour Altidigitech et chaque SaaS du portfolio.

## Structure

- `src/types.ts` -- Types TypeScript (BrandColors, BrandTypography, BrandSpacing, BrandMotion, BrandAssets, BrandConfig)
- `src/base/` -- Valeurs par defaut Altidigitech (indigo, Inter, echelle 8px)
- `src/_template/` -- Template a copier pour un nouveau SaaS (champs TODO)
- `src/[saas-name]/` -- Override specifique a chaque SaaS

## Regles

- Ne jamais hardcoder de couleurs, fonts ou tailles dans les composants
- Toujours importer depuis `@altidigitech/brand`
- Chaque SaaS etend le brand de base avec `...baseColors`, `...baseTypography`, etc.
- Pour ajouter un SaaS : copier `_template/` vers `[saas-name]/` et remplir les TODO
