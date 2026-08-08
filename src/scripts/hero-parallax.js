/* ==========================================
   Hero Section Parallax Scroll Motion
   ========================================== */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.querySelector('.hero');

  if (!heroContent || !heroSection) return;

  function updateHeroParallax() {
    const scrollY = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY <= heroHeight) {
      // Smooth vertical movement and subtle fade out on scroll down
      const translateY = scrollY * 0.4;
      const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.75)));

      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = opacity.toFixed(2);
    }
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroParallax);
  }

  updateHeroParallax();
}
