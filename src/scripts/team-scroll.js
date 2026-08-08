/* ==========================================
   Sticky Scroll Logic for Section 3.4 "Команда" (3 Players)
   ========================================== */

export function initTeamStickyScroll() {
  const section = document.querySelector('.team-sticky-section');
  const layers = document.querySelectorAll('.team-layer');
  const trackerSegments = document.querySelectorAll('.team-tracker-segment');

  if (!section || layers.length === 0) return;

  function updateTeamStickyScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    
    if (sectionHeight <= 0) return;

    // Calculate scroll progress from 0.0 to 1.0 inside 300vh sticky section
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / sectionHeight));

    // 3 player layers: 
    // Player 0 (Presa4ek) for 0 <= progress < 0.333
    // Player 1 (Art1zi) for 0.333 <= progress < 0.666
    // Player 2 (Matvi4) for 0.666 <= progress <= 1.0
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
  }

  window.addEventListener('scroll', updateTeamStickyScroll, { passive: true });
  window.addEventListener('resize', updateTeamStickyScroll, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateTeamStickyScroll);
  }

  updateTeamStickyScroll();
}
