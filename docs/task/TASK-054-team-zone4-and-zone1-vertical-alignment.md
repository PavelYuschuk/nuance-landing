# TASK-054: Размещение Zone 4 (Инфо-панель) и Zone 1 (Портрет) Строго Под Подблоком «КОМАНДА»

**Status:** DONE  
**Target File(s):** `src/styles/team.css`  
**Parent Specification:** TASK-045, TASK-049, TASK-050  

---

## 1. Контекст и Анализ Проблемы

В секции 3.4 (Team Character Selector) ранее использовался подъем сетки `margin-top: -52px`, призванный искусственно сблизить центральную панель с шапкой, что в сочетании с дублирующим паддингом на `.team-zone-4` вызывало рассинхрон уровней.

**Финальное требование пользователя:**
- **Zone 4: Center Info Panel** опустить под `<!-- 1. ОТДЕЛЬНЫЙ АВТОНОМНЫЙ ЛЕВООРИЕНТИРОВАННЫЙ ПОДБЛОК (ВНЕ ZONE 3 - TASK-045) -->`.
- Подблок «КОМАНДА» располагается автономно сверху (как в блоке «О нас»), а под ним с отступом `24px` стартует основная сетка слоев.

---

## 2. Реализованные Инженерные Изменения (`src/styles/team.css`)

### 2.1. Естественное Расположение Сетки Под Заголовком
1. **`.team-header-subblock`:**
   - Задан нижний отступ `margin-bottom: 24px;` для чистого разделения заголовка и контента.
2. **`.team-main-grid`:**
   - Полностью снят подъем `margin-top: -52px;` ➔ установлено `margin-top: 0;`.
   - Вся сетка начинается строго **под** линией подблока `КОМАНДА`.
3. **`Zone 3` (`.team-zone-3`):**
   - Снят избыточный отступ `padding-top: 72px;` ➔ установлено `padding-top: 0;`.
   - Карточки ростера естественно центруются по вертикали в своей колонке.
4. **`Zone 4` (`.team-zone-4` / `.team-info-panel`):**
   - Устранен дублирующий отступ от шапки: `padding-top: 0 !important; margin-top: 0 !important;`.
   - Панель информации об игроке стартует строго под уровнем подблока `КОМАНДА`.

```css
/* =========================================================
   Основная сетка и Zone 4 строго ПОД подблоком «КОМАНДА»
   ========================================================= */

.team-container .grid-12,
.team-screen-container .grid-12,
.team-main-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: flex-start;
  width: 100%;
  position: relative;
  /* Сетка и Zone 4 начинаются естественно ПОД подблоком «КОМАНДА» */
  margin-top: 0;
  flex: 1;
}

.team-header-subblock {
  width: 100%;
  max-width: 326px;
  margin-bottom: 24px; /* Отступ до начала основной сетки контента */
  min-height: 52px;
  display: flex;
  align-items: center;
  align-self: flex-start;
  z-index: 5;
}

.team-zone-3 {
  position: relative;
  z-index: 4;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.team-zone-4,
.team-info-panel {
  padding-top: 0 !important;
  margin-top: 0 !important;
  position: relative;
  z-index: 5;
  overflow: visible;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  justify-content: flex-start;
  align-self: flex-start;
  width: 115%;
  max-width: 555px;
  margin-left: clamp(10px, 1.2vw, 18px);
  padding-left: 0;
  padding-bottom: 24px;
}
```

---

## 3. Чек-лист Проверки Реализации (Verification)

- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Снят искусственный отрицательный марджин `margin-top: -52px` у `.team-main-grid`.
- [x] Задан чистый отступ `margin-bottom: 24px` у подблока `.team-header-subblock`.
- [x] Zone 4 (инфо-панель) опущена строго под уровень автономного подблока «КОМАНДА».
- [x] Снят избыточный `padding-top: 72px` с Zone 3.
- [x] Сохранены пропорции, ширина Zone 4 и сближение с Zone 3.
