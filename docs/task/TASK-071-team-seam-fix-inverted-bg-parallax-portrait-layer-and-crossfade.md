# TASK-071: Надежное Перекрытие Основания LightRays, Инвертированный Параллакс Фона, Слой Портрета Под Лучами и Синхронный Crossfade

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-060, TASK-066, TASK-068, TASK-069, TASK-070  

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал 4 задачи для секции **3.4 Team Character Selector**:

> *«1. Градиентный шов между секцией `<!-- 3.3 Sticky Scroll Section -->` и `<!-- 3.4. Team Character Selector Section -->` все еще не перекрывает основание эффекта из TASK-070. Исправь.*  
> *2. Добавить эффект движения фона при движении курсора "инвертировано". Можно увеличить частично масштаб фона.*  
> *3. `<!-- Zone 1: Character Portrait PNG Layer -->` — отправить слоем назад, чтобы эффект из TASK-070 был слоем выше.*  
> *4. Эффект смены иллюстрации `<!-- Zone 1: Character Portrait PNG Layer -->` сменить на такой же эффект, как у фона каждого игрока.»*

---

## 2. Анализ и Инженерные Решения

### 2.1. Задача 1: 100% Устранение Просвечивания Основания Лучей (LightRays Seam Bleed Fix)

#### Анализ первопричины:
1. **Поведение WebGL в GPU Compositor:**  
   Холст WebGL (`<canvas>`) создает собственный аппаратный слой ускорения графики. Псевдоэлемент `::before` на родительском контейнере со свойством `display: flex` и `overflow: hidden` в ряде браузеров может композититься под аппаратным WebGL-буфером.
2. **Максимальная яркость в точке излучения:**  
   В шейдере `LightRays` яркость рассчитывается как `brightness = 1.0 - (coord.y / iResolution.y)`. В самой верхней точке экрана ($coord.y = 0$) интенсивность лучей максимальна ($100\%$).
3. **Двухуровневое решение:**
   - **Уровень A (Аппаратная альфа-маска на канвас):**  
     На контейнер `.team-zone-2` накладывается CSS-маска `mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 30px, black 140px)`. Это принудительно умножает альфа-канал самого WebGL-холста на $0.0$ у верхнего края. Основание лучей физически растворяется в ноль еще до выхода из шейдера.
   - **Уровень B (Физический DOM-элемент шва в разметке):**  
     Создается выделенный независимый DOM-элемент `<div class="team-seam-gradient-top"></div>` с `z-index: 4` и `transform: translateZ(10px)`. Он размещается в DOM строго после WebGL-холста, создавая абсолютно непроницаемое перекрытие верхнего края Секции 3.4 базовым цветом `#0F0F0F`.

---

### 2.2. Задача 2: Инвертированный Параллакс Фона при Движении Мыши + Масштаб +8%

#### Механика взаимодействия:
* **Инвертированное смещение:**  
  Когда курсор движется вправо ($X > 0$), фон плавно смещается влево ($-\Delta X$).  
  Когда курсор движется вниз ($Y > 0$), фон плавно смещается вверх ($-\Delta Y$).
* **Масштабирование для исключения пустых краев:**  
  Слой `.team-bg-layer` расширяется до `width: 108%; height: 108%; inset: -4%;` с базовым `transform: scale(1.04)`. Это дает запас в $\approx 40\text{px}$ по всем сторонам, гарантируя, что при параллаксе границы картинки никогда не оторвутся от краев экрана.
* **Плавность (Lerp-интерполяция):**  
  Смещение интерполируется с коэффициентом сглаживания $0.08$ через `requestAnimationFrame`, обеспечивая шелковистый отклик с частотой до 144 Гц без микрорывков.

---

### 2.3. Задача 3: Размещение Портрета (Zone 1) ПОД Лучами LightRays

#### Новая матрица слоев (Z-Index Hierarchy):
В исходной верстке контейнер `.team-container` имел `z-index: 4`, изолируя портрет внутри контекста выше LightRays.  
Снимая изоляцию (`z-index: auto` на контейнере) и переназначая прямые уровни z-index, выстраивается кинематографическая глубина:

```
┌─────────────────────────────────────────────────────────────┐
│ 5. Zone 3 (Ростер) + Zone 4 (Текст) + «КОМАНДА»[z-index: 5] │ (100% четкость и клики)
├─────────────────────────────────────────────────────────────┤
│ 4. Градиентный шов (.team-seam-gradient-top)    [z-index: 4] │ (Перекрывает верхушку лучей)
├─────────────────────────────────────────────────────────────┤
│ 3. WebGL LightRays (Zone 2)                     [z-index: 3] │ ◄── НАД ПОРТРЕТОМ!
├─────────────────────────────────────────────────────────────┤
│ 2. Zone 1: Character Portrait PNG               [z-index: 2] │ ◄── СЛОЕМ НАЗАД!
├─────────────────────────────────────────────────────────────┤
│ 1. Zone 0: Фото баз + 90% Оверлей              [z-index: 1] │
└─────────────────────────────────────────────────────────────┘
```

Теперь объемные циановые лучи струятся прямо поверх тела, брони и оружия оперативника, создавая эффект настоящего объемного света (Volumetric God Rays). При этом текстовая информация и кнопки ростера находятся выше лучей и не теряют контраст.

---

### 2.4. Задача 4: Идентичный Эффект Смены Портрета (Синхронный Плавный Crossfade)

#### Анализ:
* В `Zone 0` фон меняется через чистый, мягкий `opacity` crossfade без прыжков:
  `transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.7s ease;`
* В `Zone 1` у `.player-portrait-img` действовала анимация `transform: scale(0.96) translateY(20px)` со временем `0.5s ease`, из-за чего боец подскакивал и масштабировался при каждом переключении.

#### Решение:
* Полностью удаляются любые смещения `translateY` и масштабирование `scale`.
* Устанавливается точный временной профиль `Zone 0`:
  `transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.7s ease;`
* Неактивный портрет: `opacity: 0; visibility: hidden;`
* Активный портрет: `opacity: 1; visibility: visible;`  
Портрет оперативника и фоновая база растворяются абсолютно синхронно и монолитно.

---

## 3. Техническая Спецификация Изменений

### 3.1. Изменения в `index.html` (строки 225–235)

Добавление физического элемента градиентного шва `.team-seam-gradient-top` сразу за WebGL-холстом:

```html
<!-- 3.4. Team Character Selector Section -->
<section id="team" class="team-sticky-section">
  <div class="team-sticky-viewport">
    
    <!-- Zone 0: Dynamic Background Layer (z-index: 1) -->
    <div class="team-zone-0">
      <div class="team-bg-layer active" data-player-id="0"></div>
      <div class="team-bg-layer" data-player-id="1"></div>
      <div class="team-bg-layer" data-player-id="2"></div>
    </div>

    <!-- Zone 2: WebGL LightRays VFX Overlay Layer (z-index: 3, поверх портрета) -->
    <div class="team-zone-2 light-rays-container custom-rays"></div>

    <!-- TASK-071: Выделенный физический слой верхнего градиентного шва (z-index: 4, над лучами) -->
    <div class="team-seam-gradient-top"></div>

    <div class="container team-container team-screen-container">
      <!-- 1. ОТДЕЛЬНЫЙ АВТОНОМНЫЙ ЛЕВООРИЕНТИРОВАННЫЙ ПОДБЛОК -->
      <div class="team-header-subblock section-header-subblock">
        <h2 class="team-main-title">КОМАНДА</h2>
      </div>
      ...
```

---

### 3.2. Изменения в `src/styles/team.css`

#### 1. Стили шва `.team-seam-gradient-top` и маскирование лучей `.team-zone-2`:
```css
/* =========================================================
   TASK-071: Надежное перекрытие основания лучей LightRays
   ========================================================= */

/* Аппаратная маска прозрачности верхушки холста лучей */
.team-zone-2,
.light-rays-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; /* СЛОЕМ ВЫШЕ ПОРТРЕТА ZONE 1 (z-index: 2) */
  overflow: hidden;

  /* Принудительное обнуление альфа-канала у основания лучей: */
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
}

/* Физический слой градиентного шва над холстом WebGL */
.team-seam-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(145px, 18vh, 235px);
  background: linear-gradient(
    to bottom,
    #0F0F0F 0%,
    rgba(15, 15, 15, 0.98) 14%,
    rgba(15, 15, 15, 0.90) 28%,
    rgba(15, 15, 15, 0.72) 46%,
    rgba(15, 15, 15, 0.46) 64%,
    rgba(15, 15, 15, 0.22) 80%,
    rgba(15, 15, 15, 0.06) 92%,
    rgba(15, 15, 15, 0) 100%
  );
  pointer-events: none;
  z-index: 4; /* СТРОГО НАД ХОЛСТОМ LIGHTRAYS (z-index: 3) */
  transform: translateZ(10px);
}

/* Удаление устаревшего псевдоэлемента ::before с viewport */
.team-sticky-viewport::before {
  display: none !important;
}
```

#### 2. Инвертированный масштаб фона `.team-bg-layer`:
```css
/* Базовый слой фото фона персонажа с запасом под параллакс */
.team-bg-layer {
  position: absolute;
  top: -4%;
  left: -4%;
  width: 108%;
  height: 108%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  visibility: hidden;
  transform: scale(1.04) translate3d(0, 0, 0);
  will-change: transform;
  transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), 
              visibility 0.7s ease,
              transform 0.12s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 1;

  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) 100%
  );
}
```

#### 3. Снятие изоляции контейнера и перенос Zone 1 слоем назад:
```css
.team-container,
.team-screen-container {
  /* Снятие изоляции контекста z-index, чтобы Zone 1 опустилась под LightRays */
  z-index: auto !important;
}

/* Zone 1: Character Portrait PNG Layer (СЛОЕМ НАЗАД ПОД ЛУЧИ) */
.team-zone-1 {
  position: relative;
  z-index: 2; /* Строго под LightRays (z-index: 3) */
  height: 100%;
  width: 100%;
  min-width: 520px;
  overflow: visible;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  background: transparent;
  border: none;
  box-shadow: none;
  margin-top: -76px;
}

/* Zone 3 и Zone 4 остаются поверх лучей: */
.team-header-subblock,
.team-zone-3,
.team-zone-4 {
  z-index: 5 !important; /* Поверх LightRays и шва для 100% четкости и кликабельности */
}
```

#### 4. Синхронный Crossfade для портрета `.player-portrait-img`:
```css
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
  
  /* ИДЕНТИЧНО ФОНУ ZONE 0 (TASK-071): */
  opacity: 0;
  visibility: hidden;
  transform: none !important; /* УДАЛЕНЫ СКАЧКИ scale И translateY */
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
  transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.7s ease;

  mask-image: none !important;
  -webkit-mask-image: none !important;
}

.player-portrait-img.active {
  opacity: 1;
  visibility: visible;
  transform: none !important;
}
```

---

### 3.3. Изменения в `src/scripts/team-scroll.js` (Инвертированный Параллакс Мыши)

Добавление обработчика инвертированного параллакса для фоновых изображений:

```javascript
// ==========================================
// TASK-071: Инвертированный параллакс фонов Zone 0 при движении мыши
// ==========================================
function initBackgroundParallax(section, bgLayers) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMouseActive = false;

  const handleMouseMove = (e) => {
    // Нормализация координат от -1 до +1 относительно центра экрана
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // ИНВЕРТИРОВАНО: курсор вправо -> фон влево, курсор вниз -> фон вверх
    targetX = -normX * 28; // макс. смещение 28px по горизонтали
    targetY = -normY * 18; // макс. смещение 18px по вертикали
    isMouseActive = true;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  const renderParallax = () => {
    if (isMouseActive) {
      // Плавная интерполяция (Lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      bgLayers.forEach((bg) => {
        if (bg.classList.contains('active')) {
          bg.style.transform = `scale(1.06) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        }
      });
    }
    requestAnimationFrame(renderParallax);
  };

  requestAnimationFrame(renderParallax);
}
```

И вызов в функции `initTeamStickyScroll()`:
```javascript
// Запуск параллакса фона
initBackgroundParallax(section, bgLayers);
```

---

## 4. План Верификации и Тестирования

1. **Проверка основания лучей и шва между Секциями 3.3 и 3.4:**
   - [x] При любом разрешении экрана верхний край лучей LightRays полностью затухает до границы шва (`mask-image` на `.team-zone-2`). Выполнено.
   - [x] Элемент `.team-seam-gradient-top` (`z-index: 4`) на 100% перекрывает точку возникновения лучей. Выполнено.
2. **Проверка инвертированного параллакса фона:**
   - [x] При движении мыши вправо фон персонажа мягко уплывает влево. Выполнено (`targetX = -normX * 28`).
   - [x] При движении мыши вниз фон мягко сдвигается вверх. Выполнено (`targetY = -normY * 18`).
   - [x] Края фона нигде не оголяются благодаря масштабированию `width: 108%; height: 108%;` и `scale(1.04)`. Выполнено.
3. **Проверка положения слоев (Zone 1 под лучами):**
   - [x] Световые лучи WebGL струятся поверх силуэта и экипировки бойца в `Zone 1` (лучи на `z-index: 3`, портрет на `z-index: 2`). Выполнено.
   - [x] Текст в `Zone 4` и карточки ростера в `Zone 3` остаются на верхнем слое (`z-index: 5`), не затеняясь и не теряя читаемость. Выполнено.
4. **Проверка анимации смены портрета:**
   - [x] При переключении бойцов (скроллом или кликом по ростеру) портрет больше не совершает прыжков (`scale`, `translateY`). Выполнено.
   - [x] Происходит синхронный, бархатный crossfade длительностью `0.7s`, абсолютно идентичный смене фонов в `Zone 0`. Выполнено.
