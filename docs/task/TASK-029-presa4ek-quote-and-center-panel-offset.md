# TASK-029: Замена Цитаты Presa4ek и Смещение Вниз Текста в "Zone 4: Center Info Panel"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-027, TASK-028

---

## 1. Контекст и Цель Модификации
1. **Обновление цитаты Presa4ek:** Замена текста радиоперехвата в первой карточке бойца на новую формулировку.
2. **Смещение текстового блока Zone 4 вниз:** Опускание всей информационной панели ниже относительно шапки сайта для улучшения визуального баланса и комфортной посадки в окне просмотра.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Замена Цитаты Presa4ek (`index.html`)

В блоке **Player 0 Info: Presa4ek**:

- **Было:**  
  `<blockquote class="player-quote">«Я просчитал четырнадцать миллионов исходов этого боя. И знаете, сколько победных? Только один.»</blockquote>`
- **Стало:**  
  `<blockquote class="player-quote">«Я просчитал все варианты исходы этого боя. Победный только один.»</blockquote>`

---

### 2.2. Смещение Текстового Блока Вниз (`src/styles/team.css`)

Для смещения всего контента Zone 4 (Имя, Роль, Цитата, Описание, Статы) ниже:

```css
/* Zone 4: Center Info Panel */
.team-zone-4,
.team-info-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* Увеличение верхнего отступа для смещения контента вниз */
  padding-top: clamp(80px, 12vh, 120px);
  padding-bottom: 24px;
  position: relative;
  z-index: 5;
}

/* Адаптивные значения смещения */
@media (max-width: 1024px) {
  .team-zone-4,
  .team-info-panel {
    padding-top: calc(var(--header-height) + 32px);
  }
}

@media (max-width: 768px) {
  .team-zone-4,
  .team-info-panel {
    padding-top: 24px;
  }
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ установлен в `Status: DONE`.
- [x] Цитата Presa4ek в `index.html` обновлена на `«Я просчитал все варианты исходы этого боя. Победный только один.»`.
- [x] Текстовый блок Zone 4 плавно смещен вниз (`padding-top: clamp(80px, 12vh, 120px)`).
- [x] Контент располагается ниже шапки с достаточным «воздухом» и не перекрывает элементы интерфейса.
