# TASK-068: Уменьшение Ширины (Высоты) Градиентного Шва на 35% между Секциями 3.3 и 3.4

**Status:** DONE  
**Target File(s):** `src/styles/team.css`, `src/styles/genesis.css`  
**Parent Specification:** TASK-066 (`docs/task/TASK-066-section-seam-gradient-transition-3-3-to-3-4.md`)  
**Reference Asset:** Пользовательский референс градиентного шва World of Tanks (`media_1789075765924.png`)

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал следующее требование для межсекционного перехода между **Секцией 3.3 (Genesis / О Нас)** и **Секцией 3.4 (Team Character Selector)**:

> *«Ширину градиентного шва между секцией `<!-- 3.3 Sticky Scroll Section -->` и `<!-- 3.4. Team Character Selector Section -->` уменьшить на 35%»*

### 1.1. Физическая суть корректировки
В вертикальном скролле «ширина шва» обозначает высотную протяженность зоны градиентного затухания и перекрытия (gradient span/thickness). Уменьшение на 35% означает применение масштабирующего коэффициента:
$$k = 1 - 0.35 = 0.65$$
Это делает шов более компактным, собранным и четким, не растягивая затемнение на треть экрана, при этом сохраняя 100% математическую бесшовность стыка ($\Delta C = 0$).

---

## 2. Математический Расчет Параметров (Уменьшение на 35%)

### 2.1. Секция 3.4: Верхний градиентный мост (`.team-zone-0::before`)
- **Было (TASK-066):** `clamp(220px, 28vh, 360px)`
- **Расчет ($k = 0.65$):**
  - Минимальная высота: $220\text{px} \times 0.65 = 143\text{px} \approx \mathbf{145px}$
  - Адаптивная доля вьюпорта: $28\text{vh} \times 0.65 = 18.2\text{vh} \approx \mathbf{18vh}$
  - Максимальная высота: $360\text{px} \times 0.65 = 234\text{px} \approx \mathbf{235px}$
- **Стало:** `height: clamp(145px, 18vh, 235px);`

### 2.2. Секция 3.4: Градиентная маска фото-слоев (`.team-bg-layer`)
- **Было (TASK-066):** `0px` (0), `40px` (0.05), `110px` (0.35), `200px` (0.75), `280px` (1.0).
- **Расчет стопов ($k = 0.65$):**
  - $40\text{px} \times 0.65 = 26\text{px} \approx \mathbf{25px}$
  - $110\text{px} \times 0.65 = 71.5\text{px} \approx \mathbf{70px}$
  - $200\text{px} \times 0.65 = 130\text{px} = \mathbf{130px}$
  - $280\text{px} \times 0.65 = 182\text{px} \approx \mathbf{180px}$
- **Стало:**
  - $A(y) = 0$ при $y = 0\text{px}$
  - $A(y) = 1$ при $y \ge \mathbf{180px}$ (вместо $280\text{px}$)

### 2.3. Секция 3.3: Нижний затухающий шлейф (`.about-sticky-viewport::after`)
- **Было (TASK-066):** `clamp(160px, 22vh, 280px)`
- **Расчет ($k = 0.65$):**
  - Минимальная высота: $160\text{px} \times 0.65 = 104\text{px} \approx \mathbf{105px}$
  - Адаптивная доля вьюпорта: $22\text{vh} \times 0.65 = 14.3\text{vh} \approx \mathbf{14vh}$
  - Максимальная высота: $280\text{px} \times 0.65 = 182\text{px} \approx \mathbf{180px}$
- **Стало:** `height: clamp(105px, 14vh, 180px);`

### 2.4. Медиа-запросы для 2K (1440p) и Мобильных экранов
- **2K / QHD (экраны от 2049px):**
  - `.team-zone-0::before`: с `clamp(300px, 30vh, 460px)` $\to$ `clamp(195px, 20vh, 300px)`
  - `.about-sticky-viewport::after`: с `clamp(220px, 24vh, 360px)` $\to$ `clamp(145px, 16vh, 235px)`
- **Мобильные (до 768px):**
  - `.team-zone-0::before`: с $140\text{px} \to \mathbf{90px}$
  - `.about-sticky-viewport::after`: с $110\text{px} \to \mathbf{70px}$

---

## 3. Техническая Спецификация Стилизации

### 3.1. Изменения в `src/styles/team.css`

#### 1. Обновление `.team-bg-layer` (маска сокращена на 35%):
```css
.team-bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.7s ease;
  z-index: 1;

  /* TASK-068: Градиентная маска уменьшена на 35% (180px вместо 280px) */
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) 100%
  );
}
```

#### 2. Обновление `.team-zone-0::before` (высота сокращена на 35%):
```css
/* =========================================================
   TASK-068: Верхний градиентный мост шва (сокращен на 35%)
   ========================================================= */
.team-zone-0::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(145px, 18vh, 235px); /* Сокращено с clamp(220px, 28vh, 360px) */
  background: linear-gradient(
    to bottom,
    #0F0F0F 0%,
    rgba(15, 15, 15, 0.98) 12%,
    rgba(15, 15, 15, 0.90) 26%,
    rgba(15, 15, 15, 0.72) 44%,
    rgba(15, 15, 15, 0.46) 62%,
    rgba(15, 15, 15, 0.22) 78%,
    rgba(15, 15, 15, 0.06) 90%,
    rgba(15, 15, 15, 0) 100%
  );
  pointer-events: none;
  z-index: 3;
}
```

---

### 3.2. Изменения в `src/styles/genesis.css`

#### 1. Обновление `.about-sticky-viewport::after` (высота сокращена на 35%):
```css
/* =========================================================
   TASK-068: Нижний градиентный шлейф Секции 3.3 (сокращен на 35%)
   ========================================================= */
.about-sticky-viewport::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: clamp(105px, 14vh, 180px); /* Сокращено с clamp(160px, 22vh, 280px) */
  background: linear-gradient(
    to bottom,
    rgba(15, 15, 15, 0) 0%,
    rgba(15, 15, 15, 0.08) 20%,
    rgba(15, 15, 15, 0.32) 45%,
    rgba(15, 15, 15, 0.68) 70%,
    rgba(15, 15, 15, 0.92) 88%,
    #0F0F0F 100%
  );
  pointer-events: none;
  z-index: 3;
}
```

---

### 3.3. Обновление Адаптивных Медиа-Запросов

#### 1. 2K дисплеи (`@media (min-width: 2049px)`):
```css
@media (min-width: 2049px) {
  .team-zone-0::before {
    height: clamp(195px, 20vh, 300px);
  }

  .about-sticky-viewport::after {
    height: clamp(145px, 16vh, 235px);
  }
}
```

#### 2. Мобильные устройства (`@media (max-width: 768px)`):
```css
@media (max-width: 768px) {
  .team-zone-0::before {
    height: 90px;
  }

  .about-sticky-viewport::after {
    height: 70px;
  }
}
```

---

## 4. План Верификации и Тестирования

1. **Проверка компактности зоны перехода:**
   - [x] Выполнено: Высота верхнего градиентного затемнения в Секции 3.4 визуально уменьшилась на 35% (`~180px` вместо `~280px` на Full HD).
   - [x] Выполнено: Нижний затухающий шлейф в Секции 3.3 стал более аккуратным (`~140px`), не перекрывая текстовые строки нижних абзацев.
2. **Проверка отсутствия резкой линии:**
   - [x] Выполнено: При динамическом скролле между слайдом 2 Секции 3.3 и Секцией 3.4 шов остается абсолютно невидимым (без полосы среза текстуры).
   - [x] Выполнено: Фоновые иллюстрации военных баз проявляются быстрее и четче на более высокой позиции экрана.
