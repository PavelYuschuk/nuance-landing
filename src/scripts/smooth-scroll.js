/* ==========================================================================
   TASK-079: SmoothScroll.js Engine (Reference: yarsy.com)
   ========================================================================== */

import SmoothScroll from 'smoothscroll-for-websites';

/**
 * Инициализация физического скролла колесика мыши и плавной навигации по якорям
 */
export function initSmoothScroll() {
  // 1. Инициализация движка SmoothScroll с точной калибровкой yarsy.com
  SmoothScroll({
    animationTime     : 1000, // [ms] Длительность плавного торможения
    stepSize          : 100,  // [px] Шаг одного клика колесика
    accelerationDelta : 50,   // [ms] Порог быстрого вращения
    accelerationMax   : 3,    // Максимальное ускорение
    touchpadSupport   : false // Сохранение нативного 1:1 скролла на тачпадах
  });

  // 2. Плавная якорная навигация по клику на ссылки (#genesis, #team, #doctrine, #cta)
  const headerOffset = 70; // Отступ под фиксированный хедер

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  console.log('SmoothScroll.js (v1.4.10) engine initialized with yarsy.com calibration.');
}

