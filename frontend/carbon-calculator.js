document.addEventListener('DOMContentLoaded', () => {

    // Centralized Emission Factors Configuration
    const emissionFactors = {
        transport: {
            petrolCar: 0.21,
            dieselCar: 0.23,
            cngCar: 0.18,
            hybridCar: 0.14,
            electricCar: 0.05,
            motorcycle: 0.08,
            scooter: 0.06,
            van: 0.25,
            pickup: 0.28,
            other: 0.22,
            bus: 0.05,
            train: 0.03,
            metro: 0.02,
            auto: 0.12,
            taxi: 0.25
        },
        energy: {
            electricity: 0.82, // kg CO2e per kWh
            lpg14: 14.2 * 2.98,
            lpg5: 5 * 2.98,
            lpg19: 19 * 2.98
        },
        food: {
            vegan: 1.2,
            vegetarian: 1.7,
            eggVeg: 2.0,
            pescatarian: 2.2,
            nonVeg: 2.7
        },
        shopping: {
            clothing: 15.0,
            footwear: 12.0,
            electronics: 90.0,
            furniture: 45.0,
            appliances: 70.0,
            bags: 10.0,
            personalCare: 5.0,
            household: 8.0,
            secondHandDiscount: 0.5
        },
        travel: {
            flightDomesticEco: 150.0,
            flightDomesticBus: 250.0,
            flightIntlEco: 800.0,
            flightIntlBus: 1500.0,
            train: 0.04,
            bus: 0.06,
            road: 0.18
        },
        waste: {
            low: 100.0,
            average: 200.0,
            high: 350.0
        }
    };

    let currentStep = 1;
    const totalSteps = 7;
    let shoppingList = [];

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const saveBtn = document.getElementById('save-dashboard-btn');
    const backBtn = document.getElementById('back-to-dashboard');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'carbon.html';
        });
    }

    // Tooltips display helper
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            alert(icon.getAttribute('title'));
        });
    });


    // 1. Transport Vehicle toggle
    document.querySelectorAll('input[name="hasVehicle"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const box = document.getElementById('personal-vehicle-conditional-box');
            if (box) box.style.display = (e.target.value === 'yes') ? 'block' : 'none';
            runLiveCalculation();
        });
    });

    const vehFuelSelect = document.getElementById('veh-fuel');
    if (vehFuelSelect) {
        vehFuelSelect.addEventListener('change', (e) => {
            const labelText = document.getElementById('efficiency-label-text');
            if (e.target.value === 'electric') {
                if (labelText) labelText.innerHTML = `EV efficiency <span class="optional-badge">Optional</span> <span class="info-icon" title="km/kWh shows how far an electric vehicle travels using one kilowatt-hour of electricity.">ⓘ</span>`;
            } else {
                if (labelText) labelText.innerHTML = `Vehicle efficiency <span class="optional-badge">Optional</span> <span class="info-icon" title="km/L means how many kilometres a vehicle can travel using one litre of fuel.">ⓘ</span>`;
            }
            runLiveCalculation();
        });
    }

    // Public transport toggle
    document.querySelectorAll('input[name="usePublic"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const b1 = document.getElementById('public-transport-box');
            const b2 = document.getElementById('public-transport-box-2');
            const disp = (e.target.value === 'yes') ? 'grid' : 'none';
            if (b1) b1.style.display = disp;
            if (b2) b2.style.display = disp;
            runLiveCalculation();
        });
    });

    // 2. Home Energy toggles
    document.querySelectorAll('input[name="knowKwh"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('kwh-known-box').style.display = (e.target.value === 'yes') ? 'block' : 'none';
            document.getElementById('kwh-unknown-box').style.display = (e.target.value === 'yes') ? 'none' : 'block';
            runLiveCalculation();
        });
    });

    document.querySelectorAll('input[name="hasSolar"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('solar-pct-box').style.display = (e.target.value === 'yes') ? 'block' : 'none';
            runLiveCalculation();
        });
    });

    document.querySelectorAll('input[name="hasLpg"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('lpg-details-box').style.display = (e.target.value === 'yes') ? 'flex' : 'none';
            runLiveCalculation();
        });
    });

    document.querySelectorAll('input[name="hasAc"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('ac-details-box').style.display = (e.target.value === 'yes') ? 'block' : 'none';
            runLiveCalculation();
        });
    });

    // 3. Food Diet conditionals
    const dietSelect = document.getElementById('food-diet-type');
    if (dietSelect) {
        dietSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const meatBox = document.getElementById('conditional-meat-box');
            const dairyBox = document.getElementById('conditional-dairy-box');

            if (val === 'vegan') {
                if (meatBox) meatBox.style.display = 'none';
                if (dairyBox) dairyBox.style.display = 'none';
            } else if (val === 'vegetarian' || val === 'eggVeg') {
                if (meatBox) meatBox.style.display = 'none';
                if (dairyBox) dairyBox.style.display = 'block';
            } else {
                if (meatBox) meatBox.style.display = 'block';
                if (dairyBox) dairyBox.style.display = 'block';
            }
            runLiveCalculation();
        });
    }

    // 4. Shopping Product & Subcategory Dynamic Engine
    const shoppingOptions = {
        clothing: ["T-Shirt", "Shirt", "Jeans", "Pants", "Saree", "Jacket/Coat", "Sweater", "Suit", "Other"],
        footwear: ["Sneakers", "Running Shoes", "Formal Shoes", "Sandals", "Boots", "Other"],
        electronics: ["Smartphone", "Laptop", "Tablet", "TV", "Headphones", "Smartwatch", "Other"],
        furniture: ["Chair", "Table", "Sofa", "Bed", "Wardrobe", "Desk", "Other"],
        appliances: ["Refrigerator", "Washing Machine", "Microwave", "Water Heater", "Dishwasher", "Other"],
        bags: ["Backpack", "Handbag", "Suitcase", "Wallet", "Belt", "Sunglasses", "Other"],
        personalCare: ["Shampoo", "Soap", "Toothpaste", "Perfume", "Skincare", "Other"],
        household: ["Bedsheet", "Curtain", "Towel", "Blanket", "Kitchenware", "Other"]
    };

    const materialOptions = {
        clothing: ["Cotton", "Polyester", "Denim", "Wool", "Silk", "Linen", "Mixed"],
        footwear: ["Leather", "Synthetic", "Textile", "Rubber", "Mixed"],
        electronics: ["Standard Device", "Recycled Component"],
        furniture: ["Wood", "Engineered Wood", "Metal", "Plastic"],
        appliances: ["Standard Metal/Plastic"],
        bags: ["Leather", "Cotton", "Nylon", "Synthetic"],
        personalCare: ["Plastic Packaging", "Glass Packaging"],
        household: ["Cotton", "Synthetic", "Plastic", "Glass"]
    };

    const shopCatSelect = document.getElementById('shop-cat');
    const shopSubcatSelect = document.getElementById('shop-subcat');
    const shopMaterialSelect = document.getElementById('shop-material');

    function updateShoppingDropdowns() {
        if (!shopCatSelect) return;
        const cat = shopCatSelect.value;
        
        // Populate Subcategories
        shopSubcatSelect.innerHTML = (shoppingOptions[cat] || []).map(item => `<option value="${item}">${item}</option>`).join('');
        // Populate Materials
        shopMaterialSelect.innerHTML = (materialOptions[cat] || []).map(mat => `<option value="${mat}">${mat}</option>`).join('');
    }

    if (shopCatSelect) {
        shopCatSelect.addEventListener('change', updateShoppingDropdowns);
        updateShoppingDropdowns();
    }

    // Add Product button
    const addProdBtn = document.getElementById('add-product-btn');
    if (addProdBtn) {
        addProdBtn.addEventListener('click', () => {
            const cat = shopCatSelect.value;
            const subcat = shopSubcatSelect.value;
            const mat = shopMaterialSelect.value || 'Standard';
            const qty = parseFloat(document.getElementById('shop-qty').value) || 1;
            const cond = document.getElementById('shop-condition').value;

            shoppingList.push({ category: cat, name: subcat, material: mat, quantity: qty, condition: cond });
            renderShoppingList();
            runLiveCalculation();
        });
    }

    function renderShoppingList() {
        const container = document.getElementById('shopping-list-display');
        if (!container) return;
        container.innerHTML = shoppingList.map((item, idx) => `
            <div class="item-row">
                <span><strong>${item.name}</strong> (${item.category}) × ${item.quantity} [${item.condition}]</span>
                <button type="button" onclick="window.removeShop(${idx})">&times;</button>
            </div>
        `).join('');
    }

    window.removeShop = function(idx) {
        shoppingList.splice(idx, 1);
        renderShoppingList();
        runLiveCalculation();
    };

    // 5. Travel Checkboxes toggles
    document.getElementById('chk-airplane').addEventListener('change', (e) => {
        document.getElementById('panel-airplane').style.display = e.target.checked ? 'block' : 'none';
        runLiveCalculation();
    });
    document.getElementById('chk-train').addEventListener('change', (e) => {
        document.getElementById('panel-train').style.display = e.target.checked ? 'block' : 'none';
        runLiveCalculation();
    });
    document.getElementById('chk-bus').addEventListener('change', (e) => {
        document.getElementById('panel-bus').style.display = e.target.checked ? 'block' : 'none';
        runLiveCalculation();
    });
    document.getElementById('chk-road').addEventListener('change', (e) => {
        document.getElementById('panel-road').style.display = e.target.checked ? 'block' : 'none';
        runLiveCalculation();
    });

    // --- STEP NAVIGATION & VALIDATION ---
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateView();
                }
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateView();
            }
        });
    }

    function validateCurrentStep() {
        // Clear old errors
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error-border'));
        
        let valid = true;
        if (currentStep === 1) {
            const dist = document.getElementById('commute-dist');
            if (!dist.value || parseFloat(dist.value) < 0) {
                dist.classList.add('error-border');
                valid = false;
            }
        }
        if (!valid) {
            alert("Please complete required fields before proceeding.");
        }
        return valid;
    }

    function updateView() {
        for (let i = 1; i <= totalSteps; i++) {
            const sec = document.getElementById(`section-${i}`);
            if (sec) sec.style.display = (i === currentStep) ? 'block' : 'none';

            const stepEl = document.querySelector(`.step-item[data-step="${i}"]`);
            if (stepEl) {
                if (i === currentStep) stepEl.classList.add('active');
                else stepEl.classList.remove('active');
            }
        }

        if (prevBtn) prevBtn.style.display = (currentStep === 1) ? 'none' : 'block';
        if (nextBtn) nextBtn.style.display = (currentStep === totalSteps) ? 'none' : 'block';
        if (saveBtn) saveBtn.style.display = (currentStep === totalSteps) ? 'block' : 'none';

        const badge = document.getElementById('step-indicator');
        if (badge) badge.innerText = `Step ${currentStep} of ${totalSteps}`;
    }

    // --- CALCULATION ENGINES ---
    function calculateTransport() {
        const hasVeh = document.querySelector('input[name="hasVehicle"]:checked').value === 'yes';
        let personalKg = 0;

        if (hasVeh) {
            const type = document.getElementById('veh-type').value;
            const fuel = document.getElementById('veh-fuel').value;
            const pass = parseFloat(document.getElementById('veh-passengers').value) || 1;
            const dist = parseFloat(document.getElementById('commute-dist').value) || 15;
            const days = parseFloat(document.getElementById('commute-days').value) || 5;

            let factor = emissionFactors.transport[`${fuel}Car`] || 0.21;
            if (type === 'motorcycle') factor = emissionFactors.transport.motorcycle;
            if (type === 'scooter') factor = emissionFactors.transport.scooter;
            if (type === 'suv') factor = emissionFactors.transport.pickup;

            const annualKm = dist * 2 * days * 52;
            personalKg = (annualKm * factor) / Math.max(pass, 1);
        }

        const usePub = document.querySelector('input[name="usePublic"]:checked').value === 'yes';
        let publicKg = 0;
        if (usePub) {
            const bus = parseFloat(document.getElementById('pub-bus').value) || 0;
            const train = parseFloat(document.getElementById('pub-train').value) || 0;
            const metro = parseFloat(document.getElementById('pub-metro').value) || 0;
            const auto = parseFloat(document.getElementById('pub-auto').value) || 0;
            const taxi = parseFloat(document.getElementById('pub-taxi').value) || 0;

            publicKg = (
                (bus * 52 * emissionFactors.transport.bus) +
                (train * 52 * emissionFactors.transport.train) +
                (metro * 52 * emissionFactors.transport.metro) +
                (auto * 52 * emissionFactors.transport.auto) +
                (taxi * 52 * emissionFactors.transport.taxi)
            );
        }

        return personalKg + publicKg;
    }

    function calculateEnergy() {
        const knowKwh = document.querySelector('input[name="knowKwh"]:checked').value === 'yes';
        let kwh = 200;
        if (knowKwh) {
            kwh = parseFloat(document.getElementById('energy-kwh').value) || 200;
        } else {
            const bill = parseFloat(document.getElementById('energy-bill').value) || 1500;
            kwh = bill / 8; // approximate conversion
        }

        const hasSolar = document.querySelector('input[name="hasSolar"]:checked').value === 'yes';
        const solarPct = hasSolar ? (parseFloat(document.getElementById('energy-solar-pct').value) || 20) : 0;
        const effectiveKwh = kwh * (1 - (solarPct / 100));
        const elecKg = (effectiveKwh * 12) * emissionFactors.energy.electricity;

        let lpgKg = 0;
        const hasLpg = document.querySelector('input[name="hasLpg"]:checked').value === 'yes';
        if (hasLpg) {
            const size = document.getElementById('lpg-size').value;
            const count = parseFloat(document.getElementById('lpg-count').value) || 1;
            const factor = size === '5' ? emissionFactors.energy.lpg5 : (size === '19' ? emissionFactors.energy.lpg19 : emissionFactors.energy.lpg14);
            lpgKg = count * factor * 12;
        }

        // Avoid double counting: AC is powered by electricity, so if kWh is entered, AC electricity is already included in kWh.
        return elecKg + lpgKg;
    }

    function calculateFood() {
        const diet = document.getElementById('food-diet-type').value || 'nonVeg';
        return (emissionFactors.food[diet] || 2.7) * 1000;
    }

    function calculateShopping() {
        let total = 0;
        shoppingList.forEach(item => {
            let base = emissionFactors.shopping[item.category] || 15.0;
            base *= item.quantity;
            if (item.condition === 'secondHand') base *= emissionFactors.shopping.secondHandDiscount;
            total += base;
        });
        return Math.max(total, 120);
    }

    function calculateTravel() {
        let travelKg = 0;
        if (document.getElementById('chk-airplane').checked) {
            const type = document.getElementById('flight-type').value;
            const cls = document.getElementById('flight-class').value;
            const dist = parseFloat(document.getElementById('flight-dist').value) || 1200;
            const trips = parseFloat(document.getElementById('flight-trips').value) || 1;
            
            let factor = emissionFactors.travel.flightDomesticEco;
            if (type === 'international' && cls === 'economy') factor = emissionFactors.travel.flightIntlEco;
            if (type === 'international' && cls === 'business') factor = emissionFactors.travel.flightIntlBus;
            if (type === 'domestic' && cls === 'business') factor = emissionFactors.travel.flightDomesticBus;

            travelKg += (dist * trips * (factor / 1000)); // converted to kg approx
        }

        if (document.getElementById('chk-train').checked) {
            const dist = parseFloat(document.getElementById('train-dist').value) || 300;
            const trips = parseFloat(document.getElementById('train-trips').value) || 4;
            travelKg += dist * trips * emissionFactors.travel.train;
        }

        if (document.getElementById('chk-bus').checked) {
            const dist = parseFloat(document.getElementById('bus-dist').value) || 200;
            const trips = parseFloat(document.getElementById('bus-trips').value) || 2;
            travelKg += dist * trips * emissionFactors.travel.bus;
        }

        if (document.getElementById('chk-road').checked) {
            const dist = parseFloat(document.getElementById('road-dist').value) || 1000;
            const pass = parseFloat(document.getElementById('road-pass').value) || 2;
            travelKg += (dist * emissionFactors.travel.road) / Math.max(pass, 1);
        }

        return travelKg;
    }

    function calculateWaste() {
        const household = parseFloat(document.getElementById('waste-household').value) || 3;
        const level = document.getElementById('waste-level').value || 'average';
        return (emissionFactors.waste[level] || 200) / household;
    }

    function calculateEcoScore() {
        let score = 70;
        if (document.getElementById('habit-reusables').value === 'always') score += 10;
        if (document.getElementById('habit-recycle').value === 'yes') score += 10;
        if (document.getElementById('habit-led').value === 'yes') score += 10;
        return Math.min(score, 100);
    }

    function runLiveCalculation() {
        const transKg = calculateTransport();
        const energyKg = calculateEnergy();
        const foodKg = calculateFood();
        const shopKg = calculateShopping();
        const travelKg = calculateTravel();
        const wasteKg = calculateWaste();

        const totalAnnualKg = transKg + energyKg + foodKg + shopKg + travelKg + wasteKg;
        const totalMonthlyKg = totalAnnualKg / 12;

        document.getElementById('summary-monthly').innerText = Math.round(totalMonthlyKg);
        document.getElementById('summary-annual').innerText = `≈ ${(totalAnnualKg / 1000).toFixed(2)} tonnes CO₂e / year`;

        document.getElementById('b-trans').innerText = `${Math.round(transKg / 12)} kg`;
        document.getElementById('b-energy').innerText = `${Math.round(energyKg / 12)} kg`;
        document.getElementById('b-food').innerText = `${Math.round(foodKg / 12)} kg`;
        document.getElementById('b-shop').innerText = `${Math.round(shopKg / 12)} kg`;
        document.getElementById('b-travel').innerText = `${Math.round(travelKg / 12)} kg`;
        document.getElementById('b-waste').innerText = `${Math.round(wasteKg / 12)} kg`;

        document.getElementById('summary-eco').innerText = calculateEcoScore();
    }

    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', runLiveCalculation);
        el.addEventListener('change', runLiveCalculation);
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const transKg = calculateTransport();
            const energyKg = calculateEnergy();
            const foodKg = calculateFood();
            const shopKg = calculateShopping();
            const travelKg = calculateTravel();
            const wasteKg = calculateWaste();

            const annualTonnes = (transKg + energyKg + foodKg + shopKg + travelKg + wasteKg) / 1000;
            const monthlyTonnes = annualTonnes / 12;

            const result = {
                annualPace: annualTonnes,
                thisMonth: monthlyTonnes,
                ecoScore: calculateEcoScore(),
                sources: [
                    { id: "car", name: "Transport", value: transKg / 1000, percentage: Math.round((transKg / (annualTonnes * 1000)) * 100), color: "#16a34a" },
                    { id: "elec", name: "Energy", value: energyKg / 1000, percentage: Math.round((energyKg / (annualTonnes * 1000)) * 100), color: "#0d9488" },
                    { id: "food", name: "Food", value: foodKg / 1000, percentage: Math.round((foodKg / (annualTonnes * 1000)) * 100), color: "#d97706" },
                    { id: "shop", name: "Shopping", value: shopKg / 1000, percentage: Math.round((shopKg / (annualTonnes * 1000)) * 100), color: "#2563eb" },
                    { id: "travel", name: "Travel", value: travelKg / 1000, percentage: Math.round((travelKg / (annualTonnes * 1000)) * 100), color: "#9333ea" },
                    { id: "waste", name: "Waste", value: wasteKg / 1000, percentage: Math.round((wasteKg / (annualTonnes * 1000)) * 100), color: "#dc2626" }
                ]
            };

            localStorage.setItem("ecoLifeCarbonData", JSON.stringify(result));
            window.location.href = "carbon.html";
        });
    }

    runLiveCalculation();
});