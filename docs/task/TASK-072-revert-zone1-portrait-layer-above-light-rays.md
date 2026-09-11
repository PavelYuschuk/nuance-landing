# TASK-072: Возврат Портрета (Zone 1) Слоем Выше Эффекта LightRays

**Status:** DONE  
**Target File(s):** `src/styles/team.css`  
**Parent Specification:** TASK-069, TASK-070, TASK-071  

---

## 1. Контекст и Постановка Задачи

Пользователь сформулировал следующее требование для секции **3.4 Team Character Selector**:

> *«1. `<!-- Zone 1: Character Portrait PNG Layer -->` — отправить слоем выше (вернуть исходное), чтобы эффект из TASK-070 был слоем ниже.»*

### 1.1. Визуально-композиционная цель
В задаче TASK-071 портрет оперативника был опущен под WebGL-лучи (`z-index: 2` vs `z-index: 3`).  
По результатам визуального тестирования пользователь принял решение вернуть исходную многослойную глубину:
- Фигура оперативника (`Zone 1`) должна находиться на переднем плане перед лучами (`слоем выше`).
- Световые лучи WebGL LightRays из TASK-070/TASK-071 должны располагаться за персонажем (`слоем ниже`), выполняя роль объемного контрового света (Cinematic Backlight / Rim Light), озаряющего фон и контуры бойца сзади.
- Градиентный шов (`.team-seam-gradient-top`) при этом сохраняет перекрытие основания лучей (`z-index: 3 > z-index: 2`).

---

## 2. Архитектура Матрицы Слоев (Z-Index Hierarchy)

Восстанавливается выверенная 5-уровневая иерархия слоев в `src/styles/team.css`:

```
┌─────────────────────────────────────────────────────────────┐
│ 5. Zone 3 (Ростер) + Zone 4 (Текст) + «КОМАНДА»[z-index: 5] │ (Верхний слой интерфейса)
├─────────────────────────────────────────────────────────────┤
│ 4. Zone 1: Character Portrait PNG               [z-index: 4] │ ◄── ВЕРНУТЬ ИСХОДНОЕ (НАД ЛУЧАМИ!)
├─────────────────────────────────────────────────────────────┤
│ 3. Градиентный шов (.team-seam-gradient-top)    [z-index: 3] │ (Перекрывает основание лучей вверху)
├─────────────────────────────────────────────────────────────┤
│ 2. WebGL LightRays (Zone 2)                     [z-index: 2] │ ◄── СЛОЕМ НИЖЕ (ЗА БОЙЦОМ!)
├─────────────────────────────────────────────────────────────┤
│ 1. Zone 0: Фото баз + 90% Оверлей              [z-index: 1] │ (Базовый фон)
└─────────────────────────────────────────────────────────────┘
```

### Преимущества такой конфигурации:
1. **Контровой свет:** Лучи струятся позади силуэта бойца, создавая реалистичное атмосферное свечение вокруг оружия, плеч и головы персонажа, не перекрывая фактуру его снаряжения.
2. **Защита шва:** Градиентный шов находится на уровне `z-index: 3`, надежно перекрывая основание лучей (`z-index: 2`) на стыке с Секцией 3.3.
3. **Чистота и контраст:** Все текстовые блоки и интерактивные карточки ростера находятся на верхнем уровне `z-index: 5`.

---

## 3. Техническая Спецификация Изменений в `src/styles/team.css`

### 3.1. Изменение Z-Index холста LightRays (`.team-zone-2`)
В `src/styles/team.css` (строки 130–139):

#### БЫЛО:
```css
.team-zone-2,
.light-rays-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; /* Было слоем выше портрета */
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
}
```

#### СТАЛО:
```css
.team-zone-2,
.light-rays-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2; /* TASK-072: СЛОЕМ НИЖЕ ПОРТРЕТА ZONE 1 (контровой свет за бойцом) */
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 35px, black 150px);
}
```

---

### 3.2. Обновление уровня градиентного шва (`.team-seam-gradient-top`)
В `src/styles/team.css` (строки 140–160):

#### БЫЛО:
```css
.team-seam-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(145px, 18vh, 235px);
  ...
  pointer-events: none;
  z-index: 4;
  transform: translateZ(10px);
}
```

#### СТАЛО:
```css
.team-seam-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(145px, 18vh, 235px);
  background: linear-gradient(
    to bottom,
    #0F0F0F 0%,
    rgba(15, 15, 15, 0.98) 14%,
    rgba(15, 15, 15, 0.90) 28%,
    rgba(15, 15, 15, 0.72) 46%,
    rgba(15, 15, 15, 0.46) 64%,
    rgba(15, 15, 15, 0.22) 80%,
    rgba(15, 15, 15, 0.06) 92%,
    rgba(15, 15, 15, 0) 100%
  );
  pointer-events: none;
  z-index: 3; /* TASK-072: Строго выше лучей (z:2), но ниже контента и портрета (z:4) */
  transform: translateZ(10px);
}
```

---

### 3.3. Возврат Zone 1 и контейнера на исходный уровень (Слоем Выше Лучей)
В `src/styles/team.css` (строки 176–181 и 270–286):

#### 1. Слой портрета `.team-zone-1`:
```css
/* Zone 1: Character Portrait PNG Layer (TASK-072: СЛОЕМ ВЫШЕ ЛУЧЕЙ) */
.team-zone-1 {
  position: relative;
  z-index: 4; /* Строго поверх лучей LightRays (z-index: 2) */
  height: 100%;
  width: 100%;
  min-width: 520px;
  overflow: visible;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  background: transparent;
  border: none;
  box-shadow: none;
  margin-top: -76px;
}
```

#### 2. Возврат исходного `z-index: 4` для `.team-container`:
```css
.team-container,
.team-screen-container {
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
  z-index: 4; /* TASK-072: Исходное значение - контейнер на уровне 4 поверх лучей (z:2) */
}

/* Zone 3 и Zone 4 остаются на верхнем слое: */
.team-header-subblock,
.team-zone-3,
.team-zone-4 {
  z-index: 5 !important; /* Поверх всего для 100% четкости и кликабельности */
}
```

---

## 4. План Верификации и Тестирования

1. **Проверка послойной глубины (Zone 1 над лучами):**
   - [x] Силуэт бойца в `Zone 1` находится на переднем плане перед световыми лучами LightRays (`.team-zone-1` на `z-index: 4`). Выполнено.
   - [x] Световые лучи струятся позади оперативника, мягко подсвечивая его контуры сзади и озаряя фон (`.team-zone-2` на `z-index: 2`). Выполнено.
   - [x] На текстуре бойца отсутствуют наложенные сверху полупрозрачные лучи. Выполнено.
2. **Проверка сохранения перекрытия шва:**
   - [x] Градиентный шов (`.team-seam-gradient-top` на `z-index: 3`) надежно перекрывает основание лучей (`z-index: 2`) у верхнего края Секции 3.4. Выполнено.
   - [x] Переход между Секцией 3.3 и 3.4 остается полностью бесшовным и темным по тону `#0F0F0F`. Выполнено.
