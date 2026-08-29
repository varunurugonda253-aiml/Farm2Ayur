import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * =============================================================
 * Farm2Ayur – Animations Module
 * File: runtime/animations.js
 *
 * Contains two independent animation systems:
 *   1. Ambient Background – floating eco-particle canvas + aurora pulse
 *   2. GSAP Split-Word Reveal – staggered heading animations on scroll,
 *      with a MutationObserver to handle SPA page navigation (sections
 *      that are hidden on page load get animated when they become visible)
 * =============================================================
 */


/* =============================================================
   SECTION 0 – OPENING INTRO & LEVEL 2 HERO UPWARD TEXT REVEAL
   Single continuous GSAP Timeline Sequence:
     1. Leaf logo comes in centered
     2. Intro title expands out from behind the leaf logo
     3. Stays for 2 seconds
     4. Intro title retracts back behind the leaf logo
     5. Leaf logo re-centers / settles
     6. Intro overlay curtain slides up to reveal main website hero page
     7. Hero heading lines, subtitle & CTA rise UPWARD from below
        inside overflow-hidden masked containers (BeeToGreen style reveal)
   ============================================================= */
(function initIntroTitleAnimation() {
  const overlay = document.getElementById('intro-overlay');
  const iconBox = document.querySelector('.intro-icon-box');
  const icon = document.querySelector('.intro-icon');
  const textBox = document.querySelector('.intro-text-box');

  if (!overlay || !iconBox || !textBox) return;

  // Temporarily lock body scroll during intro overlay display
  document.body.style.overflow = 'hidden';

  // Create GSAP Timeline for pure sequenced control (no setTimeout)
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      overlay.style.display = 'none';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }
  });

  // 0. Initial hidden state (Intro + Hero masked elements)
  tl.set(iconBox, {
    scale: 0,
    opacity: 0,
    rotate: -25
  })
  .set(textBox, {
    y: -40,
    opacity: 0,
    scale: 0.85,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  })
  .set(overlay, {
    yPercent: 0,
    opacity: 1
  })
  // Hero elements initial state: positioned below inside masked containers
  .set('.hero-title-main', {
    y: 110,
    opacity: 0,
    clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  })
  .set('.ayurveda-word', {
    y: 110,
    opacity: 0,
    clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  })
  .set('.hero-subtitle', {
    y: 70,
    opacity: 0,
    clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  })
  .set('.hero-cta-wrap', {
    y: 50,
    opacity: 0
  });

  // STEP 1: Leaf logo comes in centered
  tl.to(iconBox, {
    scale: 1,
    opacity: 1,
    rotate: 0,
    duration: 1.0,
    ease: 'back.out(1.7)'
  })

  // STEP 2: Behind the leaf logo, website title comes in with text animation
  .to(textBox, {
    y: 0,
    opacity: 1,
    scale: 1,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1.2,
    ease: 'power4.out'
  }, "-=0.3")

  // STEP 3: Stays for 2 seconds
  .to({}, { duration: 2.0 })

  // STEP 4: Title goes back behind logo
  .to(textBox, {
    y: -40,
    opacity: 0,
    scale: 0.85,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    duration: 0.9,
    ease: 'power3.in'
  })

  // STEP 5: Logo comes center / pulse highlight
  .to(iconBox, {
    scale: 1.2,
    rotateY: 360,
    duration: 0.8,
    ease: 'power2.out'
  })
  .to(icon, {
    scale: 1.0,
    duration: 0.35,
    ease: 'power2.inOut'
  }, "-=0.2")

  // STEP 6: CONTINUOUS TRANSITION – Website reveal: Intro overlay curtain slides up
  .to(overlay, {
    yPercent: -100,
    duration: 1.05,
    ease: 'expo.inOut'
  }, "-=0.2")

  // STEP 7: HERO TEXT RISING FROM BELOW (BeeToGreen style staggered upward entrance)
  .to('.hero-title-main', {
    y: 0,
    opacity: 1,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1.15,
    ease: 'power4.out'
  }, "-=0.75") // Begins rising as overlay curtain opens!

  .to('.ayurveda-word', {
    y: 0,
    opacity: 1,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1.1,
    ease: 'power4.out'
  }, "-=0.9") // Staggered line 2

  .to('.hero-subtitle', {
    y: 0,
    opacity: 1,
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1.0,
    ease: 'power3.out'
  }, "-=0.8") // Subtitle rising

  .to('.hero-cta-wrap', {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power3.out'
  }, "-=0.75"); // CTA buttons rising
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

