# TASK-067: Glass Effect для Дропдауна Языков, Обновление Ассетов (Zone 3 и Matvi4) и Выравнивание Ростера по Горизонту Секции

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/header.css`, `src/styles/team.css`  
**Parent Specification:** TASK-045, TASK-049, TASK-064, TASK-065  
**Assets Location:** `public/assets/images/`  

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал комплекс из 4 задач:

1. **<!-- Выпадающее меню с 3 языками и радио-индикаторами -->:**  
   Добавить glass effect выпадающему списку как у `<!-- 3.1 Header (Глобальная навигация) -->`.
2. **Обновить все иллюстрации <!-- Zone 3: Left Vertical Roster Navigation -->:**  
   Пользователь загрузил обновленные арты карточек ростера в `public/assets/images/` (`Presa4ek SCALE Vertical Roster Navigation.png`, `Art1zi SCALE Vertical Roster Navigation.png`, `Matvi4 Vertical Roster Navigation.png`).
3. **Обновить иллюстрацию `PORTRAIT PNG Matvi4.png`:**  
   Пользователь обновил полноразмерный арт оперативника Matvi4 в `public/assets/images/`.
4. **<!-- Zone 3: Left Vertical Roster Navigation --> — выравнивание по горизонту секции относительно всей секции:**  
   Устранить смещение ростера вниз под подблок заголовка `КОМАНДА`. Выровнять вертикальный ростер строго по линии горизонта (центральной горизонтальной оси 50vh) относительно всей 100vh высоты секции, обеспечив безупречную левую посадку по сетке.

---

## 2. Анализ и Инженерные Решения

### 2.1. Идентичный Glass Effect для Dropdown Списка Языков (`3.1 Header`)
В `src/styles/header.css` компонент `3.1 Header` обладает эталонными физическими свойствами матового стекла:
```css
background: rgba(15, 15, 15, 0.7);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border-bottom: 1px solid rgba(39, 53, 77, 0.4);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
```
Для выпадающего меню `.lang-dropdown` параметры приводятся к полной стилистической конвергенции:
- **Базовый фон:** `background: rgba(15, 15, 15, 0.7);`
- **Оптический блюр и насыщенность:** `backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);`
- **Контурная рамка:** `border: 1px solid rgba(39, 53, 77, 0.5);`
- **Многоуровневая глубина:** `box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);`
- **Элементы списка:** мягкая подсветка `rgba(255, 255, 255, 0.08)` при наведении и деликатный неоновый циановый акцент при активации.

---

### 2.2. Синхронизация Обновленных Ассетов и Сброс Кеша Браузера
Проверены метки времени файлов в каталоге `public/assets/images/`:
- `PORTRAIT PNG Matvi4.png` — обновлен в `00:33:32` (размер 2 514 027 байт).
- `Presa4ek SCALE Vertical Roster Navigation.png` — обновлен в `00:31:54` (размер 263 587 байт).
- `Art1zi SCALE Vertical Roster Navigation.png` — обновлен в `00:31:44` (размер 256 925 байт).
- `Matvi4 Vertical Roster Navigation.png` — обновлен в `00:31:31` (размер 248 848 байт).

Для немедленного принудительного обновления в браузерах пользователей все 4 пути снабжаются версионным параметром `?v=4`.

---

### 2.3. Геометрический Расчет Выравнивания Zone 3 по Горизонту Секции

#### Анализ первопричины смещения вниз:
1. Полезная высота вьюпорта секции: `H = 100vh` (например, `1080px` на Full HD).
2. Верхний паддинг `.team-sticky-viewport`: `padding-top = calc(var(--header-height, 64px) + 36px) = 100px`.
3. Нижний паддинг `.team-sticky-viewport`: `padding-bottom = 24px`.
4. Автономный подблок `КОМАНДА`: `min-height = 52px; margin-bottom = 24px;` (суммарно $S = 76px$).
5. Высота 3-х карточек ростера: $R = 3 \times 160px = 480px$.
6. Высота доступной контентной сетки:
   $$G = 1080 - 100 - 24 - 76 = 880px$$
7. При обычном `margin: auto 0;` внутри сетки карточки ростера центрируются относительно пространства *под* заголовком:
   - Расстояние от верхнего края экрана: $100 + 76 + \frac{880 - 480}{2} = 176 + 200 = \mathbf{376px}$.
   - Расстояние от нижнего края экрана: $24 + 200 = \mathbf{224px}$.
   - **Асимметрия составляет:** $376 - 224 = \mathbf{152px}$!
8. Из-за этого ростер визуально «проваливается» вниз относительно центральной оси экрана.

#### Математика выравнивания на горизонт 50vh:
Чтобы центр карточек ростера находился строго на линии горизонта секции ($Y = 50vh = 540px$):
$$D_{\text{top}} = D_{\text{bottom}} = \frac{1080 - 480}{2} = 300px$$
Требуемое смещение ростера вверх:
$$\Delta Y = 376 - 300 = \mathbf{76px}$$
Формула в общем виде:
$$\Delta Y = \frac{P_{\text{top}} - P_{\text{bottom}} + S}{2} = \frac{100 - 24 + 76}{2} = \mathbf{76px}$$
На экранах 2K (1440p):
$$\Delta Y_{2K} = \frac{120 - 24 + 88}{2} = \mathbf{92px}$$

Кроме того, по горизонтали ростер строго фиксируется по левой вертикальной направляющей подблока `КОМАНДА` (`align-items: flex-start; margin-left: 0;`), гарантируя безупречную архитектурную посадку.

---

## 3. Техническая Спецификация Изменений

### 3.1. Изменения в `index.html` (обновление путей ассетов до `?v=4`)

#### 1. Карточки Zone 3 (Left Vertical Roster Navigation, строки 247–266):
```html
<!-- Player 0 Card: Presa4ek -->
<div class="roster-card active" data-player-id="0">
  <img src="/assets/images/Presa4ek SCALE Vertical Roster Navigation.png?v=4" alt="Presa4ek" class="roster-card-img" />
  <div class="roster-card-overlay"></div>
  <span class="roster-card-name">Presa4ek</span>
</div>

<!-- Player 1 Card: Art1zi -->
<div class="roster-card" data-player-id="1">
  <img src="/assets/images/Art1zi SCALE Vertical Roster Navigation.png?v=4" alt="Art1zi" class="roster-card-img" />
  <div class="roster-card-overlay"></div>
  <span class="roster-card-name">Art1zi</span>
</div>

<!-- Player 2 Card: Matvi4 -->
<div class="roster-card" data-player-id="2">
  <img src="/assets/images/Matvi4 Vertical Roster Navigation.png?v=4" alt="Matvi4" class="roster-card-img" />
  <div class="roster-card-overlay"></div>
  <span class="roster-card-name">Matvi4</span>
</div>
```

#### 2. Портрет Matvi4 в Zone 1 (строка 332):
```html
<div class="team-portrait-item" data-player-id="2">
  <img src="/assets/images/PORTRAIT PNG Matvi4.png?v=4" alt="Matvi4" class="team-portrait-img" loading="lazy" />
</div>
```

---

### 3.2. Изменения в `src/styles/header.css` (Glass Effect для `.lang-dropdown`)

Замена стилей выпадающего списка на идентичные свойства `3.1 Header`:

```css
/* =========================================================
   TASK-067: Header Identical Glass Effect for Dropdown
   ========================================================= */

/* Выпадающий список (Glassmorphic Dropdown идентично 3.1 Header) */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 165px;
  
  /* Точные параметры матового стекла Header (строки 13-19 header.css): */
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(39, 53, 77, 0.5);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 
              0 2px 8px rgba(0, 0, 0, 0.3);
  
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 1000;
  
  /* Анимация появления */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.22s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.22s cubic-bezier(0.25, 1, 0.5, 1),
              visibility 0.22s;
}

/* При открытии */
.lang-switcher.is-open .lang-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* Интерактивные пункты списка */
.lang-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  outline: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.lang-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.lang-dropdown-item.active {
  background: rgba(0, 240, 255, 0.08);
}
```

---

### 3.3. Изменения в `src/styles/team.css` (Выравнивание Zone 3 по Горизонту Секции)

В `src/styles/team.css` (строки 253–280):

#### БЫЛО:
```css
.team-zone-3 {
  position: relative;
  z-index: 4;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.team-roster-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 326px;
  margin: auto 0;
  border: 1px solid rgba(39, 53, 77, 0.4);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 4;
}
```

#### СТАЛО:
```css
/* =========================================================
   TASK-067: Zone 3 Выравнивание по Горизонту 50vh Секции
   ========================================================= */

.team-zone-3 {
  position: relative;
  z-index: 4;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* Идеальное выравнивание по левой направляющей подблока «КОМАНДА» */
  height: 100%;
  width: 100%;
}

.team-roster-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: 326px;
  margin: auto 0;
  border: 1px solid rgba(39, 53, 77, 0.4);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 4;

  /* Компенсация асимметрии шапки секции для строгой посадки на горизонт 50vh всей секции: */
  transform: translateY(-76px);
}
```

#### Адаптивные медиа-правила:
```css
/* Full HD (1920 × 1080 px): */
@media (min-width: 1600px) and (max-width: 2048px) {
  .team-roster-nav {
    transform: translateY(-76px);
  }
}

/* 2K / QHD (2560 × 1440 px): */
@media (min-width: 2049px) {
  .team-roster-nav {
    transform: translateY(-92px);
  }
}

/* Планшеты и Мобильные (<= 768px): */
@media (max-width: 768px) {
  .team-roster-nav {
    transform: none; /* Сброс в мобильном стековом потоке */
  }
}
```

---

## 4. План Верификации и Тестирования

1. **Проверка Glass Effect для выпадающего меню:**
   - [x] Выполнено: При клике на кнопку выбора языка дропдаун открывается с идентичной шапке матовой текстурой `rgba(15, 15, 15, 0.7)` и `backdrop-filter: blur(20px) saturate(180%)`.
   - [x] Выполнено: Контур меню имеет четкую рамку `border: 1px solid rgba(39, 53, 77, 0.5)`.

2. **Проверка обновления ассетов:**
   - [x] Выполнено: Карточки Presa4ek, Art1zi и Matvi4 в Zone 3 загружают свежие изображения со сбросом кеша (`?v=4`).
   - [x] Выполнено: Портрет Matvi4 в Zone 1 загружает новую иллюстрацию (`PORTRAIT PNG Matvi4.png?v=4`).

3. **Проверка центровки по горизонту секции:**
   - [x] Выполнено: Центр карточек вертикального ростера Zone 3 находится строго на горизонтальной оси 50vh секции.
   - [x] Выполнено: Расстояние от верхнего края экрана до верха ростера равно расстоянию от низа экрана до низа ростера (`~300px` на Full HD).
   - [x] Выполнено: Левый край ростера идеально состыкован по одной вертикали с заголовком «КОМАНДА».
