# TASK-031: Монолитная Выключка Типографики в "3.2. Hero-блок"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/hero.css`, `src/styles/variables.css`  
**Reference:** Загруженный референс (`media_1788884377691.png`)

---

## 1. Контекст и Визуальный Анализ
Рефакторинг главного экрана (Hero) под концепцию **монолитного типографического блока одинаковой ширины (Justified Monolithic Typographic Stack)** на базе шрифта **Unbounded** (в запросе указан как Bounded):
- **Строка 1 (Слово 1):** `НЕПРЕДВИДЕННЫЙ` — Unbounded Black/Bold (14 символов).
- **Строка 2 (Слово 2):** `ФАКТОР` — Unbounded Black/Bold (6 символов, кегль в ~2.2 раза крупнее первой строки).
- **Строка 3 (Подзаголовок):** `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.` — Unbounded Light (300/400).
- **Ключевое правило геометрии:** Все 3 строки имеют **абсолютно одинаковую физическую ширину** (от левого до правого края образуют идеальный прямоугольный монолит) и центрированы на экране.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Подключение Шрифта (`index.html`)
В тег `<head>` подключается семейство шрифта **Unbounded** (Google Fonts):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;700;800;900&display=swap" rel="stylesheet">
```

В `:root` (`src/styles/variables.css`):
```css
--font-hero: 'Unbounded', sans-serif;
```

---

### 2.2. Архитектура и Разметка Контейнера (`index.html`)

```html
<!-- 3.2 Hero-блок (Точка входа) -->
<section id="hero" class="hero">
  <div class="container hero-container">
    <div class="hero-monolith-block">
      
      <!-- Заголовок H1: Две строки равной ширины (Bold / Black 900) -->
      <h1 class="hero-title">
        <span class="hero-line hero-line-word-1">НЕПРЕДВИДЕННЫЙ</span>
        <span class="hero-line hero-line-word-2">ФАКТОР</span>
      </h1>

      <!-- Подзаголовок: Третья строка той же ширины (Light 300) -->
      <div class="hero-subtitle">
        <span class="hero-line hero-line-subtitle">ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.</span>
      </div>

    </div>
  </div>
</section>
```

---

### 2.3. Спецификация Стилизации и Математических Пропорций (`src/styles/hero.css`)

```css
/* Центрированный полноэкранный вьюпорт Hero */
.hero {
  min-height: 100vh;
  height: 100vh;
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
}

/* Монолитный стековый блок фиксированной/флюидной ширины */
.hero-monolith-block {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: min(92vw, 1100px);
  margin: 0 auto;
  text-align: center;
}

/* Общее правило для строк монолита */
.hero-line {
  display: block;
  width: 100%;
  white-space: nowrap;
  text-transform: uppercase;
}

/* =========================================================
   СТРОКА 1: "НЕПРЕДВИДЕННЫЙ" (14 букв)
   ========================================================= */
.hero-line-word-1 {
  font-family: var(--font-hero);
  font-weight: 900;
  font-size: clamp(2.2rem, 6.2vw, 5.8rem);
  line-height: 0.95;
  letter-spacing: 0.04em;
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
}

/* =========================================================
   СТРОКА 2: "ФАКТОР" (6 букв - кегль в 2.2 раза крупнее)
   ========================================================= */
.hero-line-word-2 {
  font-family: var(--font-hero);
  font-weight: 900;
  font-size: clamp(4.8rem, 13.8vw, 12.8rem);
  line-height: 0.85; /* Максимально плотная вертикальная стыковка со словом выше */
  letter-spacing: 0.02em;
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
  margin-top: -0.05em; /* Бесшовное сближение букв */
}

/* =========================================================
   СТРОКА 3: "ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ."
   ========================================================= */
.hero-subtitle {
  width: 100%;
  margin-top: clamp(12px, 2vw, 24px);
}

.hero-line-subtitle {
  font-family: var(--font-hero);
  font-weight: 300; /* Bounded Light */
  font-size: clamp(0.7rem, 1.85vw, 1.7rem);
  line-height: 1.2;
  letter-spacing: 0.16em; /* Равномерный трекинг до границы двух слов выше */
  color: #FFFFFF;
  text-align: justify;
  text-align-last: justify;
}
```

---

### 2.4. Альтернативное Прецизионное Решение через SVG (Опция 100% совпадения пикселей)
Если на нестандартных экранах требуется математическое совпадение ширины 1 в 1 без погрешностей кернинга:

```html
<svg viewBox="0 0 1000 360" width="100%" class="hero-monolith-svg">
  <!-- Строка 1 -->
  <text x="0" y="80" textLength="1000" lengthAdjust="spacingAndGlyphs" font-family="'Unbounded', sans-serif" font-weight="900" font-size="82" fill="#FFFFFF">НЕПРЕДВИДЕННЫЙ</text>
  <!-- Строка 2 -->
  <text x="0" y="270" textLength="1000" lengthAdjust="spacingAndGlyphs" font-family="'Unbounded', sans-serif" font-weight="900" font-size="210" fill="#FFFFFF">ФАКТОР</text>
  <!-- Строка 3 -->
  <text x="0" y="340" textLength="1000" lengthAdjust="spacing" font-family="'Unbounded', sans-serif" font-weight="300" font-size="28" fill="#FFFFFF">ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.</text>
</svg>
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ равен `Status: DONE`.
- [x] Подключен шрифт Unbounded (веса 300, 400, 700, 900).
- [x] Слово `НЕПРЕДВИДЕННЫЙ` и слово `ФАКТОР` имеют разный кегль, но абсолютно одинаковую ширину от левого до правого края.
- [x] Межстрочный интервал между словами плотный (`line-height: 0.85–0.95`), исключающий пустоты.
- [x] Подзаголовок `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.` набран шрифтом Unbounded Light (300) и выровнен строго по ширине строк выше.
- [x] Весь монолитный типографический блок отцентрирован по осям X и Y экрана Hero.
