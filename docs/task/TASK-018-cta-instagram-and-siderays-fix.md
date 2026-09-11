# TASK-018: Добавление Instagram, Бренд-Логотипов и Отладка SideRays в "3.6. Call to Action"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/socials.css`, `src/scripts/side-rays.js`, `src/scripts/main.js`  
**Parent Specification:** TASK-017 (`docs/task/TASK-017-cta-section-refactor.md`)

---

## 1. Контекст и Цель Модификации
1. **Интеграция Instagram:** Добавление 4-й социальной сети Instagram в сетку секции CTA (сетка возвращается к 4 карточкам: Telegram, YouTube, TikTok, Instagram).
2. **Замена надписей на Бренд-Логотипы:** Отказ от текстовых надписей "Канал 01/02..." в пользу аккуратных векторных SVG-логотипов платформ.
3. **Отладка и Дебаг SideRays:** Устранение проблемы с невидимостью WebGL-эффекта SideRays на странице.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Сетка 4-х Карточек и Бренд-Логотипы (`.cta-socials-grid`)

- **Разметка сетки:** `display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%`.
- **Замена "Канал" ➔ SVG Логотипы:**
  - В шапке каждого блока надпись "Канал" заменяется на векторный SVG-логотип высотой `24px` (`.social-brand-icon`).

#### **Матрица 4-х платформ:**

| Платформа | Частота | SVG Логотип | Акцентный цвет (`--card-accent`) | Текст кнопки |
| :--- | :--- | :--- | :--- | :--- |
| **TELEGRAM** | `FREQ // 433.075 MHz` | Telegram SVG | `#24A1DE` | `Открыть оперативный канал` |
| **YOUTUBE** | `FREQ // 868.100 MHz` | YouTube SVG | `#FF0000` | `Смотреть архивы боев` |
| **TIKTOK** | `FREQ // 915.200 MHz` | TikTok SVG | `#00F2FE` | `Клипы и хайлайты` |
| **INSTAGRAM** | `FREQ // 108.000 MHz` | Instagram SVG | `#E1306C` | `Истории и бэкстейдж` |

---

### 2.2. Отладка и Инженерный Дебаг WebGL SideRays (Устранение проблемы отображения)

#### **Причины, почему SideRays не отображался на странице:**
1. **Нулевой размер Canvas:** Отсутствие явной подгонки высоты/ширины `renderer.setSize(width, height)`.
2. **Перекрытие слоев:** Ошибки `z-index` или `display: none` у контейнера `.cta-siderays-wrapper`.
3. **Неинициализированный контекст `ogl`:** Отсутствие флага `alpha: true` или сбой в шейдерном цикле `requestAnimationFrame`.

#### **Пошаговое решение для устранения проблемы в `src/scripts/side-rays.js`:**

```javascript
// 1. Инициализация Renderer с alpha-каналом
const renderer = new Renderer({
  canvas: canvasElement,
  alpha: true,
  dpr: Math.min(window.devicePixelRatio, 2)
});

// 2. Явный ресайз по габаритам секции #cta
function resize() {
  const width = ctaContainer.clientWidth;
  const height = ctaContainer.clientHeight;
  renderer.setSize(width, height);
  program.uniforms.uResolution.value.set(width, height);
}

// 3. Запуск рендер-петли после загрузки DOM
window.addEventListener('resize', resize);
resize();

function update(t) {
  program.uniforms.uTime.value = t * 0.001;
  renderer.render({ scene, camera });
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
```

#### **CSS Защита контейнера (`src/styles/socials.css`):**
```css
.cta-siderays-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1; /* Обязательно под контентом z-index: 2 */
}

.cta-side-rays-canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Карточка Instagram добавлена 4-м элементом сетки с акцентом `#E1306C`.
- [ ] Текстовые надписи "Канал 01/02..." заменены на SVG-логотипы брендов.
- [ ] Проведен дебаг `side-rays.js`: Canvas явно масштабируется под `clientWidth`/`clientHeight` секции `#cta`.
- [ ] Эффект SideRays корректно отображается и анимируется на фоновом слое `z-index: 1`.
