/**
 * Actions sur les biens (suppression, édition)
 */

import { state, deleteBien as removeBien } from './state.js';
import { saveData } from './data.js';
import { openModal } from './modals/form.js';
import { renderTable } from './table/render.js';
import { renderStats } from './stats/index.js';
import { renderCharts } from './stats/charts.js';
import { populateQuartierFilter } from './table/filters.js';

/**
 * Supprime un bien après confirmation
 * @param {number} id 
 */
export function deleteBien(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;
    
    removeBien(id);
    saveData(state.biens, state.currentMode);
    
    populateQuartierFilter();
    renderTable();
    renderStats();
    renderCharts();
}

/**
 * Ouvre le modal d'édition pour un bien
 * @param {number} id 
 */
export function editBien(id) {
    const bien = state.biens.find(b => b.id === id);
    if (bien) {
        openModal(bien);
    }
}
