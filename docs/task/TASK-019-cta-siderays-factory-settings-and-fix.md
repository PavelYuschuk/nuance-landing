# TASK-019: Установка Заводских Настроек SideRays и Исправление Отображения в "3.6. Call to Action"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/socials.css`, `src/scripts/side-rays.js`, `src/scripts/main.js`  
**Parent Specification:** TASK-018 (`docs/task/TASK-018-cta-instagram-and-siderays-fix.md`)

---

## 1. Контекст и Цель Модификации
1. Установка **заводских (дефолтных) настроек** WebGL-компонента **SideRays** с ярким золото-голубым свечением (`rayColor1: #EAB308`, `rayColor2: #96c8ff`, `speed: 2.5`).
2. Пошаговый алгоритм гарантии визуала: устранение причин, по которым эффект не отрисовывался на странице (фиксация высоты `height: 600px` / `100%`, принудительный вывод Canvas из-за перекрывающих блоков).

Все остальные 4 карточки соцсетей (Telegram, YouTube, TikTok, Instagram) и их логотипы сохраняются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Заводские Конфигурационные Параметры SideRays

| Параметр | Значение | Описание |
| :--- | :--- | :--- |
| **`speed`** | **`2.5`** | Высокая динамика плавания лучей |
| **`rayColor1`** | **`#EAB308`** | Золотой солнечный оттенок ядра (Yellow/Gold) |
| **`rayColor2`** | **`#96C8FF`** | Небесно-голубой внешний спектр (Sky Blue) |
| **`intensity`** | **`2.0`** | Интенсивность лучевого пучка |
| **`spread`** | **`2.0`** | Угол распространения лучей |
| **`origin`** | **`"top-right"`** | Источник испускания (правый верхний угол) |
| **`tilt`** | **`0`** | Прямой угол наклона (0°) |
| **`saturation`**| **`1.5`** | Насыщенность тонов |
| **`blend`** | **`0.75`** | Смешивание режимов наложения |
| **`falloff`** | **`1.6`** | Градиентный срез затухания |
| **`opacity`** | **`1.0`** | 100% максимальная видимость свечения |

---

### 2.2. Исполнительный Код для Верстальщика (`src/scripts/side-rays.js`)

```javascript
export const SIDE_RAYS_FACTORY_CONFIG = {
  speed: 2.5,
  rayColor1: '#EAB308',
  rayColor2: '#96C8FF',
  intensity: 2.0,
  spread: 2.0,
  origin: 'top-right',
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 1.6,
  opacity: 1.0
};
```

---

### 2.3. Пошаговая Гарантия Отрисовки Canvas в DOM

Для 100% проявления эффекта на странице верстальщик должен проверить 3 критических условия:

1. **Габариты и Слойность (`src/styles/socials.css`):**
   ```css
   .cta-siderays-wrapper {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     min-height: 600px;
     pointer-events: none;
     z-index: 1; /* Обязательно под контентом z-index: 2 */
   }

   .cta-side-rays-canvas {
     display: block;
     width: 100%;
     height: 100%;
   }
   ```

2. **Явный ресайз холста при старте:**
   В `side-rays.js` вызывать `renderer.setSize(container.clientWidth, container.clientHeight)` **немедленно** после вставки тега `<canvas>` в DOM.

3. **Отсутствие затеняющих перекрытий:**
   Убедиться, что родительские блоки `#cta` и `.cta-section` не имеют `background` непрозрачного цвета, перекрывающего `z-index: 1`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен строго в `Status: To do`.
- [ ] Параметры SideRays обновлены на заводские (`speed: 2.5`, `rayColor1: #EAB308`, `rayColor2: #96C8FF`, `tilt: 0`, `blend: 0.75`).
- [ ] Контейнер `.cta-siderays-wrapper` имеет фиксированное позиционирование `position: absolute; inset: 0; z-index: 1`.
- [ ] WebGL Canvas масштабируется и отображает золото-голубые лучи света из правого верхнего угла.
