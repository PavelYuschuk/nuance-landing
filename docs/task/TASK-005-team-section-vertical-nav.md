# TASK-005: Рефакторинг Секции "3.4. Команда" (Team Character Selector Spec)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Reference:** Marvel Avengers Character Roster UI (`Temp/References/3.jpg`)

---

## 1. Контекст и Цель Модификации
Преобразование секции "3.4. Команда" под интерфейсную модель выбора персонажа (Character Selection Roster) на основе референса `3.jpg`:
1. Внедрение левой вертикальной навигационной панели с карточками-аватарами игроков на серхом фоне (`#1A2230` / `rgba(20, 28, 41, 0.8)`).
2. Подсветка активного игрока с использованием токенов персональных акцентных цветов (`#C1FF00`, `#00E5FF`, `#FFC107`).
3. Синхронизация кликов по карточкам и горизонтального/вертикального прогресса Sticky-скролла по аналогии с блоком `3.3. Генезис` (`height: 300vh; position: sticky; top: 0`).

Все остальные глобальные токены остаются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Сетка и Архитектура (Grid & Layout)
- **Контейнер Sticky-секции (`.team-sticky-section`):**
  - `height: 300vh; position: relative` (Паттерн Sticky Scroll 3 слоев).
- **Фиксированный Viewport (`.team-sticky-viewport`):**
  - `position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; align-items: center`.
  - `padding: 64px 32px 32px 32px`.
- **12-Колоночная Архитектурная Матрица (`.grid-12`):**
  - **Зона 1: Левая вертикальная навигация (`.col-3` / `.team-roster-nav`):**
    - `display: flex; flex-direction: column; gap: 16px; justify-content: center`.
    - 3 карточки аватаров: Presa4ek (Игрок 0), Art1zi (Игрок 1), Matvi4 (Игрок 2).
  - **Зона 2: Центральный текстовый блок (`.col-4` / `.team-info-panel`):**
    - `display: flex; flex-direction: column; justify-content: center; text-align: left`.
    - Имя игрока H2, тактический профиль P, статус в команде.
  - **Зона 3: Правый персональный арт/иллюстрация (`.col-5` / `.team-portrait-wrapper`):**
    - Крупное вертикальное изображение во весь рост (`height: min(80vh, 700px); object-fit: contain`).

---

### 2.2. Левая Навигационная Панель Игроков (`.team-roster-nav`)

#### Элемент карточки-аватара (`.roster-card`):**
- **Размеры и Геометрия:**
  - `width: 100%; height: 80px`.
  - `display: flex; align-items: center; gap: 16px; padding: 12px 16px`.
  - `border-radius: 8px; position: relative; overflow: hidden; cursor: pointer`.
- **Цветовая палитра и Фон:**
  - Неактивная карточка: `background: rgba(20, 28, 41, 0.6); border: 1px solid rgba(39, 53, 77, 0.4)`.
  - Превью аватара: серый подслой `background: #1A2230`, `filter: grayscale(100%) contrast(1.2); opacity: 0.5`.
  - Имя игрока: `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: 1.1rem`, `color: #888888`.
- **Состояние активности (`.roster-card.active`):**
  - Превью аватара: `filter: grayscale(0%) contrast(1); opacity: 1`.
  - Фон карточки: `background: rgba(20, 28, 41, 0.9)`.
  - Имя игрока: `color: #FFFFFF`.
  - **Персональный неоновый индикатор (`border-left` + свечение):**
    - Presa4ek: `border-left: 4px solid #C1FF00; box-shadow: inset 4px 0 12px rgba(193, 255, 0, 0.2)`.
    - Art1zi: `border-left: 4px solid #00E5FF; box-shadow: inset 4px 0 12px rgba(0, 229, 255, 0.2)`.
    - Matvi4: `border-left: 4px solid #FFC107; box-shadow: inset 4px 0 12px rgba(255, 193, 7, 0.2)`.

---

### 2.3. Механика Скролла и Интерактивности (`src/scripts/team-scroll.js`)
- **Скролл-синхронизация (Sticky Scroll parity with 3.3):**
  - При прокрутке секции `#team` (300vh) вычисляется сдвиг от `0%` до `100%`.
  - Слой 0 (Presa4ek): от 0% до 33.3%.
  - Слой 1 (Art1zi): от 33.3% до 66.6%.
  - Слой 2 (Matvi4): от 66.6% до 100%.
- **Клик-навигация (Click Handler):**
  - При клике на любую из 3-х карточек `.roster-card` выполняется скролл к стартовой позиции соответствующего экрана с помощью Lenis Smooth Scroll:
    ```javascript
    const targetScrollY = teamSectionTop + (playerIndex * viewportHeight);
    lenis.scrollTo(targetScrollY, { duration: 0.8 });
    ```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Секция Команда переведена на паттерн Sticky Scroll (300vh).
- [ ] Слева расположена вертикальная навигация с 3 аватарами на сером фоне (`#1A2230`).
- [ ] Активная карточка подсвечивается финменным акцентным цветом игрока.
- [ ] Клик по аватарке перематывает скролл на нужного игрока.
- [ ] Контент выстроен по 12-колоночной сетке (`col-3` навигация, `col-4` описание, `col-5` арт).
