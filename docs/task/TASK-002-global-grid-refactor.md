# TASK-002: Модернизация Глобальной Инженерной Сетки (Global Layout Grid Refactor)

**Status:** DONE  
**Target File(s):** `src/styles/variables.css`, `src/styles/grid.css`  
**Reference:** Website Layout Grid Pocket Guide (Aniket Jain / Industry Responsive Standards)

---

## 1. Контекст и Цель
Обновление и стандартизация глобальной адаптивной сетки (Layout Grid System) бренда NUANCE на основе принципов 8pt/4pt пространственного ритма, гибких брекпоинтов и расширенной матрицы 12-колоночной сетки. Все остальные цветовые токены и визуальные блоки остаются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Матрица Брекпоинтов и Параметры Сетки (Breakpoints & Columns)

| Разрешение | Колонки (`--grid-columns`) | Отступ контейнера (`--container-padding`) | Межколоночный gap (`--grid-gap`) | Max Width |
| :--- | :--- | :--- | :--- | :--- |
| **Ultra-Wide (> 1440px)** | 12 колонок | `48px` | `32px` | `1440px` (Centered) |
| **Desktop (1025px – 1440px)** | 12 колонок | `32px` | `24px` | `100%` (`max-width: 1440px`) |
| **Tablet (769px – 1024px)** | 8 колонок | `24px` | `20px` | `100%` |
| **Mobile (320px – 768px)** | 4 колонки (1-col stack) | `16px` | `16px` | `100%` |

---

### 2.2. Пространственные Токены Вертикального и Горизонтального Ритма (8pt Grid Tokens)
Включить в `:root` (`src/styles/variables.css`) стандартный 8px-пространственный масштаб (Spacing System):

```css
:root {
  /* Spacing Scale (8pt System) */
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  --space-4xl: 128px;

  /* Section Dynamic Rhythm */
  --section-padding-y: clamp(64px, 8vw, 120px);
}
```

---

### 2.3. Матрица Классов Колонок (`src/styles/grid.css`)

#### Desktop (12 Columns Base)
- `.col-1` ➔ `grid-column: span 1;`
- `.col-2` ➔ `grid-column: span 2;`
- `.col-3` ➔ `grid-column: span 3;` (1/4 ширины)
- `.col-4` ➔ `grid-column: span 4;` (1/3 ширины)
- `.col-5` ➔ `grid-column: span 5;` (Асимметрия/Генезис лево)
- `.col-6` ➔ `grid-column: span 6;` (1/2 ширины)
- `.col-7` ➔ `grid-column: span 7;` (Асимметрия/Генезис право)
- `.col-8` ➔ `grid-column: span 8;` (2/3 ширины)
- `.col-9` ➔ `grid-column: span 9;`
- `.col-10` ➔ `grid-column: span 10;`
- `.col-11` ➔ `grid-column: span 11;`
- `.col-12` ➔ `grid-column: span 12;` (100% ширины)

#### Tablet Overrides (`@media (max-width: 1024px)`) — 8 Columns Grid
- `.col-5`, `.col-7` ➔ `grid-column: span 4;` (Равный 4/4 сплит)
- `.col-6` ➔ `grid-column: span 8;` (100% ширины на планшете)
- `.col-4`, `.col-8` ➔ `grid-column: span 8;` (Переход в 1-колоночный стек)

#### Mobile Overrides (`@media (max-width: 768px)`) — 4 Columns / Single Stack Grid
- `.grid-12` ➔ `grid-template-columns: repeat(4, 1fr); gap: var(--space-sm);`
- Все `.col-1` ... `.col-12` ➔ `grid-column: span 4;` (100% ширины)

---

### 2.4. Инженерный Отладочный Слой (HUD Grid Overlay)
Для точности верстки добавить отладочный утилитарный класс фона:

```css
.grid-debug-overlay {
  background-image: linear-gradient(
    to right,
    rgba(0, 229, 255, 0.05) var(--grid-gap),
    transparent var(--grid-gap)
  );
  background-size: calc((100% + var(--grid-gap)) / var(--grid-columns)) 100%;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Переменные `--space-*` добавлены в `variables.css`.
- [ ] Параметры `--grid-gap` и `--container-padding` масштабируются по брекпоинтам (Desktop 32px/24px ➔ Tablet 24px/20px ➔ Mobile 16px/16px).
- [ ] Все спаны `.col-1` – `.col-12` прописаны в `grid.css`.
- [ ] Сетка плавно перестраивается без переполнения контента (Overflow-x).
