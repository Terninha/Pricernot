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
      if (p && typeof p.catch === 'function') p.catch(() => {});
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

  // Ensure video plays (browsers sometimes block autoplay)
  if (video) {
    video.play().catch(() => {
      // Silent fail: video blocked, static fallback already looks good
    });
  }

  initMusic();

  // Boot sequencing: UI first (fast), video only when first frame is ready
  if (!prefersReducedMotion) {
    Promise.race([
      Promise.allSettled([waitForFonts(), sleep(140)]),
      sleep(650),
    ]).finally(markUiReady);

    Promise.race([
      waitForVideo(),
      sleep(2500),
    ]).finally(markVideoReady);
  } else {
    markUiReady();
    markVideoReady();
  }

  // Occasional glitch effect on emphasis text (mysterious)
  const ENABLE_GLITCH = false;
  const emphasisLine = document.querySelector('.threshold-line--emphasis');
  if (ENABLE_GLITCH && emphasisLine && !prefersReducedMotion) {
    const triggerGlitch = () => {
      emphasisLine.classList.add('glitch');
      setTimeout(() => emphasisLine.classList.remove('glitch'), 100);
      setTimeout(triggerGlitch, 7000 + Math.random() * 4000); // 7-11s
    };
    setTimeout(triggerGlitch, 6000); // First glitch after 6s
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

    // Navigate to main site after dissolve completes
    const delay = prefersReducedMotion ? 80 : 2450;
    setTimeout(() => {
      window.location.href = './index.html?entered=1';
    }, delay);
  };

  if (passage) {
    passage.addEventListener('click', enter);

    // Allow Enter key as well
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !passage.disabled) {
        enter();
      }
    });
  }

  // Optional: Auto-skip after extended time (uncomment if desired)
  // setTimeout(() => {
  //   if (!passage.disabled) enter();
  // }, 15000);
})();

// ═══════════════════════════════════════════════════════════════
// END TRANSMISSION
// ═══════════════════════════════════════════════════════════════
