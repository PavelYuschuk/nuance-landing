# TASK-075: Модификация Эффекта BorderGlow (Обновление Спецификации React Bits)

**Status:** DONE  
**Target File(s):** `src/scripts/border-glow.js`, `src/styles/border-glow.css`, `src/scripts/main.js`  
**Parent Specification:** TASK-073  
**Reference Component:** React Bits `<BorderGlow />` (JavaScript + CSS Updated Release)  

---

## 1. Контекст и Цели Модификации

Пользователь предоставил обновленную версию компонента **`<BorderGlow />`** из библиотеки React Bits для модификации реализации из [TASK-073](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/docs/task/TASK-073-integrate-border-glow-vfx-in-genesis-and-doctrine.md).

### 1.1. Ключевые изменения в обновленном компоненте React Bits:
1. **Интеллектуальный детектор светлых тем (`isLightColor`)**:
   Добавлена функция расчета относительной яркости по стандарту WCAG:
   $$\text{Luminance} = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B > 180$$
   При светлом `backgroundColor` карточке автоматически присваивается модификатор `.border-glow-card--light` с адаптивной рамкой, тенями и `mix-blend-mode: normal` вместо аддитивных режимов.
2. **Параметр `--fill-opacity` (настраиваемая плотность заливки кромки)**:
   Введен проп `fillOpacity` (по умолчанию `0.5`), управляющий прозрачностью внутренней подсветки контура:
   $$\text{opacity} = \text{fillOpacity} \times \frac{\text{proximity} - \text{colorSensitivity}}{100 - \text{colorSensitivity}}$$
3. **Обновленная формула цветовой чувствительности**:
   `--color-sensitivity` теперь рассчитывается со смещением $+20$ (ранее было $+15$):
   `--color-sensitivity: calc(var(--edge-sensitivity) + 20);`
4. **Многослойная маска внутренней заливки из 6 радиальных градиентов**:
   В `.border-glow-card::after` маска расширена 4 угловыми эллипсами (`66% 66%`, `33% 33%`, `66% 33%`, `33% 66%`), создающими ультра-мягкий естественный градиентный спад свечения к центру карточки с `mask-composite: subtract, add, add, add, add, add;`.
5. **Аддитивный режим наложения `plus-lighter` для внешней ауры**:
   В `.edge-light` режим наложения обновлен с `screen` на `plus-lighter`. Это обеспечивает максимальную сочность неонового ореола на темном фоне без выгорания полутонов.
6. **Калиброванный 13-уровневый `box-shadow` в `.edge-light::before`**:
   Сформирована сбалансированная кривая рассеивания (7 вложенных `inset` уровней от `0` до `50px` и 6 внешних уровней `0` до `50px`).
7. **Шестиуровневая реалистичная тень карточки (Ambient Occlusion)**:
   В базовые стили карточки добавлен реалистичный многослойный стек теней глубины от `1px` до `64px`.

---

## 2. Спецификация Обновленного Модуля `src/scripts/border-glow.js`

Обновляется файл [src/scripts/border-glow.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/border-glow.js):

```javascript
/* ==========================================================================
   TASK-075: Native Vanilla JS BorderGlow Component (Updated React Bits Release)
   Adapted from React Bits for NUANCE Landing
   ========================================================================== */

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 185, s: 100, l: 60 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

/**
 * Проверка относительной яркости фона (WCAG relative luminance)
 */
function isLightColor(color) {
  if (!color || typeof color !== 'string') return false;
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

function getCenterOfElement(el) {
  const { width, height } = el.getBoundingClientRect();
  return [width / 2, height / 2];
}

function getEdgeProximity(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
}

function getCursorAngle(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

/**
 * Инициализация эффекта BorderGlow для переданного селектора
 * @param {string} selector CSS-селектор целевых карточек
 * @param {Object} customOptions Параметры эффекта
 */
export function initBorderGlow(selector, customOptions = {}) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const defaultOptions = {
    edgeSensitivity: 30,
    glowColor: '185 100 60', // NUANCE Cyan HSL
    backgroundColor: '#141C29',
    borderRadius: 16,
    glowRadius: 40,
    glowIntensity: 1.0,
    coneSpread: 25,
    animated: false,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8'], // Тактическая палитра NUANCE
    fillOpacity: 0.5
  };

  const options = { ...defaultOptions, ...customOptions };

  elements.forEach(card => {
    // 1. Присвоение базового класса и детектора светлого фона
    card.classList.add('border-glow-card');
    const lightSurface = isLightColor(options.backgroundColor);
    if (lightSurface) {
      card.classList.add('border-glow-card--light');
    } else {
      card.classList.remove('border-glow-card--light');
    }

    // 2. Вставка внешнего элемента рассеивания света
    if (!card.querySelector('.edge-light')) {
      const edgeLight = document.createElement('span');
      edgeLight.className = 'edge-light';
      edgeLight.setAttribute('aria-hidden', 'true');
      card.prepend(edgeLight);
    }

    // 3. Установка обновленных CSS-переменных
    card.style.setProperty('--card-bg', options.backgroundColor);
    card.style.setProperty('--edge-sensitivity', options.edgeSensitivity);
    card.style.setProperty('--border-radius', `${options.borderRadius}px`);
    card.style.setProperty('--glow-padding', `${options.glowRadius}px`);
    card.style.setProperty('--cone-spread', options.coneSpread);
    card.style.setProperty('--fill-opacity', options.fillOpacity);

    const glowVars = buildGlowVars(options.glowColor, options.glowIntensity);
    Object.entries(glowVars).forEach(([k, v]) => card.style.setProperty(k, v));

    const gradientVars = buildGradientVars(options.colors);
    Object.entries(gradientVars).forEach(([k, v]) => card.style.setProperty(k, v));

    // 4. Обработчик движения указателя (pointermove)
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });

    // 5. Опциональная анимация начального прохода (Intro Sweep)
    if (options.animated) {
      const angleStart = 110;
      const angleEnd = 465;
      card.classList.add('sweep-active');
      card.style.setProperty('--cursor-angle', `${angleStart}deg`);

      animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
      animateValue({
        ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
          card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
        }
      });
      animateValue({
        ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
          card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
        }
      });
      animateValue({
        ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: v => card.style.setProperty('--edge-proximity', v),
        onEnd: () => card.classList.remove('sweep-active'),
      });
    }
  });
}
```

---

## 3. Спецификация Обновленной Таблицы Стилей `src/styles/border-glow.css`

Обновляется файл [src/styles/border-glow.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/border-glow.css):

```css
/* ==========================================================================
   TASK-075: BorderGlow Core Component Styles (Updated React Bits Release)
   ========================================================================== */

.border-glow-card {
  --edge-proximity: 0;
  --cursor-angle: 45deg;
  --edge-sensitivity: 30;
  --color-sensitivity: calc(var(--edge-sensitivity) + 20);
  --border-radius: 28px;
  --glow-padding: 40px;
  --cone-spread: 25;
  --fill-opacity: 0.5;

  position: relative;
  border-radius: var(--border-radius);
  isolation: isolate;
  transform: translate3d(0, 0, 0.01px);
  display: grid;
  border: 1px solid rgb(255 255 255 / 15%);
  background: var(--card-bg, #141C29);
  overflow: visible !important; /* Гарантирует свободное распространение внешней ауры */
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 2px,
    rgba(0, 0, 0, 0.1) 0px 2px 4px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px,
    rgba(0, 0, 0, 0.1) 0px 8px 16px,
    rgba(0, 0, 0, 0.1) 0px 16px 32px,
    rgba(0, 0, 0, 0.1) 0px 32px 64px;
}

/* Стилизация для светлых фонов (при необходимости) */
.border-glow-card--light {
  border-color: rgb(24 24 27 / 12%);
  box-shadow:
    rgb(24 24 27 / 4%) 0 1px 2px,
    rgb(24 24 27 / 5%) 0 8px 24px;
}

.border-glow-card--light::after,
.border-glow-card--light > .edge-light {
  mix-blend-mode: normal;
}

/* Общие правила для всех слоев свечения */
.border-glow-card::before,
.border-glow-card::after,
.border-glow-card > .edge-light {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.25s ease-out;
  z-index: -1;
  pointer-events: none;
}

.border-glow-card:not(:hover):not(.sweep-active)::before,
.border-glow-card:not(:hover):not(.sweep-active)::after,
.border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
}

/* 1. Цветная меш-градиентная рамка (Colored mesh-gradient border) */
.border-glow-card::before {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--card-bg, #141C29) 0 100%) padding-box,
    linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
    var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) border-box,
    var(--gradient-base, linear-gradient(#c299ff 0 100%)) border-box;

  opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center,
      black calc(var(--cone-spread) * 1%),
      transparent calc((var(--cone-spread) + 15) * 1%),
      transparent calc((100 - var(--cone-spread) - 15) * 1%),
      black calc((100 - var(--cone-spread)) * 1%)
    );
  -webkit-mask-image:
    conic-gradient(
      from var(--cursor-angle) at center,
      black calc(var(--cone-spread) * 1%),
      transparent calc((var(--cone-spread) + 15) * 1%),
      transparent calc((100 - var(--cone-spread) - 15) * 1%),
      black calc((100 - var(--cone-spread)) * 1%)
    );
}

/* 2. Внутренняя фоновая подсветка с обновленной 6-уровневой маской */
.border-glow-card::after {
  border: 1px solid transparent;
  background:
    var(--gradient-one, radial-gradient(at 80% 55%, hsla(268, 100%, 76%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-two, radial-gradient(at 69% 34%, hsla(349, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-three, radial-gradient(at 8% 6%, hsla(136, 100%, 78%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-four, radial-gradient(at 41% 38%, hsla(192, 100%, 64%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-five, radial-gradient(at 86% 85%, hsla(186, 100%, 74%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-six, radial-gradient(at 82% 18%, hsla(52, 100%, 65%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, hsla(12, 100%, 72%, 1) 0px, transparent 50%)) padding-box,
    var(--gradient-base, linear-gradient(#c299ff 0 100%)) padding-box;

  mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);
  -webkit-mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
    radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

  mask-composite: subtract, add, add, add, add, add;
  -webkit-mask-composite: source-out, destination-over, destination-over, destination-over, destination-over, destination-over;

  opacity: calc(var(--fill-opacity, 0.5) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
  mix-blend-mode: soft-light;
}

/* 3. Внешняя световая аура (Outer Glow Layer) */
.border-glow-card > .edge-light {
  inset: calc(var(--glow-padding) * -1);
  pointer-events: none;
  z-index: 1; /* Перекрывает z-index: -1 и выводит ореол на внешний слой */

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );
  -webkit-mask-image:
    conic-gradient(
      from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );

  opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
  mix-blend-mode: plus-lighter; /* Обновлено с screen на plus-lighter */
}

/* 4. 13-уровневый светящийся контур (Box-Shadow Core) */
.border-glow-card > .edge-light::before {
  content: "";
  position: absolute;
  inset: var(--glow-padding);
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--glow-color, hsl(40deg 80% 80% / 100%)),
    inset 0 0 1px 0 var(--glow-color-60, hsl(40deg 80% 80% / 60%)),
    inset 0 0 3px 0 var(--glow-color-50, hsl(40deg 80% 80% / 50%)),
    inset 0 0 6px 0 var(--glow-color-40, hsl(40deg 80% 80% / 40%)),
    inset 0 0 15px 0 var(--glow-color-30, hsl(40deg 80% 80% / 30%)),
    inset 0 0 25px 2px var(--glow-color-20, hsl(40deg 80% 80% / 20%)),
    inset 0 0 50px 2px var(--glow-color-10, hsl(40deg 80% 80% / 10%)),
    0 0 1px 0 var(--glow-color-60, hsl(40deg 80% 80% / 60%)),
    0 0 3px 0 var(--glow-color-50, hsl(40deg 80% 80% / 50%)),
    0 0 6px 0 var(--glow-color-40, hsl(40deg 80% 80% / 40%)),
    0 0 15px 0 var(--glow-color-30, hsl(40deg 80% 80% / 30%)),
    0 0 25px 2px var(--glow-color-20, hsl(40deg 80% 80% / 20%)),
    0 0 50px 2px var(--glow-color-10, hsl(40deg 80% 80% / 10%));
}

/* 5. Внутренний контейнер контента с защитой от наложения и обрезкой углов */
.border-glow-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
}
```

---

## 4. Конфигурация в `src/scripts/main.js`

В [src/scripts/main.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/main.js) параметры вызова `initBorderGlow` обновляются для использования новых возможностей и калибровки:

```javascript
  // TASK-075: Обновленная инициализация BorderGlow для иллюстраций Genesis
  initBorderGlow('.genesis-image-block', {
    edgeSensitivity: 20,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: '#141C29',
    borderRadius: 14,
    glowRadius: 50,
    glowIntensity: 2.2,
    coneSpread: 26,
    fillOpacity: 0.45,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-075: Обновленная инициализация BorderGlow для карточек Доктрины
  initBorderGlow('.doctrine-card', {
    edgeSensitivity: 22,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: 'rgba(20, 28, 41, 0.4)',
    borderRadius: 16,
    glowRadius: 60,
    glowIntensity: 2.5,
    coneSpread: 28,
    fillOpacity: 0.5,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });
```

---

## 5. План Верификации и Тестирования

1. **Проверка работы аддитивного свечения `plus-lighter`:**
   - [x] При поднесении курсора к краям фреймов Genesis и карточек Доктрины неоновый ореол сияет ярко, чисто и насыщенно, без выцветания или артефактов затемнения.
2. **Проверка 6-уровневой эллиптической маски:**
   - [x] Внутренняя подсветка карточки плавно сходит на нет к центру без резких квадратных срезов.
   - [x] Плотность заливки управляется параметром `fillOpacity: 0.45-0.5`.
3. **Проверка 13-уровневого свечения рамок:**
   - [x] Переход от ультра-четкой 1px границы к мягкому внешнему свечению выглядит гладко и естественно.
4. **Проверка изоляции и контента:**
   - [x] Текст внутри карточек Доктрины и изображения внутри Genesis сохраняют идеальную четкость и читаемость.
