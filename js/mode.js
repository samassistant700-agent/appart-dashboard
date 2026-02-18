/**
 * Gestion du mode Achat/Location
 */

import { CONFIG, STORAGE_KEYS } from '../config.js';
import { state, setMode } from '../state.js';
import { loadData, saveData } from '../data.js';
import { qs } from '../utils/dom.js';
import { renderTable } from './table/render.js';
import { renderStats } from './stats/index.js';
import { renderCharts } from './stats/charts.js';
import { populateQuartierFilter, updateEtatFilters, clearFilters } from './table/filters.js';
import { updateLabelsAndForm, updateEtatFormOptions } from './ui.js';

/**
 * Initialise le sélecteur de mode
 */
export function initModeSelector() {
    qs('#modeAchat')?.addEventListener('click', () => switchMode(CONFIG.MODES.ACHAT));
    qs('#modeLocation')?.addEventListener('click', () => switchMode(CONFIG.MODES.LOCATION));
}

/**
 * Change de mode (achat ↔ location)
 * @param {string} newMode 
 */
export function switchMode(newMode) {
    if (newMode === state.currentMode) return;
    
    // Sauvegarder les données actuelles
    saveData(state.biens, state.currentMode);
    
    // Changer le mode
    setMode(newMode);
    
    // Mettre à jour l'UI
    updateModeUI();
    
    // Charger les nouvelles données
    const newData = loadData(newMode);
    
    // Rafraîchir l'interface
    populateQuartierFilter();
    updateLabelsAndForm();
    updateEtatFormOptions();
    updateEtatFilters();
    renderTable();
    renderStats();
    renderCharts();
    clearFilters();
}

/**
 * Met à jour l'UI du sélecteur de mode
 */
export function updateModeUI() {
    const modeAchat = qs('#modeAchat');
    const modeLocation = qs('#modeLocation');
    
    if (!modeAchat || !modeLocation) return;
    
    const isAchat = state.currentMode === CONFIG.MODES.ACHAT;
    modeAchat.classList.toggle('active', isAchat);
    modeLocation.classList.toggle('active', !isAchat);
}
