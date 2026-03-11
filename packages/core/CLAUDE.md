# CLAUDE.md -- packages/core

## Ce package

Composants Remotion primitifs reutilisables pour toutes les compositions video.

## Regles

- Tous les composants acceptent `brand: BrandConfig` en prop
- Jamais de couleurs, fonts ou tailles hardcodees
- Named exports uniquement (pas de export default)
- Chaque composant dans son propre dossier avec index.ts re-export
- Toujours `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` sur interpolate
- Toujours passer fps depuis useVideoConfig() a spring
