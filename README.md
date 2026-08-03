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
- [services/](services/) : une page détaillée par prestation (8 activités)
- [admin.html](admin.html) : espace d’administration connecté à PocketBase (réservations, calendrier, clients, rappels, paramètres)
- [pocketbase-schema.json](pocketbase-schema.json) : schéma des collections PocketBase (`clients`, `reservations`, `parametres`)
- [pb_hooks/main.pb.js](pb_hooks/main.pb.js) : hook serveur PocketBase envoyant automatiquement les rappels par email chaque jour à 8h
- [CNAME](CNAME) : domaine personnalisé GitHub Pages
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) : workflow de publication
- [.nojekyll](.nojekyll) : désactive Jekyll

## Espace admin

Ouvrez `admin.html`, renseignez l’URL de votre instance PocketBase ainsi que l’email/mot de passe du compte superuser (créé vous-même sur `https://VOTRE-INSTANCE-POCKETBASE/_/`). Recréez d’abord les collections décrites dans `pocketbase-schema.json`, puis installez `pb_hooks/main.pb.js` sur le serveur PocketBase pour activer les rappels automatiques par email.
