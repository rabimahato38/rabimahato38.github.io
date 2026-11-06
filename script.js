/* Portfolio interactions. The page is fully readable without this file;
   everything here is progressive enhancement. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  const themeButton = $('.theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');
  const THEME_COLORS = { dark: '#101918', light: '#f4f6f1' };

  const syncThemeUi = () => {
    const light = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-pressed', String(light));
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[light ? 'light' : 'dark']);
  };
  syncThemeUi(); // initial value was already set by the inline script in <head>

  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch { /* storage unavailable: theme still changes for this visit */ }
    syncThemeUi();
  });

  /* ---------- Mobile navigation ---------- */
  const menuButton = $('.menu-toggle');
  const nav = $('#main-nav');
  const desktopQuery = window.matchMedia('(min-width: 1025px)');

  const setMenu = (open, { restoreFocus = false } = {}) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
    if (!open && restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, { restoreFocus: true });
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  desktopQuery.addEventListener('change', event => { if (event.matches) setMenu(false); });

  /* ---------- Active section in navigation ---------- */
  if ('IntersectionObserver' in window) {
    const navLinks = $$('a[href^="#"]', nav);
    const sections = $$('main section[id]');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => spy.observe(section));
  }

  /* ---------- Back-to-top button: visible once the hero has scrolled away ---------- */
  const topButton = $('.back-top');
  const hero = $('#home');
  if (topButton && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => topButton.classList.toggle('visible', !entry.isIntersecting))
      .observe(hero);
  }

  /* ---------- Scroll reveal ---------- */
  // Only elements that start below the fold are hidden, so nothing that is
  // already on screen can ever be left invisible.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    $$('.section-head, .about-content, .skill-grid > li, .working-knowledge, .project-card, .job, .credential-content, .education, .contact-inner')
      .filter(el => el.getBoundingClientRect().top > window.innerHeight)
      .forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
  }

  /* ---------- Scroll progress + header elevation ---------- */
  const topbar = $('.topbar');
  const progress = $('.scroll-progress');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1).toFixed(3) : 0);
    topbar.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Stats count-up (runs once when the strip is visible) ---------- */
  const counters = $$('.count[data-count]');
  if (!reducedMotion && counters.length && 'IntersectionObserver' in window) {
    const run = el => {
      const target = Number(el.dataset.count);
      const start = performance.now();
      const step = now => {
        const t = Math.min((now - start) / 900, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries, obs) => entries.forEach(e => {
      if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); }
    }), { threshold: 0.6 });
    counters.forEach(el => io.observe(el));
  }
})();
