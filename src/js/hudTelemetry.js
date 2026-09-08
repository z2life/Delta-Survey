/**
 * hudTelemetry.js
 * Professional Geodetic & Total Station Telemetry HUD Controller
 * Delta Survey Engineering
 */

export function initHUDTelemetry() {
  const latElem = document.getElementById('hud-lat');
  const lonElem = document.getElementById('hud-lon');
  const elevElem = document.getElementById('hud-elev');
  const satsElem = document.getElementById('hud-sats');
  const accElem = document.getElementById('hud-acc');
  const bearingElem = document.getElementById('hud-bearing');
  const pdopElem = document.getElementById('hud-pdop');

  let baseLat = 10.78672;
  let baseLon = 79.13784;
  let baseElev = 24.52;
  let baseBearingDeg = 342;
  let baseBearingMin = 18;
  let baseBearingSec = 42;

  function updateTelemetry() {
    // Subtle realistic sub-millimeter GNSS carrier phase fluctuations
    const latJitter = (Math.random() * 0.00004 - 0.00002);
    const lonJitter = (Math.random() * 0.00004 - 0.00002);
    const elevJitter = (Math.random() * 0.04 - 0.02);

    const currentLat = (baseLat + latJitter).toFixed(5);
    const currentLon = (baseLon + lonJitter).toFixed(5);
    const currentElev = (baseElev + elevJitter).toFixed(2);

    if (latElem) latElem.textContent = `${currentLat}° N`;
    if (lonElem) lonElem.textContent = `${currentLon}° E`;
    if (elevElem) elevElem.textContent = `${currentElev} M`;

    // Subtle bearing second jitter
    baseBearingSec = (baseBearingSec + (Math.floor(Math.random() * 3) - 1) + 60) % 60;
    if (bearingElem) {
      bearingElem.textContent = `${baseBearingDeg}° ${String(baseBearingMin).padStart(2, '0')}' ${String(baseBearingSec).padStart(2, '0')}"`;
    }

    // Occasional satellite / PDOP update
    if (Math.random() > 0.6) {
      const sats = 18 + Math.floor(Math.random() * 4);
      if (satsElem) satsElem.textContent = `${sats} SATS (FIX)`;
      if (pdopElem) pdopElem.textContent = `PDOP: ${(1.0 + Math.random() * 0.2).toFixed(2)}`;
    }

    if (accElem) {
      const hzAcc = (1.1 + Math.random() * 0.3).toFixed(1);
      const vAcc = (1.6 + Math.random() * 0.4).toFixed(1);
      accElem.textContent = `±${hzAcc}mm Hz / ±${vAcc}mm V`;
    }
  }

  // Update every 1.5 seconds for clean, non-distracting professional instrumentation
  const intervalId = setInterval(updateTelemetry, 1400);
  updateTelemetry();

  return () => clearInterval(intervalId);
}
