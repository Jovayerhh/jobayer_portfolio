/**
 * ============================================================
 * File: js/three-hero.js
 * Author: Jobayer Hossain
 * Description:
 *   Creates an animated neon particle background using Three.js
 *   integrated with GSAP scroll smoothing (Lenis compatible)
 * ============================================================
 */

(function () {
  // 🧠 Safety check
  if (typeof THREE === "undefined") {
    console.warn("⚠️ Three.js not loaded. Skipping background render.");
    return;
  }

  const container = document.getElementById("three-bg");
  if (!container) return;

  // 🏗️ Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 90;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // 🌌 Particle geometry
  const particleCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 600;
    positions[i3 + 1] = (Math.random() - 0.5) * 400;
    positions[i3 + 2] = (Math.random() - 0.5) * 600;

    colors[i3] = 0.0 + Math.random() * 0.4; // cyan shade variation
    colors[i3 + 1] = 0.7 + Math.random() * 0.3;
    colors[i3 + 2] = 1.0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 🧿 Material
  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });

  // ✨ Points mesh
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // 🔆 Ambient glow light
  const light = new THREE.PointLight(0x00eaff, 1.8, 500);
  light.position.set(0, 0, 150);
  scene.add(light);

  // 🔁 Animation loop
  let time = 0;
  function animate() {
    time += 0.002;
    points.rotation.y += 0.0006;
    points.rotation.x = Math.sin(time) * 0.1;
    points.rotation.z = Math.cos(time * 0.8) * 0.08;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // 🌀 Smooth resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 💨 Background parallax effect
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
    const y = (e.clientY / window.innerHeight - 0.5) * 0.2;
    gsap.to(camera.rotation, {
      x: y,
      y: x,
      duration: 1.5,
      ease: "power2.out",
    });
  });

  // 🧭 Optional Scroll Trigger Sync
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: "#projects",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        gsap.to(points.material, {
          opacity: 0.1,
          duration: 1,
        });
      },
      onLeaveBack: () => {
        gsap.to(points.material, {
          opacity: 0.5,
          duration: 1,
        });
      },
    });
  }

  // 🌙 Initial fade-in of background
  if (typeof gsap !== "undefined") {
    gsap.from(renderer.domElement, {
      opacity: 0,
      duration: 1.8,
      ease: "power2.out",
    });
  }

  // ✅ Style container
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none",
    background: "transparent",
  });
})();
