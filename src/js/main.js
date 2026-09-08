/**
 * main.js
 * Primary Application Controller for DELTA SURVEY ENGINEERING
 */

import { initHeroCanvas } from './topoCanvas.js';
import { initHUDTelemetry } from './hudTelemetry.js';
import { initTopoTransform } from './topoTransform.js';
import { initBeforeAfterSlider } from './beforeAfter.js';
import { initTotalStationSection } from './totalStation.js';
import { initSurveyCalculator } from './surveyCalculator.js';
import { initSurveyForm } from './surveyForm.js';
import { initContactMap } from './mapInit.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas & HUD telemetry
  initHeroCanvas('hero-topo-canvas');
  initHUDTelemetry();
  initTopoTransform();
  initBeforeAfterSlider();
  initTotalStationSection();
  initSurveyCalculator();
  initSurveyForm();
  initContactMap();

  // 2. Navbar Scroll Effects
  const navbar = document.getElementById('main-nav');
  function handleNavScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-navy-950/95', 'shadow-2xl', 'border-cyan-500/30');
      navbar.classList.remove('bg-navy-950/85', 'border-cyan-500/15');
    } else {
      navbar.classList.remove('bg-navy-950/95', 'border-cyan-500/30');
      navbar.classList.add('bg-navy-950/85', 'border-cyan-500/15');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 3. Mobile App Navigation Drawer Controller
  const menuToggleBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('mobile-drawer-close');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

  function openMobileDrawer() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.add('is-open');
    mobileBackdrop.classList.add('is-open');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
    if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.remove('is-open');
    mobileBackdrop.classList.remove('is-open');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
    if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileDrawer();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileDrawer);
  }

  // Close drawer when clicking any link inside it
  mobileDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  });

  // 4. Desktop Dropdown Accessibility & Click Handling
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  dropdownWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.nav-dropdown-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = wrapper.classList.contains('active');
        dropdownWrappers.forEach(w => w.classList.remove('active'));
        if (!isOpen) {
          wrapper.classList.add('active');
        }
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-wrapper')) {
      dropdownWrappers.forEach(w => w.classList.remove('active'));
    }
  });

  // 5. Scrollspy for Desktop Nav & Mobile App Tab Bar
  const sections = [
    { id: 'hero', navKey: 'hero', tabKey: 'hero' },
    { id: 'about', navKey: 'about', tabKey: 'hero' },
    { id: 'services', navKey: 'services', tabKey: 'services' },
    { id: 'transformation', navKey: 'technology', tabKey: 'services' },
    { id: 'total-station', navKey: 'technology', tabKey: 'services' },
    { id: 'comparison', navKey: 'technology', tabKey: 'services' },
    { id: 'process', navKey: 'process', tabKey: 'projects' },
    { id: 'technology', navKey: 'technology', tabKey: 'services' },
    { id: 'calculator', navKey: 'calculator', tabKey: 'calculator' },
    { id: 'projects', navKey: 'projects', tabKey: 'projects' },
    { id: 'request-survey', navKey: 'calculator', tabKey: 'request-survey' },
    { id: 'contact', navKey: 'contact', tabKey: 'request-survey' }
  ];

  const desktopNavLinks = document.querySelectorAll('.nav-link[data-nav], .nav-dropdown-btn[data-nav]');
  const mobileTabLinks = document.querySelectorAll('.mobile-tab-item[data-tab]');

  function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 160;
    let currentSectionId = 'hero';

    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i].id);
      if (sectionEl) {
        const top = sectionEl.offsetTop;
        if (scrollPosition >= top) {
          currentSectionId = sections[i].id;
          break;
        }
      }
    }

    const currentMapping = sections.find(s => s.id === currentSectionId) || sections[0];

    // Update Desktop Nav Links
    desktopNavLinks.forEach(link => {
      const navKey = link.getAttribute('data-nav');
      if (navKey === currentMapping.navKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Tab Items
    mobileTabLinks.forEach(tab => {
      const tabKey = tab.getAttribute('data-tab');
      if (tabKey === currentMapping.tabKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavigation, { passive: true });
  updateActiveNavigation();

  // 4. Animated Number Counters on Viewport Entry
  const statNumbers = document.querySelectorAll('.counter-val');
  let countersStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1800; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  // 5. Projects Filter Gallery
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-surveyYellow', 'text-surveyYellow', 'bg-surveyYellow/10');
        b.classList.add('border-cyan-500/20', 'text-slate-400');
      });
      btn.classList.add('active', 'border-surveyYellow', 'text-surveyYellow', 'bg-surveyYellow/10');
      btn.classList.remove('border-cyan-500/20', 'text-slate-400');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // 6. Service Modal Technical Details
  const serviceModal = document.getElementById('service-detail-modal');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalSubtitle = document.getElementById('service-modal-subtitle');
  const serviceModalBody = document.getElementById('service-modal-body');
  const serviceModalEquip = document.getElementById('service-modal-equip');
  const serviceModalDeliverables = document.getElementById('service-modal-deliverables');
  const serviceModalClose = document.getElementById('service-modal-close');

  const serviceData = {
    'topographical': {
      title: 'Topographical Survey',
      subtitle: 'Terrain Elevation, Spot Heights & DTM Modeling',
      desc: 'Our topographical surveys provide complete, mm-precise three-dimensional mapping of natural and man-made features. Using robotic Total Stations and multi-frequency GNSS RTK receivers, we map spot heights, trees, watercourses, utility manholes, and perimeter boundaries. Essential for civil engineering design, architectural planning, drainage simulation, and cut/fill earthwork calculations.',
      equip: 'Leica TS16 0.5" Robotic Total Station, Trimble R12i GNSS RTK, Digital Level LS15',
      deliverables: 'AutoCAD DWG (2D/3D), LandXML DTM Surface, 0.2m / 1m Contour Vectors, ASCII/CSV Spot Heights, Georeferenced PDF Sheet'
    },
    'property': {
      title: 'Property & Cadastral Survey',
      subtitle: 'Boundary Demarcation & Legal Land Record Reconciliation',
      desc: 'Accurate boundary resolution backed by state land revenue records, title deeds, and field measurement books (FMB). We establish permanent geodetic boundary stones, verify encroachment risks, and supply court-admissible legal boundary documentation for residential, commercial, and agricultural acquisitions.',
      equip: 'Dual-Frequency GNSS RTK Rovers, Precision Steel Tapes, Total Station Optical Plummets',
      deliverables: 'Certified Boundary Demarcation Map, Adjacent Property Overlap Analysis, Area Certification, FMB Alignment Sheet'
    },
    'contour': {
      title: 'Contour & Elevation Survey',
      subtitle: 'High-Density Gradient Modeling & Slope Analysis',
      desc: 'Detailed hypsometric mapping revealing fine elevation gradients across rugged terrains, hillsides, and infrastructure corridors. Crucial for calculating water runoff channels, stormwater retention pond sizing, road vertical alignments, and retaining wall engineering.',
      equip: 'Drone LiDAR (DJI Zenmuse L2), Electronic Digital Auto Level, Prism Poles',
      deliverables: 'Color-Coded Elevation Heatmaps, Triangulated TIN Surface, Slope Gradient Profile Cross-Sections, DWG Contours'
    },
    'setting-out': {
      title: 'Building & Column Setting Out',
      subtitle: 'Sub-Millimeter Structural Grid & Piling Alignment',
      desc: 'Direct physical transfer of architectural and structural CAD drawings onto the construction ground. We stake out foundation grids, column centerlines, pile caps, elevator cores, and boundary setbacks with sub-millimeter precision to ensure zero contractor deviation.',
      equip: 'Sub-Millimeter Motorized Total Station, Mini Prism Kits, Diagonal Eyepieces, Laser Plummet',
      deliverables: 'Signed Setting-Out Certificate, Offset Point Reference Sheet, As-Built Deviation Quality Report, CAD Stakeout Plan'
    },
    'area': {
      title: 'Boundary & Area Calculation',
      subtitle: 'Mathematical Polygon Verification & Legal Certification',
      desc: 'High-accuracy closed traverse computation of boundary perimeters and total surface acreage. We compute exact areas in Sq.Ft, Square Meters, Acres, Cents, and Hectares using coordinate geometry (COGO) methods conforming to national survey standards.',
      equip: 'RTK CORS Network Corrections, High-Accuracy Total Station Traverse',
      deliverables: 'Closed Traverse Area Certificate, Perimeter Boundary Geometry Table, Coordinate Schedule Sheet'
    },
    'airport': {
      title: 'Airport & Runway Survey Work',
      subtitle: 'ICAO / FAA Precision Geodesy & Obstacle Limitation Surveys',
      desc: 'Specialized geodetic engineering for aerodromes, runway centerlines, taxiways, glide slope antennas, and obstacle limitation surfaces (OLS). Surveyed strictly adhering to Annex 14 aeronautical standards with millimeter-grade geodetic leveling.',
      equip: 'Dual Leica TS60 0.5" Instruments, Geodetic Invar Staves & Digital Levels, Dual Base RTK',
      deliverables: 'Runway Longitudinal & Transverse Gradient Profiles, OLS Penetration CAD Maps, Geodetic WGS84 Obstacle Matrix'
    },
    'online-approval': {
      title: 'Online Building Approval & CAD Prep',
      subtitle: 'Municipal Authority Compliance & Master Plan Drawings',
      desc: 'Preparation of digitized master site plans, building setback compliance drawings, road-widening alignment checks, and zoning layout documentation formatted specifically for statutory municipal online approval portals (CMDA, DTCP, Municipal Corporations).',
      equip: 'AutoCAD Civil 3D, GIS Spatial Integration, Master Plan Overlay Systems',
      deliverables: 'Municipal-Standard Colored Approval DWG/PDF, FSI / FAR Calculation Schedule, Statutory Survey Declaration'
    }
  };

  document.querySelectorAll('.service-learn-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      const data = serviceData[serviceKey];
      if (!data) return;

      if (serviceModalTitle) serviceModalTitle.textContent = data.title;
      if (serviceModalSubtitle) serviceModalSubtitle.textContent = data.subtitle;
      if (serviceModalBody) serviceModalBody.textContent = data.desc;
      if (serviceModalEquip) serviceModalEquip.textContent = data.equip;
      if (serviceModalDeliverables) serviceModalDeliverables.textContent = data.deliverables;

      if (serviceModal) {
        serviceModal.classList.remove('hidden');
        serviceModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (serviceModalClose && serviceModal) {
    serviceModalClose.addEventListener('click', () => {
      serviceModal.classList.add('hidden');
      serviceModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
      serviceModal.classList.add('hidden');
      serviceModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  });

  // 7. Dynamic Year in Footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) yearElem.textContent = new Date().getFullYear();
});
