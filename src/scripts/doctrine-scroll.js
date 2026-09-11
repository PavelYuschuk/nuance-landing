/* =========================================================
   Кинематика движения логотипа вместе с Секцией Доктрина (TASK-057)
   ========================================================= */

export function initDoctrineLogoParallax() {
  const doctrineSection = document.getElementById('doctrine');
  const doctrineLogo = document.querySelector('.doctrine-bg-logo');

  if (!doctrineSection || !doctrineLogo) return;

  function updateDoctrineLogoPosition() {
    const rect = doctrineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Секция находится в зоне видимости экрана:
    if (rect.bottom > 0 && rect.top < windowHeight) {
      // Прогресс прохождения секции через вьюпорт от 0.0 до 1.0:
      const totalScrollRange = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollRange));

      // Плавный ход логотипа: синхронно со скроллом, с кинетическим параллаксом (+/- 45px):
      const parallaxOffset = (progress - 0.5) * 90;

      doctrineLogo.style.transform = `translate(-50%, calc(-50% + ${parallaxOffset.toFixed(1)}px))`;
    }
  }

  window.addEventListener('scroll', updateDoctrineLogoPosition, { passive: true });
  updateDoctrineLogoPosition();
}
