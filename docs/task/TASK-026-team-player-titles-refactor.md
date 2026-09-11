# TASK-026: Разделение Ника и Подзаголовка Игроков в "Zone 4: Center Info Panel"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-007, TASK-024

---

## 1. Контекст и Цель Модификации
Очистка и декомпозиция заголовков персонажей в центральной информационной панели (**Zone 4: Center Info Panel**):
1. В заголовке `<h2 class="team-player-name">` оставляется **строго чистый никнейм** игрока.
2. Непосредственно под ником вводится отдельный подзаголовок в одну строку (`.team-player-role` / `.team-player-subtitle`) с ролью/специализацией бойца.
3. Единый паттерн применяется ко всем трем персонажам отряда: **Presa4ek**, **Art1zi**, **Matvi4**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Матрица Имен и Подзаголовков

| Персонаж | Заголовок H2 (`.team-player-name`) | Однострочный подзаголовок (`.team-player-role`) | Цвет роли |
| :--- | :--- | :--- | :--- |
| **Игрок 0** | `Presa4ek` | `Искусство стратегии` | `--color-accent-1: #C1FF00` |
| **Игрок 1** | `Art1zi` | `Тяжелый аргумент` | `--color-accent-2: #00E5FF` |
| **Игрок 2** | `Matvi4` | `Суетолог` | `--color-accent-3: #FFC107` |

---

### 2.2. HTML-Разметка для Разработчика (`index.html`)

```html
<!-- Пример для Presa4ek (Слой 0) -->
<div class="team-player-header">
  <h2 class="team-player-name">Presa4ek</h2>
  <div class="team-player-role">Искусство стратегии</div>
</div>

<!-- Пример для Art1zi (Слой 1) -->
<div class="team-player-header">
  <h2 class="team-player-name">Art1zi</h2>
  <div class="team-player-role">Тяжелый аргумент</div>
</div>

<!-- Пример для Matvi4 (Слой 2) -->
<div class="team-player-header">
  <h2 class="team-player-name">Matvi4</h2>
  <div class="team-player-role">Суетолог</div>
</div>
```

---

### 2.3. Спецификация Типографики и Стилизации (`src/styles/team.css`)

```css
/* Никнейм игрока */
.team-player-name {
  font-family: var(--font-heading); /* Rajdhani */
  font-size: clamp(2.5rem, 4vw, 3.8rem);
  font-weight: 700;
  text-transform: uppercase;
  color: #FFFFFF;
  line-height: 1.1;
  margin: 0;
}

/* Однострочный подзаголовок роли под ником */
.team-player-role {
  font-family: var(--font-ui); /* Sofia Sans Semi Condensed */
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap; /* Строго в одну строку */
  margin-top: 6px;
  margin-bottom: 16px;
}

/* Привязка акцентных цветов к роли каждого персонажа */
.screen-presa4ek .team-player-role {
  color: var(--color-accent-1); /* #C1FF00 */
}

.screen-art1zi .team-player-role {
  color: var(--color-accent-2); /* #00E5FF */
}

.screen-matvi4 .team-player-role {
  color: var(--color-accent-3); /* #FFC107 */
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] В `h2.team-player-name` оставлен только никнейм (`Presa4ek`, `Art1zi`, `Matvi4`) без позывных и слэшей.
- [ ] Ниже выведен однострочный блок `.team-player-role` (`Искусство стратегии`, `Тяжелый аргумент`, `Суетолог`).
- [ ] Текст роли отображается строго в одну строку (`white-space: nowrap`) и окрашен в персональный цвет игрока.
- [ ] Иерархия отступов между ником, ролью и цитатой сохранена.
