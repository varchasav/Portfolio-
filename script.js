//   Prevent theme FOUC: set theme class before paint 
 (function () {
      const t = (localStorage && localStorage.getItem('theme')) || 'purple';
      const root = document.documentElement;
      root.classList.add(`${t}-theme`);
    })();

    // Theme modal handlers
    const modal = document.getElementById('themeModal');
    const modalCard = modal.querySelector('div');
    const themeToggleBtn = document.getElementById('themeToggle');

    function showThemeModal() {
      modal.classList.remove('invisible', 'opacity-0');
      modalCard.classList.remove('scale-95');
    }
    function hideThemeModal() {
      modal.classList.add('opacity-0', 'invisible');
      modalCard.classList.add('scale-95');
    }
    themeToggleBtn.addEventListener('click', showThemeModal);
    document.getElementById('closeThemeModal').addEventListener('click', hideThemeModal);

    function applyTheme(theme) {
      const root = document.documentElement;
      root.classList.remove('purple-theme', 'black-theme', 'white-theme');
      root.classList.add(`${theme}-theme`);
      localStorage.setItem('theme', theme);
    }

    // Theme selection buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        applyTheme(theme);
        hideThemeModal();
      });
    });

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('invisible', 'opacity-0');
      } else {
        backToTopButton.classList.add('opacity-0', 'invisible');
      }
    });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.style.opacity = '1';
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .slide-in-left, .scale-up').forEach(el => observer.observe(el));

    // Current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Smooth scrolling for on‑page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return; // external or placeholder
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      });
    });
    //audio
(function(){
      const audio = document.getElementById('bg-audio');
      const btn = document.getElementById('audioBtn');
      const iconMuted = document.getElementById('icon-muted');
      const iconUnmuted = document.getElementById('icon-unmuted');
      const label = document.getElementById('audioLabel');

      // Restore previous user preference (if any)
      const savedMuted = localStorage.getItem('bg-audio-muted');
      const startMuted = savedMuted === null ? false : savedMuted === 'true';

      // Some browsers block autoplay with sound until a user gesture.
      // Strategy: try to start unmuted. If blocked, fall back to muted and cue the button.
      function updateUI(){
        const muted = audio.muted;
        btn.setAttribute('aria-pressed', String(!muted));
        iconMuted.style.display = muted ? 'inline' : 'none';
        iconUnmuted.style.display = muted ? 'none' : 'inline';
        label.textContent = muted ? 'Sound Off' : 'Sound On';
      }

      function persist(){
        localStorage.setItem('bg-audio-muted', String(audio.muted));
      }

      async function primePlayback(){
        try {
          audio.muted = startMuted; // try honor saved state first
          await audio.play();
          updateUI();
        } catch (err) {
          // Autoplay with sound likely blocked. Start muted, prompt the user.
          audio.muted = true;
          try { await audio.play(); } catch(_) {}
          btn.classList.add('pulse');
          updateUI();
        }
      }

      // Ensure we keep playing when tab regains visibility
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden && audio.paused) {
          try { await audio.play(); } catch(_) {}
        }
      });

      // First user gesture can safely unmute if previously blocked
      const unlock = async () => {
        if (audio.muted === true && (savedMuted === null || savedMuted === 'false')) {
          audio.muted = false;
          try { await audio.play(); } catch(_) {}
          updateUI();
          persist();
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });

      // Toggle via button
      btn.addEventListener('click', async () => {
        audio.muted = !audio.muted;
        try { if (audio.paused) await audio.play(); } catch(_) {}
        btn.classList.remove('pulse');
        updateUI();
        persist();
      });

      // Optional: set a comfortable default volume
      audio.volume = 0.5; // 0.0 – 1.0

      // Kick things off
      primePlayback();
    })();


