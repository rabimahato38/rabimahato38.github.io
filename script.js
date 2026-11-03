(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const themeButton = document.querySelector('.theme-toggle');
  const topButton = document.querySelector('.back-top');
  if (!menuButton || !nav || !themeButton || !topButton) return;

  const setMenu = (open, returnFocus = false) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });

  const readTheme = () => {
    try { return window.localStorage.getItem('portfolio-theme'); }
    catch { return null; }
  };
  const saveTheme = value => {
    try { window.localStorage.setItem('portfolio-theme', value); }
    catch { /* Theme switching still works when storage is blocked. */ }
  };
  if (readTheme() === 'light') document.documentElement.classList.add('light');
  if (readTheme() === 'dark') document.documentElement.classList.remove('light');
  const updateThemeLabel = () => {
    themeButton.setAttribute('aria-label', document.documentElement.classList.contains('light') ? 'Switch to dark theme' : 'Switch to light theme');
  };
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    saveTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    updateThemeLabel();
  });

  const observed = document.querySelectorAll('.section, .stats, .credentials, .contact-section, .job, .skill-grid article');
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if ('IntersectionObserver' in window && !reducedMotion) {
    observed.forEach(item => item.classList.add('reveal'));
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        reveal.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    observed.forEach(item => reveal.observe(item));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const active = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }), { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(section => active.observe(section));
  }

  window.addEventListener('scroll', () => {
    topButton.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
})();
