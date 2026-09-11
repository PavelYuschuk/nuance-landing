# TASK-033: Выравнивание Правого Края, Разрядка и Уменьшение Масштаба Hero на 25%

**Status:** DONE  
**Target File(s):** `src/styles/hero.css`, `index.html`  
**Parent Specification:** TASK-032 (`docs/task/TASK-032-hero-vlad-churkin-bounded-typography.md`)  
**Visual Reference:** Загруженный баг-скриншот (`media_1788885052718.png`)

---

## 1. Контекст и Анализ Проблем со Скриншота
На предоставленном скриншоте выявлены 3 проблемы:
1. **Неровный правый край (Right Edge Misalignment):** Левый край всех трех строк выровнен ровно, но по правому краю слово `НЕПРЕДВИДЕННЫЙ` (буква «Й») выступает значительно правее, чем слово `ФАКТОР` (буква «Р»), а подзаголовок заканчивается еще раньше. Требуется **100% совпадение правой границы** всех 3-х блоков.
2. **Наезд строк друг на друга (Collision):** Буквы слова `НЕПРЕДВИДЕННЫЙ` наезжают на верхние засечки слова `ФАКТОР`. Необходимо увеличить вертикальное расстояние (gap/margin) между ними, устранив наложение.
3. **Чрезмерный масштаб:** Общий размер типографики слишком велик относительно экрана. Требуется **уменьшить общий масштаб блока ровно на 25%**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Решение 1: Прецизионный SVG Монолит (100% Гарантия Совпадения Левого и Правого Краев)

Чтобы на любых дисплеях и в любых браузерах правый край букв «Й», «Р» и точки «.» подзаголовка гарантированно приходился на одну и ту же вертикальную линию пиксель-в-пиксель, используется встроенный векторный рендерер текста с атрибутом `lengthAdjust="spacingAndGlyphs"`:

```html
<!-- index.html: 3.2 Hero-блок -->
<section id="hero" class="hero">
  <div class="container hero-container">
    <div class="hero-monolith-wrapper">
      <svg viewBox="0 0 1000 360" class="hero-monolith-svg" preserveAspectRatio="xMidYMid meet">
        
        <!-- СТРОКА 1: НЕПРЕДВИДЕННЫЙ (Точно 1000px ширины) -->
        <text x="0" y="76" textLength="1000" lengthAdjust="spacingAndGlyphs" 
              font-family="'Bounded', sans-serif" font-weight="700" font-size="74" fill="#FFFFFF">
          НЕПРЕДВИДЕННЫЙ
        </text>
        
        <!-- СТРОКА 2: ФАКТОР (Смещена вниз, расстояние увеличено, точно 1000px ширины) -->
        <text x="0" y="274" textLength="1000" lengthAdjust="spacingAndGlyphs" 
              font-family="'Bounded', sans-serif" font-weight="700" font-size="218" fill="#FFFFFF">
          ФАКТОР
        </text>
        
        <!-- СТРОКА 3: ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ. (Точно 1000px ширины) -->
        <text x="0" y="344" textLength="1000" lengthAdjust="spacing" 
              font-family="'Bounded', sans-serif" font-weight="300" font-size="25" fill="#FFFFFF">
          ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.
        </text>
      </svg>
    </div>
  </div>
</section>
```

---

### 2.2. Решение 2: Чистый CSS с Уменьшением Масштаба на 25% (`src/styles/hero.css`)

Если верстальщик реализует блок на чистом HTML/CSS:

```css
/* ==========================================
   Hero Monolith: -25% Scale & Right Edge Fix
   ========================================== */

/* Контейнер блока уменьшен на 25%: было 1150px -> стало 860px */
.hero-monolith-wrapper,
.hero-monolith-block {
  width: min(72vw, 860px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  text-align: center;
}

.hero-monolith-svg {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* =========================================================
   ПАРАМЕТРЫ ДЛЯ ЧИСТОГО CSS ТЕКСТА (ЕСЛИ БЕЗ SVG):
   ========================================================= */

/* Строка 1: "НЕПРЕДВИДЕННЫЙ" (-25% кегль) */
.hero-line-word-1 {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 4.8vw, 4.6rem); /* Уменьшено на 25% */
  line-height: 1.0;
  letter-spacing: 0.015em;
  color: #FFFFFF;
  display: block;
  width: 100%;
  text-align: justify;
  text-align-last: justify;
}

/* Строка 2: "ФАКТОР" (Увеличено расстояние, кегль скорректирован под ширину) */
.hero-line-word-2 {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(4.4rem, 11.8vw, 11.4rem); /* Откалиброван под точный правый край */
  line-height: 0.95;
  letter-spacing: 0.025em;
  color: #FFFFFF;
  display: block;
  width: 100%;
  text-align: justify;
  text-align-last: justify;
  /* Увеличение расстояния между строками: исключает наезд букв */
  margin-top: clamp(12px, 1.8vw, 24px); 
}

/* Строка 3: "ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ." */
.hero-subtitle {
  width: 100%;
  /* Отступ от слова ФАКТОР */
  margin-top: clamp(18px, 2.5vw, 32px);
}

.hero-line-subtitle {
  font-family: 'Bounded', sans-serif;
  font-weight: 300;
  font-size: clamp(0.58rem, 1.4vw, 1.25rem); /* Уменьшено на 25% */
  line-height: 1.2;
  letter-spacing: 0.185em; /* Растягивает правый край ровно под букву "Р" и "Й" */
  color: #FFFFFF;
  display: block;
  width: 100%;
  text-align: justify;
  text-align-last: justify;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] Общий масштаб блока уменьшен ровно на 25% (макс. ширина контейнера сужена с 1150px до 860px).
- [x] Правый край букв «Й», «Р» и завершающей точки «.» образует единую строгую вертикаль без выступов.
- [x] Устранен наезд слова `НЕПРЕДВИДЕННЫЙ` на `ФАКТОР` (добавлен безопасный зазор `margin-top: clamp(12px, 1.8vw, 24px)`).
- [x] Текст выровнен строго по центру горизонтальной и вертикальной осей экрана Hero.
