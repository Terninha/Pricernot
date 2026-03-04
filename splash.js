// ═══════════════════════════════════════════════════════════════
// SPLASH — THRESHOLD PASSAGE
// Cinematic transition into the site
// ═══════════════════════════════════════════════════════════════

(() => {
  document.body.classList.add('is-booting');

  const passage = document.querySelector('.passage');
  const dissolve = document.querySelector('.dissolve');
  const video = document.querySelector('.void-video');
  const music = document.querySelector('.splash-audio');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForVideo = () => {
    if (!video) return Promise.resolve('no-video');
    if (video.readyState >= 2) return Promise.resolve('ready');

    return new Promise((resolve) => {
      const done = (tag) => {
        video.removeEventListener('loadeddata', onLoadedData);
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onError);
        resolve(tag);
      };

      const onLoadedData = () => done('loadeddata');
      const onCanPlay = () => done('canplay');
      const onError = () => done('error');

      video.addEventListener('loadeddata', onLoadedData, { once: true });
      video.addEventListener('canplay', onCanPlay, { once: true });
      video.addEventListener('error', onError, { once: true });
    });
  };

  const waitForFonts = () => {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve('no-fonts-api');
    return document.fonts.ready.then(
      () => 'fonts-ready',
      () => 'fonts-error'
    );
  };

  const markUiReady = () => {
    document.body.classList.remove('is-booting');
    document.body.classList.add('is-ready');
  };

  const markVideoReady = () => {
    document.body.classList.add('has-video');
  };

  const initMusic = () => {
    if (!(music instanceof HTMLMediaElement)) return;

    music.volume = 0.38;

    const tryPlay = () => {
      const p = music.play();
      if (p && typeof p.catch === 'function') p.catch(() => { });
    };

    // Autoplay with sound is often blocked; try anyway, then fall back to user gesture.
    tryPlay();

    const onFirstGesture = () => {
      tryPlay();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
  };

  const fadeOutMusic = (durationMs = 1100) => {
    if (!(music instanceof HTMLMediaElement)) return;
    const startVol = music.volume;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      music.volume = Math.max(0, startVol * (1 - t));
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        music.pause();
      }
    };

    requestAnimationFrame(step);
  };

  // Track whether the video element itself emits a fatal error
  // (fires only when ALL <source> alternatives are exhausted).
  let videoSourceFailed = false;
  if (video) {
    video.addEventListener('error', () => { videoSourceFailed = true; }, { once: true });
  }

  // Ensure video plays (browsers sometimes block autoplay).
  // muted + playsinline bypasses every modern browser's autoplay policy.
  if (video) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* blocked by browser policy — visual fallback is fine */ });
    }
  }

  initMusic();

  // Make UI available immediately to avoid delayed pop-in.
  // Fonts/video can continue loading in the background.
  markUiReady();

  // Video only when first frame is ready (or after timeout).
  // Do NOT show a black video element if both sources failed — keep it hidden.
  if (!prefersReducedMotion) {
    Promise.race([
      waitForVideo(),
      sleep(4000),
    ]).finally(() => {
      if (!videoSourceFailed) markVideoReady();
    });

    // Warm up font loading without blocking UI.
    Promise.race([
      waitForFonts(),
      sleep(1800),
    ]).catch(() => { });
  } else {
    markVideoReady();
  }

  const enter = () => {
    if (!passage || !dissolve) return;

    // Prevent double-click
    passage.disabled = true;
    passage.setAttribute('aria-disabled', 'true');
    passage.style.cursor = 'default';

    document.body.classList.add('is-leaving');
    fadeOutMusic(prefersReducedMotion ? 80 : 1300);

    // Trigger dissolve
    requestAnimationFrame(() => {
      dissolve.classList.add('active');
    });

    // Navigate to main site once dissolve (800ms) is fully black
    const delay = prefersReducedMotion ? 80 : 850;
    setTimeout(() => {
      window.location.href = './index.html?entered=1';
    }, delay);
  };

  if (passage) {
    passage.addEventListener('click', (e) => {
      // If the button is inside a <form>, prevent immediate navigation.
      // We'll navigate only after the dissolve transition.
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      enter();
    });

    // Allow Enter key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !passage.disabled) {
        enter();
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════════
// CHARACTER INTERACTIVITY — Time Control Connection
// ═══════════════════════════════════════════════════════════════

(() => {
  const character = document.querySelector('.time-controller');
  const thresholdText = document.querySelector('.threshold-text');
  const emphasisLine = document.querySelector('.threshold-line--emphasis');

  if (!character || !thresholdText) return;

  // Parallax effect on mouse move
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const animate = () => {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    if (window.innerWidth > 768) {
      character.style.transform = `translateX(${currentX * 16}px) translateY(${currentY * 8}px)`;
      thresholdText.style.transform = `translateX(${currentX * -15}px) translateY(${currentY * -8}px)`;
    }

    requestAnimationFrame(animate);
  };

  animate();

  // Hover sync - hover character makes text glow
  character.addEventListener('mouseenter', () => {
    if (emphasisLine) {
      emphasisLine.classList.add('glitch');
    }
  });

  character.addEventListener('mouseleave', () => {
    if (emphasisLine) {
      emphasisLine.classList.remove('glitch');
    }
  });

  // Hover text makes character glow stronger
  thresholdText.addEventListener('mouseenter', () => {
    character.style.filter = '';
  });

  thresholdText.addEventListener('mouseleave', () => {
    character.style.filter = '';
  });
})();

// ═══════════════════════════════════════════════════════════════
// END TRANSMISSION
// ═══════════════════════════════════════════════════════════════
