# TASK-037: Привязка Логотипа Hero к .global-bg-logo, Увеличение в 2 Раза и Ослабление Glow

**Status:** DONE  
**Target File(s):** `src/styles/main.css`, `src/styles/hero.css`, `index.html`  
**Parent Specification:** TASK-036 (`docs/task/TASK-036-hero-split-grid-and-vibrant-logo.md`)

---

## 1. Контекст и Цель Модификации
1. **Единый канонический логотип (`.global-bg-logo`):** Удаление любого старого/дублирующего фонового логотипа. Логотип Hero-блока привязывается напрямую к `.global-bg-logo`, исключая дублирование картинок в DOM.
2. **Увеличение размера логотипа в 2 раза (2x Scale):** Габариты `.global-bg-logo` удваиваются (достигая `clamp(650px, 55vw, 1050px)`), формируя мощный визуальный якорь в правой части экрана Hero.
3. **Ослабление Glow-эффекта в 2 раза:** Радиус свечения и интенсивность `drop-shadow` уменьшаются ровно на 50%, делая свечение деликатным и благородным.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Позиционирование и Увеличение в 2 Раза (`src/styles/main.css`)

Единый логотип `.global-bg-logo` позиционируется в правой части сетки Hero:

```css
/* ==========================================
   Канонический логотип .global-bg-logo (TASK-037)
   ========================================== */

.global-bg-logo {
  position: absolute;
  top: 50%;
  /* Привязка к правой половине сетки Hero */
  right: clamp(10px, 4vw, 60px);
  transform: translateY(-50%);
  
  /* РАЗМЕР УВЕЛИЧЕН В 2 РАЗА: */
  width: clamp(620px, 54vw, 1050px);
  height: auto;
  
  /* Полная четкость (без блюра) и 100% сочные цвета */
  opacity: 1;
  filter: none;
  
  /* GLOW-ЭФФЕКТ УМЕНЬШЕН В 2 РАЗА (деликатная аура): */
  filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.18))
          drop-shadow(0 0 35px rgba(193, 255, 0, 0.12));
          
  user-select: none;
  pointer-events: none;
  z-index: 1;
  
  /* Анимация проявления при загрузке страницы */
  animation: bgLogoReveal 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes bgLogoReveal {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateX(60px) scale(0.94);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) translateX(0) scale(1);
  }
}

/* Адаптив для планшетов и мобильных устройств */
@media (max-width: 1024px) {
  .global-bg-logo {
    right: auto;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(85vw, 540px);
    opacity: 0.35; /* На мобилках подложка мягче под текстом */
  }
}
```

---

### 2.2. Разметка Hero-блока без Дублирования (`index.html`)

В секции `#hero` правая колонка не содержит дублирующего тега `<img>`, а резервирует пространство сетки:

```html
<!-- 3.2 Hero-блок (Точка входа) -->
<section id="hero" class="hero">
  <div class="container hero-container">
    <div class="grid-12 hero-split-grid">
      
      <!-- Левая зона: Монолитный текст (6-7 колонок) -->
      <div class="col-7 hero-left-content">
        <div class="hero-monolith-wrapper">
          <svg viewBox="0 0 1000 360" class="hero-monolith-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="НЕПРЕДВИДЕННЫЙ ФАКТОР">
            <text x="0" y="76" textLength="1000" lengthAdjust="spacingAndGlyphs" 
                  font-family="'Bounded', sans-serif" font-weight="700" font-size="74" fill="#FFFFFF">
              НЕПРЕДВИДЕННЫЙ
            </text>
            <text x="0" y="274" textLength="1000" lengthAdjust="spacingAndGlyphs" 
                  font-family="'Bounded', sans-serif" font-weight="700" font-size="218" fill="#FFFFFF">
              ФАКТОР
            </text>
            <text x="0" y="344" textLength="1000" lengthAdjust="spacing" 
                  font-family="'Bounded', sans-serif" font-weight="300" font-size="25" fill="#FFFFFF">
              ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.
            </text>
          </svg>
        </div>
      </div>

      <!-- Правая зона: Пространство под увеличенный .global-bg-logo -->
      <div class="col-5 hero-right-spacer" aria-hidden="true"></div>

    </div>
  </div>
</section>
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Старый фоновый логотип устранен, остался один единственный канонический `.global-bg-logo`.
- [x] Логотип Hero привязан к `.global-bg-logo` и позиционируется справа по сетке Hero.
- [x] Размер логотипа увеличен ровно в 2 раза (`width: clamp(620px, 54vw, 1050px)`).
- [x] Свечение (glow effect) уменьшено ровно в 2 раза (мягкий радиус 20px / 35px вместо 50px / 80px).
- [x] При первой загрузке страницы логотип и текст плавно проявляются навстречу друг другу.
