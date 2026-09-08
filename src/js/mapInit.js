/**
 * mapInit.js
 * Interactive Dark Geospatial GIS Map with Geodetic Benchmarks & Telemetry
 * Delta Survey Engineering
 */

export function initContactMap() {
  const mapCanvas = document.getElementById('contact-gis-canvas');
  const coordDisplay = document.getElementById('map-cursor-coords');
  if (!mapCanvas) return;

  const ctx = mapCanvas.getContext('2d');
  let w, h;
  let mouse = { x: -100, y: -100 };

  function resize() {
    w = mapCanvas.parentElement.offsetWidth;
    h = mapCanvas.parentElement.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mapCanvas.width = w * dpr;
    mapCanvas.height = h * dpr;
    mapCanvas.style.width = w + 'px';
    mapCanvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  mapCanvas.addEventListener('mousemove', (e) => {
    const rect = mapCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (coordDisplay) {
      const lat = (10.7867 + (h / 2 - mouse.y) * 0.00015).toFixed(5);
      const lon = (79.1378 + (mouse.x - w / 2) * 0.00015).toFixed(5);
      coordDisplay.textContent = `CURSOR: LAT ${lat}° N, LON ${lon}° E | WGS84 UTM 44N`;
    }
  });

  const stations = [
    { name: 'DELTA SURVEY HQ & CALIBRATION LAB', x: 0.5, y: 0.48, isHQ: true, code: 'DSE-01' },
    { name: 'REGIONAL BASE STATION (RTK CORS)', x: 0.3, y: 0.32, isHQ: false, code: 'CORS-ALPHA' },
    { name: 'AIRPORT GEODETIC BENCHMARK', x: 0.72, y: 0.65, isHQ: false, code: 'BM-ICAO-9' },
    { name: 'HARBOR INFRASTRUCTURE CONTROL', x: 0.78, y: 0.28, isHQ: false, code: 'BM-PORT-4' }
  ];

  let pulseAngle = 0;

  function renderMap() {
    pulseAngle += 0.04;
    ctx.clearRect(0, 0, w, h);

    // Dark GIS Map Base Layer with Grid
    ctx.fillStyle = '#060d1b';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Connect stations with geodetic baseline vectors
    const hq = stations[0];
    const hqX = hq.x * w;
    const hqY = hq.y * h;

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);

    for (let i = 1; i < stations.length; i++) {
      const st = stations[i];
      const stX = st.x * w;
      const stY = st.y * h;

      ctx.beginPath();
      ctx.moveTo(hqX, hqY);
      ctx.lineTo(stX, stY);
      ctx.stroke();

      // Midpoint distance label
      const midX = (hqX + stX) / 2;
      const midY = (hqY + stY) / 2;
      const distKm = (Math.sqrt(Math.pow(stX - hqX, 2) + Math.pow(stY - hqY, 2)) * 0.024).toFixed(1);
      ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`${distKm} km`, midX + 6, midY - 4);
    }
    ctx.setLineDash([]);

    // Draw station markers
    stations.forEach(st => {
      const sx = st.x * w;
      const sy = st.y * h;

      if (st.isHQ) {
        // Multi-ring radar pulse on HQ
        const pulseR = 12 + Math.sin(pulseAngle) * 8;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.arc(sx, sy, pulseR * 1.6, 0, Math.PI * 2);
        ctx.stroke();

        // HQ Solid pin
        ctx.beginPath();
        ctx.fillStyle = '#FFC800';
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Crosshairs
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx - 10, sy);
        ctx.lineTo(sx + 10, sy);
        ctx.moveTo(sx, sy - 10);
        ctx.lineTo(sx, sy + 10);
        ctx.stroke();

        // HQ Label badge
        ctx.fillStyle = 'rgba(5, 11, 23, 0.9)';
        ctx.strokeStyle = '#FFC800';
        ctx.lineWidth = 1;
        const bW = 200;
        const bH = 34;
        ctx.fillRect(sx - bW / 2, sy - 46, bW, bH);
        ctx.strokeRect(sx - bW / 2, sy - 46, bW, bH);

        ctx.fillStyle = '#FFC800';
        ctx.font = 'bold 10px Rajdhani, sans-serif';
        ctx.fillText(st.name, sx - bW / 2 + 8, sy - 32);
        ctx.fillStyle = '#00E5FF';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`PRIMARY DATUM [LAT 10.7867° / LON 79.1378°]`, sx - bW / 2 + 8, sy - 18);
      } else {
        // Satellite station dot
        ctx.beginPath();
        ctx.fillStyle = '#00E5FF';
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`${st.code}: ${st.name}`, sx + 12, sy + 3);
      }
    });

    requestAnimationFrame(renderMap);
  }

  renderMap();
}
