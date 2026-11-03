(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const themeButton = document.querySelector('.theme-toggle');
  const topButton = document.querySelector('.back-top');

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') document.body.classList.add('light');
  const updateThemeLabel = () => themeButton.setAttribute('aria-label', document.body.classList.contains('light') ? 'Switch to dark theme' : 'Switch to light theme');
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    updateThemeLabel();
  });

  const observed = document.querySelectorAll('.section, .stats, .credentials, .contact-section, .job, .skill-grid article');
  observed.forEach(item => item.classList.add('reveal'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); }
    }), { threshold: 0.12 });
    observed.forEach(item => reveal.observe(item));
  } else observed.forEach(item => item.classList.add('in-view'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const active = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }), { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(section => active.observe(section));
  }
  window.addEventListener('scroll', () => topButton.classList.toggle('visible', window.scrollY > 500), { passive: true });
})();
