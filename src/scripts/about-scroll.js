/* ==========================================
   Sticky Scroll & Exit Motion Logic for Section "О нас" (3 Layers)
   ========================================== */

export function initAboutStickyScroll() {
  const section = document.querySelector('.about-sticky-section');
  const viewport = document.querySelector('.about-sticky-viewport');
  const container = document.querySelector('.about-container');
  const layers = document.querySelectorAll('.about-layer');
  const trackerSegments = document.querySelectorAll('.tracker-segment');

  if (!section || !viewport || layers.length === 0) return;

  function updateStickyScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    
    if (sectionHeight <= 0) return;

    // Calculate scroll progress from 0.0 to 1.0 inside 300vh sticky section
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / sectionHeight));

    // 3 layers: 
    // Layer 0 (3.3.0 Кто мы) for 0 <= progress < 0.333
    // Layer 1 (3.3.1 История) for 0.333 <= progress < 0.666
    // Layer 2 (3.3.2 Механизм) for 0.666 <= progress <= 1.0
    let activeIndex = 0;
    if (progress >= 0.666) {
      activeIndex = 2;
    } else if (progress >= 0.333) {
      activeIndex = 1;
    } else {
      activeIndex = 0;
    }

    layers.forEach((layer, idx) => {
      if (idx === activeIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    trackerSegments.forEach((segment, idx) => {
      if (idx === activeIndex) {
        segment.classList.add('active');
      } else {
        segment.classList.remove('active');
      }
    });

    // Exit Parallax & Fade-out motion when exiting Section 3.3 (identical to Hero section exit)
    if (progress >= 0.85) {
      const exitProgress = (progress - 0.85) / 0.15; // 0.0 to 1.0
      const translateY = -exitProgress * 60; // Upward exit motion
      const opacity = Math.max(0, 1 - exitProgress * 1.25);

      if (container) {
        container.style.transform = `translateY(${translateY}px)`;
        container.style.opacity = opacity.toFixed(2);
      }
    } else {
      if (container) {
        container.style.transform = 'translateY(0px)';
        container.style.opacity = '1';
      }
    }
  }

  window.addEventListener('scroll', updateStickyScroll, { passive: true });
  window.addEventListener('resize', updateStickyScroll, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateStickyScroll);
  }

  updateStickyScroll();
}
