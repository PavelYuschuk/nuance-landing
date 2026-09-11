# TASK-028: Синхронизация Шрифтов Zone 4 с Генезисом и Правка Описания Matvi4

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-026, TASK-027

---

## 1. Контекст и Цель Модификации
1. **Синхронизация типографики Zone 4 с секцией 3.3 Генезис:**
   - Для имени бойца (`.team-player-name`) установить точный размер и параметры подзаголовка Генезиса (`.about-sub-title` = **35px**).
   - Для всего остального текста в Zone 4 (роль, цитата, описание) установить точный размер параграфа Генезиса (`.genesis-paragraph` = **18px**).
2. **Чистка текста Matvi4:** Удаление фразы *«и в кого надо воевать»* из описания персонажа.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Типографическая Матрица Zone 4 (`src/styles/team.css`)

| Элемент | Целевой эталон | Размер шрифта (Font Size) | Межстрочный (Line-height) | Семейство |
| :--- | :--- | :--- | :--- | :--- |
| **`.team-player-name`** | `.about-sub-title` | **`35px`** (`clamp(24px, 3vw, 35px)`) | `1.1` | `var(--font-heading)` (Rajdhani 700) |
| **`.team-player-role`** | `.genesis-paragraph` | **`18px`** (`clamp(15px, 1.6vw, 18px)`) | `1.4` | `var(--font-ui)` (Sofia Sans 600) |
| **`.player-quote`** | `.genesis-paragraph` | **`18px`** (`clamp(15px, 1.6vw, 18px)`) | `1.5` | `var(--font-body)` (JetBrains Mono 400 Italic) |
| **`.team-player-desc`** | `.genesis-paragraph` | **`18px`** (`clamp(15px, 1.6vw, 18px)`) | `1.5` | `var(--font-body)` (JetBrains Mono 400) |

```css
/* Имя игрока идентично .about-sub-title */
.team-player-name {
  font-family: var(--font-heading);
  font-size: 35px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: 0.06em;
  margin: 0;
}

/* Остальные текстовые элементы равны .genesis-paragraph (18px) */
.team-player-role {
  font-size: 18px;
  line-height: 1.4;
}

.player-quote {
  font-size: 18px;
  line-height: 1.5;
}

.team-player-desc {
  font-size: 18px;
  line-height: 1.5;
}

/* Адаптивные пересчеты (аналогично Генезису) */
@media (max-width: 1024px) {
  .team-player-name {
    font-size: 28px;
  }
  .team-player-role,
  .player-quote,
  .team-player-desc {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .team-player-name {
    font-size: 22px;
  }
  .team-player-role,
  .player-quote,
  .team-player-desc {
    font-size: 14.5px;
    line-height: 1.4;
  }
}
```

---

### 2.2. Корректировка Текста Matvi4 (`index.html`)

В карточке **Player 2 Info: Matvi4**:

- **Было:**
  `Обладает встроенным читом на бессмертие: выживает там, где даже тараканы гибнут. Почти никогда не понимает, что вообще происходит на поле боя и в кого надо воевать, но если весь сквад вайпается — этот гений всегда остается на ногах и под градом пуль поднимает павших шприцем...`
- **Стало (фраза «и в кого надо воевать» удалена):**
  `Обладает встроенным читом на бессмертие: выживает там, где даже тараканы гибнут. Почти никогда не понимает, что вообще происходит на поле боя, но если весь сквад вайпается — этот гений всегда остается на ногах и под градом пуль поднимает павших шприцем...`

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Размер шрифта имени `.team-player-name` установлен строго в `35px` (как у `.about-sub-title`).
- [ ] Размер шрифта роли, цитаты и описания установлен в `18px` (как у `.genesis-paragraph`).
- [ ] Из описания Matvi4 в `index.html` удалена фраза *«и в кого надо воевать»*.
- [ ] На планшетах и мобильных устройствах типографика масштабируется пропорционально Генезису.
