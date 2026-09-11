# TASK-053: Полное Исключение Движения Текста Hero (Чистое Растворение при Скролле)

**Status:** DONE  
**Target File(s):** `src/styles/hero.css`, `src/scripts/hero-parallax.js`  
**Parent Specification:** TASK-052 (`docs/task/TASK-052-hero-fade-fix-and-logo-smooth-exit.md`)

---

## 1. Контекст и Проблема
В стилях Hero оставалась анимация `@keyframes heroRevealLeft`, которая при загрузке и скролле выполняла горизонтальное смещение текста (`translateX(-50px) ➔ translateX(0)`), а свойство `forwards` блокировало управление позицией.

Пользователь требует:
1. **Полное отсутствие движения (НЕТ сдвига):** Убрать любые горизонтальные (`translateX`) и вертикальные (`translateY`) смещения как при загрузке страницы, так и при скролле. Текст монолита стоит мертво на одном месте.
2. **Только чистое оптическое растворение при скролле:** По мере прокрутки вниз текст Hero только плавно тает по прозрачности (`opacity: 1.0 ➔ 0.0`), оставаясь физически неподвижным.

---

## 2. Инженерная Спецификация (Implementation Spec)

### 2.1. Очистка CSS от Любого Движения (`src/styles/hero.css`)

В файле [`src/styles/hero.css`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/hero.css) полностью удаляется анимация со сдвигом `heroRevealLeft` и заменяется на чистое проявление по прозрачности (Fade In):

```css
/* ==========================================
   Левая колонка Hero: СТРОГО БЕЗ ДВИЖЕНИЯ
   ========================================== */

.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
  
  /* Исключено любое смещение: transform строго статичен */
  transform: none !important;
  will-change: opacity;
  
  /* Чистое проявление ТОЛЬКО по прозрачности без движения */
  animation: heroPureFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Анимация проявления ТОЛЬКО по opacity (без translateX / translateY) */
@keyframes heroPureFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

---

### 2.2. Чистое Растворение при Скролле (`src/scripts/hero-parallax.js`)

В функции `updateHeroScrollFade()` изменяется исключительно `opacity`, а `transform` жестко зафиксирован в `'none'`:

```javascript
/* ==========================================
   Hero Monolith: Оптическое Растворение БЕЗ Движения
   ========================================== */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;

    // Снятие CSS-анимации после первого скролла для управления через JS:
    if (scrollY > 0) {
      heroContent.style.animation = 'none';
    }

    // Растворение от 1.0 до 0.0 на первых 55% высоты Hero:
    const fadeDistance = heroHeight * 0.55;
    const opacity = Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)));

    heroContent.style.opacity = opacity.toFixed(3);
    
    // СТРОГО БЕЗ ДВИЖЕНИЯ:
    heroContent.style.transform = 'none';
  }

  window.addEventListener('scroll', updateHeroScrollFade, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroScrollFade);
  }

  updateHeroScrollFade();
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Полностью удалена анимация `heroRevealLeft` со смещением `translateX(-50px)`.
- [x] При первой загрузке страницы текст не двигается, а только мягко проявляется на месте (`heroPureFadeIn`).
- [x] При скролле вниз текст монолита не сдвигается ни по горизонтали, ни по вертикали (`transform: none`).
- [x] Прозрачность текста плавно уходит в 0 при скролле вниз (чистое растворение).
