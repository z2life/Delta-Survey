# DELTA SURVEY ENGINEERING - Premium Web Application

> **Professional Land Surveying & Geospatial Technology Services**  
> Visual Identity: Land Surveying + Total Station + GPS/GNSS + Topographical Survey + Construction + Digital Mapping.

---

## Live Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server with hot module reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The application runs on `http://localhost:5173/`.

---

## Key Features & Visual Systems

1. **Cinematic Hero Section**:
   - Realistic surveying video background with dark navy/blue contrast overlays.
   - Real-time procedural topographic contour canvas engine (`src/js/topoCanvas.js`) rendering dynamic contour lines, benchmark nodes, and an interactive surveyor laser rangefinder targeting the user's cursor with real-time slope distance (`m`) and vertical angle (`°`).
   - Animated Geodetic HUD Telemetry box displaying live sub-millimeter coordinates (`LAT: 10.7867° N`, `LON: 79.1378° E`, `ELEV: 24.52 M`, `SATS: 19 SATS (FIX)`, `PRECISION: ±1.2mm Hz / ±1.6mm V`, `BEARING: 342° 18' 42"`).
   - Animated laser scanning beam sweeping down the page.

2. **Animated Geodetic Statistics**:
   - Viewport-triggered number counters (`1,500+ Projects`, `100% Accuracy`, `7+ Disciplines`, `24/7 Dispatch`).

3. **About Section ("Precision That Builds Confidence")**:
   - Geodetic control frameworks, field calibration standards, Leica TS16 robotic stations, and Trimble GNSS RTK capabilities.
   - High-resolution on-site surveyor photography with active telemetry tags.

4. **7 Core Surveying Services**:
   1. *Topographical Survey*
   2. *Property & Cadastral Demarcation*
   3. *Contour & Elevation Survey*
   4. *Building & Column Setting Out*
   5. *Boundary & Area Calculation (COGO)*
   6. *Airport & Runway Survey Work*
   7. *Online Building Approval CAD Prep*
   - Each card features technical tolerances, imagery, and interactive "Learn More" specification sheets.

5. **Interactive 5-Step Topo Transformation Pipeline**:
   - Live visual transformation: `Raw Terrain Inspection → Total Station Laser Scan → Coordinate Point Cloud → Contour DTM Surface → Certified Digital CAD Map`.
   - Dynamic canvas overlay and auto-play / pause controller.

6. **Total Station Technology Showcase ("Advanced Surveying Technology")**:
   - High-precision robotic Total Station visual with interactive hotspots:
     - *EDM Coaxial Laser Rangefinder (±1mm)*
     - *0.5" Optical Angle Encoders*
     - *Real-Time 3D Coordinate Engine*
     - *Sunlight-Readable CAD Field Controller*
     - *Dual-Axis Liquid Compensator*
   - 3D parallax tilt effect responding to cursor movement.

7. **Draggable Before / After Interactive Slider**:
   - Smooth split-screen comparison: *Real Site Photograph* vs *AutoCAD Civil 3D Topographic Contour Map*.
   - Draggable handle with touch, mouse, and keyboard arrow support.

8. **7-Step Geodetic Process Timeline**:
   - Glowing progress track from site reconnaissance and benchmark recovery to final certified engineering deliverables.

9. **Interactive Survey Scope & Cost Estimator**:
   - Select survey type, land area (Sq.Ft, Acres, Cents, Hectares), and terrain difficulty to receive instant estimated turnaround times, crew allocations, equipment rosters, and price estimates.
   - Direct "Apply to Survey Request" button transferring data to the booking form.

10. **Filterable Project Showcase**:
    - Filter projects by *Topographical, Construction Setting Out, Airport & Runway, Property & Cadastral*.

11. **Full-Width Dramatic CTA Section**:
    - High-impact nighttime surveying visual with sweeping cyan laser scanner and direct booking buttons.

12. **Online Survey Request Form & Geodetic Ticket Modal**:
    - Complete enquiry form with live GPS location grabber, document drag-and-drop zone, and validation.
    - High-tech loading state and animated Geodetic Dispatch Ticket modal (`DSE-2026-XXXX`) with printable confirmation.

13. **Contact Section & Interactive Dark GIS Map**:
    - Headquarters, CORS base stations, and airfield benchmarks connected with geodetic baseline vectors.
    - Real-time cursor coordinates and direct Google Maps link.
