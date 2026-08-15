/* ==========================================
   Full-Viewport Snap & HUD Ring Indicator (Scroll Spy) for 3.4 "Команда"
   ========================================== */

export function initTeamStickyScroll() {
  const section = document.querySelector('.team-snap-section');
  const screens = document.querySelectorAll('.team-snap-screen');
  const hudRing = document.querySelector('.team-hud-ring');
  const hudSegments = document.querySelectorAll('.hud-segment');

  if (!section || screens.length === 0) return;

  function updateTeamScrollSpy() {
    const sectionRect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Show fixed HUD ring ONLY when user is inside Section 3.4 Team
    if (sectionRect.top <= windowHeight * 0.5 && sectionRect.bottom >= windowHeight * 0.3) {
      if (hudRing) hudRing.classList.add('visible');
    } else {
      if (hudRing) hudRing.classList.remove('visible');
    }

    // Determine active screen using Intersection / center scroll position
    let activeIndex = 0;
    screens.forEach((screen, idx) => {
      const rect = screen.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
        activeIndex = idx;
      }
    });

    // Update active state on HUD SVG ring segments
    hudSegments.forEach((segment) => {
      const playerAttr = parseInt(segment.getAttribute('data-player'), 10);
      if (playerAttr === activeIndex) {
        segment.classList.add('active');
      } else {
        segment.classList.remove('active');
      }
    });
  }

  // Click on HUD ring segment scrolls to the chosen player screen
  hudSegments.forEach((segment) => {
    segment.addEventListener('click', (e) => {
      e.stopPropagation();
      const playerAttr = parseInt(segment.getAttribute('data-player'), 10);
      if (screens[playerAttr]) {
        screens[playerAttr].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', updateTeamScrollSpy, { passive: true });
  window.addEventListener('resize', updateTeamScrollSpy, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateTeamScrollSpy);
  }

  updateTeamScrollSpy();
}
