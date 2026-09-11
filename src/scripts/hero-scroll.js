/* =======================================
   TASK-031: Hero Scroll-Driven Scrubbing Animation
   ====================================== */

export function initHeroScrollAnimation() {
  const heroSection = document.getElementById('hero');
  const heroLogo = document.querySelector('.hero-animated-logo');
  const heroTextWrapper = document.querySelector('.hero-text-mask-wrapper');
  const globalBgLogo = document.querySelector('.global-bg-logo');

  if (!heroSection || !heroLogo || !heroTextWrapper) return;

  function onScroll() {
    const rect = heroSection.getBoundingClientRect();
    const totalDist = heroSection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    // Progress normalized from 0.0 to 1.0 inside 250vh Hero scroll
    const progress = totalDist > 0 ? Math.min(Math.max(scrolled / totalDist, 0), 1) : 0;
    const isMobile = window.innerWidth <= 768;

    // 1. Logo movement: center (50%) -> right (70%)
    if (isMobile) {
      heroLogo.style.left = '50%';
      const scale = 1 - progress * 0.15;
      const translateY = -50 - (progress * 15);
      heroLogo.style.transform = `translate(-50%, ${translateY}%) scale(${scale})`;
      heroLogo.style.opacity = (0.25 + (1 - progress) * 0.5).toFixed(3);
    } else {
      const logoX = 50 + (progress * 20); // 50% -> 70%
      heroLogo.style.left = `${logoX}%`;
      heroLogo.style.transform = 'translate(-50%, -50%)';
      heroLogo.style.opacity = '1';
    }

    // 2. Text unmasking from left edge of logo
    const clipRight = (1 - progress) * 100;
    heroTextWrapper.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
    heroTextWrapper.style.opacity = progress > 0.02 ? Math.min(progress * 2.0, 1).toFixed(3) : '0';

    if (!isMobile) {
      const shiftX = (1 - progress) * 60;
      heroTextWrapper.style.transform = `translateY(-50%) translateX(${shiftX}px)`;
    } else {
      heroTextWrapper.style.transform = 'translateY(-50%)';
    }

    // 3. Dynamic gradient blur and global logo transition on exit (progress >= 0.85)
    if (globalBgLogo) {
      if (progress > 0.85) {
        const exitProgress = (progress - 0.85) / 0.15; // 0.0 -> 1.0
        globalBgLogo.style.opacity = (exitProgress * 0.22).toFixed(3);
        globalBgLogo.style.filter = `blur(${exitProgress * 9}px) drop-shadow(0 0 25px rgba(0, 229, 255, 0.15))`;
      } else {
        globalBgLogo.style.opacity = '0';
        globalBgLogo.style.filter = 'blur(0px) drop-shadow(0 0 25px rgba(0, 229, 255, 0.15))';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial update
  onScroll();
}
