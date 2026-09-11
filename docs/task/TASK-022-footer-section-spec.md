# TASK-022: Спецификация Секции "3.7. Footer / Подвал"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/main.css` (или `src/styles/footer.css`)  
**PRD Reference:** Section 3.8 Footer (Подвал)

---

## 1. Контекст и Цель Модификации
Разработка утилитарного подвала в инженерном HUD-стиле с матовым стеклянным оформлением (Glassmorphism), аналогичным глобальной шапке Header:
1. 3-колоночная архитектура верстки (Логотип и копирайт, Быстрая навигация, Тактические метаданные).
2. Стеклянный фон (`backdrop-filter: blur(20px)`), соединенный с верхней рамкой `1px solid rgba(255, 255, 255, 0.12)`.
3. Тактические метаданные: гео-часовой пояс `SYSTEM TIME // UTC+3`, индикатор активности серверов `SERVERS ONLINE [99.9%]`, интерактивая кнопка плавного подъема наверх `SCROLL TO TOP [▲]`.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Сетка и Архитектура Контейнера (`footer.footer`)
- **Контейнер подвала (`footer.footer`):**
  - `width: 100%; padding: 48px 0 32px 0; position: relative; z-index: 10`.
  - `background: rgba(20, 28, 41, 0.65); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%)`.
  - `border-top: 1px solid rgba(255, 255, 255, 0.12)`.
- **Внутренняя 12-колоночная сетка (`.grid-12`):**
  - **Колонка 1 (`.col-4` / Слева):** Логотип отряда + Юридический копирайт.
  - **Колонка 2 (`.col-4` / По центру):** Быстрые навигационные якорные ссылки.
  - **Колонка 3 (`.col-4` / Справа):** Тактические метаданные + Кнопка `[▲ TOP]`.

---

### 2.2. Содержимое Колонок (Content Spec)

#### **Колонка 1: Бренд и Копирайт (`.footer-brand-col`)**
- **Логотип (`.footer-logo`):**
  - Файл: `/assets/images/2_Header.png` (или текстовый бренд `NUANCE`).
  - `height: 28px; width: auto; margin-bottom: 16px`.
- **Копирайт (`.footer-copyright`):**
  - `font-family: var(--font-body)` (`JetBrains Mono 400`), `font-size: 0.75rem` (12px), `color: #888888; line-height: 1.5`.
  - Текст: `© 2026 NUANCE TACTICAL GROUP. ALL RIGHTS RESERVED.`
  - Дисклеймер: `Утилитарная архитектура быстрого реагирования.`

#### **Колонка 2: Навигация (`.footer-nav-col`)**
- **Заголовок колонки (`.footer-col-title`):**
  - `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: 0.85rem`, Uppercase, `color: #FFFFFF; margin-bottom: 16px; letter-spacing: 0.08em`.
  - Текст: `// НАВИГАЦИЯ`
- **Список ссылок (`.footer-nav-list`):**
  - `display: flex; flex-direction: column; gap: 8px`.
  - Ссылки: `#genesis` (О нас), `#team` (Команда), `#projects` (Проекты), `#cta` (Контакты).
  - Стили ссылок: `font-family: var(--font-body)`, `font-size: 0.82rem`, `color: #888888; text-transform: uppercase`.
  - `:hover` ➔ `color: #FFFFFF; padding-left: 4px; transition: all 0.2s ease`.

#### **Колонка 3: Тактические Метаданные и Кнопка «Наверх» (`.footer-meta-col`)**
- **Заголовок колонки:**
  - `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: 0.85rem`, Uppercase, `color: #FFFFFF; margin-bottom: 16px; letter-spacing: 0.08em`.
  - Текст: `// СИСТЕМНЫЙ СТАТУС`
- **Тактические параметры (`.footer-meta-list`):**
  - Часовой пояс: `TIMEZONE: UTC+3 // KYIV / WARSAW`
  - Серверы: `SERVERS: ONLINE [99.9%]` *(с зеленым индикатором `#C1FF00`)*
- **Интерактивная кнопка «Наверх» (`.btn-scroll-top`):**
  - `display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 8px 16px; background: rgba(15, 15, 15, 0.6); border: 1px solid rgba(39, 53, 77, 0.6); border-radius: 6px; cursor: pointer`.
  - `font-family: var(--font-body)`, `font-size: 0.75rem`, `font-weight: 700; color: #FFFFFF; text-transform: uppercase`.
  - Клик вызовет плавный подъем в самый верх через Lenis (`lenis.scrollTo(0, { duration: 1 })`).
  - `:hover` ➔ `border-color: #00E5FF; color: #00E5FF; box-shadow: 0 0 12px rgba(0, 229, 255, 0.2)`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Подвал имеет матовое стеклянное оформление (Glassmorphism) с `backdrop-filter: blur(20px)`.
- [ ] Выстроена 3-колоночная сетка (Логотип/копирайт ➔ Навигация ➔ Метаданные + Кнопка наверх).
- [ ] Кнопка `[▲ TOP]` осуществляет плавную прокрутку к началу страницы.
- [ ] Копирайт содержит текст: `© 2026 NUANCE TACTICAL GROUP. ALL RIGHTS RESERVED.`
