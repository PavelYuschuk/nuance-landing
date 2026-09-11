# TASK-023: Спецификация Секции "3.5. Доктрина" и Обновление Header

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/header.css`, `src/styles/doctrine.css` (или `main.css`)  
**Parent Section:** 3.4. Team (`#team`) ➔ Новая секция 3.5. Доктрина (`#doctrine`) ➔ 3.6. Call to Action (`#cta`)

---

## 1. Контекст и Цель Модификации
1. **Обновление Header:** Переименование пункта навигации «Проекты» в **«Доктрина»** с изменением якорной ссылки с `#projects` на `#doctrine`.
2. **Создание полноэкранной Секции 3.5 «Доктрина» (`#doctrine`):**
   - Размещение сразу после секции Команда (3.4) на 100% высоты экрана (`100vh`).
   - Центрированная композиция из 3-х равномерных интерактивных карточек с закругленными углами (`border-radius: 16px`).
3. **Кинематографичный многослойный Hover-эффект:**
   - Масштабирование карточки (`scale up`).
   - Контрмасштабирование фоновой иллюстрации (`zoom out`).
   - Размытие фона (`blur`).
   - Восходящее движение заголовка снизу вверх и проявление скрытого текста доктрины.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Изменения в Header (`3.1. Header`)
- **Навигационная ссылка (`.nav-link`):**
  - **Было:** `<a href="#projects" class="nav-link">Проекты</a>`
  - **Стало:** `<a href="#doctrine" class="nav-link">Доктрина</a>`

---

### 2.2. Сетка и Архитектура Секции 3.5 «Доктрина» (`#doctrine`)
- **Контейнер секции (`#doctrine` / `.doctrine-section`):**
  - `min-height: 100vh; height: 100vh; width: 100%`.
  - `display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden`.
  - `padding: 80px 0; background: transparent; z-index: 2` (наследует `.global-bg`).
- **Заголовок блока (`.doctrine-header`):**
  - `text-align: center; margin-bottom: 48px`.
  - Заголовок H2: `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: clamp(2rem, 3.5vw, 3rem)`, Uppercase, `color: #FFFFFF`. Текст: `// ДОКТРИНА`.
- **Сетка 3-х карточек (`.doctrine-cards-grid`):**
  - `display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; width: 100%; max-width: 1240px; margin: 0 auto; justify-content: center; align-items: stretch`.
  - Desktop (>1024px): 3 колонки в ряд (`repeat(3, 1fr)`).
  - Tablet (769px – 1024px): `repeat(3, 1fr)` с уменьшением высоты карточек ИЛИ горизонтальный скролл.
  - Mobile (≤768px): 1 колонка stack (`repeat(1, 1fr)`), вертикальный ритм `gap: 20px`.

---

### 2.3. Архитектура Карточки (`.doctrine-card`)
- **Базовые габариты и геометрия:**
  - `height: clamp(420px, 55vh, 520px); width: 100%`.
  - `border-radius: 16px; overflow: hidden; position: relative; cursor: pointer`.
  - `border: 1px solid rgba(39, 53, 77, 0.6)`.
  - `transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease, box-shadow 0.5s ease`.
- **Фоновый слой изображения (`.doctrine-card-bg`):**
  - `position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1`.
  - Заглушечный градиент (плейсхолдер под фото):  
    `background: linear-gradient(135deg, #141C29 0%, #1A2230 50%, #0F0F0F 100%)`.
  - **Исходное состояние:** `transform: scale(1.18); filter: blur(0px) brightness(0.85); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease`.
- **Градиентный защитный оверлей (`.doctrine-card-overlay`):**
  - `position: absolute; inset: 0; z-index: 2; pointer-events: none`.
  - `background: linear-gradient(to top, rgba(15, 15, 15, 0.95) 0%, rgba(15, 15, 15, 0.4) 45%, transparent 100%)`.
  - `transition: background 0.5s ease`.
- **Контентный контейнер (`.doctrine-card-content`):**
  - `position: absolute; bottom: 0; left: 0; width: 100%; padding: 32px 28px; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end`.

---

### 2.4. Типографика и Микро-Взаимодействие Hover (5 Шагов Анимации)

```css
/* Базовое состояние заголовка */
.doctrine-card-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  transform: translateY(0);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

/* Базовое состояние скрытого текста */
.doctrine-card-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.6;
  color: #888888;
  margin-top: 12px;
  opacity: 0;
  max-height: 0;
  transform: translateY(20px);
  overflow: hidden;
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, max-height 0.5s ease;
}

/* =========================================================
   ИНТЕРАКТИВНЫЙ HOVER-ПАТТЕРН:
   ========================================================= */

/* 1. Карточка увеличивается в масштабе (Zoom In) */
.doctrine-card:hover {
  transform: scale(1.04);
  border-color: rgba(0, 229, 255, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 229, 255, 0.15);
}

/* 2. Иллюстрация делает Zoom Out (с 1.18 до 1.0) */
/* 3. Иллюстрация покрывается блюр-эффектом и затемняется */
.doctrine-card:hover .doctrine-card-bg {
  transform: scale(1.0);
  filter: blur(8px) brightness(0.5);
}

/* Затемняющий оверлей усиливается */
.doctrine-card:hover .doctrine-card-overlay {
  background: linear-gradient(to top, rgba(15, 15, 15, 0.98) 0%, rgba(15, 15, 15, 0.7) 60%, rgba(15, 15, 15, 0.3) 100%);
}

/* 4. Заголовок движется снизу вверх */
.doctrine-card:hover .doctrine-card-title {
  transform: translateY(-8px);
  color: var(--color-accent-2); /* #00E5FF */
}

/* 5. За заголовком проявляется текст доктрины */
.doctrine-card:hover .doctrine-card-text {
  opacity: 1;
  max-height: 180px;
  transform: translateY(0);
}
```

---

### 2.5. Пример Структуры 3-х Карточек (HTML Разметка)

```html
<section id="doctrine" class="doctrine-section">
  <div class="container">
    <div class="doctrine-header">
      <h2 class="doctrine-title">// ДОКТРИНА</h2>
    </div>

    <div class="doctrine-cards-grid">
      <!-- Карточка 1 -->
      <div class="doctrine-card">
        <div class="doctrine-card-bg"></div>
        <div class="doctrine-card-overlay"></div>
        <div class="doctrine-card-content">
          <h3 class="doctrine-card-title">01. Асимметрия</h3>
          <p class="doctrine-card-text">
            Отказ от лобовых столкновений в пользу неожиданных ударов в уязвимые точки обороны противника.
          </p>
        </div>
      </div>

      <!-- Карточка 2 -->
      <div class="doctrine-card">
        <div class="doctrine-card-bg"></div>
        <div class="doctrine-card-overlay"></div>
        <div class="doctrine-card-content">
          <h3 class="doctrine-card-title">02. Симбиоз</h3>
          <p class="doctrine-card-text">
            Слабые стороны одного бойца мгновенно и безоговорочно компенсируются агрессивной огневой мощью другого.
          </p>
        </div>
      </div>

      <!-- Карточка 3 -->
      <div class="doctrine-card">
        <div class="doctrine-card-bg"></div>
        <div class="doctrine-card-overlay"></div>
        <div class="doctrine-card-content">
          <h3 class="doctrine-card-title">03. Автономия</h3>
          <p class="doctrine-card-text">
            Способность мгновенно перехватить инициативу и вытащить безнадежный бой при потере единого центра связи.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] В шапке Header пункт "Проекты" переименован в "Доктрина" со ссылкой `#doctrine`.
- [ ] Секция `#doctrine` размещена сразу после `#team` на 100% высоты экрана (`min-height: 100vh`).
- [ ] Карточки имеют скругленные углы `16px` и равномерно распределены по центру.
- [ ] При наведении курсора отрабатывают все 5 фаз: `scale(1.04)` карточки ➔ `scale(1.0)` zoom out фона ➔ `blur(8px)` фона ➔ сдвиг заголовка вверх ➔ плавное проявление текста.
- [ ] При уходе курсора карточка плавно возвращается в исходное состояние.
