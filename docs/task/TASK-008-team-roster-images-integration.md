# TASK-008: Интеграция Графических Иллюстраций в Ростер "3.4. Команда"

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`  
**Parent Specification:** TASK-007 (`docs/task/TASK-007-team-center-panel-refactor.md`)

---

## 1. Контекст и Цель Модификации
Замена заглушечного серого фона (`#1A2230`) в карточках левой навигационной панели персонажей (Zone 1: Roster Navigation) на готовые иллюстрации из директории `public/assets/images/`.Все остальные параметры ростера (размер 160px, отсутствие отступов `gap: 0`, левый нижний никнейм и т.д.) сохраняются **без изменений**.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Маппинг Файлов Изображений по Персонажам

| Индекс | Персонаж | Относительный путь к файлу изображения |
| :--- | :--- | :--- |
| **Слой 0** | **Presa4ek** | `/assets/images/Presa4ek SCALE Vertical Roster Navigation.png` |
| **Слой 1** | **Art1zi** | `/assets/images/Art1zi SCALE Vertical Roster Navigation.png` |
| **Слой 2** | **Matvi4** | `/assets/images/Matvi4 Vertical Roster Navigation.png` |

---

### 2.2. Спецификация Отображения и Стилизации (`src/styles/team.css`)

- **Фоновый слой карточки ростера (`.roster-card-bg` / CSS `background-image`):**
  - `width: 100%; height: 100%; position: absolute; inset: 0; z-index: 1`.
  - `background-size: cover; background-position: center top; background-repeat: no-repeat`.
  - `object-fit: cover` (при использовании тега `<img>`).
- **Грарадиентная затемняющая маска (Dark Overlay for Contrast):**
  - Под именем игрока поверх изображения накладывается затемнение для 100% читаемости ника:  
    `background: linear-gradient(to top, rgba(15, 15, 15, 0.85) 0%, rgba(15, 15, 15, 0.25) 60%, transparent 100%)`.
- **Переключение состояний активности:**
  - **Неактивная карточка (`.roster-card`):**  
    `filter: grayscale(100%) brightness(0.6); opacity: 0.55; transition: filter 0.4s ease, opacity 0.4s ease, brightness 0.4s ease`.
  - **Активная карточка (`.roster-card.active` / `:hover`):**  
    `filter: grayscale(0%) brightness(1); opacity: 1`.

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен строго в `Status: To do`.
- [ ] Заглушечный серый фон `#1A2230` заменен на соответствующие графические файлы из `public/assets/images/`.
- [ ] Presa4ek получил файл `Presa4ek SCALE Vertical Roster Navigation.png`.
- [ ] Art1zi получил файл `Art1zi SCALE Vertical Roster Navigation.png`.
- [ ] Matvi4 получил файл `Matvi4 Vertical Roster Navigation.png`.
- [ ] При переключении персонажей неактивные арты уходят в обесцвеченный серый градиент (`grayscale 100%`), а активный приобретает полноцветный яркий вид (`grayscale 0%`).
