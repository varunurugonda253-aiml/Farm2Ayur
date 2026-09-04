/**
 * ==========================================================================
 * FARM2AYUR — HIGH-PRECISION SUPPLY CHAIN TRACEABILITY ENGINE (traceability.js)
 * Features:
 * - Typewriter Search Placeholder Loop
 * - Staggered Spring Pop-in Node Chain
 * - Dynamic Milestone Filling Progress Line
 * - 3D Parallax Tilt on Analytics Cards
 * - Hacker Terminal Typewriter for Merkle Hash
 * - Multi-Stage COA Download State Loader
 * - Ambient Floating Botanical Spores
 * - Sticky Glass Navbar Scroll Reactor
 * ==========================================================================
 */

export const traceabilityLedgerDb = {
  "ASH-2026-08": {
    batchId: "ASH-2026-08",
    herbName: "Ashwagandha (Indian Ginseng)",
    scientificName: "Withania somnifera (L.) Dunal",
    batchSize: "500 kg (Organic Grade A)",
    harvestDate: "August 2026",
    activeCompound: "Withaferin-A (4.82%) & Withanolide-D (1.2%)",
    activePercentage: "4.82%",
    purityScore: "99.4%",
    storageTemp: "21.4°C",
    tempPercent: 42,
    storageHumidity: "46% RH",
    humidityPercent: 46,
    ambientLux: "480 Lux",
    merkleHash: "0x7F9A8B4C1D3E2F5A6B8C0D2E4F6A8B0C2D4E6F8A",
    currentStageIndex: 3, // In Transit (0=Harvested, 1=Processed, 2=Tested, 3=In Transit, 4=Delivered)
    nodes: {
      farmer: {
        title: "Almora High-Altitude Organic Farms",
        role: "Organic Cultivator",
        location: "Almora, Uttarakhand (29.5971° N, 79.6591° E)",
        altitude: "1,820m MSL",
        operator: "Ramesh Chandra (Certified Master Grower)",
        compliance: "WHO-GACP & NPOP Certified Organic",
        soilProfile: "Virgin sandy loam, pH 7.2, 0% synthetic pesticides",
        signature: "0x4A8F...9E21 (Ed25519 Verified)",
        timestamp: "2026-08-01 06:30 IST"
      },
      collector: {
        title: "Himalayan Herbal Producers Collective",
        role: "Regional Grading & Sourcing Hub",
        location: "Ranikhet Hub, Uttarakhand",
        operator: "Sunita Bisht (Quality Inspector)",
        compliance: "ISO 9001:2015 Sorted & Air-Drying Standard",
        soilProfile: "Moisture Content: 9.8% (Target < 11%)",
        signature: "0x8C1D...3B5A (NPOP-Verified Collector)",
        timestamp: "2026-08-05 14:15 IST"
      },
      processor: {
        title: "Purity GMP Extraction Facility",
        role: "Solar Shade-Drying & Cryo-Milling",
        location: "Haridwar Bio-Park, Uttarakhand",
        operator: "Dr. Arvind Varma (Chief Phyto-Chemist)",
        compliance: "AYUSH GMP & US-FDA Facility Registered",
        soilProfile: "Standardized Withanolide Extraction (Supercritical CO2)",
        signature: "0x2E4F...6A8B (GMP-Certified Processor)",
        timestamp: "2026-08-12 11:00 IST"
      },
      labs: {
        title: "NABL Accredited Phytochemical Testing Lab",
        role: "Chromatography (HPLC/HPTLC) & Heavy Metal Assay",
        location: "New Delhi Central Analytical Labs",
        operator: "Dr. K. S. Ramanujam (Lead Analytical Biochemist)",
        compliance: "ISO/IEC 17025:2017 Accredited",
        soilProfile: "Heavy Metals: Lead (<0.01 ppm), Mercury (Undetected), Arsenic (<0.02 ppm)",
        signature: "0x9B0C...2D4E (NABL Digital Certificate #NABL-2026-8891)",
        timestamp: "2026-08-18 16:45 IST"
      },
      logistics: {
        title: "EcoCold IoT Monitored Transport",
        role: "Active Climate-Controlled Transit",
        location: "En route to Central Distribution (NH-44 Corridor)",
        operator: "Fleet Beacon IoT #TRK-904",
        compliance: "IoT Temperature Logged: Mean 21.4°C / 46% RH",
        soilProfile: "Real-Time Telemetry Stream Encrypted",
        signature: "0x3D5F...7A9C (IoT Smart Sensor Lock)",
        timestamp: "2026-08-20 09:20 IST"
      },
      manufacturer: {
        title: "AyurVeda Wellness Packaging & Formulations",
        role: "Dosage Formulation & QR Serialization",
        location: "Bengaluru AYUSH Bio-Hub, Karnataka",
        operator: "Production Batch Controller #M-88",
        compliance: "AYUSH Premium Mark Certified",
        soilProfile: "Serialized Unit Bottles with Tamper-Evident RFID/QR",
        signature: "0x5E7F...1A3C (Final Release Authorized)",
        timestamp: "2026-08-25 18:00 IST"
      }
    }
  },
  "TUR-2026-09": {
    batchId: "TUR-2026-09",
    herbName: "Lakadong Turmeric (High Curcumin)",
    scientificName: "Curcuma longa L.",
    batchSize: "750 kg (Triple Washed Rhizomes)",
    harvestDate: "September 2026",
    activeCompound: "Total Curcuminoids (95.4%) & Bisdemethoxycurcumin (3.2%)",
    activePercentage: "95.4%",
    purityScore: "99.8%",
    storageTemp: "22.8°C",
    tempPercent: 48,
    storageHumidity: "52% RH",
    humidityPercent: 52,
    ambientLux: "520 Lux",
    merkleHash: "0x9E2B4D6F8A0C2E4A6B8D0F2A4C6E8A0B2D4F6A8C",
    currentStageIndex: 4, // Delivered / Formulated
    nodes: {
      farmer: {
        title: "Lakadong Organic Valley Sanctuary",
        role: "Organic Cultivator",
        location: "Jaintia Hills, Meghalaya (25.5788° N, 91.8933° E)",
        altitude: "1,450m MSL",
        operator: "Kong Mary Lyngdoh (Organic Farm Lead)",
        compliance: "PGI Lakadong Authenticity Standard",
        soilProfile: "Red acidic loamy soil, organic mulching only",
        signature: "0x6E8A...0B2D (PGI-Certified Farmer)",
        timestamp: "2026-09-02 07:15 IST"
      },
      collector: {
        title: "Meghalaya Organic Spice Collective",
        role: "Sorting & Solar Drying",
        location: "Shillong Agro Hub, Meghalaya",
        operator: "David Kharbhih",
        compliance: "Clean Solar Tunnel Dried < 38°C",
        soilProfile: "Moisture Content: 8.4%",
        signature: "0x4F6A...8C0E (Collector Verified)",
        timestamp: "2026-09-06 12:30 IST"
      },
      processor: {
        title: "BioCurcumin Supercritical Refinery",
        role: "Oleoresin & Nano-Curcumin Extraction",
        location: "Guwahati Phyto-Park, Assam",
        operator: "Dr. B. C. Borah",
        compliance: "WHO-GMP Certified Cleanroom",
        soilProfile: "Curcuminoid Yield: 95.4% HPLC Assayed",
        signature: "0x8D0F...2A4C (Processor Signature)",
        timestamp: "2026-09-12 15:45 IST"
      },
      labs: {
        title: "Eurofins NABL Analytical Center",
        role: "Mass Spectrometry & Pesticide Screening",
        location: "Kolkata Analytical Labs",
        operator: "Dr. Ananya Sen",
        compliance: "Zero Heavy Metals & 100% Non-Irradiated",
        soilProfile: "Purity Index: 99.8%",
        signature: "0x2D4F...6A8C (Lab Certificate #EUR-9901)",
        timestamp: "2026-09-17 10:20 IST"
      },
      logistics: {
        title: "AirCargo PhytoSecure Express",
        role: "Monitored Cold Air Transport",
        location: "Delivered to Main Depot",
        operator: "Air Express Cargo Fleet",
        compliance: "Temperature Maintained: 22.8°C",
        soilProfile: "Transit Complete",
        signature: "0x0B2D...4F6A (Transit Clearance)",
        timestamp: "2026-09-21 14:00 IST"
      },
      manufacturer: {
        title: "Farm2Ayur Certified Botanical Depot",
        role: "Encapsulation & QR Serialization",
        location: "Pune Wellness Facility, Maharashtra",
        operator: "Lead Pharmacist R. Kulkarni",
        compliance: "AYUSH Premium Mark Ready",
        soilProfile: "Retail QR Serialized Bottles #TUR-9901",
        signature: "0x1A3C...5E7F (Batch Ready for Dispatch)",
        timestamp: "2026-09-24 17:30 IST"
      }
    }
  },
  "TUL-2026-07": {
    batchId: "TUL-2026-07",
    herbName: "Holy Basil / Tulsi (Krishna Tulsi)",
    scientificName: "Ocimum sanctum L.",
    batchSize: "400 kg (Whole Shade-Dried Leaves)",
    harvestDate: "July 2026",
    activeCompound: "Eugenol (74.2%) & Ursolic Acid (3.1%)",
    activePercentage: "74.2%",
    purityScore: "99.1%",
    storageTemp: "20.6°C",
    tempPercent: 38,
    storageHumidity: "44% RH",
    humidityPercent: 44,
    ambientLux: "460 Lux",
    merkleHash: "0x3A5C7E9B1D3F5A7C9E1B3D5F7A9C1E3B5D7F9A1C",
    currentStageIndex: 4,
    nodes: {
      farmer: {
        title: "Vrindavan Biodynamic Sanctuary",
        role: "Sacred Forest Cultivation",
        location: "Mathura Belts, UP (27.5816° N, 77.7006° E)",
        altitude: "170m MSL",
        operator: "Acharya Govind Das",
        compliance: "Vedic Biodynamic Farming & NPOP Organic",
        soilProfile: "Rich Yamuna silt, vermicompost nurtured",
        signature: "0x7A9C...1E3B (Certified Biodynamic)",
        timestamp: "2026-07-04 06:00 IST"
      },
      collector: {
        title: "Tulsi Mitra Farmer Society",
        role: "Handpicked Leaf Sorting",
        location: "Vrindavan Collection Hub",
        operator: "Radha Raman",
        compliance: "Leaves air-dried in darkened solar tents",
        soilProfile: "Moisture Content: 7.8%",
        signature: "0x5D7F...9A1C (Collector Verified)",
        timestamp: "2026-07-08 11:30 IST"
      },
      processor: {
        title: "AromaBio Essential Phyto-Lab",
        role: "Steam Distillation & Volatile Oil Capture",
        location: "Noida Bio-Processing Cluster",
        operator: "Dr. P. K. Sharma",
        compliance: "AYUSH GMP Certified",
        soilProfile: "Eugenol Assay: 74.2% GC-MS Verified",
        signature: "0x9E1B...3D5F (Processor Verified)",
        timestamp: "2026-07-14 14:20 IST"
      },
      labs: {
        title: "Central Drug Research Institute (CDRI) Partner Lab",
        role: "Bioactive Terpene Profiling",
        location: "Lucknow Analytical Complex",
        operator: "Dr. Meenakshi Joshi",
        compliance: "NABL Accredited & ISO 17025",
        soilProfile: "Purity Index: 99.1% Total Bioactive Markers",
        signature: "0x1D3F...5A7C (Lab Certificate #TUL-7782)",
        timestamp: "2026-07-19 16:15 IST"
      },
      logistics: {
        title: "GreenLogistics EV Fleet",
        role: "Zero-Emission Sealed Transport",
        location: "Transit Completed",
        operator: "EV Cargo Unit #09",
        compliance: "Temperature Logged: 20.6°C / 44% RH",
        soilProfile: "Sealed Cold Containers",
        signature: "0x3F5A...7C9E (Logistics Sign-off)",
        timestamp: "2026-07-23 10:00 IST"
      },
      manufacturer: {
        title: "Farm2Ayur Herbal Formulations",
        role: "Organic Herbal Infusion Packets",
        location: "Jaipur Clean facility, Rajasthan",
        operator: "Quality Manager S. Rathore",
        compliance: "Batch Serialized for Global Export",
        soilProfile: "Sealed Organic Tea Caddies #TUL-2026-07",
        signature: "0x7C9E...1B3D (Final Quality Approved)",
        timestamp: "2026-07-26 15:45 IST"
      }
    }
  }
};

export function initTraceabilityEngine() {
  const searchInput = document.getElementById('exploreSearchInput');
  const searchForm = document.getElementById('exploreSearchForm');
  const pasteBtn = document.getElementById('btnPasteId');
  const qrBtn = document.getElementById('btnQrScanTrigger');
  const statusFeedback = document.getElementById('traceStatusFeedback');
  const demoChips = document.querySelectorAll('.demo-chip-btn');
  const nodeButtons = document.querySelectorAll('.route-node-card');
  const copyHashBtn = document.getElementById('btnCopyHash');
  const coaBtn = document.getElementById('btnOpenCoaModal');
  const fillBar = document.getElementById('stepperActiveFillBar');

  let currentBatchId = "ASH-2026-08";

  /* ==========================================================================
     1. TYPEWRITER SEARCH EFFECT FOR PLACEHOLDER
     ========================================================================== */
  const placeholderPhrases = [
    'Try ASH-2026-08 (Ashwagandha)...',
    'Try TUR-2026-09 (Lakadong Turmeric)...',
    'Try TUL-2026-07 (Krishna Tulsi)...',
    'Try NEE-2026-06 (Organic Neem)...',
    'Try BRA-2026-05 (Gotu Kola / Brahmi)...'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isTypingActive = true;
  let typewriterTimeout = null;

  function typePlaceholder() {
    if (!searchInput || !isTypingActive) return;

    // Do not animate placeholder if user has typed something
    if (searchInput.value.length > 0 || document.activeElement === searchInput) {
      typewriterTimeout = setTimeout(typePlaceholder, 1000);
      return;
    }

    const currentPhrase = placeholderPhrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIndex));
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % placeholderPhrases.length;
        typewriterTimeout = setTimeout(typePlaceholder, 400);
        return;
      }
      typewriterTimeout = setTimeout(typePlaceholder, 30);
    } else {
      charIndex++;
      searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIndex));
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typewriterTimeout = setTimeout(typePlaceholder, 2200);
        return;
      }
      typewriterTimeout = setTimeout(typePlaceholder, 65);
    }
  }

  typePlaceholder();

  /* ==========================================================================
     2. QUICK CLIPBOARD PASTE HANDLER
     ========================================================================== */
  if (pasteBtn && searchInput) {
    pasteBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            searchInput.value = text.trim();
            handleTraceQuery(text.trim());
          }
        } else {
          searchInput.value = "ASH-2026-08";
          handleTraceQuery("ASH-2026-08");
        }
      } catch (err) {
        searchInput.value = "ASH-2026-08";
        handleTraceQuery("ASH-2026-08");
      }
    });
  }

  /* ==========================================================================
     3. SEARCH FORM & CHIPS
     ========================================================================== */
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (val) handleTraceQuery(val);
    });
  }

  demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      demoChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const batchId = chip.getAttribute('data-batch');
      if (searchInput) searchInput.value = batchId;
      handleTraceQuery(batchId);
    });
  });

  if (qrBtn) {
    qrBtn.addEventListener('click', () => {
      if (statusFeedback) {
        statusFeedback.innerHTML = `<span class="feedback-status-pulse"></span> Scanning camera stream for serialized QR tag...`;
      }
      setTimeout(() => {
        const keys = Object.keys(traceabilityLedgerDb);
        const rand = keys[Math.floor(Math.random() * keys.length)];
        if (searchInput) searchInput.value = rand;
        handleTraceQuery(rand);
      }, 1200);
    });
  }

  /* ==========================================================================
     4. TRACE QUERY PROCESSOR
     ========================================================================== */
  function handleTraceQuery(query) {
    const cleanId = query.toUpperCase().trim();
    let batch = traceabilityLedgerDb[cleanId];

    if (!batch) {
      const match = Object.values(traceabilityLedgerDb).find(b => 
        b.herbName.toLowerCase().includes(query.toLowerCase()) ||
        b.scientificName.toLowerCase().includes(query.toLowerCase())
      );
      if (match) batch = match;
    }

    if (!batch) {
      if (statusFeedback) {
        statusFeedback.innerHTML = `<span style="color:#ef4444;">❌</span> No ledger record matching "${query}". Try ASH-2026-08, TUR-2026-09, or TUL-2026-07.`;
      }
      return;
    }

    currentBatchId = batch.batchId;

    if (statusFeedback) {
      statusFeedback.innerHTML = `<span class="feedback-status-pulse"></span> Querying AYUSH Blockchain Ledger for ${batch.batchId}...`;
      setTimeout(() => {
        statusFeedback.innerHTML = `<span class="feedback-status-pulse" style="background:#06b6d4;"></span> Verifying Cryptographic Merkle Root (${batch.merkleHash.substring(0, 10)}...)...`;
        setTimeout(() => {
          statusFeedback.innerHTML = `<span class="feedback-status-pulse" style="background:#10b981;"></span> Trace Confirmed: ${batch.herbName} (${batch.purityScore} Purity)`;
          renderBatchTraceData(batch);
        }, 400);
      }, 350);
    } else {
      renderBatchTraceData(batch);
    }
  }

  /* ==========================================================================
     5. RENDER TRACE DATA & TRIGGER ANIMATIONS
     ========================================================================== */
  function renderBatchTraceData(batch) {
    // Header & Quick stats
    const tagEl = document.getElementById('viewBatchIdTag');
    const herbNameEl = document.getElementById('viewHerbName');
    const latinEl = document.getElementById('viewBotanicalLatin');
    const activeMarkerEl = document.getElementById('viewActiveMarkerQuick');
    const purityEl = document.getElementById('viewPurityScoreQuick');

    if (tagEl) tagEl.textContent = batch.batchId;
    if (herbNameEl) herbNameEl.textContent = batch.herbName;
    if (latinEl) latinEl.textContent = batch.scientificName;
    if (activeMarkerEl) activeMarkerEl.textContent = batch.activePercentage;
    if (purityEl) purityEl.textContent = batch.purityScore;

    // Environmental Telemetry Meters with Animated Bar Fill
    const tempValEl = document.getElementById('meterTempVal');
    const tempBarEl = document.getElementById('meterTempBar');
    const humValEl = document.getElementById('meterHumVal');
    const humBarEl = document.getElementById('meterHumBar');

    if (tempValEl) tempValEl.textContent = `${batch.storageTemp} (Optimal)`;
    if (humValEl) humValEl.textContent = batch.storageHumidity;

    if (tempBarEl) {
      tempBarEl.style.width = '0%';
      setTimeout(() => { tempBarEl.style.width = `${batch.tempPercent}%`; }, 100);
    }
    if (humBarEl) {
      humBarEl.style.width = '0%';
      setTimeout(() => { humBarEl.style.width = `${batch.humidityPercent}%`; }, 100);
    }

    // Botanical Specs
    const specBatchSize = document.getElementById('specBatchSize');
    const specHarvestDate = document.getElementById('specHarvestDate');
    const specActiveCompound = document.getElementById('specActiveCompound');
    const specPurity = document.getElementById('specPurityScore');

    if (specBatchSize) specBatchSize.textContent = batch.batchSize;
    if (specHarvestDate) specHarvestDate.textContent = batch.harvestDate;
    if (specActiveCompound) specActiveCompound.textContent = batch.activeCompound;
    if (specPurity) specPurity.textContent = `${batch.purityScore} Match`;

    // Terminal Hacker Typewriter for Merkle Hash
    typewriterTerminalHash(batch.merkleHash);

    // Staggered Node Pop-in & Spring Elastic Waves
    triggerStaggeredNodePopin();
    triggerBatchSpringPopWave();

    // Dynamic Stepper Filling Progress Bar
    updateTimelineProgress(batch.currentStageIndex);

    // Update Active Node Inspector
    updateNodeInspector('farmer', batch);
  }

  /* ==========================================================================
     6. STAGGERED NODE POP-IN ANIMATION
     ========================================================================== */
  function triggerStaggeredNodePopin() {
    nodeButtons.forEach((btn, idx) => {
      btn.classList.remove('stagger-pop');
      btn.style.animationDelay = `${idx * 0.08}s`;
      // Reflow
      void btn.offsetWidth;
      btn.classList.add('stagger-pop');
    });
  }

  /* ==========================================================================
     7. DYNAMIC MILESTONE FILLING PROGRESS LINE
     ========================================================================== */
  function updateTimelineProgress(activeStageIndex) {
    const stepperItems = document.querySelectorAll('.stepper-node-item');
    stepperItems.forEach((item, idx) => {
      item.classList.remove('completed', 'active');
      if (idx < activeStageIndex) {
        item.classList.add('completed');
      } else if (idx === activeStageIndex) {
        item.classList.add('active');
      }
    });

    if (fillBar) {
      // 5 stages: 0=0%, 1=22.5%, 2=45%, 3=67.5%, 4=90%
      const targetPercent = Math.min((activeStageIndex / 4) * 90, 90);
      fillBar.style.width = `${targetPercent}%`;
    }
  }

  /* ==========================================================================
     8. TERMINAL TYPEWRITER FOR MERKLE HASH
     ========================================================================== */
  let hashTypeInterval = null;
  function typewriterTerminalHash(hashText) {
    const hashEl = document.getElementById('authenticityHashCode');
    if (!hashEl) return;

    if (hashTypeInterval) clearInterval(hashTypeInterval);

    let currentLength = 0;
    hashEl.textContent = "";

    hashTypeInterval = setInterval(() => {
      if (currentLength < hashText.length) {
        currentLength += 2;
        hashEl.textContent = hashText.substring(0, currentLength) + (currentLength < hashText.length ? "▋" : "");
      } else {
        hashEl.textContent = hashText;
        clearInterval(hashTypeInterval);
      }
    }, 25);
  }

  /* ==========================================================================
     9. 3D PARALLAX TILT ON BOTTOM DATA CARDS
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.analytics-glass-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (-y / (rect.height / 2)) * 7;
      const rotateY = (x / (rect.width / 2)) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* ==========================================================================
     10. NODE INSPECTOR CLICK HANDLERS & DUAL-RING SONAR
     ========================================================================== */
  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      nodeButtons.forEach(b => {
        b.classList.remove('active');
        const sonar1 = b.querySelector('.node-active-sonar');
        const sonar2 = b.querySelector('.node-active-sonar-2');
        if (sonar1) sonar1.remove();
        if (sonar2) sonar2.remove();
      });

      btn.classList.add('active');
      const iconCircle = btn.querySelector('.node-icon-circle');
      if (iconCircle) {
        const s1 = document.createElement('span');
        s1.className = 'node-active-sonar';
        const s2 = document.createElement('span');
        s2.className = 'node-active-sonar-2';
        iconCircle.appendChild(s1);
        iconCircle.appendChild(s2);
      }

      const nodeKey = btn.getAttribute('data-node');
      const batch = traceabilityLedgerDb[currentBatchId] || traceabilityLedgerDb["ASH-2026-08"];
      updateNodeInspector(nodeKey, batch);
    });
  });

  function updateNodeInspector(nodeKey, batch) {
    const nodeData = batch.nodes[nodeKey] || batch.nodes.farmer;
    const titleEl = document.getElementById('inspectorFacilityTitle');
    const descEl = document.getElementById('inspectorFacilityDesc');
    const operatorEl = document.getElementById('inspectorOperator');
    const complianceEl = document.getElementById('inspectorCompliance');
    const signatureEl = document.getElementById('inspectorSignature');
    const timestampEl = document.getElementById('inspectorTimestamp');

    if (titleEl) titleEl.textContent = nodeData.title;
    if (descEl) descEl.textContent = `${nodeData.location} • ${nodeData.soilProfile}`;
    if (operatorEl) operatorEl.textContent = nodeData.operator;
    if (complianceEl) complianceEl.textContent = nodeData.compliance;
    if (signatureEl) signatureEl.textContent = nodeData.signature;
    if (timestampEl) timestampEl.textContent = nodeData.timestamp;
  }

  /* ==========================================================================
     11. ONE-CLICK COPY MERKLE HASH
     ========================================================================== */
  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', async () => {
      const hashText = document.getElementById('authenticityHashCode')?.textContent;
      if (hashText) {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(hashText);
          }
          copyHashBtn.innerHTML = `✓ Copied`;
          typewriterTerminalHash(hashText);
          setTimeout(() => {
            copyHashBtn.innerHTML = `📋 Copy Hash`;
          }, 2000);
        } catch (e) {
          copyHashBtn.innerHTML = `✓ Copied`;
          typewriterTerminalHash(hashText);
          setTimeout(() => {
            copyHashBtn.innerHTML = `📋 Copy Hash`;
          }, 2000);
        }
      }
    });
  }

  /* ==========================================================================
     12. MULTI-STAGE COA DOWNLOAD BUTTON WITH LOADER
     ========================================================================== */
  if (coaBtn) {
    coaBtn.addEventListener('click', () => {
      if (coaBtn.classList.contains('loading')) return;

      coaBtn.classList.add('loading');
      coaBtn.innerHTML = `<span class="coa-spinner"></span> Generating Cryptographic COA...`;

      setTimeout(() => {
        coaBtn.innerHTML = `✓ Certificate Verified & Ready`;

        setTimeout(() => {
          const modal = document.getElementById('coaModal');
          const batch = traceabilityLedgerDb[currentBatchId] || traceabilityLedgerDb["ASH-2026-08"];
          if (modal) {
            const title = document.getElementById('modalHerbTitle');
            const batchIdEl = document.getElementById('modalBatchId');
            const activeVal = document.getElementById('modalActiveVal');
            const moistureVal = document.getElementById('modalMoistureVal');

            if (title) title.textContent = `${batch.herbName} Analytical Certificate`;
            if (batchIdEl) batchIdEl.textContent = batch.batchId;
            if (activeVal) activeVal.textContent = batch.activeCompound;
            if (moistureVal) moistureVal.textContent = "6.2% (Passed NABL)";

            modal.classList.remove('hidden');
          }

          coaBtn.classList.remove('loading');
          coaBtn.innerHTML = `📄 Download Lab Certificate (COA)`;
        }, 700);
      }, 1000);
    });
  }

  /* ==========================================================================
     13. FLOATING BOTANICAL SPORES (Delegated to universal botanical-spores.js)
     ========================================================================== */

  /* 14. STICKY GLASS NAVBAR SCROLL REACTOR */
  
  const appHeader = document.querySelector('.app-header');
  if (appHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        appHeader.classList.add('scrolled-dock');
      } else {
        appHeader.classList.remove('scrolled-dock');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     15. UNIVERSAL SPRING ELASTIC POP-UP OBSERVER (DOMINO CASCADE)
     ========================================================================== */
  function initSpringPopObserver() {
    const springTargets = document.querySelectorAll('.spring-pop-target');
    if (!springTargets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Calculate stagger delay if part of a list/grid
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll('.spring-pop-target'));
            const idx = siblings.indexOf(el);
            if (idx >= 0) {
              el.style.setProperty('--spring-delay', `${idx * 0.08}s`);
            }
          }

          el.classList.add('spring-popped');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    springTargets.forEach(target => observer.observe(target));
  }

  function triggerBatchSpringPopWave() {
    const dynamicTargets = document.querySelectorAll('.route-node-card, .analytics-glass-card, #facilityNodeInspector');
    dynamicTargets.forEach((el, idx) => {
      el.classList.remove('spring-popped');
      el.style.setProperty('--spring-delay', `${(idx % 6) * 0.08}s`);
      void el.offsetWidth; // Force CSS reflow
      el.classList.add('spring-popped');
    });
  }

  initSpringPopObserver();

  // Initial render on boot
  renderBatchTraceData(traceabilityLedgerDb["ASH-2026-08"]);
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTraceabilityEngine);
} else {
  initTraceabilityEngine();
}
