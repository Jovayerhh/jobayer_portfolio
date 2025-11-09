/**
 * ============================================================
 * File: js/lottie-init.js
 * Author: Jobayer Hossain (AI Developer & Prompt Engineer)
 * Description:
 *   Handles Lottie logo animation initialization + entrance
 *   neon-glow + interactive hover scaling.
 * ============================================================
 */

(function () {
  // Safety check for Lottie
  if (typeof lottie === "undefined") {
    console.warn("⚠️ Lottie library not found. Skipping logo animation.");
    return;
  }

  // Grab logo container
  const logoContainer = document.getElementById("logoLottie");
  if (!logoContainer) {
    console.warn("Logo container #logoLottie not found in DOM.");
    return;
  }

  // 🎬 Lottie Animation JSON (Small Animated Logo)
  // 👉 Lightweight circle + pulse effect made with Lottie shapes
  const logoData = {
    v: "5.5.8",
    fr: 30,
    ip: 0,
    op: 90,
    w: 200,
    h: 200,
    nm: "Jobayer Logo",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Outer Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
              { t: 0, s: [0, 0, 100] },
              { t: 25, s: [100, 100, 100] },
              { t: 70, s: [105, 105, 100] },
              { t: 90, s: [100, 100, 100] }
            ]}
        },
        shapes: [
          {
            ty: "el",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [140, 140] },
            nm: "Ellipse Path",
          },
          {
            ty: "st",
            c: { a: 0, k: [0, 0.92, 1, 1] }, // Neon blue stroke
            o: { a: 0, k: 100 },
            w: { a: 0, k: 8 },
            lc: 1,
            lj: 1,
          },
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Inner Pulse",
        ks: {
          o: { a: 1, k: [
              { t: 0, s: [0] },
              { t: 30, s: [100] },
              { t: 70, s: [0] }
            ]},
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "el",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [40, 40] },
            nm: "Inner Ellipse",
          },
          {
            ty: "fl",
            c: { a: 0, k: [0, 0.92, 1, 0.5] },
            o: { a: 0, k: 100 },
          },
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0,
      },
    ],
  };

  // 💫 Initialize animation
  const animation = lottie.loadAnimation({
    container: logoContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: logoData,
  });

  // Initial styles for the logo container
  Object.assign(logoContainer.style, {
    width: "64px",
    height: "64px",
    cursor: "pointer",
    filter: "drop-shadow(0 0 20px rgba(0,234,255,0.25))",
    transition: "all 0.3s ease-in-out",
  });

  // Hover effect for a “3D pop”
  logoContainer.addEventListener("mouseenter", () => {
    logoContainer.style.transform = "scale(1.1)";
    logoContainer.style.filter =
      "drop-shadow(0 0 35px rgba(0,234,255,0.35)) brightness(1.2)";
  });

  logoContainer.addEventListener("mouseleave", () => {
    logoContainer.style.transform = "scale(1)";
    logoContainer.style.filter =
      "drop-shadow(0 0 20px rgba(0,234,255,0.25)) brightness(1)";
  });

  // Play subtle entrance animation using GSAP (if available)
  if (typeof gsap !== "undefined") {
    gsap.from(logoContainer, {
      scale: 0,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      delay: 0.2,
    });
  }
})();
