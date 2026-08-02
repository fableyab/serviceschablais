# Services Chablais

Ce dossier contient le site statique de Services Chablais, prêt à être publié sur GitHub Pages avec votre domaine personnalisé.

## Déploiement

1. Créez un dépôt GitHub vide et poussez ce dossier sur la branche `main`.
2. Dans GitHub, ouvrez les paramètres du dépôt puis **Pages**.
3. Choisissez **GitHub Actions** comme source.
4. Ajoutez ensuite votre domaine personnalisé dans **Pages** et utilisez le fichier [CNAME](CNAME) contenant `serviceschablais.fr`.
5. Le workflow dans [.github/workflows/deploy.yml](.github/workflows/deploy.yml) publiera automatiquement le site à chaque push sur `main`.

## Fichiers principaux

- [index.html](index.html) : page d’accueil et formulaire de réservation
- [admin.html](admin.html) : maquette de l’espace d’administration
- [pocketbase-schema.json](pocketbase-schema.json) : schéma des collections PocketBase
- [CNAME](CNAME) : domaine personnalisé GitHub Pages
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) : workflow de publication
- [.nojekyll](.nojekyll) : désactive Jekyll
