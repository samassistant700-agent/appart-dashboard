/**
 * Modal formulaire (ajout/édition)
 */

import { CONFIG } from '../config.js';
import { state, setEditingId, addBien, updateBien } from '../state.js';
import { saveData } from '../data.js';
import { qs } from '../utils/dom.js';
import { formatPrice } from '../utils/format.js';
import { renderTable } from '../table/render.js';
import { renderStats } from '../stats/index.js';
import { renderCharts } from '../stats/charts.js';
import { populateQuartierFilter } from '../table/filters.js';
import { updateLabelsAndForm, updateEtatFormOptions } from '../ui.js';

/**
 * Ouvre le modal d'ajout ou d'édition
 * @param {Object|null} bien 
 */
export function openModal(bien = null) {
    const modal = qs('#bienModal');
    const form = qs('#bienForm');
    const title = qs('#modalTitle');
    
    if (!modal || !form) return;
    
    form.reset();
    updateLabelsAndForm();
    
    if (bien) {
        setEditingId(bien.id);
        title.textContent = '✏️ Modifier le Bien';
        fillForm(bien);
    } else {
        setEditingId(null);
        title.textContent = '➕ Nouveau Bien';
    }
    
    modal.classList.add('active');
}

/**
 * Ferme le modal
 */
export function closeModal() {
    qs('#bienModal')?.classList.remove('active');
    setEditingId(null);
}

/**
 * Remplit le formulaire avec les données d'un bien
 * @param {Object} bien 
 */
function fillForm(bien) {
    const prixValue = state.isLocation 
        ? (bien.loyer || bien.prix || 0) 
        : (bien.prix || 0);
    
    const fields = {
        'quartier': bien.quartier,
        'type': bien.type,
        'prix': prixValue,
        'surface': bien.surface,
        'pieces': bien.pieces,
        'meublé': bien.meublé ? 'true' : 'false',
        'dpe': bien.dpe,
        'chauffage': bien.chauffage || '',
        'etat': bien.etat,
        'datePublication': bien.datePublication || '',
        'dateContact': bien.dateContact || '',
        'dateVisite': bien.dateVisite || '',
        'contact': bien.contact || '',
        'tel': bien.tel || '',
        'siteWeb': bien.siteWeb || '',
        'adresse': bien.adresse || '',
        'notes': bien.notes || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const el = qs(`#${id}`);
        if (el) el.value = value;
    });
    
    // Charges
    const chargesValue = state.displayChargesMode === 'mensuelles'
        ? (bien.charges || 0)
        : (bien.charges_annuelles || (bien.charges || 0) * 12);
    qs('#charges').value = chargesValue || '';
    
    // Checkboxes équipements
    ['parking', 'cave', 'terrasse', 'clim', 'ascenseur', 'balcon'].forEach(key => {
        const el = qs(`#${key}`);
        if (el) el.checked = bien[key] || false;
    });
    
    // Dépôt de garantie (location uniquement)
    if (state.isLocation) {
        qs('#depotGarantie').value = bien.depotGarantie || '';
    }
}

/**
 * Gère la soumission du formulaire
 * @param {Event} e 
 */
export function handleFormSubmit(e) {
    e.preventDefault();
    
    const bien = collectFormData();
    
    if (state.editingId) {
        updateBien(bien);
    } else {
        addBien(bien);
    }
    
    saveData(state.biens, state.currentMode);
    
    populateQuartierFilter();
    renderTable();
    renderStats();
    renderCharts();
    closeModal();
}

/**
 * Collecte les données du formulaire
 * @returns {Object}
 */
function collectFormData() {
    const isLocation = state.isLocation;
    const prixValue = parseFloat(qs('#prix').value);
    const chargesValue = parseFloat(qs('#charges').value) || 0;
    
    const bien = {
        id: state.editingId || Date.now(),
        quartier: qs('#quartier').value,
        type: qs('#type').value,
        surface: parseFloat(qs('#surface').value),
        pieces: parseInt(qs('#pieces').value),
        meublé: qs('#meublé').value === 'true',
        dpe: qs('#dpe').value,
        chauffage: qs('#chauffage').value,
        parking: qs('#parking').checked,
        cave: qs('#cave').checked,
        terrasse: qs('#terrasse').checked,
        clim: qs('#clim').checked,
        ascenseur: qs('#ascenseur').checked,
        balcon: qs('#balcon').checked,
        etat: qs('#etat').value,
        datePublication: qs('#datePublication').value,
        dateContact: qs('#dateContact').value,
        dateVisite: qs('#dateVisite').value,
        contact: qs('#contact').value,
        tel: qs('#tel').value,
        siteWeb: qs('#siteWeb').value,
        adresse: qs('#adresse').value,
        notes: qs('#notes').value
    };
    
    // Prix/loyer selon le mode
    if (isLocation) {
        bien.loyer = prixValue;
        bien.depotGarantie = parseFloat(qs('#depotGarantie')?.value) || (prixValue * 2);
    } else {
        bien.prix = prixValue;
    }
    
    // Charges (toujours stocker les deux)
    if (state.displayChargesMode === 'mensuelles') {
        bien.charges = chargesValue;
        bien.charges_annuelles = chargesValue * 12;
    } else {
        bien.charges_annuelles = chargesValue;
        bien.charges = chargesValue / 12;
    }
    
    return bien;
}
