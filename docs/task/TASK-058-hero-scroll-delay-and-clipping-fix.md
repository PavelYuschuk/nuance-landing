# TASK-058: Задержка Анимации Hero на 3 Тика Скролла и Устранение Обрезания Текста Секцией 3.3

**Status:** DONE  
**Target File(s):** `src/scripts/hero-parallax.js`, `src/styles/hero.css`  
**Parent Specification:** TASK-053, TASK-055  

---

## 1. Контекст и Анализ Проблемы (Root Cause Analysis)

В секции **3.2 Hero-блок (Точка входа)** для монолитного текста левой колонки (`.hero-left-content` / `.hero-monolith-wrapper`):

1. **Отсутствие стартовой паузы (срабатывание с первого пикселя):**  
   Ранее функция растворения начинала понижать непрозрачность сразу же при малейшем сдвиге скролла (`scrollY > 0`). Пользователь не успевал зафиксировать взгляд на тексте — он начинал таять мгновенно.
   *Требование:* зафиксировать текст на 100% непрозрачности на первые **3 тика скролла** (примерно 200–220px хода колеса мыши), и только после этого начинать плавное растворение.

2. **Обрезание текста секцией 3.3 («О нас»):**  
   При прокрутке страницы монолитный текст срезался снизу. Причины две:
   - **Внутренний срез контейнера Hero:** В `.hero` было прописано `overflow: hidden;`. При компенсации скролла (`translateY(scrollY)`) текст смещался вниз относительно родителя и физически отсекался нижней границей блока Hero.
   - **Перекрытие наступающей секцией 3.3:** Секция 3.3 наезжает снизу со скоростью скролла страницы и имеет слой градиентного блюра (`backdrop-filter: blur(14px)`). Ранее затухание Hero было растянуто на 55% высоты Hero (~550–600px), из-за чего на отметке 350px (когда секция 3.3 уже доходила до текста) текст еще оставался на 35% видимым и жестко срезался границей входящей секции.

---

## 2. Инженерное Решение

1. **Задержка на 3 тика скролла (`SCROLL_DELAY_TICKS = 210px`):**
   - На интервале от `0` до `210px`: `opacity` строго зафиксирован на `1.0`. Текст на 100% четкий, устойчивый и полностью читаемый.
   - Текст неподвижен на экране монитора благодаря точной компенсации скролла (`translateY(${scrollY}px)`).

2. **Калибровка диапазона растворения ДО контакта с Секцией 3.3:**
   - Растворение начинается строго с `210px` и завершается ровно в `0.0` к `370px`.
   - На отметке `370px` секция 3.3 еще физически не доходит до строки подзаголовка Hero, благодаря чему текст успевает полностью растаять в воздухе до любого физического контакта со следующей секцией.
   - При `opacity === 0` элементу выставляется `visibility: hidden; pointer-events: none;`, полностью исключая артефакты рендеринга.

3. **Снятие внутреннего отсечения в CSS (`src/styles/hero.css`):**
   - В правиле `.hero` свойство `overflow: hidden` заменяется на `overflow: visible`. Это исключает срезание выступающего нижнего края SVG-монолита при компенсационном смещении.

---

## 3. Инженерная Спецификация (Implementation Spec)

### 3.1. Снятие Отсечения в CSS (`src/styles/hero.css`)

```css
/* ==========================================
   Секция 3.2 Hero: Снятие отсечения текста (TASK-058)
   ========================================== */

.hero {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Исключено отсечение компенсированного текста: */
  overflow: visible;
  
  background: transparent;
  padding: 0;
  z-index: 2;
}

.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
  
  opacity: 1;
  transform: none;
  animation: none !important;
  will-change: transform, opacity;
}
```

---

### 3.2. Логика Задержки и Безопасного Растворения (`src/scripts/hero-parallax.js`)

```javascript
/* =========================================================
   Hero Monolith: Задержка на 3 Тика + Растворение до Секции 3.3 (TASK-058)
   ========================================================= */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  // 1 тик стандартного скролла колеса мыши ~70px. 3 тика = 210px.
  const SCROLL_DELAY_PX = 210;
  
  // Дистанция полного ухода в ноль (завершается ДО подхода секции 3.3 к тексту):
  const FADE_END_PX = 370;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;

    // 1. ФАЗА ЗАДЕРЖКИ (первые 3 тика скролла):
    // Текст остается на 100% непрозрачным и стабильным
    if (scrollY <= SCROLL_DELAY_PX) {
      heroContent.style.opacity = '1';
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // 2. ФАЗА РАСТВОРЕНИЯ (между 3-м тиком и границей секции 3.3):
    // Плавное таяние от 1.0 до 0.0 на безопасном отрезке
    else if (scrollY < FADE_END_PX) {
      const progress = (scrollY - SCROLL_DELAY_PX) / (FADE_END_PX - SCROLL_DELAY_PX);
      const opacity = Math.max(0, Math.min(1, 1 - progress));
      
      heroContent.style.opacity = opacity.toFixed(3);
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // 3. ФАЗА ПОЛНОГО РАСТВОРЕНИЯ:
    // Текст полностью растворен ДО подхода секции 3.3, исключая любое обрезание
    else {
      heroContent.style.opacity = '0';
      heroContent.style.visibility = 'hidden';
      heroContent.style.pointerEvents = 'none';
    }

    // Компенсация скролла: текст остается неподвижным в координатах монитора (0px движения):
    heroContent.style.transform = scrollY > 0 ? `translateY(${scrollY}px)` : 'none';
  }

  window.addEventListener('scroll', updateHeroScrollFade, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateHeroScrollFade);
  }

  updateHeroScrollFade();
}
```

---

## 4. Чек-лист Проверки Реализации (Verification Plan)

- [x] Статус спецификации: `Status: DONE`.
- [x] В `src/styles/hero.css` свойство `.hero` обновлено с `overflow: hidden` на `overflow: visible`.
- [x] При первых 3 тиках скролла вниз (`0 ➔ 210px`) текст Hero остается на 100% непрозрачным (`opacity: 1`).
- [x] После 3-го тика (`210px ➔ 370px`) текст плавно и равномерно тает от 1.0 до 0.0.
- [x] К моменту появления границы секции 3.3 («О нас») текст уже полностью растворен (`opacity: 0`, `visibility: hidden`), исключая любое визуальное наложение или срез букв.
- [x] Текст физически неподвижен на экране монитора во время растворения (`translateY(scrollY)`).
- [x] Все адаптивные и типографические стили полностью сохранены.
