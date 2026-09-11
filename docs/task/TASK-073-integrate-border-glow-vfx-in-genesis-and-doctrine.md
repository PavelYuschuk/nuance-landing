# TASK-073: Интеграция Интерактивного Эффекта BorderGlow (React Bits) для Иллюстраций Genesis и Карточек Доктрины

**Status:** DONE  
**Target File(s):** `src/scripts/border-glow.js` (NEW), `src/styles/border-glow.css` (NEW), `src/scripts/main.js`, `src/styles/main.css`, `src/styles/genesis.css`, `src/styles/doctrine.css`, `index.html`  
**Parent Specification:** TASK-003, TASK-023, TASK-040  
**Reference Component:** React Bits `<BorderGlow />` (JavaScript + CSS)  

---

## 1. Контекст и Постановка Задачи

Пользователь поставил задачу добавить интерактивный эффект неонового свечения рамок **`<BorderGlow />`** из библиотеки React Bits на два ключевых элемента интерфейса:
1. **Иллюстрации в Секции 3.3 (Genesis / О Нас):**  
   Фреймы изображений `.genesis-image-block` (Слайд 0 «Кто мы», Слайд 1 «История», Слайд 2 «Механизм»).
2. **Карточки в Секции 3.5 (Доктрина):**  
   Информационные карточки тактических принципов `.doctrine-card` (01. Асимметрия, 02. Симбиоз, 03. Автономия).

### 1.1. Адаптация стека: React $\to$ Native Vanilla JS + CSS
Проект **NUANCE Landing** построен на стеке **Vanilla JS + HTML5 + CSS (Vite)** без React.  
Компонент `BorderGlow` из React Bits представляет собой комбинацию математического расчета положения курсора мыши (угол и близость к границе) и многослойных CSS-масок на базе `conic-gradient`, `radial-gradient` и `box-shadow`.  
Логика переносится в нативный JavaScript-модуль `src/scripts/border-glow.js` и выделенный стилевой файл `src/styles/border-glow.css`.

---

## 2. Архитектура и Математика Эффекта BorderGlow

### 2.1. Математический расчет координат курсора
При движении курсора над элементом рассчитываются два динамических параметра:
1. **`--edge-proximity` (Близость к краю, $0 \dots 100\%$):**  
   Вычисляет нормализованное расстояние от центра элемента до курсора с учетом пропорций сторон:
   $$k_x = \frac{w / 2}{|x - w/2|}, \quad k_y = \frac{h / 2}{|y - h/2|}$$
   $$\text{proximity} = \min\left(\max\left(\frac{1}{\min(k_x, k_y)}, 0\right), 1\right) \times 100$$
2. **`--cursor-angle` (Полярный угол направления курсора, $0^\circ \dots 360^\circ$):**  
   Определяет угол поворота конического светового луча:
   $$\theta = \text{atan2}(y - h/2, x - w/2) \times \frac{180}{\pi} + 90^\circ$$

### 2.2. Архитектура слоев свечения
- **Слой 1 (`::before`):** Многоцветный меш-градиент контура рамки (Mesh-gradient border), видимый только в узком секторе направления курсора (`conic-gradient`).
- **Слой 2 (`::after`):** Внутренняя фоновая засветка (soft-light fill) вдоль кромки карточки.
- **Слой 3 (`> .edge-light`):** Объемная внешняя аура (Outer Glow) из 13 вложенных уровней `box-shadow`, распространяющаяся за пределы карточки на `--glow-padding: 40px`–`60px`.
- **Слой 4 (`.border-glow-inner`):** Контентный слой с `position: relative; z-index: 1; border-radius: inherit; overflow: hidden;`.

---

## 3. Спецификация Нового Модуля `src/scripts/border-glow.js` (NEW)

Создается файл [src/scripts/border-glow.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/border-glow.js):

```javascript
/* ==========================================
   TASK-073: Native Vanilla JS BorderGlow Component
   Adapted from React Bits for NUANCE Landing
   ========================================== */

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

export function initBorderGlow(selector, customOptions = {}) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const defaultOptions = {
    edgeSensitivity: 25,
    glowColor: '185 100 60', // NUANCE Cyan HSL
    backgroundColor: '#141C29',
    borderRadius: 16,
    glowRadius: 50,
    glowIntensity: 2.2,
    coneSpread: 28,
    animated: false,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8'], // Фирменная палитра NUANCE
    fillOpacity: 0.4
  };

  const options = { ...defaultOptions, ...customOptions };

  elements.forEach(card => {
    // 1. Добавление класса и структуры если не присутствуют
    card.classList.add('border-glow-card');

    if (!card.querySelector('.edge-light')) {
      const edgeLight = document.createElement('span');
      edgeLight.className = 'edge-light';
      edgeLight.setAttribute('aria-hidden', 'true');
      card.prepend(edgeLight);
    }

    // 2. Установка начальных CSS-переменных
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

    // 3. Обработчик перемещения указателя
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });

    // 4. Опциональная вводная анимация обхода (Intro Sweep)
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

## 4. Спецификация Стилей `src/styles/border-glow.css` (NEW)

Создается файл [src/styles/border-glow.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/border-glow.css):

```css
/* ==========================================
   TASK-073: BorderGlow Core Component Styles
   ========================================== */

.border-glow-card {
  --edge-proximity: 0;
  --cursor-angle: 45deg;
  --edge-sensitivity: 25;
  --color-sensitivity: calc(var(--edge-sensitivity) + 15);
  --border-radius: 16px;
  --glow-padding: 40px;
  --cone-spread: 28;

  position: relative;
  border-radius: var(--border-radius);
  isolation: isolate;
  transform: translate3d(0, 0, 0.01px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--card-bg, #141C29);
  overflow: visible !important; /* Для свободного выхода внешней неоновой ауры */
  box-shadow:
    rgba(0, 0, 0, 0.3) 0px 4px 12px,
    rgba(0, 0, 0, 0.5) 0px 16px 36px;
}

.border-glow-card::before,
.border-glow-card::after,
.border-glow-card > .edge-light {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.25s ease-out;
  pointer-events: none;
}

.border-glow-card::before,
.border-glow-card::after {
  z-index: 0;
}

.border-glow-card:not(:hover):not(.sweep-active)::before,
.border-glow-card:not(:hover):not(.sweep-active)::after,
.border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
}

/* 1. Цветная меш-градиентная рамка */
.border-glow-card::before {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--card-bg, #141C29) 0 100%) padding-box,
    linear-gradient(rgba(255, 255, 255, 0) 0% 100%) border-box,
    var(--gradient-one, radial-gradient(at 80% 55%, #00E5FF 0px, transparent 50%)) border-box,
    var(--gradient-two, radial-gradient(at 69% 34%, #C1FF00 0px, transparent 50%)) border-box,
    var(--gradient-three, radial-gradient(at 8% 6%, #38bdf8 0px, transparent 50%)) border-box,
    var(--gradient-four, radial-gradient(at 41% 38%, #00E5FF 0px, transparent 50%)) border-box,
    var(--gradient-five, radial-gradient(at 86% 85%, #C1FF00 0px, transparent 50%)) border-box,
    var(--gradient-six, radial-gradient(at 82% 18%, #38bdf8 0px, transparent 50%)) border-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, #00E5FF 0px, transparent 50%)) border-box,
    var(--gradient-base, linear-gradient(#00E5FF 0 100%)) border-box;

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

/* 2. Мягкая фоновая подсветка у краев */
.border-glow-card::after {
  border: 1px solid transparent;
  background:
    var(--gradient-one, radial-gradient(at 80% 55%, #00E5FF 0px, transparent 50%)) padding-box,
    var(--gradient-two, radial-gradient(at 69% 34%, #C1FF00 0px, transparent 50%)) padding-box,
    var(--gradient-three, radial-gradient(at 8% 6%, #38bdf8 0px, transparent 50%)) padding-box,
    var(--gradient-four, radial-gradient(at 41% 38%, #00E5FF 0px, transparent 50%)) padding-box,
    var(--gradient-five, radial-gradient(at 86% 85%, #C1FF00 0px, transparent 50%)) padding-box,
    var(--gradient-six, radial-gradient(at 82% 18%, #38bdf8 0px, transparent 50%)) padding-box,
    var(--gradient-seven, radial-gradient(at 51% 4%, #00E5FF 0px, transparent 50%)) padding-box,
    var(--gradient-base, linear-gradient(#00E5FF 0 100%)) padding-box;

  mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);
  -webkit-mask-image:
    linear-gradient(to bottom, black, black),
    radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
    conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

  mask-composite: subtract, add, add;
  -webkit-mask-composite: source-out, destination-over, source-over;
  opacity: calc(var(--fill-opacity, 0.4) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
  mix-blend-mode: soft-light;
}

/* 3. Внешняя объемная световая аура (Outer Glow) */
.border-glow-card > .edge-light {
  inset: calc(var(--glow-padding) * -1);
  pointer-events: none;
  z-index: 2;

  mask-image:
    conic-gradient(
      from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );
  -webkit-mask-image:
    conic-gradient(
      from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%
    );

  opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
  mix-blend-mode: screen;
}

.border-glow-card > .edge-light::before {
  content: "";
  position: absolute;
  inset: var(--glow-padding);
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--glow-color, hsl(185deg 100% 60% / 100%)),
    inset 0 0 2px 0 var(--glow-color-60, hsl(185deg 100% 60% / 60%)),
    inset 0 0 4px 0 var(--glow-color-50, hsl(185deg 100% 60% / 50%)),
    inset 0 0 8px 0 var(--glow-color-40, hsl(185deg 100% 60% / 40%)),
    inset 0 0 18px 0 var(--glow-color-30, hsl(185deg 100% 60% / 30%)),
    inset 0 0 28px 2px var(--glow-color-20, hsl(185deg 100% 60% / 20%)),
    0 0 2px 0 var(--glow-color-60, hsl(185deg 100% 60% / 60%)),
    0 0 4px 0 var(--glow-color-50, hsl(185deg 100% 60% / 50%)),
    0 0 8px 0 var(--glow-color-40, hsl(185deg 100% 60% / 40%)),
    0 0 18px 0 var(--glow-color-30, hsl(185deg 100% 60% / 30%)),
    0 0 32px 2px var(--glow-color-20, hsl(185deg 100% 60% / 20%)),
    0 0 60px 4px var(--glow-color-10, hsl(185deg 100% 60% / 10%));
}

/* 4. Внутренний контейнер контента с обрезкой углов */
.border-glow-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
}
```

---

## 5. Спецификация Разметки (`index.html`)

### 5.1. Секция 3.3 Genesis: Иллюстрации (`.genesis-image-block`)
Внутри каждого блока `.genesis-image-block` добавляется `<span class="edge-light"></span>`, а содержимое помещается в `.border-glow-inner`:

```html
<!-- Пример для Слой 0 (строки 161–166): -->
<div class="col-7">
  <div class="genesis-image-block border-glow-card">
    <span class="edge-light" aria-hidden="true"></span>
    <div class="border-glow-inner">
      <img src="/assets/images/About. Screen 2.jpg" alt="NUANCE — Фатальная ошибка в чужом плане" loading="eager" />
      <div class="genesis-image-overlay"></div>
    </div>
  </div>
</div>
```
*(Аналогично для Слайда 1 и Слайда 2)*

### 5.2. Секция 3.5 Doctrine: Карточки (`.doctrine-card`)
Внутри каждой карточки `.doctrine-card` добавляется `<span class="edge-light"></span>`, а содержимое оборачивается в `.border-glow-inner`:

```html
<!-- Карточка 1 (строки 439–448): -->
<div class="doctrine-card border-glow-card">
  <span class="edge-light" aria-hidden="true"></span>
  <div class="border-glow-inner">
    <div class="doctrine-card-bg"></div>
    <div class="doctrine-card-overlay"></div>
    <div class="doctrine-card-content">
      <h3 class="doctrine-card-title">01. Асимметрия</h3>
      <p class="doctrine-card-text">
        Отказ от лобовых столкновений в пользу неожиданных ударов в уязвимые точки обороны противника.
      </p>
    </div>
  </div>
</div>
```
*(Аналогично для Карточки 2 и Карточки 3)*

---

## 6. Подключение в `src/scripts/main.js` и `src/styles/main.css`

### 6.1. В `src/styles/main.css`
Добавляется импорт новой таблицы стилей:
```css
@import './border-glow.css';
```

### 6.2. В `src/scripts/main.js`
Импортируется и инициализируется функция `initBorderGlow`:

```javascript
import { initBorderGlow } from './border-glow.js';

document.addEventListener('DOMContentLoaded', () => {
  // ... существующие инициализации

  // TASK-073: Инициализация BorderGlow для иллюстраций Genesis
  initBorderGlow('.genesis-image-block', {
    edgeSensitivity: 20,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: '#141C29',
    borderRadius: 14,
    glowRadius: 50,
    glowIntensity: 2.2,
    coneSpread: 26,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-073: Инициализация BorderGlow для карточек Доктрины
  initBorderGlow('.doctrine-card', {
    edgeSensitivity: 22,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: 'rgba(20, 28, 41, 0.4)',
    borderRadius: 16,
    glowRadius: 60,
    glowIntensity: 2.5,
    coneSpread: 28,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });
});
```

---

## 7. План Верификации и Тестирования

1. **Проверка работы в Секции 3.3 (Genesis):**
   - [x] При поднесении курсора мыши к границе фрейма иллюстрации в точке наведения вспыхивает направленное неоновое свечение рамки (`#00E5FF` + `#C1FF00`). Выполнено.
   - [x] Свечение плавно скользит по контуру вслед за перемещением курсора (`--cursor-angle`). Выполнено.
   - [x] При отдалении курсора от границы свечение мягко затухает (`0.75s ease-in-out`). Выполнено.
   - [x] Сама картинка остается четко обрезанной по скругленным углам (`14px`), а внешняя аура рассеивается наружу. Выполнено.
2. **Проверка работы в Секции 3.5 (Доктрина):**
   - [x] Все 3 карточки принципов («Асимметрия», «Симбиоз», «Автономия») реагируют на перемещение мыши динамическим световым пятном на гранях. Выполнено.
   - [x] Внутренний полупрозрачный фон карточек `rgba(20, 28, 41, 0.4)` и матовое стекло `backdrop-filter: blur(8px)` сохраняют свою читаемость. Выполнено.
3. **Производительность:**
   - [x] Расчет углов и расстояний оптимизирован через векторные дельты без перегрузки CPU. Выполнено.
   - [x] Свойство `pointer-events: none` на `.edge-light` обеспечивает свободные клики по карточкам и тексту. Выполнено.
