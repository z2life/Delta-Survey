/**
 * surveyCalculator.js
 * Interactive Survey Scope, Turnaround, Equipment & Cost Estimator
 * Delta Survey Engineering
 */

export function initSurveyCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const areaInput = document.getElementById('calc-area');
  const unitSelect = document.getElementById('calc-unit');
  const terrainRadios = document.querySelectorAll('input[name="calc-terrain"]');
  const applyBtn = document.getElementById('calc-apply-btn');

  // Readout elements
  const durationElem = document.getElementById('calc-res-duration');
  const teamElem = document.getElementById('calc-res-team');
  const equipElem = document.getElementById('calc-res-equip');
  const costElem = document.getElementById('calc-res-cost');
  const toleranceElem = document.getElementById('calc-res-tolerance');

  if (!serviceSelect || !areaInput) return;

  function calculate() {
    const service = serviceSelect.value || 'topographical';
    const areaVal = parseFloat(areaInput.value) || 10000;
    const unit = unitSelect ? unitSelect.value : 'sqft';
    let terrainMult = 1.0;

    terrainRadios.forEach(r => {
      if (r.checked) terrainMult = parseFloat(r.value);
    });

    // Convert area to square feet equivalent for standard calculation
    let areaSqFt = areaVal;
    if (unit === 'acres') areaSqFt = areaVal * 43560;
    else if (unit === 'cents') areaSqFt = areaVal * 435.6;
    else if (unit === 'hectares') areaSqFt = areaVal * 107639;

    let baseDays = 1;
    let baseRate = 0.45; // per sq ft factor or base
    let equipment = 'Robotic Total Station + Digital Level';
    let team = '1 Senior Surveyor + 2 Field Technicians';
    let tolerance = '± 1.5 mm';

    switch (service) {
      case 'topographical':
        baseDays = Math.max(1, Math.ceil((areaSqFt / 40000) * terrainMult));
        baseRate = 0.55;
        equipment = 'Robotic Total Station (0.5") + Dual GNSS RTK Rovers';
        team = '1 Geomatics Engineer + 2 Field Surveyors';
        tolerance = '± 1.2 mm horizontal / ± 1.5 mm elevation';
        break;
      case 'contour':
        baseDays = Math.max(1, Math.ceil((areaSqFt / 35000) * terrainMult));
        baseRate = 0.65;
        equipment = 'Robotic Total Station + Drone LiDAR Scanner';
        team = '1 Geomatics Engineer + 1 Drone Pilot + 2 Surveyors';
        tolerance = '± 1.0 mm at benchmark';
        break;
      case 'property':
        baseDays = Math.max(1, Math.ceil((areaSqFt / 60000) * terrainMult));
        baseRate = 0.40;
        equipment = 'GNSS RTK Rover + Total Station + Prism Rods';
        team = '1 Licensed Cadastral Surveyor + 1 Assistant';
        tolerance = '± 2.0 mm cadastral standard';
        break;
      case 'setting-out':
        baseDays = Math.max(1, Math.ceil((areaSqFt / 25000) * terrainMult));
        baseRate = 0.85;
        equipment = 'Sub-Millimeter Robotic Total Station + Target Mini-Prisms';
        team = '1 Senior Setting-Out Engineer + 2 Layout Technicians';
        tolerance = '± 0.8 mm column centerline';
        break;
      case 'area':
        baseDays = Math.max(1, Math.ceil((areaSqFt / 80000) * terrainMult));
        baseRate = 0.30;
        equipment = 'Multi-Constellation GNSS RTK + Disto Laser';
        team = '1 Land Surveyor + 1 Data Assistant';
        tolerance = '± 0.01% of total boundary polygon';
        break;
      case 'airport':
        baseDays = Math.max(2, Math.ceil((areaSqFt / 50000) * terrainMult));
        baseRate = 1.25;
        equipment = 'Dual Robotic Total Stations + Geodetic Digital Level';
        team = '2 Senior Airfield Geodetic Engineers + 3 Technicians';
        tolerance = '± 0.5 mm FAA / ICAO geodetic standard';
        break;
      case 'online-approval':
        baseDays = Math.max(2, Math.ceil((areaSqFt / 50000) * terrainMult));
        baseRate = 0.50;
        equipment = 'Total Station + Civil 3D CAD Drafting Suite';
        team = '1 Survey Engineer + 1 Municipal Approval Specialist';
        tolerance = '100% Municipal & CMDA/DTCP Compliance';
        break;
    }

    // Rough estimated project scale (customizable / indicative)
    const rawCost = Math.round(Math.max(450, Math.min(25000, 300 + (areaSqFt * 0.02 * baseRate * terrainMult))));
    const costMin = Math.round(rawCost * 0.85);
    const costMax = Math.round(rawCost * 1.25);

    if (durationElem) durationElem.textContent = `${baseDays} - ${baseDays + 1} Business Days`;
    if (teamElem) teamElem.textContent = team;
    if (equipElem) equipElem.textContent = equipment;
    if (toleranceElem) toleranceElem.textContent = tolerance;
    if (costElem) costElem.textContent = `$${costMin.toLocaleString()} - $${costMax.toLocaleString()} USD (Est.)`;
  }

  // Event listeners
  serviceSelect.addEventListener('change', calculate);
  areaInput.addEventListener('input', calculate);
  if (unitSelect) unitSelect.addEventListener('change', calculate);
  terrainRadios.forEach(r => r.addEventListener('change', calculate));

  // "Apply to Survey Request" button logic
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const formService = document.getElementById('survey-service');
      const formArea = document.getElementById('survey-area');
      const requestSection = document.getElementById('request-survey');

      if (formService) formService.value = serviceSelect.value;
      if (formArea) formArea.value = `${areaInput.value} ${unitSelect ? unitSelect.value : 'sqft'}`;

      if (requestSection) {
        requestSection.scrollIntoView({ behavior: 'smooth' });
        // Flash the form to indicate applied data
        const formBox = document.getElementById('survey-request-form');
        if (formBox) {
          formBox.classList.add('ring-2', 'ring-surveyYellow');
          setTimeout(() => {
            formBox.classList.remove('ring-2', 'ring-surveyYellow');
          }, 1500);
        }
      }
    });
  }

  // Initial calculation
  calculate();
}
