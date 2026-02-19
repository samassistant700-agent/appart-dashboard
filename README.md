# Dashboard Recherche Appartement

Application web interactive pour gérer sa recherche d'appartement (Achat & Location).

## 🔄 Workflow Git (Pro)

**Pour toute modification :**

```bash
# 1. Créer une branche feature
git checkout -b feature/ma-fonctionnalite

# 2. Faire les modifications
# ... éditer les fichiers ...

# 3. Committer
git add .
git commit -m "Description claire de la modification"

# 4. Pusher la branche
git push -u origin feature/ma-fonctionnalite

# 5. Créer une Pull Request
gh pr create --title "Feature: Ma fonctionnalité" --body "Description détaillée"

# 6. Après review et merge, supprimer la branche
git checkout main
git pull
git branch -d feature/ma-fonctionnalite
```

**Règles :**
- ✅ Toujours travailler sur une branche `feature/`
- ✅ Commit messages clairs et descriptifs
- ✅ Pull Request avant de merger dans `main`
- ❌ JAMAIS de push direct sur `main` (sauf hotfix urgent)

## 🚀 Installation

1. Ouvrir simplement le fichier `index.html` dans un navigateur web moderne
2. Aucune installation ni serveur requis!

## ✨ Fonctionnalités

### 🔄 Mode Achat / Location
- **Sélecteur de mode** dans le header
- **Données séparées** pour chaque mode (localStorage)
- **Labels adaptatifs** :
  - Prix ↔ Loyer mensuel
  - Charges annuelles ↔ Charges mensuelles
  - Dépôt de garantie (location uniquement)
- **10 biens de test** en achat + **8 biens de test** en location

### 📊 Tableau de bord
- **Statistiques en temps réel**: Compteurs pour tous les biens, à voir, vus, retenus, refusés
- **Graphiques**:
  - Répartition par quartier (barres)
  - Répartition par DPE (camembert)

### 🔍 Filtres Interactifs
- **Prix**: Min/Max
- **Surface**: Min/Max
- **Nombre de pièces**: 1 à 5+
- **Quartier**: Liste déroulante auto-générée
- **DPE**: Checkboxes A à G
- **État**: À voir / Vu / Retenu / Refusé

### 📋 Gestion des Biens
- **Ajout**: Formulaire complet avec tous les champs
- **Modification**: Édition facile des biens existants
- **Suppression**: Avec confirmation
- **Vue détaillée**: Modal avec toutes les informations

### 📈 Calculs Automatiques
- **Prix au m²**: Calculé automatiquement pour chaque bien
- **Mise à jour des stats**: En temps réel

### 🎨 Design
- **Mode sombre/clair**: Toggle en un clic
- **Responsive**: Adapté mobile/tablette/desktop
- **Couleurs DPE**: Code couleur officiel (A=vert → G=rouge)
- **Badges visuels**: Pour les statuts et équipements
- **Icônes**: Pour les équipements (🚗 Parking, 📦 Cave, 🌿 Terrasse, etc.)

### 💾 Data & Export
- **Stockage local**: Les données sont sauvegardées dans le navigateur (localStorage)
- **Export CSV**: Téléchargement de toutes les données
- **Données de test**: 10 biens exemples inclus au premier lancement

## 📝 Champs du Formulaire

### Informations Générales
- Quartier *
- Type (T1-T5, Studio, Duplex) *
- Prix (€) / Loyer mensuel (€) *
- Surface (m²) *
- Nombre de pièces *
- DPE (A-G) *
- Dépôt de garantie (€) - **Location uniquement**

### Détails Techniques
- Type de chauffage
- Charges annuelles (Achat) / mensuelles (Location) (€)
- État (À voir/Vu/Retenu/Refusé) *

### Équipements
- ☐ Parking
- ☐ Cave
- ☐ Terrasse
- ☐ Climatisation
- ☐ Ascenseur
- ☐ Balcon

### Dates & Contact
- Date de publication
- Date de prise de contact
- Date de visite
- Contact (agence/propriétaire)
- Téléphone
- Site web

### Adresse & Notes
- Adresse
- Notes (commentaires libres)

## 🎯 Utilisation

### Premier lancement
1. Ouvrir `index.html`
2. Les données de test sont automatiquement chargées
3. Les statistiques et graphiques sont générés

### Rechercher / Filtrer
1. Utiliser les filtres dans la section "🔍 Filtres"
2. Les résultats se mettent à jour en temps réel
3. Cliquer sur "Effacer" pour réinitialiser

### Ajouter un bien
1. Cliquer sur "➕ Nouveau Bien"
2. Remplir le formulaire (les champs * sont obligatoires)
3. Cliquer sur "💾 Enregistrer"

### Modifier un bien
1. Cliquer sur le bouton ✏️ dans la ligne du bien
2. Modifier les champs souhaités
3. Cliquer sur "💾 Enregistrer"

### Voir les détails
1. Cliquer sur le bouton 👁️ dans la ligne du bien
2. Un modal s'ouvre avec toutes les informations

### Supprimer un bien
1. Cliquer sur le bouton 🗑️ dans la ligne du bien
2. Confirmer la suppression

### Exporter les données
1. Cliquer sur "📥 Export CSV"
2. Le fichier CSV est téléchargé automatiquement

## 🔧 Stockage des Données

Les données sont stockées dans le **localStorage** du navigateur :
- `appartements_achat` : Données mode Achat
- `appartements_location` : Données mode Location

### Sauvegarder les données
```javascript
// Les données sont automatiquement sauvegardées à chaque modification
localStorage.setItem('appartements_achat', JSON.stringify(dataAchat));
localStorage.setItem('appartements_location', JSON.stringify(dataLocation));
```

### Exporter manuellement
Ouvrir la console du navigateur et exécuter :
```javascript
// Achat
copy(JSON.parse(localStorage.getItem('appartements_achat')));

// Location
copy(JSON.parse(localStorage.getItem('appartements_location')));
```

### Importer des données
```javascript
localStorage.setItem('appartements_achat', JSON.stringify(vosDonneesAchat));
localStorage.setItem('appartements_location', JSON.stringify(vosDonneesLocation));
location.reload();
```

## 📁 Structure des Fichiers

```
appart-dashboard/
├── index.html      # Structure principale
├── styles.css      # Styles modernes avec variables CSS
├── app.js          # Logique JavaScript complète
├── data.js         # Données de test et fonctions de stockage
└── README.md       # Ce fichier
```

## 🎨 Personnalisation

### Couleurs
Modifier les variables CSS dans `styles.css` :
```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

### Données de test
Modifier le tableau `sampleData` dans `data.js`

## 🌐 Compatibilité

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Navigateurs mobiles modernes

## 📱 Responsive Design

L'application s'adapte automatiquement :
- **Desktop**: Tous les filtres et graphiques visibles
- **Tablette**: Mise en page optimisée
- **Mobile**: Filtres empilés, tableau horizontal scrollable

## 🔒 Confidentialité

- Toutes les données restent **locales** sur votre appareil
- Aucune connexion internet requise
- Aucune donnée envoyée à un serveur
- Vos données de recherche immobilière sont privées!

## 🚀 Prochaines Améliorations Possibles

- [ ] Import CSV
- [ ] Graphiques supplémentaires (prix par m² par quartier)
- [ ] Système de favoris
- [ ] Historique des modifications
- [ ] Photos des biens
- [ ] Comparaison de biens côte à côte
- [ ] Calcul automatique de budget mensuel
- [ ] Géolocalisation sur carte

## 📄 Licence

Usage personnel libre. Créé pour faciliter la recherche immobilière.

---

**Bonnes recherches! 🏠** ✨
