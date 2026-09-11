# TASK-052: Восстановление Растворения Текста Hero Без Движения и Плавный Уход Логотипа Вверх перед Секцией 3.4

**Status:** DONE  
**Target File(s):** `src/scripts/hero-parallax.js`, `src/scripts/about-scroll.js`, `src/styles/hero.css`, `src/styles/main.css`  
**Parent Specification:** TASK-051 (`docs/task/TASK-051-hero-background-pinning-and-text-cleanup.md`)

---

## 1. Контекст и Анализ Проблем
1. **Hero-блок (3.2): Растворение текста БЕЗ движения:**  
   Требуется вернуть анимацию растворения монолитного текста (`.hero-left-content` / `.hero-monolith-wrapper`) при скролле строго **без какого-либо смещения по вертикали (`transform: none`)**. Текст просто плавно тает (`opacity: 1.0 ➔ 0.0`) на своем месте. Ошибочный код в `about-scroll.js`, принудительно возвращавший `opacity: 1`, устраняется.
2. **Секция 3.3 Генезис: Плавный уход логотипа вверх:**  
   Устраняется баг резкого обрыва логотипа.  
   - **Глобальный градиент (`.global-bg-gradient`):** Как был, так и остается постоянным 1-м слоем для абсолютно всего сайта (`position: fixed; inset: 0; z-index: 0;`).
   - **Логотип (`.global-bg-logo`):** По завершении прокрутки всех слоев секции 3.3 («Генезис») логотип начинает **непрерывное и плавное физическое движение снизу вверх (1 в 1 со скоростью скролла страницы)**, бесшовно уплывая за верхний край экрана, открывая для секции 3.4 («Команда») чистый постоянный градиент.

---

## 2. Инженерная Спецификация (Implementation Spec)

### 2.1. Растворение Текста Hero БЕЗ Движения (`src/scripts/hero-parallax.js`)

В `src/scripts/hero-parallax.js` реализуется чистое оптическое растворение:

```javascript
/* ==========================================
   Hero Monolith Text: Чистое Растворение БЕЗ Движения
   ========================================== */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;

    // Растворение от 1.0 до 0.0 на дистанции первых 60% высоты Hero:
    const fadeDistance = heroHeight * 0.6;
    const opacity = Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)));

    heroContent.style.opacity = opacity.toFixed(3);
    heroContent.style.transform = 'none'; // СТРОГО БЕЗ СМЕЩЕНИЯ (НЕТ translateY)
  }

  window.addEventListener('scroll', updateHeroScrollFade, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroScrollFade);
  }

  updateHeroScrollFade();
}
```

---

### 2.2. Плавная Кинематика Ухода Логотипа Вверх (`src/scripts/about-scroll.js`)

В `src/scripts/about-scroll.js` полностью перерабатывается расчет выхода из секции 3.3.  
Устраняется блокировка CSS-анимации и резкий обрыв:

```javascript
/* ==========================================
   Синхронный уход логотипа вверх при выходе из Секции 3.3
   ========================================== */

export function initAboutStickyScroll() {
  const section = document.querySelector('.about-sticky-section');
  const layers = document.querySelectorAll('.about-layer');
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

  // Удалено вмешательство в heroContent.style.opacity, чтобы не ломать hero-parallax.js

  function updateStickyScroll() {
    handleLogoExitKinematics();
    // Логика переключения слоев 0, 1, 2 секции 3.3...
  }

  window.addEventListener('scroll', updateStickyScroll, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateStickyScroll);
  }

  updateStickyScroll();
}
```

---

### 2.3. Постоянство Градиента для Всего Сайта (`src/styles/main.css`)

Подтверждение нерушимости базового градиентного слоя:

```css
/* Постоянный базовый градиент сайта - Слой 1 (неизменен для всех секций) */
.global-bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 45%, #141C29 0%, #0F0F0F 85%);
  opacity: 0.95;
  z-index: 0;
  pointer-events: none;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Текст Hero при скролле плавно растворяется (`opacity: 1.0 ➔ 0.0`) строго на своем месте, без сдвига по вертикали (`transform: none`).
- [x] Модуль `about-scroll.js` больше не перебивает прозрачность текста Hero.
- [x] Базовый радиальный градиент `.global-bg-gradient` непрерывно активен как единый слой 1 для всех блоков сайта.
- [x] При переходе от 3.3 к 3.4 логотип больше не обрывается резко: он плавно и непрерывно уплывает вверх вместе со скроллом страницы.
- [x] В секции 3.4 «Команда» на экране остается только чистый градиент без артефактов.
