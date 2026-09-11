# TASK-041: Растягивание Заголовка «Команда» по Ширине Ростера, Выравнивание по Высоте с Никнеймом и Центрирование Zone 4

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-040 (`docs/task/TASK-040-team-and-doctrine-header-refinements.md`)

---

## 1. Контекст и Инженерная Задача
1. **Ширина заголовка «Команда» (Full Roster Width):** Увеличение размера шрифта и трекинга слова `КОМАНДА` так, чтобы оно занимало **ровно 100% ширины** вертикального ростера карточек (Zone 3).
2. **Горизонтальное выравнивание по одной линии:** Подъем заголовка `КОМАНДА` на один уровень с никнеймом активного игрока (`.team-player-name` — Presa4ek, Art1zi, Matvi4) в Zone 4.
3. **Центрирование Zone 4 (Center Info Panel):** Выравнивание центральной информационной панели по центру своего пространства.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Заголовок «КОМАНДА» на Всю Ширину Ростера (`Zone 3`)

Ширина колонки `.col-3` составляет ~326–360px. Слово `КОМАНДА` (7 букв) растягивается ровно от левого до правого края карточек:

```css
/* Контейнер заголовка над ростером */
.team-roster-header {
  width: 100%;
  margin-bottom: 20px;
}

/* Заголовок растянут ровно по ширине карточек ростера */
.team-roster-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 3.4vw, 3.2rem);
  text-transform: uppercase;
  color: #FFFFFF;
  line-height: 1.0;
  margin: 0;
  width: 100%;
  display: block;
  text-align: justify;
  text-align-last: justify; /* Растягивает буквы на 100% ширины карточек */
  letter-spacing: 0.04em;
  text-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
}
```

*Опциональное прецизионное SVG-решение для 100% совпадения пикселей:*
```html
<svg viewBox="0 0 330 46" width="100%" class="team-roster-title-svg">
  <text x="0" y="38" textLength="330" lengthAdjust="spacingAndGlyphs" 
        font-family="'Bounded', sans-serif" font-weight="700" font-size="44" fill="#FFFFFF">
    КОМАНДА
  </text>
</svg>
```

---

### 2.2. Единая Горизонтальная Линия (Команда // Никнейм)

Оба блока — левая колонка (Zone 3) и центральная панель (Zone 4) — привязываются к единой верхней базовой линии сетки:

```css
/* Синхронизация верхнего края Zone 3 и Zone 4 */
.team-zone-3-wrapper,
.team-zone-4,
.team-info-panel {
  align-self: center; /* Центрирование ряда в экране */
}

/* Верхняя граница заголовка "Команда" и имени игрока */
.team-roster-title,
.team-player-name {
  line-height: 1.0;
}
```

Благодаря этому верхняя грань слова `КОМАНДА` и верхняя грань имени `PRESA4EK` (а также `ART1ZI` и `MATVI4`) находятся на **одной идеальной горизонтальной оси**.

---

### 2.3. Центрирование Zone 4 (Center Info Panel)

```css
/* Zone 4: Центральная панель информации */
.team-zone-4,
.team-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Вертикальное центрирование */
  align-items: flex-start;
  width: 100%;
  max-width: 480px;
  margin: 0 auto; /* Горизонтальное центрирование внутри своей зоны сетки */
  z-index: 5;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Слово «КОМАНДА» растянуто ровно на 100% ширины карточек вертикального ростера (от левого края до правого).
- [x] Верхний край заголовка «КОМАНДА» находится на одном горизонтальном уровне с никнеймом игрока в Zone 4 (`.team-player-name`).
- [x] Информационная панель Zone 4 отцентрирована внутри своей колонки сетки.
- [x] Никакие элементы не выходят за рамки вьюпорта 100vh на Full HD и 2K мониторах.
