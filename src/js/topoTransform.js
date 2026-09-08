/**
 * topoTransform.js
 * Interactive 5-Step Topographical Survey Transformation Visualizer
 * Raw Land -> Laser Scan -> Point Cloud -> Contour DTM -> Digital CAD Map
 * Delta Survey Engineering
 */

export function initTopoTransform() {
  const steps = [
    {
      id: 1,
      title: '01. Raw Terrain Inspection',
      subtitle: 'Field Site Reconnaissance & Benchmark Setup',
      desc: 'Our geomatics engineers establish geodetic control stations and identify ground topography, slope variations, and physical boundary stakes.',
      image: '/src/assets/images/before_raw_site.jpg',
      hudStats: {
        method: 'Visual Recon & Benchmark Tie-in',
        tolerance: 'Site Baseline WGS84',
        status: 'Control Points Established'
      }
    },
    {
      id: 2,
      title: '02. Total Station & Laser Scan',
      subtitle: 'Sub-Millimeter EDM Distance & Angular Scanning',
      desc: 'Using robotic Total Stations (0.5" angular precision) and LiDAR laser scanning, rapid infrared measurement pulses sweep the land surface.',
      image: '/src/assets/images/total_station_tech.jpg',
      hudStats: {
        method: 'Robotic ATR & Reflectorless EDM',
        tolerance: '±1.0 mm + 1.5 ppm',
        status: 'Active Field Laser Sweep'
      }
    },
    {
      id: 3,
      title: '03. Coordinate Point Cloud Collection',
      subtitle: 'XYZ Coordinate Extraction & Feature Coding',
      desc: 'Over 10,000+ precise spot elevation points are logged with real-time Northing, Easting, and Elevation (Z-value) coordinates into data collectors.',
      image: '/src/assets/images/service_gps_gnss.jpg',
      hudStats: {
        method: 'GNSS RTK Multi-Constellation + TS',
        tolerance: 'XYZ Precision ±2mm',
        status: 'Point Density: 45 pts/m²'
      }
    },
    {
      id: 4,
      title: '04. DTM Surface & Contour Generation',
      subtitle: 'Triangulated Irregular Network (TIN) & Curvature Calculation',
      desc: 'Raw point vectors are processed into a 3D digital terrain model. Elevation curves and 0.2m / 1.0m contour intervals are dynamically computed.',
      image: '/src/assets/images/drone_survey.jpg',
      hudStats: {
        method: 'Delaunay Triangulation & Kriging',
        tolerance: '0.20m Contour Interval',
        status: 'TIN Surface Interpolated'
      }
    },
    {
      id: 5,
      title: '05. Certified CAD & GIS Digital Map',
      subtitle: 'Final Georeferenced Engineering Deliverables',
      desc: 'Production of certified AutoCAD Civil 3D DWG drawings, elevation heatmaps, LandXML surfaces, and legal boundary compliance documentation.',
      image: '/src/assets/images/after_digital_cad.jpg',
      hudStats: {
        method: 'AutoCAD Civil 3D & GIS Export',
        tolerance: 'Survey Authority Certified',
        status: 'CAD / DWG / Shapefile Exported'
      }
    }
  ];

  let currentStep = 0;
  let isPlaying = true;
  let timer = null;

  const displayImg = document.getElementById('transform-display-img');
  const titleElem = document.getElementById('transform-step-title');
  const subtitleElem = document.getElementById('transform-step-subtitle');
  const descElem = document.getElementById('transform-step-desc');
  const methodElem = document.getElementById('transform-hud-method');
  const toleranceElem = document.getElementById('transform-hud-tolerance');
  const statusElem = document.getElementById('transform-hud-status');
  const stepButtons = document.querySelectorAll('.transform-step-btn');
  const playPauseBtn = document.getElementById('transform-play-toggle');
  const progressBar = document.getElementById('transform-progress-bar');
  const canvas = document.getElementById('transform-canvas');

  function renderStep(index) {
    currentStep = index;
    const step = steps[index];

    if (displayImg) {
      displayImg.style.opacity = '0.3';
      setTimeout(() => {
        displayImg.src = step.image;
        displayImg.style.opacity = '1';
      }, 150);
    }

    if (titleElem) titleElem.textContent = step.title;
    if (subtitleElem) subtitleElem.textContent = step.subtitle;
    if (descElem) descElem.textContent = step.desc;
    if (methodElem) methodElem.textContent = step.hudStats.method;
    if (toleranceElem) toleranceElem.textContent = step.hudStats.tolerance;
    if (statusElem) statusElem.textContent = step.hudStats.status;

    stepButtons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    drawStepCanvasOverlay(index);
  }

  function drawStepCanvasOverlay(stepIdx) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    if (stepIdx === 1) {
      // Step 2: Laser Scanning lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.9);
        ctx.lineTo(x, h * 0.3 + Math.sin(x * 0.05) * 30);
        ctx.stroke();
      }
    } else if (stepIdx === 2) {
      // Step 3: Point Cloud dots
      ctx.fillStyle = '#FFC800';
      for (let i = 0; i < 70; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (i % 6 === 0) {
          ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
          ctx.font = '9px monospace';
          ctx.fillText(`+${(14 + Math.random() * 8).toFixed(2)}`, px + 4, py - 2);
          ctx.fillStyle = '#FFC800';
        }
      }
    } else if (stepIdx === 3) {
      // Step 4: Triangulation mesh & Contours
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
      ctx.lineWidth = 1;
      for (let y = h * 0.2; y < h * 0.9; y += 35) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 30) {
          const cy = y + Math.sin(x * 0.02) * 20;
          if (x === 0) ctx.moveTo(x, cy);
          else ctx.lineTo(x, cy);
        }
        ctx.stroke();
      }
    }
  }

  function startAutoPlay() {
    if (timer) clearInterval(timer);
    let progress = 0;
    const intervalTime = 50;
    const totalStepDuration = 4500; // 4.5s per step

    timer = setInterval(() => {
      if (!isPlaying) return;
      progress += (intervalTime / totalStepDuration) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        progress = 0;
        currentStep = (currentStep + 1) % steps.length;
        renderStep(currentStep);
      }
    }, intervalTime);
  }

  stepButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      renderStep(index);
      if (progressBar) progressBar.style.width = '0%';
    });
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playPauseBtn.innerHTML = isPlaying
        ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> PAUSE`
        : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> AUTO PLAY`;
    });
  }

  renderStep(0);
  startAutoPlay();
}
