# Déployer PocketBase sur Fly.io

`https://serviceschablais.fly.dev` sert déjà votre site statique (une autre app Fly).
Ce dossier déploie PocketBase sur une **app Fly.io séparée** : `serviceschablais-pb`.

## Prérequis

- Un compte Fly.io (gratuit pour commencer) : https://fly.io/app/sign-up
- `flyctl` installé : https://fly.io/docs/flyctl/install/

## Étapes (à exécuter vous-même dans un terminal, depuis ce dossier `pocketbase-fly/`)

```bash
# 1. Connexion à votre compte Fly.io
flyctl auth login

# 2. Créer l'app (le fly.toml de ce dossier définit déjà le nom "serviceschablais-pb")
#    Si ce nom est déjà pris, changez "app" dans fly.toml puis relancez.
flyctl launch --no-deploy --copy-config --name serviceschablais-pb --region cdg

# 3. Créer un volume persistant pour stocker vos données PocketBase
#    (sans ça, toutes les réservations disparaîtraient à chaque redéploiement)
flyctl volumes create pb_data --region cdg --size 1 -a serviceschablais-pb

# 4. Déployer PocketBase
flyctl deploy -a serviceschablais-pb
```

## Après le déploiement

1. Ouvrez `https://serviceschablais-pb.fly.dev/_/` dans votre navigateur.
2. Créez votre premier compte superuser (email `contact@serviceschablais.fr` + un mot de passe fort que vous choisissez — ne le partagez jamais).
3. Recréez les 3 collections décrites dans `../pocketbase-schema.json` (`clients`, `reservations`, `parametres`) via l'interface PocketBase.
4. Le fichier `pb_hooks/main.pb.js` (rappels automatiques par email) est déjà inclus dans l'image Docker — rien à faire de plus.
5. Donnez-moi l'URL une fois PocketBase actif (`https://serviceschablais-pb.fly.dev`) — je mettrai à jour `config.js`, `index.html` et `admin.html` pour pointer vers cette URL définitive.

## Vérifier que ça fonctionne

```bash
curl https://serviceschablais-pb.fly.dev/api/health
```
Doit répondre avec un JSON contenant `"code": 200`.
