import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'https://esm.sh/animejs';

gsap.registerPlugin(ScrollTrigger);

/**
 * ==========================================================================
 * FARM2AYUR – ANIMATIONS & INTERACTIVE MOTION ENGINE
 * File: public/runtime/animations.js
 *
 * TABLE OF CONTENTS:
 * 1. Intro Curtain Reveal & Hero Title Anime.js Bounce
 * 2. Hero Background Video Parallax (ScrollTrigger)
 * 3. Section 2: Platform Flow 3D Orbit Carousel
 * 4. Section 2: GSAP Staggered Split-Word Heading Reveals & SPA Observer
 * 5. Section 3: Track Your Herb 3D Pop Card & Repeatable Typewriter
 * ==========================================================================
 */


/* ==========================================================================
   1. INTRO CURTAIN REVEAL & HERO TITLE ANIME.JS BOUNCE
   ========================================================================== */
(function initIntroTitleAnimation() {
  const overlay = document.getElementById('intro-overlay');
  const iconBox = document.querySelector('.intro-icon-box');
  const icon = document.querySelector('.intro-icon');
  const textBox = document.querySelector('.intro-text-box');

  if (!overlay || !iconBox || !textBox) return;

  document.body.style.overflow = 'hidden';

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

  tl.set(iconBox, { scale: 0, opacity: 0, rotate: -25 })
    .set(textBox, { y: -40, opacity: 0, scale: 0.85, clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' })
    .set(overlay, { yPercent: 0, opacity: 1 })
    .set('.hero-subtitle', { y: 70, opacity: 0, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' })
    .set('.hero-cta-wrap', { y: 50, opacity: 0 });

  tl.to(iconBox, { scale: 1, opacity: 1, rotate: 0, duration: 1.0, ease: 'back.out(1.7)' })
    .to(textBox, { y: 0, opacity: 1, scale: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.2, ease: 'power4.out' }, "-=0.3")
    .to({}, { duration: 2.0 })
    .to(textBox, { y: -40, opacity: 0, scale: 0.85, clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', duration: 0.9, ease: 'power3.in' })
    .to(iconBox, { scale: 1.2, rotateY: 360, duration: 0.8, ease: 'power2.out' })
    .to(icon, { scale: 1.0, duration: 0.35, ease: 'power2.inOut' }, "-=0.2")
    .to(overlay, {
      yPercent: -100,
      duration: 1.05,
      ease: 'expo.inOut',
      onStart: () => { 
        initHeroTitleAnimeBounce();
        initNavbarAnimation();
      },
      onComplete: () => {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
      }
    }, "-=0.2")
    .to('.hero-subtitle', { y: 0, opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.0, ease: 'power3.out' }, "-=0.8")
    .to('.hero-cta-wrap', { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, "-=0.75");
})();

/* ==========================================================================
   NAVBAR POP-IN & EXPAND GSAP TIMELINE ANIMATION
   ========================================================================== */
function initNavbarAnimation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const authBtn = document.getElementById('authBtn');
  const logoIcon = document.getElementById('logoIcon');
  const logoText = document.getElementById('logoText');

  if (!navbar) return;

  // Set initial collapsed box state before timeline plays
  const initialWidth = window.innerWidth < 600 ? "210px" : "240px";
  gsap.set(navbar, {
    width: initialWidth,
    opacity: 0,
    y: -100,
    scale: 0.8,
    overflow: "hidden"
  });

  // Keep logo icon & text visible together inside the box so they pop in simultaneously as one unit
  if (logoIcon) gsap.set(logoIcon, { opacity: 1, scale: 1, y: 0 });
  if (logoText) gsap.set(logoText, { opacity: 1, scale: 1, y: 0 });
  if (navLinks) gsap.set(navLinks, { opacity: 0 });
  if (authBtn) gsap.set(authBtn, { opacity: 0 });

  // Target the GSAP timeline with a 1.2s delay so both apper together a little late
  const tl = gsap.timeline({
    delay: 1.2,
    defaults: { ease: "power3.out" },
    onStart: () => {
      gsap.set(navbar, { visibility: "visible" });
    },
    onComplete: () => {
      gsap.set(navbar, { overflow: "visible", width: "100%" });
    }
  });

  // 1. Pop-in the central logo box with Farm2Ayur logo TOGETHER from top with a spring/bounce effect
  tl.fromTo("#navbar", 
    { 
      y: -100, 
      opacity: 0, 
      scale: 0.8 
    }, 
    { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      duration: 0.8, 
      ease: "back.out(1.7)" 
    }
  )

  // 2. Brief loading glow/pulse animation
  .to("#navbar", {
    boxShadow: "0 0 25px rgba(139, 195, 74, 0.6)",
    duration: 0.35,
    yoyo: true,
    repeat: 1
  })

  // 3. Expand the small box horizontally into the full-width navbar
  .to("#navbar", {
    width: "100%",
    duration: 0.8,
    ease: "power4.inOut"
  })

  // 4. Reveal and fade in the nav links and login button inside the navbar
  .to(["#navLinks", "#authBtn"], {
    opacity: 1,
    duration: 0.4,
    stagger: 0.1
  });

  return tl;
}

function prepareTextChars(element) {
  if (!element || element.dataset.animeSplit) return element ? Array.from(element.querySelectorAll('.anime-char')) : [];
  element.dataset.animeSplit = 'true';
  const text = element.textContent;
  element.innerHTML = '';
  const charSpans = [];
  for (let char of text) {
    const span = document.createElement('span');
    span.className = 'anime-char';
    span.textContent = char;
    element.appendChild(span);
    charSpans.push(span);
  }
  return charSpans;
}

function initHeroTitleAnimeBounce() {
  const mainElem = document.querySelector('.hero-title-main');
  const ayurvedaElem = document.querySelector('.ayurveda-word');
  if (!mainElem && !ayurvedaElem) return;

  [mainElem, ayurvedaElem].forEach(el => {
    if (el) {
      el.style.clipPath = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });

  document.querySelectorAll('.hero-line-mask').forEach(mask => {
    mask.style.overflow = 'visible';
  });

  const charsMain = prepareTextChars(mainElem);
  const charsAyurveda = prepareTextChars(ayurvedaElem);
  const allChars = [...charsMain, ...charsAyurveda];

  if (allChars.length === 0) return;

  animate(allChars, {
    y: [
      { to: '-2rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    rotate: { from: '-1turn', delay: 0 },
    delay: stagger(50),
    ease: 'inOutCirc',
    loop: false
  });
}

const introOverlay = document.getElementById('intro-overlay');
if (!introOverlay) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroTitleAnimeBounce();
      initNavbarAnimation();
    });
  } else {
    initHeroTitleAnimeBounce();
    initNavbarAnimation();
  }
}


/* ==========================================================================
   2. HERO BACKGROUND VIDEO PARALLAX
   ========================================================================== */
(function initHeroScrollStepA() {
  const heroSection = document.querySelector('.hero-section');
  const heroVideo = document.querySelector('.hero-bg-video');
  const heroTitle = document.querySelector('.hero-title');

  if (!heroSection || !heroVideo || !heroTitle) return;

  gsap.to(heroVideo, {
    yPercent: -15,
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to(heroTitle, {
    y: -120,
    scale: 0.95,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
})();


/* ==========================================================================
   3. PLATFORM FLOW PROCESS — 3D ORBIT CAROUSEL
   ========================================================================== */
(function initPlatformFlow3DOrbit() {
  const container = document.querySelector('#flow-process-section');
  const cards = document.querySelectorAll('#flow-process-section .flow-step-card');
  const totalCards = cards.length;
  
  if (!container || totalCards === 0) return;

  let currentAngle = 0;
  let targetAngle = 0;
  let startX = 0;
  let isDragging = false;
  let dragDelta = 0;

  const floatOffsets = [0, -12, 10, -6];

  function getRadiusX() {
    return window.innerWidth < 768 ? Math.min(window.innerWidth * 0.38, 160) : 340;
  }
  function getRadiusZ() {
    return window.innerWidth < 768 ? 130 : 220;
  }

  function animateOrbit() {
    currentAngle += (targetAngle - currentAngle) * 0.1;

    const radiusX = getRadiusX();
    const radiusZ = getRadiusZ();

    cards.forEach((card, index) => {
      const baseAngle = (index * (360 / totalCards));
      const angleRad = ((baseAngle + currentAngle) * Math.PI) / 180;

      const x = Math.sin(angleRad) * radiusX;
      const z = Math.cos(angleRad) * radiusZ - radiusZ;
      const rotateY = -x * 0.08;

      const depthFactor = (z + radiusZ * 2) / (radiusZ * 2); 
      const opacity = Math.max(0.35, depthFactor);
      const zIndex = Math.round(depthFactor * 100);
      const floatY = floatOffsets[index % floatOffsets.length];

      card.style.transform = `translate3d(${x}px, ${floatY}px, ${z}px) rotateY(${rotateY}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;

      if (z > -40) {
        card.classList.add('active-front-card');
        card.style.borderColor = 'rgba(16, 185, 129, 0.85)';
        card.style.boxShadow = '0 30px 65px rgba(0,0,0,0.75), 0 0 40px rgba(16, 185, 129, 0.45), inset 0 0 25px rgba(6, 182, 212, 0.25)';
      } else {
        card.classList.remove('active-front-card');
        card.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
      }
    });

    requestAnimationFrame(animateOrbit);
  }

  function onStart(e) {
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragDelta = 0;
  }

  function onMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragDelta = currentX - startX;
    startX = currentX;
    targetAngle += dragDelta * 0.45;
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    const step = 360 / totalCards;
    targetAngle = Math.round(targetAngle / step) * step;
  }

  const trackWrap = document.querySelector('#flow-process-section .flow-track-wrapper');
  if (trackWrap) {
    trackWrap.addEventListener('mousedown', onStart);
    trackWrap.addEventListener('touchstart', onStart, { passive: true });
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (Math.abs(dragDelta) > 5) return;
      const step = 360 / totalCards;
      const targetCardAngle = -index * step;
      let diff = (targetCardAngle - targetAngle) % 360;
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;
      targetAngle += diff;
    });
  });

  animateOrbit();
})();


/* ==========================================================================
   4. GSAP STAGGERED SPLIT-WORD REVEAL & SPA MUTATION OBSERVER
   ========================================================================== */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  function splitIntoWords(element) {
    if (element.classList && element.classList.contains('words-split')) return;

    const nodes = Array.from(element.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text.trim() === '') return;

        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          if (word.trim() === '') {
            fragment.appendChild(document.createTextNode(word));
          } else {
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
        splitIntoWords(node);
      }
    });

    if (element.classList) {
      element.classList.add('words-split');
    }
  }

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
      stagger: 0.08,
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }

  function processHeadings(headings) {
    headings.forEach(heading => {
      splitIntoWords(heading);
      animateHeading(heading);
    });
  }

  const HEADING_SELECTOR = [
    'h2.section-heading',
    '.view-intro h1',
    '.about-grid h2',
    '.sustainability-box h2',
    '.contact-faqs h2'
  ].join(', ');

  const initialHeadings = document.querySelectorAll(HEADING_SELECTOR);
  processHeadings(initialHeadings);

  const pageViews = document.querySelectorAll('.page-view');
  const spaObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      const section = mutation.target;
      if (mutation.attributeName === 'class' && section.classList.contains('active')) {
        ScrollTrigger.refresh();
        const newHeadings = section.querySelectorAll(HEADING_SELECTOR);
        processHeadings(newHeadings);
      }
    });
  });

  pageViews.forEach(section => {
    spaObserver.observe(section, { attributes: true });
  });
});


/* ==========================================================================
   5. TRACK YOUR HERB — 3D POP CARD & REPEATABLE TYPEWRITER OBSERVER
   ========================================================================== */
(function initTrackHerbSection() {
  const section = document.getElementById('popCard') || document.getElementById('track-herb-section');
  if (!section) return;

  const typewriterHeading = section.querySelector('#typewriter-heading');
  const divider = section.querySelector('.leaf-divider');
  const btnWrap = section.querySelector('.track-btn-wrap');
  const leafIcon = section.querySelector('.leaf-icon');

  const animElements = [typewriterHeading, divider, btnWrap].filter(Boolean);
  if (animElements.length > 0) {
    gsap.fromTo(animElements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  const curvesUL = [
    section.querySelector('.track-curve-ul-1'),
    section.querySelector('.track-curve-ul-2'),
    section.querySelector('.track-curve-ul-3'),
    section.querySelector('.track-curve-ul-4')
  ].filter(Boolean);

  const curvesLR = [
    section.querySelector('.track-curve-lr-1'),
    section.querySelector('.track-curve-lr-2'),
    section.querySelector('.track-curve-lr-3'),
    section.querySelector('.track-curve-lr-4')
  ].filter(Boolean);

  const allCurves = [...curvesUL, ...curvesLR];
  if (allCurves.length > 0) {
    allCurves.forEach((curve) => {
      const len = curve.getTotalLength();
      gsap.set(curve, {
        strokeDasharray: len,
        strokeDashoffset: len
      });
    });

    const curveTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'center 45%',
        scrub: 1
      }
    });

    curvesUL.forEach((c, idx) => {
      curveTl.to(c, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, idx > 0 ? '-=0.15' : 0);
    });

    curvesLR.forEach((c, idx) => {
      curveTl.to(c, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, idx === 0 ? '-=0.2' : '-=0.15');
    });
  }

  if (leafIcon) {
    gsap.to(leafIcon, {
      y: -4,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
})();

(function initPopCardObserver() {
  function observePopCard() {
    const card = document.getElementById('popCard') || document.getElementById('track-herb-section');
    if (!card) return;

    const fullText = "Track Your Herb";
    const typewriterText = card.querySelector('.typewriter-text');
    let typeTween = null;
    let textObj = { count: 0 };

    function resetAnimation() {
      card.classList.remove('reveal');
      if (typeTween) {
        typeTween.kill();
        typeTween = null;
      }
      textObj.count = 0;
      if (typewriterText) {
        typewriterText.textContent = '';
      }
    }

    function playAnimation() {
      card.classList.add('reveal');
      if (typewriterText) {
        if (typeTween) typeTween.kill();
        textObj.count = 0;
        typewriterText.textContent = '';
        typeTween = gsap.to(textObj, {
          count: fullText.length,
          duration: 1.8,
          ease: 'none',
          onUpdate: () => {
            if (typewriterText) {
              typewriterText.textContent = fullText.slice(0, Math.ceil(textObj.count));
            }
          }
        });
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playAnimation();
        } else {
          resetAnimation();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(card);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePopCard);
  } else {
    observePopCard();
  }
})();
