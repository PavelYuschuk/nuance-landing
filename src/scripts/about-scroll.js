/* ==========================================
   TASK-004 & TASK-052: Discrete Step Progress Scroll Engine & Synchronous Logo Exit
   ========================================== */

export function initAboutStickyScroll() {
  const section = document.querySelector('.about-sticky-section');
  const layers = document.querySelectorAll('.about-layer');
  const progressFill = document.querySelector('.about-progress-fill');
  const globalBgLogo = document.querySelector('.global-bg-logo');

  if (!section || layers.length === 0) return;

  // Снятие CSS-анимации после завершения стартового интро, чтобы JS свободно управлял transform:
  if (globalBgLogo) {
    globalBgLogo.addEventListener('animationend', () => {
      globalBgLogo.style.animation = 'none';
    }, { once: true });
  }

  function handleLogoExitKinematics() {
    if (!globalBgLogo) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 1024;

    // 1. Пока секция 3.3 активна или пользователь выше нее (rect.bottom >= windowHeight):
    // Логотип строго зафиксирован на штатной позиции
    if (rect.bottom >= windowHeight) {
      globalBgLogo.style.transform = isMobile ? 'translate(-50%, -50%)' : 'translateY(-50%)';
      globalBgLogo.style.opacity = isMobile ? '0.35' : '1';
      globalBgLogo.style.visibility = 'visible';
    } 
    // 2. Секция 3.3 завершила показ слоев и уходит вверх, уступая место Секции 3.4 (rect.bottom < windowHeight):
    // Логотип непрерывно и плавно сдвигается вверх ровно на ту же величину скролла:
    else {
      globalBgLogo.style.animation = 'none';
      const exitOffset = windowHeight - rect.bottom; // Дистанция ухода секции
      
      globalBgLogo.style.transform = isMobile
        ? `translate(-50%, calc(-50% - ${exitOffset}px))`
        : `translateY(calc(-50% - ${exitOffset}px))`;

      // Логотип скрывается только тогда, когда он физически полностью улетел за верхний край экрана
      if (exitOffset > windowHeight * 1.5) {
        globalBgLogo.style.visibility = 'hidden';
      } else {
        globalBgLogo.style.visibility = 'visible';
      }
    }
  }

  function updateStickyScroll() {
    handleLogoExitKinematics();

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    
    if (sectionHeight <= 0) return;

    // Calculate scroll progress from 0.0 to 1.0 inside 300vh sticky section
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / sectionHeight));

    // 3 layers:
    // Layer 0 (0% - 33.3%) ➔ 33.33% fill
    // Layer 1 (33.3% - 66.6%) ➔ 66.66% fill
    // Layer 2 (66.6% - 100%) ➔ 100% fill
    let activeIndex = 0;
    if (progress >= 0.666) {
      activeIndex = 2;
    } else if (progress >= 0.333) {
      activeIndex = 1;
    } else {
      activeIndex = 0;
    }

    // Step-based discrete progress bar fill percentage
    if (progressFill) {
      const fillPercent = ((activeIndex + 1) / layers.length) * 100;
      progressFill.style.width = `${fillPercent}%`;
    }

    layers.forEach((layer, idx) => {
      if (idx === activeIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateStickyScroll, { passive: true });
  window.addEventListener('resize', updateStickyScroll, { passive: true });

  updateStickyScroll();
}
