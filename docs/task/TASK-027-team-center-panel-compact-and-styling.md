# TASK-027: Оптимизация Высоты, Цвета Ников и Мигающий Индикатор в "Zone 4: Center Info Panel"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-007, TASK-026

---

## 1. Контекст и Проблема
По результатам визуального тестирования (скриншоты `media_1788804032737.png`, `media_1788804038082.png`):
1. **Выход за пределы экрана (Overflow):** Верхняя часть заголовка наезжает на шапку Header, а нижние строки характеристик (статы) обрезаются снизу за пределами 100vh viewport.
2. **Требование к акценту ника:** Имя игрока (`.team-player-name`) должно быть окрашено в персональный цвет бойца.
3. **Тактический статус роли:** Перед текстом подзаголовка `.team-player-role` требуется добавить мигающую точку-индикатор в цвет игрока.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Вертикальная Компактизация Zone 4 (Устранение вылета за 100vh)

Чтобы весь контент (Имя + Роль + Цитата + Линия + Описание + 5 шкал статов) гарантированно помещался в экран без вертикальной прокрутки:

- **Отступ сверху от Header:**
  - `.team-screen-container` / `.team-info-panel`: `padding-top: calc(var(--header-height) + 16px);` (около 80px), предотвращая наезд на меню.
- **Масштаб и отступы заголовков:**
  - `.team-player-name`: `font-size: clamp(1.8rem, 2.8vw, 2.5rem); line-height: 1.05; margin: 0;` (уменьшен с чрезмерных 3.8rem).
  - `.team-player-role`: `margin-top: 4px; margin-bottom: 8px; font-size: 0.92rem;`.
- **Цитата и Прогресс-бар:**
  - `.player-quote`: `padding: 6px 12px; margin-bottom: 6px; font-size: 0.85rem; line-height: 1.35;`.
  - `.player-quote-progress`: `margin-top: 6px; margin-bottom: 10px; height: 2px; max-width: 380px;`.
- **Основной текст описания:**
  - `.team-player-desc`: `font-size: 0.9rem; line-height: 1.45; margin-bottom: 12px;`.
- **Шкалы характеристик (HUD Stats):**
  - `.stat-row`: `margin-bottom: 5px; grid-template-columns: 140px 1fr 45px; gap: 10px;`.
  - `.stat-label`: `font-size: 0.78rem;`.
  - `.stat-bar-track`: `height: 4px; border-radius: 2px;`.
  - `.stat-value-text`: `font-size: 0.78rem;`.

---

### 2.2. Цветовая Окраска Никнейма (`.team-player-name`)

Применение персонального акцентного цвета непосредственно к имени бойца:

```css
/* Presa4ek (Игрок 0) */
.screen-presa4ek .team-player-name {
  color: var(--color-accent-1); /* #C1FF00 */
  text-shadow: 0 0 25px rgba(193, 255, 0, 0.25);
}

/* Art1zi (Игрок 1) */
.screen-art1zi .team-player-name {
  color: var(--color-accent-2); /* #00E5FF */
  text-shadow: 0 0 25px rgba(0, 229, 255, 0.25);
}

/* Matvi4 (Игрок 2) */
.screen-matvi4 .team-player-name {
  color: var(--color-accent-3); /* #FFC107 */
  text-shadow: 0 0 25px rgba(255, 193, 7, 0.25);
}
```

---

### 2.3. Мигающая Точка Перед Ролью (`.team-player-role`)

Внедрение псевдоэлемента `::before` перед текстом роли с анимацией затухания:

```css
.team-player-role {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-ui);
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Мигающая точка-индикатор */
.team-player-role::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: currentColor;
  box-shadow: 0 0 8px currentColor;
  animation: roleBlink 1.4s infinite ease-in-out;
}

@keyframes roleBlink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(0.75);
  }
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Весь блок Zone 4 полностью помещается в высоту экрана 100vh:
  - Имя Presa4ek не перекрывается плавающей шапкой Header.
  - Последние строки статов не срезаются нижним краем экрана.
- [ ] Имя каждого игрока окрашено в его фирменный цвет (`#C1FF00`, `#00E5FF`, `#FFC107`) с мягким неоновым свечением.
- [ ] Перед текстом подзаголовка роли отображается активная мигающая точка соответствующего цвета.
