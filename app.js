// ===== GLOBALES =====
let biens = [];
let filteredBiens = [];
let editingId = null;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Charger les données
    biens = loadData();
    filteredBiens = [...biens];
    
    // Initialiser l'application
    initTheme();
    populateQuartierFilter();
    renderTable();
    renderStats();
    renderCharts();
    initEventListeners();
});

// ===== THÈME =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('.icon-theme').textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.querySelector('.icon-theme').textContent = isDark ? '☀️' : '🌙';
        renderCharts(); // Redessiner les graphiques avec les nouvelles couleurs
    });
}

// ===== EVENEMENTS =====
function initEventListeners() {
    // Bouton ajouter
    document.getElementById('addBtn').addEventListener('click', () => openModal());
    
    // Modal ajouter/modifier
    document.getElementById('modalClose').addEventListener('click', () => closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => closeModal());
    document.getElementById('bienForm').addEventListener('submit', handleFormSubmit);
    
    // Modal vue détails
    document.getElementById('viewClose').addEventListener('click', () => closeViewModal());
    
    // Filtres
    const filterInputs = ['prixMin', 'prixMax', 'surfaceMin', 'surfaceMax', 'piecesFilter', 'quartierFilter'];
    filterInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
        document.getElementById(id).addEventListener('change', applyFilters);
    });
    
    // Checkboxes DPE et État
    document.querySelectorAll('#dpeFilter input').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    document.querySelectorAll('#etatFilter input').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Bouton effacer filtres
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Export CSV
    document.getElementById('exportBtn').addEventListener('click', exportCSV);
    
    // Fermer modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// ===== FILTRES =====
function populateQuartierFilter() {
    const quartiers = [...new Set(biens.map(b => b.quartier))].sort();
    const select = document.getElementById('quartierFilter');
    
    select.innerHTML = '<option value="">Tous</option>';
    quartiers.forEach(q => {
        const option = document.createElement('option');
        option.value = q;
        option.textContent = q;
        select.appendChild(option);
    });
}

function applyFilters() {
    const prixMin = parseFloat(document.getElementById('prixMin').value) || 0;
    const prixMax = parseFloat(document.getElementById('prixMax').value) || Infinity;
    const surfaceMin = parseFloat(document.getElementById('surfaceMin').value) || 0;
    const surfaceMax = parseFloat(document.getElementById('surfaceMax').value) || Infinity;
    const pieces = document.getElementById('piecesFilter').value;
    const quartier = document.getElementById('quartierFilter').value;
    
    // DPE checkboxes
    const dpeChecked = Array.from(document.querySelectorAll('#dpeFilter input:checked')).map(cb => cb.value);
    
    // État checkboxes
    const etatChecked = Array.from(document.querySelectorAll('#etatFilter input:checked')).map(cb => cb.value);
    
    filteredBiens = biens.filter(bien => {
        // Prix
        if (bien.prix < prixMin || bien.prix > prixMax) return false;
        
        // Surface
        if (bien.surface < surfaceMin || bien.surface > surfaceMax) return false;
        
        // Pièces
        if (pieces && bien.pieces !== parseInt(pieces)) return false;
        
        // Quartier
        if (quartier && bien.quartier !== quartier) return false;
        
        // DPE
        if (dpeChecked.length > 0 && !dpeChecked.includes(bien.dpe)) return false;
        
        // État
        if (etatChecked.length > 0 && !etatChecked.includes(bien.etat)) return false;
        
        return true;
    });
    
    renderTable();
}

function clearFilters() {
    document.getElementById('prixMin').value = '';
    document.getElementById('prixMax').value = '';
    document.getElementById('surfaceMin').value = '';
    document.getElementById('surfaceMax').value = '';
    document.getElementById('piecesFilter').value = '';
    document.getElementById('quartierFilter').value = '';
    
    document.querySelectorAll('#dpeFilter input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#etatFilter input').forEach(cb => cb.checked = false);
    
    filteredBiens = [...biens];
    renderTable();
}

// ===== TABLEAU =====
function renderTable() {
    const tbody = document.getElementById('biensTableBody');
    const noResults = document.getElementById('noResults');
    
    if (filteredBiens.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    tbody.innerHTML = filteredBiens.map(bien => {
        const prixM2 = Math.round(bien.prix / bien.surface);
        const statusClass = getStatusClass(bien.etat);
        const dpeClass = `badge-dpe-${bien.dpe.toLowerCase()}`;
        const equipmentIcons = getEquipmentIcons(bien);
        
        return `
            <tr>
                <td><strong>${escapeHtml(bien.quartier)}</strong></td>
                <td>${escapeHtml(bien.type)}</td>
                <td><strong>${formatPrice(bien.prix)}</strong></td>
                <td>${bien.surface} m²</td>
                <td>${bien.pieces}</td>
                <td><strong>${prixM2} €/m²</strong></td>
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
    }).join('');
}

function getStatusClass(etat) {
    switch (etat) {
        case 'À voir': return 'badge-status-voir';
        case 'Vu': return 'badge-status-vu';
        case 'Retenu': return 'badge-status-retenu';
        case 'Refusé': return 'badge-status-refuse';
        default: return '';
    }
}

function getEquipmentIcons(bien) {
    const icons = [];
    
    if (bien.parking) icons.push('<span class="equipment-icon" title="Parking">🚗</span>');
    if (bien.cave) icons.push('<span class="equipment-icon" title="Cave">📦</span>');
    if (bien.terrasse) icons.push('<span class="equipment-icon" title="Terrasse">🌿</span>');
    if (bien.clim) icons.push('<span class="equipment-icon" title="Climatisation">❄️</span>');
    if (bien.ascenseur) icons.push('<span class="equipment-icon" title="Ascenseur">🛗</span>');
    if (bien.balcon) icons.push('<span class="equipment-icon" title="Balcon">🌸</span>');
    
    return icons.join('');
}

// ===== STATS =====
function renderStats() {
    const stats = {
        total: biens.length,
        voir: biens.filter(b => b.etat === 'À voir').length,
        vu: biens.filter(b => b.etat === 'Vu').length,
        retenu: biens.filter(b => b.etat === 'Retenu').length,
        refuse: biens.filter(b => b.etat === 'Refusé').length
    };
    
    document.getElementById('totalBiens').textContent = stats.total;
    document.getElementById('statVoir').textContent = stats.voir;
    document.getElementById('statVu').textContent = stats.vu;
    document.getElementById('statRetenu').textContent = stats.retenu;
    document.getElementById('statRefuse').textContent = stats.refuse;
}

// ===== GRAPHIQUES (Canvas simple) =====
function renderCharts() {
    renderQuartierChart();
    renderDPEChart();
}

function renderQuartierChart() {
    const canvas = document.getElementById('quartierChart');
    const ctx = canvas.getContext('2d');
    
    // Compter par quartier
    const quartierCounts = {};
    biens.forEach(b => {
        quartierCounts[b.quartier] = (quartierCounts[b.quartier] || 0) + 1;
    });
    
    const labels = Object.keys(quartierCounts);
    const values = Object.values(quartierCounts);
    
    // Dessiner le graphique
    drawBarChart(ctx, canvas, labels, values, 'Répartition par Quartier');
}

function renderDPEChart() {
    const canvas = document.getElementById('dpeChart');
    const ctx = canvas.getContext('2d');
    
    // Compter par DPE
    const dpeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
    biens.forEach(b => {
        dpeCounts[b.dpe] = (dpeCounts[b.dpe] || 0) + 1;
    });
    
    const labels = Object.keys(dpeCounts);
    const values = Object.values(dpeCounts);
    const colors = labels.map(dpe => getDPEColor(dpe));
    
    // Dessiner le graphique
    drawPieChart(ctx, canvas, labels, values, colors);
}

function getDPEColor(dpe) {
    const colors = {
        'A': '#22c55e',
        'B': '#84cc16',
        'C': '#eab308',
        'D': '#f97316',
        'E': '#ef4444',
        'F': '#dc2626',
        'G': '#991b1b'
    };
    return colors[dpe] || '#64748b';
}

function drawBarChart(ctx, canvas, labels, values, title) {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const barWidth = (width - padding * 2) / labels.length * 0.7;
    const maxValue = Math.max(...values);
    
    ctx.clearRect(0, 0, width, height);
    
    // Dessiner les barres
    labels.forEach((label, i) => {
        const x = padding + i * ((width - padding * 2) / labels.length);
        const barHeight = (values[i] / maxValue) * (height - padding * 2);
        const y = height - padding - barHeight;
        
        // Barre
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Label
        ctx.fillStyle = textColor;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + barWidth / 2, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(label.substring(0, 10), 0, 0);
        ctx.restore();
        
        // Valeur
        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(values[i], x + barWidth / 2, y - 5);
    });
}

function drawPieChart(ctx, canvas, labels, values, colors) {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2 - 40;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    const total = values.reduce((a, b) => a + b, 0);
    let startAngle = -Math.PI / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    // Dessiner les segments
    values.forEach((value, i) => {
        if (value === 0) return;
        
        const sliceAngle = (value / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Label si segment assez grand
        if (sliceAngle > 0.2) {
            const midAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], labelX, labelY);
            ctx.font = '10px sans-serif';
            ctx.fillText(`(${value})`, labelX, labelY + 12);
        }
        
        startAngle = endAngle;
    });
}

// ===== MODAL AJOUT/MODIFICATION =====
function openModal(bien = null) {
    const modal = document.getElementById('bienModal');
    const form = document.getElementById('bienForm');
    const title = document.getElementById('modalTitle');
    
    form.reset();
    
    if (bien) {
        editingId = bien.id;
        title.textContent = '✏️ Modifier le Bien';
        
        // Remplir le formulaire
        document.getElementById('quartier').value = bien.quartier;
        document.getElementById('type').value = bien.type;
        document.getElementById('prix').value = bien.prix;
        document.getElementById('surface').value = bien.surface;
        document.getElementById('pieces').value = bien.pieces;
        document.getElementById('dpe').value = bien.dpe;
        document.getElementById('chauffage').value = bien.chauffage || '';
        document.getElementById('charges').value = bien.charges || '';
        document.getElementById('etat').value = bien.etat;
        document.getElementById('parking').checked = bien.parking;
        document.getElementById('cave').checked = bien.cave;
        document.getElementById('terrasse').checked = bien.terrasse;
        document.getElementById('clim').checked = bien.clim;
        document.getElementById('ascenseur').checked = bien.ascenseur || false;
        document.getElementById('balcon').checked = bien.balcon || false;
        document.getElementById('datePublication').value = bien.datePublication || '';
        document.getElementById('dateContact').value = bien.dateContact || '';
        document.getElementById('dateVisite').value = bien.dateVisite || '';
        document.getElementById('contact').value = bien.contact || '';
        document.getElementById('tel').value = bien.tel || '';
        document.getElementById('siteWeb').value = bien.siteWeb || '';
        document.getElementById('adresse').value = bien.adresse || '';
        document.getElementById('notes').value = bien.notes || '';
    } else {
        editingId = null;
        title.textContent = '➕ Nouveau Bien';
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('bienModal').classList.remove('active');
    editingId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const bien = {
        id: editingId || Date.now(),
        quartier: document.getElementById('quartier').value,
        type: document.getElementById('type').value,
        prix: parseFloat(document.getElementById('prix').value),
        surface: parseFloat(document.getElementById('surface').value),
        pieces: parseInt(document.getElementById('pieces').value),
        dpe: document.getElementById('dpe').value,
        chauffage: document.getElementById('chauffage').value,
        charges: parseFloat(document.getElementById('charges').value) || 0,
        parking: document.getElementById('parking').checked,
        cave: document.getElementById('cave').checked,
        terrasse: document.getElementById('terrasse').checked,
        clim: document.getElementById('clim').checked,
        ascenseur: document.getElementById('ascenseur').checked,
        balcon: document.getElementById('balcon').checked,
        etat: document.getElementById('etat').value,
        datePublication: document.getElementById('datePublication').value,
        dateContact: document.getElementById('dateContact').value,
        dateVisite: document.getElementById('dateVisite').value,
        contact: document.getElementById('contact').value,
        tel: document.getElementById('tel').value,
        siteWeb: document.getElementById('siteWeb').value,
        adresse: document.getElementById('adresse').value,
        notes: document.getElementById('notes').value
    };
    
    if (editingId) {
        // Modifier
        const index = biens.findIndex(b => b.id === editingId);
        if (index !== -1) {
            biens[index] = bien;
        }
    } else {
        // Ajouter
        biens.push(bien);
    }
    
    // Sauvegarder
    saveData(biens);
    
    // Mettre à jour l'affichage
    filteredBiens = [...biens];
    populateQuartierFilter();
    renderTable();
    renderStats();
    renderCharts();
    
    closeModal();
}

// ===== MODAL VUE DÉTAILS =====
function viewBien(id) {
    const bien = biens.find(b => b.id === id);
    if (!bien) return;
    
    const modal = document.getElementById('viewModal');
    const content = document.getElementById('viewContent');
    const prixM2 = Math.round(bien.prix / bien.surface);
    
    content.innerHTML = `
        <div class="detail-section">
            <h4>📍 Informations Générales</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Quartier</span>
                    <span class="detail-value">${escapeHtml(bien.quartier)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">${escapeHtml(bien.type)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prix</span>
                    <span class="detail-value"><strong>${formatPrice(bien.prix)}</strong></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Surface</span>
                    <span class="detail-value">${bien.surface} m²</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pièces</span>
                    <span class="detail-value">${bien.pieces}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prix/m²</span>
                    <span class="detail-value"><strong>${prixM2} €/m²</strong></span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🔧 Détails Techniques</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">DPE</span>
                    <span class="detail-value"><span class="badge badge-dpe badge-dpe-${bien.dpe.toLowerCase()}">${bien.dpe}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Chauffage</span>
                    <span class="detail-value">${escapeHtml(bien.chauffage || 'Non spécifié')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Charges annuelles</span>
                    <span class="detail-value">${bien.charges ? formatPrice(bien.charges) : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">État</span>
                    <span class="detail-value"><span class="badge ${getStatusClass(bien.etat)}">${bien.etat}</span></span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🚗 Équipements</h4>
            <div class="detail-value">
                ${bien.parking ? '✅ Parking<br>' : '❌ Parking<br>'}
                ${bien.cave ? '✅ Cave<br>' : '❌ Cave<br>'}
                ${bien.terrasse ? '✅ Terrasse<br>' : '❌ Terrasse<br>'}
                ${bien.clim ? '✅ Climatisation<br>' : '❌ Climatisation<br>'}
                ${bien.ascenseur ? '✅ Ascenseur<br>' : '❌ Ascenseur<br>'}
                ${bien.balcon ? '✅ Balcon' : '❌ Balcon'}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📅 Dates & Contact</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Date publication</span>
                    <span class="detail-value">${bien.datePublication || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date contact</span>
                    <span class="detail-value">${bien.dateContact || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date visite</span>
                    <span class="detail-value">${bien.dateVisite || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Contact</span>
                    <span class="detail-value">${escapeHtml(bien.contact || 'N/A')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Téléphone</span>
                    <span class="detail-value">${escapeHtml(bien.tel || 'N/A')}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📝 Adresse & Notes</h4>
            <div class="detail-item" style="margin-bottom: 12px;">
                <span class="detail-label">Adresse</span>
                <span class="detail-value">${escapeHtml(bien.adresse || 'Non renseignée')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Notes</span>
                <div class="detail-notes">${escapeHtml(bien.notes || 'Aucune note')}</div>
            </div>
        </div>
        
        ${bien.siteWeb ? `
        <div class="detail-section">
            <h4>🔗 Lien</h4>
            <a href="${escapeHtml(bien.siteWeb)}" target="_blank" class="btn btn-secondary btn-sm">Voir l'annonce</a>
        </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
}

// ===== ACTIONS =====
function editBien(id) {
    const bien = biens.find(b => b.id === id);
    if (bien) {
        openModal(bien);
    }
}

function deleteBien(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
        biens = biens.filter(b => b.id !== id);
        filteredBiens = filteredBiens.filter(b => b.id !== id);
        
        saveData(biens);
        populateQuartierFilter();
        renderTable();
        renderStats();
        renderCharts();
    }
}

// ===== EXPORT CSV =====
function exportCSV() {
    if (biens.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const headers = [
        'Quartier',
        'Type',
        'Prix',
        'Surface',
        'Pièces',
        'DPE',
        'Chauffage',
        'Charges',
        'Parking',
        'Cave',
        'Terrasse',
        'Clim',
        'Ascenseur',
        'Balcon',
        'État',
        'Date Publication',
        'Date Contact',
        'Date Visite',
        'Contact',
        'Téléphone',
        'Adresse',
        'Site Web',
        'Notes'
    ];
    
    const rows = biens.map(bien => [
        bien.quartier,
        bien.type,
        bien.prix,
        bien.surface,
        bien.pieces,
        bien.dpe,
        bien.chauffage || '',
        bien.charges || '',
        bien.parking ? 'Oui' : 'Non',
        bien.cave ? 'Oui' : 'Non',
        bien.terrasse ? 'Oui' : 'Non',
        bien.clim ? 'Oui' : 'Non',
        bien.ascenseur ? 'Oui' : 'Non',
        bien.balcon ? 'Oui' : 'Non',
        bien.etat,
        bien.datePublication || '',
        bien.dateContact || '',
        bien.dateVisite || '',
        bien.contact || '',
        bien.tel || '',
        bien.adresse || '',
        bien.siteWeb || '',
        bien.notes || ''
    ]);
    
    let csvContent = headers.join(';') + '\n';
    csvContent += rows.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `appartements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== UTILITAIRES =====
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0 
    }).format(price);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
