document.addEventListener('DOMContentLoaded', () => {

    const appState = {
        user: {
            name: "Vishal",
            initials: "VM",
            percentile: 0,
            dailyPoints: 0,
            notificationsCount: 0
        },
        metrics: {
            carbon: { value: 0.0, change: "0%", isGood: true },
            energy: { value: 0, change: "0%", isGood: true },
            water: { value: 0, change: "0%", isGood: true },
            ecoScore: { score: 0, tag: "NO DATA" }
        },
        trendChart: {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            userData: [0, 0, 0, 0, 0, 0, 0],
            avgData: [5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6]
        },
        breakdownChart: [
            { category: "Transport", value: 0, color: "#16a34a" },
            { category: "Home Energy", value: 0, color: "#0d9488" },
            { category: "Food", value: 0, color: "#9333ea" },
            { category: "Shopping", value: 0, color: "#2563eb" }
        ],
        weeklyEnergy: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        habits: [
            { id: 1, text: "Cycled to work", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l-3 3m6-8.5l3 3h4"></path></svg>`, pts: 15, completed: false },
            { id: 2, text: "Meat-free meals today", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path></svg>`, pts: 10, completed: false },
            { id: 3, text: "Reusable bag shopping", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>`, pts: 8, completed: false },
            { id: 4, text: "Lowered thermostat 2°", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`, pts: 12, completed: false },
            { id: 5, text: "Hang-dried laundry", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><path d="M20.4 4.3a2 2 0 0 0-2.8 0l-7.9 7.9-2.3-2.3a2 2 0 0 0-2.8 2.8l3.7 3.7a2 2 0 0 0 2.8 0l9.3-9.3a2 2 0 0 0 0-2.8z"></path></svg>`, pts: 10, completed: false },
            { id: 6, text: "Composted food waste", svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-5 11-10 11z"></path></svg>`, pts: 8, completed: false }
        ],
        tips: [
            {
                id: "tip-1",
                title: "Switch to LED bulbs",
                tag: "High",
                tagClass: "tag-high",
                boxClass: "green-tip",
                desc: "Saves ~300 kg CO₂/yr and cuts lighting costs by 75%.",
                savings: "Saves 300 kg CO₂/yr"
            },
            {
                id: "tip-2",
                title: "Cold-wash laundry",
                tag: "Medium",
                tagClass: "tag-medium",
                boxClass: "orange-tip",
                desc: "Washing at 30°C instead of 60°C uses 60% less energy.",
                savings: "Saves 90 kg CO₂/yr"
            }
        ],
        activities: []
    };

    let trendChartInstance = null;
    let donutChartInstance = null;
    let barChartInstance = null;

    function renderHeader() {
        const hour = new Date().getHours();
        let timeGreeting = 'morning';
        if (hour >= 12 && hour < 17) timeGreeting = 'afternoon';
        else if (hour >= 17 || hour < 5) timeGreeting = 'evening';

        const greetingElem = document.getElementById('greeting');
        if (greetingElem) greetingElem.innerText = `Good ${timeGreeting}, ${appState.user.name}`;

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = new Date().toLocaleDateString('en-US', options);
        const currentDateElem = document.getElementById('current-date');
        if (currentDateElem) {
            currentDateElem.innerHTML = `${dateStr} <span class="dot-separator">•</span> You are ahead of <strong>${appState.user.percentile}%</strong> of users this week`;
        }

        document.getElementById('daily-points').innerText = appState.user.dailyPoints;
        document.getElementById('unread-count').innerText = appState.user.notificationsCount;
        document.getElementById('user-initials').innerText = appState.user.initials;
    }

    function renderMetrics() {
        document.getElementById('carbon-val').innerText = appState.metrics.carbon.value.toFixed(1);
        const carbonBadge = document.getElementById('carbon-badge');
        carbonBadge.className = `badge ${appState.metrics.carbon.isGood ? 'badge-green' : 'badge-red'}`;
        carbonBadge.innerHTML = `${appState.metrics.carbon.change} vs last month`;

        document.getElementById('energy-val').innerText = appState.metrics.energy.value;
        const energyBadge = document.getElementById('energy-badge');
        energyBadge.className = `badge ${appState.metrics.energy.isGood ? 'badge-green' : 'badge-red'}`;
        energyBadge.innerHTML = `${appState.metrics.energy.change} vs last month`;

        document.getElementById('water-val').innerText = appState.metrics.water.value.toLocaleString();
        const waterBadge = document.getElementById('water-badge');
        waterBadge.className = `badge ${appState.metrics.water.isGood ? 'badge-green' : 'badge-red'}`;
        waterBadge.innerHTML = `${appState.metrics.water.change} vs last month`;

        const score = appState.metrics.ecoScore.score;
        document.getElementById('eco-score-val').innerText = score;
        document.getElementById('score-tag-text').innerText = appState.metrics.ecoScore.tag;
        document.getElementById('score-circle-bg').style.background = `conic-gradient(#16a34a 0% ${score}%, #e2e8f0 ${score}% 100%)`;
    }

    function renderHabits() {
        const habitsListContainer = document.getElementById('habits-list-container');
        if (!habitsListContainer) return;

        const completedCount = appState.habits.filter(h => h.completed).length;
        const totalCount = appState.habits.length;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        document.getElementById('habits-count-text').innerText = `${completedCount} of ${totalCount} completed`;
        document.getElementById('habits-percentage').innerText = `${percentage}%`;
        document.getElementById('habits-progress-fill').style.width = `${percentage}%`;

        habitsListContainer.innerHTML = appState.habits.map(habit => `
            <li class="habit-item ${habit.completed ? 'completed' : ''}" data-id="${habit.id}" style="cursor: pointer;">
                <div class="habit-left">
                    ${habit.completed ? '<span class="check-icon">✓</span>' : '<span class="circle-icon"></span>'}
                    <span class="habit-icon-svg" style="display:flex; align-items:center;">${habit.svg}</span>
                    <span class="habit-text">${habit.text}</span>
                </div>
                <span class="pts-badge ${habit.completed ? '' : 'inactive'}">+${habit.pts}</span>
            </li>
        `).join('');

        document.querySelectorAll('.habit-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'));
                const habit = appState.habits.find(h => h.id === id);
                if (habit) {
                    habit.completed = !habit.completed;
                    appState.user.dailyPoints += habit.completed ? habit.pts : -habit.pts;
                    renderHabits();
                    renderHeader();
                }
            });
        });
    }

    function renderTips() {
        const tipsContainer = document.getElementById('tips-list-container');
        if (tipsContainer) {
            tipsContainer.innerHTML = appState.tips.map(tip => `
                <div class="tip-box ${tip.boxClass}">
                    <div class="tip-top">
                        <strong>${tip.title}</strong>
                        <span class="tip-tag ${tip.tagClass}">${tip.tag}</span>
                        <span class="arrow">›</span>
                    </div>
                    <p class="tip-desc">${tip.desc}</p>
                    <div class="tip-savings">${tip.savings}</div>
                </div>
            `).join('');
        }
    }

    function renderActivities() {
        const container = document.getElementById('activity-grid-container');
        if (!container) return;

        if (appState.activities.length === 0) {
            container.innerHTML = `<p style="font-size:12px; color:#64748b; grid-column: 1/-1;">No activity recorded yet today.</p>`;
            return;
        }

        container.innerHTML = appState.activities.map(act => `
            <div class="activity-item">
                <span class="activity-dot ${act.dotColor}"></span>
                <div class="activity-details">
                    <strong>${act.title}</strong>
                    <p>${act.time} <span>${act.value}</span></p>
                </div>
            </div>
        `).join('');
    }

    function renderDonutLegend() {
        const legendContainer = document.getElementById('donut-legend-container');
        if (!legendContainer) return;

        legendContainer.innerHTML = appState.breakdownChart.map(item => `
            <div class="legend-row">
                <span class="legend-dot" style="background-color: ${item.color};"></span>
                <span class="legend-label">${item.category}</span>
                <span class="legend-value">${item.value}%</span>
            </div>
        `).join('');
    }

    function renderCharts() {
        const ctxLine = document.getElementById('trendLineChart');
        if (ctxLine) {
            if (trendChartInstance) trendChartInstance.destroy();
            const gradient = ctxLine.getContext('2d').createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(22, 163, 74, 0.12)');
            gradient.addColorStop(1, 'rgba(22, 163, 74, 0.0)');

            trendChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: appState.trendChart.labels,
                    datasets: [
                        { label: 'You', data: appState.trendChart.userData, borderColor: '#16a34a', borderWidth: 2, backgroundColor: gradient, fill: true, tension: 0.3, pointRadius: 2 },
                        { label: 'Avg', data: appState.trendChart.avgData, borderColor: '#cbd5e1', borderWidth: 1.5, borderDash: [4, 4], fill: false, tension: 0.1, pointRadius: 0 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                        y: { min: 0, max: 8, ticks: { stepSize: 2, color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        }

        const ctxDonut = document.getElementById('breakdownDonutChart');
        if (ctxDonut) {
            if (donutChartInstance) donutChartInstance.destroy();

            const hasData = appState.breakdownChart.some(i => i.value > 0);
            const chartData = hasData ? appState.breakdownChart.map(i => i.value) : [100];
            const chartColors = hasData ? appState.breakdownChart.map(i => i.color) : ['#e2e8f0'];

            donutChartInstance = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: hasData ? appState.breakdownChart.map(i => i.category) : ['No Data'],
                    datasets: [{ data: chartData, backgroundColor: chartColors, borderWidth: 2, borderColor: '#ffffff' }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
            });
        }

        const ctxBar = document.getElementById('energyBarChart');
        if (ctxBar) {
            if (barChartInstance) barChartInstance.destroy();
            barChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: appState.weeklyEnergy.labels,
                    datasets: [{ data: appState.weeklyEnergy.data, backgroundColor: '#16a34a', borderRadius: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                        y: { min: 0, max: 15, ticks: { stepSize: 5, color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        }
    }

    function init() {
        renderHeader();
        renderMetrics();
        renderHabits();
        renderTips();
        renderActivities();
        renderDonutLegend();
        renderCharts();
    }

    init();
});