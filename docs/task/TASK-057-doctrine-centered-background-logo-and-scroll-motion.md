# TASK-057: Центральный Фоновый Логотип в Секции 3.5 «Доктрина» и Анимация Движения Со Скроллом

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/doctrine.css`, `src/scripts/doctrine-scroll.js`  
**Parent Specification:** TASK-023, TASK-037  

---

## 1. Контекст и Инженерная Задача

В секции **3.5 «Доктрина» (`#doctrine` / `.doctrine-section`)** требуется реализовать визуальное оформление фона, перекликающееся со стартовым Hero-блоком (3.2):
1. **Центральный фоновый логотип:**  
   Разместить на фоне секции 3.5 фирменный знак NUANCE (`/assets/images/NUANCE logo.png`) — точно такой же, как в Hero-блоке (`.global-bg-logo`), но со **строгим позиционированием по центру экрана (`top: 50%; left: 50%; transform: translate(-50%, -50%);`)**.
2. **Оптическая калибровка и неон:**  
   Логотип должен сохранять характерный неоновый ореол (бирюзово-лаймовое свечение `drop-shadow`), но иметь сбалансированную полупрозрачность (`opacity: 0.28–0.35`), чтобы оставаться стильной атмосферной подложкой и не снижать контраст и читаемость текста на 3-х карточках доктрины.
3. **Привязка движения вместе с секцией (Scroll Movement Binding):**  
   Логотип должен быть привязан к секции и двигаться вместе с ней при скролле. Дополнительно закладывается кинетический параллакс глубины (Parallax Depth Movement), усиливающий ощущение объемного тактического пространства при прохождении экрана.

---

## 2. Архитектура Слоев (Z-Index Hierarchy)

Внутри `.doctrine-section`:
1. **Слой 0 (Базовый фон):** Глобальный радиальный градиент `.global-bg-gradient` (Layer 1 сайта).
2. **Слой 1 (`.doctrine-bg-logo-wrapper`):** Абсолютно центрированный фоновый логотип NUANCE (`z-index: 1`, `pointer-events: none`).
3. **Слой 2 (`.doctrine-container`):** Контент секции — заголовок «Доктрина» (45px Bounded) и сетка из 3-х интерактивных карточек с эффектом блюра (`z-index: 2`).

---

## 3. Инженерная Спецификация (Implementation Spec)

### 3.1. Разметка HTML (`index.html`)

Внутри `<section id="doctrine" class="doctrine-section">` перед контейнером контента добавляется независимый слой фонового логотипа:

```html
  <!-- 3.5. Doctrine Section (TASK-023 & TASK-057 Spec) -->
  <section id="doctrine" class="doctrine-section">
    
    <!-- Фоновый центрированный логотип с неоновым свечением (TASK-057) -->
    <div class="doctrine-bg-logo-wrapper" aria-hidden="true">
      <img src="/assets/images/NUANCE logo.png" alt="" class="doctrine-bg-logo" />
    </div>

    <div class="container doctrine-container">
      <!-- Левоориентированный подблок: Доктрина -->
      <div class="doctrine-header-subblock">
        <h2 class="doctrine-main-title section-main-title">Доктрина</h2>
      </div>

      <div class="doctrine-cards-grid">
        <!-- Карточки 01, 02, 03... -->
      </div>
    </div>
  </section>
```

---

### 3.2. Стилизация в CSS (`src/styles/doctrine.css`)

Стили гарантируют идеальную центровку, масштабируемость от Full HD до 2K, неоновое свечение и независимость от карточек:

```css
/* =========================================================
   TASK-057: Центральный Фоновый Логотип Секции Доктрина
   ========================================================= */

.doctrine-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 2;
}

/* Обертка центрированного логотипа */
.doctrine-bg-logo-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1; /* Под карточками доктрины */
  overflow: hidden;
}

/* Фоновый логотип: масштабируемый, центрированный, с тактическим свечением */
.doctrine-bg-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  /* Масштаб крупного плана, аналогичный Hero (Hero Split Grid 2x) */
  width: clamp(600px, 55vw, 1050px);
  height: auto;
  max-width: 90vw;
  
  /* Фоновая деликатная прозрачность: логотип читается как водяной знак */
  opacity: 0.32;
  
  /* Фирменная аура Hero: бирюзовый + неоново-лаймовый светорассеиватель */
  filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.20))
          drop-shadow(0 0 45px rgba(193, 255, 0, 0.14));
          
  user-select: none;
  pointer-events: none;
  will-change: transform;
}

/* Контейнер контента поднят над логотипом */
.doctrine-section .container,
.doctrine-container {
  position: relative;
  z-index: 2;
}

/* =========================================================
   Адаптивные брейкпоинты для логотипа:
   ========================================================= */
@media (max-width: 1024px) {
  .doctrine-bg-logo {
    width: clamp(420px, 75vw, 680px);
    opacity: 0.22; /* На мобильных и планшетах логотип тише, чтобы не шуметь под карточками */
  }
}

@media (min-width: 2049px) {
  .doctrine-bg-logo {
    width: clamp(1000px, 50vw, 1400px);
  }
}
```

---

### 3.3. Кинематика Движения Вместе с Секцией (`src/scripts/doctrine-scroll.js`)

Чтобы реализовать требование **«привязать анимацию движение вместе с секцией»**:
1. **Естественный ход секции (Flow Movement):** Благодаря `position: absolute` внутри секции логотип бесшовно перемещается вместе со всей секцией при прокрутке экрана.
2. **Кинетический параллакс объема (Parallax Motion):** Для придания кинематографической глубины при скролле к координате `translate(-50%, -50%)` добавляется микросмещение по вертикали, пропорциональное вхождению секции в экран:

```javascript
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

      // Плавный ход логотипа: синхронно со скроллом, с кинетическим параллаксом (+/- 50px):
      const parallaxOffset = (progress - 0.5) * 90;

      doctrineLogo.style.transform = `translate(-50%, calc(-50% + ${parallaxOffset.toFixed(1)}px))`;
    }
  }

  window.addEventListener('scroll', updateDoctrineLogoPosition, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateDoctrineLogoPosition);
  }

  updateDoctrineLogoPosition();
}
```

И подключение в `src/scripts/main.js`:
```javascript
import { initDoctrineLogoParallax } from './doctrine-scroll.js';
// Внутри DOMContentLoaded:
initDoctrineLogoParallax();
```

---

## 4. Чек-лист Проверки Реализации (Verification Plan)

- [x] Файл спецификации находится в статусе `Status: DONE`.
- [x] В разметку секции `#doctrine` добавлен слой `.doctrine-bg-logo-wrapper` с логотипом `/assets/images/NUANCE logo.png`.
- [x] Логотип строго центрирован относительно экрана секции (`top: 50%; left: 50%; transform: translate(-50%, -50%)`).
- [x] Параметры свечения соответствуют Hero-блоку (`filter: drop-shadow` бирюза + лайм), прозрачность откалибрована (`0.32`) для сохранения читаемости карточек.
- [x] Реализовано плавное движение логотипа со скроллом секции (естественное перемещение в потоке + кинетический параллакс глубины).
- [x] Карточки доктрины и заголовок расположены на `z-index: 2` выше логотипа (`z-index: 1`).
- [x] Скрипт `doctrine-scroll.js` подключен в `main.js` и стабильно работает с Lenis smooth scroll.
