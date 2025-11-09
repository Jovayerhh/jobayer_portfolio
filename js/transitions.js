/**
 * ============================================================
 * File: js/transitions.js
 * Author: Jobayer Hossain
 * Description:
 *   Global motion controller for the portfolio website.
 *   - Handles entrance animations
 *   - Scroll-triggered section reveals
 *   - Hero CTA and text neon pulsing
 *   - Reduced motion accessibility
 * ============================================================
 */

(function () {
  // 🧠 Check GSAP
  if (typeof gsap === "undefined") {
    console.warn("⚠️ GSAP not loaded. Transitions disabled.");
    return;
  }

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 🌐 Reduced motion check
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionEase = "power3.out";

  // 💎 INITIAL HERO ANIMATIONS
  gsap.from(".neon-heading", {
    opacity: 0,
    y: 40,
    duration: 1.4,
    ease: motionEase,
  });

  gsap.from(".lead", {
    opacity: 0,
    y: 20,
    delay: 0.4,
    duration: 1.2,
    ease: motionEase,
  });

  gsap.from(".cta a", {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    delay: 0.8,
    duration: 1.1,
    ease: motionEase,
  });

  // 🌟 HERO GLOW PULSE (continuous subtle effect)
  gsap.to(".neon-heading", {
    textShadow: "0 0 25px rgba(0,234,255,0.25)",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // 📜 SECTION REVEALS ON SCROLL
  const revealElements = gsap.utils.toArray(".section, .project-card, .glass");

  revealElements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: motionEase,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // 🪄 CTA BUTTON FLOAT ANIMATION (for primary buttons)
  gsap.to(".btn-primary", {
    y: -3,
    repeat: -1,
    yoyo: true,
    duration: 2.4,
    ease: "sine.inOut",
  });

  // 🔷 NAVBAR REVEAL (when scrolling up)
  const header = document.querySelector(".site-header");
  if (header && ScrollTrigger) {
    let lastScroll = 0;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const dir = self.direction;
        if (dir === 1 && window.scrollY > 200) {
          gsap.to(header, { y: -100, duration: 0.4, ease: "power2.out" });
        } else {
          gsap.to(header, { y: 0, duration: 0.4, ease: "power2.out" });
        }
        lastScroll = self.scroll();
      },
    });
  }

  // 🌀 BACKGROUND PARALLAX ON SCROLL
  if (ScrollTrigger) {
    gsap.to("#three-bg", {
      y: -100,
      ease: "none",
      scrollTrigger: {
        scrub: 1,
      },
    });
  }

  // 🎨 SMOOTH ENTRANCE OF SECTIONS (delay chain)
  const timeline = gsap.timeline();
  timeline
    .from(".brand", { opacity: 0, y: -30, duration: 1.1, ease: motionEase })
    .from(".nav-links a", {
      opacity: 0,
      y: -10,
      stagger: 0.15,
      duration: 0.8,
    })
    .from(".profile-img", {
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)",
    }, "-=0.6");

  // 🧩 LENIS Integration (if loaded)
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 🕹️ Optional reduced-motion adjustments
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(0.5);
    console.info("Reduced motion mode enabled for accessibility.");
  }

  // 🌈 Debug log
  console.log("✅ Transitions initialized successfully (GSAP + ScrollTrigger active).");
})();
