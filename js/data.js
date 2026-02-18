/**
 * Persistence des données (localStorage)
 * Importe les données de sample si localStorage vide
 */

import { CONFIG, STORAGE_KEYS } from './config.js';

// Données de test pour le mode achat
const sampleDataAchat = [
    {
        id: 1,
        quartier: "Centre-ville",
        type: "T2",
        prix: 125000,
        surface: 45,
        pieces: 2,
        dpe: "D",
        chauffage: "Électrique",
        charges: 1200,
        parking: true,
        cave: true,
        terrasse: false,
        clim: false,
        ascenseur: true,
        balcon: false,
        etat: "À voir",
        datePublication: "2024-01-15",
        contact: "Agence Immo Sud",
        tel: "04 67 00 00 00"
    },
    {
        id: 2,
        quartier: "Antigone",
        type: "T3",
        prix: 185000,
        surface: 65,
        pieces: 3,
        dpe: "C",
        chauffage: "Gaz",
        charges: 1500,
        parking: false,
        cave: true,
        terrasse: true,
        clim: false,
        ascenseur: true,
        balcon: false,
        etat: "Vu",
        datePublication: "2024-01-10",
        contact: "Propriétaire",
        tel: "06 12 34 56 78"
    },
    {
        id: 3,
        quartier: "Comédie",
        type: "T2",
        prix: 165000,
        surface: 50,
        pieces: 2,
        dpe: "E",
        chauffage: "Électrique",
        charges: 900,
        parking: false,
        cave: false,
        terrasse: false,
        clim: false,
        ascenseur: false,
        balcon: true,
        etat: "Retenu",
        datePublication: "2024-01-12",
        contact: "Agence Centre",
        tel: "04 67 11 11 11"
    },
    {
        id: 4,
        quartier: "Ecusson",
        type: "Studio",
        prix: 95000,
        surface: 25,
        pieces: 1,
        dpe: "F",
        chauffage: "Électrique",
        charges: 600,
        parking: false,
        cave: false,
        terrasse: false,
        clim: false,
        ascenseur: false,
        balcon: false,
        etat: "Refusé",
        datePublication: "2024-01-08",
        contact: "Agence Vieux",
        tel: "04 67 22 22 22"
    },
    {
        id: 5,
        quartier: "Port Marianne",
        type: "T4",
        prix: 245000,
        surface: 85,
        pieces: 4,
        dpe: "B",
        chauffage: "Pompe à chaleur",
        charges: 1800,
        parking: true,
        cave: true,
        terrasse: true,
        clim: true,
        ascenseur: true,
        balcon: false,
        etat: "À voir",
        datePublication: "2024-01-18",
        contact: "Promoteur Neuf",
        tel: "04 67 33 33 33"
    },
    {
        id: 6,
        quartier: "Coursan",
        type: "Duplex",
        prix: 195000,
        surface: 75,
        pieces: 4,
        dpe: "C",
        chauffage: "Bois",
        charges: 800,
        parking: true,
        cave: true,
        terrasse: false,
        clim: false,
        ascenseur: false,
        balcon: false,
        etat: "Vu",
        datePublication: "2024-01-14",
        contact: "Propriétaire",
        tel: "06 98 76 54 32"
    },
    {
        id: 7,
        quartier: "Beaux-Arts",
        type: "T3",
        prix: 210000,
        surface: 60,
        pieces: 3,
        dpe: "D",
        chauffage: "Gaz",
        charges: 1400,
        parking: false,
        cave: true,
        terrasse: false,
        clim: false,
        ascenseur: true,
        balcon: true,
        etat: "Retenu",
        datePublication: "2024-01-16",
        contact: "Agence Artistes",
        tel: "04 67 44 44 44"
    },
    {
        id: 8,
        quartier: "Polygone",
        type: "T2",
        prix: 140000,
        surface: 48,
        pieces: 2,
        dpe: "E",
        chauffage: "Électrique",
        charges: 1100,
        parking: false,
        cave: false,
        terrasse: false,
        clim: false,
        ascenseur: true,
        balcon: false,
        etat: "Refusé",
        datePublication: "2024-01-11",
        contact: "Agence Commerciale",
        tel: "04 67 55 55 55"
    }
];

// Données réelles pour le mode location (chargées dynamiquement depuis data-sample.js si besoin)
// Pour l'instant on laisse vide et on charge depuis localStorage

/**
 * Charge les données selon le mode
 * @param {string} mode 
 * @returns {Array}
 */
export function loadData(mode = CONFIG.MODES.ACHAT) {
    const key = mode === CONFIG.MODES.LOCATION 
        ? STORAGE_KEYS.BIENS_LOCATION 
        : STORAGE_KEYS.BIENS_ACHAT;
    
    const stored = localStorage.getItem(key);
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Initialiser avec les données de test si vide
    if (mode === CONFIG.MODES.ACHAT) {
        localStorage.setItem(key, JSON.stringify(sampleDataAchat));
        return sampleDataAchat;
    }
    
    return [];
}

/**
 * Sauvegarde les données selon le mode
 * @param {Array} biens 
 * @param {string} mode 
 */
export function saveData(biens, mode = CONFIG.MODES.ACHAT) {
    const key = mode === CONFIG.MODES.LOCATION 
        ? STORAGE_KEYS.BIENS_LOCATION 
        : STORAGE_KEYS.BIENS_ACHAT;
    
    localStorage.setItem(key, JSON.stringify(biens));
}

/**
 * Exporte les données en CSV
 * @param {Array} biens 
 * @param {string} mode 
 */
export function exportCSV(biens, mode = CONFIG.MODES.ACHAT) {
    if (biens.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const isLocation = mode === CONFIG.MODES.LOCATION;
    
    const headers = [
        'Quartier', 'Type',
        isLocation ? 'Loyer' : 'Prix',
        'Surface', 'Meublé', 'Nb Pièces', 'DPE', 'Chauffage',
        'Charges mensuelles', 'Charges annuelles',
        ...(isLocation ? ['Dépôt de garantie'] : []),
        'Parking', 'Cave', 'Terrasse', 'Clim', 'Ascenseur', 'Balcon',
        'État', 'Date Publication', 'Date Contact', 'Date Visite',
        'Contact', 'Téléphone', 'Adresse', 'Site Web', 'Notes'
    ];
    
    const rows = biens.map(bien => [
        bien.quartier, bien.type,
        isLocation ? (bien.loyer || '') : (bien.prix || ''),
        bien.surface,
        bien.meublé ? 'Oui' : 'Non',
        bien.pieces, bien.dpe, bien.chauffage || '',
        bien.charges || '',
        bien.charges_annuelles || (bien.charges ? bien.charges * 12 : ''),
        ...(isLocation ? [bien.depotGarantie || ''] : []),
        bien.parking ? 'Oui' : 'Non',
        bien.cave ? 'Oui' : 'Non',
        bien.terrasse ? 'Oui' : 'Non',
        bien.clim ? 'Oui' : 'Non',
        bien.ascenseur ? 'Oui' : 'Non',
        bien.balcon ? 'Oui' : 'Non',
        bien.etat,
        bien.datePublication || '', bien.dateContact || '', bien.dateVisite || '',
        bien.contact || '', bien.tel || '', bien.adresse || '',
        bien.siteWeb || '', bien.notes || ''
    ]);
    
    let csvContent = headers.join(';') + '\n';
    csvContent += rows.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `appartements_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
