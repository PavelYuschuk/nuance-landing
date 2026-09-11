# TASK-046: Синхронизация Отступа Заголовка с Секцией 3.3 и Точечная Корректировка Zone 4

**Status:** DONE  
**Target File(s):** `src/styles/team.css`, `index.html`  
**Parent Specification:** TASK-045 (`docs/task/TASK-045-team-standalone-header-and-layout-rebalance.md`)

---

## 1. Контекст и Инженерная Задача
1. **Защита от перекрытия шапкой (Синхронизация с 3.3 Генезис):**  
   Заголовок `КОМАНДА` перекрывается плавающей панелью навигации Header. Требуется повторить точную структуру отступов секции 3.3 (`padding-top: calc(var(--header-height) + 36px)`), разместив подблок `КОМАНДА` на идеальной вертикальной высоте от меню.
2. **Сближение с Zone 3 (на 50%):**  
   Смещение центральной панели (Zone 4) влево, сократив дистанцию между ростером (`Zone 3`) и инфо-панелью ровно на **50%**.
3. **Расширение Zone 4 вправо (+10%):**  
   Увеличение ширины панели Zone 4 еще на **+10% в правую сторону** без сдвига ее левой координаты, позволяя описанию и статам комфортно раскрываться в сторону портрета.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Идеальное Вертикальное Положение Заголовка (1 в 1 как в 3.3 Генезис) (`src/styles/team.css`)

Повторение точной геометрии отступа вьюпорта `.about-sticky-viewport`:

```css
/* Вьюпорт секции Команда: точный отступ под шапку как в Генезисе */
.team-sticky-viewport {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  /* ИДЕНТИЧНО СЕКЦИИ 3.3 ГЕНЕЗИС: */
  padding-top: calc(var(--header-height) + 36px);
  padding-bottom: 24px;
}

/* Автономный подблок заголовка: не закрывается шапкой */
.team-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 28px; /* Ровно как у .about-header-subblock */
  width: 100%;
  max-width: 320px;
  align-self: flex-start;
  z-index: 5;
}

.team-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 5vw, 4.0rem);
  text-transform: uppercase;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  line-height: 1.05;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

/* Адаптив отступа шапки */
@media (max-width: 1024px) {
  .team-sticky-viewport {
    padding-top: calc(var(--header-height) + 24px);
    padding-bottom: 20px;
  }
}
```

---

### 2.2. Корректировка Геометрии Zone 4 (`src/styles/team.css`)

```css
/* =========================================================
   Zone 4: Смещение влево на 50% + Расширение вправо на +10%
   ========================================================= */

.team-zone-4,
.team-info-panel {
  position: relative;
  z-index: 5;
  overflow: visible;

  /* 1. Сокращение расстояния от ростера (Zone 3) на 50%: */
  margin-left: clamp(10px, 1.2vw, 18px); /* Уменьшено в 2 раза */
  padding-left: 0;

  /* 2. Дополнительное увеличение ширины блока вправо на +10%: */
  width: 115%;
  max-width: 555px; /* Было 505px -> увеличено еще на 10% */

  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Верхний отступ секции 3.4 (`padding-top: calc(var(--header-height) + 36px)`) полностью повторяет геометрию секции 3.3 «Генезис».
- [x] Подблок «КОМАНДА» не перекрывается меню шапки Header и расположен на одном вертикальном уровне с «О нас».
- [x] Расстояние между Zone 3 (ростер) и Zone 4 (инфо-панель) сокращено на 50% (`margin-left: clamp(10px, 1.2vw, 18px)`).
- [x] Ширина блока Zone 4 увеличена вправо еще на +10% (`max-width: 555px`), без сдвига левой координаты.
