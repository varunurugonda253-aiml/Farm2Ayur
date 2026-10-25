/* ==========================================================================
 * FARM2AYUR - AI LEAF SCANNER (scan.js)
 * Sends the photo to the real backend (POST /scan/) and shows the real result.
 * No invented data: if the scanner cannot answer, it says so.
 * ========================================================================== */

const API = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'farm2ayur_token';
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

let activeCameraStream = null;
let currentZoom = 1;
let isTorchOn = false;
let isScanningActive = false;
let previewUrl = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function pct(value) {
  const n = Number(value);
  return Number.isFinite(n) ? (n * 100).toFixed(1) + '%' : 'n/a';
}

document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('scanVideoElement');
  const ambientFeed = document.getElementById('cameraAmbientFeed');
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

  const hudLightingValue = document.getElementById('hudLightingValue');
  const hudFocusValue = document.getElementById('hudFocusValue');
  const hudConfidenceValue = document.getElementById('hudConfidenceValue');

  /* ---------- helpers ---------- */
  function setInstruction(text) {
    if (instructionMain) instructionMain.textContent = text;
  }

  function setHud(lighting, focus, confidence) {
    if (hudLightingValue) hudLightingValue.textContent = lighting;
    if (hudFocusValue) hudFocusValue.textContent = focus;
    if (hudConfidenceValue) hudConfidenceValue.textContent = confidence;
  }

  function showDrawer(html) {
    if (!drawerContent) return;
    drawerContent.innerHTML = html;
    if (drawer) drawer.classList.add('open');
  }

  const SMALL_TEXT = 'font-size:0.84rem; line-height:1.5; margin-bottom:1.1rem; color:var(--text-secondary);';

  function showMessageCard(title, subtitle, message, actionHtml) {
    showDrawer(`
      <div class="result-card-header">
        <div>
          <h3 class="result-herb-name">${esc(title)}</h3>
          <span class="result-scientific-name">${esc(subtitle)}</span>
        </div>
      </div>
      <p style="${SMALL_TEXT}">${esc(message)}</p>
      <div class="result-actions-grid">${actionHtml || ''}</div>
    `);
  }

  const AGAIN_BTN = '<a href="#" class="btn-secondary-action" id="scanAgainBtn">Try another photo</a>';
  const LOGIN_BTN = '<a href="login.html" class="btn-primary-action">Log in</a>';

  if (drawerContent) {
    drawerContent.addEventListener('click', (e) => {
      if (e.target.closest('#scanAgainBtn')) {
        e.preventDefault();
        if (drawer) drawer.classList.remove('open');
        setHud('Not measured', 'Not measured', 'Ready');
        setInstruction('Align leaf within the emerald reticle');
      }
    });
  }

  setHud('Not measured', 'Not measured', 'Ready');

  /* ---------- cursor glow ---------- */
  if (cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });
    const animateCursorGlow = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursorGlow);
    };
    requestAnimationFrame(animateCursorGlow);
  }

  /* ---------- camera ---------- */
  async function startCamera() {
    if (activationOverlay) activationOverlay.classList.add('hidden');
    setInstruction('Align leaf within the emerald reticle');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (ambientFeed) ambientFeed.style.display = 'flex';
      setInstruction('No camera available. Use the gallery button to upload a leaf photo.');
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
      console.log('Camera access denied or unavailable:', err);
      if (ambientFeed) ambientFeed.style.display = 'flex';
      if (videoEl) videoEl.style.display = 'none';
      setInstruction('Camera not available. Use the gallery button to upload a leaf photo.');
    }
  }

  function stopCamera() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach((track) => track.stop());
      activeCameraStream = null;
    }
  }

  window.addEventListener('beforeunload', stopCamera);
  if (startCameraBtn) startCameraBtn.addEventListener('click', startCamera);

  /* ---------- torch ---------- */
  if (torchBtn) {
    torchBtn.addEventListener('click', async () => {
      isTorchOn = !isTorchOn;
      torchBtn.classList.toggle('active', isTorchOn);
      if (torchGlow) torchGlow.classList.toggle('active', isTorchOn);
      if (hudLightingValue) hudLightingValue.textContent = isTorchOn ? 'Torch on' : 'Not measured';

      if (activeCameraStream) {
        const track = activeCameraStream.getVideoTracks()[0];
        if (track && track.applyConstraints) {
          try {
            await track.applyConstraints({ advanced: [{ torch: isTorchOn }] });
          } catch (e) {
            // Hardware torch unavailable on this device; only the on-screen glow is shown
          }
        }
      }
    });
  }

  /* ---------- zoom (visual only) ---------- */
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      currentZoom = currentZoom === 1 ? 2 : 1;
      if (zoomLevel) zoomLevel.innerText = `${currentZoom}x`;
      zoomBtn.classList.toggle('active', currentZoom === 2);
      const scaleStr = `scale(${currentZoom})`;
      if (videoEl) videoEl.style.transform = scaleStr;
      if (ambientFeed) ambientFeed.style.transform = scaleStr;
      if (hudFocusValue) hudFocusValue.textContent = currentZoom === 2 ? 'Zoom 2x' : 'Not measured';
    });
  }

  /* ---------- real scan: send photo to the backend ---------- */
  async function runScan(blob, filename) {
    if (isScanningActive) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setInstruction('Please log in to scan.');
      showMessageCard('Login required', 'Scanner locked', 'You need to be logged in to use the AI scanner.', LOGIN_BTN);
      return;
    }

    isScanningActive = true;
    if (shutterBtn) shutterBtn.style.transform = 'scale(0.92)';
    setInstruction('Analysing photo... the first scan can take a few seconds.');
    setHud('Not measured', 'Not measured', 'Analysing...');

    try {
      const form = new FormData();
      form.append('file', blob, filename);
      const res = await fetch(API + '/scan/', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: form
      });

      if (res.status === 401) {
        setInstruction('Your session expired. Please log in again.');
        showMessageCard('Session expired', 'Login required', 'Please log in again to continue scanning.', LOGIN_BTN);
        return;
      }
      if (!res.ok) {
        let detail = 'The server could not process this photo.';
        try {
          const err = await res.json();
          if (typeof err.detail === 'string') detail = err.detail;
        } catch (e) { /* keep default message */ }
        setInstruction('Scan failed.');
        showMessageCard('Scan failed', 'No herb was identified', detail, AGAIN_BTN);
        return;
      }

      renderResult(await res.json());
    } catch (err) {
      console.log('Scan request failed:', err);
      setInstruction('Cannot reach the server.');
      showMessageCard('Cannot reach the server', 'No herb was identified',
        'Check that the backend is running and try again.', AGAIN_BTN);
    } finally {
      isScanningActive = false;
      if (shutterBtn) shutterBtn.style.transform = '';
    }
  }

  function renderResult(data) {
    if (data.status === 'scanner_unavailable' || !data.predicted_name) {
      setInstruction('Scanner unavailable. No herb was identified.');
      setHud('Not measured', 'Not measured', 'Unavailable');
      showMessageCard('Scanner unavailable', 'No herb was identified',
        data.message || data.notes || 'The scanner could not analyse this image.', AGAIN_BTN);
      return;
    }

    const lowConfidence = data.status === 'low_confidence';
    const confText = pct(data.confidence);
    const top = Array.isArray(data.top_predictions) ? data.top_predictions : [];

    setInstruction(lowConfidence
      ? `Low confidence: closest match is ${data.predicted_name} (${confText})`
      : `Identified: ${data.predicted_name} (${confText})`);
    setHud('Not measured', 'Not measured', `${confText}${lowConfidence ? ' (low)' : ''}`);

    const topTags = top.map((p) =>
      `<span class="result-tag">${esc(p.name)}: ${pct(p.confidence)}</span>`).join('');

    showDrawer(`
      <div class="result-card-header">
        <div>
          <h3 class="result-herb-name" id="drawerHerbName">${esc(data.predicted_name)}</h3>
          <span class="result-scientific-name">${data.scientific_name ? esc(data.scientific_name) : 'Herb record not found in database'}</span>
        </div>
        <span class="result-match-badge">${lowConfidence ? 'Low confidence ' : ''}${confText}</span>
      </div>

      ${lowConfidence ? `<p style="${SMALL_TEXT} color:#b45309;"><strong>Not reliable.</strong> The scanner is unsure. Retake the photo in clear light with one leaf filling the frame.</p>` : ''}

      <div class="result-tags-row">${topTags}</div>

      <p style="${SMALL_TEXT}">${esc(data.notes || '')}</p>
      <p style="${SMALL_TEXT}"><em>AI suggestion from a photo. It is not a lab test. Confirm the herb before relying on it. Model: ${esc(data.model_version || 'unknown')}</em></p>

      <div class="result-actions-grid">${AGAIN_BTN}</div>
    `);
  }

  /* ---------- shutter: capture a real camera frame ---------- */
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      if (activationOverlay) activationOverlay.classList.add('hidden');
      if (!activeCameraStream || !videoEl) {
        setInstruction('No live camera. Use the gallery button to upload a leaf photo.');
        return;
      }
      videoEl.style.display = 'block';
      if (ambientFeed) ambientFeed.style.display = 'none';
      if (!videoEl.videoWidth) {
        setInstruction('Camera is not ready yet. Try again in a moment.');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      canvas.getContext('2d').drawImage(videoEl, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          setInstruction('Could not capture the photo. Try again.');
          return;
        }
        runScan(blob, 'camera.jpg');
      }, 'image/jpeg', 0.92);
    });
  }

  /* ---------- gallery upload and drag-and-drop ---------- */
  function handleImageFile(file) {
    if (!file) return;
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setInstruction('Unsupported file. Use a JPG, PNG or WEBP photo.');
      return;
    }
    if (isScanningActive) return;

    if (activationOverlay) activationOverlay.classList.add('hidden');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    if (ambientFeed) {
      ambientFeed.innerHTML = '';
      const img = document.createElement('img');
      img.src = previewUrl;
      img.alt = 'Uploaded leaf photo';
      img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
      ambientFeed.appendChild(img);
      ambientFeed.style.display = 'flex';
    }
    if (videoEl) videoEl.style.display = 'none';

    runScan(file, file.name);
  }

  if (galleryBtn && fileInput) {
    galleryBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) handleImageFile(e.target.files[0]);
      fileInput.value = '';
    });
  }

  if (viewportStage) {
    let dragCounter = 0;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      viewportStage.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });
    viewportStage.addEventListener('dragenter', () => {
      dragCounter++;
      if (dragDropOverlay) dragDropOverlay.classList.add('active');
    });
    viewportStage.addEventListener('dragleave', () => {
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
      if (dt && dt.files && dt.files[0]) handleImageFile(dt.files[0]);
    });
  }

  /* ---------- drawer and modal ---------- */
  if (drawerHandle && drawer) {
    drawerHandle.addEventListener('click', () => drawer.classList.toggle('open'));
  }
  if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', () => infoModal.classList.add('open'));
  }
  [infoCloseBtn, infoGotItBtn, infoBackdrop].forEach((btn) => {
    if (btn && infoModal) {
      btn.addEventListener('click', () => infoModal.classList.remove('open'));
    }
  });

  /* ---------- keyboard shortcuts ---------- */
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