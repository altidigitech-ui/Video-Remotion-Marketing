# CLAUDE.md -- packages/templates

## Ce package

Templates video prets a l'emploi. Chaque template est 100% generique et accepte
un BrandConfig en prop. Jamais de reference a un SaaS specifique.

## Regles

- Tous les templates acceptent `brand: BrandConfig` comme premiere prop
- Chaque template a un schema Zod exporte
- Named exports avec suffixe "Template" (ex: ProductDemoTemplate)
- Jamais d'import d'un brand specifique
- Les durees de sections sont calculees depuis les props, pas hardcodees
