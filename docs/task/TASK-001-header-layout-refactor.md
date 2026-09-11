# TASK-001: Рефакторинг шапки сайта (Header Layout Refactor)

**Status:** DONE  
**Target File(s):** `src/styles/header.css`, `index.html`  
**References:** Ref 1 (`Temp/References/1.jpg`), Other 3 (`https://ovo-redsun.webflow.io/`)

---

## 1. Контекст и Цель Модификации
Модификация глобальной навигационной панели (`Header`) под полноширинный прямоугольный стеклянный паттерн на основе референсов **EOS AI** (`1.jpg`) и **OVO Redsun** (`Other 3`). Все остальные блоки, секции и токены проекта остаются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Сетка и Архитектура (Grid & Layout)
- **Контейнер шапки (`.header`):**
  - `position: fixed; top: 0; left: 0; right: 0; width: 100%` (Сброс: `top: 16px`, `left: 50%`, `transform: translateX(-50%)`, `width: min(92%, 1280px)`).
  - `height: 64px` (Фиксированная высота сохраняется).
  - `z-index: 1000`.
- **Внутренний флекс-контейнер (`.header-container`):**
  - `width: 100%; max-width: 100%`.
  - `display: flex; align-items: center; justify-content: space-between; position: relative`.
  - `padding`: `0 32px` (Desktop >1024px), `0 24px` (Tablet ≤1024px), `0 16px` (Mobile ≤768px).
- **Иерархия элементов:**
  - **Логотип (`.header-logo`):** Закреплен строго у левого края контейнера.
  - **Навигация (`.header-nav`):** Идеально центрирована по горизонтали относительно всего экрана (`position: absolute; left: 50%; transform: translateX(-50%)` на Desktop).
  - **Контролы / Язык (`.header-controls`):** Закреплены строго у правого края контейнера.

### 2.2. Типографика (Typography)
- **Ссылки навигации (`.nav-link`):**
  - `font-family: var(--font-body)` (`'JetBrains Mono', monospace`).
  - `font-size: 0.82rem` (13px), `font-weight: 700`.
  - `letter-spacing: 0.06em; text-transform: uppercase`.
  - `color: var(--color-text-secondary)` (`#888888`).
  - `:hover` / `.active` ➔ `color: var(--color-text-primary)` (`#FFFFFF`).
- **Переключатель языка (`.lang-btn`):**
  - `font-family: var(--font-body)`, `font-size: 0.75rem` (12px), `font-weight: 700`.
  - `color: var(--color-text-secondary)` (`#888888`), `.active` ➔ `#FFFFFF`.

### 2.3. Дизайн-Токены и Эффекты (Tokens & Visual Effects)
- **Геометрия:**
  - `border-radius: 0px` (Полный отказ от овальной капсулы `100px`).
  - Прямоугольная форма во всю ширину окна браузера.
- **Рамка и Границы:**
  - `border: none` (Удалены боковые, верхняя и внутренние обводки `rgba(255, 255, 255, 0.12)`).
  - `border-bottom: 1px solid rgba(39, 53, 77, 0.4)` (Нижний аккуратный полупрозрачный делитель).
- **Эффект стекла (Glassmorphism):**
  - `background: rgba(15, 15, 15, 0.7)` (или `rgba(20, 28, 41, 0.5)`).
  - `backdrop-filter: blur(20px) saturate(180%)`.
  - `-webkit-backdrop-filter: blur(20px) saturate(180%)`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Шапка зафиксирована в самом верху страницы (`top: 0`) от края до края (`100%`).
- [ ] Отсутствуют скругления углов (`border-radius: 0`).
- [ ] Логотип слева, переключатель языка справа, ссылки навигации строго по центру.
- [ ] Эффект матового стекла (blur) сохранен.
