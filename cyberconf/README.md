# CyberConf — Application React

## Présentation

Application web React permettant la consultation et la gestion de conférences, avec un système d'authentification et des rôles (utilisateur / administrateur).

## Prérequis

- Node.js 18+
- L'API disponible à `http://localhost:4555` (via Docker Compose)

## Installation et démarrage

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm start
```

L'application sera disponible sur `http://localhost:3000`.

## Lancer l'API (Docker)

Créez un fichier `docker-compose.yml` avec le contenu fourni dans le sujet, puis :

```bash
docker-compose up
```

## Pages

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Liste de toutes les conférences | Public |
| `/conferences/:id` | Fiche détaillée d'une conférence | Public |
| `/login` | Page de connexion | Public |
| `/admin/conferences` | Gestion des conférences | Admin uniquement |
| `/admin/users` | Gestion des utilisateurs | Admin uniquement |

## Fonctionnalités

- **Authentification** : connexion avec identifiant + mot de passe, gestion des rôles
- **Liste des conférences** : affichage en grille avec code couleur, recherche
- **Fiche détaillée** : description, contenu, thème couleur, intervenants, partenaires, lieu
- **Admin — Conférences** : créer, modifier, supprimer des conférences
- **Admin — Utilisateurs** : consulter la liste, promouvoir un utilisateur en admin
- **Protection des routes** : les non-admins sont bloqués sur les pages d'administration

## Technologies

- React 18
- React Router DOM 6
- CSS personnalisé (thème dark, police Syne + Space Mono)
- Fetch API (communication avec l'API REST)
