# Резервные Варианты Анимаций: Hero-блок (Левая колонка — Монолитный текст)

В данном документе собраны все готовые варианты CSS-анимаций для левой колонки секции **3.2 Hero-блок (Точка входа)** (`.hero-left-content` / `.hero-monolith-wrapper`).

---

## Вариант 1: Плавный кинетический выезд со смещением и затуханием (Smooth Kinetic Slide)
*Рекомендуемый базовый вариант с физической кривой замедления `cubic-bezier(0.16, 1, 0.3, 1)` и микро-расфокусом:*

```css
/* Левая колонка: контейнер монолитного текста */
.hero-left-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  
  /* Подготовка к анимации */
  opacity: 0;
  transform: translateX(-45px);
  will-change: transform, opacity;
  
  /* Запуск анимации проявления */
  animation: heroTextRevealLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}

@keyframes heroTextRevealLeft {
  0% {
    opacity: 0;
    transform: translateX(-45px);
    filter: blur(6px); /* Легкий эффект расфокуса в начале */
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0px);
  }
}
```

---

## Вариант 2: Построчный каскадный Reveal (Поочередное проявление строк)
*Эффект поочередного выезда строк («НЕПРЕДВИДЕННЫЙ» -> «ФАКТОР» -> Подзаголовок) с микрозадержками:*

```css
/* Строка 1: НЕПРЕДВИДЕННЫЙ */
.hero-monolith-svg text:nth-of-type(1),
.hero-line-word-1 {
  opacity: 0;
  transform: translateX(-30px);
  animation: heroLineCascade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}

/* Строка 2: ФАКТОР */
.hero-monolith-svg text:nth-of-type(2),
.hero-line-word-2 {
  opacity: 0;
  transform: translateX(-40px);
  animation: heroLineCascade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards;
}

/* Строка 3: ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ. */
.hero-monolith-svg text:nth-of-type(3),
.hero-line-subtitle {
  opacity: 0;
  transform: translateX(-20px);
  animation: heroLineCascade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
}

@keyframes heroLineCascade {
  0% {
    opacity: 0;
    transform: translateX(-35px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## Вариант 3: Тактический шторный Reveal (`clip-path`)
*Эффект строгой военной развертки текста слева направо:*

```css
.hero-monolith-wrapper {
  clip-path: inset(0 100% 0 0);
  animation: tacticalCurtainReveal 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

@keyframes tacticalCurtainReveal {
  0% {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    clip-path: inset(0 0% 0 0);
    opacity: 1;
  }
}
```
