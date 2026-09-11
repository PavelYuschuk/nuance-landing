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
    excludeSelector = 'header, .header, .header *', // TASK-076: Исключение хедера из захвата
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

  // Отслеживание скролла (синхронизация со SmoothScroll.js и нативным скроллом)
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

    // TASK-076: Если курсор находится над хедером или его дочерними элементами — запрещаем магнетизм
    if (excludeSelector && (directTarget.matches?.(excludeSelector) || directTarget.closest?.(excludeSelector))) {
      if (activeTarget && currentLeaveHandler) {
        currentLeaveHandler();
      }
      return;
    }

    let current = directTarget;
    let target = null;
    while (current && current !== document.body) {
      // Дополнительная защита: предок не должен быть хедером
      if (excludeSelector && (current.matches?.(excludeSelector) || current.closest?.(excludeSelector))) {
        break;
      }
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
