# TASK-009: Архитектура Слоев Глубины и Портретов в "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-007 (`docs/task/TASK-007-team-center-panel-refactor.md`), TASK-008 (`docs/task/TASK-008-team-roster-images-integration.md`)

---

## 1. Контекст и Цель Модификации
Реструктуризация объёмно-пространственной архитектуры секции "3.4. Команда":
1. Очистка блока портрета в Zone 3 (Right Portrait View): отказ от рамок и фоновых заливок для работы с прозрачными PNG-иллюстрациями персонажей.
2. Увеличение длины неонового прогресс-бара под цитатой в Zone 2 на 50% (`max-width: 480px`).
3. Внедрение 4-уровневого стека слоев глубины (Z-Index Hierarchy): добавление динамической фоновой Zone 0 (самый нижний слой) и корректная послойная расстановка персонажа (средний слой) и UI-панелей (верхний слой).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Иерархия Слоев Глубины (Z-Index Layer Architecture)

```
[ FRONT UI ]    z-index: 3  ➜ Zone 1 (Левый ростер) + Zone 2 (Центральная инфо-панель)
[ CHARACTER ]   z-index: 2  ➜ Zone 3 (Персонаж PNG без фона)
[ BACKDROP ]    z-index: 1  ➜ Zone 0 (Динамический сменный фон игрока)
```

#### **Zone 0: Динамический Фоновый Слой (`.team-bg-layer`, z-index: 1)**
- `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1`.
- Меняет атмосферный градиент/свечение при смене активного персонажа:
  - **Presa4ek:** `background: radial-gradient(circle at 75% 50%, rgba(193, 255, 0, 0.12) 0%, transparent 70%)`.
  - **Art1zi:** `background: radial-gradient(circle at 75% 50%, rgba(0, 229, 255, 0.12) 0%, transparent 70%)`.
  - **Matvi4:** `background: radial-gradient(circle at 75% 50%, rgba(255, 193, 7, 0.12) 0%, transparent 70%)`.
- `transition: opacity 0.6s ease`.

#### **Zone 3: Портрет Персонажа (`.team-portrait-wrapper`, z-index: 2)**
- `position: relative; z-index: 2; display: flex; align-items: center; justify-content: center`.
- `background: transparent; border: none; box-shadow: none` (Полное удаление фоновых блоков и рамок).
- Иллюстрации выставляются как PNG с прозрачным фоном (`object-fit: contain; max-height: 85vh`).
- Внутри сохраняется тонкая техническая надпись-плейсхолдер:  
  `<span class="placeholder-text">[ PRESA4EK // PORTRAIT PNG ]</span>`.

#### **Zone 1 & Zone 2: Верхний Интерфейсный Слой (`.col-3` & `.col-4`, z-index: 3)**
- `position: relative; z-index: 3`.
- Гарантирует, что кнопки левой навигации (Zone 1) и тексты/статы (Zone 2) перекрывают арт персонажа при наложении на любых экранах и остаются 100% кликабельными.

---

### 2.2. Увеличение Прогресс-бара Цитаты (`.player-quote-progress`)
- **Увеличение длины на 50%:**
  - **Было:** `max-width: 320px`.
  - **Стало:** `max-width: 480px` (или `width: 100%; max-width: 480px`).
- **Стилизация:**
  - `height: 3px; margin-top: 16px; margin-bottom: 24px`.
  - `background: linear-gradient(to right, var(--player-accent) 0%, var(--player-accent) 55%, transparent 100%)`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен строго в `Status: To do`.
- [ ] Рамки и фоновая заливка в блоке портрета (Zone 3) полностью удалены (`background: transparent; border: none`).
- [ ] Длина неонового прогресс-бара под цитатой увеличена до `480px` (+50%).
- [ ] Внедрен динамический фоновый слой Zone 0 (`z-index: 1`) со свечением под цвет игрока.
- [ ] Арт персонажа расположен на среднем слое (`z-index: 2`).
- [ ] Текстовые панели Zone 1 и Zone 2 приподняты на передний план (`z-index: 3`).
