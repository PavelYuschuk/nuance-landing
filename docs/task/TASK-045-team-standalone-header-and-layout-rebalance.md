# TASK-045: Автономный Заголовок «КОМАНДА», Центровка Ростера (Zone 3) и Смещение Zone 4

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-043 (`docs/task/TASK-043-team-roster-header-and-depth-layering.md`)

---

## 1. Контекст и Инженерная Задача
1. **Размер шрифта «КОМАНДА» 1 в 1 как «О нас»:**  
   Установка абсолютной идентичности размера шрифта заголовка `КОМАНДА` с заголовком `О нас` из секции 3.3: `clamp(2.2rem, 5vw, 4.0rem)`.
2. **Полное разделение структуры (Автономный подблок):**  
   Заголовок `КОМАНДА` полностью извлекается из `Zone 3` и выносится в самостоятельный автономный подблок верхнего уровня (`.team-header-subblock`), точно так же, как `.about-header-subblock` в блоке «О нас». Они больше не связаны в одну DOM-группу.
3. **Возврат центровки Zone 3:**  
   Карточки вертикального ростера (`Zone 3: Left Vertical Roster Navigation`) центрируются по вертикали и горизонтали, как было изначально.
4. **Ребаланс Zone 4 (Center Info Panel):**  
   - Ширина панели увеличивается на **+5%**.
   - Панель смещается вниз, располагаясь строго ниже уровня нового подблока «КОМАНДА».
   - Увеличивается горизонтальный отступ слева от ростера (`Zone 3`).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Автономная Разметка DOM (`index.html`)

Заголовок «КОМАНДА» выносится на один уровень с сеткой, находясь перед ней:

```html
<!-- 3.4. Team Character Selector Section -->
<section id="team" class="team-sticky-section">
  <div class="team-sticky-viewport">
    <div class="container team-screen-container">
      
      <!-- 1. ОТДЕЛЬНЫЙ АВТОНОМНЫЙ ЛЕВООРИЕНТИРОВАННЫЙ ПОДБЛОК (ВНЕ ZONE 3) -->
      <div class="team-header-subblock section-header-subblock">
        <h2 class="team-main-title">КОМАНДА</h2>
      </div>

      <!-- 2. ОСНОВНАЯ СЕТКА СЛОЕВ (ZONE 3, ZONE 4, ZONE 1) -->
      <div class="grid-12 team-main-grid">
        
        <!-- Zone 3: Left Vertical Roster Navigation (Автономная центровка) -->
        <div class="col-3 team-zone-3">
          <div class="team-roster-nav">
            <div class="roster-card active" data-player-id="0">...</div>
            <div class="roster-card" data-player-id="1">...</div>
            <div class="roster-card" data-player-id="2">...</div>
          </div>
        </div>

        <!-- Zone 4: Center Info Panel (+5% ширина, смещение вниз, отступ слева) -->
        <div class="col-5 team-zone-4 team-info-panel">
          ...
        </div>

        <!-- Zone 1: Character Portrait PNG Layer -->
        <div class="col-4 team-zone-1">
          ...
        </div>

      </div>

    </div>
  </div>
</section>
```

---

### 2.2. Стилизация Заголовка «КОМАНДА» (1 в 1 с «О нас») (`src/styles/team.css`)

```css
/* Автономный подблок вверху контейнера */
.team-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: clamp(20px, 2.5vh, 32px);
  width: 100%;
  align-self: flex-start;
  z-index: 5;
}

/* Размер шрифта строго идентичен .about-main-title из секции 3.3 */
.team-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 5vw, 4.0rem); /* 1 в 1 как "О нас" */
  text-transform: uppercase;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  line-height: 1.05;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}
```

---

### 2.3. Центровка Zone 3 (Left Vertical Roster Navigation)

Карточки ростера избавлены от жесткой привязки к заголовку и центрируются внутри колонки:

```css
/* Zone 3: Отцентрована внутри своей колонки */
.team-zone-3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Центровка по горизонту */
  height: 100%;
  z-index: 4;
}

.team-roster-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 326px;
  margin: auto 0; /* Центровка по вертикали */
}
```

---

### 2.4. Ребаланс Zone 4: +5% Ширины, Смещение Вниз и Увеличенный Отступ

```css
/* Zone 4: Center Info Panel */
.team-zone-4,
.team-info-panel {
  position: relative;
  z-index: 5;
  overflow: visible;

  /* 1. Растягивание ширины на 5% */
  width: 105%;
  max-width: 505px; /* Было 480px -> увеличено на 5% */

  /* 2. Увеличенный отступ от ростера (Zone 3) */
  margin-left: clamp(24px, 2.5vw, 40px);
  padding-left: 8px;

  /* 3. Смещение вниз под уровень заголовка "КОМАНДА" */
  margin-top: clamp(16px, 2vh, 28px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Размер текста «КОМАНДА» равен размеру «О нас» (`clamp(2.2rem, 5vw, 4.0rem)`).
- [x] Заголовок «КОМАНДА» вынесен в отдельный верхний подблок `.team-header-subblock` и не связан с `Zone 3`.
- [x] Карточкам `Zone 3` возвращена чистая центровка внутри своей колонки.
- [x] Информационная панель `Zone 4` расширена на 5% (`max-width: 505px`).
- [x] Панель `Zone 4` смещена вниз (ниже горизонтального уровня слова «КОМАНДА») и имеет увеличенный отступ от ростера `Zone 3`.
- [x] Все элементы гармонично размещаются в экране 100vh на Full HD и 2K мониторах.
