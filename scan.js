/**
 * ==========================================================================
 * FARM2AYUR — DEDICATED AI LEAF CAMERA SCANNER SCRIPT (scan.js)
 * Enhanced with:
 * - Drag-and-Drop Image Inspection Dropzone
 * - Reactive Cursor Dynamic Ambient Glow
 * - Real-Time Diagnostic HUD Strip Simulation
 * - Glassmorphism & Emerald Scanning Visualizer
 * - Accessible Keyboard Controls (Space, T, Z, Esc)
 * ==========================================================================
 */

let activeCameraStream = null;
let currentZoom = 1;
let isTorchOn = false;
let currentActiveHerb = 'tulsi';
let isScanningActive = false;

const botanicalKnowledgeBase = {
  tulsi: {
    name: "Holy Basil / Tulsi",
    scientificName: "Ocimum sanctum L.",
    family: "Lamiaceae",
    matchScore: "99.4%",
    dosha: "Kapha & Vata Balancer",
    activeCompound: "Eugenol (74.2%) & Ursolic Acid (3.1%)",
    notes: "Elliptic-oblong serrated aromatic leaves with rich glandular trichomes and deep purplish-green venation.",
    batchId: "TUL-2026-07"
  },
  ashwagandha: {
    name: "Ashwagandha (Indian Ginseng)",
    scientificName: "Withania somnifera (L.) Dunal",
    family: "Solanaceae",
    matchScore: "98.6%",
    dosha: "Vata & Kapha Pacifying",
    activeCompound: "Withaferin-A (4.82%) & Withanolide-D (1.2%)",
    notes: "Ovate dull-green leaves with stellate puberulous hairs. Adaptogenic root and leaf phytochemical vigor.",
    batchId: "ASH-2026-08"
  },
  neem: {
    name: "Neem (Arishta)",
    scientificName: "Azadirachta indica A. Juss.",
    family: "Meliaceae",
    matchScore: "97.8%",
    dosha: "Pitta & Kapha Cooling",
    activeCompound: "Azadirachtin (1.45%) & Nimbin",
    notes: "Asymmetric falcate lanceolate leaflets with deeply serrate margins and cooling bitter triterpenoids.",
    batchId: "NEE-2026-06"
  },
  brahmi: {
    name: "Brahmi (Gotu Kola)",
    scientificName: "Bacopa monnieri (L.) Wettst.",
    family: "Plantaginaceae",
    matchScore: "99.1%",
    dosha: "Pitta Pacifying & Medhya (Cognitive)",
    activeCompound: "Bacosides A & B (18.6%)",
    notes: "Spathulate fleshy succulent leaves with prominent neural clarity markers and micro-cellular venation.",
    batchId: "BRA-2026-05"
  },
  turmeric: {
    name: "Turmeric (Haridra)",
    scientificName: "Curcuma longa L.",
    family: "Zingiberaceae",
    matchScore: "96.9%",
    dosha: "Tridoshic (Vata, Pitta, Kapha)",
    activeCompound: "Total Curcuminoids (95.2%) & Bisdemethoxycurcumin",
    notes: "Broad oblong-lanceolate leaf sheaths rising from underground aromatic medicinal rhizomes.",
    batchId: "TUR-2026-09"
  }
};

const herbKeys = Object.keys(botanicalKnowledgeBase);

document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('scanVideoElement');
  const ambientFeed = document.getElementById('cameraAmbientFeed');
  const ambientSpecimen = document.getElementById('ambientLeafSpecimen');
  const activationOverlay = document.getElementById('cameraActivationOverlay');
  const startCameraBtn = document.getElementById('startLiveCameraBtn');
  const torchBtn = document.getElementById('scanTorchBtn');
  const torchGlow = document.getElementById('cameraTorchGlow');
  const zoomBtn = document.getElementById('scanZoomBtn');
  const zoomLevel = document.getElementById('scanZoomLevel');
  const shutterBtn = document.getElementById('scanShutterBtn');
  const galleryBtn = document.getElementById('scanGalleryBtn');
  const fileInput = document.getElementById('scanFileInput');
  const drawer = document.getElementById('scanResultDrawer');
  const drawerHandle = document.getElementById('scanDrawerHandle');
  const drawerContent = document.getElementById('scanDrawerContent');
  const infoBtn = document.getElementById('scanInfoBtn');
  const infoModal = document.getElementById('scanInfoModal');
  const infoCloseBtn = document.getElementById('scanInfoCloseBtn');
  const infoGotItBtn = document.getElementById('scanInfoGotItBtn');
  const infoBackdrop = document.getElementById('scanInfoModalBackdrop');
  const instructionMain = document.getElementById('scanInstructionMain');
  const viewportStage = document.getElementById('scannerViewportStage');
  const dragDropOverlay = document.getElementById('dragDropOverlay');
  const cursorGlow = document.getElementById('cursorAmbientGlow');
  
  // Diagnostic HUD Elements
  const hudLightingValue = document.getElementById('hudLightingValue');
  const hudFocusValue = document.getElementById('hudFocusValue');
  const hudConfidenceValue = document.getElementById('hudConfidenceValue');

  /* --------------------------------------------------------------------------
     1. Reactive Mouse Ambient Glow Source
     -------------------------------------------------------------------------- */
  if (cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursorGlow() {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursorGlow);
    }
    requestAnimationFrame(animateCursorGlow);
  }

  /* --------------------------------------------------------------------------
     2. Real-Time Diagnostic Stats Simulation
     -------------------------------------------------------------------------- */
  function updateDiagnosticStats(state = 'idle') {
    if (!hudLightingValue || !hudFocusValue || !hudConfidenceValue) return;

    if (state === 'scanning') {
      hudLightingValue.textContent = 'Analyzing (520 Lux)';
      hudFocusValue.textContent = 'Locking Venation...';
      hudConfidenceValue.textContent = 'Deep Neural Match';
    } else if (state === 'identified') {
      const current = botanicalKnowledgeBase[currentActiveHerb];
      hudLightingValue.textContent = 'Optimal (490 Lux)';
      hudFocusValue.textContent = 'Locked (99.4%)';
      hudConfidenceValue.textContent = `${current ? current.matchScore : '98.5%'} Match`;
    } else {
      hudLightingValue.textContent = 'Optimal (480 Lux)';
      hudFocusValue.textContent = 'Locked (98.6%)';
      hudConfidenceValue.textContent = 'Ready';
    }
  }

  /* --------------------------------------------------------------------------
     3. Request & Start Camera Stream
     -------------------------------------------------------------------------- */
  async function startCamera() {
    if (activationOverlay) activationOverlay.classList.add('hidden');
    if (instructionMain) instructionMain.textContent = "Align leaf within the emerald reticle";
    updateDiagnosticStats('idle');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (ambientFeed) ambientFeed.style.display = 'flex';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      activeCameraStream = stream;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.style.display = 'block';
        if (ambientFeed) ambientFeed.style.display = 'none';
      }
    } catch (err) {
      console.log("WebRTC camera access denied or unavailable, utilizing ambient botanical simulator:", err);
      if (ambientFeed) ambientFeed.style.display = 'flex';
      if (videoEl) videoEl.style.display = 'none';
    }
  }

  function stopCamera() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
  }

  window.addEventListener('beforeunload', stopCamera);

  if (startCameraBtn) {
    startCameraBtn.addEventListener('click', startCamera);
  }

  /* --------------------------------------------------------------------------
     4. Torch / Flashlight Toggle
     -------------------------------------------------------------------------- */
  if (torchBtn) {
    torchBtn.addEventListener('click', async () => {
      isTorchOn = !isTorchOn;
      torchBtn.classList.toggle('active', isTorchOn);
      if (torchGlow) torchGlow.classList.toggle('active', isTorchOn);

      if (hudLightingValue) {
        hudLightingValue.textContent = isTorchOn ? 'Torch Active (720 Lux)' : 'Optimal (480 Lux)';
      }

      if (activeCameraStream) {
        const track = activeCameraStream.getVideoTracks()[0];
        if (track && track.applyConstraints) {
          try {
            await track.applyConstraints({ advanced: [{ torch: isTorchOn }] });
          } catch (e) {
            // Hardware torch unavailable; simulated UI beam active
          }
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Digital Zoom Toggle (1x / 2x)
     -------------------------------------------------------------------------- */
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      currentZoom = currentZoom === 1 ? 2 : 1;
      if (zoomLevel) zoomLevel.innerText = `${currentZoom}x`;
      zoomBtn.classList.toggle('active', currentZoom === 2);
      
      const scaleStr = `scale(${currentZoom})`;
      if (videoEl) videoEl.style.transform = scaleStr;
      if (ambientFeed) ambientFeed.style.transform = scaleStr;

      if (hudFocusValue) {
        hudFocusValue.textContent = currentZoom === 2 ? 'Macro 2x (99.8%)' : 'Locked (98.6%)';
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Central Shutter Button
     -------------------------------------------------------------------------- */
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      if (activationOverlay) activationOverlay.classList.add('hidden');
      // Cycle through botanical specimens on repeated scans
      const nextIdx = (herbKeys.indexOf(currentActiveHerb) + 1) % herbKeys.length;
      currentActiveHerb = herbKeys[nextIdx];
      triggerBotanicalScan(currentActiveHerb);
    });
  }

  /* --------------------------------------------------------------------------
     7. Gallery Photo Upload & Drag-and-Drop Image Handlers
     -------------------------------------------------------------------------- */
  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (activationOverlay) activationOverlay.classList.add('hidden');
      if (ambientFeed) {
        ambientFeed.style.display = 'flex';
        ambientFeed.innerHTML = `
          <img src="${event.target.result}" alt="Uploaded Leaf Specimen" 
               style="width:100%; height:100%; object-fit:cover; filter: contrast(1.05) saturate(1.1);">
        `;
      }
      if (videoEl) videoEl.style.display = 'none';

      // Pick next interesting herb
      const nextIdx = (herbKeys.indexOf(currentActiveHerb) + 1) % herbKeys.length;
      currentActiveHerb = herbKeys[nextIdx];
      triggerBotanicalScan(currentActiveHerb);
    };
    reader.readAsDataURL(file);
  }

  // Gallery Button Click
  if (galleryBtn && fileInput) {
    galleryBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  // Desktop Drag-and-Drop Listeners
  if (viewportStage) {
    let dragCounter = 0;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      viewportStage.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    viewportStage.addEventListener('dragenter', (e) => {
      dragCounter++;
      if (dragDropOverlay) dragDropOverlay.classList.add('active');
    });

    viewportStage.addEventListener('dragleave', (e) => {
      dragCounter--;
      if (dragCounter <= 0 && dragDropOverlay) {
        dragDropOverlay.classList.remove('active');
        dragCounter = 0;
      }
    });

    viewportStage.addEventListener('drop', (e) => {
      dragCounter = 0;
      if (dragDropOverlay) dragDropOverlay.classList.remove('active');
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        handleImageFile(dt.files[0]);
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Botanical AI Scan Analysis Execution
     -------------------------------------------------------------------------- */
  function triggerBotanicalScan(herbKey) {
    if (isScanningActive) return;
    isScanningActive = true;

    const herbData = botanicalKnowledgeBase[herbKey] || botanicalKnowledgeBase.tulsi;
    
    if (instructionMain) {
      instructionMain.innerHTML = `<span style="color:var(--cyan-light);">⚡ Analyzing Neural Venation & Biomarkers...</span>`;
    }
    updateDiagnosticStats('scanning');

    // Visual feedback on shutter button
    if (shutterBtn) shutterBtn.style.transform = 'scale(0.92)';

    setTimeout(() => {
      if (shutterBtn) shutterBtn.style.transform = '';
      if (instructionMain) {
        instructionMain.innerHTML = `<span style="color:var(--emerald-light);">🌿 Identified: ${herbData.name} (${herbData.matchScore})</span>`;
      }
      updateDiagnosticStats('identified');

      renderResultDrawer(herbData, herbKey);
      if (drawer) drawer.classList.add('open');
      isScanningActive = false;
    }, 1200);
  }

  function renderResultDrawer(herbData, herbKey) {
    if (!drawerContent) return;
    drawerContent.innerHTML = `
      <div class="result-card-header">
        <div>
          <h3 class="result-herb-name" id="drawerHerbName">${herbData.name}</h3>
          <span class="result-scientific-name">${herbData.scientificName}</span>
        </div>
        <span class="result-match-badge">⚡ ${herbData.matchScore} Match</span>
      </div>

      <div class="result-tags-row">
        <span class="result-tag">🌿 Family: ${herbData.family}</span>
        <span class="result-tag">⚖️ ${herbData.dosha}</span>
      </div>

      <div class="result-phytochemicals">
        <strong>🔬 Active Phytochemical Compounds:</strong>
        <span>${herbData.activeCompound}</span>
      </div>

      <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.1rem;">
        <strong style="color:var(--emerald-light);">Morphological Notes:</strong> ${herbData.notes}
      </p>

      <div class="result-actions-grid">
        <a href="index.html#home" class="btn-primary-action" id="scanViewProfileBtn">
          🌿 View Pharmacopeia
        </a>
        <a href="index.html#supply-chain?batch=${herbData.batchId}" class="btn-secondary-action" id="scanTraceBatchBtn">
          🔗 Trace Batch (${herbData.batchId})
        </a>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     9. Drawer & Modal Controls
     -------------------------------------------------------------------------- */
  if (drawerHandle && drawer) {
    drawerHandle.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }

  if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', () => {
      infoModal.classList.add('open');
    });
  }

  [infoCloseBtn, infoGotItBtn, infoBackdrop].forEach(btn => {
    if (btn && infoModal) {
      btn.addEventListener('click', () => {
        infoModal.classList.remove('open');
      });
    }
  });

  /* --------------------------------------------------------------------------
     10. Keyboard Accessibility Shortcuts (Space, T, Z, Esc)
     -------------------------------------------------------------------------- */
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (shutterBtn) shutterBtn.click();
    } else if (e.key === 't' || e.key === 'T') {
      if (torchBtn) torchBtn.click();
    } else if (e.key === 'z' || e.key === 'Z') {
      if (zoomBtn) zoomBtn.click();
    } else if (e.key === 'Escape') {
      if (infoModal && infoModal.classList.contains('open')) {
        infoModal.classList.remove('open');
      } else if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    }
  });
});
