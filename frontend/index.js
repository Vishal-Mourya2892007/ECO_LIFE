document.addEventListener('DOMContentLoaded', () => {

    const dashboardData = {
        user: {
            name: "Vishal",
            percentile: 87,
            dailyPoints: 33
        },
        metrics: {
            carbon: 2.1,
            energy: 287,
            water: 3140,
            ecoScore: 84
        },
        energyWeekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [8, 8, 9, 6.5, 7, 11, 10],
            weekdaysColor: '#4ba560',
            weekendsColor: '#d98e48'
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
                title: "Switch to LED bulbs",
                tag: "High",
                tagClass: "tag-high",
                boxClass: "green-tip",
                desc: "Saves ~300 kg CO₂/yr and cuts lighting costs by 75%.",
                savings: "Saves 300 kg CO₂/yr"
            },
            {
                title: "Cold-wash laundry",
                tag: "Medium",
                tagClass: "tag-medium",
                boxClass: "orange-tip",
                desc: "Washing at 30°C instead of 60°C uses 60% less energy.",
                savings: "Saves 90 kg CO₂/yr"
            },
            {
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
                title: "Solar panel output recorded",
                time: "09:14",
                value: "+4.2 kWh",
                dotColor: "green-dot",
                valueClass: ""
            },
            {
                title: "Weekly water report generated",
                time: "08:50",
                value: "3,140 L",
                dotColor: "gray-dot",
                valueClass: ""
            },
            {
                title: "Carbon goal milestone reached",
                time: "Yesterday",
                value: "72%",
                dotColor: "green-dot",
                valueClass: "green-text"
            },
            {
                title: "Weekend energy spike detected",
                time: "Yesterday",
                value: "+18%",
                dotColor: "red-dot",
                valueClass: "red-text"
            }
        ]
    };

    function renderHeaderAndMetrics() {
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            const hour = new Date().getHours();
            let timeStr = 'morning';
            if (hour >= 12 && hour < 17) timeStr = 'afternoon';
            else if (hour >= 17 || hour < 5) timeStr = 'evening';
            greetingElement.innerText = `Good ${timeStr}, ${dashboardData.user.name}`;
        }

        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);
            dateElement.innerText = `${formattedDate} — You are ahead of ${dashboardData.user.percentile}% of users this week`;
        }

        const carbonElem = document.getElementById('carbon-val');
        if (carbonElem) carbonElem.innerText = dashboardData.metrics.carbon;

        const energyElem = document.getElementById('energy-val');
        if (energyElem) energyElem.innerText = dashboardData.metrics.energy;

        const waterElem = document.getElementById('water-val');
        if (waterElem) waterElem.innerText = dashboardData.metrics.water.toLocaleString();

        const scoreValElem = document.getElementById('eco-score-val');
        const scoreCircleElem = document.getElementById('score-circle-bg');
        if (scoreValElem && scoreCircleElem) {
            scoreValElem.innerText = dashboardData.metrics.ecoScore;
            scoreCircleElem.style.background = `conic-gradient(#16a34a 0% ${dashboardData.metrics.ecoScore}%, #e2e8f0 ${dashboardData.metrics.ecoScore}% 100%)`;
        }

        const pointsElem = document.getElementById('daily-points');
        if (pointsElem) pointsElem.innerText = dashboardData.user.dailyPoints;
    }

    function renderHabits() {
        const habitsListContainer = document.getElementById('habits-list-container');
        const countText = document.getElementById('habits-count-text');
        const percentageText = document.getElementById('habits-percentage');
        const progressFill = document.getElementById('habits-progress-fill');

        if (!habitsListContainer) return;

        const completedCount = dashboardData.habits.filter(h => h.completed).length;
        const totalCount = dashboardData.habits.length;
        const percentage = Math.round((completedCount / totalCount) * 100);

        countText.innerText = `${completedCount} of ${totalCount} completed`;
        percentageText.innerText = `${percentage}%`;
        progressFill.style.width = `${percentage}%`;

        habitsListContainer.innerHTML = dashboardData.habits.map(habit => `
            <li class="habit-item ${habit.completed ? 'completed' : ''}" data-id="${habit.id}" style="cursor: pointer;">
                <div class="habit-left">
                    ${habit.completed 
                        ? '<span class="check-icon">✓</span>' 
                        : '<span class="circle-icon"></span>'
                    }
                    <span class="habit-icon">${habit.icon}</span>
                    <span class="habit-text">${habit.text}</span>
                </div>
                <span class="pts-badge ${habit.completed ? '' : 'inactive'}">+${habit.pts}</span>
            </li>
        `).join('');

        attachHabitClickListeners();
    }

    function attachHabitClickListeners() {
        const items = document.querySelectorAll('.habit-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'));
                const habit = dashboardData.habits.find(h => h.id === id);

                if (habit) {
                    habit.completed = !habit.completed;

                    if (habit.completed) {
                        dashboardData.user.dailyPoints += habit.pts;
                    } else {
                        dashboardData.user.dailyPoints -= habit.pts;
                    }

                    renderHabits();
                    renderHeaderAndMetrics();
                }
            });
        });
    }

    function renderTips() {
        const tipsContainer = document.getElementById('tips-list-container');
        if (!tipsContainer) return;

        tipsContainer.innerHTML = dashboardData.tips.map(tip => `
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
        const activityContainer = document.getElementById('activity-grid-container');
        if (!activityContainer) return;

        activityContainer.innerHTML = dashboardData.activities.map(act => `
            <div class="activity-item">
                <span class="activity-dot ${act.dotColor}"></span>
                <div class="activity-details">
                    <strong>${act.title}</strong>
                    <p>${act.time} <span class="${act.valueClass}">${act.value}</span></p>
                </div>
            </div>
        `).join('');
    }

    function initCharts() {
        const ctxLine = document.getElementById('trendLineChart');
        if (ctxLine) {
            const gradient = ctxLine.getContext('2d').createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(46, 125, 50, 0.12)');
            gradient.addColorStop(1, 'rgba(46, 125, 50, 0.0)');

            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [
                        {
                            label: 'You',
                            data: [5.2, 5.0, 4.8, 4.7, 4.8, 4.8, 4.5],
                            borderColor: '#2e7d32',
                            borderWidth: 2,
                            backgroundColor: gradient,
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Avg',
                            data: [6.0, 6.0, 5.9, 5.8, 5.8, 5.7, 5.6],
                            borderColor: '#cbd5e1',
                            borderWidth: 1.5,
                            borderDash: [4, 4],
                            fill: false,
                            tension: 0.1,
                            pointRadius: 0
                        }
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

        const ctxDonut = document.getElementById('breakdownDonutChart');
        if (ctxDonut) {
            new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: ['Transport', 'Home Energy', 'Food', 'Shopping'],
                    datasets: [{
                        data: [38, 29, 21, 12],
                        backgroundColor: ['#2e7d32', '#a5d6a7', '#00897b', '#c62828'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: { legend: { display: false } }
                }
            });
        }

        const ctxEnergy = document.getElementById('energyBarChart');
        if (ctxEnergy) {
            const barColors = dashboardData.energyWeekly.labels.map((_, i) => 
                i >= 5 ? dashboardData.energyWeekly.weekendsColor : dashboardData.energyWeekly.weekdaysColor
            );

            new Chart(ctxEnergy, {
                type: 'bar',
                data: {
                    labels: dashboardData.energyWeekly.labels,
                    datasets: [{
                        data: dashboardData.energyWeekly.values,
                        backgroundColor: barColors,
                        borderRadius: 4,
                        borderSkipped: false
                    }]
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

    renderHeaderAndMetrics();
    renderHabits();
    renderTips();
    renderActivities();
    initCharts();
});