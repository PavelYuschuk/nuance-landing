# TASK-038: Адаптация Секций под Мониторы Full HD (1080p) и 2K/QHD (1440p)

**Status:** DONE  
**Target File(s):** `src/styles/variables.css`, `src/styles/grid.css`, `src/styles/header.css`, `src/styles/genesis.css`, `src/styles/team.css`, `src/styles/doctrine.css`, `src/styles/socials.css`, `src/styles/footer.css`  
**Exceptions (Строго НЕ ТРОГАТЬ):** `.global-bg`, `<!-- 3.2 Hero-блок -->`

---

## 1. Контекст и Инженерная Задача
Адаптация ключевых интерфейсных блоков сайта под современные десктопные стандарты отображения:
1. **Full HD (1920 × 1080 px, 16:9):** Основной стандарт настольных мониторов и ноутбуков.
2. **2K / QHD (2560 × 1440 px, 16:9):** Профессиональные мониторы повышенного разрешения.

### ⚠️ Исключения:
- **`.global-bg`** и **`<!-- 3.2 Hero-блок -->`** остаются **в текущем виде без каких-либо изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Глобальная Сетка и Контейнер (`src/styles/variables.css` & `grid.css`)

Чтобы на экранах 2K (ширина 2560px) контент не зажимался в узкую 1440px полоску с полуметровыми пустыми полями по бокам:

```css
:root {
  /* Базовые параметры (ноутбуки до 1440px) */
  --container-max-width: 1440px;
  --container-padding: 32px;
  --grid-gap: 24px;
}

/* =========================================================
   1. FULL HD СТАНДАРТ (1920 × 1080 px):
   ========================================================= */
@media (min-width: 1600px) and (max-width: 2048px) {
  :root {
    --container-max-width: 1540px;
    --container-padding: 48px;
    --grid-gap: 28px;
  }
}

/* =========================================================
   2. 2K / QHD СТАНДАРТ (2560 × 1440 px):
   ========================================================= */
@media (min-width: 2049px) {
  :root {
    --container-max-width: 1820px;
    --container-padding: 64px;
    --grid-gap: 36px;
  }
}
```

---

### 2.2. Адаптация Секции 3.1 «Header» (`src/styles/header.css`)

- **Full HD (1920px):**  
  `padding: 0 48px; height: 72px;`  
  Навигационные ссылки: `font-size: 0.85rem; gap: 36px;`
- **2K / QHD (2560px):**  
  `padding: 0 64px; height: 84px;`  
  Логотип: `height: 36px;`  
  Навигационные ссылки: `font-size: 0.95rem; gap: 48px; letter-spacing: 0.08em;`  
  Кнопки языков: `font-size: 0.95rem; padding: 6px 12px;`

---

### 2.3. Адаптация Секции 3.3 «Генезис / Sticky Scroll» (`src/styles/genesis.css`)

Секция имеет высоту вьюпорта 100vh. На экранах 1080p и 1440p контент идеально центрируется:

- **Full HD (1920 × 1080):**
  - Заголовок `.about-sub-title`: `38px; line-height: 1.15;`
  - Текст `.genesis-paragraph`: `18px; line-height: 1.55;`
  - Изображение `.genesis-image-block`: `aspect-ratio: 16 / 10; max-height: 520px; border-radius: 14px;`
- **2K / QHD (2560 × 1440):**
  - Заголовок `.about-sub-title`: `48px; line-height: 1.2; margin-bottom: 14px;`
  - Текст `.genesis-paragraph`: `22px; line-height: 1.6; gap: 20px;`
  - Прогресс-бар трекера: `max-width: 380px; height: 3px;`
  - Изображение `.genesis-image-block`: `aspect-ratio: 16 / 10; max-height: 680px; border-radius: 18px;`

---

### 2.4. Адаптация Секции 3.4 «Команда / Character Selector» (`src/styles/team.css`)

- **Full HD (1920 × 1080):**
  - **Zone 3 (Левый ростер):** Карточки высотой `160px`, `width: 100%`, комфортное размещение 3-х карточек по высоте (480px + gaps).
  - **Zone 4 (Центральная инфо-панель):**  
    Никнейм `.team-player-name`: `38px;`  
    Роль `.team-player-role`: `18px;`  
    Цитата и описание: `18px; line-height: 1.5;`  
    Шкалы статов: `height: 5px; font-size: 0.85rem;`
  - **Zone 1 (Портрет справа):** `max-height: min(85vh, 850px);`
- **2K / QHD (2560 × 1440):**
  - **Zone 3 (Левый ростер):** Карточки высотой `190px`, шрифт имен в карточках `1.2rem;`
  - **Zone 4 (Центральная инфо-панель):**  
    Никнейм `.team-player-name`: `48px;`  
    Роль `.team-player-role`: `22px; margin-bottom: 12px;`  
    Цитата и описание: `22px; line-height: 1.6;`  
    Линия прогресса цитаты: `max-width: 480px; height: 3px;`  
    Шкалы статов: `height: 6px; font-size: 1rem; margin-bottom: 8px;`
  - **Zone 1 (Портрет справа):** `max-height: min(85vh, 1150px);`

---

### 2.5. Адаптация Секции 3.5 «Доктрина» (`src/styles/doctrine.css`)

Сетка из 3-х карточек:

- **Full HD (1920 × 1080):**
  - Высота карточек `.doctrine-card`: `clamp(480px, 55vh, 560px);`
  - Заголовок карточки: `1.6rem;`
  - Текст описания при ховере: `1rem; line-height: 1.6;`
- **2K / QHD (2560 × 1440):**
  - Сетка: `gap: 40px;`
  - Высота карточек `.doctrine-card`: `clamp(580px, 56vh, 680px); border-radius: 20px;`
  - Заголовок секции H2: `3.5rem; margin-bottom: 64px;`
  - Заголовок карточки: `2rem;`
  - Текст описания при ховере: `1.2rem; line-height: 1.65;`

---

### 2.6. Адаптация Секции 3.6 «Call to Action» (`src/styles/socials.css`)

Сетка из 4-х карточек соцсетей (Telegram, YouTube, TikTok, Instagram):

- **Full HD (1920 × 1080):**
  - Карточки в 4 колонки: `grid-template-columns: repeat(4, 1fr); gap: 24px;`
  - Высота карточки: `240px; padding: 28px 24px;`
  - Названия соцсетей: `1.25rem;`
  - Кнопки перехода: `font-size: 0.85rem; padding: 12px 16px;`
- **2K / QHD (2560 × 1440):**
  - Сетка: `gap: 36px;`
  - Высота карточки: `290px; padding: 36px 32px; border-radius: 18px;`
  - Заголовок секции H2: `3.2rem; margin-bottom: 48px;`
  - Логотипы соцсетей SVG: `height: 32px; width: 32px;`
  - Названия соцсетей: `1.5rem;`
  - Частоты (`FREQ`): `0.95rem;`
  - Кнопки перехода: `font-size: 0.95rem; padding: 14px 20px; border-radius: 8px;`

---

### 2.7. Адаптация Секции 3.7 «Footer» (`src/styles/footer.css`)

- **Full HD (1920 × 1080):**
  - `padding: 48px 0 36px 0;`
  - Заголовки колонок: `0.9rem;`
  - Ссылки и метаданные: `0.85rem; line-height: 1.6;`
- **2K / QHD (2560 × 1440):**
  - `padding: 64px 0 44px 0;`
  - Логотип: `height: 34px;`
  - Заголовки колонок: `1.05rem; letter-spacing: 0.1em; margin-bottom: 20px;`
  - Ссылки и метаданные: `0.95rem; line-height: 1.7;`
  - Кнопка `[▲ TOP]`: `font-size: 0.85rem; padding: 10px 20px;`

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ установлен строго в `Status: DONE`.
- [x] Секции `.global-bg` и `<!-- 3.2 Hero-блок -->` не затронуты.
- [x] На мониторах Full HD (1920×1080) ширина контейнера адаптирована до `1540px`, контент сбалансирован по высоте.
- [x] На мониторах 2K (2560×1440) ширина контейнера расширена до `1820px`, устранены пустые боковые пустоты.
- [x] Типографика, карточки доктрины, ростер команды, шкалы статов и карточки CTA на 2K экранах масштабированы пропорционально большему пространству (Full HD ➔ 2K).
