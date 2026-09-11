# TASK-039: Унификация Шрифта Bounded (Vlad Churkin) в Header и Левоориентированные Заголовки Секций (3.3, 3.4, 3.5)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/header.css`, `src/styles/genesis.css`, `src/styles/team.css`, `src/styles/doctrine.css`, `src/styles/variables.css`  
**Font Reference:** `public/assets/fonts/Bounded-Bold.woff2` (Vlad Churkin)

---

## 1. Контекст и Цель Модификации
Создание единой дизайн-системы заголовков и навигации на базе фирменного дисплейного шрифта **Bounded (автор: Vlad Churkin)**:
1. **Header (3.1):** Перевод навигации (`.nav-link`), переключателя языков (`.lang-btn`) на шрифт Bounded.
2. **Генезис (3.3):** Заголовок левоориентированного подблока `О нас` переводится на Bounded Bold.
3. **Команда (3.4):** Интеграция идентичного левоориентированного подблока с заголовком `Команда` шрифтом Bounded Bold.
4. **Доктрина (3.5):** Интеграция идентичного левоориентированного подблока с заголовком `Доктрина` шрифтом Bounded Bold.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Шрифт Bounded в Header (`src/styles/header.css`)

```css
/* ==========================================
   Header: Bounded by Vlad Churkin
   ========================================== */

.nav-link {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FFFFFF;
  opacity: 0.75;
  transition: opacity 0.25s ease, color 0.25s ease;
}

.nav-link:hover,
.nav-link.active {
  opacity: 1;
  color: #FFFFFF;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.4);
}

.lang-btn {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

---

### 2.2. Унифицированный Компонент Левоориентированного Подблока

Создается единый переиспользуемый визуальный блок `.section-header-subblock`:
- Размещается в верхнем левом углу контентного контейнера перед сеткой элементов.
- Выравнивание: строго по левой направляющей 12-колоночной сетки (`align-self: flex-start; text-align: left;`).
- Заголовок `.section-main-title`: Bounded Bold, `clamp(2rem, 4vw, 3.5rem)`, Uppercase, `#FFFFFF`.
- Монолитная линия-трекер: `height: 2px; width: 100%; max-width: 280px; background: rgba(255, 255, 255, 0.15);`.

```css
/* Базовые стили левоориентированного подблока */
.section-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 320px;
  align-self: flex-start;
}

.section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 3.8vw, 3.4rem);
  text-transform: uppercase;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  line-height: 1.05;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.12);
}

.section-tracker-line {
  width: 100%;
  max-width: 280px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.section-tracker-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #FFFFFF;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}
```

---

### 2.3. Внедрение в Секции (`index.html`)

#### **1. Секция 3.3 «Генезис»:**
```html
<!-- Левоориентированный подблок: О нас -->
<div class="about-header-subblock section-header-subblock">
  <h1 class="about-main-title section-main-title">О нас</h1>
  <div class="about-progress-tracker section-tracker-line">
    <div class="about-progress-fill section-tracker-fill"></div>
  </div>
</div>
```

#### **2. Секция 3.4 «Команда»:**
Добавляется в начало `.team-screen-container` перед сеткой ростера:
```html
<!-- Левоориентированный подблок: Команда -->
<div class="team-header-subblock section-header-subblock">
  <h2 class="team-main-title section-main-title">Команда</h2>
  <div class="team-progress-tracker section-tracker-line">
    <div class="section-tracker-fill" style="width: 33.33%;"></div>
  </div>
</div>
```

#### **3. Секция 3.5 «Доктрина»:**
Заменяет центрированный заголовок `.doctrine-header` на левоориентированный подблок:
```html
<!-- Левоориентированный подблок: Доктрина -->
<div class="doctrine-header-subblock section-header-subblock">
  <h2 class="doctrine-main-title section-main-title">Доктрина</h2>
  <div class="doctrine-progress-tracker section-tracker-line">
    <div class="section-tracker-fill" style="width: 100%;"></div>
  </div>
</div>
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ установлен строго в `Status: DONE`.
- [x] В шапке Header навигационные ссылки отображаются шрифтом Bounded (Vlad Churkin).
- [x] Заголовок «О нас» в секции 3.3 переведен на Bounded Bold.
- [x] В секцию 3.4 «Команда» добавлен левоориентированный подблок с заголовком «Команда» в шрифте Bounded Bold.
- [x] В секцию 3.5 «Доктрина» добавлен левоориентированный подблок с заголовком «Доктрина» в шрифте Bounded Bold.
- [x] Все три левоориентированных подблока строго выровнены по одной левой вертикальной направляющей сетки.
