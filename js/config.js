/**
 * Configuration et constantes de l'application
 */

export const CONFIG = {
    // Modes de fonctionnement
    MODES: {
        ACHAT: 'achat',
        LOCATION: 'location'
    },
    
    // Modes d'affichage des charges
    CHARGES_MODES: {
        MENSUELLES: 'mensuelles',
        ANNUELLES: 'annuelles'
    },
    
    // États pour le mode location
    LOCATION_STATES: [
        { value: 'Nouveau', label: 'Nouveau', class: 'status-nouveau' },
        { value: 'Contacté', label: 'Contacté', class: 'status-contacte' },
        { value: 'En attente de rappel', label: 'En attente', class: 'status-attente' },
        { value: 'Rendez-vous visite', label: 'Visite', class: 'status-visite' },
        { value: 'Il faut appeler', label: 'À appeler', class: 'status-appeler' },
        { value: 'Refusé', label: 'Refusé', class: 'status-refuse' }
    ],
    
    // États pour le mode achat
    ACHAT_STATES: [
        { value: 'À voir', label: 'À voir' },
        { value: 'Vu', label: 'Vu' },
        { value: 'Retenu', label: 'Retenu' },
        { value: 'Refusé', label: 'Refusé' }
    ],
    
    // Couleurs DPE
    DPE_COLORS: {
        A: '#22c55e',
        B: '#84cc16',
        C: '#eab308',
        D: '#f97316',
        E: '#ef4444',
        F: '#dc2626',
        G: '#991b1b'
    }
};

// Clés localStorage
export const STORAGE_KEYS = {
    THEME: 'theme',
    CURRENT_MODE: 'currentMode',
    BIENS_ACHAT: 'appartements_achat',
    BIENS_LOCATION: 'appartements_location'
};
