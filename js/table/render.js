/**
 * Rendu du tableau de biens
 */

import { state } from '../state.js';
import { formatPrice, escapeHtml, getStatusClass } from '../utils/format.js';
import { qs } from '../utils/dom.js';
import { updateSortIcons } from './sort.js';

/**
 * Rend le tableau avec les données filtrées
 */
export function renderTable() {
    const tbody = qs('#biensTableBody');
    const noResults = qs('#noResults');
    
    if (!tbody) return;
    
    if (state.filteredBiens.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    const isLocation = state.isLocation;
    
    tbody.innerHTML = state.filteredBiens.map(bien => renderRow(bien, isLocation)).join('');
    
    updateSortIcons();
}

/**
 * Rend une ligne du tableau
 * @param {Object} bien 
 * @param {boolean} isLocation 
 * @returns {string}
 */
function renderRow(bien, isLocation) {
    const prix = isLocation ? (bien.loyer || 0) : (bien.prix || 0);
    const prixLabel = formatPrice(prix);
    const prixM2 = Math.round(prix / bien.surface);
    
    const { chargesValue, chargesLabel } = getChargesDisplay(bien);
    
    const statusClass = getStatusClass(bien.etat);
    const dpeClass = `badge-dpe-${bien.dpe.toLowerCase()}`;
    const equipmentIcons = getEquipmentIcons(bien);
    const meubléLabel = isLocation 
        ? (bien.meublé ? 'Oui' : 'Non') 
        : (bien.meublé ? '🏠' : '');
    
    return `
        <tr>
            <td><strong>${escapeHtml(bien.quartier)}</strong></td>
            <td>${escapeHtml(bien.type)}</td>
            <td><strong>${prixLabel}</strong></td>
            <td>${bien.surface} m²</td>
            <td>${meubléLabel}</td>
            <td>${bien.pieces}</td>
            <td><strong>${prixM2} €/m²</strong></td>
            <td>${chargesLabel}</td>
            <td><span class="badge badge-dpe ${dpeClass}">${bien.dpe}</span></td>
            <td><span class="badge ${statusClass}">${bien.etat}</span></td>
            <td><div class="equipment-icons">${equipmentIcons}</div></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewBien(${bien.id})" title="Voir">👁️</button>
                    <button class="action-btn btn-edit" onclick="editBien(${bien.id})" title="Modifier">✏️</button>
                    <button class="action-btn btn-delete" onclick="deleteBien(${bien.id})" title="Supprimer">🗑️</button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Calcule l'affichage des charges
 * @param {Object} bien 
 * @returns {Object}
 */
function getChargesDisplay(bien) {
    let chargesValue = 0;
    let chargesLabel = '-';
    
    if (state.displayChargesMode === 'mensuelles') {
        chargesValue = bien.charges || 0;
        chargesLabel = chargesValue ? `${formatPrice(chargesValue)}/mois` : '-';
    } else {
        chargesValue = bien.charges_annuelles !== undefined 
            ? bien.charges_annuelles 
            : (bien.charges || 0) * 12;
        chargesLabel = chargesValue ? `${formatPrice(chargesValue)}/an` : '-';
    }
    
    return { chargesValue, chargesLabel };
}

/**
 * Génère les icônes d'équipements
 * @param {Object} bien 
 * @returns {string}
 */
function getEquipmentIcons(bien) {
    const icons = [];
    const equipment = [
        { key: 'parking', icon: '🚗', label: 'Parking' },
        { key: 'cave', icon: '📦', label: 'Cave' },
        { key: 'terrasse', icon: '🌿', label: 'Terrasse' },
        { key: 'clim', icon: '❄️', label: 'Climatisation' },
        { key: 'ascenseur', icon: '🛗', label: 'Ascenseur' },
        { key: 'balcon', icon: '🌸', label: 'Balcon' }
    ];
    
    equipment.forEach(item => {
        if (bien[item.key]) {
            icons.push(`<span class="equipment-icon" title="${item.label}">${item.icon}</span>`);
        }
    });
    
    return icons.join('');
}
