# TASK-032: Интеграция Оригинального Шрифта Bounded (Vlad Churkin) в Hero

**Status:** DONE  
**Target File(s):** `src/styles/typography.css`, `src/styles/hero.css`, `index.html`  
**Parent Specification:** TASK-031 (`docs/task/TASK-031-hero-monolithic-typography.md`)  
**Assets Location:** `public/assets/fonts/Bounded-Bold.woff2`, `public/assets/fonts/Bounded-Light.woff2`

---

## 1. Контекст и Цель Модификации
1. **Подключение оригинального шрифта:** Замена шрифта Hero на локальный оригинальный дисплейный шрифт **Bounded (автор: Vlad Churkin)**, файлы которого уже размещены в `public/assets/fonts/`.
2. **Абсолютная ширина строк (Equal Width):** Точная подгонка кеглей под глифы шрифта Bounded, чтобы все 3 подблока (`НЕПРЕДВИДЕННЫЙ`, `ФАКТОР`, `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.`) занимали **ровно одинаковую ширину от края до края**.
3. **Строгое центрирование:** Выравнивание всего монолитного типографического блока строго по центру вьюпорта и сетки.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Подключение Локального Шрифта Bounded (`src/styles/typography.css`)

```css
/* ==========================================
   Bounded by Vlad Churkin (@font-face)
   ========================================== */
@font-face {
  font-family: 'Bounded';
  src: url('/assets/fonts/Bounded-Bold.woff2') format('woff2'),
       url('/assets/fonts/Bounded-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Bounded';
  src: url('/assets/fonts/Bounded-Light.woff2') format('woff2'),
       url('/assets/fonts/Bounded-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
```

В `:root` (`src/styles/variables.css`):
```css
--font-hero: 'Bounded', sans-serif;
```

---

### 2.2. Архитектура Разметки (`index.html`)

```html
<!-- 3.2 Hero-блок (Точка входа) -->
<section id="hero" class="hero">
  <div class="container hero-container">
    <div class="hero-monolith-block">
      
      <!-- Заголовок: 2 подблока Bounded Bold равной ширины -->
      <h1 class="hero-title">
        <span class="hero-line hero-line-word-1">НЕПРЕДВИДЕННЫЙ</span>
        <span class="hero-line hero-line-word-2">ФАКТОР</span>
      </h1>

      <!-- Подзаголовок: Bounded Light подстроенный под ту же ширину -->
      <div class="hero-subtitle">
        <span class="hero-line hero-line-subtitle">ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.</span>
      </div>

    </div>
  </div>
</section>
```

---

### 2.3. Спецификация Геометрии и Кеглей под Глифы Bounded (`src/styles/hero.css`)

В шрифте **Bounded (Vlad Churkin)** пропорции символов слова `ФАКТОР` (буквы Ф, А, К, Т, О, Р) имеют широкий геометрический скелет, поэтому коэффициент соотношения кегля к слову `НЕПРЕДВИДЕННЫЙ` составляет ровно **`2.18x`**:

```css
/* Полноэкранное центрирование Hero */
.hero {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

/* Монолитный блок - строго по центру */
.hero-monolith-block {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: min(94vw, 1150px);
  margin: 0 auto;
  text-align: center;
}

.hero-line {
  display: block;
  width: 100%;
  white-space: nowrap;
  text-transform: uppercase;
}

/* =========================================================
   СТРОКА 1: "НЕПРЕДВИДЕННЫЙ" (Bounded BOLD)
   ========================================================= */
.hero-line-word-1 {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(2.4rem, 6.4vw, 6.2rem);
  line-height: 0.95;
  letter-spacing: 0.03em;
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
}

/* =========================================================
   СТРОКА 2: "ФАКТОР" (Bounded BOLD, кегль увеличен в 2.18x)
   ========================================================= */
.hero-line-word-2 {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: clamp(5.2rem, 13.95vw, 13.5rem);
  line-height: 0.84; /* Плотная посадка без зазора */
  letter-spacing: 0.015em;
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
  margin-top: -0.04em;
}

/* =========================================================
   СТРОКА 3: "ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ." (Bounded LIGHT)
   ========================================================= */
.hero-subtitle {
  width: 100%;
  margin-top: clamp(14px, 2.2vw, 28px);
}

.hero-line-subtitle {
  font-family: 'Bounded', sans-serif;
  font-weight: 300;
  font-size: clamp(0.75rem, 1.85vw, 1.8rem);
  line-height: 1.2;
  letter-spacing: 0.17em; /* Растягивает строку ровно до внешних границ слов выше */
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
}
```

---

### 2.4. Прецизионная SVG-Калибровка для Идеального Совпадения Границ
Для гарантии 100.0% математического совпадения ширины всех трех подблоков на любых типах матриц (без зависимости от системного рендеринга кернинга браузеров):

```html
<svg viewBox="0 0 1000 370" width="100%" class="hero-monolith-svg" style="display: block; margin: 0 auto; max-width: 1150px;">
  <!-- Строка 1: НЕПРЕДВИДЕННЫЙ -->
  <text x="0" y="85" textLength="1000" lengthAdjust="spacingAndGlyphs" font-family="'Bounded', sans-serif" font-weight="700" font-size="88" fill="#FFFFFF">НЕПРЕДВИДЕННЫЙ</text>
  
  <!-- Строка 2: ФАКТОР -->
  <text x="0" y="280" textLength="1000" lengthAdjust="spacingAndGlyphs" font-family="'Bounded', sans-serif" font-weight="700" font-size="224" fill="#FFFFFF">ФАКТОР</text>
  
  <!-- Строка 3: ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ. -->
  <text x="0" y="350" textLength="1000" lengthAdjust="spacing" font-family="'Bounded', sans-serif" font-weight="300" font-size="30" fill="#FFFFFF">ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.</text>
</svg>
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ равен `Status: DONE`.
- [x] Подключен оригинальный шрифт **Bounded (Vlad Churkin)** из `public/assets/fonts/` (Bold и Light начертания).
- [x] Внешний контейнер Hero и монолитный текстовый блок строго центрированы по осям X и Y.
- [x] Все три строки (`НЕПРЕДВИДЕННЫЙ`, `ФАКТОР`, `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.`) образуют единый прямоугольник одинаковой ширины.
- [x] Межстрочный интервал плотный, буквы не наезжают друг на друга и не образуют визуальных дыр.
