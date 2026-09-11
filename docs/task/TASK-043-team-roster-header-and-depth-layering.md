# TASK-043: Рефакторинг Заголовка «Команда», Расширение Zone 4 (+10% Вправо) и Высота Портрета (Zone 1)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-040, TASK-041

---

## 1. Контекст и Цель Модификации
1. **Зона 3 (Левый ростер и Заголовок):**
   - Возврат вертикальной центровки для 3-х карточек навигации ростера (`.team-roster-nav`).
   - Вынос заголовка `Команда` в самостоятельный независимый подблок (`.team-header-subblock`) по аналогии с подблоком «О нас» из секции 3.3.
   - Растягивание шрифта слова `КОМАНДА` ровно по ширине карточек ростера (`Zone 3`).
   - Размещение подблока `Команда` строго на одном горизонтальном уровне с именем игрока `<h2 class="team-player-name">` из Zone 4.
2. **Зона 4 (Центральная инфо-панель):**
   - Увеличение ширины блока на **+10% вправо** без смещения его левой границы.
   - Разрешение слою Zone 4 (`z-index: 5`) свободно залезать поверх силуэта персонажа в `Zone 1` (`z-index: 2`).
3. **Зона 1 (Слой портрета PNG):**
   - Увеличение области портрета на всю доступную высоту: от нижнего края экрана (`bottom: 0`) вверх ровно до уровня заголовка `<h2 class="team-player-name">`.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Вынос и Позиционирование Заголовка «Команда» (`index.html` & `src/styles/team.css`)

#### **Разметка (`index.html`):**
Заголовок выносится из группы карточек и размещается отдельным подблоком, привязанным к верхнему уровню контента:

```html
<!-- index.html: Секция 3.4 Команда -->
<div class="team-screen-container">
  
  <!-- РЯД 1: Линия заголовков (Команда // Имя Игрока) на одном горизонтальном уровне -->
  <div class="team-top-headers-row">
    <!-- Левый подблок (над Zone 3): Растянут по ширине ростера -->
    <div class="team-header-subblock">
      <h2 class="team-main-title">КОМАНДА</h2>
    </div>

    <!-- Заголовочная зона инфо-панели (Zone 4) -->
    <div class="team-player-header-anchor">
      <!-- Имя игрока выровнено по этой же горизонтальной базовой линии -->
    </div>
  </div>

  <!-- РЯД 2: Основная 12-колоночная сетка со слоями (Zone 3, Zone 4, Zone 1) -->
  <div class="grid-12 team-main-grid">
    
    <!-- Zone 3: Left Vertical Roster Navigation (Возвращена центровка) -->
    <div class="col-3 team-zone-3">
      <div class="team-roster-nav">
        <div class="roster-card active" data-player="0">...</div>
        <div class="roster-card" data-player="1">...</div>
        <div class="roster-card" data-player="2">...</div>
      </div>
    </div>

    <!-- Zone 4: Center Info Panel (+10% ширина вправо, z-index: 5) -->
    <div class="col-5 team-zone-4 team-info-panel">
      ...
    </div>

    <!-- Zone 1: Character Portrait PNG Layer (На всю высоту до уровня имени) -->
    <div class="col-4 team-zone-1">
      <div class="team-portrait-wrapper">
        <img src="/assets/images/PORTRAIT PNG Presa4ek.png" alt="" class="player-portrait-img active" data-player="0" />
        <img src="/assets/images/PORTRAIT PNG Art1zi.png" alt="" class="player-portrait-img" data-player="1" />
        <img src="/assets/images/PORTRAIT PNG Matvi4.png" alt="" class="player-portrait-img" data-player="2" />
      </div>
    </div>

  </div>
</div>
```

---

### 2.2. Стилизация Заголовка и Центровка Ростера (`src/styles/team.css`)

```css
/* Возврат вертикальной центровки карточек ростера */
.team-zone-3 {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Центровка карточек */
  align-items: flex-start;
  height: 100%;
  z-index: 4;
}

.team-roster-nav {
  margin: auto 0; /* Авто-центровка по вертикали */
  width: 100%;
}

/* Подблок "Команда" на уровне с h2.team-player-name */
.team-header-subblock {
  width: 100%;
  max-width: 326px; /* Ширина ростера col-3 */
  margin-bottom: 24px;
}

/* Шрифт Bounded Bold растянут ровно по ширине ростера */
.team-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2.3rem, 3.6vw, 3.3rem);
  text-transform: uppercase;
  color: #FFFFFF;
  line-height: 1.0;
  margin: 0;
  width: 100%;
  display: block;
  text-align: justify;
  text-align-last: justify;
  letter-spacing: 0.05em;
  text-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
}
```

---

### 2.3. Расширение Zone 4 на +10% Вправо и Наложение Слоев (`src/styles/team.css`)

```css
/* =========================================================
   Zone 4: +10% вправо без смещения влево + наложение на Zone 1
   ========================================================= */

.team-zone-4,
.team-info-panel {
  position: relative;
  z-index: 5; /* Гарантированно поверх Zone 1 (портрет z-index: 2) */
  overflow: visible; /* Разрешение вылезать за границы */
  
  /* Базовая ширина + 10% вправо: */
  width: 110%;
  max-width: 530px; /* Увеличено на 10% (было 480px) */
  margin-right: -10%; /* Вылет в правую сторону на слой портрета */
  
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Обеспечение читаемости текста поверх иллюстрации */
.player-quote,
.team-player-desc,
.team-stats-list {
  position: relative;
  z-index: 5;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(15, 15, 15, 0.95);
}
```

---

### 2.4. Калибровка Высоты Портрета Zone 1 (`src/styles/team.css`)

Область портрета занимает всю высоту экрана от самого низа (`bottom: 0`) ровно до горизонтального уровня имени `<h2 class="team-player-name">`:

```css
/* =========================================================
   Zone 1: Портрет на всю высоту до уровня заголовка h2
   ========================================================= */

.team-zone-1 {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.team-portrait-wrapper {
  position: relative;
  width: 100%;
  /* Высота от низа до уровня h2: */
  height: calc(100vh - clamp(140px, 18vh, 190px));
  max-height: 920px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  bottom: 0;
}

.player-portrait-img {
  position: absolute;
  bottom: 0;
  right: 0;
  /* Верхний лимит строго по уровню h2 */
  height: 100%;
  max-height: 100%;
  width: auto;
  object-fit: contain;
  object-position: right bottom;
  pointer-events: none;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Карточкам вертикального ростера (Zone 3) возвращена вертикальная центровка по центру высоты экрана.
- [x] Заголовок `КОМАНДА` вынесен в отдельный подблок, растянут ровно по ширине карточек ростера и находится на одном горизонтальном уровне с `<h2 class="team-player-name">`.
- [x] Панель Zone 4 расширена на +10% вправо без сдвига левой стороны, элементы панели перекрывают слой портрета с `z-index: 5`.
- [x] Портрет в Zone 1 занимает всю вертикаль от самого низа экрана ровно до верхней границы заголовка `<h2 class="team-player-name">`.
