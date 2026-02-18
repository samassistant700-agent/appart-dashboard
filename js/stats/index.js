/**
 * Rendu des statistiques
 */

import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { qs, createElement } from '../utils/dom.js';
import { getStatusClass } from '../utils/format.js';

/**
 * Rend les cartes de statistiques
 */
export function renderStats() {
    if (state.isLocation) {
        renderLocationStats();
    } else {
        renderAchatStats();
    }
}

/**
 * Stats pour le mode location
 */
function renderLocationStats() {
    const stats = {
        total: state.biens.length,
        nouveau: countByEtat('Nouveau'),
        contacte: countByEtat('Contacté'),
        attente: countByEtat('En attente de rappel'),
        visite: countByEtat('Rendez-vous visite')
    };
    
    qs('#totalBiens').textContent = stats.total;
    
    updateStatElement('statVoir', 'badge-status-nouveau', 'Nouveau', stats.nouveau);
    updateStatElement('statVu', 'badge-status-contacte', 'Contacté', stats.contacte);
    updateStatElement('statRetenu', 'badge-status-attente', 'En attente', stats.attente);
    updateStatElement('statRefuse', 'badge-status-visite', 'Visite', stats.visite);
    
    updateStatLabels('Nouveaux', 'Contactés', 'En attente', 'Visites');
}

/**
 * Stats pour le mode achat
 */
function renderAchatStats() {
    const stats = {
        total: state.biens.length,
        voir: countByEtat('À voir'),
        vu: countByEtat('Vu'),
        retenu: countByEtat('Retenu'),
        refuse: countByEtat('Refusé')
    };
    
    qs('#totalBiens').textContent = stats.total;
    qs('#statVoir').textContent = stats.voir;
    qs('#statVu').textContent = stats.vu;
    qs('#statRetenu').textContent = stats.retenu;
    qs('#statRefuse').textContent = stats.refuse;
    
    updateStatLabels('À Voir', 'Vus', 'Retenus', 'Refusés');
}

/**
 * Compte les biens par état
 * @param {string} etat 
 * @returns {number}
 */
function countByEtat(etat) {
    return state.biens.filter(b => b.etat === etat).length;
}

/**
 * Met à jour un élément de stat avec badge (DOM API sécurisé)
 * @param {string} elementId 
 * @param {string} badgeClass 
 * @param {string} badgeText 
 * @param {number} value 
 */
function updateStatElement(elementId, badgeClass, badgeText, value) {
    const element = qs(`#${elementId}`);
    if (!element) return;
    
    element.textContent = '';
    
    const badge = createElement('span', {
        className: `badge ${badgeClass}`,
        text: badgeText
    });
    
    element.appendChild(badge);
    element.appendChild(document.createTextNode(`: ${value}`));
}

/**
 * Met à jour les labels des cartes stats
 */
function updateStatLabels(label1, label2, label3, label4) {
    const labels = [
        { selector: '.stat-card:nth-child(2) .stat-label', text: label1 },
        { selector: '.stat-card:nth-child(3) .stat-label', text: label2 },
        { selector: '.stat-card:nth-child(4) .stat-label', text: label3 },
        { selector: '.stat-card:nth-child(5) .stat-label', text: label4 }
    ];
    
    labels.forEach(({ selector, text }) => {
        const el = qs(selector);
        if (el) el.textContent = text;
    });
}
