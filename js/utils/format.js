/**
 * Utilitaires de formatage
 */

import { CONFIG } from '../config.js';

/**
 * Formate un prix en euros
 * @param {number} price 
 * @returns {string}
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0 
    }).format(price);
}

/**
 * Échappe le HTML pour éviter les injections XSS
 * @param {string} text 
 * @returns {string}
 */
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Retourne la classe CSS pour un état donné
 * @param {string} etat 
 * @returns {string}
 */
export function getStatusClass(etat) {
    const statusMap = {
        // Location states
        'Nouveau': 'badge-status-nouveau',
        'Contacté': 'badge-status-contacte',
        'En attente de rappel': 'badge-status-attente',
        'Rendez-vous visite': 'badge-status-visite',
        'Il faut appeler': 'badge-status-appeler',
        'Refusé': 'badge-status-refuse',
        // Achat states (legacy)
        'À voir': 'badge-status-voir',
        'Vu': 'badge-status-vu',
        'Retenu': 'badge-status-retenu'
    };
    return statusMap[etat] || '';
}

/**
 * Retourne la couleur pour un DPE donné
 * @param {string} dpe 
 * @returns {string}
 */
export function getDPEColor(dpe) {
    return CONFIG.DPE_COLORS[dpe] || '#64748b';
}
