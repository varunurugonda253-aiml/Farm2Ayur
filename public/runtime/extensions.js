// Mutate the global herbsDb array BEFORE DOMContentLoaded fully handles rendering in app.js
if (typeof herbsDb !== 'undefined') {
  // Modify existing items to use authentic botanical images
  if (herbsDb.ashwagandha) {
    herbsDb.ashwagandha.icon = '<img src="assets/images/ashwagandha.jpg" alt="Ashwagandha">';
  }
  if (herbsDb.turmeric) {
    herbsDb.turmeric.icon = '<img src="assets/images/turmeric.jpg" alt="Turmeric">';
  }
  if (herbsDb.tulsi) {
    herbsDb.tulsi.icon = '<img src="assets/images/tulsi.jpg" alt="Tulsi">';
  }
  
  // Remove Shatavari and add Brahmi and Neem since we have images
  if (herbsDb.shatavari) {
    delete herbsDb.shatavari;
  }
  
  herbsDb.neem = {
    id: "neem",
    name: "Neem (Arishta)",
    icon: '<img src="assets/images/neem.jpg" alt="Neem">',
    scientificName: "Azadirachta indica",
    ayurvedicProperties: {
      rasa: "Tikta (Bitter), Kashaya (Astringent)",
      guna: "Laghu (Light), Ruksha (Dry)",
      virya: "Sheeta (Cold)",
      vipaka: "Katu (Pungent)"
    },
    activeBatches: [],
    description: "Neem is a legendary bitter herb known as 'the village pharmacy' in Indian villages. It is celebrated for its deep blood-purifying properties, support for clear skin health, and natural systemic detoxification.",
    benefits: ["Purifies blood chemistry and supports clear skin healing", "Maintains healthy blood sugar pathways", "Supports oral hygiene and normal digestion flows"],
    certification: "USDA Organic, GMP Certified, ISO 9001"
  };

  herbsDb.brahmi = {
    id: "brahmi",
    name: "Brahmi (Gotu Kola)",
    icon: '<img src="assets/images/brahmi.jpg" alt="Brahmi">',
    scientificName: "Bacopa monnieri",
    ayurvedicProperties: {
      rasa: "Tikta (Bitter), Kashaya (Astringent), Madhura (Sweet)",
      guna: "Laghu (Light), Sara (Flowing)",
      virya: "Sheeta (Cold)",
      vipaka: "Madhura (Sweet)"
    },
    activeBatches: [],
    description: "Brahmi is a premier rejuvenating herb for the brain and nervous system. It enhances cognitive clarity, supports memory retention, focus, and study concentration, while cooling and pacifying excessive Pitta energy.",
    benefits: ["Promotes memory, focus speed, and study concentration", "Soothes nervous energy and maintains calm response to stress", "Supports restful sleep quality and cognitive reserves"],
    certification: "Ecocert Organic, GMP, AYUSH Premium Certification"
  };
}

// Local state checking (defined globally so router overrides can access it)
function isUserLoggedIn() {
  return localStorage.getItem('farm2ayur_logged_in') === 'true';
}

// Add login and scan to allowed pages array (which is const but we mutate it)
if (typeof pageOrder !== 'undefined') {
  if (!pageOrder.includes('login')) {
    pageOrder.push('login');
  }
  if (!pageOrder.includes('scan')) {
    pageOrder.push('scan');
  }
  const cIdx = pageOrder.indexOf('contribute');
  if (cIdx !== -1) {
    pageOrder.splice(cIdx, 1);
  }
}

// Core routing overrides safely bound
const originalHandleViewParams = typeof handleViewParams !== 'undefined' ? handleViewParams : (typeof window.handleViewParams === 'function' ? window.handleViewParams : null);
window.handleViewParams = function(view, params) {
  if (view === 'scan' && !isUserLoggedIn()) {
    window.location.hash = '#login';
    if (typeof showToast === 'function') {
      showToast("Please log in to access the AI Leaf Scanner.");
    }
    return;
  }
  if (view === 'explore' && params.batch) {
    window.location.hash = `#supply-chain?batch=${encodeURIComponent(params.batch)}`;
    return;
  }
  if (view === 'supply-chain' && params.batch) {
    const input = document.getElementById('exploreSearchInput');
    if (input) {
      input.value = params.batch;
      setTimeout(() => {
        if (typeof executeTrace === 'function') {
          executeTrace(params.batch);
        }
      }, 100);
    }
  }
  if (typeof originalHandleViewParams === 'function') {
    originalHandleViewParams(view, params);
  }
};

// DOM Interaction Handlers
function initExtensionsDOM() {
  function setUserLoggedIn(status) {
    if (status) {
      localStorage.setItem('farm2ayur_logged_in', 'true');
    } else {
      localStorage.removeItem('farm2ayur_logged_in');
    }
    updateAuthBtn();
    updateScannerUI();
    updateAuthUI();
  }

  // Update header buttons text based on auth status
  function updateAuthBtn() {
    const headerBtn = document.getElementById('headerLoginBtn');
    const mobileBtn = document.getElementById('mobileHeaderLoginBtn');
    
    if (isUserLoggedIn()) {
      if (headerBtn) {
        headerBtn.innerText = "My Account";
        headerBtn.classList.add('btn-secondary');
        headerBtn.classList.remove('btn-primary');
      }
      if (mobileBtn) {
        mobileBtn.innerText = "My Account";
        mobileBtn.classList.add('btn-secondary');
        mobileBtn.classList.remove('btn-primary');
      }
    } else {
      if (headerBtn) {
        headerBtn.innerText = "Login / Register";
        headerBtn.classList.remove('btn-secondary');
        headerBtn.classList.add('btn-primary');
      }
      if (mobileBtn) {
        mobileBtn.innerText = "Login / Register";
        mobileBtn.classList.remove('btn-secondary');
        mobileBtn.classList.add('btn-primary');
      }
    }
  }

  function updateScannerUI() {
    // Scanner logic is cleanly managed in dedicated scan.html and scan.js
  }

  // Authentication View Rendering
  function updateAuthUI() {
    const authBox = document.getElementById('authBox');
    if (!authBox) return;

    if (isUserLoggedIn()) {
      authBox.innerHTML = `
        <div style="padding: 1.5rem 0;">
          <span style="font-size: 3.5rem; display: block; margin-bottom: 1.2rem;">🌿</span>
          <h2>Welcome to Farm2Ayur</h2>
          <p style="margin-top: 0.5rem; color: var(--text-muted);">
            Logged in securely as <strong style="color: var(--gold-accent);">demo@farm2ayur.org</strong>
          </p>
          <div style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <a href="#scan" class="btn btn-secondary">Go to AI Scanner</a>
            <button type="button" class="btn btn-outline" id="authLogoutBtn">Log Out</button>
          </div>
        </div>
      `;

      const logoutBtn = document.getElementById('authLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          setUserLoggedIn(false);
          if (typeof showToast === 'function') {
            showToast("Logged out successfully.");
          }
          window.location.hash = '#home';
        });
      }
    } else {
      authBox.innerHTML = `
        <div>
          <div class="auth-tabs">
            <button type="button" class="auth-tab-btn active" id="authTabLogin">Log In</button>
            <button type="button" class="auth-tab-btn" id="authTabRegister">Register</button>
          </div>
          <form id="authForm" style="text-align: left;">
            <div class="input-wrap" id="authNameWrap" style="display: none;">
              <label for="authName">Full Name</label>
              <input type="text" id="authName" placeholder="Enter your full name">
            </div>
            <div class="input-wrap">
              <label for="authEmail">Email Address</label>
              <input type="email" id="authEmail" required placeholder="demo@farm2ayur.org">
            </div>
            <div class="input-wrap">
              <label for="authPassword">Password</label>
              <input type="password" id="authPassword" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-secondary w-100" style="margin-top: 1rem;" id="authSubmitBtn">Log In</button>
          </form>
        </div>
      `;

      const tabLogin = document.getElementById('authTabLogin');
      const tabRegister = document.getElementById('authTabRegister');
      const nameWrap = document.getElementById('authNameWrap');
      const submitBtn = document.getElementById('authSubmitBtn');
      let currentTab = 'login';

      if (tabLogin && tabRegister && nameWrap && submitBtn) {
        tabLogin.addEventListener('click', () => {
          tabLogin.classList.add('active');
          tabRegister.classList.remove('active');
          nameWrap.style.display = 'none';
          submitBtn.innerText = "Log In";
          currentTab = 'login';
        });

        tabRegister.addEventListener('click', () => {
          tabRegister.classList.add('active');
          tabLogin.classList.remove('active');
          nameWrap.style.display = 'flex';
          submitBtn.innerText = "Create Account";
          currentTab = 'register';
        });

        const authForm = document.getElementById('authForm');
        if (authForm) {
          authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.innerText = currentTab === 'login' ? "Verifying Credentials..." : "Creating Secure Profile...";
            submitBtn.disabled = true;

            setTimeout(() => {
              setUserLoggedIn(true);
              submitBtn.disabled = false;
              if (typeof showToast === 'function') {
                showToast(currentTab === 'login' ? "Welcome back!" : "Account registered successfully!");
              }
              window.location.hash = '#scan';
            }, 800);
          });
        }
      }
    }
  }

  // Initial UIs load
  setUserLoggedIn(isUserLoggedIn());

  // Action helper for Hero Scan button -> Navigates directly to dedicated scan.html
  const heroScanBtn = document.getElementById('heroScanBtn');
  if (heroScanBtn) {
    heroScanBtn.addEventListener('click', (e) => {
      // Natural link to scan.html is preserved
    });
  }

  // AI Assistant Chatbot Elements
  const chatbotTrigger = document.getElementById('chatbotTrigger');
  const chatbotBadge = document.getElementById('chatbotBadge');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotMinimize = document.getElementById('chatbotMinimize');
  const chatbotExpand = document.getElementById('chatbotExpand');
  const chatbotClear = document.getElementById('chatbotClear');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotUploadBtn = document.getElementById('chatbotUploadBtn');
  const chatbotFileInput = document.getElementById('chatbotFileInput');
  const chatbotMicBtn = document.getElementById('chatbotMicBtn');
  const chatbotDropzone = document.getElementById('chatbotDropzone');

  // Unread Badge Indicator (appears after 3s)
  setTimeout(() => {
    if (chatbotBadge && chatbotPanel && !chatbotPanel.classList.contains('open')) {
      chatbotBadge.classList.add('visible');
    }
  }, 3000);

  if (chatbotTrigger && chatbotPanel) {
    chatbotTrigger.addEventListener('click', () => {
      chatbotPanel.classList.toggle('open');
      if (chatbotBadge) chatbotBadge.classList.remove('visible');
    });
    
    if (chatbotClose) {
      chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.remove('open');
        chatbotPanel.classList.remove('expanded');
      });
    }

    if (chatbotExpand) {
      chatbotExpand.addEventListener('click', () => {
        chatbotPanel.classList.toggle('expanded');
      });
    }

    if (chatbotClear) {
      chatbotClear.addEventListener('click', () => {
        if (chatbotBody) {
          chatbotBody.innerHTML = '<div class="chat-msg bot"><div class="msg-header"><span>Farm2Ayur AI</span><button type="button" class="tts-btn" title="Listen to message">🔊</button></div><div>Chat history cleared. How can I assist your Ayurvedic journey today?</div></div>';
          attachTTSEvents();
        }
      });
    }

    // Quick Action Suggestion Chips
    chatbotPanel.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          chatbotInput.value = query;
          handleChatSubmit(query);
          chatbotInput.value = '';
        }
      });
    });

    // Chat input submit
    if (chatbotForm) {
      chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatbotInput.value.trim();
        if (text) {
          handleChatSubmit(text);
          chatbotInput.value = '';
        }
      });
    }

    // Image Upload & Drag-and-Drop Scanner inside Chat Widget
    if (chatbotUploadBtn && chatbotFileInput) {
      chatbotUploadBtn.addEventListener('click', () => {
        chatbotFileInput.click();
      });

      chatbotFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processLeafImageUpload(e.target.files[0]);
        }
      });
    }

    // Drag and drop events on chatbotPanel
    ['dragenter', 'dragover'].forEach(eventName => {
      chatbotPanel.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (chatbotDropzone) chatbotDropzone.classList.add('active');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      chatbotPanel.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (chatbotDropzone) chatbotDropzone.classList.remove('active');
      });
    });

    chatbotPanel.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        processLeafImageUpload(files[0]);
      }
    });

    // Audio Voice Input (Web Speech API)
    if (chatbotMicBtn) {
      let recognition = null;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          chatbotMicBtn.classList.add('listening');
          chatbotInput.placeholder = "Listening... Speak now";
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          chatbotInput.value = transcript;
          handleChatSubmit(transcript);
          chatbotInput.value = '';
        };

        recognition.onerror = () => {
          chatbotMicBtn.classList.remove('listening');
          chatbotInput.placeholder = "Ask a question or scan a leaf...";
        };

        recognition.onend = () => {
          chatbotMicBtn.classList.remove('listening');
          chatbotInput.placeholder = "Ask a question or scan a leaf...";
        };

        chatbotMicBtn.addEventListener('click', () => {
          if (chatbotMicBtn.classList.contains('listening')) {
            recognition.stop();
          } else {
            recognition.start();
          }
        });
      } else {
        chatbotMicBtn.addEventListener('click', () => {
          if (typeof showToast === 'function') {
            showToast("Voice input is not supported in this browser.");
          }
        });
      }
    }
  }

  // Process uploaded image file inside Chat
  function processLeafImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target.result;
      appendChatMsg('<div style="display:flex; align-items:center; gap:0.5rem;"><img src="' + imgUrl + '" style="width:40px; height:40px; border-radius:6px; object-fit:cover;"> Scanning uploaded leaf sample...</div>', 'user');
      
      const typingId = appendChatMsg('Analyzing neural leaf venation & spectral signature...', 'bot typing');
      
      setTimeout(() => {
        const typingMsg = document.getElementById(typingId);
        if (typingMsg) typingMsg.remove();
        
        const herbCard = '<div><strong>🌿 Instant AI Leaf Scan Complete!</strong><p style="margin: 0.3rem 0; font-size:0.8rem;">High confidence match identified from uploaded leaf imagery:</p><div class="chat-card-herb"><img src="assets/images/ashwagandha.jpg" class="chat-card-thumb" alt="Ashwagandha"><div class="chat-card-info"><h4>Ashwagandha (Withania somnifera)</h4><p>98.7% Venation Match | Active: Withanolides 4.82%</p><span class="chat-tag">Vata & Kapha Pacifying</span></div></div></div>';
        appendChatMsg(herbCard, 'bot');
      }, 1200);
    };
    reader.readAsDataURL(file);
  }

  // Text-To-Speech (TTS) Listener binding
  function attachTTSEvents() {
    if (!chatbotBody) return;
    chatbotBody.querySelectorAll('.tts-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const msgText = btn.parentElement.parentElement.innerText.replace('Farm2Ayur AI', '').replace('🔊', '').trim();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(msgText);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      };
    });
  }
  attachTTSEvents();

  function handleChatSubmit(userMsg) {
    appendChatMsg(userMsg, 'user');
    const typingId = appendChatMsg('...', 'bot typing');
    
    setTimeout(() => {
      const typingMsg = document.getElementById(typingId);
      if (typingMsg) typingMsg.remove();
      
      let botReply = "Thank you for writing. Farm2Ayur records complete environmental sensor data, harvest dates, and laboratory assays on our digital ledger.";
      const lower = userMsg.toLowerCase();

      if (lower.includes('identify') || lower.includes('leaf') || lower.includes('scanner')) {
        botReply = '<div><p>Our AI Leaf Scanner uses neural vision models to analyze leaf venation, serration, and spectral signatures.</p><div class="chat-card-herb"><img src="assets/images/ashwagandha.jpg" class="chat-card-thumb" alt="Ashwagandha"><div class="chat-card-info"><h4>Ashwagandha (Withania somnifera)</h4><p>Adaptogenic Root | Cortisol Reduction</p><span class="chat-tag">Vata Balancing</span></div></div></div>';
      } else if (lower.includes('trace') || lower.includes('batch') || lower.includes('check')) {
        botReply = '<div><p>Live Crop-to-Remedy Supply Chain Ledger (Batch ASH-2026-08):</p><div class="chat-stepper"><div class="stepper-step"><strong>🌱</strong>Farm Origin</div><div class="stepper-step"><strong>🔬</strong>HPTLC Assay</div><div class="stepper-step"><strong>📦</strong>QR Sealed</div></div></div>';
      } else if (lower.includes('dosha')) {
        botReply = '<div><p>Ayurvedic Dosha Botanical Guidance:</p><div class="chat-card-herb"><img src="assets/images/tulsi.jpg" class="chat-card-thumb" alt="Tulsi"><div class="chat-card-info"><h4>Tulsi (Holy Basil)</h4><p>Soothes Kapha & Vata | Respiratory Energy</p><span class="chat-tag">Tridoshic Balance</span></div></div></div>';
      } else if (lower.includes('purity') || lower.includes('test')) {
        botReply = "Herb purity is verified using High-Performance Thin-Layer Chromatography (HPTLC) and heavy metal spectroscopy at certified testing laboratories before batch ledger entries are published.";
      }
      
      appendChatMsg(botReply, 'bot');
    }, 800);
  }

  let chatCounter = 0;
  function appendChatMsg(text, sender) {
    chatCounter++;
    const id = 'chat-msg-' + chatCounter;
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.className = 'chat-msg ' + sender;

    if (sender.includes('bot') && !sender.includes('typing')) {
      msgDiv.innerHTML = '<div class="msg-header"><span>Farm2Ayur AI</span><button type="button" class="tts-btn" title="Listen to message">🔊</button></div><div>' + text + '</div>';
    } else {
      msgDiv.innerHTML = text;
    }

    if (chatbotBody) {
      chatbotBody.appendChild(msgDiv);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
    attachTTSEvents();
    return id;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initExtensionsDOM);
} else {
  initExtensionsDOM();
}
