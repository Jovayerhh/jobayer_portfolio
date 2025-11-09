// File: js/main.js
// Professional portfolio interactions — heading anim, hero parallax, CCAnimator, contact, theme, menu.
// Place this file at: /js/main.js
(() => {
  "use strict";

  /* ======================
     Utilities & config
     ====================== */
  const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const PREFERS_REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const safeLog = (...args) => { try { console.log(...args); } catch (e) {} };
  const debounce = (fn, wait = 80) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  async function copyTextToClipboard(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      return true;
    } catch (err) {
      console.warn("copy failed", err);
      return false;
    }
  }

  /* ======================
     Data (exported)
     ====================== */
  const PROFILE = {
    name: "Jobayer Hossain",
    study: "ICST (Feni, Bangladesh)",
    phone: "01619504428",
    email: "jovayerhossain0@gmail.com",
    tagline: "AI-first developer building production ML systems, prompt engineering toolkits, and premium interactive experiences.",
  };

  const PROJECTS = [
    { title: "AI Prompt Studio", desc: "Interactive prompt engineering toolkit with experiments & versioning.", tags: "React · Node · OpenAI", url: "#" },
    { title: "Realtime Inference Dashboard", desc: "Low-latency inference stack with monitoring & autoscaling.", tags: "FastAPI · Kubernetes · Redis", url: "#" },
    { title: "Visual Prompt Explorer", desc: "Visual editor for composing prompts & tracking telemetry.", tags: "Svelte · WebGL · Lottie", url: "#" },
  ];

  const SKILLS = [
    { id: "python", label: "Python", href: "https://www.python.org/", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { id: "react", label: "React", href: "https://react.dev/", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { id: "node", label: "Node.js", href: "https://nodejs.org/", icon: "https://cdn.simpleicons.org/node.js/43853D" },
    { id: "docker", label: "Docker", href: "https://www.docker.com/", icon: "https://cdn.simpleicons.org/docker/2496ED" },
    { id: "k8s", label: "Kubernetes", href: "https://kubernetes.io/", icon: "https://cdn.simpleicons.org/kubernetes/326CE5" },
    { id: "three", label: "Three.js", href: "https://threejs.org/", icon: "https://cdn.simpleicons.org/three.js/FFFFFF" },
    { id: "gsap", label: "GSAP", href: "https://greensock.com/gsap/", icon: "https://cdn.simpleicons.org/greensock/88CE02" },
    { id: "ml", label: "Machine Learning", href: "https://en.wikipedia.org/wiki/Machine_learning", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
  ];

  /* ======================
     DOM cache
     ====================== */
  const projectsGrid = $("#projectsGrid");
  const skillsList = $("#skillsList");
  const contactForm = $("#contactForm");
  const copyEmailBtn = $("#copyEmailBtn");
  const themeToggle = $("#themeToggle");
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const headingEl = document.querySelector(".neon-heading");
  const sections = $$(".section");

  /* ======================
     Renderers
     ====================== */
  function renderProjects(list = PROJECTS) {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";
    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "project-card glass";
      card.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <p class="tags">${escapeHtml(p.tags)}</p>
        <div><a href="${p.url}" class="btn btn-outline" aria-label="Open ${escapeHtml(p.title)}">View</a></div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  function renderSkills(list = SKILLS) {
    if (!skillsList) return;
    skillsList.innerHTML = "";
    list.forEach((s) => {
      const a = document.createElement("a");
      a.className = "skill-chip";
      a.href = s.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.title = `${s.label} — official`;
      a.innerHTML = `<img class="skill-icon" alt="${escapeHtml(s.label)}" src="${s.icon}"><span>${escapeHtml(s.label)}</span>`;
      skillsList.appendChild(a);
    });
  }

  function escapeHtml(str = "") {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ======================
     Heading animation (per-character) — robust + single-run
     ====================== */
  const HeadingAnimator = (() => {
    let inited = false;
    let config = { stagger: 100, startDelay: 260, finishDelay: 1400, colors: ["#00eaff", "#1e60d6", "#ff00aa", "#00ff99", "#ffaa00", "#ff4b4b"], startOnView: true };
    function splitAndAnimate(el) {
      if (!el || inited) return;
      const raw = el.textContent.trim();
      if (!raw) return;
      el.textContent = "";
      const frag = document.createDocumentFragment();
      const chars = Array.from(raw);
      chars.forEach((ch) => {
        const sp = document.createElement("span");
        sp.textContent = ch === " " ? "\u00A0" : ch;
        sp.setAttribute("aria-hidden", "true");
        frag.appendChild(sp);
      });
      el.appendChild(frag);

      // stagger show
      const spans = Array.from(el.querySelectorAll("span"));
      spans.forEach((sp, i) => {
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        setTimeout(() => {
          sp.classList.add("show");
          sp.style.color = color;
        }, config.startDelay + i * config.stagger);
      });

      // finalize to gradient after all chars shown
      const finishAt = config.startDelay + spans.length * config.stagger + config.finishDelay;
      setTimeout(() => {
        // add gradient once and ensure fallback color and webkit fill for visibility
        el.classList.add("gradient-finish");
        // CSS fallback: color var and -webkit-text-fill-color handled in CSS;
        // ensure spans don't keep inline colors that could hide gradient — remove inline color after short fade
        setTimeout(() => spans.forEach((s) => s.style.color = ""), 400);
      }, finishAt);

      inited = true;
    }

    function init(el = headingEl, opts = {}) {
      Object.assign(config, opts || {});
      if (!el) return;
      if (config.startOnView && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              splitAndAnimate(el);
              obs.disconnect();
            }
          });
        }, { threshold: 0.15 });
        io.observe(el);
      } else {
        // immediate
        splitAndAnimate(el);
      }
    }

    return { init, _splitAndAnimate: splitAndAnimate };
  })();

  /* ======================
     Hero parallax (pointer + scroll)
     ====================== */
  function initHeroParallax() {
    const hero = $(".hero");
    if (!hero || PREFERS_REDUCED) return;
    const bg = hero.querySelector(".hero-bg");
    const mid = hero.querySelector(".hero-mid");
    const fg = hero.querySelector(".hero-fg");
    let targetX = 0, targetY = 0, curX = 0, curY = 0, scrollY = 0;

    window.addEventListener("scroll", () => { scrollY = window.scrollY || 0; }, { passive: true });
    window.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      targetX = (e.clientX - cx) / (r.width / 2);
      targetY = (e.clientY - cy) / (r.height / 2);
    }, { passive: true });

    let rafId = null;
    function tick() {
      curX = lerp(curX, targetX, 0.08);
      curY = lerp(curY, targetY, 0.08);
      const s = scrollY * 0.08;
      if (bg) bg.style.transform = `translate3d(${curX * 8}px, ${curY * 8 + s}px, 0) scale(1.02)`;
      if (mid) mid.style.transform = `translate3d(${curX * 14}px, ${curY * 14 + s * 1.15}px, 0)`;
      if (fg) fg.style.transform = `translate3d(${curX * 22}px, ${curY * 22 + s * 1.4}px, 0)`;
      rafId = requestAnimationFrame(tick);
    }
    if (!rafId) tick();
  }

  /* ======================
     CCAnimator — word-split + intersection animations
     ====================== */
  const CCAnimator = (() => {
    let state = { inited: false, observer: null };

    function injectStyles() {
      if ($("#cc-anim-styles")) return;
      const css = `
        .cc-word{display:inline-block;white-space:pre;transition:transform .35s cubic-bezier(.2,.9,.2,1),opacity .35s;color:inherit}
        .cc-anim{opacity:0;transform:translateY(8px)}
        .cc-play{opacity:1;transform:none;transition:opacity .6s,transform .6s}
        .cc-word-hover{transform:translateY(-6px) scale(1.06)}
      `;
      const s = document.createElement("style");
      s.id = "cc-anim-styles";
      s.textContent = css;
      document.head.appendChild(s);
    }

    function splitTextNodes(root = document.body) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentNode;
          if (!parent || parent.closest && parent.closest("script, style, .no-cc")) return NodeFilter.FILTER_REJECT;
          if (['PRE', 'CODE', 'TEXTAREA', 'INPUT'].includes(parent.nodeName)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((textNode) => {
        const text = textNode.nodeValue;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((tok) => {
          if (/^\s+$/.test(tok)) frag.appendChild(document.createTextNode(tok));
          else {
            const span = document.createElement("span");
            span.className = "cc-word";
            span.textContent = tok;
            frag.appendChild(span);
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    function bindAnimations(root = document.body) {
      const els = Array.from(root.querySelectorAll("h1,h2,h3,p,li,.glass,.btn,.skill-chip"));
      if (!els.length) return;
      if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add("cc-play"));
        return;
      }
      state.observer = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("cc-play");
            state.observer.unobserve(en.target);
          }
        });
      }, { threshold: 0.04 });

      els.forEach((el, i) => {
        el.classList.add("cc-anim");
        el.style.transitionDelay = `${i * 28}ms`;
        state.observer.observe(el);
        // word hover burst
        el.addEventListener("pointerenter", () => {
          if (PREFERS_REDUCED) return;
          el.querySelectorAll(".cc-word").forEach((w, idx) => {
            w.style.transitionDelay = `${idx * 8}ms`;
            w.classList.add("cc-word-hover");
          });
        }, { passive: true });
        el.addEventListener("pointerleave", () => {
          el.querySelectorAll(".cc-word").forEach((w) => {
            w.classList.remove("cc-word-hover");
            w.style.transitionDelay = "";
          });
        }, { passive: true });
      });
    }

    function init() {
      if (PREFERS_REDUCED) { safeLog("reduced-motion: CCAnimator disabled"); return; }
      if (state.inited) return;
      injectStyles();
      splitTextNodes(document.body);
      bindAnimations(document.body);
      state.inited = true;
    }

    function refresh() {
      // quick refresh: run split+bind again for dynamic content
      try { splitTextNodes(document.body); bindAnimations(document.body); } catch (e) { safeLog("CCAnimator refresh failed", e); }
    }

    return { init, refresh, _state: state };
  })();

  /* ======================
     Section reveal
     ====================== */
  function initSectionReveal() {
    if (!sections || !sections.length) return;
    function reveal() {
      const trigger = window.innerHeight * 0.9;
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top < trigger) sec.classList.add("visible");
      });
    }
    window.addEventListener("scroll", debounce(reveal, 60), { passive: true });
    reveal();
  }

  /* ======================
     Contact form + actions
     ====================== */
  function initContactHandlers() {
    // form
    if (contactForm) {
      contactForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const name = contactForm.querySelector('input[name="name"]')?.value?.trim();
        const email = contactForm.querySelector('input[name="email"]')?.value?.trim();
        const msg = contactForm.querySelector('textarea[name="message"]')?.value?.trim();
        if (!name || !email || !msg) {
          showFormStatus("Please fill all fields.", "error");
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          showFormStatus("Please enter a valid email.", "error");
          return;
        }
        // demo: animated feedback
        showFormStatus("Thanks — message received (demo).", "success");
        contactForm.reset();
      });
    }

    // copy email
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener("click", async () => {
        const ok = await copyTextToClipboard(PROFILE.email);
        if (ok) {
          copyEmailBtn.textContent = "Copied ✓";
          setTimeout(() => {
            copyEmailBtn.innerHTML = `<img class="icon" alt="" src="https://cdn.simpleicons.org/gmail/EA4335"> Copy Email`;
          }, 1400);
        } else {
          copyEmailBtn.textContent = "Copy failed";
        }
      });
    }
  }

  function showFormStatus(msg, type = "success") {
    let el = document.querySelector(".form-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "form-status";
      if (contactForm) contactForm.parentNode.insertBefore(el, contactForm.nextSibling);
      else document.body.appendChild(el);
      Object.assign(el.style, { marginTop: "12px", padding: "10px 14px", borderRadius: "8px", fontWeight: "700" });
    }
    el.textContent = msg;
    if (type === "error") {
      el.style.background = "rgba(255,75,75,0.12)";
      el.style.color = "#ffbdbd";
      el.style.border = "1px solid rgba(255,75,75,0.18)";
    } else {
      el.style.background = "linear-gradient(90deg,#00eaff,#1e60d6)";
      el.style.color = "#001322";
      el.style.border = "none";
    }
    setTimeout(() => { try { el.style.transition = "opacity .45s ease"; el.style.opacity = "0"; setTimeout(() => el.remove(), 480); } catch (e) {} }, 3000);
  }

  /* ======================
     Theme & menu
     ====================== */
  function initThemeAndMenu() {
    try {
      // theme
      const saved = localStorage.getItem("themeMode") || null;
      if (saved === "light") document.body.classList.add("light-mode");
      if (themeToggle) {
        themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
        themeToggle.addEventListener("click", () => {
          const isLight = document.body.classList.toggle("light-mode");
          themeToggle.textContent = isLight ? "🌙" : "☀️";
          localStorage.setItem("themeMode", isLight ? "light" : "dark");
        }, { passive: true });
      }
      // menu
      if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
          navLinks.classList.toggle("show");
          menuToggle.textContent = navLinks.classList.contains("show") ? "✕" : "☰";
        });
        // close mobile menu on nav link click
        navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
          if (window.innerWidth <= 900) {
            navLinks.classList.remove("show");
            menuToggle.textContent = "☰";
          }
        }));
      }
    } catch (e) { safeLog("theme/menu init failed", e); }
  }

  /* ======================
     Expose API & init
     ====================== */
  function initAll() {
    renderProjects();
    renderSkills();
    initThemeAndMenu();
    initContactHandlers();
    initHeroParallax();
    CCAnimator.init(); // word-level animations
    initSectionReveal();
    HeadingAnimator.init(); // heading animation (on view)
    // expose small API
    window.__JOBAYER_PORTFOLIO = {
      PROFILE, PROJECTS, SKILLS,
      renderProjects, renderSkills, copyTextToClipboard,
      HeadingAnimator, CCAnimator
    };
    safeLog("main.js initialized");
  }

  // DOM ready init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

})();
// FORM HANDLER — Formspree + No Redirect + Neon Animated Feedback
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";
    status.style.color = "#00eaff";
    status.style.opacity = "1";
    status.style.textShadow = "0 0 8px rgba(0,234,255,0.5)";

    const formData = new FormData(form);
    try {
      const response = await fetch("https://formspree.io/f/xovwwzdo", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" },
      });

      // If Formspree sends HTML (demo page), stop it:
      if (response.headers.get("content-type")?.includes("text/html")) {
        throw new Error("Unexpected HTML response");
      }

      if (response.ok) {
        form.reset();
        status.textContent = "✅ Message sent successfully!";
        status.style.color = "#00ffb7";
        status.style.textShadow = "0 0 20px rgba(0,255,183,0.7)";
        
        // Neon pulse animation
        status.animate(
          [
            { textShadow: "0 0 6px rgba(0,255,180,0.5)" },
            { textShadow: "0 0 20px rgba(0,255,180,0.8)" },
            { textShadow: "0 0 6px rgba(0,255,180,0.5)" },
          ],
          { duration: 1600, iterations: 3 }
        );
      } else {
        const data = await response.json();
        const errorText =
          data.errors && data.errors[0]
            ? `❌ ${data.errors[0].message}`
            : "❌ Something went wrong. Try again.";
        status.textContent = errorText;
        status.style.color = "#ff5b5b";
        status.style.textShadow = "0 0 20px rgba(255,90,90,0.7)";

        // Error flicker animation
        status.animate(
          [
            { opacity: 1 },
            { opacity: 0.3 },
            { opacity: 1 },
            { opacity: 0.4 },
            { opacity: 1 },
          ],
          { duration: 1200, iterations: 2 }
        );
      }
    } catch (err) {
      status.textContent = "⚠️ Network error. Please try again.";
      status.style.color = "#ff5b5b";
      status.style.textShadow = "0 0 12px rgba(255,60,60,0.7)";
    }

    // Fade out gracefully
    setTimeout(() => {
      status.style.transition = "opacity 0.8s ease";
      status.style.opacity = "0";
      setTimeout(() => {
        status.textContent = "";
        status.style.opacity = "1";
      }, 800);
    }, 4500);
  });
});
