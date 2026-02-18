# Dashboard Recherche Appartement

Application web interactive pour gérer sa recherche d'appartement.

## 🚀 Installation

1. Ouvrir simplement le fichier `index.html` dans un navigateur web moderne
2. Aucune installation ni serveur requis!

## ✨ Fonctionnalités

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
- Prix (€) *
- Surface (m²) *
- Nombre de pièces *
- DPE (A-G) *

### Détails Techniques
- Type de chauffage
- Charges annuelles (€)
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

Les données sont stockées dans le **localStorage** du navigateur sous la clé `appartements`.

### Sauvegarder les données
```javascript
// Les données sont automatiquement sauvegardées à chaque modification
localStorage.setItem('appartements', JSON.stringify(data));
```

### Exporter manuellement
Ouvrir la console du navigateur et exécuter :
```javascript
copy(JSON.parse(localStorage.getItem('appartements')));
```

### Importer des données
```javascript
localStorage.setItem('appartements', JSON.stringify(vosDonnées));
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
