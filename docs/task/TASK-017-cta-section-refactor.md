# TASK-017: Рефакторинг и Интеграция SideRays в "3.6. Call to Action"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/socials.css`, `src/scripts/side-rays.js`, `src/scripts/main.js`  
**Parent Specification:** TASK-016 (`docs/task/TASK-016-cta-socials-section-spec.md`)  
**Dependency:** `ogl` (`^1.0.11` в `package.json`)

---

## 1. Контекст и Цель Модификации
Доработка архитектуры и визуала секции "3.6. Call to Action":
1. Перевод секции на **Full Screen Viewport (100vh)**.
2. Отказ от отдельного фонового логотипа (`.cta-bg-logo` удален). Секция наследует единый глобальный фон проекта (`.global-bg`).
3. **Удаление карточки Discord:** Сетка содержит 3 оставшиеся платформы (**Telegram, YouTube, TikTok**).
4. Интеграция WebGL-эффекта **SideRays** на фоновый слой секции CTA с точными параметрами шейдера (`speed: 1`, `intensity: 2.2`, `spread: 2.6`, `opacity: 1`).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Полноэкранная Позиционирование и Слойность (Viewport & Z-Index)
- **Контейнер секции (`#cta` / `.cta-section`):**
  - `min-height: 100vh; height: 100vh; width: 100%`.
  - `display: flex; flex-direction: column; align-items: center; justify-content: center`.
  - `position: relative; overflow: hidden; background: transparent` (Наследует `.global-bg`).
- **Слойность элементов (Z-Index Stack):**
  - **Слой 1 (`z-index: 1`):** Canvas спецэффекта `.cta-siderays-wrapper` (WebGL SideRays).
  - **Слой 2 (`z-index: 2`):** Контентная область `.container` (Заголовок, Индикатор связи, 3 карточки соцсетей).

---

### 2.2. Модуль WebGL SideRays в Секции CTA

```html
<!-- Background WebGL Layer (z-index: 1) -->
<div class="cta-siderays-wrapper" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
  <canvas class="cta-side-rays-canvas"></canvas>
</div>
```

#### **Конфигурационный объект шейдера SideRays:**

```javascript
const CTA_SIDE_RAYS_CONFIG = {
  speed: 1.0,
  rayColor1: '#FCFDFF',
  rayColor2: '#94C6F9',
  intensity: 2.2,
  spread: 2.6,
  origin: 'top-right',
  tilt: 60,
  saturation: 1.6,
  blend: 1.0,
  falloff: 1.4,
  opacity: 1.0
};
```

---

### 2.3. Сетка 3-х Карточек Соцсетей (`.cta-socials-grid`)

- **Удалена карточка 01. Discord.**
- **Структура сетки (`.cta-socials-grid`):**
  - `display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; width: 100%; max-width: 1100px`.
  - **Desktop (>1024px):** 3 колонки в ряд (`repeat(3, 1fr)` / `.col-4` каждая).
  - **Tablet (769px – 1024px):** 3 колонки в ряд или 2+1 layout.
  - **Mobile (≤768px):** 1 колонка stack (`repeat(1, 1fr)`).

#### **3 Оставшиеся платформы:**
1. **TELEGRAM (Канал 01):** `FREQ // 433.075 MHz` *(Акцент `#24A1DE`)* — *«Открыть оперативный канал»*
2. **YOUTUBE (Канал 02):** `FREQ // 868.100 MHz` *(Акцент `#FF0000`)* — *«Смотреть архивы боев»*
3. **TIKTOK (Канал 03):** `FREQ // 915.200 MHz` *(Акцент `#00F2FE`)* — *«Клипы и хайлайты»*

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Секция `#cta` занимает 100% высоты экрана (`min-height: 100vh`).
- [ ] Фоновый логотип `.cta-bg-logo` удален; секция прозрачна поверх `.global-bg`.
- [ ] Карточка Discord удалена; в сетке осталось 3 карточки (Telegram, YouTube, TikTok).
- [ ] Интегрирован WebGL SideRays на фоновый слой (`z-index: 1`) с лучами из правого верхнего угла.
