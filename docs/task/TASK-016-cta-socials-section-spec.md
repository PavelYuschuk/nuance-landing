# TASK-016: Спецификация Секции "3.6. Call to Action / Социальные сети"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/socials.css`, `src/styles/main.css`  
**PRD Reference:** Section 3.7 Call to Action (Социальные сети)

---

## 1. Контекст и Цель Модификации
Разработка интерфейса и спецификации верстки для секции "3.6. Call to Action / Социальные сети":
1. Центральный тактический заголовок с живым индикатором связи (`СВЯЗЬ ОТКРЫТА // COMMS ONLINE`).
2. Четкий логотип NUANCE на заднем плане без размытия (`opacity: 0.25`).
3. Сетка из 4-х HUD-карточек тактических частот: **Discord, Telegram, YouTube, TikTok** (с заменой Twitch на TikTok).
4. Качественные микро-взаимодействия: неоновая подсветка при наведении, моноширинные частоты связи, тактические кнопки перехода.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Сетка и Архитектурная Композиция
- **Контейнер секции (`#cta` / `.cta-section`):**
  - `min-height: 85vh; padding: 120px 0; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center`.
- **Фоновый логотип (`.cta-bg-logo`):**
  - `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1`.
  - `width: min(80vw, 650px); opacity: 0.22; filter: drop-shadow(0 0 35px rgba(0, 229, 255, 0.15))`.
  - Файл изображения: `/assets/images/NUANCE logo.png` (четкий контур).

---

### 2.2. Заголовок и Индикатор Статуса Связи (`.cta-header-block`)
- **Позиционирование:** По центру над сеткой карточек (`text-align: center; margin-bottom: 64px; z-index: 2; position: relative`).
- **Индикатор статуса («Связь открыта»):**
  - `display: inline-flex; align-items: center; gap: 10px; padding: 6px 16px; background: rgba(193, 255, 0, 0.08); border: 1px solid rgba(193, 255, 0, 0.3); border-radius: 100px; margin-bottom: 20px`.
  - **Пульсирующий зеленый маркер (`.status-dot`):**
    - `width: 8px; height: 8px; background: #C1FF00; border-radius: 50%; box-shadow: 0 0 10px #C1FF00`.
    - Анимация пульсации: `animation: pulseGlow 2s infinite ease-in-out`.
  - **Текст статуса (`.status-text`):** `font-family: var(--font-body)` (`JetBrains Mono 700`), `font-size: 0.75rem`, `color: #C1FF00`, `letter-spacing: 0.08em`.
- **Основной заголовок H2 (`.cta-main-title`):**
  - `font-family: var(--font-heading)` (`Rajdhani 700`), `font-size: clamp(2.2rem, 4vw, 3.5rem)`, Uppercase, `color: #FFFFFF`.
  - Текст: `Присоединиться к отряду`
- **Подзаголовок (`.cta-sub-title`):**
  - `font-family: var(--font-body)` (`JetBrains Mono 400`), `font-size: 1.1rem`, `color: #888888; margin-top: 8px`.
  - Текст: `// Выйти на связь`

---

### 2.3. Сетка HUD-Карточек Соцсетей (`.cta-socials-grid`)
- **Контейнер сетки:** `display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%; z-index: 2; position: relative`.
- **Адаптивность (Breakpoints):**
  - Desktop (>1024px): 4 колонки в ряд (`repeat(4, 1fr)` / `.col-3`).
  - Tablet (769px – 1024px): 2x2 сетка (`repeat(2, 1fr)`).
  - Mobile (≤768px): 1 колонка (`repeat(1, 1fr)`).

---

### 2.4. Дизайн-Токены HUD-Карточки (`.social-hud-card`)

```css
.social-hud-card {
  background: rgba(20, 28, 41, 0.65);
  border: 1px solid rgba(39, 53, 77, 0.5);
  border-radius: 12px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.social-hud-card:hover {
  transform: translateY(-6px);
  border-color: var(--card-accent);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--card-glow);
}
```

#### **Маппинг параметров 4-х платформ:**

1. **DISCORD (Канал 01):**
   - **Частота:** `FREQ // 144.800 MHz`
   - **Акцент:** `--card-accent: #5865F2`
   - **Свечение:** `--card-glow: rgba(88, 101, 242, 0.25)`
   - **Ссылка/Действие:** `Присоединиться к серверу`
2. **TELEGRAM (Канал 02):**
   - **Частота:** `FREQ // 433.075 MHz`
   - **Акцент:** `--card-accent: #24A1DE`
   - **Свечение:** `--card-glow: rgba(36, 161, 222, 0.25)`
   - **Ссылка/Действие:** `Открыть оперативный канал`
3. **YOUTUBE (Канал 03):**
   - **Частота:** `FREQ // 868.100 MHz`
   - **Акцент:** `--card-accent: #FF0000`
   - **Свечение:** `--card-glow: rgba(255, 0, 0, 0.25)`
   - **Ссылка/Действие:** `Смотреть архивы боев`
4. **TIKTOK (Канал 04):**
   - **Частота:** `FREQ // 915.200 MHz`
   - **Акцент:** `--card-accent: #00F2FE`
   - **Свечение:** `--card-glow: rgba(0, 242, 254, 0.25)`
   - **Ссылка/Действие:** `Клипы и хайлайты`

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Заголовок содержит текст: `Присоединиться к отряду // Выйти на связь`.
- [ ] Добавлен пульсирующий зеленый индикатор `СВЯЗЬ ОТКРЫТА`.
- [ ] Сетка соцсетей включает 4 карточки: Discord, Telegram, YouTube, TikTok.
- [ ] При наведении на карточки активируется неоновая подсветка соответствующего цвета платформы.
- [ ] На заднем плане отображается четкий логотип NUANCE с легким свечением.
