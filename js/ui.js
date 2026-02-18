/**
 * Gestion de l'UI (labels, formulaires)
 */

import { state } from './state.js';
import { qs } from './utils/dom.js';

/**
 * Met à jour tous les labels selon le mode
 */
export function updateLabelsAndForm() {
    const isLocation = state.isLocation;
    
    // Labels filtres
    updateLabel('prixMin', isLocation ? 'Loyer (€)' : 'Prix (€)');
    updateLabel('prixMax', isLocation ? 'Loyer (€)' : 'Prix (€)');
    
    // Label tableau
    const thPrix = qs('#thPrix');
    if (thPrix) thPrix.childNodes[0].textContent = isLocation ? 'Loyer' : 'Prix';
    
    // Label formulaire
    const labelPrix = qs('#labelPrix');
    if (labelPrix) labelPrix.textContent = isLocation ? 'Loyer mensuel (€) *' : 'Prix (€) *';
    
    // Label charges
    updateChargesLabel();
    
    // Groupe dépôt garantie
    const depotGroup = qs('#depotGarantieGroup');
    if (depotGroup) depotGroup.style.display = isLocation ? 'block' : 'none';
    
    // Placeholders
    updatePlaceholder('prixMin', isLocation ? 'Loyer min' : 'Prix min');
    updatePlaceholder('prixMax', isLocation ? 'Loyer max' : 'Prix max');
}

/**
 * Met à jour le label des charges
 */
export function updateChargesLabel() {
    const labelCharges = qs('#labelCharges');
    if (!labelCharges) return;
    
    if (state.displayChargesMode === 'mensuelles') {
        labelCharges.textContent = 'Charges mensuelles (€)';
    } else {
        labelCharges.textContent = 'Charges annuelles (€)';
    }
}

/**
 * Met à jour les options d'état dans le formulaire
 */
export function updateEtatFormOptions() {
    const etatSelect = qs('#etat');
    const locationGroup = qs('#etatLocationGroup');
    const achatGroup = qs('#etatAchatGroup');
    
    if (!etatSelect || !locationGroup || !achatGroup) return;
    
    if (state.isLocation) {
        locationGroup.style.display = 'block';
        achatGroup.style.display = 'none';
        
        // Défaut si valeur invalide
        const validStates = ['Nouveau', 'Contacté', 'En attente de rappel', 'Rendez-vous visite', 'Il faut appeler', 'Refusé'];
        if (!validStates.includes(etatSelect.value)) {
            etatSelect.value = 'Nouveau';
        }
    } else {
        locationGroup.style.display = 'none';
        achatGroup.style.display = 'block';
        
        const validStates = ['À voir', 'Vu', 'Retenu', 'Refusé'];
        if (!validStates.includes(etatSelect.value)) {
            etatSelect.value = 'À voir';
        }
    }
}

/**
 * Met à jour le toggle des charges
 * @param {string} mode 
 */
export function updateChargesToggle(mode) {
    const btnMensuelles = qs('#chargesMensuelles');
    const btnAnnuelles = qs('#chargesAnnuelles');
    const thCharges = qs('#thCharges');
    
    btnMensuelles?.classList.toggle('active', mode === 'mensuelles');
    btnAnnuelles?.classList.toggle('active', mode === 'annuelles');
    
    if (thCharges) {
        thCharges.childNodes[0].textContent = mode === 'mensuelles' ? 'Charges/mois' : 'Charges/an';
    }
}

// Helpers
function updateLabel(forId, text) {
    const label = qs(`label[for="${forId}"]`);
    if (label) label.textContent = text;
}

function updatePlaceholder(id, text) {
    const el = qs(`#${id}`);
    if (el) el.placeholder = text;
}
