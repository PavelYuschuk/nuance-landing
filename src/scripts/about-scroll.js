/* ==========================================
   Sticky Scroll & Layer Switching Logic for Section "О нас"
   ========================================== */

export function initAboutStickyScroll() {
  const section = document.querySelector('.about-sticky-section');
  const layers = document.querySelectorAll('.about-layer');
  const trackerSegments = document.querySelectorAll('.tracker-segment');

  if (!section || layers.length === 0) return;

  function updateStickyScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    
    if (sectionHeight <= 0) return;

    // Calculate scroll progress from 0.0 to 1.0 inside the sticky section across all devices
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / sectionHeight));

    // 2 layers: Layer 0 (История) for 0 <= progress < 0.5, Layer 1 (Механика) for 0.5 <= progress <= 1
    const activeIndex = progress < 0.5 ? 0 : 1;

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
  }

  window.addEventListener('scroll', updateStickyScroll, { passive: true });
  window.addEventListener('resize', updateStickyScroll, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateStickyScroll);
  }

  updateStickyScroll();
}
