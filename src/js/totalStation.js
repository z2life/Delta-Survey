/**
 * totalStation.js
 * Advanced Total Station Technology Interactive Callouts & 3D Parallax Tilt
 * Delta Survey Engineering
 */

export function initTotalStationSection() {
  const container = document.getElementById('ts-interactive-container');
  const hotspots = document.querySelectorAll('.ts-hotspot');
  const detailTitle = document.getElementById('ts-callout-title');
  const detailSubtitle = document.getElementById('ts-callout-subtitle');
  const detailDesc = document.getElementById('ts-callout-desc');
  const detailSpecs = document.getElementById('ts-callout-specs');
  const svgLines = document.getElementById('ts-svg-lines');

  if (!container) return;

  const features = {
    edm: {
      title: 'High Precision Distance Measurement (EDM)',
      subtitle: 'Phase-Shift Electro-Optical Rangefinder',
      desc: 'Sub-millimeter coaxial red laser measuring distances up to 1,000 meters in reflectorless mode and 3,500 meters using standard prism targets.',
      specs: [
        'Accuracy: ±1.0 mm + 1.5 ppm',
        'Range: 1.5m to 3,500m (Prism)',
        'Measurement Time: < 0.3s rapid mode',
        'Beam Divergence: 8 x 20 mm at 50m'
      ]
    },
    angle: {
      title: '0.5" Angular Measurement Encoders',
      subtitle: 'Quad-Surface Absolute Optical Scanning',
      desc: 'Continuous diametrical angle reading ensures zero initialization lag. High-frequency angle measurement delivers uncompromising accuracy on boundary and setting out work.',
      specs: [
        'Standard Deviation: 0.5 arc-second',
        'Display Resolution: 0.1" / 0.01 mgon',
        'Sensor Type: Quad-surface absolute glass circle',
        'Compensation: Quadruple axis compensation'
      ]
    },
    coordinates: {
      title: 'Real-Time 3D Coordinate Data Engine',
      subtitle: 'XYZ Coordinate Extraction & Georeferencing',
      desc: 'Instant field transformation of raw slope distances and zenith angles into certified national grid Northing, Easting, and Elevation coordinates with automated atmospheric corrections.',
      specs: [
        'Coordinate Systems: WGS84, UTM, Local Grid',
        'Export Formats: DXF, LandXML, CSV, RAW',
        'Field Processing: Onboard Traverse Adjustment',
        'Point Storage: 100,000+ internal points'
      ]
    },
    display: {
      title: 'Digital High-Resolution Touch Interface',
      subtitle: 'Sunlight-Readable Rugged CAD Field Controller',
      desc: 'High-contrast full color touchscreen displaying live 3D DXF wireframes, design alignment baselines, and instant cut/fill stakeout deviations.',
      specs: [
        'Display: 5" High-Resolution WVGA Color Touch',
        'Operating Temp: -20°C to +50°C',
        'Protection: IP66 Water & Dust Resistant',
        'Connectivity: Long-range Bluetooth & 4G LTE'
      ]
    },
    compensator: {
      title: 'Electronic Dual-Axis Liquid Compensator',
      subtitle: 'Automatic Real-Time Instrument Leveling',
      desc: 'High-sensitivity liquid surface reflection monitors tripod stability and micro-vibrations continuously, applying automatic angular corrections to eliminate leveling errors.',
      specs: [
        'Setting Accuracy: 0.5 arc-second',
        'Compensator Range: ±4.0 arc-minutes',
        'Resolution: 0.1 arc-second',
        'Real-time Tilt Warning System'
      ]
    }
  };

  function selectFeature(featureKey) {
    const data = features[featureKey];
    if (!data) return;

    if (detailTitle) detailTitle.textContent = data.title;
    if (detailSubtitle) detailSubtitle.textContent = data.subtitle;
    if (detailDesc) detailDesc.textContent = data.desc;

    if (detailSpecs) {
      detailSpecs.innerHTML = data.specs
        .map(spec => `<li class="flex items-center gap-2 text-sm text-slate-300 font-mono"><span class="w-1.5 h-1.5 rounded-full bg-surveyYellow"></span>${spec}</li>`)
        .join('');
    }

    hotspots.forEach(hs => {
      if (hs.dataset.feature === featureKey) {
        hs.classList.add('active');
      } else {
        hs.classList.remove('active');
      }
    });
  }

  hotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      selectFeature(hs.dataset.feature);
    });
    hs.addEventListener('mouseenter', () => {
      selectFeature(hs.dataset.feature);
    });
  });

  // 3D Parallax Tilt Effect on mouse movement
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * -8;
    const tiltY = (x / rect.width) * 8;

    const card = container.querySelector('.ts-parallax-target');
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    const card = container.querySelector('.ts-parallax-target');
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  });

  // Initial selection
  selectFeature('edm');
}
