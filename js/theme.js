/**
 * Gestion du thème clair/sombre
 */

import { STORAGE_KEYS } from './config.js';
import { qs } from './utils/dom.js';

const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
};

/**
 * Initialise le thème au chargement
 */
export function initTheme() {
    const themeToggle = qs('#themeToggle');
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEME.LIGHT;
    
    if (savedTheme === THEME.DARK) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(THEME.DARK);
    }
    
    themeToggle?.addEventListener('click', toggleTheme);
}

/**
 * Bascule entre thème clair et sombre
 */
export function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const theme = isDark ? THEME.DARK : THEME.LIGHT;
    
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    updateThemeIcon(theme);
    
    // Émettre un événement pour que les graphiques se redessinent
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Met à jour l'icône du bouton thème
 * @param {string} theme 
 */
function updateThemeIcon(theme) {
    const icon = qs('.icon-theme', qs('#themeToggle'));
    if (icon) {
        icon.textContent = theme === THEME.DARK ? '☀️' : '🌙';
    }
}

/**
 * Retourne true si le thème sombre est actif
 * @returns {boolean}
 */
export function isDarkMode() {
    return document.body.classList.contains('dark-mode');
}
