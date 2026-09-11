# TASK-079: Интеграция Движка Плавного Скролла SmoothScroll.js (v1.4.10) по Референсу Yarsy.com

**Status:** DONE  
**Target File(s):** `package.json`, `index.html`, `src/scripts/smooth-scroll.js`, `src/scripts/main.js`, `src/scripts/team-scroll.js`, `src/scripts/navigation.js`  
**Parent Specification:** TASK-004, TASK-010, TASK-023, TASK-067, TASK-076  
**Reference Site:** [yarsy.com](https://www.yarsy.com/) (`SmoothScroll.js v1.4.10` by Balazs Galambosi)  

---

## 1. Контекст и Постановка Задачи

Пользователь провел анализ кинематики плавного скролла на референсном сайте [yarsy.com](https://www.yarsy.com/) и поставил задачу внедрить аналогичный движок скролла на сайт **NUANCE Landing**, заменив текущую виртуальную модель Lenis на классический физический momentum-скролл **`SmoothScroll.js`**.

### 1.1. В чем отличие ощущений SmoothScroll.js от Lenis
1. **Механика колеса мыши (Momentum Wheel):**  
   В отличие от Lenis (который полностью виртуализирует скролл через Lerp в `requestAnimationFrame`), `SmoothScroll.js` перехватывает событие `wheel` и выполняет математически точную физическую доводку нативного скролла окна (`window.scrollBy`) по сглаженной кубической кривой. Это создает эффект приятной «массы» и инерции при вращении колесика мыши.
2. **Нативная поддержка тачпадов (`touchpadSupport: false`):**  
   На тачпадах ноутбуков (MacBook, Windows Precision Touchpad) искусственная инерция полностью отключается. Пользователь получает мгновенный, нативный 1:1 отклик без задержек и «желейности», в то время как скролл колесиком мыши остается кинематографически плавным.
3. **100% совместимость со `position: sticky`:**  
   Поскольку скролл остается нативным на уровне браузерного композитора (Compositor Thread), sticky-секции (Секция 3.3 Genesis и Секция 3.4 Team) работают абсолютно стабильно, без микро-джиттера и рассинхронизации.

---

## 2. Необходимые Зависимости и Подключение

Библиотека может быть подключена двумя способами: через npm-пакет `smoothscroll-for-websites` или через CDN в [index.html](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/index.html).

### Вариант А (Рекомендуемый для Vite через npm):
```bash
npm install smoothscroll-for-websites
```
*(При этом неиспользуемый пакет `lenis` можно удалить: `npm uninstall lenis`).*

### Вариант Б (Прямое CDN-подключение как на yarsy.com в `index.html`):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js" type="text/javascript"></script>
```

---

## 3. Точные Параметры Калибровки Физики (Эталон Yarsy.com)

Сайт `yarsy.com` использует следующие выверенные коэффициенты:

| Параметр | Значение | Описание |
|---|---|---|
| `animationTime` | `1000` | Длительность анимации доводки скролла в миллисекундах (ровно 1.0 секунда мягкого затухания) |
| `stepSize` | `100` | Базовый шаг прокрутки в пикселях за один клик колесика мыши |
| `accelerationDelta` | `50` | Временной интервал между кликами для детекции ускорения |
| `accelerationMax` | `3` | Максимальный множитель скорости при быстром вращении колесика (до 300px за шаг) |
| `touchpadSupport` | `false` | Отключение вмешательства в тачпады для сохранения нативного 1:1 жеста |

---

## 4. Спецификация Модуля `src/scripts/smooth-scroll.js`

Полностью переписывается файл [src/scripts/smooth-scroll.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/smooth-scroll.js):

```javascript
/* ==========================================================================
   TASK-079: SmoothScroll.js Engine (Reference: yarsy.com)
   ========================================================================== */

import SmoothScroll from 'smoothscroll-for-websites';

/**
 * Инициализация физического скролла колесика мыши и плавной навигации по якорям
 */
export function initSmoothScroll() {
  // 1. Инициализация движка SmoothScroll с точной калибровкой yarsy.com
  SmoothScroll({
    animationTime     : 1000, // [ms] Длительность плавного торможения
    stepSize          : 100,  // [px] Шаг одного клика колесика
    accelerationDelta : 50,   // [ms] Порог быстрого вращения
    accelerationMax   : 3,    // Максимальное ускорение
    touchpadSupport   : false // Сохранение нативного 1:1 скролла на тачпадах
  });

  // 2. Плавная якорная навигация по клику на ссылки (#genesis, #team, #doctrine, #cta)
  const headerOffset = 70; // Отступ под фиксированный хедер

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  console.log('SmoothScroll.js (v1.4.10) engine initialized with yarsy.com calibration.');
}
```

---

## 5. Адаптация Смежных Модулей

Поскольку `SmoothScroll.js` управляет нативным скроллом окна, все слушатели `window.addEventListener('scroll', ...)` в модулях сайта автоматически работают с идеальной частотой обновления монитора (60Hz / 120Hz / 144Hz) без необходимости вызывать `lenis.on('scroll')`.

### 5.1. В `src/scripts/team-scroll.js`
В функции клика по карточкам ростера:

##### Было:
```javascript
  rosterCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const targetY = sectionTop + (index * (sectionHeight / 3)) + 10;

      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(targetY, { duration: 0.8 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });
```

##### Стало:
```javascript
  rosterCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const targetY = sectionTop + (index * (sectionHeight / 3)) + 10;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
```

### 5.2. В `src/scripts/navigation.js`
При клике на логотип для возврата наверх страницы:

##### Было:
```javascript
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
```

##### Стало:
```javascript
      window.scrollTo({ top: 0, behavior: 'smooth' });
```

---

## 6. (Опционально) Стилизация Скроллбара (как на Yarsy.com)

Если необходимо скрыть стандартный серый скроллбар браузера в стиле минимализма yarsy.com, в [src/styles/reset.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/reset.css) можно добавить:

```css
/* Скрытие нативного скроллбара для чистоты интерфейса */
html {
  scrollbar-width: thin;
  scrollbar-color: #27354D transparent;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #27354D;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00E5FF;
}
```

---

## 7. План Верификации и Тестирования

1. **Проверка работы колесика мыши:**
   - [x] При одиночном вращении колесика мыши скролл мягко прокатывается на $100\text{px}$ и плавно тормозит в течение 1.0 секунды.
   - [x] При быстром вращении колесика скорость плавно нарастает до $3\times$ без рывков и подвисаний.
2. **Проверка работы тачпада:**
   - [x] При скролле двумя пальцами на тачпаде отклик страницы остается мгновенным (1:1), без желеобразных лагов.
3. **Проверка Sticky-секций (Genesis и Team):**
   - [x] Смена слоев в Секции 3.3 (Кто мы $\to$ История $\to$ Механизм) и Секции 3.4 (Presa4ek $\to$ Art1zi $\to$ Matvi4) происходит абсолютно плавно, без дерганий контента.
4. **Проверка якорных переходов:**
   - [x] Клики по пунктам меню хедера («О Нас», «Команда», «Доктрина», «Контакты») плавно скроллят страницу к соответствующим секциям с учетом высоты хедера.
   - [x] Клик по логотипу плавно возвращает в самый верх страницы к блоку Hero.
