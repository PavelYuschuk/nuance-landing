# TASK-015: Удаление WebGL-Эффекта из Zone 2 "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/scripts/side-rays.js`, `src/scripts/team-scroll.js`  
**Parent Specification:** TASK-010 (`docs/task/TASK-010-team-zone-renaming-and-vfx-layer.md`)

---

## 1. Контекст и Цель Модификации
Полное удаление WebGL-эффекта лучей света SideRays из спецэффектного слоя **Zone 2 (`.team-zone-2`)** в секции "3.4. Команда".Слой Zone 2 сохраняется в DOM как чистый зарезервированный слой-контейнер (`z-index: 3`) без активных шейдеров и нагрузки на GPU.

Все остальные слои (Zone 0, Zone 1, Zone 3, Zone 4) остаются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Изменения в Разметке и Скриптах
1. **DOM Разметка (`index.html`):**
   - Из блока `.team-zone-2` полностью удаляется холст `<canvas class="side-rays-canvas">`.
   - Контейнер остается пустым: `<div class="team-zone-2"></div>`.
2. **Исполняемые скрипты (`src/scripts/side-rays.js`, `src/scripts/team-scroll.js`):**
   - Отключить инициализацию модуля `initSideRays()`.
   - Отключить отрисовщик `ogl` и вызовы `requestAnimationFrame` для слоя Zone 2.

---

### 2.2. Спецификация Слойной Иерархии (`src/styles/team.css`)

```css
/* Zone 2: Empty VFX Overlay Layer (Clean Reserved State) */
.team-zone-2 {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
  background: transparent;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] WebGL Canvas удален из `.team-zone-2`.
- [ ] Вызовы инициализации SideRays в JS удалены/закомментированы.
- [ ] Слой Zone 2 пуст и не создает нагрузки на GPU.
- [ ] Порядок слоев (Zone 0 ➜ Zone 1 ➜ Zone 2 ➜ Zone 3 ➜ Zone 4) сохранен.
