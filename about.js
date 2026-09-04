gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* =====================================
   COOL KINETIC INTRO HERO ANIMATION
===================================== */
const introTimeline = gsap.timeline({
    defaults: { ease: "power3.out" }
});

introTimeline
    .fromTo(".intro-badge", 
        { opacity: 0, y: -25, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)" }
    )
    .fromTo(".title-word", 
        { 
            opacity: 0, 
            y: 50, 
            scale: 0.88, 
            filter: "blur(18px)",
            rotationX: 20
        }, 
        { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            filter: "blur(0px)",
            rotationX: 0,
            duration: 1.3, 
            stagger: 0.18, 
            ease: "power3.out" 
        }, 
        "-=0.5"
    )
    .fromTo(".intro-bottom", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8 }, 
        "-=0.6"
    );

// Interactive 3D Cursor Spotlight & Tilt Reactor on Hero
const introSection = document.querySelector(".intro");
const introTitle = document.querySelector(".intro-title");
const introSpotlight = document.getElementById("introSpotlight");

if (introSection && introTitle) {
    introSection.addEventListener("mousemove", (e) => {
        const rect = introSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (introSpotlight) {
            introSpotlight.style.left = `${mouseX}px`;
            introSpotlight.style.top = `${mouseY}px`;
        }

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = (centerY - mouseY) / 25;
        const tiltY = (mouseX - centerX) / 30;

        introTitle.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    introSection.addEventListener("mouseleave", () => {
        introTitle.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

/* SCROLL INTRO EXIT */
gsap.to(".intro", {
    yPercent: -100,
    ease: "power4.inOut",
    scrollTrigger: {
        trigger: ".intro",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        pinSpacing: false
    }
});

gsap.to(".intro-content", {
    scale: 2.4,
    opacity: 0,
    filter: "blur(25px)",
    scrollTrigger: {
        trigger: ".intro",
        start: "30% top",
        end: "bottom top",
        scrub: true
    }
});

/* =====================================
   ABOUT SECTION WITH FAST TYPEWRITER
===================================== */
const sectionTitle = document.querySelector(".section-title");
if (sectionTitle) {
    sectionTitle.innerHTML = `<span id="titleType"></span>`;
}

gsap.timeline({
    scrollTrigger: {
        trigger: ".about-hero",
        start: "top 70%",
        toggleActions: "play none none reverse"
    }
})
.fromTo(".eyebrow", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
.to("#titleType", {
    text: "MEET THE HUNTERS.",
    duration: 0.8, // Speeds up header typing (reduced from 2.2s to 0.8s)
    ease: "none"
})
.fromTo(".about-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

/* =====================================
   DYNAMIC CANVAS ERASE & HOVER SEQUENCE
===================================== */
document.querySelectorAll(".member").forEach((member) => {
    const wrapper = member.querySelector(".member-image");
    const canvas = wrapper ? wrapper.querySelector(".reveal-canvas") : null;
    const description = member.querySelector(".member-description");
    const fullText = description ? (description.getAttribute("data-text") || description.innerText) : "";
    
    let hasHovered = false;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const maskImg = new Image();
    maskImg.src = canvas.getAttribute("data-mask");

    function renderMask() {
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.globalCompositeOperation = "source-over";
        
        const hRatio = canvas.width / (maskImg.width || 1);
        const vRatio = canvas.height / (maskImg.height || 1);
        const ratio = Math.max(hRatio, vRatio);
        
        const shiftX = (canvas.width - maskImg.width * ratio) / 2;
        const shiftY = (canvas.height - maskImg.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            maskImg,
            0, 0, maskImg.width, maskImg.height,
            shiftX, shiftY, maskImg.width * ratio, maskImg.height * ratio
        );
    }

    maskImg.onload = renderMask;
    window.addEventListener("resize", renderMask);

    function startHoverSequence(e) {
        if (!hasHovered) {
            hasHovered = true;
            wrapper.classList.add("is-hovered");
            member.classList.add("is-revealed");

            // Fast Member Description Typewriter
            if (description) {
                gsap.to(description, {
                    text: fullText,
                    duration: 1.2, // Speeds up bio typing (reduced from 4.5s to 1.2s)
                    ease: "none"
                });
            }
        }

        // Canvas Eraser Algorithm
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX || !clientY) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2, false);
        ctx.fill();
    }

    canvas.addEventListener("mousemove", startHoverSequence);
    canvas.addEventListener("touchmove", startHoverSequence);
});

/* =====================================
   COMIC-STYLE STAGGERED POP-UP ANIMATIONS FOR CARDS
===================================== */
gsap.utils.toArray(".member").forEach((member, i) => {
    // Pop-Up Scale & Slide Entrance with Elastic Easing
    gsap.fromTo(member, 
        { 
            opacity: 0, 
            y: 120, 
            scale: 0.85,
            rotationX: 15
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: "back.out(1.7)", // Comic-Style Elastic Pop-Up
            scrollTrigger: {
                trigger: member,
                start: "top 85%",
                end: "top 30%",
                toggleActions: "play none none reverse",
            }
        }
    );

    // Staggered Tags Animation inside each card with full size guarantee
    const tags = member.querySelectorAll(".member-tags span");
    if (tags.length > 0) {
        gsap.fromTo(tags, 
            {
                opacity: 0,
                y: 15
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.08,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: member,
                    start: "top 85%",
                    once: true
                }
            }
        );
    }
});

/* =====================================
   3D TILT EFFECT ON CARD HOVER
===================================== */
document.querySelectorAll(".member-image").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
            rotationY: x * 0.05,
            rotationX: -y * 0.05,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.4
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            ease: "power2.out",
            duration: 0.6
        });
    });
});