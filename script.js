// ═══════════════════════════════════════════════════════════════
// PRICERNOT — INTERFACE CONTROLLER
// Motion: slow, deliberate, performance-first
// ═══════════════════════════════════════════════════════════════

(() => {
  // Mobile Navigation Toggle (matches index.html data-attributes)
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mainNav = document.querySelector('[data-nav]');

  const setNavOpen = (open) => {
    if (!navToggle || !mainNav) return;
    mainNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('is-open');
      setNavOpen(!isOpen);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setNavOpen(false);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!mainNav.classList.contains('is-open')) return;
      if (mainNav.contains(target) || navToggle.contains(target)) return;
      setNavOpen(false);
    });
  }

  // Slow smooth scroll for in-page anchors
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smoothScrollTo = (targetY, durationMs = 1100) => {
    const startY = window.scrollY || window.pageYOffset;
    const delta = targetY - startY;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#') || href === '#') return;

    const el = document.querySelector(href);
    if (!el) return;

    event.preventDefault();
    const headerOffset = header ? header.offsetHeight + 12 : 90;
    const targetY = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - headerOffset;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
    } else {
      smoothScrollTo(targetY, 1200);
    }

    history.pushState(null, '', href);
    setNavOpen(false);
  });

  // Parallax Depth Effect (only if layers exist)
  const depth1 = document.querySelector('.depth-1');
  const depth2 = document.querySelector('.depth-2');
  const depth3 = document.querySelector('.depth-3');

  if (depth1 || depth2 || depth3) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY || window.pageYOffset;
      if (depth1) depth1.style.transform = `translateY(${scrolled * 0.15}px)`;
      if (depth2) depth2.style.transform = `translateY(${scrolled * 0.25}px)`;
      if (depth3) depth3.style.transform = `translateY(${scrolled * 0.1}px)`;
    }, { passive: true });
  }

  // Cinematic reveals on scroll (class-based, no inline opacity/transform)
  const addReveal = (el, delayMs = 0) => {
    if (!(el instanceof HTMLElement)) return;
    el.classList.add('reveal');
    if (delayMs > 0) el.style.setProperty('--reveal-delay', `${delayMs}ms`);
  };

  const stagger = (elements, baseDelay, step, maxDelay = 700) => {
    let i = 0;
    elements.forEach((el) => {
      const delay = Math.min(baseDelay + i * step, maxDelay);
      addReveal(el, delay);
      i += 1;
    });
  };

  const initReveals = () => {
    document.documentElement.classList.add('reveal-ready');

    const heroText = Array.from(document.querySelectorAll('.hero-text > *'));
    stagger(heroText, 0, 120, 520);

    const heroVisual = document.querySelector('.hero-image-container');
    if (heroVisual) addReveal(heroVisual, 160);

    const infoCards = Array.from(document.querySelectorAll('.section-info .info-card'));
    stagger(infoCards, 0, 140, 520);

    document.querySelectorAll('.section').forEach((section) => {
      const title = section.querySelector('.section-head .section-title');
      const desc = section.querySelector('.section-head .section-desc');
      if (title) addReveal(title, 0);
      if (desc) addReveal(desc, 140);

      const panels = Array.from(section.querySelectorAll('.panel'));
      stagger(panels, 0, 140, 700);

      const socialCards = Array.from(section.querySelectorAll('.social-card'));
      stagger(socialCards, 0, 90, 520);
    });

    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }
    );

    requestAnimationFrame(() => {
      const vh = window.innerHeight || 800;
      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh * 0.92 && rect.bottom > 0;
        if (inView) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    });
  };

  // Scroll drift: subtle life while scrolling (icons/cards)
  const initDrift = () => {
    if (prefersReducedMotion) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    const driftTargets = [
      '.social-card',
      '.social-card img',
      '.info-card',
      '.info-icon',
      '.panel',
      '.hero-image-container',
      '.brand-mark'
    ];

    const elements = Array.from(document.querySelectorAll(driftTargets.join(',')));
    if (elements.length === 0) return;

    // Deterministic pseudo-random (stable across reloads)
    const seeded = (i) => {
      const x = Math.sin(i * 999.123) * 10000;
      return x - Math.floor(x);
    };

    const state = new WeakMap();
    elements.forEach((el, i) => {
      el.classList.add('drift');
      const rx = seeded(i + 1);
      const ry = seeded(i + 2);
      const isHero = el.classList.contains('hero-image-container');
      const isIcon = el.classList.contains('info-icon') || el.tagName === 'IMG';
      const isSocialCard = el.classList.contains('social-card');
      const isInfoCard = el.classList.contains('info-card');
      const isPanel = el.classList.contains('panel');
      const isBrand = el.classList.contains('brand-mark');

      const depth =
        (isHero ? 1.25 : 1) *
        (isIcon ? 1.15 : 1) *
        (isSocialCard ? 1.05 : 1) *
        (isInfoCard ? 0.95 : 1) *
        (isPanel ? 0.75 : 1) *
        (isBrand ? 0.85 : 1);

      const ampY = (10 + ry * 18) * depth; // ~10..28px
      const ampX = (4 + rx * 10) * depth;  // ~4..14px
      const rot = (seeded(i + 3) - 0.5) * 2.4 * depth; // ~-1.2..1.2deg
      const phase = seeded(i + 4) * Math.PI * 2;
      const sway = 0.25 + seeded(i + 5) * 0.55; // 0.25..0.80
      state.set(el, { x: 0, y: 0, r: 0, ampX, ampY, rot, phase, sway, depth });
    });

    let lastY = window.scrollY || window.pageYOffset;
    let velocity = 0;
    let camX = 0;
    let camY = 0;
    let ticking = false;
    let settleFrames = 0;

    const update = (now) => {
      ticking = false;

      const vh = window.innerHeight || 800;
      const center = vh * 0.5;
      const v = clamp(velocity, -140, 140);
      const velBoost = v * 0.14; // more present
      const t = (now || performance.now()) / 1000;

      // Camera sway for background (nebula + particles)
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - vh);
      const pos = clamp((lastY / maxScroll) * 2 - 1, -1, 1); // -1..1 through page
      const camVel = clamp(v, -120, 120);
      const baseY = -pos * 18;
      const baseX = Math.sin(pos * Math.PI) * 10;
      const velY = camVel * 0.18;
      const velX = camVel * -0.10;
      const timeX = Math.sin(t * 0.65) * 2.2;
      const timeY = Math.cos(t * 0.55) * 1.6;

      const camTargetX = baseX + velX + timeX;
      const camTargetY = baseY + velY + timeY;
      camX = lerp(camX, camTargetX, 0.08);
      camY = lerp(camY, camTargetY, 0.08);
      docEl.style.setProperty('--cam-x', `${camX.toFixed(2)}px`);
      docEl.style.setProperty('--cam-y', `${camY.toFixed(2)}px`);

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) continue;

        const s = state.get(el);
        if (!s) continue;

        const mid = rect.top + rect.height * 0.5;
        const n = clamp((mid - center) / center, -1.2, 1.2); // -1..1 around viewport

        const swayT = t * (0.55 + s.sway * 0.45);
        const timeSwayX = Math.sin(swayT + s.phase) * (s.ampX * 0.18);
        const timeSwayY = Math.cos(swayT + s.phase * 1.7) * (s.ampY * 0.12);

        const targetY = (-n * s.ampY) + velBoost * (s.ampY / 18) + timeSwayY;
        const targetX = Math.sin(n * Math.PI + s.phase) * s.ampX + timeSwayX;
        const targetR = Math.sin(n * Math.PI + s.phase) * s.rot;

        s.x = lerp(s.x, targetX, 0.10);
        s.y = lerp(s.y, targetY, 0.10);
        s.r = lerp(s.r, targetR, 0.07);

        el.style.setProperty('--drift-x', `${s.x.toFixed(2)}px`);
        el.style.setProperty('--drift-y', `${s.y.toFixed(2)}px`);
        el.style.setProperty('--drift-r', `${s.r.toFixed(3)}deg`);
      }

      // Let motion “settle” after scroll ends
      velocity = lerp(velocity, 0, 0.07);
      if (Math.abs(velocity) > 0.25) settleFrames = 26;
      if (settleFrames > 0) {
        settleFrames -= 1;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      }
    };

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      velocity = y - lastY;
      lastY = y;
      settleFrames = 30;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    // Prime once so the page doesn't feel static on load
    settleFrames = 20;
    requestAnimationFrame(update);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveals();
      initDrift();
    });
  } else {
    initReveals();
    initDrift();
  }
})();

// ═══════════════════════════════════════════════════════════════
// END TRANSMISSION
// ═══════════════════════════════════════════════════════════════

