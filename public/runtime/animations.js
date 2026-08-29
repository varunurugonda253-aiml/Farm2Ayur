/**
 * =============================================================
 * Farm2Ayur � Animations Module
 * File: assets/js/animations.js
 *
 * Contains two independent animation systems:
 *   1. Ambient Background � floating eco-particle canvas + aurora pulse
 *   2. GSAP Split-Word Reveal � staggered heading animations on scroll,
 *      with a MutationObserver to handle SPA page navigation (sections
 *      that are hidden on page load get animated when they become visible)
 * =============================================================
 */


/* =============================================================
   SECTION 1 � AMBIENT FLOATING PARTICLES
   Uses the HTML5 Canvas API and requestAnimationFrame for
   hardware-accelerated rendering at 60fps.
   The canvas element (#ambient-canvas) is fixed, full-screen,
   and pointer-events:none so it never blocks user interaction.
   ============================================================= */

(function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Canvas dimensions � use clientWidth to avoid scrollbar-width causing layout shift
  let width  = canvas.width  = document.documentElement.clientWidth;
  let height = canvas.height = window.innerHeight;

  // Mouse position � used for gentle particle avoidance
  const mouse = { x: width / 2, y: height / 2 };

  // Track scroll for mouse-position offset compensation
  let scrollY = 0;

  // Resize handler � keeps canvas perfectly full-screen
  window.addEventListener('resize', () => {
    width  = canvas.width  = document.documentElement.clientWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  /**
   * Particle class � each instance represents one floating mote.
   * Particles spawn below the viewport and drift upward with a
   * natural sine-wave oscillation. 50% randomly glow with a soft
   * green shadow for extra visual depth.
   */
  class Particle {
    constructor() {
      this.reset();
      // On initial creation, spread particles across the full height
      // so the screen isn't empty before any particles have risen up
      this.y = Math.random() * height;
    }

    /**
     * Reinitialise this particle with new random properties.
     * Called on construction and whenever the particle leaves the screen.
     */
    reset() {
      this.x             = Math.random() * width;
      this.y             = height + Math.random() * 200; // spawn below screen
      this.size          = Math.random() * 3.5 + 2.5;   // radius: 2.5px � 6px
      this.speedY        = -(Math.random() * 2.2 + 1.2); // upward: 1.2 � 3.4 px/frame
      this.speedX        = (Math.random() - 0.5) * 1.0; // horizontal drift
      this.opacity       = Math.random() * 0.3 + 0.6;   // brightness: 0.6 � 0.9
      this.glow          = Math.random() > 0.5;          // 50% of particles glow

      // Natural oscillation parameters � creates the leaf-drifting feel
      this.angle           = Math.random() * Math.PI * 2;
      this.oscillationSpeed = Math.random() * 0.03 + 0.015;
      this.oscillationAmp   = Math.random() * 1.5 + 0.8;
    }

    /**
     * Update position each frame.
     * Applies upward movement, mouse avoidance within 180px radius,
     * and sine-wave horizontal oscillation.
     */
    update() {
      // Rise upward
      this.y += this.speedY;

      // Gentle mouse avoidance � particles push away from cursor
      const dx       = mouse.x - this.x;
      const dy       = (mouse.y + scrollY * 0.1) - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 180) {
        this.x -= dx * 0.008;
        this.y -= dy * 0.008;
      }

      // Natural side-to-side oscillation (simulates air movement)
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * this.oscillationAmp * 0.5 + this.speedX;

      // Recycle when the particle exits the visible area on any edge
      if (this.y < -50 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    /**
     * Draw the particle as a circle.
     * Glowing particles get a soft emerald shadowBlur for visual depth.
     */
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      if (this.glow) {
        ctx.shadowBlur  = 20;
        ctx.shadowColor = '#00ff88';
        ctx.fillStyle   = `rgba(100, 255, 150, ${this.opacity})`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle  = `rgba(150, 220, 180, ${this.opacity})`;
      }

      ctx.fill();
      ctx.shadowBlur = 0; // always reset after draw to avoid bleed into next shape
    }
  }

  // Initialise 120 particles spread across the viewport
  const PARTICLE_COUNT = 120;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  /**
   * Main animation loop � runs every frame via requestAnimationFrame.
   * Clears the canvas and redraws every particle.
   */
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
})();


/* =============================================================
   SECTION 2 � GSAP STAGGERED SPLIT-WORD REVEAL
   
   Words in target headings are wrapped in clip-masked spans
   and animated into view with a stagger when the heading
   scrolls into the viewport (via ScrollTrigger).

   SPA FIX: This site uses JavaScript to show/hide page sections
   by toggling the .active class. Sections that are hidden when
   the page loads won't trigger ScrollTrigger because they have
   zero visible area. A MutationObserver watches the .page-view
   elements and fires the animation for newly activated sections.
   ============================================================= */

window.addEventListener('load', () => {
  // Guard: skip entirely if GSAP or ScrollTrigger failed to load from CDN
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('Farm2Ayur: GSAP or ScrollTrigger not available � split-word animation skipped.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /**
   * Recursively split text content of a heading into individual
   * word spans wrapped inside a clip-mask span.
   *
   * Preserves nested child elements (like <strong> or <span class="ayurveda-word">)
   * by traversing all child nodes (both text nodes and elements) instead
   * of just element children. This protects gradient, font, and bold styles.
   *
   * @param {HTMLElement} element - The heading element to process
   */
  function splitIntoWords(element) {
    // Skip if already processed or if it's a script/style tag
    if (element.classList && element.classList.contains('words-split')) return;

    const nodes = Array.from(element.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        // Skip if text is empty/whitespace
        if (text.trim() === '') return;

        // Split text by whitespace, preserving whitespace elements in the array
        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          if (word.trim() === '') {
            // Keep whitespace as-is
            fragment.appendChild(document.createTextNode(word));
          } else {
            // Wrap words in clip-mask and reveal containers
            const maskSpan = document.createElement('span');
            maskSpan.className = 'word-mask';
            const revealSpan = document.createElement('span');
            revealSpan.className = 'reveal-word';
            revealSpan.textContent = word;
            maskSpan.appendChild(revealSpan);
            fragment.appendChild(maskSpan);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recurse into child elements
        splitIntoWords(node);
      }
    });

    if (element.classList) {
      element.classList.add('words-split');
    }
  }

  /**
   * Set up a GSAP ScrollTrigger animation for all .reveal-word
   * spans inside a given heading element.
   *
   * @param {HTMLElement} heading - A heading that has already been split
   */
  function animateHeading(heading) {
    const words = heading.querySelectorAll('.reveal-word');
    if (words.length === 0) return;

    gsap.fromTo(words, {
      y: '110%',
      rotate: 8,
      opacity: 0
    }, {
      y: '0%',
      rotate: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08, // each word reveals 80ms after the previous
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',          // trigger when top of heading hits 88vh
        toggleActions: 'play none none none' // play once, never reverse
      }
    });
  }

  /**
   * Process a set of heading elements � split them and wire up animations.
   * Safe to call multiple times; already-split elements are skipped.
   *
   * @param {NodeList|Array} headings
   */
  function processHeadings(headings) {
    headings.forEach(heading => {
      splitIntoWords(heading);
      animateHeading(heading);
    });
  }

  // CSS selector for all section headings that should animate.
  // Intentionally excludes .hero-title-main and .ayurveda-word �
  // those have gradient/font styles that must not be disrupted by splitting.
  const HEADING_SELECTOR = [
    'h2.section-heading',
    '.view-intro h1',
    '.about-grid h2',
    '.sustainability-box h2',
    '.contact-faqs h2'
  ].join(', ');

  // Animate headings inside the initially visible section on page load
  const initialHeadings = document.querySelectorAll(HEADING_SELECTOR);
  processHeadings(initialHeadings);

  // ---------------------------------------------------------------
  // SPA FIX � MutationObserver
  //
  // Watch every .page-view section for a class change.
  // When a section gains the .active class (user clicked a nav tab),
  // find any un-animated headings in that section and run them.
  // ---------------------------------------------------------------
  const pageViews = document.querySelectorAll('.page-view');

  const spaObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      const section = mutation.target;

      // Only act when .active is added (section became visible)
      if (
        mutation.attributeName === 'class' &&
        section.classList.contains('active')
      ) {
        // Refresh ScrollTrigger now that the section has real dimensions
        ScrollTrigger.refresh();

        // Find and animate any headings inside this newly visible section
        const newHeadings = section.querySelectorAll(HEADING_SELECTOR);
        processHeadings(newHeadings);
      }
    });
  });

  // Observe class attribute changes on every page-view section
  pageViews.forEach(section => {
    spaObserver.observe(section, { attributes: true });
  });
});

