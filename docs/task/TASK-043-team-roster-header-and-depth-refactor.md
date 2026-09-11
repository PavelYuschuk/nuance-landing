# TASK-043: Рефакторинг Композиции Секции "3.4. Команда" (Автономный Заголовок, Наложение Zone 4 и Увеличение Портретов Zone 1)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-040, TASK-041

---

## 1. Контекст и Цель Модификации
1. **Автономный подблок «Команда» и центровка ростера (Zone 3):**
   - Вынести заголовок `Команда` в самостоятельный подблок верхнего уровня контейнера (по аналогии с `.about-header-subblock` в секции «О нас»), сохранив его текущие физические координаты слева вверху.
   - Вернуть вертикальное центрирование самому блоку 3-х карточек ростера (**Zone 3: Left Vertical Roster Navigation**).
2. **Расширение Zone 4 (Center Info Panel) на +15% и наложение на Zone 1:**
   - Увеличить ширину инфо-панели на 15% влево.
   - Закрепить слойность `z-index: 5`, позволяя информационной панели заходить внахлест поверх портрета бойца (Zone 1).
3. **Увеличение площади портретов (Zone 1) на +35% и нижнее градиентное затемнение:**
   - Увеличить габариты зоны иллюстрации персонажа на 35%.
   - Добавить внизу портрета мягкий затухающий градиент в темный фон (аналогично карточкам ростера), чтобы нижняя часть фигуры бойца бесшовно растворялась в полу.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Автономный Подблок «Команда» и Центровка Ростера (`Zone 3`)

#### **Структура разметки (`index.html`):**
```html
<div class="container team-screen-container">
  
  <!-- 1. Автономный подблок заголовка (по аналогии с 3.3 "О нас") -->
  <div class="team-header-subblock section-header-subblock">
    <h2 class="section-main-title team-main-title">Команда</h2>
  </div>

  <!-- 2. Сетка слоев секции Команды -->
  <div class="grid-12 team-main-grid">
    
    <!-- Zone 3: Left Vertical Roster Navigation (Вертикально отцентрован) -->
    <div class="col-3 team-zone-3">
      <div class="team-roster-nav">
        <div class="roster-card active" data-player="0">...</div>
        <div class="roster-card" data-player="1">...</div>
        <div class="roster-card" data-player="2">...</div>
      </div>
    </div>

    <!-- Zone 4: Center Info Panel (Наложение поверх Zone 1) -->
    <div class="col-5 team-zone-4">
      ...
    </div>

    <!-- Zone 1: Character Portrait PNG Layer (+35% масштаб) -->
    <div class="col-4 team-zone-1">
      ...
    </div>

  </div>
</div>
```

#### **Стилизация заголовка и центровки Zone 3 (`src/styles/team.css`):**
```css
/* Автономный подблок строго на своем месте вверху слева */
.team-header-subblock {
  position: absolute;
  top: calc(var(--header-height) + 24px);
  left: var(--container-padding);
  z-index: 6;
  margin: 0;
  width: auto;
}

.team-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 3.2vw, 3rem);
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.0;
}

/* Zone 3: Центрирование 3-х карточек ростера по вертикали */
.team-zone-3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  z-index: 4;
}

.team-roster-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}
```

---

### 2.2. Расширение Zone 4 на +15% и Наложение Поверх Zone 1

```css
/* Zone 4: Center Info Panel */
.team-zone-4,
.team-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  
  /* РАСШИРЕНИЕ НА 15% ВЛЕВО И ВПРАВО: */
  width: 115%;
  max-width: 560px; /* Было 480px -> увеличено на ~16% */
  margin-left: -40px; /* Смещение влево */
  
  /* РАЗРЕШЕНИЕ БЫТЬ ПОВЕРХ ПОРТРЕТА ZONE 1: */
  position: relative;
  z-index: 5; /* Строго выше Zone 1 (z-index: 2) */
  pointer-events: auto;
}

/* Дополнительный контраст текста над портретом */
.team-player-name,
.team-player-role,
.player-quote,
.team-player-desc {
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.85);
}
```

---

### 2.3. Увеличение Zone 1 на +35% и Градиентное Затемнение внизу

```css
/* Zone 1: Character Portrait PNG Layer */
.team-zone-1,
.team-portrait-layer {
  position: absolute;
  right: 0;
  bottom: 0;
  /* УВЕЛИЧЕНИЕ ПЛОЩАДИ НА 35%: */
  width: clamp(520px, 48vw, 840px); /* Увеличено на ~35% */
  height: min(94vh, 1050px);
  z-index: 2; /* Под Zone 4 (z-index: 5) */
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
}

/* Само изображение персонажа */
.character-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom right;
  display: block;
}

/* ГРАДИЕНТНОЕ ЗАТЕМНЕНИЕ ВНИЗУ (как у карточек ростера):
   Мягкое растворение нижней части фигуры в темном фоне */
.team-zone-1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32%; /* 32% высоты снизу закрыто градиентной растяжкой */
  background: linear-gradient(
    to top,
    #0F0F0F 0%,
    rgba(15, 15, 15, 0.85) 30%,
    rgba(15, 15, 15, 0.4) 65%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Заголовок «Команда» вынесен в независимый верхний подблок `.team-header-subblock` и зафиксирован вверху слева.
- [x] Ростер карточек Zone 3 отцентрирован по вертикали окна просмотра.
- [x] Информационная панель Zone 4 расширена (+10% вправо/наложение) и находится поверх портрета благодаря `z-index: 5`.
- [x] Область портрета Zone 1 увеличена на всю доступную высоту до уровня заголовка h2.
- [x] Внизу портрета присутствует плавный затемняющий градиент (`.team-zone-1::after`), растворяющий фигуру бойца в темноте пола.
