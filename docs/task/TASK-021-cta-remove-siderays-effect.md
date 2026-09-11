# TASK-021: Удаление Эффекта SideRays из "3.6. Call to Action"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/socials.css`, `src/scripts/main.js`, `src/scripts/side-rays.js`  
**Parent Specification:** TASK-018 (`docs/task/TASK-018-cta-instagram-and-siderays-fix.md`)

---

## 1. Контекст и Цель Модификации
Полное удаление WebGL-эффекта лучей SideRays из секции "3.6. Call to Action".Секция избавляется от WebGL-холста, сохраняя минималистичный чистый визуал поверх единого глобального фона проекта (`.global-bg`).

Все 4 карточки соцсетей (**Telegram, YouTube, TikTok, Instagram**), их бренд-логотипы и индикатор связи сохраняются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Изменения в Разметке и Скриптах
1. **DOM Разметка (`index.html`):**
   - Полностью удалить фоновый контейнер `.cta-siderays-wrapper` с тегом `<canvas>`.
2. **Исполняемые скрипты (`src/scripts/main.js` / `src/scripts/side-rays.js`):**
   - Отключить импорт и вызов `initSideRays()`.
   - Полностью освободить память и ресурсы GPU.

---

### 2.2. Архитектура и Стилизация (`src/styles/socials.css`)

```css
#cta.cta-section {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: transparent; /* Наследует .global-bg */
}

/* Удален .cta-siderays-wrapper */
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ равен `Status: To do`.
- [ ] Контейнер `.cta-siderays-wrapper` удален из разметки `#cta`.
- [ ] Вызов `initSideRays()` отключен в `main.js`.
- [ ] Секция `#cta` чистая, без WebGL-холста, поверх единого фона `.global-bg`.
- [ ] Все 4 карточки (Telegram, YouTube, TikTok, Instagram) функционируют без ошибок.
