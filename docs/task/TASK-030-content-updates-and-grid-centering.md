# TASK-030: Текстовые Правки (Presa4ek, Art1zi) и Центрирование Секций по Сетке

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/team.css`, `src/styles/doctrine.css`, `src/styles/socials.css`  
**Parent Specification:** TASK-023, TASK-027, TASK-029

---

## 1. Контекст и Цель Модификации
1. **Обновление нюанса Presa4ek (Player 0):** Замена текста нюанса на новую формулировку про коллауты и подрыв сквада.
2. **Чистка описания Art1zi (Player 1):** Удаление слова *«глухом»*.
3. **Глобальное выравнивание по центру сетки:** Приведение архитектуры секций **3.4 (Команда)**, **3.5 (Доктрина)** и **3.6 (Call to Action)** к единому центрированному стандарту сетки по аналогии с Hero-блоком и блоком слоев Генезиса (`.container { margin: 0 auto; }` + вертикальное центрирование).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Текстовые Правки в `index.html`

#### **1. Player 0 Info: Presa4ek**
В блоке нюанса (`.player-nuance-block` или `<p class="team-player-desc">`):
- **Стало:**
  `<p class="team-player-desc"><strong class="text-highlight">Нюанс:</strong> Регулярно ломает тиммейтам мозг, путая «право» и «лево» в боевых коллаутах. А его броски гранат заслуживают отдельной премии: он скорее подорвет весь свой сквад, чем докинет до врага. Не матерится — интеллигентный и вежливый.</p>`

#### **2. Player 1 Info: Art1zi**
В описании боевых качеств:
- **Было:**
  `...Способен в соло закрыть клатч 1 в 3 на глухом лоу ХП.`
- **Стало (слово «глухом» удалено):**
  `...Способен в соло закрыть клатч 1 в 3 на лоу ХП.`

---

### 2.2. Центрирование Секций 3.4, 3.5, 3.6 по Сетке (Grid Centering)

По аналогии с Hero (`.hero-content`) и Генезисом (`.about-container`):

#### **1. Секция 3.4 «Команда» (`src/styles/team.css`):**
- Внутри `.team-sticky-viewport` контент оборачивается в `.container.team-screen-container`.
- Контейнер центрируется по горизонтали и вертикали:
```css
.team-sticky-viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.team-screen-container {
  width: 100%;
  max-width: var(--container-max-width); /* 1440px */
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
```

#### **2. Секция 3.5 «Доктрина» (`src/styles/doctrine.css`):**
- Секция и сетка карточек центрируются строго по центру вьюпорта и сетки:
```css
.doctrine-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.doctrine-section .container {
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

#### **3. Секция 3.6 «Call to Action» (`src/styles/socials.css`):**
- Контентный блок и сетка соцсетей центрируются относительно оси экрана и контейнера 1440px:
```css
#cta.cta-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#cta .container {
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ установлен в `Status: DONE`.
- [x] Текст нюанса Presa4ek обновлен на формулировку про «право/лево» и подрыв сквада.
- [x] Из описания Art1zi удалено слово «глухом».
- [x] Секции 3.4 (Команда), 3.5 (Доктрина) и 3.6 (Call to Action) идеально центрированы по горизонтали и вертикали внутри глобального контейнера 1440px.
- [x] Визуальная сетка всех секций сайта имеет единые боковые направляющие (единая вертикальная линия сетки для Hero, Genesis, Team, Doctrine, CTA).
