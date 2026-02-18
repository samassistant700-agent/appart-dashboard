/**
 * Gestion des événements globaux
 */

import { state, setChargesMode } from './state.js';
import { qs } from './utils/dom.js';
import { openModal, closeModal, handleFormSubmit } from './modals/form.js';
import { closeViewModal } from './modals/view.js';
import { applyFilters, clearFilters } from './table/filters.js';
import { sortTable } from './table/sort.js';
import { renderTable } from './table/render.js';
import { updateLabelsAndForm, updateChargesToggle } from './ui.js';
import { exportCSV } from './data.js';
import { deleteBien, editBien } from './actions.js';

/**
 * Initialise tous les écouteurs d'événements
 */
export function initEventListeners() {
    // Bouton ajouter
    qs('#addBtn')?.addEventListener('click', () => openModal());
    
    // Fermeture modals
    qs('#modalClose')?.addEventListener('click', closeModal);
    qs('#modalCancel')?.addEventListener('click', closeModal);
    qs('#viewClose')?.addEventListener('click', closeViewModal);
    
    // Formulaire
    qs('#bienForm')?.addEventListener('submit', handleFormSubmit);
    
    // Filtres texte/number
    const filterInputs = ['prixMin', 'prixMax', 'surfaceMin', 'surfaceMax', 'piecesFilter', 'quartierFilter'];
    filterInputs.forEach(id => {
        const el = qs(`#${id}`);
        if (el) {
            el.addEventListener('input', () => { applyFilters(); renderTable(); });
            el.addEventListener('change', () => { applyFilters(); renderTable(); });
        }
    });
    
    // Checkboxes DPE
    qs('#dpeFilter')?.addEventListener('change', () => { applyFilters(); renderTable(); });
    
    // Checkboxes État (attaché dynamiquement dans filters.js)
    
    // Bouton effacer filtres
    qs('#clearFilters')?.addEventListener('click', () => {
        clearFilters();
        renderTable();
    });
    
    // Export CSV
    qs('#exportBtn')?.addEventListener('click', () => exportCSV(state.biens, state.currentMode));
    
    // Toggle charges
    qs('#chargesMensuelles')?.addEventListener('click', () => toggleChargesMode('mensuelles'));
    qs('#chargesAnnuelles')?.addEventListener('click', () => toggleChargesMode('annuelles'));
    
    // Tri colonnes
    document.querySelectorAll('th.sortable').forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            sortTable(column);
            applyFilters();
            renderTable();
        });
    });
    
    // Fermer modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Redessiner graphiques au changement de thème
    window.addEventListener('themechange', () => {
        import('./stats/charts.js').then(m => m.renderCharts());
    });
}

/**
 * Bascule le mode d'affichage des charges
 * @param {string} mode 
 */
function toggleChargesMode(mode) {
    setChargesMode(mode);
    updateChargesToggle(mode);
    updateLabelsAndForm();
    renderTable();
}

// Exposer fonctions globales pour les onclick inline
window.viewBien = (id) => import('./modals/view.js').then(m => m.viewBien(id));
window.editBien = (id) => import('./actions.js').then(m => m.editBien(id));
window.deleteBien = (id) => import('./actions.js').then(m => m.deleteBien(id));
