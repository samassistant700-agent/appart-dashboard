# 📁 Proposition de Structure Modulaire - appart-dashboard

> Objectif : Découper `app.js` (~900 lignes) en modules réutilisables et maintenables.

---

## Structure Proposée

```
appart-dashboard/
├── index.html
├── styles.css
├── data.js                    # (existant) Persistence localStorage
├── app.js                     # Point d'entrée (100-150 lignes)
├── js/
│   ├── config.js              # Constantes & configuration
│   ├── state.js               # Gestion de l'état global
│   ├── theme.js               # Thème clair/sombre
│   ├── table/
│   │   ├── index.js           # Initialisation table
│   │   ├── render.js          # Rendu des lignes
│   │   ├── sort.js            # Logique de tri
│   │   └── filters.js         # Filtres appliqués
│   ├── modals/
│   │   ├── index.js           # Gestion des modals
│   │   ├── form.js            # Modal ajout/édition
│   │   └── view.js            # Modal détails
│   ├── stats/
│   │   ├── index.js           # Rendu des stats
│   │   └── charts.js          # Graphiques canvas
│   └── utils/
│       ├── format.js          # formatPrice, escapeHtml
│       └── dom.js             # Helpers DOM
```

---

## Découpage Détaillé

### 1. `js/config.js` (~30 lignes)
```javascript
export const CONFIG = {
    MODES: { ACHAT: 'achat', LOCATION: 'location' },
    CHARGES_MODES: { MENSUELLES: 'mensuelles', ANNUELLES: 'annuelles' },
    LOCATION_STATES: ['Nouveau', 'Contacté', 'En attente de rappel', 'Rendez-vous visite', 'Il faut appeler', 'Refusé'],
    ACHAT_STATES: ['À voir', 'Vu', 'Retenu', 'Refusé'],
    DPE_COLORS: { A: '#22c55e', B: '#84cc16', /* ... */ }
};
```

### 2. `js/state.js` (~50 lignes)
```javascript
// État global avec getters/setters
export const state = {
    biens: [],
    filteredBiens: [],
    editingId: null,
    currentMode: 'achat',
    displayChargesMode: 'mensuelles',
    sortColumn: null,
    sortDirection: 'asc'
};

export function setMode(mode) { /* ... */ }
export function setSort(column, direction) { /* ... */ }
```

### 3. `js/table/sort.js` (~100 lignes)
```javascript
import { state } from '../state.js';

export function sortTable(column) { /* ... */ }
export function applySort(data) { /* ... */ }
export function updateSortIcons() { /* ... */ }
```

### 4. `js/table/filters.js` (~80 lignes)
```javascript
import { state } from '../state.js';

export function applyFilters() { /* ... */ }
export function clearFilters() { /* ... */ }
export function populateQuartierFilter() { /* ... */ }
export function updateEtatFilters() { /* ... */ }
```

### 5. `js/table/render.js` (~120 lignes)
```javascript
import { getStatusClass } from '../utils/format.js';

export function renderTable() { /* ... */ }
export function getEquipmentIcons(bien) { /* ... */ }
```

### 6. `js/modals/form.js` (~150 lignes)
```javascript
import { state } from '../state.js';

export function openModal(bien = null) { /* ... */ }
export function closeModal() { /* ... */ }
export function handleFormSubmit(e) { /* ... */ }
```

### 7. `js/modals/view.js` (~100 lignes)
```javascript
export function viewBien(id) { /* ... */ }
export function closeViewModal() { /* ... */ }
```

### 8. `js/stats/index.js` (~80 lignes)
```javascript
import { state } from '../state.js';

export function renderStats() { /* ... */ }
function updateStatElement(elementId, badgeClass, badgeText, value) { /* ... */ }
function updateStatLabels(...) { /* ... */ }
```

### 9. `js/stats/charts.js` (~120 lignes)
```javascript
export function renderCharts() { /* ... */ }
export function renderQuartierChart() { /* ... */ }
export function renderDPEChart() { /* ... */ }
```

### 10. `js/utils/format.js` (~40 lignes)
```javascript
export function formatPrice(price) { /* ... */ }
export function escapeHtml(text) { /* ... */ }
export function getStatusClass(etat) { /* ... */ }
export function getDPEColor(dpe) { /* ... */ }
```

### 11. `js/utils/dom.js` (~30 lignes)
```javascript
export function createElement(tag, options = {}) { /* ... */ }
export function qs(selector, context = document) { /* ... */ }
export function qsa(selector, context = document) { /* ... */ }
```

---

## `app.js` (Point d'entrée)

```javascript
import { initTheme } from './js/theme.js';
import { initModeSelector } from './js/mode.js';
import { initEventListeners } from './js/events.js';
import { loadData } from './js/data.js';
import { renderTable } from './js/table/render.js';
import { renderStats } from './js/stats/index.js';
import { renderCharts } from './js/stats/charts.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initModeSelector();
    initEventListeners();
    
    const biens = loadData();
    renderTable(biens);
    renderStats();
    renderCharts();
});
```

---

## Migration Progressive

Option 1 - **Tout d'un coup** (si tu veux le faire maintenant)
Option 2 - **Progressif** (recommandé) :
1. Extraire `utils/format.js` + `utils/dom.js` d'abord
2. Puis `state.js`
3. Puis `table/sort.js` et `table/filters.js`
4. etc.

## Avantages

| Avantage | Description |
|----------|-------------|
| **Testabilité** | Chaque module peut être testé isolément |
| **Lisibilité** | Fichiers < 150 lignes vs 900 lignes |
| **Collab** | Plusieurs devs peuvent travailler sur des modules différents |
| **Reusability** | Les utils peuvent être réutilisés ailleurs |
| **Tree-shaking** | Build plus léger si on enlève des features |

---

## Script de Migration (Optionnel)

```bash
# Créer la structure
mkdir -p js/table js/modals js/stats js/utils

# Déplacer logiquement le code
# (À faire manuellement avec copy-paste intelligent)
```

Tu veux que je **génère les fichiers de cette structure** ?
