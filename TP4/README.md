# TP4 - Application JavaScript structurée avec données liées

## Description
Application Web Frontend permettant de gérer et de visualiser un ensemble de commandes réelles en reliant trois sources de données JSON (`customers`, `products`, `orders`).

## Fonctionnalités principales
- **Chargement asynchrone** des données avec `fetch()` et `async/await`.
- **Calculs dynamiques** des indicateurs clés (chiffre d'affaires total, nombres d'entités).
- **Relations entre données** via les identifiants uniques (`customerId`, `productId`).
- **Filtres combinés** : recherche par nom de client, filtre par statut de commande et filtre par catégorie de produit.
- **Affichage détaillé** des articles et montants de chaque commande dans un Modal Bootstrap.
- **Gestion des erreurs** de chargement des données HTTP.

## Architecture du projet
- `index.html` : Structure de la page avec Bootstrap.
- `css/style.css` : Styles personnalisés.
- `data/` : Fichiers JSON (`customers.json`, `products.json`, `orders.json`).
- `js/state.js` : Gestion de l'état central.
- `js/dataService.js` : Service de chargement des fichiers JSON.
- `js/selectors.js` : Logique de filtrage, recherche et calculs.
- `js/view.js` : Manipulation du DOM et affichage dynamique.
- `js/app.js` : Point d'entrée et orchestration.

## Instructions pour lancer le projet
1. Ouvrir le dossier dans VS Code.
2. Lancer la page `index.html` à l'aide de l'extension **Live Server**.