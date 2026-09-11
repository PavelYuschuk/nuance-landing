# TASK-059: Плавная Кинематика Затухания Текста Hero до 90% Перекрытия Секцией 3.3 («О нас»)

**Status:** DONE  
**Target File(s):** `src/scripts/hero-parallax.js`, `src/styles/hero.css`, `src/styles/genesis.css`  
**Parent Specification:** TASK-055, TASK-058  

---

## 1. Контекст и Постановка Задачи

Пользователь протестировал и утвердил задержку на 3 тика скролла, но дал уточнение по динамике растворения:
1. **Сохранение стартовой задержки:** Задержка срабатывания на первые 3 тика скролла (`SCROLL_DELAY_PX = 210px`) признана удачной и полностью сохраняется.
2. **Максимально плавное затухание (Smoothstep Easing):** Затухание должно происходить не резко, а плавно, органично и кинематографично на длинной дистанции скролла.
3. **Точка полного исчезновения (90% покрытия экрана Секцией 3.3):** Монолитный текст должен полностью исчезнуть (`opacity = 0`, `visibility = 'hidden'`) ровно в тот момент, когда наступающая снизу секция **3.3 Sticky Scroll Section («О нас»)** закрывает **90% высоты вьюпорта** (`scrollY = 0.90 * window.innerHeight`).

---

## 2. Кинематический и Математический Расчет

### 2.1. Определение Границ Скролла
- **Высота экрана:** `windowHeight = window.innerHeight`.
- **Старт затухания:** `FADE_START = 210px` (3 тика колеса мыши).
- **Финиш затухания:** `FADE_END = 0.90 * windowHeight` (например, 972px при 1080p, 720px при 800p).
- **Дистанция перехода:** `FADE_RANGE = FADE_END - FADE_START`. При Full HD это более 760 пикселей мягкого градиентного ухода.

### 2.2. Функция Плавности (Smoothstep / Cubic Curve)
Для исключения резкого начала и резкого обрыва применяется сигмоидальная функция `smoothstep`:
$$\text{progress} = \frac{\text{scrollY} - \text{FADE\_START}}{\text{FADE\_END} - \text{FADE\_START}}$$
$$\text{clamped} = \max(0, \min(1, \text{progress}))$$
$$\text{smoothProgress} = \text{clamped}^2 \times (3 - 2 \times \text{clamped})$$
$$\text{opacity} = 1 - \text{smoothProgress}$$

- На отметке `scrollY <= 210px`: `opacity = 1.0` (100% четкость, текст стабилен).
- На интервале `210px < scrollY < 0.90 * H`: непрерывное, мягкое оптическое растворение.
- На отметке `scrollY >= 0.90 * H`: `opacity = 0.0` (полное исчезновение, `visibility: hidden; pointer-events: none`).

### 2.3. Исключение Обрезания Текста на Слоях (Layering Hierarchy)
Чтобы секция 3.3 при наезде снизу мягко и бесшовно поглощала текст Hero без резких артефактов и линий среза:
1. `.hero`: `overflow: visible; z-index: 2;` — текст не отсекается снизу границей блока Hero.
2. `.about-sticky-section`: `position: relative; z-index: 3;` — секция 3.3 гарантированно перекрывает Hero сверху.
3. `.about-sticky-section::before`: сохраняет градиентную маску размытия (`backdrop-filter: blur(14px)` с маской `linear-gradient` на 70px), мягко и красиво смывая растворяющийся текст без жестких краев.

---

## 3. Инженерная Спецификация (Implementation Spec)

### 3.1. Скрипт Плавного Растворения (`src/scripts/hero-parallax.js`)

```javascript
/* =========================================================
   Hero Monolith: Задержка 3 Тика + Плавное Растворение до 90% Секции 3.3 (TASK-059)
   ========================================================= */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  // 1. Утвержденная задержка: 3 тика скролла (~210px):
  const SCROLL_DELAY_PX = 210;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;
    const windowHeight = window.innerHeight;

    // 2. Точка полного исчезновения: ровно 90% покрытия экрана Секцией 3.3:
    const fadeEndPx = windowHeight * 0.90;

    // ФАЗА 1: Задержка на 3 тика (текст на 100% стабилен):
    if (scrollY <= SCROLL_DELAY_PX) {
      heroContent.style.opacity = '1';
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // ФАЗА 2: Ультра-плавное растворение по кривой Smoothstep до 90% экрана:
    else if (scrollY < fadeEndPx) {
      const rawProgress = (scrollY - SCROLL_DELAY_PX) / (fadeEndPx - SCROLL_DELAY_PX);
      const clamped = Math.max(0, Math.min(1, rawProgress));
      
      // Кривая Smoothstep (S-образное кинематографичное затухание без рывков):
      const smoothProgress = clamped * clamped * (3 - 2 * clamped);
      const opacity = Math.max(0, Math.min(1, 1 - smoothProgress));

      heroContent.style.opacity = opacity.toFixed(3);
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // ФАЗА 3: Полное исчезновение при достижении 90% покрытия Секцией 3.3:
    else {
      heroContent.style.opacity = '0';
      heroContent.style.visibility = 'hidden';
      heroContent.style.pointerEvents = 'none';
    }

    // Компенсация скролла: текст зафиксирован на экране (0px смещения относительно монитора):
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

### 3.2. Стилизация и Слоевая Защита в CSS (`src/styles/hero.css` & `src/styles/genesis.css`)

#### В `src/styles/hero.css`:
```css
/* Исключение срезания текста и подготовка к гладкому перекрытию */
.hero {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible; /* Снято отсечение контента */
  background: transparent;
  padding: 0;
  z-index: 2;
}

.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
  opacity: 1;
  transform: none;
  animation: none !important;
  will-change: transform, opacity;
}
```

#### В `src/styles/genesis.css`:
```css
/* Секция 3.3 плавно и бесшовно перекрывает Hero сверху */
.about-sticky-section {
  position: relative;
  z-index: 3; /* Приподнята над Hero (z-index: 2) */
  height: 300vh;
  background: transparent;
}
```

---

## 4. Чек-лист Проверки Реализации (Verification Plan)

- [x] Статус спецификации: `Status: DONE`.
- [x] При первых 3 тиках скролла (`0 ➔ 210px`) текст Hero остается на 100% четким (`opacity: 1`).
- [x] После 210px начинается мягкое кинематографичное растворение по функции `smoothstep`.
- [x] При достижении скроллом отметки `0.90 * window.innerHeight` (90% покрытия экрана секцией 3.3) непрозрачность текста достигает строго `0.0`.
- [x] При `opacity === 0` элементу выставляется `visibility: hidden; pointer-events: none;`.
- [x] Секция 3.3 с мягким градиентным блюром наплывает поверх Hero без жестких полос или срезов (`z-index: 3`).
- [x] Все адаптивные и типографические параметры сохранены в рабочем виде.
