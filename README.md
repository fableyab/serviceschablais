# Services Chablais

Ce dossier contient un site statique prêt à être publié sur GitHub Pages.

## Déploiement

1. Initialisez un dépôt GitHub et poussez ce dossier sur la branche `main`.
2. Dans GitHub, ouvrez les paramètres du dépôt puis **Pages**.
3. Choisissez **GitHub Actions** comme source.
4. Le workflow dans [.github/workflows/deploy.yml](.github/workflows/deploy.yml) déploiera automatiquement votre site à chaque push sur `main`.

## Structure

- `index.html` : page d’accueil du site
- `styles.css` : styles du site
- `.github/workflows/deploy.yml` : workflow de publication GitHub Pages
- `.nojekyll` : désactive Jekyll pour éviter les conflits de rendu
