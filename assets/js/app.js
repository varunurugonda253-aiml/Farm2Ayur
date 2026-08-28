/* ==========================================================================
   FARM2AYUR MOCK DATABASE
   ========================================================================== */
const herbsDb = {
  "ashwagandha": {
    id: "ashwagandha",
    name: "Ashwagandha",
    icon: "🌱",
    scientificName: "Withania somnifera",
    ayurvedicProperties: {
      rasa: "Tikta (Bitter), Katu (Pungent), Madhura (Sweet)",
      guna: "Laghu (Light), Snigdha (Unctuous)",
      virya: "Ushna (Hot)",
      vipaka: "Madhura (Sweet)"
    },
    activeBatches: ["ASH-2026-08"],
    description: "Ashwagandha is a premium adaptogenic root valued for over 3,000 years to relieve stress, enhance physical stamina, support cognitive health, and balance nervous system energy (Vata-Kapha pacifying).",
    benefits: ["Modulates cortisol levels to reduce stress", "Improves muscle strength and cardiorespiratory endurance", "Promotes restful sleep patterns"],
    certification: "USDA Organic, NPOP India, ISO 22000, GMP"
  },
  "turmeric": {
    id: "turmeric",
    name: "Turmeric (Haridra)",
    icon: "🧡",
    scientificName: "Curcuma longa",
    ayurvedicProperties: {
      rasa: "Tikta (Bitter), Katu (Pungent)",
      guna: "Ruksha (Dry), Laghu (Light)",
      virya: "Ushna (Hot)",
      vipaka: "Katu (Pungent)"
    },
    activeBatches: ["TUR-2026-09"],
    description: "A golden root famous for its curcumin content. Haridra is classically used to cleanse blood, support liver metabolism, improve skin glow, and provide potent natural anti-inflammatory activity.",
    benefits: ["Supports joint mobility and reduces inflammation", "Promotes healthy liver and gallbladder functions", "Purifies skin and protects cellular health"],
    certification: "Ecocert Organic, GMP Certified, AYUSH Premium Certificate"
  },
  "tulsi": {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    icon: "🌿",
    scientificName: "Ocimum sanctum",
    ayurvedicProperties: {
      rasa: "Katu (Pungent), Tikta (Bitter)",
      guna: "Laghu (Light), Ruksha (Dry), Teekshna (Sharp)",
      virya: "Ushna (Hot)",
      vipaka: "Katu (Pungent)"
    },
    activeBatches: ["TUL-2026-07"],
    description: "Known as the 'Queen of Herbs' or 'Holy Basil', Tulsi is a sacred adaptogen that purifies respiratory pathways, modulates emotional stress, and coordinates healthy immune cell defenses.",
    benefits: ["Supports deep respiratory comfort and clear lungs", "Enhances antibody production and immune speed", "Supports normal body temperature and detox flow"],
    certification: "USDA Organic, FairTrade Certified, Non-GMO Verified"
  },
  "shatavari": {
    id: "shatavari",
    name: "Shatavari",
    icon: "🌾",
    scientificName: "Asparagus racemosus",
    ayurvedicProperties: {
      rasa: "Madhura (Sweet), Tikta (Bitter)",
      guna: "Snigdha (Unctuous), Guru (Heavy)",
      virya: "Sheeta (Cold)",
      vipaka: "Madhura (Sweet)"
    },
    activeBatches: [],
    description: "Shatavari translates to 'she who possesses a hundred husbands,' referring to its traditional use as the premier systemic rejuvenative for the female reproductive tract, endocrine system, and digestive mucosa.",
    benefits: ["Soothes digestive membranes and balances stomach acid", "Nourishes female reproductive tissues and hormonal balance", "Cooling adaptogen that clears heat and stress"],
    certification: "OneCert Organic, HACCP Certified, AYUSH Premium Certificate"
  }
};

const batchesDb = {
  "ASH-2026-08": {
    batchId: "ASH-2026-08",
    herb: "ashwagandha",
    farmer: {
      name: "Ramesh Chandra",
      location: "Almora District, Uttarakhand, India",
      altitude: "1,600m (Himalayan foothills)",
      soilType: "Loamy-sandy soil rich in organic humus"
    },
    collector: {
      name: "Himalayan Herbs Cooperative",
      date: "2026-08-05"
    },
    processor: {
      name: "Purity Herbs Processing Ltd",
      location: "Haridwar, Uttarakhand",
      date: "2026-08-12",
      moistureContent: "6.2% (Standard: < 8.0%)",
      dryingMethod: "Solar shade dehydration"
    },
    qc: {
      status: "Approved",
      lab: "NABL Accredited Phytochemical Lab, Noida",
      date: "2026-08-18",
      activeContent: "Withanolides: 4.82% w/w (Standard: > 1.50%)",
      heavyMetals: "Below Detection Limits (Lead < 0.1ppm)",
      microbialLoad: "Compliant"
    },
    logistics: {
      carrier: "EcoCold Logistics",
      tempRange: "20°C - 24°C (Monitored via IoT)",
      dispatchDate: "2026-08-20"
    },
    manufacturer: {
      name: "AyurVeda Wellness Products",
      location: "Bangalore, Karnataka",
      date: "2026-08-25",
      product: "Ashwagandha Extract Capsules (500mg)",
      mfgBatch: "M-ASH-9981"
    }
  },
  "TUR-2026-09": {
    batchId: "TUR-2026-09",
    herb: "turmeric",
    farmer: {
      name: "Meenakshi Amma",
      location: "Wayanad District, Kerala, India",
      altitude: "850m (Western Ghats)",
      soilType: "Laterite red clay soil, high rainfall fed"
    },
    collector: {
      name: "Malabar Organic Farm Federation",
      date: "2026-08-10"
    },
    processor: {
      name: "Western Ghats Processing Center",
      location: "Kozhikode, Kerala",
      date: "2026-08-15",
      moistureContent: "7.00% (Standard: < 9.00%)",
      dryingMethod: "Low temperature electric drying"
    },
    qc: {
      status: "Approved",
      lab: "Kerala State Organic Testing Lab",
      date: "2026-08-22",
      activeContent: "Curcuminoids: 5.40% w/w (Standard: > 3.00%)",
      heavyMetals: "Below Detection Limits (Lead < 0.1ppm)",
      microbialLoad: "Compliant"
    },
    logistics: {
      carrier: "FastWay Logistics",
      tempRange: "Ambient dry ventilated storage",
      dispatchDate: "2026-08-24"
    },
    manufacturer: {
      name: "AyurVeda Wellness Products",
      location: "Bangalore, Karnataka",
      date: "2026-08-27",
      product: "Haridra Powder Capsules (400mg)",
      mfgBatch: "M-TUR-1044"
    }
  },
  "TUL-2026-07": {
    batchId: "TUL-2026-07",
    herb: "tulsi",
    farmer: {
      name: "Sohan Singh",
      location: "Kangra Valley, Himachal Pradesh, India",
      altitude: "1,200m (Dhauladhar range)",
      soilType: "Clay loam, organic rich compost fed"
    },
    collector: {
      name: "Kangra Bio-Reserve Alliance",
      date: "2026-07-15"
    },
    processor: {
      name: "Himalayan Naturals Plant",
      location: "Solan, Himachal Pradesh",
      date: "2026-07-20",
      moistureContent: "5.80% (Standard: < 7.00%)",
      dryingMethod: "Dehumidified chamber drying"
    },
    qc: {
      status: "Approved",
      lab: "Himalayan Bio-Resource Testing Lab",
      date: "2026-07-25",
      activeContent: "Ursolic Acid: 1.62% w/w (Standard: > 0.50%)",
      heavyMetals: "Below Detection Limits",
      microbialLoad: "Compliant"
    },
    logistics: {
      carrier: "EcoCold Logistics",
      tempRange: "18°C - 22°C (Monitored via IoT)",
      dispatchDate: "2026-07-27"
    },
    manufacturer: {
      name: "Organic Ayush Brews",
      location: "Delhi NCR",
      date: "2026-07-30",
      product: "Tulsi Adaptogen Tea Packets",
      mfgBatch: "T-TUL-3032"
    }
  }
};

/* Ecosystem Map Nodes */
const nodeDetails = {
  farmer: {
    title: "Farmers (Organic Cultivators)",
    desc: "Our farmers follow traditional organic cultivation guidelines mapped to WHO Good Agricultural and Collection Practices (GACP). Every soil layer is verified for organic carbon indices, moisture ratios, and complete absence of synthetic fertilizers or heavy metal runoff before seeding.",
    compliance: "WHO GACP, soil chemical audits, organic compost compliance.",
    registry: "320+ Registered farmers across Almora (Uttarakhand), Wayanad (Kerala), and Kangra (Himachal)."
  },
  collector: {
    title: "Collectors & Co-ops",
    desc: "Local cooperatives manage wildcrafting and crop aggregation. Herbs are sorted by size, washed in pristine mountain water, and graded according to structural standards (e.g. selecting thick, mature Ashwagandha roots while discarding thin twigs) to ensure high chemical marker density.",
    compliance: "Botanical identity verification, sorting SOP, humidity-controlled logistics bags.",
    registry: "14 Sourcing cooperatives linked directly to the Farm2Ayur ledger."
  },
  processor: {
    title: "Phytochemical Processors",
    desc: "Milling, slicing, solar drying, and extraction processes occur in GMP-certified units. Low-temperature air drying or shade drying preserves volatile oils and active secondary metabolites (Prana/Virya), preventing thermal degradation of crucial chemical components.",
    compliance: "GMP (Good Manufacturing Practices), moisture checks (< 8%), drying temperature loggers.",
    registry: "8 certified extraction and milling facilities located in clean industrial sectors."
  },
  labs: {
    title: "Quality Laboratories (QA)",
    desc: "Third-party NABL-accredited phytochemistry laboratories run high-precision assays. Each batch is verified using High-Performance Liquid Chromatography (HPLC) and atomic absorption spectroscopy for active markers, pesticide residue, and heavy metal concentrations.",
    compliance: "ISO/IEC 17025 accreditation, HPLC phytochemical assay validation, Heavy metal PPM limits.",
    registry: "3 accredited independent labs connected via secure API to ledger records."
  },
  logistics: {
    title: "Logistics & Transport",
    desc: "Raw material transport employs smart IoT tags. Sensors log real-time temperature, ambient humidity, and geographic movement to ensure that herbs are never exposed to damp environments, which could cause mold growth or chemical oxidation during transit.",
    compliance: "IoT real-time climate telemetry, clean transport compartment check, dust-tight sealing.",
    registry: "EcoCold Logistics and FastWay Logistics fleets integrated with active telemetry."
  },
  manufacturer: {
    title: "Formulation Manufacturers",
    desc: "Final packaging facilities convert herbal powders and extracts into standardized tablets, capsules, or loose tea blends. They run final purity audits, assign packaging serialization, and active the QR codes that bind the product to its blockchain trace record.",
    compliance: "Serialization registry, secondary microbial testing, AYUSH Premium sealing standards.",
    registry: "10 licensed wellness manufacturers packaging final shelf products."
  }
};

/* Page Navigation Menu Order for Directional Transitions */
const pageOrder = [
  'home',
  'explore',
  'herbs',
  'supply-chain',
  'knowledge',
  'contribute',
  'about',
  'contact'
];

/* Active state properties */
let activeView = 'home';

/* ==========================================================================
   CORE APPLICATION INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initHomeViews();
  initCatalog();
  initExploreViews();
  initSupplyChainMap();
  initContributeForm();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   SPA ROUTER (WITH DIRECTIONAL VIEW TRANSITIONS)
   ========================================================================== */
function initRouter() {
  // Catch link clicks for SPA routing
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // If it has parameters (e.g. #explore?batch=ASH) we let hashchange handle it
      if (href.includes('?')) return;
      
      e.preventDefault();
      window.location.hash = href;
    });
  });

  // Handle hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  // Initial load routing
  handleHashChange();
}

function handleHashChange() {
  const hashString = window.location.hash || '#home';
  const parts = hashString.split('?');
  const targetView = parts[0].substring(1);
  
  if (!pageOrder.includes(targetView)) {
    // Fallback to home
    navigateToView('home');
    return;
  }

  // Parse parameters if any
  const params = {};
  if (parts[1]) {
    const searchParams = new URLSearchParams(parts[1]);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }

  navigateToView(targetView, params);
}

function navigateToView(targetView, params = {}) {
  if (targetView === activeView) {
    handleViewParams(targetView, params);
    return;
  }

  // Close mobile drawer if open
  closeMobileDrawer();

  // Determine transition direction (forward / backward)
  const currentIndex = pageOrder.indexOf(activeView);
  const targetIndex = pageOrder.indexOf(targetView);
  const direction = targetIndex > currentIndex ? 'forward' : 'backward';

  // Toggle active styling on navigation items
  updateNavLinks(targetView);

  const updateDOM = () => {
    // Hide all views, show target view
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });
    const targetElement = document.getElementById(targetView);
    if (targetElement) {
      targetElement.classList.add('active');
    }
    
    // Set active page ref
    activeView = targetView;

    // Handle any sub-view params (e.g. search queries)
    handleViewParams(targetView, params);
  };

  // Check for browser support of View Transitions API
  if (!document.startViewTransition) {
    updateDOM();
    // Programmatic focus for accessibility
    document.querySelector(`#${targetView} h1`)?.focus();
    return;
  }

  // Execute transition with navigation types
  const transition = document.startViewTransition({
    update: updateDOM,
    types: [direction]
  });

  transition.finished.finally(() => {
    // Route focus to the main header of the target section
    document.querySelector(`#${targetView} h1`)?.focus();
  });
}

function updateNavLinks(targetView) {
  // Update desktop links
  document.querySelectorAll('.desktop-nav .nav-item').forEach(link => {
    if (link.getAttribute('data-view') === targetView) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile links
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    if (link.getAttribute('data-view') === targetView) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function handleViewParams(view, params) {
  // If navigating to Explore view with a batch parameter, auto-trace it
  if (view === 'explore' && params.batch) {
    const input = document.getElementById('exploreSearchInput');
    if (input) {
      input.value = params.batch;
      executeTrace(params.batch);
    }
  }
}

/* Mobile Drawer Logic */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');

if (mobileMenuBtn && mobileDrawer) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
  });
}

function closeMobileDrawer() {
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.classList.remove('open');
    mobileDrawer.classList.remove('open');
  }
}

/* ==========================================================================
   VIEW 1: HOME CONTROLLER
   ========================================================================== */
function initHomeViews() {
  // Load Featured Herbs Grid (First 3 herbs)
  const featuredGrid = document.getElementById('featuredHerbsGrid');
  if (featuredGrid) {
    featuredGrid.innerHTML = '';
    const featuredList = Object.values(herbsDb).slice(0, 3);
    
    featuredList.forEach(herb => {
      const card = document.createElement('div');
      card.className = 'card herb-featured-card';
      
      const propertiesHtml = Object.entries(herb.ayurvedicProperties)
        .map(([key, val]) => {
          const simpleVal = val.split('(')[0].trim();
          const cleanKey = key.charAt(0).toUpperCase() + key.slice(1);
          return `<span class="property-badge ${key === 'virya' ? 'highlight-virya' : ''}">${cleanKey}: ${simpleVal}</span>`;
        }).join('');

      card.innerHTML = `
        <div class="herb-card-img-wrap">
          ${herb.icon}
        </div>
        <div class="herb-card-content">
          <h3>${herb.name}</h3>
          <span class="sci-name">${herb.scientificName}</span>
          <p>${herb.description.substring(0, 110)}...</p>
          <div class="herb-property-tags">
            ${propertiesHtml}
          </div>
          <button type="button" class="btn btn-outline btn-sm explore-herb-btn" data-id="${herb.id}">
            View Profile
          </button>
        </div>
      `;
      featuredGrid.appendChild(card);
    });

    // Attach click events to "View Profile" buttons
    featuredGrid.querySelectorAll('.explore-herb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const herbId = btn.getAttribute('data-id');
        openHerbModal(herbId);
      });
    });
  }

  // Load Latest Verified Batches Grid
  const recentGrid = document.getElementById('recentBatchesGrid');
  if (recentGrid) {
    recentGrid.innerHTML = '';
    const recentBatches = Object.values(batchesDb).slice(0, 3);
    
    recentBatches.forEach(batch => {
      const herbName = herbsDb[batch.herb]?.name || 'Ayurvedic Herb';
      const card = document.createElement('div');
      card.className = 'card batch-card';
      card.innerHTML = `
        <div class="batch-card-top">
          <span class="batch-id-lbl">${batch.batchId}</span>
          <span class="batch-status-lbl">QC Verified</span>
        </div>
        <div class="batch-card-body">
          <h3>${herbName}</h3>
          <p class="farm-details">📍 Sourced from: ${batch.farmer.name}, ${batch.farmer.location.split(',')[0]}</p>
          <p style="font-size: 0.85rem; margin-bottom: 0;">Active Marker: <strong style="color: var(--gold-accent);">${batch.qc.activeContent.split('(')[0]}</strong></p>
        </div>
        <div class="batch-card-footer">
          <span class="batch-date-val">Log date: ${batch.qc.date}</span>
          <a href="#explore?batch=${batch.batchId}" class="btn-trace-link">Trace Journey &rarr;</a>
        </div>
      `;
      recentGrid.appendChild(card);
    });
  }

  // Handle Quick Trace Form submit
  const quickForm = document.getElementById('quickTraceForm');
  if (quickForm) {
    quickForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = document.getElementById('quickTraceInput').value.trim();
      if (val) {
        window.location.hash = `#explore?batch=${encodeURIComponent(val)}`;
      }
    });
  }

  // Home Suggestions Tags
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const batchId = tag.getAttribute('data-batch');
      window.location.hash = `#explore?batch=${encodeURIComponent(batchId)}`;
    });
  });

  // Footer Trace shortcuts
  document.querySelectorAll('.trace-shortcut').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const batchId = link.getAttribute('data-batch');
      window.location.hash = `#explore?batch=${encodeURIComponent(batchId)}`;
    });
  });
}

/* ==========================================================================
   VIEW 2: EXPLORE & TRACE CONTROLLER
   ========================================================================== */
function initExploreViews() {
  const exploreForm = document.getElementById('exploreSearchForm');
  if (exploreForm) {
    exploreForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = document.getElementById('exploreSearchInput').value.trim();
      if (val) {
        executeTrace(val);
      }
    });
  }

  // Sidebar shortcut buttons click
  document.querySelectorAll('.btn-shortcut').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-trace');
      const input = document.getElementById('exploreSearchInput');
      if (input) input.value = val;
      executeTrace(val);
    });
  });

  // QR Code Simulator click and scan simulation
  const qrCameraView = document.getElementById('qrCameraView');
  const scanMockBtn = document.getElementById('scanMockBtn');

  if (qrCameraView && scanMockBtn) {
    const triggerScan = () => {
      if (qrCameraView.classList.contains('scanning')) return;
      
      qrCameraView.classList.add('scanning');
      const placeholder = qrCameraView.querySelector('.qr-placeholder-text');
      if (placeholder) {
        placeholder.innerHTML = `
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📷</span>
          <strong>Camera Active</strong>
          <span style="font-size: 0.75rem;">Detecting batch QR serial tag...</span>
        `;
      }

      // 1.5 seconds mock scanning delay
      setTimeout(() => {
        qrCameraView.classList.remove('scanning');
        if (placeholder) {
          placeholder.innerHTML = `
            <span class="qr-icon">📱</span>
            <span>Click to scan simulated QR tag</span>
          `;
        }

        // Randomly pick one of our batches for scanning demo
        const batchKeys = Object.keys(batchesDb);
        const randomBatch = batchKeys[Math.floor(Math.random() * batchKeys.length)];
        
        const input = document.getElementById('exploreSearchInput');
        if (input) input.value = randomBatch;
        
        showToast(`QR Code identified: ${randomBatch}`);
        executeTrace(randomBatch);
      }, 1500);
    };

    qrCameraView.addEventListener('click', triggerScan);
    scanMockBtn.addEventListener('click', triggerScan);
  }
}

function executeTrace(query) {
  const emptyState = document.getElementById('traceEmptyState');
  const errorState = document.getElementById('traceErrorState');
  const loadedState = document.getElementById('traceLoadedState');

  if (!emptyState || !errorState || !loadedState) return;

  // Clean elements
  emptyState.classList.add('hidden');
  errorState.classList.add('hidden');
  loadedState.classList.add('hidden');

  const queryUpper = query.toUpperCase().trim();
  
  // 1. Try match direct batch ID
  let batch = batchesDb[queryUpper];

  // 2. If no direct batch match, search by herb name inside batch DB
  if (!batch) {
    const matchedHerb = Object.values(herbsDb).find(h => 
      h.name.toLowerCase().includes(query.toLowerCase()) || 
      h.scientificName.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedHerb && matchedHerb.activeBatches.length > 0) {
      batch = batchesDb[matchedHerb.activeBatches[0]];
    }
  }

  if (!batch) {
    // Show error state
    errorState.classList.remove('hidden');
    return;
  }

  // Populate loaded trace details
  loadedState.classList.remove('hidden');
  
  const herb = herbsDb[batch.herb];
  document.getElementById('resultBatchId').innerText = batch.batchId;
  document.getElementById('resultHerbName').innerText = herb?.name || 'Ayurvedic Herb';
  document.getElementById('resultScientificName').innerText = herb?.scientificName || '';
  document.getElementById('resultFarmerName').innerText = batch.farmer.name;
  document.getElementById('resultRegion').innerText = batch.farmer.location.split(',')[0] + ', ' + batch.farmer.location.split(',')[1];
  document.getElementById('resultActiveContent').innerText = batch.qc.activeContent.split('(')[0];

  // Step 1: Farm
  document.getElementById('stepFarmDate').innerText = batch.collector.date;
  document.getElementById('stepFarmOwner').innerText = `${batch.farmer.name} (${batch.farmer.location.split(',')[0]})`;
  document.querySelector('#stepFarm .node-meta').innerHTML = `
    <li><strong>Altitude:</strong> ${batch.farmer.altitude}</li>
    <li><strong>Soil Profile:</strong> ${batch.farmer.soilType}</li>
  `;

  // Step 2: Collector
  document.getElementById('stepCollectionDate').innerText = batch.collector.date;
  document.getElementById('stepCollectionOwner').innerText = batch.collector.name;

  // Step 3: Processor
  document.getElementById('stepProcessorDate').innerText = batch.processor.date;
  document.getElementById('stepProcessorOwner').innerText = `${batch.processor.name} (${batch.processor.location.split(',')[0]})`;
  document.querySelector('#stepProcessor .node-meta').innerHTML = `
    <li><strong>Drying Method:</strong> ${batch.processor.dryingMethod}</li>
    <li><strong>Moisture Assay:</strong> ${batch.processor.moistureContent}</li>
  `;

  // Step 4: Quality Checks
  document.getElementById('stepQCDate').innerText = batch.qc.date;
  document.getElementById('stepQCOwner').innerText = batch.qc.lab;
  document.getElementById('resultQCActive').innerText = batch.qc.activeContent.split('(')[0];
  document.querySelector('#stepQC .node-meta').innerHTML = `
    <li><strong>Heavy Metals:</strong> ${batch.qc.heavyMetals}</li>
    <li><strong>Microbial Load:</strong> ${batch.qc.microbialLoad}</li>
  `;

  // Step 5: Logistics
  document.getElementById('stepLogisticsDate').innerText = batch.logistics.dispatchDate;
  document.getElementById('stepLogisticsOwner').innerText = batch.logistics.carrier;
  document.querySelector('#stepLogistics .node-meta').innerHTML = `
    <li><strong>Ambient Temps:</strong> ${batch.logistics.tempRange}</li>
  `;

  // Step 6: Manufacturer
  document.getElementById('stepMfgDate').innerText = batch.manufacturer.date;
  document.getElementById('stepMfgOwner').innerText = `${batch.manufacturer.name} (${batch.manufacturer.location.split(',')[0]})`;
  document.querySelector('#stepManufacturer .node-meta').innerHTML = `
    <li><strong>Dosage Form:</strong> ${batch.manufacturer.product}</li>
    <li><strong>Serialization Code:</strong> ${batch.manufacturer.mfgBatch}</li>
  `;

  // Attach modal trigger to COA button
  const coaBtn = document.getElementById('btnDownloadCOA');
  if (coaBtn) {
    // Re-create listener to avoid multiple fires
    const newCoaBtn = coaBtn.cloneNode(true);
    coaBtn.parentNode.replaceChild(newCoaBtn, coaBtn);
    newCoaBtn.addEventListener('click', () => {
      openCoaModal(batch.batchId);
    });
  }
}

/* COA Modal Controllers */
const coaModal = document.getElementById('coaModal');
const btnCloseModal = document.getElementById('btnCloseModal');

if (coaModal && btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    coaModal.classList.add('hidden');
  });

  coaModal.addEventListener('click', e => {
    if (e.target === coaModal) {
      coaModal.classList.add('hidden');
    }
  });
}

function openCoaModal(batchId) {
  const batch = batchesDb[batchId];
  if (!batch || !coaModal) return;

  const herbName = herbsDb[batch.herb]?.name || 'Ayurvedic Herb';
  document.getElementById('modalHerbTitle').innerText = herbName + ' Roots Assay';
  document.getElementById('modalBatchId').innerText = batch.batchId;
  document.getElementById('modalActiveVal').innerText = batch.qc.activeContent.split('(')[0];
  document.getElementById('modalMoistureVal').innerText = batch.processor.moistureContent;

  coaModal.classList.remove('hidden');
  btnCloseModal.focus();
}

/* ==========================================================================
   VIEW 3: CATALOG & FILTER CONTROLLER
   ========================================================================== */
function initCatalog() {
  const catalogGrid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('catalogSearch');
  const rasaSelect = document.getElementById('filterRasa');
  const viryaSelect = document.getElementById('filterVirya');
  const resetBtn = document.getElementById('resetFilters');

  if (!catalogGrid) return;

  const renderCatalog = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedRasa = rasaSelect ? rasaSelect.value : '';
    const selectedVirya = viryaSelect ? viryaSelect.value : '';

    catalogGrid.innerHTML = '';

    const filtered = Object.values(herbsDb).filter(herb => {
      // Name Search
      const matchesSearch = herb.name.toLowerCase().includes(query) || 
                            herb.scientificName.toLowerCase().includes(query) ||
                            herb.description.toLowerCase().includes(query);
      
      // Rasa filter
      const matchesRasa = !selectedRasa || herb.ayurvedicProperties.rasa.includes(selectedRasa);
      
      // Virya filter
      const matchesVirya = !selectedVirya || herb.ayurvedicProperties.virya.includes(selectedVirya);

      return matchesSearch && matchesRasa && matchesVirya;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="card" style="grid-column: 1/-1; text-align: center; padding: var(--spacing-lg);">
          <span style="font-size: 2rem;">🌾</span>
          <h3 style="margin-top: 1rem;">No Herbs Found</h3>
          <p>Try resetting the search terms or filters to view the full directory.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(herb => {
      const card = document.createElement('div');
      card.className = 'card catalog-card';
      
      const propertiesHtml = Object.entries(herb.ayurvedicProperties)
        .map(([key, val]) => {
          const simpleVal = val.split('(')[0].trim();
          const cleanKey = key.charAt(0).toUpperCase() + key.slice(1);
          return `<span class="property-badge ${key === 'virya' ? 'highlight-virya' : ''}">${cleanKey}: ${simpleVal}</span>`;
        }).join('');

      card.innerHTML = `
        <div class="catalog-card-header">
          ${herb.icon}
        </div>
        <div class="catalog-card-body">
          <h3>${herb.name}</h3>
          <span class="sci-name">${herb.scientificName}</span>
          <p>${herb.description.substring(0, 140)}...</p>
          <div class="herb-property-tags">
            ${propertiesHtml}
          </div>
        </div>
        <div class="catalog-card-footer">
          <button type="button" class="btn btn-outline btn-sm explore-detail-btn" data-id="${herb.id}">
            Botanical Profile
          </button>
          ${herb.activeBatches.length > 0 
            ? `<a href="#explore?batch=${herb.activeBatches[0]}" class="btn-trace-link">Trace Batch &rarr;</a>` 
            : `<span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">No Active Batches</span>`
          }
        </div>
      `;
      catalogGrid.appendChild(card);
    });

    // Attach click events
    catalogGrid.querySelectorAll('.explore-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const herbId = btn.getAttribute('data-id');
        openHerbModal(herbId);
      });
    });
  };

  // Attach search triggers
  if (searchInput) searchInput.addEventListener('input', renderCatalog);
  if (rasaSelect) rasaSelect.addEventListener('change', renderCatalog);
  if (viryaSelect) viryaSelect.addEventListener('change', renderCatalog);
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (rasaSelect) rasaSelect.value = '';
      if (viryaSelect) viryaSelect.value = '';
      renderCatalog();
    });
  }

  // Initial load
  renderCatalog();
}

function openHerbModal(herbId) {
  const herb = herbsDb[herbId];
  if (!herb) return;

  // We can overlay a custom botanical modal or simply reuse parts of COA modal container
  // Let's create a dynamic modal in Javascript or reuse our existing modal shell!
  // To keep it clean and robust, we can dynamically build a Botanical Modal overlay
  let botModal = document.getElementById('botanicalModal');
  
  if (!botModal) {
    botModal = document.createElement('div');
    botModal.id = 'botanicalModal';
    botModal.className = 'modal-overlay hidden';
    document.body.appendChild(botModal);
  }

  const benefitsList = herb.benefits.map(b => `<li>✓ ${b}</li>`).join('');
  const activeBatchesHtml = herb.activeBatches.length > 0
    ? herb.activeBatches.map(b => `<a href="#explore?batch=${b}" class="btn btn-secondary btn-sm" onclick="document.getElementById('botanicalModal').classList.add('hidden')">Trace Batch ${b} &rarr;</a>`).join(' ')
    : '<span style="color: var(--text-muted);">No current active batches registered.</span>';

  botModal.innerHTML = `
    <div class="modal-box card">
      <button type="button" class="modal-close-btn" onclick="document.getElementById('botanicalModal').classList.add('hidden')">&times;</button>
      <div class="modal-header-info">
        <span class="modal-tag">Botanical Pharmacopoeia Profile</span>
        <h2>${herb.name}</h2>
        <p style="font-style: italic; color: var(--light-sage);">${herb.scientificName}</p>
      </div>
      
      <div class="modal-body-content" style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-top: 1rem;">
        <div>
          <h4>Herb Description</h4>
          <p style="font-size: 0.9rem; margin-top: 0.2rem;">${herb.description}</p>
        </div>

        <div class="grid grid-2" style="background: rgba(0,0,0,0.2); padding: var(--spacing-sm); border-radius: var(--border-radius-sm);">
          <div>
            <h4 style="color: var(--gold-accent); margin-bottom: 0.4rem;">Ayurvedic Properties</h4>
            <ul style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <li><strong>Rasa (Taste):</strong> ${herb.ayurvedicProperties.rasa}</li>
              <li><strong>Guna (Qualities):</strong> ${herb.ayurvedicProperties.guna}</li>
              <li><strong>Virya (Potency):</strong> ${herb.ayurvedicProperties.virya}</li>
              <li><strong>Vipaka (Post-Digestive):</strong> ${herb.ayurvedicProperties.vipaka}</li>
            </ul>
          </div>
          <div>
            <h4 style="color: var(--light-sage); margin-bottom: 0.4rem;">Key Health Benefits</h4>
            <ul style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.25rem;">
              ${benefitsList}
            </ul>
          </div>
        </div>

        <div>
          <h4>Regulatory & Certifications</h4>
          <p style="font-size: 0.85rem; margin-top: 0.2rem; color: var(--text-light);">${herb.certification}</p>
        </div>

        <div style="padding-top: var(--spacing-sm); border-top: 1px solid var(--border-glass);">
          <h4 style="margin-bottom: 0.5rem;">Ledger Activity</h4>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${activeBatchesHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  botModal.classList.remove('hidden');
  
  // Close handler when overlay clicked
  botModal.addEventListener('click', e => {
    if (e.target === botModal) {
      botModal.classList.add('hidden');
    }
  });

  botModal.querySelector('.modal-close-btn').focus();
}

/* ==========================================================================
   VIEW 4: SUPPLY CHAIN ECOSYSTEM CONTROLLER
   ========================================================================== */
function initSupplyChainMap() {
  const nodeButtons = document.querySelectorAll('.map-node-btn');
  const infoTitle = document.getElementById('nodeInfoTitle');
  const infoDesc = document.getElementById('nodeInfoDesc');
  const infoStats = document.querySelector('.node-info-stats');

  if (nodeButtons.length === 0 || !infoTitle || !infoDesc) return;

  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      nodeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const nodeKey = btn.getAttribute('data-node');
      const details = nodeDetails[nodeKey];

      if (details) {
        infoTitle.innerText = details.title;
        infoDesc.innerText = details.desc;
        infoStats.innerHTML = `
          <div><strong>Core Compliance:</strong> ${details.compliance}</div>
          <div><strong>Verified Registry:</strong> ${details.registry}</div>
        `;
      }
    });
  });
}

/* ==========================================================================
   VIEW 6: REGISTRATION CONTROLLER
   ========================================================================== */
function initContributeForm() {
  const tabs = document.querySelectorAll('.registration-tabs .tab-btn');
  const roleInput = document.getElementById('registerRole');
  const lblOrgName = document.getElementById('lblOrgName');
  const roleSpecificWrap = document.getElementById('roleSpecificWrap');
  const regForm = document.getElementById('registrationForm');
  const successState = document.getElementById('registrationSuccess');
  const resetBtn = document.getElementById('btnRegisterReset');

  if (tabs.length === 0 || !roleInput || !regForm || !successState) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const type = tab.getAttribute('data-type');
      roleInput.value = type;

      // Dynamically adjust inputs based on selected tab role
      if (type === 'farmer') {
        lblOrgName.innerText = "Farm / Organization Name";
        roleSpecificWrap.innerHTML = `
          <label for="regCertification">Organic Certifications & Registry ID</label>
          <input type="text" id="regCertification" placeholder="e.g. NPOP Organic ID: 9982-A, USDA Organic ID: Org-2219">
        `;
      } else if (type === 'collector') {
        lblOrgName.innerText = "Collection Cooperative Name";
        roleSpecificWrap.innerHTML = `
          <label for="regCertification">Sourcing License & Local Cooperative ID</label>
          <input type="text" id="regCertification" placeholder="e.g. Cooperative Registration Code: CC-9081">
        `;
      } else if (type === 'processor') {
        lblOrgName.innerText = "Processing Facility Name";
        roleSpecificWrap.innerHTML = `
          <label for="regCertification">GMP Certification Code & License ID</label>
          <input type="text" id="regCertification" placeholder="e.g. WHO-GMP Ref No: GMP-2025-IND-881">
        `;
      } else if (type === 'laboratory') {
        lblOrgName.innerText = "Analytical Lab Name";
        roleSpecificWrap.innerHTML = `
          <label for="regCertification">NABL Accreditation ID & Testing Standards</label>
          <input type="text" id="regCertification" placeholder="e.g. NABL Cert No: TC-7741 (Phytochemistry Testing)">
        `;
      } else if (type === 'manufacturer') {
        lblOrgName.innerText = "Manufacturing Company Name";
        roleSpecificWrap.innerHTML = `
          <label for="regCertification">AYUSH Manufacturing License & Serialization ID</label>
          <input type="text" id="regCertification" placeholder="e.g. Drug License No: DL-8891-A (Formulations)">
        `;
      }
    });
  });

  // Handle Form submit
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Simulate loading for 1 second
    const submitBtn = regForm.querySelector('button[type="submit"]');
    const oldBtnText = submitBtn.innerText;
    submitBtn.innerText = "Submitting Ledger Registry...";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerText = oldBtnText;
      submitBtn.disabled = false;
      
      // Clear forms
      regForm.reset();
      
      // Reveal success overlay
      successState.classList.remove('hidden');
      successState.focus();
    }, 1000);
  });

  // Handle reset success
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      successState.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   VIEW 8: FAQs & CONTACT
   ========================================================================== */
function initFaqAccordion() {
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const span = trigger.querySelector('span');

      // Close all other panels
      document.querySelectorAll('.faq-panel').forEach(p => {
        if (p !== panel) {
          p.style.maxHeight = null;
          p.previousElementSibling.querySelector('span').innerText = '+';
        }
      });

      // Toggle current panel
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        if (span) span.innerText = '+';
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        if (span) span.innerText = '-';
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const oldBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending Message...";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerText = oldBtnText;
      submitBtn.disabled = false;
      form.reset();
      showToast("Message sent! Our support team will respond shortly.");
    }, 800);
  });
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');
  
  if (!toast || !toastText) return;

  toastText.innerText = message;
  toast.classList.remove('hidden');

  // Slide up transition
  toast.style.animation = 'toast-fade-in 0.3s ease-out';

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}
