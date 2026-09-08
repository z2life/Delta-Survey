/**
 * beforeAfter.js
 * High-Precision Interactive Before / After Split Slider
 * Real Site Photography vs Digital AutoCAD Contour & GIS Data
 * Delta Survey Engineering
 */

export function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-container');
  const afterWrapper = document.getElementById('after-image-wrapper');
  const handle = document.getElementById('before-after-handle');
  const coordBadge = document.getElementById('ba-coord-badge');

  if (!container || !afterWrapper || !handle) return;

  let isDragging = false;
  let currentPercentage = 50;

  function setSliderPosition(percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    currentPercentage = percentage;
    afterWrapper.style.width = `${100 - percentage}%`;
    handle.style.left = `${percentage}%`;

    if (coordBadge) {
      const simulatedEast = (345600 + (percentage / 100) * 180).toFixed(2);
      const simulatedNorth = (5432100 + (percentage / 100) * 90).toFixed(2);
      coordBadge.textContent = `E: ${simulatedEast}m | N: ${simulatedNorth}m`;
    }
  }

  function handleMove(clientX) {
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    setSliderPosition(percentage);
  }

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    container.classList.add('dragging');
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  // Touch events for mobile/tablet
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  // Click on container jumps slider
  container.addEventListener('click', (e) => {
    if (e.target.closest('#before-after-handle')) return;
    handleMove(e.clientX);
  });

  // Keyboard accessibility
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'slider');
  container.setAttribute('aria-label', 'Real site vs digital survey data comparison slider');
  container.setAttribute('aria-valuenow', '50');
  container.setAttribute('aria-valuemin', '0');
  container.setAttribute('aria-valuemax', '100');

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition(currentPercentage - 5);
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(currentPercentage + 5);
    }
  });

  // Initialize at 50%
  setSliderPosition(50);
}
