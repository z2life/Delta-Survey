/**
 * surveyForm.js
 * Professional Online Survey Request Form Controller & Geodetic Ticket Modal
 * Delta Survey Engineering
 */

export function initSurveyForm() {
  const form = document.getElementById('survey-request-form');
  const fileInput = document.getElementById('survey-file');
  const fileDropzone = document.getElementById('survey-dropzone');
  const fileList = document.getElementById('survey-file-list');
  const gpsBtn = document.getElementById('survey-get-gps-btn');
  const locationInput = document.getElementById('survey-location');
  const submitBtn = document.getElementById('survey-submit-btn');
  const modal = document.getElementById('survey-ticket-modal');
  const modalCloseBtn = document.getElementById('ticket-modal-close');
  const modalPrintBtn = document.getElementById('ticket-modal-print');

  if (!form) return;

  // File dropzone handling
  if (fileDropzone && fileInput) {
    fileDropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      fileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        fileDropzone.classList.add('border-surveyYellow', 'bg-surveyYellow/5');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      fileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        fileDropzone.classList.remove('border-surveyYellow', 'bg-surveyYellow/5');
      });
    });

    fileDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        renderFileList(fileInput.files);
      }
    });

    fileInput.addEventListener('change', () => {
      renderFileList(fileInput.files);
    });
  }

  function renderFileList(files) {
    if (!fileList) return;
    fileList.innerHTML = '';
    Array.from(files).forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-2 rounded bg-navy-900/60 border border-cyan-500/20 text-xs font-mono text-slate-300';
      item.innerHTML = `
        <span class="truncate max-w-[220px]">📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        <span class="text-cyan-400">READY</span>
      `;
      fileList.appendChild(item);
    });
  }

  // Geolocation Button
  if (gpsBtn && locationInput) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        gpsBtn.innerHTML = `<span class="animate-spin">⟳</span> GPS ACQUIRING...`;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            locationInput.value = `LAT: ${lat}° N, LON: ${lon}° E (GPS RTK FIX)`;
            gpsBtn.innerHTML = `✓ COORDINATES LOGGED`;
            gpsBtn.classList.add('text-surveyYellow');
          },
          (err) => {
            locationInput.value = `Site Location (Manual Entry Needed)`;
            gpsBtn.innerHTML = `📍 USE GPS LOCATION`;
            alert('Location access was denied or timed out. Please enter your project address manually.');
          },
          { timeout: 8000 }
        );
      } else {
        alert('Geolocation is not supported by your current browser.');
      }
    });
  }

  // Form Submit Handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Validation
    const name = document.getElementById('survey-name')?.value.trim();
    const phone = document.getElementById('survey-phone')?.value.trim();
    const email = document.getElementById('survey-email')?.value.trim();
    const service = document.getElementById('survey-service')?.value;
    const location = document.getElementById('survey-location')?.value.trim();

    if (!name || !phone || !email || !service || !location) {
      alert('Please complete all required fields (Name, Phone, Email, Service Type, and Project Location).');
      return;
    }

    // Show high-tech loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-navy-900 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>ENCRYPTING & DISPATCHING TO SURVEY HQ...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Populate Ticket Modal
      const ticketId = 'DSE-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('ticket-ref-id').textContent = ticketId;
      document.getElementById('ticket-client-name').textContent = name;
      document.getElementById('ticket-service-type').textContent = service.toUpperCase();
      document.getElementById('ticket-location-val').textContent = location;
      document.getElementById('ticket-timestamp').textContent = new Date().toLocaleString();

      // Show Modal
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
      if (fileList) fileList.innerHTML = '';
      if (gpsBtn) {
        gpsBtn.innerHTML = `📍 USE GPS LOCATION`;
        gpsBtn.classList.remove('text-surveyYellow');
      }
    }, 1200);
  });

  // Modal Close
  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
  }

  // Print Ticket
  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
