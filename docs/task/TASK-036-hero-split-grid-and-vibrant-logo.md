# TASK-036: Двухколоночный Grid в Hero (Текст Слева, Увеличенный Логотип Справа) и Анимация Проявления

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/hero.css`, `src/styles/main.css`, `src/scripts/hero-parallax.js`  
**Visual Reference:** Канонический макет (`media_1788887844874.png`)

---

## 1. Контекст и Анализ Референса
По предоставленному референсу (`media_1788887844874.png`):
1. **Очистка `.global-bg-logo`:** С фонового логотипа полностью удаляются все эффекты замутнения и искажения (`filter: blur(...)` удален, `opacity: 0.22` отключен).
2. **Двухколоночная композиция по сетке в Hero (3.2):**
   - **Слева:** Монолитный типографический блок Bounded (`НЕПРЕДВИДЕННЫЙ`, `ФАКТОР`, `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.`).
   - **Справа:** Крупный, яркий, полноцветный круглый знак отряда (NUANCE emblem).
3. **Увеличение размера логотипа на +50%:** Логотип масштабируется до массивного доминантного размера (`width: clamp(380px, 42vw, 620px)`).
4. **Кинематографичная анимация проявления при загрузке (Intro Reveal):** При старте страницы текст плавно проявляется слева, а логотип — справа.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Очистка `.global-bg-logo` (`src/styles/main.css`)

С фонового логотипа снимаются все паразитные эффекты (блюр, чрезмерная прозрачность):

```css
/* Снятие эффектов с .global-bg-logo */
.global-bg-logo {
  filter: none !important;
  opacity: 1 !important;
}
```

---

### 2.2. Разметка Двухколоночной Сетки Hero (`index.html`)

В секции `#hero` разметка переводится на 12-колоночную сетку:

```html
<!-- 3.2 Hero-блок (Точка входа) -->
<section id="hero" class="hero">
  <div class="container hero-container">
    <div class="grid-12 hero-split-grid">
      
      <!-- Левая колонка (6-7 колонок): Монолитный текст -->
      <div class="col-7 hero-left-content">
        <div class="hero-monolith-wrapper">
          <svg viewBox="0 0 1000 360" class="hero-monolith-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="НЕПРЕДВИДЕННЫЙ ФАКТОР">
            <!-- Строка 1: НЕПРЕДВИДЕННЫЙ -->
            <text x="0" y="76" textLength="1000" lengthAdjust="spacingAndGlyphs" 
                  font-family="'Bounded', sans-serif" font-weight="700" font-size="74" fill="#FFFFFF">
              НЕПРЕДВИДЕННЫЙ
            </text>
            
            <!-- Строка 2: ФАКТОР -->
            <text x="0" y="274" textLength="1000" lengthAdjust="spacingAndGlyphs" 
                  font-family="'Bounded', sans-serif" font-weight="700" font-size="218" fill="#FFFFFF">
              ФАКТОР
            </text>
            
            <!-- Строка 3: ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ. -->
            <text x="0" y="344" textLength="1000" lengthAdjust="spacing" 
                  font-family="'Bounded', sans-serif" font-weight="300" font-size="25" fill="#FFFFFF">
              ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.
            </text>
          </svg>
        </div>
      </div>

      <!-- Правая колонка (5-6 колонок): Увеличенный на 50% сочный логотип -->
      <div class="col-5 hero-right-media">
        <div class="hero-logo-frame">
          <img src="/assets/images/NUANCE logo.png" alt="NUANCE Emblem" class="hero-prominent-logo" />
        </div>
      </div>

    </div>
  </div>
</section>
```

---

### 2.3. Стилизация, Габариты (+50%) и Анимация Проявления (`src/styles/hero.css`)

```css
/* ==========================================
   Hero Split Grid (Текст Слева / Логотип Справа)
   ========================================== */

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
  z-index: 2;
}

.hero-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.hero-split-grid {
  align-items: center;
  width: 100%;
}

/* Левая часть: Выравнивание текста */
.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  /* Анимация проявления слева */
  animation: heroRevealLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero-monolith-wrapper {
  width: 100%;
  max-width: 680px;
}

.hero-monolith-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Правая часть: Увеличенный на +50% сочный логотип */
.hero-right-media {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* Анимация проявления справа */
  animation: heroRevealRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
  opacity: 0; /* До старта анимации */
}

.hero-logo-frame {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Логотип увеличен на +50%: сочные родные цвета без замутнения */
.hero-prominent-logo {
  width: clamp(380px, 42vw, 620px); /* +50% масштаб */
  height: auto;
  display: block;
  filter: drop-shadow(0 0 50px rgba(0, 229, 255, 0.3)) 
          drop-shadow(0 0 80px rgba(193, 255, 0, 0.2));
  transform-origin: center center;
  user-select: none;
  pointer-events: none;
}

/* =========================================================
   КИНЕМАТОГРАФИЧНЫЕ KEYFRAMES ПРОЯВЛЕНИЯ ПРИ СТАРТЕ:
   ========================================================= */

@keyframes heroRevealLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroRevealRight {
  0% {
    opacity: 0;
    transform: translateX(50px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Адаптивные правила для планшетов и мобильных */
@media (max-width: 1024px) {
  .hero-split-grid {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 32px;
    text-align: center;
  }

  .hero-left-content {
    align-items: center;
  }

  .hero-prominent-logo {
    width: min(70vw, 360px);
  }
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] С `.global-bg-logo` сняты блюр и затухание.
- [x] Экран Hero разделен по 12-колоночной сетке на 2 зоны: текст слева (`.col-7`), логотип справа (`.col-5`).
- [x] Габариты эмблемы логотипа увеличены на +50% (`clamp(380px, 42vw, 620px)`), цвета яркие и сочные (неон `#C1FF00`, `#00E5FF`, `#FFC107`).
- [x] При загрузке страницы текст плавно выезжает слева (`heroRevealLeft`), а логотип проявляется справа (`heroRevealRight`).
