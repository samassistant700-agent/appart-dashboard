/**
 * État global de l'application
 * Pattern: Module state avec getters/setters
 */

import { CONFIG, STORAGE_KEYS } from '../config.js';

// État privé
const _state = {
    biens: [],
    filteredBiens: [],
    editingId: null,
    currentMode: localStorage.getItem(STORAGE_KEYS.CURRENT_MODE) || CONFIG.MODES.ACHAT,
    displayChargesMode: CONFIG.CHARGES_MODES.MENSUELLES,
    sortColumn: null,
    sortDirection: 'asc'
};

// Getters
export const state = {
    get biens() { return _state.biens; },
    get filteredBiens() { return _state.filteredBiens; },
    get editingId() { return _state.editingId; },
    get currentMode() { return _state.currentMode; },
    get displayChargesMode() { return _state.displayChargesMode; },
    get sortColumn() { return _state.sortColumn; },
    get sortDirection() { return _state.sortDirection; },
    get isLocation() { return _state.currentMode === CONFIG.MODES.LOCATION; }
};

// Setters avec side effects si nécessaire
export function setBiens(biens) {
    _state.biens = biens;
    _state.filteredBiens = [...biens];
}

export function setFilteredBiens(biens) {
    _state.filteredBiens = biens;
}

export function setEditingId(id) {
    _state.editingId = id;
}

export function setMode(mode) {
    if (!Object.values(CONFIG.MODES).includes(mode)) {
        throw new Error(`Mode invalide: ${mode}`);
    }
    _state.currentMode = mode;
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODE, mode);
}

export function setChargesMode(mode) {
    _state.displayChargesMode = mode;
}

export function setSort(column, direction) {
    _state.sortColumn = column;
    _state.sortDirection = direction;
}

export function resetSort() {
    _state.sortColumn = null;
    _state.sortDirection = 'asc';
}

export function addBien(bien) {
    _state.biens.push(bien);
    _state.filteredBiens = [..._state.biens];
}

export function updateBien(updatedBien) {
    const index = _state.biens.findIndex(b => b.id === updatedBien.id);
    if (index !== -1) {
        _state.biens[index] = updatedBien;
        _state.filteredBiens = [..._state.biens];
    }
}

export function deleteBien(id) {
    _state.biens = _state.biens.filter(b => b.id !== id);
    _state.filteredBiens = _state.filteredBiens.filter(b => b.id !== id);
}
