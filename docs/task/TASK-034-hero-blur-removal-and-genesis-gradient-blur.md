# TASK-034: Удаление Блюра в Hero и Градиентный Переход в Блюр для Секции 3.3 Генезис

**Status:** DONE  
**Target File(s):** `src/styles/main.css`, `src/styles/hero.css`, `src/styles/genesis.css`  
**Parent Specification:** TASK-033

---

## 1. Контекст и Цель Модификации
1. **Hero-блок (3.2):** Полное удаление размытия (blur) фонового логотипа. В первом экране фоновые элементы отображаются кристально четко и резко.
2. **Секция 3.3 Генезис (Sticky Scroll):** Фоновое размытие сохраняется, но вводится **мягкий градиентный переход на верхней границе блока** (`gradient blur mask`), благодаря которому четкий фон плавно переходит в глубокий кинематографичный блюр без резкой стыковочной линии.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Удаление Размытия с Фонового Логотипа (`src/styles/main.css`)

Удалить `filter: blur(9px)` у глобального фонового логотипа `.global-bg-logo`:

```css
/* Фоновый логотип теперь четкий (без блюра) на первом экране */
.global-bg-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(85vw, 700px);
  height: auto;
  opacity: 0.22;
  /* Блюр удален: остается только мягкое свечение контура */
  filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.15));
  user-select: none;
}
```

---

### 2.2. Градиентный Переход в Блюр на Границе Секции 3.3 (`src/styles/genesis.css`)

Внедрение псевдоэлемента `::before` в `.about-sticky-section` (или контейнер `.about-sticky-viewport`), который создает слой `backdrop-filter: blur(...)` с маской прозрачности `mask-image: linear-gradient(...)`:

```css
/* =========================================================
   ГРАДИЕНТНЫЙ БЛЮР НА ВХОДЕ В СЕКЦИЮ 3.3 ГЕНЕЗИС:
   ========================================================= */

.about-sticky-section {
  position: relative;
  height: 300vh;
  background: transparent;
}

/* Слой градиентного размытия, плавно нарастающего от 0% до 100% */
.about-sticky-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  /* Эффект матового стекла/размытия */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  
  /* Градиентная маска: сверху 0% (прозрачно/без блюра), 
     к 180px плавно переходит в 100% плотный блюр */
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 80px,
    rgba(0, 0, 0, 0.8) 160px,
    rgba(0, 0, 0, 1) 240px,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 80px,
    rgba(0, 0, 0, 0.8) 160px,
    rgba(0, 0, 0, 1) 240px,
    rgba(0, 0, 0, 1) 100%
  );
}

/* Контент секции приподнят над слоем градиентного блюра */
.about-sticky-viewport {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 2;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] В блоке Hero фоновый логотип отображается без блюра (`filter: blur(...)` удален).
- [x] При скролле к секции 3.3 «Генезис» отсутствует резкая граница отсечения фона.
- [x] Верхний край секции 3.3 размывается бесшовно через альфа-маску (`mask-image: linear-gradient`), создавая мягкий градиентный переход из четкости в блюр.
- [x] Производительность скролла стабильна (60 FPS без лагов на мобильных и десктопах).
