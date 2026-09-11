# TASK-055: Полное Удаление Стартовой Анимации Текста Hero и Фиксация Текста при Растворении на Скролле

**Status:** DONE  
**Target File(s):** `src/styles/hero.css`, `src/scripts/hero-parallax.js`  
**Parent Specification:** TASK-052, TASK-053  

---

## 1. Контекст и Анализ Проблемы

В секции **3.2 Hero-блок (Точка входа)** для монолитного текста левой колонки (`.hero-left-content` / `.hero-monolith-wrapper`):
1. **Проблема движения при скролле:** Из-за стандартного потока документа при прокрутке страницы вниз блок Hero уходил вверх со скоростью скролла, создавая физическое движение текста на экране пользователя.
2. **Проблема стартовой анимации:** В CSS оставалась анимация проявления `@keyframes heroPureFadeIn`, запускавшаяся при загрузке страницы.
3. **Требование пользователя:**
   - **Удалить любую анимацию движения:** Текст не должен двигаться при скролле (0px физического перемещения на экране монитора).
   - **Оставить только растворение:** По мере скролла текст остается абсолютно статичным на экране и плавно тает по прозрачности (`opacity: 1.0 ➔ 0.0`).
   - При первой загрузке текст статичен и виден сразу на 100% без каких-либо стартовых анимаций.

---

## 2. Реализованные Инженерные Изменения

### 2.1. Очистка CSS (`src/styles/hero.css`)
- Полностью удалены `@keyframes heroPureFadeIn` и свойство `animation`.
- Установлена полная статика по умолчанию (`opacity: 1; animation: none !important; transform: none;`).

```css
/* ==========================================
   Левая колонка Hero: АБСОЛЮТНО СТАТИЧНЫЙ ТЕКСТ (TASK-055)
   ========================================== */

.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
  
  /* Полная статика: никакого движения и никаких стартовых анимаций */
  opacity: 1;
  transform: none;
  animation: none !important;
  will-change: transform, opacity;
}

.hero-monolith-wrapper {
  width: 100%;
  max-width: 680px;
  position: relative;
  z-index: 2;
  transform: none !important;
  animation: none !important;
}
```

---

### 2.2. Компенсация Скролла в JS для Полной Неподвижности (`src/scripts/hero-parallax.js`)

Для того чтобы текст оставался **абсолютно неподвижным на экране монитора пользователя** во время скролла страницы, в `updateHeroScrollFade` добавлена точная компенсация вертикального смещения:
`heroContent.style.transform = scrollY > 0 ? \`translateY(\${scrollY}px)\` : 'none';`

- По мере скролла страницы вверх на `scrollY` пикселей, элемент смещается вниз ровно на те же `scrollY` пикселей относительно своего родителя.
- В координатах монитора (`getBoundingClientRect().top`) текст замирает на месте: **0 пикселей движения**.
- Одновременно с этим `opacity` плавно спадает от `1.0` до `0.0` на первых 55% высоты Hero.

```javascript
/* ==========================================
   Hero Monolith: Оптическое Растворение БЕЗ Движения (TASK-055)
   ========================================== */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;

    // Растворение от 1.0 до 0.0 на первых 55% высоты Hero:
    const fadeDistance = heroHeight * 0.55;
    const opacity = Math.max(0, Math.min(1, 1 - (scrollY / fadeDistance)));

    heroContent.style.opacity = opacity.toFixed(3);
    
    // КОМПЕНСАЦИЯ СКРОЛЛА: текст остается АБСОЛЮТНО НЕПОДВИЖНЫМ на экране монитора
    // (0px движения относительно вьюпорта), пока плавно растворяется:
    heroContent.style.transform = scrollY > 0 ? `translateY(${scrollY}px)` : 'none';
  }

  window.addEventListener('scroll', updateHeroScrollFade, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroScrollFade);
  }

  updateHeroScrollFade();
}
```

---

## 3. Чек-лист Проверки Реализации (Verification)

- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] В `src/styles/hero.css` полностью удалены `@keyframes heroPureFadeIn` и свойство `animation`.
- [x] При первой загрузке или обновлении страницы текст Hero отображается сразу на 100% (`opacity: 1`) без задержек и стартовых анимаций.
- [x] При скролле вниз текст Hero остается абсолютно неподвижным на экране монитора (компенсация `translateY(scrollY)`), плавно растворяясь в прозрачность (`opacity: 1 ➔ 0`).
- [x] При скролле наверх текст восстанавливает непрозрачность до 1.0 без скачков.
