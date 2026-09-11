# TASK-013: Интеграция Прозрачных PNG-Портретов в Zone 1 "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-010 (`docs/task/TASK-010-team-zone-renaming-and-vfx-layer.md`)

---

## 1. Контекст и Цель Модификации
Интеграция полноразмерных графических иллюстраций персонажей без фона (PNG с прозрачным альфа-каналом) в **Zone 1 (`.team-zone-1`, z-index: 2)** секции "3.4. Команда".Иллюстрации заменяют текстовые плейсхолдеры и размещаются под WebGL-лучами SideRays (Zone 2) и над динамическим фоном (Zone 0).

Все остальные слои и параметры ростера сохраняются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Маппинг Файлов Изображений по Персонажам

| Слой игрока | Персонаж | Относительный путь к файлу в `public/assets/images/` |
| :--- | :--- | :--- |
| **Слой 0** | **Presa4ek** | `/assets/images/PORTRAIT PNG Presa4ek.png` |
| **Слой 1** | **Art1zi** | `/assets/images/PORTRAIT PNG Art1zi.png` |
| **Слой 2** | **Matvi4** | `/assets/images/PORTRAIT PNG Matvi4.png` |

---

### 2.2. HTML-Разметка и Иерархия (`index.html`)

Внутри `.team-zone-1` монтируется контейнер `.team-portrait-wrapper` с 3 иллюстрациями:

```html
<!-- Zone 1: Character Portrait PNG Layer (z-index: 2) -->
<div class="team-zone-1 col-5">
  <div class="team-portrait-wrapper">
    <img src="/assets/images/PORTRAIT PNG Presa4ek.png" alt="Presa4ek Portrait" class="player-portrait-img layer-0 active" data-portrait-id="0" />
    <img src="/assets/images/PORTRAIT PNG Art1zi.png" alt="Art1zi Portrait" class="player-portrait-img layer-1" data-portrait-id="1" />
    <img src="/assets/images/PORTRAIT PNG Matvi4.png" alt="Matvi4 Portrait" class="player-portrait-img layer-2" data-portrait-id="2" />
  </div>
</div>
```

---

### 2.3. Спецификация Стыковки и Стилизации (`src/styles/team.css`)

- **Контейнер обертки (`.team-portrait-wrapper`):**
  - `position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center`.
- **Изображение портрета (`.player-portrait-img`):**
  - `position: absolute; bottom: 0; right: 0; max-height: 85vh; width: auto; max-width: 100%; object-fit: contain; pointer-events: none; z-index: 2`.
  - **Анимация переключения слоев:**
    - Неактивное изображение: `opacity: 0; transform: scale(0.96) translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease`.
    - Активное изображение (`.player-portrait-img.active`): `opacity: 1; transform: scale(1) translateY(0)`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен строго в `Status: To do`.
- [ ] Заглушки в Zone 1 заменены на реальные теги `<img>` с прозрачными PNG-файлами.
- [ ] Presa4ek получил файл `/assets/images/PORTRAIT PNG Presa4ek.png`.
- [ ] Art1zi получил файл `/assets/images/PORTRAIT PNG Art1zi.png`.
- [ ] Matvi4 получил файл `/assets/images/PORTRAIT PNG Matvi4.png`.
- [ ] Изображения выровнены по нижнему краю (`bottom: 0`) с ограничением высоты `85vh`.
- [ ] Смена иллюстраций при скролле происходит с плавной анимацией проявления (`opacity` + `scale`).
