/**
 * FARM2AYUR — UNIVERSAL FLOATING BOTANICAL SPORES ANIMATION
 * Spawns ambient green floating botanical spore particles across all pages
 * (Excludes login page completely per design specifications)
 */

(function initBotanicalSpores() {
  // 1. Strict guard: Exclude dedicated login page (login.html) and about page (about.html)
  const isExcludedPage = 
    window.location.pathname.toLowerCase().endsWith('login.html') ||
    window.location.pathname.toLowerCase().endsWith('/login') ||
    window.location.pathname.toLowerCase().endsWith('about.html') ||
    window.location.pathname.toLowerCase().endsWith('/about') ||
    document.body.classList.contains('login-page') ||
    document.body.classList.contains('about-page');

  if (isExcludedPage) {
    return;
  }

  // 2. Inject resilient CSS rules
  if (!document.getElementById('botanical-spores-inline-css')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'botanical-spores-inline-css';
    styleEl.textContent = `
      body > .main-content,
      .main-content,
      .scan-page-container {
        position: static !important;
        z-index: auto !important;
      }
      section.page-view,
      #home,
      #supply-chain,
      #about,
      #contact,
      #flow-process-section,
      .flow-section-wrap,
      .scan-page-container {
        background-color: transparent !important;
      }
      .botanical-spores-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 2 !important;
        overflow: hidden !important;
      }
      .spore-particle {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.65) 0%, rgba(5, 150, 105, 0.2) 65%, transparent 100%);
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        animation-name: spore-float;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        pointer-events: none;
        will-change: transform, opacity;
      }
      @keyframes spore-float {
        0% {
          transform: translateY(105vh) translateX(0) scale(0.6);
          opacity: 0;
        }
        12% {
          opacity: 0.8;
        }
        88% {
          opacity: 0.8;
        }
        100% {
          transform: translateY(-10vh) translateX(30px) scale(1.1);
          opacity: 0;
        }
      }
      .hero-section,
      .herbal-info-card,
      .flow-step-card,
      .how-card,
      .glass-card,
      .track-herb-stage-wrap,
      .track-herb-container,
      .track-herb-content,
      .feature-card,
      .knowledge-card,
      .trace-hero-container,
      .trace-pipeline-section,
      .milestones-container,
      .station-detail-card,
      .telemetry-card,
      .authenticity-card,
      .specifications-card,
      .flow-station-node,
      .camera-scanner-wrapper,
      .scanner-viewport-stage,
      .member-image,
      .member-info,
      .member,
      .member-tags,
      .intro-content,
      .about-content,
      .section-header,
      .flow-header,
      .herbal-info-header {
        position: relative !important;
        z-index: 10 !important;
      }
      .herbal-info-card,
      .camera-scanner-wrapper,
      .milestones-container,
      .telemetry-card,
      .authenticity-card,
      .specifications-card,
      .station-detail-card {
        background-color: #ffffff !important;
      }
      .flow-step-card {
        background-color: #111827 !important;
      }
      .track-herb-stage-wrap {
        background-color: #0b111e !important;
      }
      .app-header,
      .mobile-nav-drawer {
        position: fixed !important;
        z-index: 1000 !important;
      }
      .app-footer {
        position: relative !important;
        z-index: 100 !important;
      }
      .chatbot-trigger,
      .chat-window {
        z-index: 99999 !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 3. Create global spores overlay
  function createGlobalSporesOverlay() {
    if (document.querySelector('.botanical-spores-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'botanical-spores-overlay';
    overlay.id = 'botanicalSporesOverlay';
    overlay.setAttribute('aria-hidden', 'true');

    // Generate 28 delicate particles for an ambient, subtle floating atmosphere
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const spore = document.createElement('div');
      spore.className = 'spore-particle';
      const size = Math.random() * 8 + 6; // 6px to 14px delicate size
      const duration = Math.random() * 10 + 12; // 12s to 22s
      // Negative delay pre-advances the animation so particles are immediately spread across the screen
      const delay = -(Math.random() * duration);

      spore.style.width = `${size.toFixed(1)}px`;
      spore.style.height = `${size.toFixed(1)}px`;
      spore.style.left = `${(Math.random() * 97).toFixed(1)}%`;
      spore.style.animationDuration = `${duration.toFixed(2)}s`;
      spore.style.animationDelay = `${delay.toFixed(2)}s`;
      overlay.appendChild(spore);
    }

    document.body.appendChild(overlay);

    // Dynamic visibility check for excluded views (#login and #about) on index.html
    function checkExcludedView() {
      const isHashExcluded = window.location.hash === '#login' || window.location.hash === '#about';
      const loginSection = document.getElementById('login');
      const aboutSection = document.getElementById('about');
      const isLoginActive = loginSection && loginSection.classList.contains('active');
      const isAboutActive = aboutSection && aboutSection.classList.contains('active');

      if (isHashExcluded || isLoginActive || isAboutActive) {
        overlay.style.display = 'none';
      } else {
        overlay.style.display = '';
      }
    }

    window.addEventListener('hashchange', checkExcludedView);
    const observer = new MutationObserver(checkExcludedView);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
    checkExcludedView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createGlobalSporesOverlay);
  } else {
    createGlobalSporesOverlay();
  }
})();
