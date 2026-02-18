//**
 * Logique de tri du tableau
 */

import { state, setSort, resetSort } from '../state.js';

/**
 * Gère le clic sur un en-tête de colonne
 * Cycle: asc → desc → reset
 * @param {string} column 
 */
export function sortTable(column) {
    if (state.sortColumn === column) {
        if (state.sortDirection === 'asc') {
            setSort(column, 'desc');
        } else {
            // 3ème clic = reset
            resetSort();
            return;
        }
    } else {
        setSort(column, 'asc');
    }
}

/**
 * Applique le tri sur un tableau de données
 * @param {Array} data 
 * @returns {Array}
 */
export function applySort(data) {
    if (!state.sortColumn) return data;
    
    return [...data].sort((a, b) => {
        const { aVal, bVal } = getSortValues(a, b, state.sortColumn);
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return state.sortDirection === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        
        return state.sortDirection === 'asc' 
            ? aVal - bVal 
            : bVal - aVal;
    });
}

/**
 * Extrait les valeurs à comparer selon la colonne
 * @param {Object} a 
 * @param {Object} b 
 * @param {string} column 
 * @returns {Object}
 */
function getSortValues(a, b, column) {
    const isLocation = state.isLocation;
    let aVal, bVal;
    
    switch (column) {
        case 'loyer':
        case 'prix':
            aVal = isLocation ? (a.loyer || 0) : (a.prix || 0);
            bVal = isLocation ? (b.loyer || 0) : (b.prix || 0);
            break;
            
        case 'surface':
            aVal = a.surface || 0;
            bVal = b.surface || 0;
            break;
            
        case 'prixM2':
            const prixA = isLocation ? (a.loyer || 0) : (a.prix || 0);
            const prixB = isLocation ? (b.loyer || 0) : (b.prix || 0);
            aVal = a.surface ? Math.round(prixA / a.surface) : 0;
            bVal = b.surface ? Math.round(prixB / b.surface) : 0;
            break;
            
        case 'charges':
            const getCharges = (bien) => {
                if (state.displayChargesMode === 'mensuelles') {
                    return bien.charges || 0;
                }
                return bien.charges_annuelles || (bien.charges || 0) * 12;
            };
            aVal = getCharges(a);
            bVal = getCharges(b);
            break;
            
        case 'quartier':
            aVal = (a.quartier || '').toLowerCase();
            bVal = (b.quartier || '').toLowerCase();
            break;
            
        case 'type':
            aVal = (a.type || '').toLowerCase();
            bVal = (b.type || '').toLowerCase();
            break;
            
        case 'dpe':
            aVal = a.dpe || '';
            bVal = b.dpe || '';
            break;
            
        default:
            return { aVal: 0, bVal: 0 };
    }
    
    return { aVal, bVal };
}

/**
 * Met à jour les icônes de tri dans le tableau
 */
export function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.textContent = '';
    });
    
    if (!state.sortColumn) return;
    
    const th = document.querySelector(`th[data-sort="${state.sortColumn}"]`);
    if (!th) return;
    
    const icon = th.querySelector('.sort-icon');
    if (icon) {
        icon.textContent = state.sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
}
