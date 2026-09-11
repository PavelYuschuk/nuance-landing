# TASK-080: Устранение Дёрганья и Прыжков Текста Hero при Скролле (Scroll Jitter Fix)

**Status:** DONE  
**Target File(s):** `src/scripts/hero-parallax.js`, `src/styles/hero.css`  
**Parent Specification:** TASK-053, TASK-058, TASK-059, TASK-079  

---

## 1. Контекст и Анализ Причины Бага

После развертывания проекта на продакшене (Vercel) и перехода на `SmoothScroll.js` (TASK-079) проявился визуальный баг:
> *«текст с `<!-- 3.2 Hero-блок (Точка входа) -->` реагирует на прокрутку, он дергается и прыгает.»*

### 1.1. Корень проблемы (Scroll Jitter Desynchronization)
В файле [`src/scripts/hero-parallax.js`](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/hero-parallax.js) в строке 48 содержится компенсация скролла через JavaScript:
```javascript
// Компенсация скролла: текст зафиксирован на экране (0px смещения относительно монитора):
heroContent.style.transform = scrollY > 0 ? `translateY(${scrollY}px)` : 'none';
```

**Почему это вызывает сильное дрожание и прыжки на Vercel (в браузере):**
1. **Рассинхронизация потоков (Compositor vs Main Thread):**  
   Когда страница скроллится, браузер смещает весь документ в аппаратном потоке композитора (Compositor Thread) со скоростью дисплея (60/120/144 fps).
2. **Задержка JS-события:**  
   Событие `window.addEventListener('scroll')` обрабатывается в главном потоке (Main Thread) с отставанием на 1–2 кадра. 
3. **Эффект качелей (Jitter Loop):**  
   - Кадр 1: Скроллер сдвинул блок Hero вверх на $N$ пикселей.
   - Кадр 2: JS прочитал `scrollY` и применил `translateY(+N px)`.
   - Происходит постоянная борьба: на доли миллисекунды текст улетает вверх, затем JS возвращает его назад. При плавном скролле с инерцией (SmoothScroll.js) эта микро-разница в $2\dots 15\text{px}$ на каждом тике воспринимается человеческим глазом как постоянное «вибрирование», дрожание и подскакивание текста.

### 1.2. Архитектурное Решение
Компенсация через `translateY(scrollY)` в JS является антипаттерном.  
Секция 3.3 Genesis (`.about-sticky-section`) имеет `position: relative; z-index: 3` и поднимается **поверх** блока Hero (`z-index: 2`).  
Если требуется, чтобы текст Hero оставался неподвижным на экране, пока Секция 3.3 наезжает на него, правильное и 100% плавное аппаратное решение — перевести контейнер Hero в CSS `position: sticky; top: 0` или зафиксировать контент, а в JS оставить **исключительно расчет `opacity`** без каких-либо `transform: translateY`!

---

## 2. Спецификация Изменений в `src/scripts/hero-parallax.js`

В [src/scripts/hero-parallax.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/hero-parallax.js):
1. **Полностью удаляется** строка `heroContent.style.transform = ...` (строка 48).
2. JS-модуль управляет **только плавным растворением** (`opacity` и `visibility`).
3. При необходимости начального сброса явно выставляется `heroContent.style.transform = 'none'`.

### Было (строки 46–50):
```javascript
    // Компенсация скролла: текст зафиксирован на экране (0px смещения относительно монитора):
    heroContent.style.transform = scrollY > 0 ? `translateY(${scrollY}px)` : 'none';
  }
```

### Стало:
```javascript
    // TASK-080: Устранено дрожание: transform не модифицируется в JS, фиксация выполняется аппаратно через CSS
  }
```

---

## 3. Спецификация Изменений в `src/styles/hero.css`

Чтобы текст оставался монолитно неподвижным на экране при прокрутке и не уезжал вверх, пока Секция 3.3 плавно наезжает на него (и текст растворяется), блоку Hero назначается аппаратная фиксация через CSS:

В [src/styles/hero.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/hero.css):

### Было (строки 5–18):
```css
.hero {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* Исключено отсечение компенсированного текста (TASK-058): */
  overflow: visible;
  background: transparent;
  padding: 0;
  z-index: 2;
}
```

### Стало:
```css
.hero {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky; /* TASK-080: Аппаратная плавная фиксация на экране без дрожания JS */
  top: 0;
  overflow: visible;
  background: transparent;
  padding: 0;
  z-index: 2;
}
```

А в правиле `.hero-left-content` (строки 36–50):

```css
.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  position: relative;
  z-index: 2;
  
  /* Полная статика: никакого движения и никаких стартовых анимаций */
  opacity: 1;
  transform: none !important; /* Гарантия отсутствия смещений */
  animation: none !important;
  will-change: opacity; /* Исключен transform для освобождения GPU */
}
```

---

## 4. Как это работает вместе

1. **`position: sticky; top: 0` в CSS:**  
   Пока пользователь крутит колесико на первых экранах, блок Hero аппаратно удерживается браузером в `top: 0` (в потоке композитора GPU). Смещение равно строго `0.00px`, без микро-лагов и задержек в миллисекунды.
2. **Скрипт `updateHeroScrollFade()`:**  
   Скрипт вычисляет `opacity` от $1.0$ до $0.0$ по кривой Smoothstep по мере приближения Секции 3.3.
3. **Секция 3.3 (`.about-sticky-section`):**  
   Имеет `z-index: 3` и полупрозрачный градиентный блюр `about-sticky-section::before`. Она накатывает сверху на зафиксированный и растворяющийся монолит Hero, создавая идеальный кино-эффект без малейшего намека на дрожание.

---

## 5. План Верификации и Тестирования

1. **Проверка в режиме быстрого и медленного скролла:**
   - [x] При вращении колесика мыши текст монолита Hero («НЕПРЕДВИДЕННЫЙ НЮАНС...») стоит на месте как влитой.
   - [x] Отсутствуют любые рывки, подрагивания или скачки текста вверх-вниз.
2. **Проверка плавного растворения:**
   - [x] Первые 210px скролла текст сохраняет 100% непрозрачность.
   - [x] Далее текст плавно затухает до 0% к моменту наката Секции 3.3.
3. **Проверка на мобильных и десктопных устройствах:**
   - [x] Протестировать деплой на Vercel с Chrome, Safari и Edge — поведение монолита стабильно везде.
