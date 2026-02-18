/**
 * Modal de vue détails
 */

import { state } from '../state.js';
import { qs } from '../utils/dom.js';
import { formatPrice, escapeHtml, getStatusClass } from '../utils/format.js';

/**
 * Affiche les détails d'un bien
 * @param {number} id 
 */
export function viewBien(id) {
    const bien = state.biens.find(b => b.id === id);
    if (!bien) return;
    
    const modal = qs('#viewModal');
    const content = qs('#viewContent');
    
    if (!modal || !content) return;
    
    content.innerHTML = renderDetails(bien);
    modal.classList.add('active');
}

/**
 * Ferme le modal de détails
 */
export function closeViewModal() {
    qs('#viewModal')?.classList.remove('active');
}

/**
 * Génère le HTML des détails
 * @param {Object} bien 
 * @returns {string}
 */
function renderDetails(bien) {
    const isLocation = state.isLocation;
    const prix = isLocation ? (bien.loyer || 0) : (bien.prix || 0);
    const prixLabel = isLocation ? 'Loyer' : 'Prix';
    const prixM2 = Math.round(prix / bien.surface);
    
    return `
        ${renderSection('📍 Informations Générales', `
            <div class="detail-grid">
                ${renderDetailItem('Quartier', bien.quartier)}
                ${renderDetailItem('Type', bien.type)}
                ${renderDetailItem(prixLabel, `<strong>${formatPrice(prix)}</strong>`)}
                ${renderDetailItem('Surface', `${bien.surface} m²`)}
                ${renderDetailItem('Meublé', bien.meublé ? '🏠 Oui' : 'Non')}
                ${renderDetailItem('Pièces', bien.pieces)}
                ${renderDetailItem('Prix/m²', `<strong>${prixM2} €/m²</strong>`)}
                ${isLocation ? renderDetailItem('Dépôt de garantie', 
                    bien.depotGarantie ? formatPrice(bien.depotGarantie) : 'N/A') : ''}
            </div>
        `)}
        
        ${renderSection('🔧 Détails Techniques', `
            <div class="detail-grid">
                ${renderDetailItem('DPE', `<span class="badge badge-dpe badge-dpe-${bien.dpe.toLowerCase()}">${bien.dpe}</span>`)}
                ${renderDetailItem('Chauffage', bien.chauffage || 'Non spécifié')}
                ${renderDetailItem('Charges mensuelles', bien.charges ? formatPrice(bien.charges) : 'N/A')}
                ${renderDetailItem('Charges annuelles', 
                    bien.charges_annuelles ? formatPrice(bien.charges_annuelles) : 
                    (bien.charges ? formatPrice(bien.charges * 12) : 'N/A'))}
                ${renderDetailItem('État', `<span class="badge ${getStatusClass(bien.etat)}">${bien.etat}</span>`)}
            </div>
        `)}
        
        ${renderSection('🚗 Équipements', renderEquipmentList(bien))}
        ${renderSection('📅 Dates & Contact', renderContactInfo(bien))}
        ${renderSection('📝 Adresse & Notes', `
            <div class="detail-item" style="margin-bottom: 12px;">
                <span class="detail-label">Adresse</span>
                <span class="detail-value">${escapeHtml(bien.adresse || 'Non renseignée')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Notes</span>
                <div class="detail-notes">${escapeHtml(bien.notes || 'Aucune note')}</div>
            </div>
        `)}
        
        ${bien.siteWeb ? `
        <div class="detail-section">
            <h4>🔗 Lien</h4>
            <a href="${escapeHtml(bien.siteWeb)}" target="_blank" class="btn btn-secondary btn-sm">Voir l'annonce</a>
        </div>
        ` : ''}
    `;
}

/**
 * Rend une section de détails
 * @param {string} title 
 * @param {string} content 
 * @returns {string}
 */
function renderSection(title, content) {
    return `
        <div class="detail-section">
            <h4>${title}</h4>
            ${content}
        </div>
    `;
}

/**
 * Rend un item de détail
 * @param {string} label 
 * @param {string} value 
 * @returns {string}
 */
function renderDetailItem(label, value) {
    return `
        <div class="detail-item">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

/**
 * Rend la liste des équipements
 * @param {Object} bien 
 * @returns {string}
 */
function renderEquipmentList(bien) {
    const equipment = [
        { key: 'parking', label: 'Parking' },
        { key: 'cave', label: 'Cave' },
        { key: 'terrasse', label: 'Terrasse' },
        { key: 'clim', label: 'Climatisation' },
        { key: 'ascenseur', label: 'Ascenseur' },
        { key: 'balcon', label: 'Balcon' }
    ];
    
    return `<div class="detail-value">${
        equipment.map(item => 
            `${bien[item.key] ? '✅' : '❌'} ${item.label}`
        ).join('<br>')
    }</div>`;
}

/**
 * Rend les informations de contact
 * @param {Object} bien 
 * @returns {string}
 */
function renderContactInfo(bien) {
    return `
        <div class="detail-grid">
            ${renderDetailItem('Date publication', bien.datePublication || 'N/A')}
            ${renderDetailItem('Date contact', bien.dateContact || 'N/A')}
            ${renderDetailItem('Date visite', bien.dateVisite || 'N/A')}
            ${renderDetailItem('Contact', bien.contact || 'N/A')}
            ${renderDetailItem('Téléphone', bien.tel || 'N/A')}
        </div>
    `;
}
