# TASK-047: Унификация Размера Заголовков Разделов до 45px Без Смещения Блоков

**Status:** DONE  
**Target File(s):** `src/styles/genesis.css`, `src/styles/team.css`, `src/styles/doctrine.css`, `src/styles/socials.css`  
**Sections Impacted:** 3.3 (Генезис), 3.4 (Команда), 3.5 (Доктрина), 3.6 (Call to Action)

---

## 1. Контекст и Инженерная Задача
1. **Единый стандарт кегля заголовков разделов:**  
   Снижение и строгое фиксирование размера шрифта до **`45px`** для 4-х ключевых заголовков сайта:
   - **«О нас»** (`3.3. Sticky Scroll Section`)
   - **«Команда»** (`3.4. Team Character Selector Section`)
   - **«Доктрина»** (`3.5. Doctrine Section`)
   - **«Присоединиться к отряду»** (`3.6. Call to Action`)
2. **Гарантия стабильности верстки (Zero Layout Shift):**  
   Изменение кегля не должно смещать, сдвигать или перестраивать нижележащие блоки (карточки, слайды, инфо-панели, статы). Для этого сохраняются исходные вертикальные габариты строк и внешние отступы (`margin-bottom`, `min-height`).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Секция 3.3 «Генезис» (`src/styles/genesis.css`)

```css
/* Заголовок "О нас" */
.about-main-title,
.about-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px; /* Строго 45px */
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0 0 8px 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

/* Сохранение высоты подблока для предотвращения сдвига контента ниже */
.about-header-subblock {
  margin-bottom: 28px;
  min-height: 60px;
}
```

---

### 2.2. Секция 3.4 «Команда» (`src/styles/team.css`)

```css
/* Заголовок "Команда" */
.team-main-title,
.team-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px; /* Строго 45px */
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

/* Сохранение внешнего отступа подблока */
.team-header-subblock {
  margin-bottom: 28px;
  min-height: 60px;
}
```

---

### 2.3. Секция 3.5 «Доктрина» (`src/styles/doctrine.css`)

```css
/* Заголовок "Доктрина" */
.doctrine-main-title,
.doctrine-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px; /* Строго 45px */
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.12);
}

/* Отступ до сетки карточек доктрины без смещения */
.doctrine-header-subblock {
  margin-bottom: clamp(24px, 3.5vw, 44px);
  min-height: 60px;
}
```

---

### 2.4. Секция 3.6 «Call to Action» (`src/styles/socials.css`)

```css
/* Заголовок "Присоединиться к отряду" */
.cta-main-title {
  font-family: 'Bounded', sans-serif; /* или var(--font-heading) */
  font-weight: 700;
  font-size: 45px; /* Строго 45px */
  line-height: 1.15;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
}

/* Отступ до карточек соцсетей зафиксирован */
.cta-header-block {
  margin-bottom: 56px;
}
```

---

### 2.5. Адаптивные Пересчеты для Планшетов и Смартфонов

На экранах шире 1024px размер зафиксирован на **`45px`**. Для мобильных экранов (где 45px превышает ширину вьюпорта) предусмотрено пропорциональное уменьшение:

```css
@media (max-width: 768px) {
  .about-main-title,
  .team-main-title,
  .doctrine-main-title,
  .cta-main-title {
    font-size: 32px !important;
    line-height: 1.2;
  }
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Размер шрифта заголовка «О нас» установлен в `45px`.
- [x] Размер шрифта заголовка «Команда» установлен в `45px`.
- [x] Размер шрифта заголовка «Доктрина» установлен в `45px`.
- [x] Размер шрифта заголовка «Присоединиться к отряду» установлен в `45px`.
- [x] Отступы и положение карточек ростера, инфо-панелей, слайдов и соцсетей остались абсолютно стабильными (без сдвига верстки).
