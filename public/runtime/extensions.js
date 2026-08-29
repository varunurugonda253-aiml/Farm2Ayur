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
      // Remove contribute from page list
      const cIdx = pageOrder.indexOf('contribute');
      if (cIdx !== -1) {
        pageOrder.splice(cIdx, 1);
      }
    }

    // REDEFINE core routing overrides
    const originalHandleViewParams = handleViewParams;
    handleViewParams = function(view, params) {
      if (view === 'scan' && !isUserLoggedIn()) {
        window.location.hash = '#login';
        if (typeof showToast === 'function') {
          showToast("Please log in to access the AI Leaf Scanner.");
        }
        return;
      }
      if (view === 'explore' && params.batch) {
        // Intercept explore?batch=... and route to supply-chain?batch=...
        window.location.hash = `#supply-chain?batch=${encodeURIComponent(params.batch)}`;
        return;
      }
      if (view === 'supply-chain' && params.batch) {
        const input = document.getElementById('exploreSearchInput');
        if (input) {
          input.value = params.batch;
          // Defer executeTrace slightly to ensure explore views are active
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
    document.addEventListener("DOMContentLoaded", () => {
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

      // Scanner View Rendering and Simulation
      function updateScannerUI() {
        const scannerBox = document.getElementById('scannerBox');
        if (!scannerBox) return;

        if (!isUserLoggedIn()) {
          scannerBox.innerHTML = `
            <div style="padding: 1rem 0;">
              <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔒</span>
              <h2>Authentication Required</h2>
              <p style="margin-top: 0.5rem; margin-bottom: 1.5rem; max-width: 450px; margin-left: auto; margin-right: auto;">
                You must have an active Farm2Ayur account to access the AI Leaf Identification scanner.
              </p>
              <a href="#login" class="btn btn-secondary">Log In / Register Now</a>
            </div>
          `;
        } else {
          scannerBox.innerHTML = `
            <div>
              <h3>AI Plant Leaf Scanner</h3>
              <p>Position a medicinal leaf in the camera viewfinder frame or select a mock sample below.</p>
              
              <div class="scanner-viewport" id="scannerViewport">
                <div class="scanner-laser"></div>
                <div class="scanner-grid-overlay"></div>
                <div class="scanner-target-box" id="scannerTargetBox">
                  <span style="font-size: 2.8rem;" id="scannerTargetIcon">🍃</span>
                </div>
                <div id="scannerStatusText" style="margin-top: 10px; font-weight: 500; font-size: 0.9rem; color: var(--text-muted); z-index: 2;">
                  Align leaf inside target zone
                </div>
              </div>

              <div class="scanner-samples" id="scannerSamples">
                <button type="button" class="sample-leaf-btn" data-herb="ashwagandha">🌱 Ashwagandha Leaf</button>
                <button type="button" class="sample-leaf-btn" data-herb="tulsi">🌿 Tulsi Leaf</button>
                <button type="button" class="sample-leaf-btn" data-herb="neem">🍃 Neem Leaf</button>
                <button type="button" class="sample-leaf-btn" data-herb="turmeric">🍂 Turmeric Leaf</button>
              </div>

              <div class="scanner-results hidden" id="scannerResults"></div>
            </div>
          `;

          // Attach scan triggers
          const sampleButtons = scannerBox.querySelectorAll('.sample-leaf-btn');
          const viewport = document.getElementById('scannerViewport');
          const statusText = document.getElementById('scannerStatusText');
          const targetIcon = document.getElementById('scannerTargetIcon');
          const resultsBox = document.getElementById('scannerResults');

          sampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
              const herbId = btn.getAttribute('data-herb');
              
              // Scanning State
              viewport.classList.add('scanning');
              sampleButtons.forEach(b => b.disabled = true);
              statusText.innerText = "Analyzing vein morphology and cell structure...";
              targetIcon.innerText = "🔎";
              resultsBox.classList.add('hidden');

              setTimeout(() => {
                viewport.classList.remove('scanning');
                sampleButtons.forEach(b => b.disabled = false);
                statusText.innerText = "Scan Complete";
                targetIcon.innerText = "✓";
                
                // Show Match
                resultsBox.classList.remove('hidden');
                
                if (herbId === 'ashwagandha') {
                  resultsBox.innerHTML = `
                    <div class="result-header">
                      <div>
                        <strong>Ashwagandha (Withania somnifera)</strong>
                        <span style="display:block; font-size:0.75rem; color: var(--text-muted);">Family: Solanaceae</span>
                      </div>
                      <span class="result-accuracy">99.2% Match</span>
                    </div>
                    <p style="font-size:0.85rem; margin-bottom: 0.8rem;">
                      <strong>Botanical Notes:</strong> Short ovate leaves with fine stellate hairs. PACIFIES: Vata and Kapha dosha. Rejuvenating Rasayana.
                    </p>
                    <div style="display:flex; gap: 0.5rem; flex-wrap:wrap; margin-top: 1rem;">
                      <button type="button" class="btn btn-primary btn-sm view-profile-btn" data-herb="ashwagandha">View Botanical Profile</button>
                      <a href="#supply-chain?batch=ASH-2026-08" class="btn btn-secondary btn-sm">Trace Active Batch (ASH-2026-08)</a>
                    </div>
                  `;
                } else if (herbId === 'tulsi') {
                  resultsBox.innerHTML = `
                    <div class="result-header">
                      <div>
                        <strong>Tulsi (Ocimum sanctum)</strong>
                        <span style="display:block; font-size:0.75rem; color: var(--text-muted);">Family: Lamiaceae</span>
                      </div>
                      <span class="result-accuracy">98.6% Match</span>
                    </div>
                    <p style="font-size:0.85rem; margin-bottom: 0.8rem;">
                      <strong>Botanical Notes:</strong> Purples stems, opposite decussate serrate leaves with high glandular aromatic hairs. Clears respiratory channels.
                    </p>
                    <div style="display:flex; gap: 0.5rem; flex-wrap:wrap; margin-top: 1rem;">
                      <button type="button" class="btn btn-primary btn-sm view-profile-btn" data-herb="tulsi">View Botanical Profile</button>
                      <a href="#supply-chain?batch=TUL-2026-07" class="btn btn-secondary btn-sm">Trace Active Batch (TUL-2026-07)</a>
                    </div>
                  `;
                } else if (herbId === 'neem') {
                  resultsBox.innerHTML = `
                    <div class="result-header">
                      <div>
                        <strong>Neem (Azadirachta indica)</strong>
                        <span style="display:block; font-size:0.75rem; color: var(--text-muted);">Family: Meliaceae</span>
                      </div>
                      <span class="result-accuracy">97.4% Match</span>
                    </div>
                    <p style="font-size:0.85rem; margin-bottom: 0.8rem;">
                      <strong>Botanical Notes:</strong> Asymmetrical pinnate leaves with deeply serrated edges. Extremely bitter (Tikta). Purifies blood and controls Pitta.
                    </p>
                    <div style="display:flex; gap: 0.5rem; flex-wrap:wrap; margin-top: 1rem;">
                      <button type="button" class="btn btn-primary btn-sm view-profile-btn" data-herb="neem">View Botanical Profile</button>
                      <span style="font-size:0.8rem; color: var(--text-muted); align-self:center;">No active supply batches</span>
                    </div>
                  `;
                } else if (herbId === 'turmeric') {
                  resultsBox.innerHTML = `
                    <div class="result-header">
                      <div>
                        <strong>Turmeric (Curcuma longa)</strong>
                        <span style="display:block; font-size:0.75rem; color: var(--text-muted);">Family: Zingiberaceae</span>
                      </div>
                      <span class="result-accuracy">96.8% Match</span>
                    </div>
                    <p style="font-size:0.85rem; margin-bottom: 0.8rem;">
                      <strong>Botanical Notes:</strong> Broad green leaf sheaths rising from underground aromatic rhizomes. Promotes skin health and balances all three doshas.
                    </p>
                    <div style="display:flex; gap: 0.5rem; flex-wrap:wrap; margin-top: 1rem;">
                      <button type="button" class="btn btn-primary btn-sm view-profile-btn" data-herb="turmeric">View Botanical Profile</button>
                      <a href="#supply-chain?batch=TUR-2026-09" class="btn btn-secondary btn-sm">Trace Active Batch (TUR-2026-09)</a>
                    </div>
                  `;
                }

                // Connect the dynamically spawned "View Botanical Profile" button
                resultsBox.querySelector('.view-profile-btn').addEventListener('click', (e) => {
                  const viewHerbId = e.target.getAttribute('data-herb');
                  if (typeof openHerbModal === 'function') {
                    openHerbModal(viewHerbId);
                  }
                });

              }, 1600);
            });
          });
        }
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

          document.getElementById('authLogoutBtn').addEventListener('click', () => {
            setUserLoggedIn(false);
            if (typeof showToast === 'function') {
              showToast("Logged out successfully.");
            }
            window.location.hash = '#home';
          });
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

          // Handle form switching
          const tabLogin = document.getElementById('authTabLogin');
          const tabRegister = document.getElementById('authTabRegister');
          const nameWrap = document.getElementById('authNameWrap');
          const submitBtn = document.getElementById('authSubmitBtn');
          let currentTab = 'login';

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

          // Handle Submit
          document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            submitBtn.innerText = currentTab === 'login' ? "Verifying Credentials..." : "Creating Secure Profile...";
            submitBtn.disabled = true;

            setTimeout(() => {
              setUserLoggedIn(true);
              submitBtn.disabled = false;
              if (typeof showToast === 'function') {
                showToast(currentTab === 'login' ? "Welcome back!" : "Account registered successfully!");
              }
              // Redirect back to dedicated scan view
              window.location.hash = '#scan';
            }, 800);
          });
        }
      }

      // Initial UIs load
      setUserLoggedIn(isUserLoggedIn());

      // Action helper for Hero Scan button
      const heroScanBtn = document.getElementById('heroScanBtn');
      if (heroScanBtn) {
        heroScanBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (!isUserLoggedIn()) {
            window.location.hash = '#login';
            if (typeof showToast === 'function') {
              showToast("Please log in to access the AI Leaf Scanner.");
            }
          } else {
            window.location.hash = '#scan';
          }
        });
      }

      // FAQ accordion trigger fixes (since accordion triggers were already attached in app.js, we don't interfere, but double check)
      
      // SUPPLY CHAIN SHORTCUT REDIRECT FIX (footer)
      document.querySelectorAll('.trace-shortcut-footer').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const batchId = link.getAttribute('data-batch');
          window.location.hash = `#supply-chain?batch=${encodeURIComponent(batchId)}`;
        });
      });

      // FLOATING CHATBOT EVENT LOGIC
      const chatbotTrigger = document.getElementById('chatbotTrigger');
      const chatbotPanel = document.getElementById('chatbotPanel');
      const chatbotClose = document.getElementById('chatbotClose');
      const chatbotBody = document.getElementById('chatbotBody');
      const chatbotForm = document.getElementById('chatbotForm');
      const chatbotInput = document.getElementById('chatbotInput');

      if (chatbotTrigger && chatbotPanel) {
        chatbotTrigger.addEventListener('click', () => {
          chatbotPanel.classList.toggle('open');
        });
        
        if (chatbotClose) {
          chatbotClose.addEventListener('click', () => {
            chatbotPanel.classList.remove('open');
          });
        }

        // Preset queries listener
        chatbotPanel.querySelectorAll('.preset-query-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            handleChatSubmit(query);
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
      }

      function handleChatSubmit(userMsg) {
        // 1. Append User Message
        appendChatMsg(userMsg, 'user');
        
        // 2. Append typing indicator
        const typingId = appendChatMsg('...', 'bot typing');
        
        // 3. Match reply or default reply
        setTimeout(() => {
          const typingMsg = document.getElementById(typingId);
          if (typingMsg) typingMsg.remove();
          
          let botReply = "Thank you for writing. Farm2Ayur records complete environmental sensor data, harvest dates, and laboratory assays on our digital ledger. You can inspect active batches in our Supply Chain tab.";
          
          const lower = userMsg.toLowerCase();
          if (lower.includes('scanner') || lower.includes('identify') || lower.includes('leaf')) {
            botReply = "The AI leaf scanner uses a convolutional neural network (CNN) running locally. It identifies leaf outline contours and vein spacing to authenticate herb species, ensuring growers harvest and mill correct botanicals.";
          } else if (lower.includes('purity') || lower.includes('verify') || lower.includes('laboratory') || lower.includes('coa')) {
            botReply = "Herbs are verified at NABL-accredited phytochemistry facilities. We test for active secondary markers (e.g. Withanolides >1.50%), humidity levels, heavy metals (Pb, Cd), and organochlorines. Certificates of Analysis are securely bound to batch logs.";
          } else if (lower.includes('ashwagandha')) {
            botReply = "Our registered Ashwagandha batches (like ASH-2026-08) hold certified USDA Organic, NPOP India, and GMP certifications. Verified Withanolides average 4.82% w/w, well exceeding the 1.50% reference standard.";
          } else if (lower.includes('turmeric') || lower.includes('haridra')) {
            botReply = "Haridra (Curcuma longa) root batches (like TUR-2026-09) are sourced from red clay soil in Wayanad, Kerala. Verified Curcuminoids average a high 5.40% w/w (standard >3.00%).";
          } else if (lower.includes('tulsi')) {
            botReply = "Holy Basil (Ocimum sanctum) batches (like TUL-2026-07) are wildcrafted in Kangra, Himachal Pradesh. Active constituent Ursolic Acid is tested at 1.62% w/w (standard >0.50%).";
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
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerText = text;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        return id;
      }

    });
