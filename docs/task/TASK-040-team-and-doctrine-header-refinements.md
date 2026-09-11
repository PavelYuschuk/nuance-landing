# TASK-040: Очистка Линий-Трекеров и Позиционирование Заголовка «Команда» Над Ростером (Zone 3)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/styles/doctrine.css`  
**Parent Specification:** TASK-039 (`docs/task/TASK-039-bounded-font-unification-and-section-headers.md`)

---

## 1. Контекст и Цель Модификации
1. **Удаление линий-трекеров:** Устранение элементов прогресс-бара (`.section-tracker-line` / `.progress-tracker`) из секций **3.4 (Команда)** и **3.5 (Доктрина)**. В этих блоках остается строго чистая типографика заголовка Bounded Bold.
2. **Локализация заголовка «Команда» над Zone 3:** В секции 3.4 заголовок `Команда` монтируется непосредственно над карточками вертикального ростера навигации (**Zone 3: Left Vertical Roster Navigation**), образуя единую левую колонку.
3. **Адаптация кегля и вертикального ритма:** Подбор высоты шрифта и отступов, гарантирующий, что заголовок вместе с 3 карточками по 160px не ломает 100vh вьюпорт и не выталкивает элементы вниз.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Изменения в Секции 3.5 «Доктрина» (`index.html` & `src/styles/doctrine.css`)
- **Разметка (`index.html`):** Полностью удалить тег `.section-tracker-line` / `.doctrine-progress-tracker`.
- **Итоговая структура заголовка Доктрины:**
```html
<div class="doctrine-header-subblock">
  <h2 class="section-main-title">Доктрина</h2>
</div>
```
- **Стили (`src/styles/doctrine.css`):**
```css
.doctrine-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: clamp(24px, 3.5vw, 44px);
  width: 100%;
}

.doctrine-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
}
```

---

### 2.2. Позиционирование Заголовка «Команда» Над Ростером (Zone 3) в 3.4

В секции 3.4 заголовок переносится внутрь левой колонки (`.col-3` / Zone 3) прямо над списком карточек:

```html
<!-- index.html: Секция 3.4 Команда -->
<div class="col-3 team-zone-3-wrapper">
  
  <!-- Заголовок строго над карточками ростера (линия-трекер удалена) -->
  <div class="team-roster-header">
    <h2 class="team-roster-title">Команда</h2>
  </div>

  <!-- Zone 3: Left Vertical Roster Navigation (3 карточки по 160px) -->
  <div class="team-roster-nav">
    <!-- Карточка 0: Presa4ek -->
    <div class="roster-card active" data-player="0">...</div>
    <!-- Карточка 1: Art1zi -->
    <div class="roster-card" data-player="1">...</div>
    <!-- Карточка 2: Matvi4 -->
    <div class="roster-card" data-player="2">...</div>
  </div>

</div>
```

---

### 2.3. Стилизация и Защита от Сдвига Верстки (`src/styles/team.css`)

```css
/* Левая колонка Zone 3: Заголовок + Карточки ростера */
.team-zone-3-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 4;
}

/* Заголовок над карточками */
.team-roster-header {
  margin-bottom: 12px; /* Компактный отступ к первой карточке */
  width: 100%;
}

.team-roster-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(1.4rem, 2.1vw, 2.0rem); /* Адаптированный масштаб */
  text-transform: uppercase;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  line-height: 1.1;
  margin: 0;
  text-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
}

/* Контейнер 3-х карточек ростера */
.team-roster-nav {
  display: flex;
  flex-direction: column;
  gap: 0; /* Монолитная стыковка карточек */
  width: 100%;
}

.roster-card {
  height: 160px; /* Фиксированная каноническая высота */
  width: 100%;
  position: relative;
  overflow: hidden;
}
```

#### Расчет вертикальной высоты колонки:
`Заголовок (32px) + Отступ (12px) + 3 карточки (3 × 160px = 480px) = 524px`.  
При высоте экрана 1080px (Full HD) или 900px (Laptop), блок 524px с огромным запасом помещается в рабочую область 100vh без риска сдвига вниз или перекрытия другими элементами.

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ равен `Status: DONE`.
- [x] Линия-трекер (`.section-tracker-line`) удалена из секции 3.4 и секции 3.5.
- [x] В секции 3.5 «Доктрина» заголовок отображается чистым текстом шрифтом Bounded Bold.
- [x] В секции 3.4 заголовок «Команда» расположен строго над карточками ростера в левой колонке Zone 3.
- [x] Размер шрифта заголовка «Команда» откалиброван (`clamp(1.4rem, 2.1vw, 2.0rem)`), карточки ростера и заголовок не выходят за пределы 100vh экрана.
