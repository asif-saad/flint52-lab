/* shared.js — runs on every FLINT52 page */

(function () {
  'use strict';

  /* ── THEME TOGGLE ── */
  const html = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');

  const SUN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
             M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>`;

  const MOON_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;

  let currentTheme = html.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
      themeBtn.setAttribute('aria-label',
        'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    }
  }

  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── BUILD/INJECT NAV + FOOTER (for pages that call buildNav/buildFooter) ── */
  function _wireNavHandlers(container) {
    const hamburger = container.querySelector('.nav__hamburger');
    const mobileNav = container.querySelector('.nav__mobile');
    const themeBtnLocal = container.querySelector('[data-theme-toggle]');
    const headerLocal = container.querySelector('.site-header');

    if (themeBtnLocal) {
      themeBtnLocal.innerHTML = currentTheme === 'dark' ? SUN_ICON : MOON_ICON;
      themeBtnLocal.addEventListener('click', function () {
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    }

    if (headerLocal) {
      const onScroll = function () { headerLocal.classList.toggle('is-scrolled', window.scrollY > 10); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('menu-open');
        } else {
          hamburger.setAttribute('aria-expanded', 'true');
          mobileNav.classList.add('is-open');
          document.body.classList.add('menu-open');
        }
      });

      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('menu-open');
        });
      });
    }
  }

  window.buildNav = function (activeFile) {
    const header = document.querySelector('header');
    if (!header) return;

    // If header already populated, skip injection but still wire handlers
    if (!header.innerHTML.trim()) {
      header.innerHTML = `
      <header class="site-header">
        <div class="container">
          <nav class="nav" aria-label="Main navigation">
            <a href="index.html" class="nav__logo" aria-label="FLINT52 home">
              <img src="asset/logo/light.png" class="logo-for-light" alt="FLINT52" width="140" height="40" loading="eager" />
              <img src="asset/logo/dark.png" class="logo-for-dark" alt="FLINT52" width="140" height="40" loading="eager" />
            </a>
            <ul class="nav__links" role="list">
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="research.html">Research</a></li>
              <li><a href="projects.html">Projects</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="publications.html">Publications</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
            <div class="nav__actions">
              <button class="btn-theme" data-theme-toggle aria-label="Switch theme"></button>
              <button class="nav__hamburger" aria-label="Open menu" aria-expanded="false">
                <span></span><span></span><span></span>
              </button>
            </div>
          </nav>
        </div>
        <div class="nav__mobile" role="dialog" aria-label="Navigation">
          <ul role="list">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="research.html">Research</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="team.html">Team</a></li>
            <li><a href="publications.html">Publications</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
      </header>`;
    }

    // Wire up handlers for newly inserted nav
    _wireNavHandlers(document);

    // Mark active link
    const current = activeFile || window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (link) {
      const linkFile = link.getAttribute('href');
      if (linkFile === current || (current === '' && linkFile === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  window.buildFooter = function () {
    const footer = document.querySelector('footer');
    if (!footer) return;
    if (!footer.innerHTML.trim()) {
      footer.innerHTML = `
        <div class="footer">
          <div class="container footer__grid">
            <div class="footer__brand">
              <div class="nav__logo">
                <img src="asset/logo/light.png" class="logo-for-light" alt="FLINT52" width="140" height="40" loading="eager" />
                <img src="asset/logo/dark.png" class="logo-for-dark" alt="FLINT52" width="140" height="40" loading="eager" />
              </div>
              <div class="footer__meta">© <span data-year></span> FLINT52</div>
            </div>
            <div class="footer__links">
              <a href="about.html">About</a>
              <a href="research.html">Research</a>
              <a href="publications.html">Publications</a>
            </div>
            <div class="footer__links">
              <a href="contact.html">Contact</a>
              <a href="privacy.html">Privacy</a>
            </div>
          </div>
        </div>`;
    }

    // populate year
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  /* ── NAV SHADOW ON SCROLL ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE HAMBURGER NAV ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  function openMenu() {
    if (!hamburger || !mobileNav) return;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!hamburger || !mobileNav) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('is-open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (link) {
    const linkFile = link.getAttribute('href');
    if (linkFile === currentFile ||
       (currentFile === '' && linkFile === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── STAT COUNTERS ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 1400;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── CONTACT FORM (Formspree) ── */
  const form = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form__status');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form__status';
      }

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.textContent = '✓ Message sent! We'll get back to you soon.';
            formStatus.classList.add('is-success');
          }
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (formStatus) {
          formStatus.textContent = '✗ Something went wrong. Please try again or email us directly.';
          formStatus.classList.add('is-error');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  /* ── YEAR IN FOOTER ── */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();