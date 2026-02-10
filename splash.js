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

  // Make UI available immediately to avoid delayed pop-in.
  // Fonts/video can continue loading in the background.
  markUiReady();

  // Video only when first frame is ready (or after timeout).
  if (!prefersReducedMotion) {
    Promise.race([
      waitForVideo(),
      sleep(2500),
    ]).finally(markVideoReady);

    // Warm up font loading without blocking UI.
    Promise.race([
      waitForFonts(),
      sleep(1800),
    ]).catch(() => {});
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

    // Navigate to main site after dissolve completes
    const delay = prefersReducedMotion ? 80 : 2450;
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
