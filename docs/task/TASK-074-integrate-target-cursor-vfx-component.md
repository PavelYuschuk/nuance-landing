# TASK-074: Интеграция Интерактивного Тактического Курсора TargetCursor (React Bits)

**Status:** DONE  
**Target File(s):** `package.json`, `src/scripts/target-cursor.js` (NEW), `src/styles/target-cursor.css` (NEW), `src/scripts/main.js`, `src/styles/main.css`, `index.html` (опционально селекторы `.cursor-target`)  
**Parent Specification:** TASK-003, TASK-010, TASK-040, TASK-073  
**Reference Component:** React Bits `<TargetCursor />` (JavaScript + CSS, powered by GSAP)  

---

## 1. Контекст и Постановка Задачи

Пользователь поставил задачу интегрировать компонент **`<TargetCursor />`** из библиотеки React Bits для замены стандартного курсора браузера на высокотехнологичный тактический курсор-прицел (HUD Targeting Cursor).

### 1.1. Визуальный и кинематографический образ
В контексте тактического отряда **NUANCE**:
- В свободном состоянии (при движении по пустому пространству) курсор представляет собой центральную точку (`.target-cursor-dot`) и четыре угловые скобки (`.target-cursor-corner`), непрерывно вращающиеся вокруг центра с заданной скоростью (`spinDuration: 3.5s`).
- При наведении на интерактивные элементы интерфейса (кнопки, ссылки, карточки, переключатель языков, ростер бойцов) вращение мгновенно останавливается с выравниванием по горизонту (`rotation: 0`), а четыре уголка плавно и с упругой инерцией (`hoverDuration: 0.2s`) расширяются и берут элемент в жесткую рамку захвата цели (Target Lock-On) точно по его габаритам (`getBoundingClientRect()`).
- При перемещении курсора внутри захваченного элемента скобки следуют за ним с мягким параллакс-эффектом (`parallaxOn: true`).
- При клике мыши (`mousedown` / `mouseup`) происходит тактильная реакция: масштаб точки сжимается до 70%, а всего прицела — до 90%.
- При выходе из зоны элемента уголки стягиваются обратно к центральной точке, и плавное вращение возобновляется с сохраненного угла.
- На мобильных и сенсорных устройствах компонент автоматически отключается, возвращая нативное поведение.

### 1.2. Адаптация стека: React + GSAP $\to$ Vanilla JS + CSS + GSAP
Проект **NUANCE Landing** построен на стеке **Vanilla JS + HTML5 + CSS (Vite)** без React.  
Оригинальный компонент React Bits написан с использованием хуков React (`useEffect`, `useRef`, `useCallback`, `createPortal`) и библиотеки анимации **GSAP**.  
Логика переносится в модульный JavaScript-файл [`src/scripts/target-cursor.js`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/target-cursor.js) и таблицу стилей [`src/styles/target-cursor.css`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/target-cursor.css).

---

## 2. Необходимые Зависимости (Prerequisites)

Компонент `<TargetCursor />` опирается на библиотеку **`gsap`** (GreenSock Animation Platform) для физических твинов, тикера с интерполяцией координат и контроля таймлайнов вращения.

Для работы компонента требуется установка пакета `gsap`:

```bash
npm install gsap
```

*(В `package.json` добавится `"gsap": "^3.12.5"`).*

---

## 3. Архитектура и Математика TargetCursor

### 3.1. Управление положением и смещением (Containing Block)
Фиксированный элемент (`position: fixed`) позиционируется относительно вьюпорта, если ни один из предков не создает изолированный контекст наложения (`transform`, `perspective`, `filter`, `contain`).  
Функции `getContainingBlock(element)` и `getContainingBlockOffset(block)` динамически измеряют смещение и гарантируют пиксельную точность позиционирования курсора на любых экранах и при любых трансформациях DOM.

### 3.2. Расчет координат захвата цели (Target Corner Geometry)
При захвате элемента вычисляются координаты 4 углов с учетом ширины обводки (`borderWidth: 3px`) и размера уголка (`cornerSize: 12px`):

$$X_{TL} = \text{rect.left} - \text{borderWidth} - \text{offsetX}$$
$$Y_{TL} = \text{rect.top} - \text{borderWidth} - \text{offsetY}$$

$$X_{TR} = \text{rect.right} + \text{borderWidth} - \text{cornerSize} - \text{offsetX}$$
$$Y_{TR} = \text{rect.top} - \text{borderWidth} - \text{offsetY}$$

$$X_{BR} = \text{rect.right} + \text{borderWidth} - \text{cornerSize} - \text{offsetX}$$
$$Y_{BR} = \text{rect.bottom} + \text{borderWidth} - \text{cornerSize} - \text{offsetY}$$

$$X_{BL} = \text{rect.left} - \text{borderWidth} - \text{offsetX}$$
$$Y_{BL} = \text{rect.bottom} + \text{borderWidth} - \text{cornerSize} - \text{offsetY}$$

### 3.3. Параллакс и слежение внутри цели (Ticker Interpolation)
В кадре анимации (через `gsap.ticker`) смещение каждого уголка относительно курсора вычисляется по формуле:

$$\Delta X_i = X_{\text{target}, i} - X_{\text{cursor}}$$
$$\Delta Y_i = Y_{\text{target}, i} - Y_{\text{cursor}}$$

При движении мыши внутри кнопки координаты курсора меняются, а уголки мгновенно компенсируют это движение, оставаясь физически привязанными к габаритам кнопки с легким упругим демпфированием (`power1.out`, 0.2s).

### 3.4. Синхронизация со скроллом Lenis (Scroll Locking)
При плавном скролле страницы элемент смещается по вертикали.  
Обработчик `scrollHandler` пересчитывает габариты активной цели через `getBoundingClientRect()` и проверяет `document.elementFromPoint()`. Если элемент все еще под курсором, координаты уголков мгновенно обновляются, исключая отрыв рамки от скроллящейся кнопки.

---

## 4. Спецификация Нового Модуля `src/scripts/target-cursor.js` (NEW)

Создается файл [src/scripts/target-cursor.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/target-cursor.js):

```javascript
/* ==========================================================================
   TASK-074: TargetCursor (HUD Targeting Cursor Component)
   Adapted from React Bits (JavaScript + CSS + GSAP) for NUANCE Landing
   ========================================================================== */

import { gsap } from 'gsap';

/**
 * Проверка наличия контекста наложения (containing block), ломающего position: fixed
 */
const getContainingBlock = element => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      (style.willChange && (
        style.willChange.includes('transform') ||
        style.willChange.includes('perspective') ||
        style.willChange.includes('filter')
      )) ||
      /paint|layout|strict|content/.test(style.contain || '')
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = block => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

/**
 * Инициализация тактического курсора-прицела
 * @param {Object} options Параметры конфигурации
 * @returns {Function|null} Функция destroy для очистки слушателей
 */
export function initTargetCursor(options = {}) {
  // Определение мобильных и touch-устройств (на тачскринах кастомный курсор отключается)
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobile = (hasTouchScreen && isSmallScreen) || mobileRegex.test(userAgent.toLowerCase());

  if (isMobile || typeof document === 'undefined') {
    return null;
  }

  // Конфигурация по умолчанию с адаптацией под интерактивные элементы NUANCE
  const {
    targetSelector = '.cursor-target, a, button, [role="button"], input, select, textarea, .doctrine-card, .lang-switcher-btn, .lang-dropdown-item, .team-roster-item',
    spinDuration = 3.5,
    hideDefaultCursor = true,
    hoverDuration = 0.2,
    parallaxOn = true,
    cursorColor = '#ffffff',
    cursorColorOnTarget = '#00E5FF',
    borderWidth = 3,
    cornerSize = 12
  } = options;

  // Создание или получение контейнера курсора в корне DOM
  let wrapper = document.getElementById('targetCursor');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'targetCursor';
    wrapper.className = 'target-cursor-wrapper';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
      <div class="target-cursor-dot"></div>
      <div class="target-cursor-corner corner-tl"></div>
      <div class="target-cursor-corner corner-tr"></div>
      <div class="target-cursor-corner corner-br"></div>
      <div class="target-cursor-corner corner-bl"></div>
    `;
    document.body.appendChild(wrapper);
  }

  const cursor = wrapper;
  const dot = cursor.querySelector('.target-cursor-dot');
  const corners = Array.from(cursor.querySelectorAll('.target-cursor-corner'));

  // Применение исходных цветов
  if (dot) dot.style.backgroundColor = cursorColor;
  corners.forEach(corner => {
    corner.style.borderColor = cursorColor;
  });

  // Скрытие стандартного системного курсора
  if (hideDefaultCursor) {
    document.body.classList.add('target-cursor-active');
  }

  // Исходные позиции уголков вокруг центральной точки (в пикселях от центра)
  const restingPositions = [
    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 }, // TL: -18, -18
    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },  // TR: +6, -18
    { x: cornerSize * 0.5, y: cornerSize * 0.5 },   // BR: +6, +6
    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }   // BL: -18, +6
  ];

  corners.forEach((corner, index) => {
    gsap.set(corner, {
      x: restingPositions[index].x,
      y: restingPositions[index].y
    });
  });

  let containingBlock = getContainingBlock(cursor);
  const getOffset = () => getContainingBlockOffset(containingBlock);

  let activeTarget = null;
  let currentLeaveHandler = null;
  let resumeTimeout = null;
  let targetCornerPositions = null;
  const activeStrength = { current: 0 };

  // Начальная установка курсора по центру окна
  const initialOffset = getOffset();
  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2 - initialOffset.x,
    y: window.innerHeight / 2 - initialOffset.y
  });

  // Непрерывная плавная анимация вращения скобок в режиме покоя
  let spinTl = gsap.timeline({ repeat: -1 })
    .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });

  // Перемещение курсора за мышью
  const moveCursor = (x, y) => {
    if (!cursor) return;
    const { x: offsetX, y: offsetY } = getOffset();
    gsap.to(cursor, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: 'power3.out'
    });
  };

  const moveHandler = e => moveCursor(e.clientX, e.clientY);
  window.addEventListener('mousemove', moveHandler);

  // Вычисление угловых координат захваченного элемента
  const updateTargetPositions = () => {
    if (!activeTarget) return;
    const rect = activeTarget.getBoundingClientRect();
    const { x: offsetX, y: offsetY } = getOffset();
    targetCornerPositions = [
      { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
      { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
      { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
    ];
  };

  // GSAP Ticker для непрерывной интерполяции и параллакса
  const tickerFn = () => {
    if (!targetCornerPositions || !cursor || !corners.length) return;

    const strength = activeStrength.current;
    if (strength === 0) return;

    const cursorX = gsap.getProperty(cursor, 'x');
    const cursorY = gsap.getProperty(cursor, 'y');

    corners.forEach((corner, i) => {
      const currentX = gsap.getProperty(corner, 'x');
      const currentY = gsap.getProperty(corner, 'y');

      const targetX = targetCornerPositions[i].x - cursorX;
      const targetY = targetCornerPositions[i].y - cursorY;

      const finalX = currentX + (targetX - currentX) * strength;
      const finalY = currentY + (targetY - currentY) * strength;

      const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

      gsap.to(corner, {
        x: finalX,
        y: finalY,
        duration: duration,
        ease: duration === 0 ? 'none' : 'power1.out',
        overwrite: 'auto'
      });
    });
  };

  // Отслеживание скролла (синхронизация с Lenis и нативным скроллом)
  const scrollHandler = () => {
    if (!activeTarget || !cursor) return;
    const { x: offsetX, y: offsetY } = getOffset();
    const mouseX = gsap.getProperty(cursor, 'x') + offsetX;
    const mouseY = gsap.getProperty(cursor, 'y') + offsetY;
    const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
    const isStillOverTarget =
      elementUnderMouse &&
      (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);

    if (!isStillOverTarget) {
      if (currentLeaveHandler) {
        currentLeaveHandler();
      }
    } else {
      updateTargetPositions();
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Тактильная реакция на нажатие кнопки мыши
  const mouseDownHandler = () => {
    if (dot) gsap.to(dot, { scale: 0.7, duration: 0.3 });
    gsap.to(cursor, { scale: 0.9, duration: 0.2 });
  };

  const mouseUpHandler = () => {
    if (dot) gsap.to(dot, { scale: 1, duration: 0.3 });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  };

  window.addEventListener('mousedown', mouseDownHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  // Обработка наведения на интерактивный элемент (Target Enter)
  const enterHandler = e => {
    const directTarget = e.target;
    let current = directTarget;
    let target = null;
    while (current && current !== document.body) {
      if (current.matches && current.matches(targetSelector)) {
        target = current;
        break;
      }
      current = current.parentElement;
    }

    if (!target || !cursor || !corners.length) return;
    if (activeTarget === target) return;

    if (activeTarget && currentLeaveHandler) {
      currentLeaveHandler();
    }
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }

    activeTarget = target;
    corners.forEach(corner => gsap.killTweensOf(corner, 'x,y'));

    gsap.killTweensOf(cursor, 'rotation');
    spinTl.pause();
    gsap.set(cursor, { rotation: 0 });

    // Смена цвета на тактический акцент
    if (cursorColorOnTarget) {
      gsap.to(corners, {
        borderColor: cursorColorOnTarget,
        duration: 0.15,
        ease: 'power2.out'
      });
      if (dot) {
        gsap.to(dot, {
          backgroundColor: cursorColorOnTarget,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
    }

    updateTargetPositions();

    const cursorX = gsap.getProperty(cursor, 'x');
    const cursorY = gsap.getProperty(cursor, 'y');

    gsap.ticker.add(tickerFn);

    gsap.to(activeStrength, {
      current: 1,
      duration: hoverDuration,
      ease: 'power2.out'
    });

    corners.forEach((corner, i) => {
      gsap.to(corner, {
        x: targetCornerPositions[i].x - cursorX,
        y: targetCornerPositions[i].y - cursorY,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    // Обработка ухода курсора с элемента (Target Leave)
    const leaveHandler = () => {
      gsap.ticker.remove(tickerFn);

      targetCornerPositions = null;
      gsap.set(activeStrength, { current: 0, overwrite: true });
      activeTarget = null;

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColor,
          duration: 0.15,
          ease: 'power2.out'
        });
        if (dot) {
          gsap.to(dot, {
            backgroundColor: cursorColor,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      }

      corners.forEach(corner => gsap.killTweensOf(corner, 'x,y'));

      const tl = gsap.timeline();
      corners.forEach((corner, index) => {
        tl.to(
          corner,
          {
            x: restingPositions[index].x,
            y: restingPositions[index].y,
            duration: 0.3,
            ease: 'power3.out'
          },
          0
        );
      });

      // Возобновление вращения с сохранением текущей фазы угла
      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursor && spinTl) {
          const currentRotation = gsap.getProperty(cursor, 'rotation');
          const normalizedRotation = currentRotation % 360;
          spinTl.kill();
          spinTl = gsap
            .timeline({ repeat: -1 })
            .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
          gsap.to(cursor, {
            rotation: normalizedRotation + 360,
            duration: spinDuration * (1 - normalizedRotation / 360),
            ease: 'none',
            onComplete: () => {
              spinTl.restart();
            }
          });
        }
        resumeTimeout = null;
      }, 50);

      target.removeEventListener('mouseleave', leaveHandler);
      currentLeaveHandler = null;
    };

    currentLeaveHandler = leaveHandler;
    target.addEventListener('mouseleave', leaveHandler);
  };

  window.addEventListener('mouseover', enterHandler, { passive: true });

  const resizeHandler = () => {
    containingBlock = getContainingBlock(cursor);
  };
  window.addEventListener('resize', resizeHandler);

  // Возврат функции деинициализации
  return function destroy() {
    gsap.ticker.remove(tickerFn);
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseover', enterHandler);
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('mousedown', mouseDownHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler);
    }
    if (resumeTimeout) clearTimeout(resumeTimeout);

    spinTl?.kill();
    document.body.classList.remove('target-cursor-active');
    wrapper?.remove();
  };
}
```

---

## 5. Спецификация Таблицы Стилей `src/styles/target-cursor.css` (NEW)

Создается файл [src/styles/target-cursor.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/target-cursor.css):

```css
/* ==========================================================================
   TASK-074: TargetCursor Stylesheet (React Bits Component Adaptation)
   ========================================================================== */

/* 1. Полное скрытие системного курсора на десктопе при активном TargetCursor */
body.target-cursor-active,
body.target-cursor-active a,
body.target-cursor-active button,
body.target-cursor-active [role="button"],
body.target-cursor-active input,
body.target-cursor-active select,
body.target-cursor-active textarea,
body.target-cursor-active .cursor-target,
body.target-cursor-active .doctrine-card,
body.target-cursor-active .lang-switcher-btn,
body.target-cursor-active .lang-dropdown-item,
body.target-cursor-active .team-roster-item {
  cursor: none !important;
}

/* 2. Контейнер курсора: фиксирован поверх всего сайта, нулевой размер, прозрачен для кликов */
.target-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 2147483647; /* Максимальный системный z-index */
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  user-select: none;
}

/* 3. Центральная тактическая точка прицела */
.target-cursor-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
}

/* 4. Четыре тактических скобки-уголка (Corner Brackets) */
.target-cursor-corner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 3px solid #ffffff;
  box-sizing: border-box;
  will-change: transform, border-color;
}

/* Верхний левый уголок */
.corner-tl {
  border-right: none;
  border-bottom: none;
}

/* Верхний правый уголок */
.corner-tr {
  border-left: none;
  border-bottom: none;
}

/* Нижний правый уголок */
.corner-br {
  border-left: none;
  border-top: none;
}

/* Нижний левый уголок */
.corner-bl {
  border-right: none;
  border-top: none;
}
```

---

## 6. Подключение в `src/styles/main.css` и `src/scripts/main.js`

### 6.1. В `src/styles/main.css`
Добавляется импорт новой таблицы стилей `target-cursor.css`:

```css
@import './variables.css';
@import './reset.css';
@import './typography.css';
@import './grid.css';
@import './header.css';
@import './hero.css';
@import './genesis.css';
@import './team.css';
@import './doctrine.css';
@import './border-glow.css';
@import './target-cursor.css'; /* TASK-074: TargetCursor */
@import './socials.css';
@import './footer.css';
```

### 6.2. В `src/scripts/main.js`
Импортируется и инициализируется `initTargetCursor`:

```javascript
import '../styles/main.css';
import { initNavigation } from './navigation.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroParallax, initHeroMonolith } from './hero-parallax.js';
import { initAboutStickyScroll } from './about-scroll.js';
import { initTeamStickyScroll } from './team-scroll.js';
import { initDoctrineLogoParallax } from './doctrine-scroll.js';
import { initI18n } from './i18n.js';
import { initLightRays } from './light-rays.js';
import { initBorderGlow } from './border-glow.js';
import { initTargetCursor } from './target-cursor.js'; // TASK-074

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initI18n();
  initSmoothScroll();
  initHeroParallax();
  initHeroMonolith();
  initAboutStickyScroll();
  initTeamStickyScroll();
  initDoctrineLogoParallax();

  // TASK-070: WebGL LightRays
  initLightRays('.team-zone-2', {
    raysOrigin: 'top-zone1',
    raysColor: '#c1f2ff',
    raysSpeed: 0.5,
    lightSpread: 0.22,
    rayLength: 1.25,
    followMouse: true,
    mouseInfluence: 0.25,
    noiseAmount: 0.1,
    distortion: 0.05,
    pulsating: true,
    fadeDistance: 1.7,
    saturation: 0.8
  });

  // TASK-073: BorderGlow для Genesis
  initBorderGlow('.genesis-image-block', {
    edgeSensitivity: 20,
    glowColor: '185 100 60',
    backgroundColor: '#141C29',
    borderRadius: 14,
    glowRadius: 50,
    glowIntensity: 2.2,
    coneSpread: 26,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-073: BorderGlow для Доктрины
  initBorderGlow('.doctrine-card', {
    edgeSensitivity: 22,
    glowColor: '185 100 60',
    backgroundColor: 'rgba(20, 28, 41, 0.4)',
    borderRadius: 16,
    glowRadius: 60,
    glowIntensity: 2.5,
    coneSpread: 28,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-074: Инициализация тактического курсора TargetCursor
  initTargetCursor({
    targetSelector: '.cursor-target, a, button, [role="button"], input, select, textarea, .doctrine-card, .lang-switcher-btn, .lang-dropdown-item, .team-roster-item',
    spinDuration: 3.5,
    hideDefaultCursor: true,
    hoverDuration: 0.2,
    parallaxOn: true,
    cursorColor: '#ffffff',
    cursorColorOnTarget: '#00E5FF' // При захвате цели цвет переходит в тактический циановый оттенок NUANCE
  });

  console.log('NUANCE Tactical Group Website initialized with TargetCursor and Lenis.');
});
```

---

## 7. Разметка `index.html` и Использование Класса `.cursor-target`

Поскольку в конфигурации `targetSelector` уже заложены все основные интерактивные элементы сайта (`a`, `button`, `.doctrine-card`, `.lang-switcher-btn`, `.team-roster-item`), курсор автоматически будет захватывать все кнопки и карточки.

При необходимости захвата любого произвольного блока (например, заголовка Hero, логотипа или блока с текстом) достаточно добавить класс `cursor-target`:
```html
<div class="cursor-target">Любой элемент для захвата прицелом</div>
```

---

## 8. План Верификации и Тестирования

1. **Установка зависимостей:**
   - [x] Выполнена команда `npm install gsap`.
   - [x] Запуск `npm run dev` проходит без ошибок сборки Vite.

2. **Поведение в режиме свободного перемещения:**
   - [x] Стандартный курсор мыши скрыт на всей площади сайта.
   - [x] Вместо него отображается белая точка с четырьмя вращающимися уголками.
   - [x] Вращение плавное, без рывков (`spinDuration: 3.5s`).
   - [x] Задержка следования минимальна (`0.1s ease: 'power3.out'`).

3. **Захват цели (Target Lock-On):**
   - [x] При наведении на кнопки навигации в хедере, переключатель языка, карточки Доктрины и кнопки ростера вращение мгновенно прекращается, угол сбрасывается в 0.
   - [x] Четыре уголка плавно разъезжаются и формируют точную рамку вокруг границ элемента.
   - [x] Цвет рамки и точки плавно переходит в тактический циановый `#00E5FF` (или белый `#ffffff` в зависимости от настройки).
   - [x] При движении мыши над кнопкой уголки проявляют мягкий параллакс-эффект.

4. **Выход из цели:**
   - [x] При уводе курсора уголки плавно возвращаются к центральной точке.
   - [x] Вращение плавно возобновляется с сохраненного угла без визуального скачка.

5. **Клик мыши (Tactile Feedback):**
   - [x] При нажатии ЛКМ прицел сжимается (`scale: 0.9`, точка `scale: 0.7`).
   - [x] При отпускании ЛКМ возвращается к исходному масштабу `1.0`.

6. **Скролл и адаптивность:**
   - [x] При скролле страницы (через Lenis) рамка захвата не отрывается от элемента и сопровождает его до выхода из зоны курсора.
   - [x] На мобильных устройствах (экраны $\le 768\text{px}$ или сенсорный ввод) скрипт не инициализируется, сохраняя нативный тач-интерфейс.
