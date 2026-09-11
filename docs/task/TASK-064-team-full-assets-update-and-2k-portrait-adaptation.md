# TASK-064: Обновление Ассетов (Zone 1 и Zone 3), Отключение Прозрачности Ростера, Оверлей 90% и 2K-Адаптация Портретов

**Status:** DONE  
**Target File(s):** `src/styles/team.css`, `index.html`  
**Parent Specification:** TASK-010, TASK-013, TASK-038, TASK-048, TASK-056, TASK-060, TASK-063  
**Assets Location:** `public/assets/images/`  

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал комплекс из 5 связанных задач для секции **3.4 Team Character Selector**:

1. **Обновление всех иллюстраций Zone 1 (Character Portrait PNG Layer):**
   - Пользователь загрузил новые полноразмерные арты бойцов в `public/assets/images/` (`PORTRAIT PNG Presa4ek.png`, `PORTRAIT PNG Art1zi.png`, `PORTRAIT PNG Matvi4.png`).
   - Необходимо обеспечить их корректную загрузку в разметке со сбросом кеша браузера (`?v=3`).
2. **Обновление всех иллюстраций Zone 3 (Left Vertical Roster Navigation):**
   - Пользователь обновил все 3 миниатюры карточек вертикального ростера в `public/assets/images/` (`Presa4ek SCALE Vertical Roster Navigation.png`, `Art1zi SCALE Vertical Roster Navigation.png`, `Matvi4 Vertical Roster Navigation.png`).
   - Необходимо синхронизировать пути и версии в `index.html` (`?v=3`).
3. **Устранение эффекта прозрачности в Zone 3 (Solid Roster Cards):**
   - Убрать просвечивание заднего плана через карточки ростера.
   - Карточки должны быть 100% непрозрачными (`opacity: 1;`), сохраняя при этом стильное обесцвечивание неактивных слотов (`grayscale` + `brightness`).
4. **Увеличение непрозрачности и заливки фонового градиента на 5% (Zone 0):**
   - Значение затемняющего оверлея `.team-zone-0::after` поднимается с 85% до **90%** (`opacity: 0.90;`).
   - 10% светопропускания подложки дает безупречный баланс между глубоким контрастом для текста и четкой читаемостью военной базы, танка и руин.
5. **Адаптация Zone 1 под 2K мониторы (2560 × 1440 px и выше) — устранение обрезания иллюстраций:**
   - На экранах с разрешением 2560 × 1440 px обнаружено обрезание фигур персонажей.
   - Выявлена первопричина: жесткое свойство `overflow: hidden;` на `.team-portrait-wrapper` в сочетании с заниженной высотой `max-height: 1150px` и `clamp(140px, 18vh, 190px)`, отсекающее оружие слева и ботинки снизу при пропорциональном росте ширины арта (800+ px).
   - Требуется разблокировать `overflow: visible;` и пересчитать высоты под пропорции 2K-дисплеев.

---

## 2. Анализ Первопричины Обрезания в 2K и Архитектура Слоев

### 2.1. Геометрия 2K-вьюпорта (2560 × 1440 px)
1. При высоте экрана `1440px` и высоте хедера `84px`, доступная полезная высота секции составляет:  
   $$H_{\text{avail}} = 1440 - 84 - 36 - 24 = 1296\text{ px}$$
2. В старых стилях 2K действовало:
   ```css
   .team-portrait-wrapper {
     height: calc(100vh - clamp(140px, 18vh, 190px)); /* = 1440 - 259 = 1181px */
     max-height: 1150px;
     overflow: hidden; /* <--- ОБРЕЗАЛО ВЕСЬ ВЫХОД ЗА ПРЕДЕЛЫ КОНТЕЙНЕРА */
   }
   ```
3. Исходное разрешение артов — **1120 × 1600 px** (пропорция `0.70`). При высоте персонажа 1150–1280px его ширина составляет **805–896 px**.
4. Ширина колонки `.col-4` в 12-колоночной сетке 2K (`--container-max-width: 1820px`) составляет всего ~**582 px**.
5. Из-за `overflow: hidden;` на `.team-portrait-wrapper` левые 220–300 пикселей иллюстрации (ствол винтовки, рука оперативника) безвозвратно срезались границей блока!
6. **Решение:**  
   Снять `overflow: hidden` в пользу `overflow: visible;`. Поскольку центральная текстовая панель `Zone 4` уже имеет `z-index: 5` и снабжена контрастными тенями (TASK-043), винтовка и экипировка персонажа (`z-index: 2`) гармонично уходят под текст, не обрезаясь искусственной рамкой. Высота wrapper в 2K увеличивается до `1280px`.

---

## 3. Техническая Спецификация Изменений

### 3.1. Разметка `index.html`: Обновление Ассетов со Сбросом Кеша (`?v=3`)

#### Zone 3 (Карточки ростера):
```html
<!-- index.html: Zone 3 Roster Navigation Cards -->
<div class="team-roster-nav">
  <!-- Player 0 Card: Presa4ek -->
  <div class="roster-card active" data-player-id="0">
    <img src="/assets/images/Presa4ek SCALE Vertical Roster Navigation.png?v=3" alt="Presa4ek" class="roster-card-img" />
    <div class="roster-card-overlay"></div>
    <span class="roster-card-name">Presa4ek</span>
  </div>

  <!-- Player 1 Card: Art1zi -->
  <div class="roster-card" data-player-id="1">
    <img src="/assets/images/Art1zi SCALE Vertical Roster Navigation.png?v=3" alt="Art1zi" class="roster-card-img" />
    <div class="roster-card-overlay"></div>
    <span class="roster-card-name">Art1zi</span>
  </div>

  <!-- Player 2 Card: Matvi4 -->
  <div class="roster-card" data-player-id="2">
    <img src="/assets/images/Matvi4 Vertical Roster Navigation.png?v=3" alt="Matvi4" class="roster-card-img" />
    <div class="roster-card-overlay"></div>
    <span class="roster-card-name">Matvi4</span>
  </div>
</div>
```

#### Zone 1 (Портреты персонажей):
```html
<!-- index.html: Zone 1 Character Portrait PNG Layer -->
<div class="col-4 team-zone-1">
  <div class="team-portrait-wrapper">
    <img src="/assets/images/PORTRAIT PNG Presa4ek.png?v=3" alt="Presa4ek Portrait" class="player-portrait-img layer-0 active" data-portrait-id="0" />
    <img src="/assets/images/PORTRAIT PNG Art1zi.png?v=3" alt="Art1zi Portrait" class="player-portrait-img layer-1" data-portrait-id="1" />
    <img src="/assets/images/PORTRAIT PNG Matvi4.png?v=3" alt="Matvi4 Portrait" class="player-portrait-img layer-2" data-portrait-id="2" />
  </div>
</div>
```

---

### 3.2. Стили `src/styles/team.css`: Устранение Прозрачности Ростера (Zone 3)

#### БЫЛО (строки 281–303):
```css
.roster-card {
  height: 160px;
  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #1A2230;
  border-bottom: 1px solid rgba(39, 53, 77, 0.4);
  border-left: 4px solid transparent;
  filter: grayscale(100%) brightness(0.6);
  opacity: 0.55; /* <--- ПРОЗРАЧНОСТЬ ПРОСВЕЧИВАЛА ФОН */
  transition: filter 0.4s ease, opacity 0.4s ease, brightness 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.4s ease;
}

.roster-card:hover,
.roster-card.active {
  filter: grayscale(0%) brightness(1);
  opacity: 1;
}
```

#### СТАЛО:
```css
/* =========================================================
   Zone 3: Полное Устранение Прозрачности Карточек Ростера (TASK-064)
   ========================================================= */

.roster-card {
  height: 160px;
  width: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #1A2230; /* Плотная непрозрачная подложка */
  border-bottom: 1px solid rgba(39, 53, 77, 0.5);
  border-left: 4px solid transparent;
  
  /* Эффект неактивного состояния без полупрозрачности: */
  opacity: 1 !important; /* 100% плотный непрозрачный блок */
  filter: grayscale(100%) brightness(0.65);
  
  transition: filter 0.4s ease, brightness 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.4s ease;
}

.roster-card:hover,
.roster-card.active {
  opacity: 1 !important;
  filter: grayscale(0%) brightness(1);
}
```

---

### 3.3. Стили `src/styles/team.css`: Оверлей 90% (Zone 0)

```css
/* =========================================================
   Zone 0: Затемняющий оверлей 90% (TASK-060 / TASK-064)
   ========================================================= */

.team-zone-0::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 45%, #141C29 0%, #0F0F0F 85%);
  opacity: 0.90; /* 90%: увеличено на 5% от 85% */
  pointer-events: none;
  z-index: 2;
}
```

---

### 3.4. Стили `src/styles/team.css`: 2K-Адаптация и Устранение Обрезания (Zone 1)

#### 1. Базовый десктопный контейнер (строки 92–108):
Снимаем `overflow: hidden;`, чтобы части экипировки не отсекались:
```css
.team-portrait-wrapper {
  position: relative;
  width: 100%;
  min-width: 520px;
  height: calc(100vh - var(--header-height) - 36px);
  max-height: 960px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  top: 0;
  bottom: auto;
  z-index: 2;
  overflow: visible; /* Исключено обрезание контуров */
}
```

#### 2. Блок 2K / QHD (`@media (min-width: 2049px)`):
```css
/* =========================================================
   TASK-064: 2K / QHD СТАНДАРТ (2560 × 1440 px) - Zone 1 Fix:
   ========================================================= */
@media (min-width: 2049px) {
  .team-zone-1 {
    min-width: 680px;
    margin-top: -84px; /* Подъем в уровень 84px хедера и подблока */
    overflow: visible;
  }

  /* Zone 1 (Right Portrait Wrapper): Полная высота без обрезания */
  .team-portrait-wrapper {
    height: calc(100vh - var(--header-height) - 36px);
    max-height: 1280px; /* Увеличено с 1150px под 1440p */
    min-width: 680px;
    overflow: visible;  /* Снято обрезание оружия и ботинок */
  }

  .player-portrait-img {
    height: 100%;
    max-height: 100%;
    width: auto;
    object-fit: contain;
    object-position: right top;
  }
}
```

---

## 4. Контрольный Чеклист Приемки (Verification Checklist)

| № | Проверяемый параметр | Ожидаемый результат | Статус проверки |
|---|----------------------|---------------------|-----------------|
| 1 | **Zone 1: Арты бойцов** | Отображаются свежие иллюстрации Presa4ek, Art1zi, Matvi4 с параметром `?v=3`. | [x] Выполнено |
| 2 | **Zone 3: Карточки ростера** | Отображаются обновленные миниатюры ростера (652×320) с параметром `?v=3`. | [x] Выполнено |
| 3 | **Zone 3: Плотность карточек** | Карточки ростера имеют `opacity: 1`, не просвечивают фон, неактивные плавно обесцвечены. | [x] Выполнено |
| 4 | **Zone 0: Оверлей 90%** | Радиальный градиент `#141C29` -> `#0F0F0F` наложен с непрозрачностью 90%. | [x] Выполнено |
| 5 | **Zone 1 в 2K (2560×1440)** | Фигуры персонажей видны полностью от верхушки шлема до обуви; винтовка и руки не срезаются слева. | [x] Выполнено |
