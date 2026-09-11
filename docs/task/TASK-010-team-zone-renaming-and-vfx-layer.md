# TASK-010: Переименование Зон и Внедрение VFX-Слоя в "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-009 (`docs/task/TASK-009-team-depth-layers-and-portrait-refactor.md`)

---

## 1. Контекст и Цель Модификации
Полный ренейминг и стандартизация 5-уровневой архитектуры зон (Zone 0 – Zone 4) в секции "3.4. Команда":
1. Приведение наименований зон в соответствие с новой матрицей глубины.
2. Внедрение **Новой Зоны 2** — пустого слоя для визуальных спецэффектов (VFX Layer: шейдеры, частицы, дым, вспышки).
3. Послойное распределение Z-Index от самого нижнего фонового слоя (Zone 0) до верхнего интерфейсного слоя (Zone 4).

Все ранее определенные стили (прогресс-бар 480px, акценты, прозрачный PNG-портрет) привязываются к новым названиям зон.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Новая Матрица Зон и Z-Index Иерархия

| Новое имя | Старое имя | Роль и Содержимое | Z-Index | Описание слоя |
| :--- | :--- | :--- | :--- | :--- |
| **Zone 0** | Zone 0 | Динамический фоновый слой | `z-index: 1` | Активирует цветное радиальное свечение персонажа |
| **Zone 1** | Zone 3 | Портрет персонажа | `z-index: 2` | PNG-иллюстрация без фона (прозрачный арт) |
| **Zone 2** | *[NEW]* | **Пустой VFX-слой для эффектов** | `z-index: 3` | Зарезервированный слой под частицы/дым/HUD-сетку |
| **Zone 3** | Zone 1 | Левая навигация ростера | `z-index: 4` | Навигационная вертикальная панель игроков |
| **Zone 4** | Zone 2 | Центральная инфо-панель | `z-index: 5` | Имя, цитата, описание, затухающая линия и статы |

---

### 2.2. Спецификация Слоев в DOM и Стилизации (`src/styles/team.css`)

```css
/* Zone 0: Dynamic Background Layer (Bottom) */
.team-zone-0 {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* Zone 1: Character Portrait PNG Layer */
.team-zone-1 {
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
}

/* Zone 2: NEW Empty VFX Effects Overlay Layer */
.team-zone-2 {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

/* Zone 3: Left Vertical Roster Navigation Layer */
.team-zone-3 {
  position: relative;
  z-index: 4;
}

/* Zone 4: Center Info Panel & Stats Layer (Top UI) */
.team-zone-4 {
  position: relative;
  z-index: 5;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен строго в `Status: To do`.
- [ ] Проведен ренейминг классов зон в HTML и CSS (`team-zone-0` ... `team-zone-4`).
- [ ] Внедрен пустой слой `.team-zone-2` (`z-index: 3`) под спецэффекты.
- [ ] Портрет персонажа переведен в `.team-zone-1` (`z-index: 2`).
- [ ] Левый ростер навигации переведен в `.team-zone-3` (`z-index: 4`).
- [ ] Центральный блок с описанием и статами переведен в `.team-zone-4` (`z-index: 5`).
