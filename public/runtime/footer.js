/**
 * ==========================================================================
 * FARM2AYUR — UNIVERSAL HIGH-TECH FOOTER INTERACTION SCRIPT (footer.js)
 * Features:
 * - Liquid Magnetic Hover Pill Glide Under Nav Links
 * - Dynamic Holographic Backdrop Tilt & Mouse Reactive Aura
 * - Interactive Batch Pill Shortcut Routing
 * ==========================================================================
 */

export function initFloatingDockFooter() {
  const footer = document.querySelector('.app-footer.floating-dock-footer');
  if (!footer) return;

  const grid = footer.querySelector('#footerGridNav');
  const hoverPill = footer.querySelector('#magneticHoverPill');
  const holoGrid = footer.querySelector('#footerHoloGrid');
  const glowAura = footer.querySelector('#footerGlowAura');
  const navLinks = footer.querySelectorAll('.magnetic-link');
  const batchPills = footer.querySelectorAll('.footer-batch-pill');

  /* --------------------------------------------------------------------------
     1. Liquid Magnetic Hover Pill
     -------------------------------------------------------------------------- */
  if (grid && hoverPill && navLinks.length > 0) {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const gridRect = grid.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        const top = linkRect.top - gridRect.top;
        const left = linkRect.left - gridRect.left;
        const width = linkRect.width;
        const height = linkRect.height;

        hoverPill.style.top = `${top}px`;
        hoverPill.style.left = `${left}px`;
        hoverPill.style.width = `${width}px`;
        hoverPill.style.height = `${height}px`;
        hoverPill.style.opacity = '1';
      });
    });

    grid.addEventListener('mouseleave', () => {
      hoverPill.style.opacity = '0';
    });
  }

  /* --------------------------------------------------------------------------
     2. Dynamic Holographic Isometric Backdrop Tilt & Cursor Glow
     -------------------------------------------------------------------------- */
  if (holoGrid && glowAura) {
    footer.addEventListener('mousemove', (e) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move glow aura
      glowAura.style.left = `${x}px`;
      glowAura.style.top = `${y}px`;
      glowAura.style.opacity = '0.9';

      // Subtle isometric grid shift
      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2;

      holoGrid.style.transform = `perspective(600px) rotateX(${25 + normY * 4}deg) rotateY(${normX * 3}deg) translate(${normX * 8}px, ${normY * 6}px)`;
    }, { passive: true });

    footer.addEventListener('mouseleave', () => {
      glowAura.style.opacity = '0';
      holoGrid.style.transform = `perspective(600px) rotateX(25deg)`;
    });
  }

  /* --------------------------------------------------------------------------
     3. Batch Tag Click Handler
     -------------------------------------------------------------------------- */
  batchPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const batchId = pill.getAttribute('data-batch');
      if (!batchId) return;

      const isIndexPage = window.location.pathname.endsWith('index.html') || 
                          window.location.pathname === '/' || 
                          window.location.pathname.endsWith('/');

      if (isIndexPage) {
        e.preventDefault();
        const searchInput = document.getElementById('traceSearchInput') || document.querySelector('.trace-search-input');
        const traceSection = document.getElementById('supply-chain') || document.getElementById('traceSection');
        
        if (searchInput) {
          searchInput.value = batchId;
          const searchBtn = document.getElementById('traceSearchBtn') || document.querySelector('.trace-search-btn');
          if (searchBtn) searchBtn.click();
        }
        
        if (traceSection) {
          traceSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingDockFooter);
} else {
  initFloatingDockFooter();
}
