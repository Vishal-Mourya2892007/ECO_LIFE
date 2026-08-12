document.addEventListener('DOMContentLoaded', () => {

    const carbonState = {
        user: { name: "Vishal", initials: "VM", pointsToday: 0 },
        metrics: {
            thisMonth: { value: 0.0 },
            annualPace: { value: 0.0 },
            vsNationalAvg: { value: 0.0 }
        },
        goal: { current: 0.0, target: 2.0 },
        trend: {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            userData: [0, 0, 0, 0, 0, 0, 0],
            nationalAvgData: [5.6, 5.6, 5.6, 5.6, 4.8, 5.2, 5.0]
        },
        sources: [
            { id: "car", name: "Car travel", value: 0.00, percentage: 0, color: "#16a34a" },
            { id: "flight", name: "Flights", value: 0.00, percentage: 0, color: "#d97706" },
            { id: "elec", name: "Electricity", value: 0.00, percentage: 0, color: "#0d9488" },
            { id: "gas", name: "Gas heating", value: 0.00, percentage: 0, color: "#dc2626" },
            { id: "diet", name: "Diet", value: 0.00, percentage: 0, color: "#9333ea" },
            { id: "shop", name: "Shopping", value: 0.00, percentage: 0, color: "#2563eb" }
        ]
    };

    let trendChartInstance = null;
    let donutChartInstance = null;

    function renderAll() {
        document.getElementById('header-points').innerText = carbonState.user.pointsToday;

        const totalTonnes = carbonState.metrics.thisMonth.value;
        document.getElementById('val-this-month').innerText = totalTonnes.toFixed(1);
        document.getElementById('val-annual-pace').innerText = (totalTonnes * 12).toFixed(1);
        
        const vsAvg = totalTonnes === 0 ? 0.0 : totalTonnes - 5.0;
        document.getElementById('val-vs-avg').innerText = (vsAvg > 0 ? "+" : "") + vsAvg.toFixed(1);

        const target = carbonState.goal.target;
        document.getElementById('goal-current').innerText = `${totalTonnes.toFixed(1)} t`;
        document.getElementById('goal-target').innerText = `${target} t`;
        
        const pct = target > 0 ? Math.min(Math.round((totalTonnes / target) * 100), 100) : 0;
        document.getElementById('goal-progress-fill').style.width = `${pct}%`;

        // Detailed Cards Grid (All 6 original categories)
        document.getElementById('detailed-cards-container').innerHTML = carbonState.sources.map(src => `
            <div class="source-card">
                <div class="source-card-header">
                    <span>${src.name}</span>
                </div>
                <div class="source-val">${src.value.toFixed(2)} <small style="font-size:12px; color:#64748b;">t</small></div>
                <div class="source-bar-track">
                    <div class="source-bar-fill" style="width: ${src.percentage}%; background-color: ${src.color};"></div>
                </div>
                <div class="source-sub">${src.percentage}% of total</div>
            </div>
        `).join('');

        // Donut Legends
        document.getElementById('source-legend-container').innerHTML = carbonState.sources.map(src => `
            <div class="legend-bar-item">
                <div class="legend-info">
                    <span class="legend-color-label">
                        <span class="legend-dot-sq" style="background-color: ${src.color};"></span>
                        ${src.name}
                    </span>
                    <strong>${src.percentage}%</strong>
                </div>
                <div class="legend-bg-track">
                    <div class="legend-fill-track" style="width: ${src.percentage}%; background-color: ${src.color};"></div>
                </div>
            </div>
        `).join('');

        renderCharts();
    }

    // Modal Control Events
    const modalOverlay = document.getElementById('calc-modal-overlay');
    const openModalBtn = document.getElementById('open-calc-modal-btn');
    const closeModalBtn = document.getElementById('close-calc-modal-btn');

    if (openModalBtn) openModalBtn.addEventListener('click', () => modalOverlay.style.display = 'flex');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modalOverlay.style.display = 'none');

    let selectedTransportMode = 'car';
    document.querySelectorAll('.transport-opt-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.transport-opt-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedTransportMode = card.getAttribute('data-transport');
        });
    });

    // Save & Calculate from Modal
    const modalSaveBtn = document.getElementById('modal-save-btn');
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            const dist = parseFloat(document.getElementById('modal-dist').value) || 0;
            const days = parseInt(document.getElementById('modal-days').value) || 5;
            const kwh = parseFloat(document.getElementById('modal-kwh').value) || 0;
            const gas = parseFloat(document.getElementById('modal-gas').value) || 0;
            const flightsHrs = parseFloat(document.getElementById('modal-flights').value) || 0;
            const shop = parseFloat(document.getElementById('modal-shop').value) || 0;
            const dietType = document.getElementById('modal-diet').value;

            // Emission calculation rules (Bicycle/Walk have 0 emission)
            let transFactor = 0.21;
            if (selectedTransportMode === 'bicycle' || selectedTransportMode === 'walk') {
                transFactor = 0.0;
            } else if (selectedTransportMode === 'bus') {
                transFactor = 0.08;
            } else if (selectedTransportMode === 'train') {
                transFactor = 0.04;
            }

            let carTonnes = (dist * days * 4.3 * transFactor) / 1000;
            let flightTonnes = (flightsHrs * 90) / 1000;
            let elecTonnes = (kwh * 0.82) / 1000;
            let gasTonnes = (gas * 2.98) / 1000;
            let dietTonnes = dietType === 'omnivore' ? 0.44 : (dietType === 'vegetarian' ? 0.25 : 0.35);
            let shopTonnes = (shop * 15) / 1000;

            carbonState.sources.find(s => s.id === 'car').value = carTonnes;
            carbonState.sources.find(s => s.id === 'flight').value = flightTonnes;
            carbonState.sources.find(s => s.id === 'elec').value = elecTonnes;
            carbonState.sources.find(s => s.id === 'gas').value = gasTonnes;
            carbonState.sources.find(s => s.id === 'diet').value = dietTonnes;
            carbonState.sources.find(s => s.id === 'shop').value = shopTonnes;

            let totalTonnes = carTonnes + flightTonnes + elecTonnes + gasTonnes + dietTonnes + shopTonnes;
            carbonState.metrics.thisMonth.value = totalTonnes;
            carbonState.goal.current = totalTonnes;
            carbonState.trend.userData[6] = totalTonnes;

            if (totalTonnes > 0) {
                carbonState.sources.forEach(s => {
                    s.percentage = Math.round((s.value / totalTonnes) * 100);
                });
            }

            carbonState.user.pointsToday += 33;
            modalOverlay.style.display = 'none';
            renderAll();
        });
    }

    function renderCharts() {
        const ctxTrend = document.getElementById('carbonTrendChart');
        if (ctxTrend) {
            if (trendChartInstance) trendChartInstance.destroy();
            
            trendChartInstance = new Chart(ctxTrend, {
                type: 'line',
                data: {
                    labels: carbonState.trend.labels,
                    datasets: [
                        { label: 'You', data: carbonState.trend.userData, borderColor: '#16a34a', borderWidth: 2, fill: true, backgroundColor: 'rgba(22, 163, 74, 0.05)', tension: 0.3 },
                        { label: 'Avg', data: carbonState.trend.nationalAvgData, borderColor: '#cbd5e1', borderDash: [4, 4], fill: false, tension: 0 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                            backgroundColor: '#ffffff',
                            titleColor: '#0f172a',
                            bodyColor: '#0f172a',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                title: function(context) {
                                    return context[0].label;
                                },
                                label: function(context) {
                                    let labelName = context.dataset.label === 'You' ? 'You' : 'Avg';
                                    return `${labelName}: ${context.parsed.y} t`;
                                }
                            }
                        }
                    },
                    scales: { y: { min: 0, max: 8 } }
                }
            });
        }

        const ctxDonut = document.getElementById('carbonDonutChart');
        if (ctxDonut) {
            if (donutChartInstance) donutChartInstance.destroy();
            let hasData = carbonState.sources.some(s => s.value > 0);
            donutChartInstance = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: carbonState.sources.map(s => s.name),
                    datasets: [{ data: hasData ? carbonState.sources.map(s => s.value) : [100], backgroundColor: hasData ? carbonState.sources.map(s => s.color) : ['#e2e8f0'] }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
            });
        }
    }

    renderAll();
});

function switchModalStep(stepNum) {
    document.querySelectorAll('.wizard-step-pane').forEach(pane => pane.style.display = 'none');
    document.getElementById(`modal-step-${stepNum}`).style.display = 'block';

    document.querySelectorAll('.wizard-steps-bar .step-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.getAttribute('data-step')) === stepNum) item.classList.add('active');
    });
}