/* ==========================================
   Global Navigation & Language Switcher Logic
   ========================================== */

export function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  // Dropdown language switcher (TASK-065)
  const langSwitcher = document.getElementById('langSwitcher');
  const langTrigger = document.getElementById('langTrigger');
  const langDropdown = document.getElementById('langDropdown');
  const dropdownItems = document.querySelectorAll('.lang-dropdown-item');

  // Toggle dropdown on trigger click
  if (langTrigger && langSwitcher) {
    langTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSwitcher.classList.toggle('is-open');
      langTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Handle language selection in dropdown
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = item.getAttribute('data-lang');

        // Close dropdown
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');

        // Dispatch languageChange event
        window.dispatchEvent(new CustomEvent('languageChange', {
          detail: { lang: selectedLang }
        }));
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) {
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langSwitcher.classList.contains('is-open')) {
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
        langTrigger.focus();
      }
    });
  }

  const scrollTopBtn = document.querySelector('.btn-scroll-top');

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

  // Scroll to top button in footer (TASK-022, TASK-079)
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
