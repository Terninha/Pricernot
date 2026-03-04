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
  // Detect touch devices to disable heavy hover/mouse-tracking effects
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // Track document visibility to pause expensive animations when tab is hidden
  let isDocumentVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    isDocumentVisible = !document.hidden;
  });

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

  // ═══════════════════════════════════════════════════════════════
  // TABS SYSTEM
  // ═══════════════════════════════════════════════════════════════
  // SCROLL PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════════════
  const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    let ticking = false;
    const updateProgress = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollHeight = docEl.scrollHeight - docEl.clientHeight;
      const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
      progressBar.style.width = `${progress}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  };

  // ═══════════════════════════════════════════════════════════════
  // SHOOTING STARS
  // ═══════════════════════════════════════════════════════════════
  const initShootingStars = () => {
    if (prefersReducedMotion || isTouchDevice) return;

    const container = document.querySelector('.stars-container');
    if (!container) return;

    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight * 0.5);

      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;

      container.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 2000);
    };

    // Create shooting stars periodically
    setInterval(() => {
      if (Math.random() > 0.5) {
        createShootingStar();
      }
    }, 8000);

    // Initial star
    setTimeout(createShootingStar, 2000);
  };

  // ═══════════════════════════════════════════════════════════════
  // SCHEDULE COUNTDOWN
  // ═══════════════════════════════════════════════════════════════
  const initCountdowns = () => {
    const countdowns = document.querySelectorAll('.schedule-countdown');
    if (countdowns.length === 0) return;

    const updateCountdowns = () => {
      const now = new Date();
      const brt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
      const dayOfWeek = brt.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hours = brt.getHours();
      const minutes = brt.getMinutes();

      countdowns.forEach((countdown) => {
        const schedule = countdown.dataset.schedule;
        let message = '';

        // Reset per tick (no inline styles; state is class-based)
        countdown.classList.remove('is-live', 'is-live-members');

        if (schedule === 'weekday') {
          // Tuesday to Friday (2-5)
          if (dayOfWeek >= 2 && dayOfWeek <= 5) {
            if (hours < 19) {
              const hoursLeft = 18 - hours;
              const minsLeft = 60 - minutes;
              message = `Em ${hoursLeft}h ${minsLeft}min`;
            } else if (hours === 19 && minutes < 60) {
              message = 'AO VIVO';
              countdown.classList.add('is-live');
            } else {
              message = 'Próxima: amanhã 19h';
            }
          } else {
            const daysUntilTuesday = dayOfWeek === 0 ? 2 : dayOfWeek === 1 ? 1 : dayOfWeek === 6 ? 3 : 0;
            message = daysUntilTuesday > 0 ? `Em ${daysUntilTuesday} dias` : 'Amanhã 19h';
          }
        } else if (schedule === 'monday') {
          if (dayOfWeek === 1) {
            if (hours < 19) {
              const hoursLeft = 18 - hours;
              const minsLeft = 60 - minutes;
              message = `Em ${hoursLeft}h ${minsLeft}min`;
            } else if (hours === 19 && minutes < 60) {
              message = 'AO VIVO (MEMBROS)';
              countdown.classList.add('is-live-members');
            } else {
              message = 'Próxima: segunda 19h';
            }
          } else {
            const daysUntilMonday = dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1;
            message = `Em ${daysUntilMonday} dias`;
          }
        }

        countdown.textContent = message;
      });
    };

    updateCountdowns();
    setInterval(updateCountdowns, 60000); // Update every minute
  };

  // ═══════════════════════════════════════════════════════════════
  // ACTIVE NAV (SCROLLSPY & PILL INDICATOR)
  // ═══════════════════════════════════════════════════════════════
  const initActiveNav = () => {
    const nav = document.querySelector('[data-nav]');
    const indicator = document.getElementById('nav-indicator');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (links.length === 0) return;

    const sections = links
      .map((link) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#') || href === '#') return null;
        return document.querySelector(href);
      })
      .filter((el) => el instanceof HTMLElement);

    if (sections.length === 0) return;

    const updateIndicator = (activeLink) => {
      if (!indicator || !activeLink) return;

      // We only want to animate if it's already visible, else just snap
      if (indicator.style.opacity === '0' || !indicator.style.opacity) {
        indicator.style.transition = 'none';
      } else {
        indicator.style.transition = 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      }

      // Small delay to allow transition change to apply
      requestAnimationFrame(() => {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();

        // Calculate relative position within the nav container
        const left = linkRect.left - navRect.left;

        indicator.style.width = `${linkRect.width}px`;
        indicator.style.transform = `translate(${left}px, -50%)`;
        indicator.style.opacity = '1';
      });
    };

    const setActive = (id) => {
      let foundActive = false;
      links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const targetId = href.startsWith('#') ? href.slice(1) : '';
        const isActive = targetId && targetId === id;

        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
          updateIndicator(link);
          foundActive = true;
        } else {
          link.removeAttribute('aria-current');
        }
      });

      if (!foundActive && indicator) {
        indicator.style.opacity = '0';
      }
    };

    // Prefer hash if present
    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      setActive(hashId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible.length === 0) return;
        const top = visible[0];
        if (top.target && top.target.id) setActive(top.target.id);
      },
      {
        threshold: [0.12, 0.25, 0.5, 0.75],
        rootMargin: '-35% 0px -55% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    window.addEventListener('hashchange', () => {
      const id = window.location.hash.slice(1);
      if (id) setActive(id);
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // BUTTON PARTICLE EFFECTS
  // ═══════════════════════════════════════════════════════════════
  const initButtonEffects = () => {
    const enhancedButtons = document.querySelectorAll('.btn-enhanced');

    enhancedButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        if (prefersReducedMotion) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.6);
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out forwards;
          pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation
    if (!document.getElementById('btn-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'btn-ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // MOBILE SWIPE GESTURES  (disabled)
  // ═══════════════════════════════════════════════════════════════
  // Previously intercepted vertical swipes (>100 px) and hijacked
  // native scroll to snap between sections via smoothScrollTo().
  // This was the primary cause of "block-based" / segmented
  // scrolling on mobile.  Native momentum scroll is now preserved.
  const initSwipeGestures = () => { /* intentionally empty */ };

  // ═══════════════════════════════════════════════════════════════
  // PAGE TRANSITION EFFECTS
  // ═══════════════════════════════════════════════════════════════
  const initPageTransitions = () => {
    // Kept intentionally minimal: avoid inline transforms
  };

  // ═══════════════════════════════════════════════════════════════
  // IMAGE LOADING EFFECTS
  // ═══════════════════════════════════════════════════════════════
  const initImageLoading = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach((img) => {
      if (img.complete) {
        img.style.opacity = '1';
        return;
      }

      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';

      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });

      img.addEventListener('error', () => {
        img.style.opacity = '0.3';
      });
    });
  };

  // Scroll drift: subtle life while scrolling (icons/cards)
  const initDrift = () => {
    if (prefersReducedMotion || isTouchDevice) return;

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

      const ampY = (6 + ry * 10) * depth; // ~6..16px
      const ampX = (2 + rx * 5) * depth;  // ~2..7px
      const rot = (seeded(i + 3) - 0.5) * 1.0 * depth; // ~-0.5..0.5deg
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
      const velBoost = v * 0.08; // subtle
      const t = (now || performance.now()) / 1000;

      // Camera sway for background (nebula + particles)
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - vh);
      const pos = clamp((lastY / maxScroll) * 2 - 1, -1, 1); // -1..1 through page
      const camVel = clamp(v, -120, 120);
      const baseY = -pos * 12;
      const baseX = Math.sin(pos * Math.PI) * 7;
      const velY = camVel * 0.12;
      const velX = camVel * -0.07;
      const timeX = Math.sin(t * 0.6) * 1.6;
      const timeY = Math.cos(t * 0.52) * 1.2;

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

  // ═══════════════════════════════════════════════════════════════
  // IMMERSIVE EFFECTS (Cursor, Glow, Tilt, Particles)
  // ═══════════════════════════════════════════════════════════════
  const initImmersiveEffects = () => {
    if (prefersReducedMotion || isTouchDevice) return;

    // 1. Custom Cursor & Glow
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const mouseGlow = document.querySelector('.mouse-glow');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
      if (mouseGlow) {
        mouseGlow.style.left = `${mouseX}px`;
        mouseGlow.style.top = `${mouseY}px`;
      }
    }, { passive: true });

    // Smooth cursor follow
    const updateCursor = () => {
      if (!cursor) return;
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(updateCursor);
    };
    if (cursor) requestAnimationFrame(updateCursor);

    // Hover states for cursor
    const interactiveEls = document.querySelectorAll('a, button, .interactive');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // 2. 3D Tilt Effect
    const tiltPanels = document.querySelectorAll('.panel, .info-card, .social-card');
    tiltPanels.forEach(panel => {
      panel.classList.add('tilt-panel');
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      panel.addEventListener('mouseleave', () => {
        panel.style.transform = '';
      });
    });

    // 3. Canvas Particles Starfield
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      const particleCount = Math.min(window.innerWidth / 10, 100);

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.size = Math.random() * 1.5 + 0.5;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(74, 155, 176, 0.6)';
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      const animateParticles = () => {
        if (!isDocumentVisible) {
          requestAnimationFrame(animateParticles);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.update();
          p.draw();

          // Draw lines to mouse if close
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(107, 79, 196, ${0.2 - dist / 600})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        requestAnimationFrame(animateParticles);
      };
      animateParticles();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveals();
      initDrift();
      initScrollProgress();
      initShootingStars();
      initCountdowns();
      initActiveNav();
      initButtonEffects();
      initSwipeGestures();
      initPageTransitions();
      initImageLoading();
      initImmersiveEffects();
    });
  } else {
    initReveals();
    initDrift();
    initScrollProgress();
    initShootingStars();
    initCountdowns();
    initActiveNav();
    initButtonEffects();
    initSwipeGestures();
    initPageTransitions();
    initImageLoading();
    initImmersiveEffects();
  }
})();

// ═══════════════════════════════════════════════════════════════
// END TRANSMISSION
// ═══════════════════════════════════════════════════════════════

