document.addEventListener('DOMContentLoaded', () => {

    const appState = {
        user: {
            name: "Vishal",
            initials: "VM",
            percentile: 87,
            dailyPoints: 33,
            notificationsCount: 2
        },
        metrics: {
            carbon: { value: 2.1, change: "12% lower", isGood: true },
            energy: { value: 287, change: "8% lower", isGood: true },
            water: { value: 3140, change: "5% higher", isGood: false },
            ecoScore: { score: 84, tag: "EXCELLENT" }
        },
        trendChart: {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            userData: [5.2, 5.0, 4.8, 4.7, 4.8, 4.8, 4.5],
            avgData: [6.0, 6.0, 5.9, 5.8, 5.8, 5.7, 5.6]
        },
        breakdownChart: [
            { category: "Transport", value: 38, color: "#2e7d32" },
            { category: "Home Energy", value: 29, color: "#a5d6a7" },
            { category: "Food", value: 21, color: "#00897b" },
            { category: "Shopping", value: 12, color: "#c62828" }
        ],
        weeklyEnergy: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [8, 8, 9, 6.5, 7, 11, 10]
        },
        habits: [
            { id: 1, text: "Cycled to work", icon: "🚴", pts: 15, completed: true },
            { id: 2, text: "Meat-free meals today", icon: "🥗", pts: 10, completed: true },
            { id: 3, text: "Reusable bag shopping", icon: "🛍️", pts: 8, completed: true },
            { id: 4, text: "Lowered thermostat 2°", icon: "🌡️", pts: 12, completed: false },
            { id: 5, text: "Hang-dried laundry", icon: "🧺", pts: 10, completed: false },
            { id: 6, text: "Composted food waste", icon: "🌱", pts: 8, completed: false }
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
            },
            {
                id: "tip-3",
                title: "Plant-based Mondays",
                tag: "High",
                tagClass: "tag-high",
                boxClass: "green-tip",
                desc: "One vegan day weekly equals 5 car-free weeks per year.",
                savings: "Saves 400 kg CO₂/yr"
            }
        ],
        activities: [
            {
                id: "act-1",
                title: "Solar panel output recorded",
                time: "09:14",
                value: "+4.2 kWh",
                dotColor: "green-dot",
                valueClass: ""
            },
            {
                id: "act-2",
                title: "Weekly water report generated",
                time: "08:50",
                value: "3,140 L",
                dotColor: "gray-dot",
                valueClass: ""
            },
            {
                id: "act-3",
                title: "Carbon goal milestone reached",
                time: "Yesterday",
                value: "72%",
                dotColor: "green-dot",
                valueClass: "green-text"
            },
            {
                id: "act-4",
                title: "Weekend energy spike detected",
                time: "Yesterday",
                value: "+18%",
                dotColor: "red-dot",
                valueClass: "red-text"
            }
        ]
    };

    let trendChartInstance = null;
    let donutChartInstance = null;
    let barChartInstance = null;


    function renderHeader() {
        const hour = new Date().getHours();
        let timeGreeting = 'morning';
        if (hour >= 12 && hour < 17) timeGreeting = 'afternoon';
        else if (hour >= 17 || hour < 5) timeGreeting = 'evening';

        document.getElementById('greeting').innerText = `Good ${timeGreeting}, ${appState.user.name}`;
        
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = new Date().toLocaleDateString('en-US', options);
        document.getElementById('current-date').innerHTML = `${dateStr} <span class="dot-separator">•</span> You are ahead of <strong>${appState.user.percentile}%</strong> of users this week`;

        document.getElementById('daily-points').innerText = appState.user.dailyPoints;
        document.getElementById('unread-count').innerText = appState.user.notificationsCount;
        document.getElementById('user-initials').innerText = appState.user.initials;
    }

    function renderMetrics() {
        // Carbon
        document.getElementById('carbon-val').innerText = appState.metrics.carbon.value;
        document.getElementById('carbon-badge').className = `badge ${appState.metrics.carbon.isGood ? 'badge-green' : 'badge-red'}`;
        document.getElementById('carbon-badge').innerHTML = `${appState.metrics.carbon.isGood ? '↓' : '↑'} ${appState.metrics.carbon.change} <small>vs last month</small>`;

        // Energy
        document.getElementById('energy-val').innerText = appState.metrics.energy.value;
        document.getElementById('energy-badge').className = `badge ${appState.metrics.energy.isGood ? 'badge-green' : 'badge-red'}`;
        document.getElementById('energy-badge').innerHTML = `${appState.metrics.energy.isGood ? '↓' : '↑'} ${appState.metrics.energy.change} <small>vs last month</small>`;

        // Water
        document.getElementById('water-val').innerText = appState.metrics.water.value.toLocaleString();
        document.getElementById('water-badge').className = `badge ${appState.metrics.water.isGood ? 'badge-green' : 'badge-red'}`;
        document.getElementById('water-badge').innerHTML = `${appState.metrics.water.isGood ? '↓' : '↑'} ${appState.metrics.water.change} <small>vs last month</small>`;

        // Eco Score
        const score = appState.metrics.ecoScore.score;
        document.getElementById('eco-score-val').innerText = score;
        document.getElementById('score-tag-text').innerText = appState.metrics.ecoScore.tag;
        document.getElementById('score-circle-bg').style.background = `conic-gradient(#16a34a 0% ${score}%, #e2e8f0 ${score}% 100%)`;
    }

    function renderHabits() {
        const habitsListContainer = document.getElementById('habits-list-container');
        const completedCount = appState.habits.filter(h => h.completed).length;
        const totalCount = appState.habits.length;
        const percentage = Math.round((completedCount / totalCount) * 100);

        document.getElementById('habits-count-text').innerText = `${completedCount} of ${totalCount} completed`;
        document.getElementById('habits-percentage').innerText = `${percentage}%`;
        document.getElementById('habits-progress-fill').style.width = `${percentage}%`;

        habitsListContainer.innerHTML = appState.habits.map(habit => `
            <li class="habit-item ${habit.completed ? 'completed' : ''}" data-id="${habit.id}" style="cursor: pointer;">
                <div class="habit-left">
                    ${habit.completed ? '<span class="check-icon">✓</span>' : '<span class="circle-icon"></span>'}
                    <span class="habit-icon">${habit.icon}</span>
                    <span class="habit-text">${habit.text}</span>
                </div>
                <span class="pts-badge ${habit.completed ? '' : 'inactive'}">+${habit.pts}</span>
            </li>
        `).join('');

        // Interactive Click Toggle Logic
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

    function renderActivities() {
        const container = document.getElementById('activity-grid-container');
        container.innerHTML = appState.activities.map(act => `
            <div class="activity-item">
                <span class="activity-dot ${act.dotColor}"></span>
                <div class="activity-details">
                    <strong>${act.title}</strong>
                    <p>${act.time} <span class="${act.valueClass}">${act.value}</span></p>
                </div>
            </div>
        `).join('');
    }

    function renderDonutLegend() {
        const legendContainer = document.getElementById('donut-legend-container');
        legendContainer.innerHTML = appState.breakdownChart.map(item => `
            <div class="legend-row">
                <span class="legend-dot" style="background-color: ${item.color};"></span>
                <span class="legend-label">${item.category}</span>
                <span class="legend-value">${item.value}%</span>
            </div>
        `).join('');
    }

    function renderCharts() {
        // Line Chart
        const ctxLine = document.getElementById('trendLineChart');
        if (ctxLine) {
            if (trendChartInstance) trendChartInstance.destroy();
            const gradient = ctxLine.getContext('2d').createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(46, 125, 50, 0.12)');
            gradient.addColorStop(1, 'rgba(46, 125, 50, 0.0)');

            trendChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: appState.trendChart.labels,
                    datasets: [
                        { label: 'You', data: appState.trendChart.userData, borderColor: '#2e7d32', borderWidth: 2, backgroundColor: gradient, fill: true, tension: 0.3, pointRadius: 0 },
                        { label: 'Avg', data: appState.trendChart.avgData, borderColor: '#cbd5e1', borderWidth: 1.5, borderDash: [4, 4], fill: false, tension: 0.1, pointRadius: 0 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                        y: { min: 1.5, max: 6.0, ticks: { stepSize: 1.5, color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        }

        // Donut Chart
        const ctxDonut = document.getElementById('breakdownDonutChart');
        if (ctxDonut) {
            if (donutChartInstance) donutChartInstance.destroy();
            donutChartInstance = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: appState.breakdownChart.map(i => i.category),
                    datasets: [{ data: appState.breakdownChart.map(i => i.value), backgroundColor: appState.breakdownChart.map(i => i.color), borderWidth: 2, borderColor: '#ffffff' }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
            });
        }

        // Bar Chart
        const ctxBar = document.getElementById('energyBarChart');
        if (ctxBar) {
            if (barChartInstance) barChartInstance.destroy();
            const colors = appState.weeklyEnergy.labels.map((_, index) => index >= 5 ? '#d98e48' : '#4ba560');

            barChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: appState.weeklyEnergy.labels,
                    datasets: [{ data: appState.weeklyEnergy.data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                        y: { min: 0, max: 12, ticks: { stepSize: 3, color: '#94a3b8', font: { size: 10 } }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        }
    }

    // Initialize App
    renderHeader();
    renderMetrics();
    renderHabits();
    renderTips();
    renderActivities();
    renderDonutLegend();
    renderCharts();
});