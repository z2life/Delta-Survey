/**
 * TopoCanvas.js
 * Procedural Topographic Contour Lines, Geodetic Grid & Laser Rangefinder Canvas Engine
 * Delta Survey Engineering
 */

export function initHeroCanvas(canvasId = 'hero-topo-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let time = 0;

  // Mouse interaction for surveyor laser rangefinder
  const mouse = {
    x: null,
    y: null,
    active: false
  };

  // Fixed survey benchmark points
  let benchmarks = [];

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    initBenchmarks();
  }

  function initBenchmarks() {
    benchmarks = [];
    const count = Math.floor(width / 180);
    for (let i = 0; i < count; i++) {
      benchmarks.push({
        x: (i + 0.5) * (width / count) + (Math.random() * 40 - 20),
        y: Math.random() * height * 0.75 + height * 0.15,
        elev: (18.4 + Math.random() * 24.2).toFixed(2),
        id: `BM-0${i + 1}`,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    } else {
      mouse.active = false;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Procedural Topographic Contour Lines Generator
  function drawContourLines() {
    const numLines = 14;
    const stepY = height / (numLines + 2);

    for (let i = 1; i <= numLines; i++) {
      const isMajor = i % 3 === 0;
      const baseY = i * stepY;

      ctx.beginPath();
      // Luminous gold for major contours, electric cyan for minor
      if (isMajor) {
        ctx.strokeStyle = 'rgba(255, 200, 0, 0.28)';
        ctx.lineWidth = 1.4;
      } else {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
        ctx.lineWidth = 0.8;
      }

      for (let x = 0; x <= width; x += 15) {
        // Multi-frequency sinusoidal elevation wave simulating rolling terrain
        const freq1 = 0.003;
        const freq2 = 0.007;
        const speed = time * 0.0006;
        const elevationOffset = 
          Math.sin(x * freq1 + speed + i * 0.5) * 35 +
          Math.cos(x * freq2 - speed * 0.8 + i) * 18 +
          Math.sin(x * 0.015 + time * 0.001) * 6;

        const y = baseY + elevationOffset;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Elevation text tag on major contours
      if (isMajor && width > 640) {
        const tagX = (width * 0.2 + i * 45) % (width * 0.85);
        const tagElevation = (10 + i * 2.5).toFixed(1);
        ctx.fillStyle = 'rgba(255, 200, 0, 0.45)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText(`+${tagElevation}m`, tagX, baseY - 5);
      }
    }
  }

  // Draw Geodetic Benchmarks and Coordinates
  function drawBenchmarks() {
    benchmarks.forEach((bm) => {
      bm.pulse += 0.03;
      const pulseRadius = 3 + Math.sin(bm.pulse) * 1.5;

      // Outer targeting circle
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.arc(bm.x, bm.y, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Center crosshair
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
      ctx.moveTo(bm.x - 6, bm.y);
      ctx.lineTo(bm.x + 6, bm.y);
      ctx.moveTo(bm.x, bm.y - 6);
      ctx.lineTo(bm.x, bm.y + 6);
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
      ctx.arc(bm.x, bm.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Technical Label
      ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`${bm.id} [Z:${bm.elev}m]`, bm.x + 14, bm.y + 3);
    });
  }

  // Laser Rangefinder Line from Total Station vantage (left bottom) to cursor
  function drawSurveyLaser() {
    if (!mouse.active || !mouse.x || !mouse.y) return;

    // Station tripod origin (bottom left or dynamic)
    const originX = width * 0.15;
    const originY = height * 0.85;

    // Laser beam
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 60, 60, 0.75)'; // Survey red laser
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 3]);
    ctx.moveTo(originX, originY);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Target reticle at mouse
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Reticle crosshairs
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
    ctx.moveTo(mouse.x - 22, mouse.y);
    ctx.lineTo(mouse.x + 22, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 22);
    ctx.lineTo(mouse.x, mouse.y + 22);
    ctx.stroke();

    // Distance calculation (simulated meters)
    const dx = mouse.x - originX;
    const dy = mouse.y - originY;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const distMeters = (distPx * 0.184).toFixed(3);
    const slopeDeg = (Math.atan2(-dy, dx) * (180 / Math.PI)).toFixed(2);

    // Live EDM Readout overlay near cursor
    ctx.fillStyle = 'rgba(5, 11, 23, 0.85)';
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.6)';
    ctx.lineWidth = 1;
    const boxW = 145;
    const boxH = 44;
    const boxX = Math.min(mouse.x + 18, width - boxW - 10);
    const boxY = Math.max(mouse.y - 48, 10);

    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#FFC800';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`SLOPE DIST: ${distMeters} m`, boxX + 8, boxY + 16);
    ctx.fillStyle = '#00E5FF';
    ctx.fillText(`VA ANGLE  : ${slopeDeg}°`, boxX + 8, boxY + 32);
  }

  function render() {
    time++;
    ctx.clearRect(0, 0, width, height);

    drawContourLines();
    drawBenchmarks();
    drawSurveyLaser();

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    }
  };
}
