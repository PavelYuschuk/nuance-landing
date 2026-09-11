# TASK-076: Исключение Хедера из Магнетизма TargetCursor, Инвертированный Параллакс Портретов Zone 1 и Градиентный Шов между Секциями 3.4 и 3.5

**Status:** DONE  
**Target File(s):** `src/scripts/target-cursor.js`, `src/scripts/team-scroll.js`, `src/styles/team.css`, `src/styles/doctrine.css`, `index.html`  
**Parent Specification:** TASK-010, TASK-023, TASK-057, TASK-066, TASK-068, TASK-071, TASK-074  
**Reference Assets:** Референс межсекционного градиента World of Tanks (`media_1789075765924.png`)  

---

## 1. Контекст и Постановка Задачи

Пользователь поставил 3 взаимосвязанные задачи по полировке кинематографичности и микро-взаимодействий интерфейса:

1. **Исключение Хедера из магнетизма курсора (TargetCursor):**  
   Отключить эффект захвата цели (Target Lock-On / прилипание скобок) для всех элементов глобальной навигации `<!-- 3.1 Header -->` (логотип, навигационные ссылки, кастомный выпадающий список языков). Курсор при наведении на хедер должен сохранять плавное свободное перемещение в режиме прицела без стягивания уголков к границам кнопок.
2. **Инвертированный параллакс для портретов персонажей Zone 1 (Секция 3.4):**  
   Для слоя `Zone 1: Character Portrait PNG Layer` (`.player-portrait-img`) добавить эффект смещения при движении курсора мыши:
   - **Инвертированное направление:** то же, что и у фона (курсор вправо $\to$ портрет влево, курсор вниз $\to$ портрет вверх).
   - **БЕЗ увеличения масштаба:** масштаб остается строго `1.0` (в отличие от фона с `scale(1.04-1.06)`).
   - **Интенсивность уменьшена в 2 раза:** максимальное смещение $14\text{px}$ по горизонтали и $9\text{px}$ по вертикали (против $28\text{px}$ и $18\text{px}$ у фона). Это создает иллюзию объема и глубины (персонаж находится ближе к зрителю, чем удаленный фоновый город).
3. **Градиентный переход («закрытие шва») между Секциями 3.4 и 3.5:**  
   По аналогии с переходом между Секцией 3.3 и 3.4 (TASK-066 / TASK-068) создать двухсторонний бесшовный градиентный мост между Секцией 3.4 (Team) и Секцией 3.5 (Doctrine), устраняющий резкий срез фона `#0F0F0F` при выходе из sticky-скролла.

---

## 2. Пункт 1: Исключение Хедера из Магнетизма TargetCursor

### 2.1. Логика решения
В модуле [`src/scripts/target-cursor.js`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/target-cursor.js):
- Добавляется параметр конфигурации `excludeSelector = 'header, .header, .header *'`.
- В обработчике `enterHandler(e)` первой строкой выполняется проверка: если `e.target` или любой его предок соответствует `excludeSelector`, событие захвата цели игнорируется.
- Если курсор перемещается с интерактивного элемента страницы в область хедера, активная цель сбрасывается (`leaveHandler()`), и скобки плавно возвращаются к центральной точке, продолжая свободное вращение.

### 2.2. Модификация `src/scripts/target-cursor.js`

В функции `initTargetCursor(options)`:

```javascript
  // 1. Деструктуризация параметров с добавлением excludeSelector
  const {
    targetSelector = '.cursor-target, a, button, [role="button"], input, select, textarea, .doctrine-card, .lang-switcher-btn, .lang-dropdown-item, .team-roster-item',
    excludeSelector = 'header, .header, .header *', // TASK-076: Исключение хедера из захвата
    spinDuration = 3.5,
    hideDefaultCursor = true,
    hoverDuration = 0.2,
    parallaxOn = true,
    cursorColor = '#ffffff',
    cursorColorOnTarget = '#00E5FF',
    borderWidth = 3,
    cornerSize = 12
  } = options;
```

В обработчике `enterHandler`:

```javascript
  // Обработка наведения на интерактивный элемент (Target Enter)
  const enterHandler = e => {
    const directTarget = e.target;

    // TASK-076: Если курсор находится над хедером или его дочерними элементами — запрещаем магнетизм
    if (excludeSelector && (directTarget.matches?.(excludeSelector) || directTarget.closest?.(excludeSelector))) {
      if (activeTarget && currentLeaveHandler) {
        currentLeaveHandler();
      }
      return;
    }

    let current = directTarget;
    let target = null;
    while (current && current !== document.body) {
      // Дополнительная защита: предок не должен быть хедером
      if (excludeSelector && (current.matches?.(excludeSelector) || current.closest?.(excludeSelector))) {
        break;
      }
      if (current.matches && current.matches(targetSelector)) {
        target = current;
        break;
      }
      current = current.parentElement;
    }

    if (!target || !cursor || !corners.length) return;
    if (activeTarget === target) return;
    
    // ... дальнейшая логика захвата цели без изменений
```

---

## 3. Пункт 2: Инвертированный Параллакс Портретов Zone 1

### 3.1. Математика параллакса глубины (Depth Parallax)
Для создания кинематографического объема слои сцены должны смещаться пропорционально расстоянию от виртуальной камеры:
1. **Фоновый слой базы (Zone 0):**  
   Дальний план. Амплитуда смещения:
   $$X_{\text{bg}} = - \text{normX} \cdot 28\text{px}, \quad Y_{\text{bg}} = - \text{normY} \cdot 18\text{px}$$
   Масштаб: $1.04$–$1.06$ (для компенсации смещения границ).
2. **Портрет персонажа (Zone 1):**  
   Передний план. Амплитуда смещения ровно в 2 раза меньше фонового:
   $$X_{\text{portrait}} = \frac{X_{\text{bg}}}{2} = - \text{normX} \cdot 14\text{px}$$
   $$Y_{\text{portrait}} = \frac{Y_{\text{bg}}}{2} = - \text{normY} \cdot 9\text{px}$$
   Масштаб: строго $1.00$ (без изменения масштаба `scale(1)`).
3. **Текстовый контент и HUD (Zone 3 и Zone 4):**  
   Интерфейсный слой. Смещение: $0\text{px}$ (фиксирован).

В результате при перемещении взгляда вправо фон уходит влево на $28\text{px}$, персонаж — влево на $14\text{px}$, создавая ощущение, что боец физически стоит впереди фоновой военной базы.

### 3.2. Изменения в `src/scripts/team-scroll.js`

Обновляется функция `initBackgroundParallax` (переименовывается в `initTeamParallax`):

```javascript
// В функции initTeamStickyScroll() заменяем вызов:
// БЫЛО:
// initBackgroundParallax(section, bgLayers);
// СТАЛО:
initTeamParallax(section, bgLayers, portraitLayers);
```

Спецификация функции `initTeamParallax`:

```javascript
// ==========================================
// TASK-076: Инвертированный параллакс фонов Zone 0 и портретов Zone 1
// ==========================================
function initTeamParallax(section, bgLayers, portraitLayers) {
  let targetBgX = 0;
  let targetBgY = 0;
  let currentBgX = 0;
  let currentBgY = 0;

  let targetPortX = 0;
  let targetPortY = 0;
  let currentPortX = 0;
  let currentPortY = 0;

  let isMouseActive = false;

  const handleMouseMove = (e) => {
    // Нормализация координат от -1 до +1 относительно центра экрана
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // 1. ИНВЕРТИРОВАННЫЙ ФОН ZONE 0 (полная интенсивность)
    targetBgX = -normX * 28; // макс. 28px
    targetBgY = -normY * 18; // макс. 18px

    // 2. ИНВЕРТИРОВАННЫЙ ПОРТРЕТ ZONE 1 (интенсивность уменьшена ровно в 2 раза)
    targetPortX = -normX * 14; // макс. 14px
    targetPortY = -normY * 9;  // макс. 9px

    isMouseActive = true;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  const renderParallax = () => {
    if (isMouseActive) {
      // Плавная интерполяция (Lerp)
      currentBgX += (targetBgX - currentBgX) * 0.08;
      currentBgY += (targetBgY - currentBgY) * 0.08;

      currentPortX += (targetPortX - currentPortX) * 0.08;
      currentPortY += (targetPortY - currentPortY) * 0.08;

      // 1. Смещение активного фона (с масштабом scale 1.04)
      bgLayers.forEach((bg) => {
        if (bg.classList.contains('active')) {
          bg.style.transform = `scale(1.04) translate3d(${currentBgX.toFixed(2)}px, ${currentBgY.toFixed(2)}px, 0)`;
        }
      });

      // 2. Смещение активного портрета (СТРОГО БЕЗ scale)
      portraitLayers.forEach((portrait) => {
        if (portrait.classList.contains('active')) {
          portrait.style.transform = `translate3d(${currentPortX.toFixed(2)}px, ${currentPortY.toFixed(2)}px, 0)`;
        }
      });
    }
    requestAnimationFrame(renderParallax);
  };

  requestAnimationFrame(renderParallax);
}
```

### 3.3. Изменения в `src/styles/team.css`

В правиле `.player-portrait-img` (строка 239) убирается блокирующее свойство `transform: none !important;`, чтобы inline-стили параллакса могли беспрепятственно управлять положением:

```css
/* В src/styles/team.css (строки 223–242): */
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
  transform: translate3d(0, 0, 0); /* TASK-076: Разрешено динамическое перемещение параллакса */
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
  transition: opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), 
              visibility 0.7s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.12s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: opacity, transform;
}
```

---

## 4. Пункт 3: Градиентный Переход между Секцией 3.4 и Секцией 3.5

### 4.1. Архитектура Двухстороннего Шва
Аналогично решению из TASK-066 / TASK-068:
1. **Нижний шов Секции 3.4 (`.team-seam-gradient-bottom`):**  
   Физический DOM-слой в нижней части `.team-sticky-viewport`, плавно гасящий фото и лучи в монолитный цвет `#0F0F0F` на выходе из секции.
2. **Двухсторонняя маска `.team-bg-layer`:**  
   Маска на растровых изображениях баз гасит текстуру в прозрачность не только сверху, но и снизу (`calc(100% - 180px)`).
3. **Верхний градиентный шлейф Секции 3.5 (`.doctrine-section::before`):**  
   Сплайновый градиент высотой `clamp(145px, 18vh, 235px)`, начинающийся от чистого `#0F0F0F` на линии стыка и растворяющийся в прозрачность к центру Доктрины.

### 4.2. Разметка в `index.html`

Внутри `.team-sticky-viewport` (строки 427–429) добавляется элемент `.team-seam-gradient-bottom`:

```html
          <!-- Zone 1: Character Portrait PNG Layer (.col-4 / .team-zone-1, z-index: 2) -->
          <div class="col-4 team-zone-1">
            <div class="team-portrait-wrapper">
              <img src="/assets/images/PORTRAIT PNG Presa4ek.png?v=3" alt="Presa4ek Portrait" class="player-portrait-img layer-0 active" data-portrait-id="0" />
              <img src="/assets/images/PORTRAIT PNG Art1zi.png?v=3" alt="Art1zi Portrait" class="player-portrait-img layer-1" data-portrait-id="1" />
              <img src="/assets/images/PORTRAIT PNG Matvi4.png?v=4" alt="Matvi4 Portrait" class="player-portrait-img layer-2" data-portrait-id="2" />
            </div>
          </div>
        </div>
      </div>

      <!-- TASK-076: Нижний градиентный шов перехода между Секцией 3.4 и Секцией 3.5 -->
      <div class="team-seam-gradient-bottom" aria-hidden="true"></div>
    </div>
  </section>
```

### 4.3. Стилизация в `src/styles/team.css`

1. Добавляется класс `.team-seam-gradient-bottom`:

```css
/* TASK-076: Физический нижний слой градиентного шва над холстом WebGL и фонами */
.team-seam-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: clamp(145px, 18vh, 235px);
  background: linear-gradient(
    to top,
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
  z-index: 3; /* Поверх лучей и фонов, под интерактивным контентом */
  transform: translateZ(10px);
}
```

2. Обновляется `mask-image` на `.team-bg-layer` (двухстороннее затухание):

```css
  /* TASK-076: Двухсторонняя градиентная маска фонов (плавное затухание сверху И снизу) */
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) calc(100% - 180px),
    rgba(0, 0, 0, 0.75) calc(100% - 130px),
    rgba(0, 0, 0, 0.35) calc(100% - 70px),
    rgba(0, 0, 0, 0.05) calc(100% - 25px),
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 25px,
    rgba(0, 0, 0, 0.35) 70px,
    rgba(0, 0, 0, 0.75) 130px,
    rgba(0, 0, 0, 1) 180px,
    rgba(0, 0, 0, 1) calc(100% - 180px),
    rgba(0, 0, 0, 0.75) calc(100% - 130px),
    rgba(0, 0, 0, 0.35) calc(100% - 70px),
    rgba(0, 0, 0, 0.05) calc(100% - 25px),
    rgba(0, 0, 0, 0) 100%
  );
```

### 4.4. Стилизация в `src/styles/doctrine.css`

В [src/styles/doctrine.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/doctrine.css) добавляется верхний градиентный шлейф:

```css
/* TASK-076: Верхний градиентный шлейф Секции Доктрина для бесшовного стыка с Секцией 3.4 */
.doctrine-section::before {
  content: "";
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
  z-index: 1; /* Под карточками доктрины, над базовым фоном */
}
```

---

## 5. План Верификации и Тестирования

1. **Хедер (TargetCursor Exclusion):**
   - [x] При наведении курсора на логотип NUANCE в хедере скобки прицела НЕ растягиваются и НЕ блокируются по краям логотипа.
   - [x] При наведении на ссылки навигации («О Нас», «Команда», «Доктрина», «Контакты») курсор свободно скользит в режиме вращения.
   - [x] При открытии и выборе языков в выпадающем меню курсор не залипает на пунктах списка.
   - [x] При переходе курсора с хедера на Hero или карточки Доктрины магнетизм мгновенно активируется в штатном режиме.

2. **Параллакс Портретов Персонажей (Zone 1):**
   - [x] При движении курсора мыши в Секции 3.4 портрет активного бойца смещается инвертировано (мышь вправо $\to$ боец влево).
   - [x] Масштаб портрета остается постоянным (`scale(1.0)`).
   - [x] Амплитуда движения портрета ровно в 2 раза меньше амплитуды фона (визуальный эффект многоплановой глубины).
   - [x] При переключении между игроками (Presa4ek $\to$ Art1zi $\to$ Matvi4) смена происходит плавно через 0.7s crossfade без скачков.

3. **Межсекционный шов 3.4 $\to$ 3.5:**
   - [x] При прокрутке от Секции 3.4 к Секции 3.5 отсутствует резкая полоса/граница раздела.
   - [x] Нижний край Секции 3.4 плавно затухает в цвет `#0F0F0F`.
   - [x] Верхний край Секции 3.5 мягко проявляется из цвета `#0F0F0F`.
   - [x] Фоновый водяной знак логотипа в Доктрине и карточки сохраняют правильный z-index и читаемость.
