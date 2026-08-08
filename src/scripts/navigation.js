/* ==========================================
   Global Navigation & Language Switcher Logic
   ========================================== */

export function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const langBtns = document.querySelectorAll('.lang-btn');

  // Mobile menu toggle
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      headerNav.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        headerNav.classList.remove('open');
      });
    });
  }

  // Language switcher state
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      langBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const lang = target.getAttribute('data-lang');
      console.log(`Language switched to: ${lang}`);
      // Dispatch custom language change event
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
    });
  });

  // Smooth active highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.header-nav a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}
