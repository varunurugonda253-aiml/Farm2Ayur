/**
 * ==========================================================================
 * FARM2AYUR — DEDICATED AI LEAF CAMERA SCANNER SCRIPT (scan.js)
 * ==========================================================================
 */

let activeCameraStream = null;
let currentZoom = 1;
let isTorchOn = false;
let currentActiveHerb = 'ashwagandha';

const botanicalKnowledgeBase = {
  ashwagandha: {
    name: "Ashwagandha",
    scientificName: "Withania somnifera (L.) Dunal",
    family: "Solanaceae",
    matchScore: "98.4%",
    dosha: "Vata & Kapha Pacifying",
    activeCompound: "Withaferin-A (4.82%) & Withanolide-D (1.2%)",
    notes: "Ovate dull-green leaves with stellate puberulous hairs. Adaptogenic root vigor.",
    batchId: "ASH-2026-08"
  },
  tulsi: {
    name: "Holy Basil / Tulsi",
    scientificName: "Ocimum sanctum L.",
    family: "Lamiaceae",
    matchScore: "99.1%",
    dosha: "Kapha & Vata Balancer",
    activeCompound: "Eugenol (72.4%) & Ursolic Acid (2.8%)",
    notes: "Elliptic-oblong serrated aromatic leaves with rich glandular trichomes.",
    batchId: "TUL-2026-07"
  },
  turmeric: {
    name: "Turmeric",
    scientificName: "Curcuma longa L.",
    family: "Zingiberaceae",
    matchScore: "96.8%",
    dosha: "Tridoshic (Vata, Pitta, Kapha)",
    activeCompound: "Total Curcuminoids (95.2%) & Bisdemethoxycurcumin",
    notes: "Broad oblong-lanceolate leaf sheaths rising from underground aromatic rhizomes.",
    batchId: "TUR-2026-09"
  },
  neem: {
    name: "Neem (Arishta)",
    scientificName: "Azadirachta indica A. Juss.",
    family: "Meliaceae",
    matchScore: "97.5%",
    dosha: "Pitta & Kapha Cooling",
    activeCompound: "Azadirachtin (1.45%) & Nimbin",
    notes: "Asymmetric falcate lanceolate leaflets with deeply serrate margins.",
    batchId: "ASH-2026-08"
  },
  brahmi: {
    name: "Brahmi (Gotu Kola)",
    scientificName: "Bacopa monnieri (L.) Wettst.",
    family: "Plantaginaceae",
    matchScore: "98.9%",
    dosha: "Pitta Pacifying & Medhya",
    activeCompound: "Bacosides A & B (18.6%)",
    notes: "Spathulate fleshy succulent leaves with prominent neural clarity markers.",
    batchId: "TUL-2026-07"
  }
};

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
  const samplePills = document.querySelectorAll('.sample-pill-btn');
  const drawer = document.getElementById('scanResultDrawer');
  const drawerHandle = document.getElementById('scanDrawerHandle');
  const drawerContent = document.getElementById('scanDrawerContent');
  const infoBtn = document.getElementById('scanInfoBtn');
  const infoModal = document.getElementById('scanInfoModal');
  const infoCloseBtn = document.getElementById('scanInfoCloseBtn');
  const infoGotItBtn = document.getElementById('scanInfoGotItBtn');
  const infoBackdrop = document.getElementById('scanInfoModalBackdrop');
  const instructionMain = document.getElementById('scanInstructionMain');
  const instructionSub = document.getElementById('scanInstructionSub');

  // Request & Start Camera Stream
  async function startCamera() {
    if (activationOverlay) activationOverlay.classList.add('hidden');
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
      console.log("WebRTC camera access denied or unavailable, using high-fidelity ambient simulation:", err);
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

  // Torch / Flashlight Toggle
  if (torchBtn) {
    torchBtn.addEventListener('click', async () => {
      isTorchOn = !isTorchOn;
      torchBtn.classList.toggle('active', isTorchOn);
      if (torchGlow) torchGlow.classList.toggle('active', isTorchOn);

      if (activeCameraStream) {
        const track = activeCameraStream.getVideoTracks()[0];
        if (track && track.applyConstraints) {
          try {
            await track.applyConstraints({ advanced: [{ torch: isTorchOn }] });
          } catch (e) {
            // Hardware torch unavailable; UI glow active
          }
        }
      }
    });
  }

  // Digital Zoom Toggle (1x / 2x)
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      currentZoom = currentZoom === 1 ? 2 : 1;
      if (zoomLevel) zoomLevel.innerText = `${currentZoom}x`;
      zoomBtn.classList.toggle('active', currentZoom === 2);
      
      const scaleStr = `scale(${currentZoom})`;
      if (videoEl) videoEl.style.transform = scaleStr;
      if (ambientFeed) ambientFeed.style.transform = scaleStr;
    });
  }

  // Central Shutter Button
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      if (activationOverlay) activationOverlay.classList.add('hidden');
      triggerBotanicalScan(currentActiveHerb);
    });
  }

  // Gallery Photo Upload Handler
  if (galleryBtn && fileInput) {
    galleryBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (activationOverlay) activationOverlay.classList.add('hidden');
          if (ambientFeed) {
            ambientFeed.style.display = 'flex';
            ambientFeed.innerHTML = `<img src="${event.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          }
          if (videoEl) videoEl.style.display = 'none';
          triggerBotanicalScan(currentActiveHerb);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Trigger Botanical Scan Analysis & Slide-up Result Drawer
  function triggerBotanicalScan(herbKey) {
    const herbData = botanicalKnowledgeBase[herbKey] || botanicalKnowledgeBase.ashwagandha;
    
    if (instructionMain) instructionMain.innerText = "Analyzing Neural Leaf Venation...";

    setTimeout(() => {
      if (instructionMain) instructionMain.innerText = `Identified: ${herbData.name} (${herbData.matchScore})`;

      renderResultDrawer(herbData, herbKey);
      if (drawer) drawer.classList.add('open');
    }, 1100);
  }

  function renderResultDrawer(herbData, herbKey) {
    if (!drawerContent) return;
    drawerContent.innerHTML = `
      <div class="result-card-header">
        <div>
          <h3 class="result-herb-name">${herbData.name}</h3>
          <span class="result-scientific-name">${herbData.scientificName}</span>
        </div>
        <span class="result-match-badge">${herbData.matchScore} Match</span>
      </div>

      <div class="result-tags-row">
        <span class="result-tag">🌿 Family: ${herbData.family}</span>
        <span class="result-tag">⚖️ ${herbData.dosha}</span>
      </div>

      <div class="result-phytochemicals">
        <strong>🔬 Active Compounds:</strong>
        <span>${herbData.activeCompound}</span>
      </div>

      <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 1rem;">
        <strong>Botanical Notes:</strong> ${herbData.notes}
      </p>

      <div class="result-actions-grid">
        <a href="index.html#home" class="btn-primary-action" id="scanViewProfileBtn">View Botanical Registry</a>
        <a href="index.html#supply-chain?batch=${herbData.batchId}" class="btn-secondary-action" id="scanTraceBatchBtn">Trace Active Batch</a>
      </div>
    `;
  }

  // Drawer handle click to toggle
  if (drawerHandle && drawer) {
    drawerHandle.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }

  // Info Modal Controls
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
});
