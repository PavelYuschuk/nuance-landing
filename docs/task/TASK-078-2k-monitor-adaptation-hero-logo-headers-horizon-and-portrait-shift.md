# TASK-078: Адаптация под 2K+ Мониторы: Позиционирование Логотипа Hero, Единый Горизонт Подблоков Заголовков и Смещение Портретов Zone 1 на 10%

**Status:** DONE  
**Target File(s):** `src/styles/main.css`, `src/styles/team.css`, `src/styles/doctrine.css`  
**Parent Specification:** TASK-002, TASK-037, TASK-040, TASK-045, TASK-047, TASK-049, TASK-056, TASK-071  

---

## 1. Контекст и Постановка Задачи

При переходе с Full HD (1920×1080) на экраны повышенного разрешения (2K QHD 2560×1440, Ultrawide 3440×1440, 4K 3840×2160) выявлены 3 аспекта композиции, требующие точной калибровки:

1. **Фоновый логотип Hero (`.global-bg-logo`):**  
   На Full HD (1920px) логотип гармонично заполнял правую пустую зону сетки (`col-5 hero-right-spacer`). Однако на мониторах 2K+ из-за привязки `right: clamp(10px, 4vw, 60px)` логотип «улетал» к физическому правому краю экрана монитора, отрываясь от центрированного контейнера сайта (1440px) на 500–1000px. Требуется динамически сместить логотип влево на 2K+ экранах, сохранив его посадку относительно контента Hero ровно такой же, как на HD мониторах.
2. **Единый композиционный горизонт подблоков заголовков (3.3 «О нас», 3.4 «КОМАНДА», 3.5 «Доктрина»):**  
   В Секции 3.4 подблок `team-header-subblock` имел высоту `52px`, `margin-bottom: 24px` и центрирование `align-items: center`, а в Секции 3.5 вся секция центрировалась по вертикали через `align-items: center`, из-за чего на 2K мониторах заголовок «Доктрина» смещался вниз на сотни пикселей.  
   Необходимо синхронизировать горизонт (высоту посадки Y и отступы) подблоков всех трех секций строго по эталону **`<!-- Левоориентированный подблок: О нас -->`** (100px от верха экрана, `min-height: 60px`, `margin-bottom: 28px`, `font-size: 45px`, `line-height: 1.15`).
3. **Смещение иллюстраций персонажей Zone 1 в Секции 3.4 на 10% вправо:**  
   На 2K+ мониторах ширина экрана позволяет сместить силуэт бойца (`.player-portrait-img` / `.team-portrait-wrapper`) на 10% правее, освобождая больше пространства для чтения карточек ростера и центрального описания персонажа.

---

## 2. Пункт 1: Смещение Фонового Логотипа Hero Влево на 2K+ Мониторах

### 2.1. Математический расчет привязки к контейнеру
Базовый контейнер сайта центрирован и имеет ограничение `--container-max-width: 1440px`:
- На Full HD ($1920\text{px}$): боковое поле экрана составляет $\frac{1920 - 1440}{2} = 240\text{px}$. При `right: 60px` расстояние от правого края логотипа до границы контейнера равно $240 - 60 = 180\text{px}$.
- На 2K QHD ($2560\text{px}$): боковое поле экрана возрастает до $\frac{2560 - 1440}{2} = 560\text{px}$. Разница составляет $560 - 240 = 320\text{px}$.

Чтобы логотип на 2K и 4K оставался на том же относительном расстоянии от текста, его смещение справа должно компенсировать увеличение бокового поля:

$$R_{\text{2K+}} = 60\text{px} + \frac{100\text{vw} - 1920\text{px}}{2}$$

Или через прямую привязку к правому краю контейнера:
$$R = \max\left(\text{clamp}(10\text{px}, 4\text{vw}, 60\text{px}), \frac{100\text{vw} - \text{var}(--\text{container-max-width})}{2} - 180\text{px}\right)$$

### 2.2. Спецификация в `src/styles/main.css`

В файле [src/styles/main.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/main.css) в блоке `.global-bg-logo` (строки 44–70):

```css
.global-bg-logo {
  position: absolute;
  top: 50%;
  /* Привязка к правой половине сетки Hero: */
  right: clamp(10px, 4vw, 60px);
  transform: translateY(-50%);
  
  /* РАЗМЕР УВЕЛИЧЕН В 2 РАЗА: */
  width: clamp(620px, 54vw, 1050px);
  height: auto;
  
  /* Полная четкость (без блюра) и 100% сочные цвета */
  opacity: 1;
  filter: none;
  
  /* GLOW-ЭФФЕКТ: */
  filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.18))
          drop-shadow(0 0 35px rgba(193, 255, 0, 0.12));
          
  user-select: none;
  pointer-events: none;
  z-index: 1;
  
  animation: bgLogoReveal 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* TASK-078: Компенсация смещения логотипа влево на мониторах 2K+ (сохранение посадки HD) */
@media (min-width: 1921px) {
  .global-bg-logo {
    /* Смещение влево пропорционально полуразнице ширины вьюпорта: */
    right: calc(60px + (100vw - 1920px) / 2);
  }
}
```

---

## 3. Пункт 2: Синхронизация Единого Горизонта Подблоков Заголовков

### 3.1. Эталонные параметры горизонта (Секция 3.3 Genesis «О нас»)
В эталонной секции 3.3:
1. **Положение верхнего горизонта:**  
   `padding-top: calc(var(--header-height) + 36px);` $\to$ ровно $100\text{px}$ от верхнего края экрана.
2. **Габариты и ритм подблока:**  
   `min-height: 60px; margin-bottom: 28px; display: flex; flex-direction: column; align-items: flex-start; text-align: left;`
3. **Типографика заголовка:**  
   `font-family: 'Bounded', sans-serif; font-size: 45px; line-height: 1.15; letter-spacing: 0.04em; text-transform: uppercase; margin: 0;`

### 3.2. Синхронизация Секции 3.4 (Team «КОМАНДА») в `src/styles/team.css`

В [src/styles/team.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/team.css) параметры `.team-header-subblock` и `.team-main-title` (строки 334–358) приводятся в 100% соответствие с эталоном:

##### Было:
```css
.team-header-subblock {
  width: 100%;
  max-width: 326px;
  margin-bottom: 24px;
  min-height: 52px;
  display: flex;
  align-items: center;
  align-self: flex-start;
  z-index: 5;
}

.team-main-title,
.team-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px;
  line-height: 1.0;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}
```

##### Стало:
```css
/* TASK-078: Единый горизонт с Секцией 3.3 О нас (TASK-078) */
.team-header-subblock {
  width: 100%;
  max-width: 326px;
  margin-bottom: 28px; /* Синхронизировано: 28px как в Genesis */
  min-height: 60px;    /* Синхронизировано: 60px как в Genesis */
  display: flex;
  flex-direction: column; /* Вертикальный стек как в Genesis */
  align-items: flex-start; /* Выравнивание по левому краю */
  justify-content: flex-start;
  align-self: flex-start;
  z-index: 5;
}

.team-main-title,
.team-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px;
  line-height: 1.15; /* Синхронизировано: 1.15 как в Genesis */
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}
```

### 3.3. Синхронизация Секции 3.5 (Doctrine «Доктрина») в `src/styles/doctrine.css`

В [src/styles/doctrine.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/doctrine.css) устраняется вертикальное центрирование всей секции (`align-items: center; justify-content: center;`), из-за которого заголовок на высоких мониторах проваливался в середину:

##### Было:
```css
.doctrine-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 2;
}

.doctrine-section .container,
.doctrine-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.doctrine-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: clamp(24px, 3.5vw, 44px);
  min-height: 60px;
  width: 100%;
}
```

##### Стало:
```css
/* TASK-078: Единая посадка секции от верхнего горизонта */
.doctrine-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: calc(var(--header-height) + 36px); /* Ровно 100px как в Genesis и Team */
  padding-bottom: 24px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 2;
}

.doctrine-section .container,
.doctrine-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  position: relative;
  z-index: 2;
}

.doctrine-header-subblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 28px; /* Синхронизировано: 28px как в Genesis и Team */
  min-height: 60px;    /* Синхронизировано: 60px как в Genesis и Team */
  width: 100%;
}

.doctrine-main-title,
.doctrine-header-subblock .section-main-title {
  font-family: 'Bounded', sans-serif;
  font-weight: 700;
  font-size: 45px;
  line-height: 1.15; /* Синхронизировано: 1.15 как в Genesis и Team */
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.12);
}
```

---

## 4. Пункт 3: Смещение Портретов Персонажей Zone 1 на 10% Вправо на 2K+ Мониторах

### 4.1. Архитектурное решение
В Секции 3.4 слой `.team-zone-1` содержит обертку `.team-portrait-wrapper` и абсолютные PNG-изображения `.player-portrait-img`.  
На экранах с шириной от $1921\text{px}$ (2K, QHD, Ultrawide, 4K) обертка `.team-portrait-wrapper` плавно смещается вправо на `10%` ширины колонки:
- Сохраняется 100% совместимость с инвертированным параллаксом из TASK-076 (`translate3d(X, Y, 0)` применяется к изображениям внутри обертки).
- Не происходит наложения на текст в центре (Zone 4) — наоборот, увеличивается «воздух» и улучшается читаемость характеристик.

### 4.2. Спецификация в `src/styles/team.css`

В файле [src/styles/team.css](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/styles/team.css):

```css
/* TASK-078: Смещение портрета Zone 1 на 10% вправо на 2K+ мониторах */
@media (min-width: 1921px) {
  .team-portrait-wrapper {
    transform: translateX(10%);
  }
}
```

---

## 5. Сводная Таблица Изменений

| Компонент | Full HD (1920px) | 2K+ Мониторы ($\ge 1921\text{px}$) | Результат |
|---|---|---|---|
| `.global-bg-logo` | `right: 60px` | `right: calc(60px + (100vw - 1920px) / 2)` | Сохраняет фиксированную посадку относительно Hero Split Grid |
| `.team-header-subblock` | `min-height: 60px`, `mb: 28px`, `lh: 1.15` | `min-height: 60px`, `mb: 28px`, `lh: 1.15` | Полный паритет с подблоком «О нас» |
| `.doctrine-header-subblock` | `min-height: 60px`, `mb: 28px`, `lh: 1.15` | `min-height: 60px`, `mb: 28px`, `lh: 1.15` | Полный паритет с подблоком «О нас» |
| Верхний отступ секций | $100\text{px}$ от верха вьюпорта | $100\text{px}$ от верха вьюпорта | Заголовки всех 3-х секций сидят на одной линии |
| `.team-portrait-wrapper` | `transform: none` | `transform: translateX(10%)` | Портрет сдвинут на 10% правее в свободное поле |

---

## 6. План Верификации и Тестирования

1. **Проверка Hero на 2K+ мониторах (2560×1440 и эмуляторе DevTools):**
   - [x] При увеличении ширины окна свыше 1920px фоновый логотип NUANCE не уезжает к дальнему правому краю монитора, а держится строго справа от текстового монолита Hero, как на Full HD.
2. **Проверка композиционного горизонта подблоков:**
   - [x] При прокрутке сайта от Секции 3.3 к 3.4 и далее к 3.5 заголовки «О нас», «КОМАНДА» и «Доктрина» появляются строго на одной высоте (горизонте) относительно верха экрана.
   - [x] Заголовки идеально выровнены по одной вертикальной направляющей левого края контейнера 1440px.
3. **Проверка портретов Zone 1:**
   - [x] На Full HD (1920px и меньше) портрет занимает стандартное положение.
   - [x] На 2K+ мониторах портрет сдвинут на 10% правее, не перекрывая текст Zone 4.
   - [x] Инвертированный параллакс мыши (TASK-076) и кроссфейд персонажей продолжают работать плавно и без артефактов.
