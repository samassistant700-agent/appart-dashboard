/**
 * Filtres du tableau
 */

import { CONFIG } from '../config.js';
import { state, setFilteredBiens } from '../state.js';
import { qs, createElement } from '../utils/dom.js';

/**
 * Applique tous les filtres actifs
 */
export function applyFilters() {
    const isLocation = state.isLocation;
    const prixMin = parseFloat(qs('#prixMin')?.value) || 0;
    const prixMax = parseFloat(qs('#prixMax')?.value) || Infinity;
    const surfaceMin = parseFloat(qs('#surfaceMin')?.value) || 0;
    const surfaceMax = parseFloat(qs('#surfaceMax')?.value) || Infinity;
    const pieces = qs('#piecesFilter')?.value;
    const quartier = qs('#quartierFilter')?.value;
    
    const dpeChecked = Array.from(document.querySelectorAll('#dpeFilter input:checked')).map(cb => cb.value);
    const etatChecked = Array.from(document.querySelectorAll('#etatFilter input:checked')).map(cb => cb.value);
    
    const filtered = state.biens.filter(bien => {
        const prix = isLocation ? (bien.loyer || 0) : (bien.prix || 0);
        if (prix < prixMin || prix > prixMax) return false;
        if (bien.surface < surfaceMin || bien.surface > surfaceMax) return false;
        if (pieces && bien.pieces !== parseInt(pieces)) return false;
        if (quartier && bien.quartier !== quartier) return false;
        if (dpeChecked.length > 0 && !dpeChecked.includes(bien.dpe)) return false;
        if (etatChecked.length > 0 && !etatChecked.includes(bien.etat)) return false;
        
        return true;
    });
    
    setFilteredBiens(filtered);
}

/**
 * Réinitialise tous les filtres
 */
export function clearFilters() {
    const filterIds = ['prixMin', 'prixMax', 'surfaceMin', 'surfaceMax', 'piecesFilter', 'quartierFilter'];
    filterIds.forEach(id => {
        const el = qs(`#${id}`);
        if (el) el.value = '';
    });
    
    document.querySelectorAll('#dpeFilter input, #etatFilter input').forEach(cb => {
        cb.checked = false;
    });
    
    setFilteredBiens([...state.biens]);
}

/**
 * Remplit le sélecteur de quartiers
 */
export function populateQuartierFilter() {
    const select = qs('#quartierFilter');
    if (!select) return;
    
    const quartiers = [...new Set(state.biens.map(b => b.quartier))].sort();
    
    select.innerHTML = '<option value="">Tous</option>';
    quartiers.forEach(q => {
        const option = createElement('option', {
            attrs: { value: q },
            text: q
        });
        select.appendChild(option);
    });
}

/**
 * Met à jour les filtres d'état selon le mode
 */
export function updateEtatFilters() {
    const container = qs('#etatFilter');
    if (!container) return;
    
    container.innerHTML = '';
    
    const states = state.isLocation 
        ? CONFIG.LOCATION_STATES 
        : CONFIG.ACHAT_STATES;
    
    states.forEach(stateItem => {
        const label = createElement('label');
        const checkbox = createElement('input', {
            attrs: { type: 'checkbox', value: stateItem.value },
            events: { change: applyFilters }
        });
        
        label.appendChild(checkbox);
        
        // Ajouter indicateur coloré pour location
        if (state.isLocation && stateItem.class) {
            const indicator = createElement('span', {
                className: stateItem.class,
                text: '● ',
                attrs: { style: 'font-size: 0.8rem;' }
            });
            label.appendChild(indicator);
        }
        
        label.appendChild(document.createTextNode(' ' + stateItem.label));
        container.appendChild(label);
    });
}
