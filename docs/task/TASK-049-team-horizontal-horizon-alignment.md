# TASK-049: Единый Верхний Горизонт в Секции 3.4 (Выравнивание «Команда», Zone 4 и Zone 1 на Один Уровень)

**Status:** DONE  
**Target File(s):** `src/styles/team.css`, `index.html`  
**Parent Specification:** TASK-048 (`docs/task/TASK-048-team-panel-level-and-portrait-gradients.md`)

---

## 1. Контекст и Инженерная Задача
1. **Подъем Zone 4 на уровень подблока «КОМАНДА»:**  
   Центральная информационная панель (`Zone 4: Center Info Panel`) поднимается вверх так, чтобы имя игрока (`<h2 class="team-player-name">`) и заголовок `КОМАНДА` находились **строго на одной горизонтальной линии (Y-координате)**.
2. **Подъем Zone 1 (Портрет) на тот же уровень:**  
   Область иллюстрации персонажа (`Zone 1: Character Portrait PNG Layer`) также поднимается вверх, начинаясь от той же единой верхней границы, что и заголовок «КОМАНДА» и имя игрока в Zone 4.
3. **Единый композиционный горизонт:**  
   Все три колонки секции 3.4 (Левый заголовок, Имя персонажа по центру, Макушка силуэта справа) стартуют от единого верхнего уровня сетки.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Архитектура Единой Верхней Линии (`src/styles/team.css`)

Чтобы убрать перепад высот между подблоком заголовка и сеткой, устраняется вертикальное смещение сетки:

```css
/* =========================================================
   Единый верхний горизонт секции 3.4 (TASK-049)
   ========================================================= */

/* Контейнер экрана: выравнивание колонок от верхней границы */
.team-screen-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}

/* 1. Заголовок "КОМАНДА": зафиксирован на базовой верхней линии */
.team-header-subblock {
  width: 100%;
  max-width: 326px; /* В ширину ростера Zone 3 */
  margin-bottom: 0;
  height: 52px; /* Фиксированная высота строки 45px заголовка */
  display: flex;
  align-items: center;
}

.team-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px;
  line-height: 1.0;
  margin: 0;
  color: #FFFFFF;
}

/* 2. Основная сетка: подтянута вровень с заголовком "КОМАНДА" */
.team-main-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: flex-start; /* Старт всех трех зон строго с верхнего края */
  width: 100%;
  position: relative;
  /* Подъем сетки на высоту заголовка, чтобы Zone 4 и Zone 1 были вровень с "КОМАНДА": */
  margin-top: -52px;
}

/* Zone 3 (Левый ростер): отступ сверху, чтобы карточки не наезжали на "КОМАНДА" */
.team-zone-3 {
  padding-top: 72px; /* Пропускает заголовок "КОМАНДА" (52px + 20px отступ) */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* =========================================================
   Zone 4: ПОДЪЕМ НА ОДИН УРОВЕНЬ С "КОМАНДА"
   ========================================================= */
.team-zone-4,
.team-info-panel {
  padding-top: 0 !important;
  margin-top: 0 !important;
  position: relative;
  z-index: 5;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.team-player-header {
  margin: 0;
  padding: 0;
  height: 52px; /* Равно высоте строки заголовка "КОМАНДА" */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.team-player-name {
  font-family: var(--font-heading);
  font-size: 35px;
  line-height: 1.0;
  margin: 0;
}

/* =========================================================
   Zone 1: ПОДЪЕМ ПОРТРЕТА НА ТОТ ЖЕ УРОВЕНЬ
   ========================================================= */
.team-zone-1 {
  padding-top: 0 !important;
  margin-top: 0 !important;
  position: relative;
  z-index: 2;
  align-self: flex-start;
  height: calc(100vh - calc(var(--header-height) + 48px));
  max-height: 880px;
}

.team-portrait-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0; /* Старт от той же верхней кромки */
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.player-portrait-img {
  position: absolute;
  top: 0; /* Верхний срез поднят вровень с "КОМАНДА" и именем игрока */
  right: 0;
  height: 100%;
  max-height: 100%;
  width: auto;
  object-fit: contain;
  object-position: right top;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Верхняя кромка слова «КОМАНДА» и верхняя кромка имени игрока `<h2 class="team-player-name">` находятся строго на одной горизонтальной оси (на одном уровне).
- [x] Верхний край области портрета персонажа (`Zone 1`) поднят на этот же единый уровень.
- [x] Карточки ростера (`Zone 3`) начинаются под заголовком «КОМАНДА» с аккуратным зазором (20px) и не наезжают на текст.
- [x] На Full HD и 2K мониторах сохраняется идеальная единая горизонтальная посадка контента.
