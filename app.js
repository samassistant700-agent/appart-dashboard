/**
 * Point d'entrée de l'application
 * Architecture modulaire ES6
 */

import { setBiens } from './js/state.js';
import { loadData } from './js/data.js';
import { initTheme } from './js/theme.js';
import { initModeSelector, updateModeUI } from './js/mode.js';
import { initEventListeners } from './js/events.js';
import { updateLabelsAndForm, updateEtatFormOptions } from './js/ui.js';
import { populateQuartierFilter, updateEtatFilters } from './js/table/filters.js';
import { renderTable } from './js/table/render.js';
import { renderStats } from './js/stats/index.js';
import { renderCharts } from './js/stats/charts.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le state
    const biens = loadData();
    setBiens(biens);
    
    // Initialiser les modules
    initTheme();
    initModeSelector();
    initEventListeners();
    
    // Mettre à jour l'UI
    updateModeUI();
    populateQuartierFilter();
    updateLabelsAndForm();
    updateEtatFormOptions();
    updateEtatFilters();
    
    // Premier rendu
    renderTable();
    renderStats();
    renderCharts();
    
    // Initialiser le toggle charges
    setTimeout(() => {
        const btnMensuelles = document.getElementById('chargesMensuelles');
        if (btnMensuelles) btnMensuelles.click();
    }, 100);
});
