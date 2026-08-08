/* ==========================================
   Lenis Smooth Scrolling System
   ========================================== */

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth inertia easing
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Store instance globally for scroll event listeners
  window.lenisInstance = lenis;

  // Intercept anchor clicks for Lenis smooth navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement, {
          offset: -70,
          duration: 1.2,
        });
      }
    });
  });

  return lenis;
}
