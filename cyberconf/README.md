# CyberConf — TP React

Application web de consultation et gestion de conférences.

## Lancer le projet

### 1. Démarrer l'API (Docker)

 fichier `docker-compose.yml` 

```bash
docker-compose up
```

- API disponible sur : `http://localhost:4555`
- Interface base de données : `http://localhost:9555` (login: `admin` / `pass`)

### 2. Lancer l'application React

```bash
npm install
npm start
```

## Comptes de test

| Identifiant | Mot de passe | Rôle |
|------------|--------------|------|
| `admin`    | `pass123`    |admin |
| `user`     | `pass123`    | Utilisateur simple |

## Fonctionnalités par rôle

### Utilisateur non connecté
- Consulter la liste des conférences
- Voir le détail d'une conférence

### Utilisateur connecté (user)
- Mêmes accès que non connecté
- Les pages d'administration sont inaccessibles

### Administrateur
- Tout ce que peut faire un utilisateur
- **Gérer les conférences** : créer, modifier, supprimer
- **Gérer les utilisateurs** : consulter la liste, promouvoir un utilisateur en admin

---

