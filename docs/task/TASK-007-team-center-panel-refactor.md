# TASK-007: Рефакторинг Центральной Панели Игрока и Акцентов в "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-006 (`docs/task/TASK-006-team-roster-and-stats-refactor.md`)

---

## 1. Контекст и Цель Модификации
Доработка расположения элементов и типографики в секции "3.4. Команда":
1. Перенос затухающей неоновой линии прогресса из левого ростера в **Центральную информационную панель (Zone 2)** под цитату игрока (`<blockquote class="player-quote">`) с адаптацией ширины под контейнер.
2. Внедрение левой горизонтальной акцентной полосы активации в ростер-карточках Zone 1 при выборе персонажа.
3. Фиксированное выравнивание имени игрока (`<h2 class="team-player-name">`) по верхней границе блока.
4. Увеличение размера шрифта описания игрока до уровня параграфов Генезиса (18px) и выделение ключевого слова **«Нюанс:»** чистым белым цветом (`#FFFFFF`).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Перенос и Адаптация Линии Прогресса (Zone 2: Center Info Panel)
- **Новое размещение:** Внутри `.team-info-panel` строго под цитатой игрока (`<blockquote class="player-quote">`).
- **Спецификация индикатора (`.player-quote-progress`):**
  - `margin-top: 16px; margin-bottom: 24px`.
  - `height: 3px; width: 100%; max-width: 320px`.
  - `background: linear-gradient(to right, var(--player-accent) 0%, var(--player-accent) 50%, transparent 100%)`.
  - `transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1)`.

---

### 2.2. Горизонтальный Акцентный Индикатор Активности Карточки (Zone 1: Roster)
- **Поведение активной карточки (`.roster-card.active`):**
  - При выборе игрока у левого края карточки загорается левая маркерная полоса:
    - `border-left: 4px solid var(--player-accent)`.
    - `box-shadow: inset 4px 0 12px var(--player-accent-glow)`.
  - Акцентные цвета:
    - Presa4ek: `#C1FF00`
    - Art1zi: `#00E5FF`
    - Matvi4: `#FFC107`

---

### 2.3. Геометрия и Типографика Центральной Панели (Zone 2: Center Info Panel)
- **Имя игрока (`<h2 class="team-player-name">`):**
  - Выравнивание: Строго по верхней границе информационного блока (`margin-top: 0; align-self: flex-start`).
  - `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: clamp(2rem, 3.5vw, 3rem)`, Uppercase.
- **Описание игрока (`<p class="team-player-desc">`):**
  - `font-family: var(--font-body)` (`JetBrains Mono 400`).
  - `font-size: 1.125rem` (18px) — полностью совпадает с `<p class="genesis-paragraph">`.
  - `line-height: 1.6; color: var(--color-text-secondary)` (`#888888`).
- **Выделение маркера «Нюанс:»:**
  - В тексте описания конструкция `Нюанс:` оборачивается в `<strong class="text-highlight">Нюанс:</strong>`.
  - `color: #FFFFFF; font-weight: 700`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Затухающая неоновая полоса перенесена из карточки ростера в центральную панель под цитату `<blockquote class="player-quote">`.
- [ ] У активной карточки в левом ростере появляется четкая горизонтальная маркерная линия в цвет персонажа.
- [ ] Заголовок `h2.team-player-name` прижат к верхнему краю текстовой зоны.
- [ ] Размер шрифта описания игрока увеличен до 18px (как в Генезисе).
- [ ] Слово `Нюанс:` подсвечивается белым шрифтом `#FFFFFF`.
