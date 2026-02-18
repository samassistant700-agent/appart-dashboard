/**
 * Graphiques Canvas
 */

import { state } from '../state.js';
import { getDPEColor } from '../utils/format.js';
import { qs } from '../utils/dom.js';
import { isDarkMode } from '../theme.js';

/**
 * Rend tous les graphiques
 */
export function renderCharts() {
    renderQuartierChart();
    renderDPEChart();
}

/**
 * Graphique en barres: répartition par quartier
 */
export function renderQuartierChart() {
    const canvas = qs('#quartierChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const quartierCounts = countByProperty('quartier');
    
    const labels = Object.keys(quartierCounts);
    const values = Object.values(quartierCounts);
    
    drawBarChart(ctx, canvas, labels, values, 'Répartition par Quartier');
}

/**
 * Graphique circulaire: répartition par DPE
 */
export function renderDPEChart() {
    const canvas = qs('#dpeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
    
    state.biens.forEach(b => {
        dpeCounts[b.dpe] = (dpeCounts[b.dpe] || 0) + 1;
    });
    
    const labels = Object.keys(dpeCounts);
    const values = Object.values(dpeCounts);
    const colors = labels.map(dpe => getDPEColor(dpe));
    
    drawPieChart(ctx, canvas, labels, values, colors);
}

/**
 * Compte les biens par propriété
 * @param {string} prop 
 * @returns {Object}
 */
function countByProperty(prop) {
    return state.biens.reduce((acc, b) => {
        acc[b[prop]] = (acc[b[prop]] || 0) + 1;
        return acc;
    }, {});
}

/**
 * Dessine un graphique en barres
 */
function drawBarChart(ctx, canvas, labels, values, title) {
    const isDark = isDarkMode();
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const barWidth = (width - padding * 2) / labels.length * 0.7;
    const maxValue = Math.max(...values);
    
    ctx.clearRect(0, 0, width, height);
    
    labels.forEach((label, i) => {
        const x = padding + i * ((width - padding * 2) / labels.length);
        const barHeight = maxValue > 0 ? (values[i] / maxValue) * (height - padding * 2) : 0;
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

/**
 * Dessine un graphique circulaire
 */
function drawPieChart(ctx, canvas, labels, values, colors) {
    const isDark = isDarkMode();
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
