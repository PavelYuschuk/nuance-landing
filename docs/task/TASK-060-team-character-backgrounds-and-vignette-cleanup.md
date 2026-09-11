# TASK-060: Фоновые Арты Персонажей (Zone 0), Глобальный Градиентный Оверлей и Очистка Портретов (Zone 1 / Zone 3)

**Status:** DONE  
**Target File(s):** `src/styles/team.css`, `index.html` (опционально)  
**Parent Specification:** TASK-010, TASK-013, TASK-048, TASK-050, TASK-054, TASK-056  
**Reference Asset:** `Background_reference.png` (`media_1789070969345.png`)

---

## 1. Контекст и Постановка Задачи

Пользователь предоставил визуальный эталон (`Background_reference.png`) и сформулировал 4 взаимосвязанных дизайн-инженерных требования для секции **3.4 Team Character Selector Section**:

1. **Перенос цветовых градиентов из Zone 0 в Zone 3 (Левый вертикальный ростер):**
   - Убрать полноэкранные радиальные цветные подсветки игроков (`rgba(..., 0.12)`) из фонового слоя `.team-bg-layer`.
   - Перенести акцентное свечение каждого персонажа в карточки навигации **Zone 3: Left Vertical Roster Navigation**.
   - Направление свечения: **слева направо от активной маркерной линии** (`to right`).
   - Свечение должно быть полупрозрачным и деликатным, чтобы не перекрывать видимость иллюстраций персонажей внутри карточек ростера.
2. **Интеграция индивидуальных тематических фонов персонажей (Zone 0):**
   - В директории `public/assets/images/` подготовлены графические фоны:
     - Игрок 0 (**Presa4ek**): `background_presaek.png` (военный аэродром, ангары и разведывательно-ударный вертолет — прямая связка с ролью пилота и стратега).
     - Игрок 1 (**Art1zi**): `background_Art1zi.png` (урбанистические руины, дым, огонь и тяжелый танк — связка со штурмовиком и тяжелым калибром).
     - Игрок 2 (**Matvi4**): `background_matvi4.png` (разрушенные городские многоэтажки, воронки и поле боя — оригинальный исходник пользовательского референса).
   - Привязать эти фоны к соответствующим слоям `.team-bg-layer[data-player-id="X"]` с плавным кроссфейдом при скролле.
3. **Глобальный затемняющий оверлей с эффектом прозрачности 90% (увеличено на 5% от 85%):**
   - Поверх фоновых иллюстраций наложить канонический глобальный градиент сайта:  
     `radial-gradient(circle at 50% 45%, #141C29 0%, #0F0F0F 85%)`.
   - Режим наложения: непрозрачность **90%** (fill/opacity 90%, увеличено ровно на 5% для достижения идеального кинематографического баланса контраста и видимости артов).
   - В результате 10% деталей сцены (силуэты разрушенных зданий, вертолета, военной техники) создают глубокую кинематографическую милитари-атмосферу, оставаясь достаточно темными и гармоничными с палитрой сайта, не конфликтуя с текстом и портретом на переднем плане.
4. **Удаление верхнего и нижнего градиентов на слое портрета (Zone 1):**
   - Полностью убрать оверлейный градиент `.team-portrait-wrapper::after` (затемнения сверху и снизу по 70px).
   - Отключить маскирование прозрачности `mask-image` / `-webkit-mask-image` на `.player-portrait-img`.
   - Портрет персонажа должен отображаться со 100% четкостью и чистыми краями по всей высоте.

---

## 2. Анализ Архитектуры Слоев и Компонентов

### 2.1. Исходные файлы и их маппинг
- **Фоны в `public/assets/images/`:**
  - `background_presaek.png` -> `data-player-id="0"` (Presa4ek)
  - `background_Art1zi.png` -> `data-player-id="1"` (Art1zi)
  - `background_matvi4.png` -> `data-player-id="2"` (Matvi4)
- **CSS-стили:** `src/styles/team.css`
  - Zone 0 (`.team-zone-0`, `.team-bg-layer`) — строки 31–67.
  - Zone 1 (`.team-portrait-wrapper`, `.player-portrait-img`) — строки 71–166.
  - Zone 3 (`.roster-card`, `.roster-card.active`, `.roster-card-overlay`) — строки 276–351.

### 2.2. Zone 0: Механика кроссфейда и наложения оверлея
В `src/scripts/team-scroll.js` уже реализовано динамическое переключение классов `.active` на элементах `.team-bg-layer` при скролле:
```javascript
bgLayers.forEach((bg, idx) => {
  if (idx === activeIndex) {
    bg.classList.add('active');
  } else {
    bg.classList.remove('active');
  }
});
```
Если оверлей глобального градиента вынести на псевдоэлемент `.team-zone-0::after`, то:
1. Оверлей находится на постоянном слое поверх меняющихся изображений (`z-index: 2`).
2. Фотографии в слоях `.team-bg-layer` плавно сменяют друг друга с CSS `transition: opacity 0.7s ease, visibility 0.7s ease`.
3. Нет мерцания, а картинка всегда затемнена ровно на 90% глобальным градиентом `#141C29` -> `#0F0F0F` (увеличено на 5% от 85% для оптимального баланса контраста).

---

## 3. Техническая Спецификация Изменений (Implementation Spec)

### 3.1. Zone 0: Назначение Фонов и 95% Градиентного Оверлея (`src/styles/team.css`)

#### БЫЛО (строки 31–67):
```css
/* Zone 0: Dynamic Background Layer (z-index: 1) */
.team-zone-0 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.team-bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
}

.team-bg-layer.active {
  opacity: 1;
  visibility: visible;
}

.team-bg-layer[data-player-id="0"] {
  background: radial-gradient(circle at 75% 50%, rgba(193, 255, 0, 0.12) 0%, transparent 70%);
}

.team-bg-layer[data-player-id="1"] {
  background: radial-gradient(circle at 75% 50%, rgba(0, 229, 255, 0.12) 0%, transparent 70%);
}

.team-bg-layer[data-player-id="2"] {
  background: radial-gradient(circle at 75% 50%, rgba(255, 193, 7, 0.12) 0%, transparent 70%);
}
```

#### СТАЛО:
```css
/* =========================================================
   Zone 0: Индивидуальные Фоны Персонажей + 95% Оверлей (TASK-060)
   ========================================================= */

.team-zone-0 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  background-color: #0F0F0F;
}

/* Базовый слой фото фона персонажа */
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
}

.team-bg-layer.active {
  opacity: 1;
  visibility: visible;
}

/* Игрок 0: Presa4ek (вертолетная база) */
.team-bg-layer[data-player-id="0"] {
  background-image: url('/assets/images/background_presaek.png');
}

/* Игрок 1: Art1zi (танковая позиция в руинах) */
.team-bg-layer[data-player-id="1"] {
  background-image: url('/assets/images/background_Art1zi.png');
}

/* Игрок 2: Matvi4 (разрушенный жилой квартал - эталон Background_reference.png) */
.team-bg-layer[data-player-id="2"] {
  background-image: url('/assets/images/background_matvi4.png');
}

/* Постоянный оверлей глобального градиента: непрозрачность 90% (увеличено на 5% от 85% - TASK-060) */
.team-zone-0::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 45%, #141C29 0%, #0F0F0F 85%);
  opacity: 0.90;
  pointer-events: none;
  z-index: 2;
}
```

---

### 3.2. Zone 3: Перенос Акцентного Градиента в Карточки Ростера (`src/styles/team.css`)

Цветовые акценты переносятся в активные карточки левого ростера. Градиент мягко струится от левой маркерной линии (`border-left: 4px solid ...`) направо, создавая хай-тек подсветку активного слота без потери различимости миниатюры персонажа.

#### БЫЛО (строки 323–338):
```css
/* Left Accent Marker Line & Inner Glow on Active Roster Card */
.roster-card[data-player-id="0"].active {
  border-left: 4px solid #C1FF00;
  box-shadow: inset 4px 0 12px rgba(193, 255, 0, 0.2);
}

.roster-card[data-player-id="1"].active {
  border-left: 4px solid #00E5FF;
  box-shadow: inset 4px 0 12px rgba(0, 229, 255, 0.2);
}

.roster-card[data-player-id="2"].active {
  border-left: 4px solid #FFC107;
  box-shadow: inset 4px 0 12px rgba(255, 193, 7, 0.2);
}
```

#### СТАЛО:
```css
/* =========================================================
   Zone 3: Акцентный Горизонтальный Градиент Слева-Направо (TASK-060)
   ========================================================= */

/* Общий плавный переход подсветки карточки */
.roster-card {
  transition: filter 0.4s ease, opacity 0.4s ease, brightness 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.4s ease;
}

/* Игрок 0: Presa4ek (#C1FF00) */
.roster-card[data-player-id="0"].active {
  border-left: 4px solid #C1FF00;
  box-shadow: inset 4px 0 16px rgba(193, 255, 0, 0.25), 0 0 20px rgba(193, 255, 0, 0.08);
}

.roster-card[data-player-id="0"].active .roster-card-overlay {
  background: 
    linear-gradient(to right, rgba(193, 255, 0, 0.22) 0%, rgba(193, 255, 0, 0.06) 45%, transparent 80%),
    linear-gradient(to top, rgba(15, 15, 15, 0.85) 0%, rgba(15, 15, 15, 0.25) 60%, transparent 100%);
}

/* Игрок 1: Art1zi (#00E5FF) */
.roster-card[data-player-id="1"].active {
  border-left: 4px solid #00E5FF;
  box-shadow: inset 4px 0 16px rgba(0, 229, 255, 0.25), 0 0 20px rgba(0, 229, 255, 0.08);
}

.roster-card[data-player-id="1"].active .roster-card-overlay {
  background: 
    linear-gradient(to right, rgba(0, 229, 255, 0.22) 0%, rgba(0, 229, 255, 0.06) 45%, transparent 80%),
    linear-gradient(to top, rgba(15, 15, 15, 0.85) 0%, rgba(15, 15, 15, 0.25) 60%, transparent 100%);
}

/* Игрок 2: Matvi4 (#FFC107) */
.roster-card[data-player-id="2"].active {
  border-left: 4px solid #FFC107;
  box-shadow: inset 4px 0 16px rgba(255, 193, 7, 0.25), 0 0 20px rgba(255, 193, 7, 0.08);
}

.roster-card[data-player-id="2"].active .roster-card-overlay {
  background: 
    linear-gradient(to right, rgba(255, 193, 7, 0.22) 0%, rgba(255, 193, 7, 0.06) 45%, transparent 80%),
    linear-gradient(to top, rgba(15, 15, 15, 0.85) 0%, rgba(15, 15, 15, 0.25) 60%, transparent 100%);
}
```

> **Примечание по прозрачности:** Значения `0.22` у левого края и `0.06` на 45% ширины карточки обеспечивают сочный акцентный свет, при этом силуэт бойца на фото карточки остается чистым и контрастным.

---

### 3.3. Zone 1: Полное Удаление Градиентных Оверлеев и Масок с Портрета (`src/styles/team.css`)

#### БЫЛО (строки 113–126 и 146–160):
```css
/* Оверлей двойного градиента (TASK-048 / TASK-050): 
   - Сверху: мягкое затухание (70px, 45% плотности)
   - Снизу: уменьшен в 2 раза (70px вместо 150px, 45% плотности вместо 95%) */
.team-portrait-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  background: linear-gradient(
    to bottom,
    rgba(15, 15, 15, 0.45) 0px,         /* Верхний градиент: 45% */
    transparent 70px,                   /* Окончание верхнего градиента */
    transparent calc(100% - 70px),      /* Чистая средняя зона иллюстрации */
    rgba(15, 15, 15, 0.45) 100%         /* Нижний градиент: уменьшен в 2 раза */
  );
}

.player-portrait-img {
  ...
  /* Мягкая растушевка краев в 2 раза деликатнее прежней (TASK-048) */
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.55) 0px,
    rgba(0, 0, 1) 60px,
    rgba(0, 0, 1) calc(100% - 60px),
    rgba(0, 0, 0, 0.55) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.55) 0px,
    rgba(0, 0, 1) 60px,
    rgba(0, 0, 1) calc(100% - 60px),
    rgba(0, 0, 0, 0.55) 100%
  );
}
```

#### СТАЛО:
```css
/* =========================================================
   Zone 1: Очистка Портрета Персонажа от Градиентов (TASK-060)
   ========================================================= */

/* Полное отключение градиентного оверлея сверху и снизу контейнера */
.team-portrait-wrapper::after {
  display: none !important;
}

/* Полное удаление маскирования прозрачности с PNG-портретов */
.player-portrait-img {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  max-height: 100%;
  width: auto;
  max-width: none;
  object-fit: contain;
  object-position: right top;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transform: scale(0.96) translateY(20px);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
  transition: opacity 0.5s ease, transform 0.5s ease;

  /* Градиенты сверху и снизу удалены - 100% чистый и четкий PNG */
  mask-image: none !important;
  -webkit-mask-image: none !important;
}
```

---

## 4. Контрольный Чеклист Приемки (Verification Checklist)

| № | Проверяемый параметр | Ожидаемый результат | Статус проверки |
|---|----------------------|---------------------|-----------------|
| 1 | **Zone 0: Фоны персонажей** | Для Presa4ek отображается `background_presaek.png`, для Art1zi — `background_Art1zi.png`, для Matvi4 — `background_matvi4.png`. При переключении игроков фоны плавно растворяются. | [x] Выполнено |
| 2 | **Zone 0: Затемняющий оверлей 90%** | Поверх артов лежит радиальный градиент `#141C29` -> `#0F0F0F` с прозрачностью 90% (увеличено на 5% для оптимального баланса контраста). Визуальный результат идентичен эталону `Background_reference.png`. | [x] Выполнено |
| 3 | **Zone 3: Акцентный градиент слева-направо** | На активной карточке ростера от цветной линии маркерной полосы вправо мягко струится цветной градиент (`#C1FF00`, `#00E5FF`, `#FFC107`), не мешая просмотру миниатюры. | [x] Выполнено |
| 4 | **Zone 0: Очистка цветных ореолов** | В фоне больше нет цветных радиальных вспышек на 75% 50% — фон сохраняет единую стилистическую гамму военного окружения. | [x] Выполнено |
| 5 | **Zone 1: Чистый портрет без виньеток** | На слое портрета персонажа нет верхнего и нижнего затухания. Голова и нижняя часть фигуры не обрезаются искусственными градиентами. | [x] Выполнено |
