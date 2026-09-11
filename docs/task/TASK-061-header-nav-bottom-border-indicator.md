# TASK-061: Перенос Индикатора Навигации Хедера на Нижнюю Границу (Border-Bottom Segments)

**Status:** DONE  
**Target File(s):** `src/styles/header.css`  
**Parent Specification:** TASK-001, TASK-038, TASK-039  

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал следующее требование к глобальной навигации в **3.1 Header**:

> *«при наведении на кнопки вкладок появляется линия снизу, я хочу ее переместить на: сам Header имеет внизу границу линии которую видно и туда надо переместить сегменты.»*

### Текущее поведение:
- Сейчас элемент меню `.nav-link` имеет внутренние отступы `padding: 6px 0;` и центрируется внутри хедера.
- Псевдоэлемент `.nav-link::after` спозиционирован как `bottom: 0;` относительно самого текста ссылки.
- В результате при наведении (`:hover`) или активации секции (`.active`) белая полоса появляется непосредственно под словом, "зависая" в воздухе посередине хедера.
- При этом у самого контейнера `.header` внизу проходит четкая разделительная линия:  
  `border-bottom: 1px solid rgba(39, 53, 77, 0.4);`.

### Требуемое поведение:
- Убрать зависающую линию из-под текста.
- Перенести световой сегмент индикатора строго на **нижнюю видимую границу хедера** (`border-bottom`).
- При наведении на пункт меню («Генезис», «Команда», «Доктрина», «Штаб») или при скролле (активная секция) соответствующий сегмент на нижней линии хедера должен подсвечиваться ярким неоновым лучом, замещая темную полосу границы под этой вкладкой.

---

## 2. Архитектурный Анализ и Геометрия Слоев

1. **Высота хедера:**
   - Базовая десктопная: `var(--header-height, 64px)`.
   - Full HD (1920×1080): `72px` (TASK-038).
   - 2K / QHD (2560×1440): `84px` (TASK-038).
2. **Иерархия контейнеров:**
   - `.header` (`height: 64px/72px/84px`, `border-bottom: 1px solid rgba(39, 53, 77, 0.4)`).
   - `.header-container` (`height: 100%`, `display: flex`, `align-items: center`).
   - `.header-nav` (`position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 36px;`).
3. **Решение без жестких координат (Auto-Fluid Height):**
   - Если задать `.header-nav { height: 100%; }` и `.nav-link { height: 100%; display: inline-flex; align-items: center; }`:
     - Ссылка растягивается на 100% высоты хедера.
     - Текст пункта меню остается идеально отцентрирован по вертикали.
     - Увеличивается полезная зона кликабельности (Fitts's Law).
     - Нижний край `.nav-link` (`bottom: 0`) **строго совпадает с нижней линией границы хедера** на любых разрешениях экрана (десктоп, 1080p, 2K).
4. **Позиционирование сегмента:**
   - Псевдоэлемент `.nav-link::after` размещается с `bottom: -1px;` и `height: 2px;`.
   - При такой координате линия ложится ровно поверх 1-пиксельного `border-bottom` хедера, создавая эффект динамической световой врезки в физическую границу навигационной панели.

---

## 3. Техническая Спецификация Изменений (`src/styles/header.css`)

### 3.1. Десктопная Спецификация (`min-width: 769px`)

#### БЫЛО (строки 54–104):
```css
/* Nav Links Center (Geometric center of entire screen) */
.header-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 36px;
}

/* ==========================================
   Header: Bounded by Vlad Churkin (TASK-039 Spec)
   ========================================== */

.nav-link {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FFFFFF;
  opacity: 0.75;
  position: relative;
  padding: 6px 0;
  transition: opacity 0.25s ease, color 0.25s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFFFFF;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  opacity: 1;
  color: #FFFFFF;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.4);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

#### СТАЛО:
```css
/* =========================================================
   Header Nav: Сегменты на нижней границе хедера (TASK-061)
   ========================================================= */

/* Контейнер навигации занимает 100% высоты хедера */
.header-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 36px;
  height: 100%; /* Растягивается до нижнего края хедера */
}

.nav-link {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FFFFFF;
  opacity: 0.75;
  position: relative;
  
  /* Полная высота и идеальное центрирование текста: */
  height: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 6px; /* Небольшой горизонтальный буфер для ширины сегмента */
  
  transition: opacity 0.25s ease, color 0.25s ease;
}

/* Световой сегмент на нижней границе хедера */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px; /* Строго на физической линии border-bottom хедера */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #FFFFFF;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.5);
  transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
}

.nav-link:hover,
.nav-link.active {
  opacity: 1;
  color: #FFFFFF;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.4);
}

/* Раскрытие сегмента от центра к краям кнопки */
.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

---

### 3.2. Адаптивная Безопасность для Мобильного Меню (`@media (max-width: 768px)`)

В мобильной версии навигация открывается в виде выпадающей шторки (`flex-direction: column`). Чтобы ссылки в выпадающем меню не растягивались на весь экран по высоте, стили сбрасываются:

```css
@media (max-width: 768px) {
  .header-nav {
    height: auto; /* Сброс 100% высоты в шторке */
  }

  .nav-link {
    height: auto;
    display: block;
    padding: 10px 0;
  }

  .nav-link::after {
    bottom: 0; /* Обычное нижнее подчеркивание в мобильном списке */
    left: 0;
    transform: none;
  }
}
```

---

## 4. Контрольный Чеклист Приемки (Verification Checklist)

| № | Проверяемый параметр | Ожидаемый результат | Статус проверки |
|---|----------------------|---------------------|-----------------|
| 1 | **Позиция линии на десктопе** | При наведении на «Генезис», «Команда», «Доктрина», «Штаб» линия появляется не под словом, а строго на нижней границе хедера (`border-bottom`). | [x] Выполнено |
| 2 | **Анимация раскрытия** | Сегмент раскрывается от центра к краям ширины ссылки плавно (`cubic-bezier(0.25, 1, 0.5, 1)`). | [x] Выполнено |
| 3 | **Активное состояние при скролле** | При скролле до соответствующей секции активный сегмент подсвечивается на нижней границе хедера. | [x] Выполнено |
| 4 | **Совместимость с FHD и 2K** | При масштабировании хедера до 72px (FHD) и 84px (2K) линия автоматически остается точно на нижней границе без смещений. | [x] Выполнено |
| 5 | **Мобильная версия (< 768px)** | В выпадающей шторке мобильного меню пункты остаются списком без поломок верстки. | [x] Выполнено |
