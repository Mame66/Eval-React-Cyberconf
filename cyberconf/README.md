# CyberConf — TP React

Application web de consultation et gestion de conférences.

## Lancer le projet

```bash
npm install
npm start
```

L'application est accessible sur `http://localhost:3000`.

L'API doit tourner sur `http://localhost:4555` (voir docker-compose.yml fourni).

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Navbar/
│   ├── ProtectedRoute/
│   ├── ConferenceCard/
│   └── Modal/
├── context/
│   └── AuthContext.js   # Gestion de l'authentification
├── hooks/               # Hooks personnalisés
│   ├── useConferences.js
│   └── useUsers.js
├── pages/               # Une page = un dossier
│   ├── Home/
│   ├── Login/
│   ├── ConferenceDetail/
│   ├── AdminConferences/
│   ├── AdminUsers/
│   └── NotFound/
├── services/
│   └── api.js           # Appels à l'API REST
└── styles/
    ├── global.css       # Variables CSS et reset
    └── components.css   # Styles partagés (boutons, formulaires...)
```

## Fonctionnalités

- Consultation de la liste des conférences
- Fiche détaillée avec thème couleur, intervenants, partenaires, lieu
- Connexion / inscription
- Administration des conférences (créer, modifier, supprimer)
- Administration des utilisateurs (liste, promouvoir en admin)
- Protection des routes admin
