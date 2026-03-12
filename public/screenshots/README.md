# Screenshots — Leak Detector

Ces screenshots sont utilisés dans les compositions ScreenMockup.
**Ne pas committer dans git** (déjà dans .gitignore).

## Screenshots requis

| Fichier             | Description                              | Résolution recommandée |
| ------------------- | ---------------------------------------- | ---------------------- |
| `dashboard.png`     | Page dashboard avec liste des analyses   | 1920x1080 min          |
| `report.png`        | Vue d'un rapport complet avec score /100 | 1920x1080 min          |
| `report-detail.png` | Détail d'une catégorie avec les issues   | 1920x1080 min          |
| `analyze.png`       | Page d'analyse en cours (loader)         | 1920x1080 min          |
| `landing.png`       | Screenshot de leakdetector.tech          | 1920x1080 min          |
| `pricing.png`       | Page pricing                             | 1920x1080 min          |

## Comment prendre les screenshots

### Option 1 — Manuel (recommandé pour la qualité)

1. Ouvrir Chrome en plein écran (1920x1080)
2. Aller sur chaque page
3. Cmd+Shift+4 (macOS) ou utiliser l'extension "Full Page Screenshot"
4. Sauvegarder dans ce dossier

### Option 2 — Playwright automatisé

Un script est disponible dans scripts/capture-screenshots.ts.
Lancer avec : `bun scripts/capture-screenshots.ts`
Nécessite que l'app soit accessible sur localhost ou en production.

## Notes

- Format PNG obligatoire (qualité sans perte)
- Résolution min 1920x1080 pour le widescreen
- Désactiver les notifications et extensions avant de capturer
- Utiliser un compte avec des vraies analyses pour avoir du contenu réel
