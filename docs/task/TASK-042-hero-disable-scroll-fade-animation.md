# TASK-042: Отключение (Комментирование) Анимации Ухода Текста Hero при Скролле

**Status:** DONE  
**Target File(s):** `src/scripts/hero-parallax.js` (или `src/scripts/main.js`)  
**Parent Specification:** TASK-036, TASK-037

---

## 1. Контекст и Цель Модификации
Пользователь запросил найти и закомментировать (сохранив код в качестве бэкапа) логику анимации затухания и ухода текста при скролле в **Hero-блоке (3.2)**:
- Сейчас при скролле вниз функция `updateHeroParallax` вычисляет смещение `translateY = scrollY * 0.4` и затухание `opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.75)))`.
- Требуется **закомментировать** этот функционал в `src/scripts/hero-parallax.js`, чтобы текст оставался стабильным и не исчезал, сохранив исходный код для возможного восстановления.

---

## 2. Инженерная Спецификация (Implementation Spec)

### 2.1. Точный Файл и Строки Кода (`src/scripts/hero-parallax.js`)

В файле [`src/scripts/hero-parallax.js`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/hero-parallax.js) закомментировать тело функции `updateHeroParallax()` или вызов функции `initHeroParallax()`:

```javascript
/* ==========================================
   Hero Section Parallax Scroll Motion
   ========================================== */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content, .hero-monolith-block, .hero-monolith-wrapper');
  const heroSection = document.querySelector('.hero');

  if (!heroContent || !heroSection) return;

  function updateHeroParallax() {
    /* -----------------------------------------------------------------
       [BACKUP / ЗАКОММЕНТИРОВАНО ПО ЗАПРОСУ]:
       Анимация ухода и исчезновения текста при скролле

    const scrollY = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY <= heroHeight) {
      // Smooth vertical movement and subtle fade out on scroll down
      const translateY = scrollY * 0.4;
      const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.75)));

      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = opacity.toFixed(2);
    }
    ----------------------------------------------------------------- */
  }

  /* 
  window.addEventListener('scroll', updateHeroParallax, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroParallax);
  }

  updateHeroParallax();
  */
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ установлен строго в `Status: DONE`.
- [x] Логика затухания и смещения `heroContent.style.opacity` и `translateY` в `src/scripts/hero-parallax.js` закомментирована.
- [x] Исходный код сохранен в комментариях как резервная копия (бэкап).
- [x] При скролле страницы вниз текст Hero больше не исчезает и не затухает.
- [x] Функция выравнивания `initHeroMonolith()` продолжает работать без сбоев.
