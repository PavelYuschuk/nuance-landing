# TASK-044: Мультиязычность EN/RU для 3.1 Header и 3.2 Hero-блока

**Status:** DONE  
**Target File(s):** `src/scripts/i18n.js`, `src/scripts/navigation.js`, `src/scripts/main.js`, `index.html`  
**Parent Specification:** TASK-036, TASK-037

---

## 1. Контекст и Цель Модификации
Реализация интерактивного переключения языка (**RU / EN**) по клику на кнопки в шапке сайта:
1. При нажатии на **`EN`**: переключается активное состояние кнопок переключателя (`.lang-btn`), и текст в **Header (3.1)** и **Hero-блоке (3.2)** мгновенно переводится на английский язык.
2. При нажатии на **`RU`**: возвращается исходный канонический русский текст.
3. Остальные секции лендинга остаются нетронутыми в соответствии с ТЗ.

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Словарь Локализации (RU ➔ EN Dictionary)

| Секция | Элемент | Русский (RU - Оригинал) | Английский (EN - Перевод) |
| :--- | :--- | :--- | :--- |
| **3.1 Header** | Ссылка `#genesis` | `О Нас` | `ABOUT` |
| **3.1 Header** | Ссылка `#team` | `Команда` | `TEAM` |
| **3.1 Header** | Ссылка `#doctrine` | `Доктрина` | `DOCTRINE` |
| **3.1 Header** | Ссылка `#cta` | `Контакты` | `CONTACTS` |
| **3.2 Hero** | Строка 1 (Word 1) | `НЕПРЕДВИДЕННЫЙ` | `UNFORESEEN` |
| **3.2 Hero** | Строка 2 (Word 2) | `ФАКТОР` | `FACTOR` |
| **3.2 Hero** | Строка 3 (Subtitle) | `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.` | `THREE MINDSETS. ONE PERFECT SYMBIOSIS.` |
| **3.2 Hero** | ARIA / SR-Only H1 | `НЕПРЕДВИДЕННЫЙ ФАКТОР — Три майндсета. Один идеальный симбиоз.` | `UNFORESEEN FACTOR — Three mindsets. One perfect symbiosis.` |

---

### 2.2. Исполняемый Модуль Локализации (`src/scripts/i18n.js`)

Создается легковесный модуль управления переводами:

```javascript
// src/scripts/i18n.js

const TRANSLATIONS = {
  ru: {
    navAbout: 'О Нас',
    navTeam: 'Команда',
    navDoctrine: 'Доктрина',
    navContacts: 'Контакты',
    heroLine1: 'НЕПРЕДВИДЕННЫЙ',
    heroLine2: 'ФАКТОР',
    heroSubtitle: 'ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.',
    heroSr: 'НЕПРЕДВИДЕННЫЙ ФАКТОР — Три майндсета. Один идеальный симбиоз.'
  },
  en: {
    navAbout: 'ABOUT',
    navTeam: 'TEAM',
    navDoctrine: 'DOCTRINE',
    navContacts: 'CONTACTS',
    heroLine1: 'UNFORESEEN',
    heroLine2: 'FACTOR',
    heroSubtitle: 'THREE MINDSETS. ONE PERFECT SYMBIOSIS.',
    heroSr: 'UNFORESEEN FACTOR — Three mindsets. One perfect symbiosis.'
  }
};

export function applyLanguage(lang) {
  const currentLang = lang === 'en' ? 'en' : 'ru';
  const t = TRANSLATIONS[currentLang];
  document.documentElement.lang = currentLang;

  // 1. Перевод Header (3.1)
  const linkAbout = document.querySelector('.header-nav a[href*="genesis"]');
  const linkTeam = document.querySelector('.header-nav a[href*="team"]');
  const linkDoctrine = document.querySelector('.header-nav a[href*="doctrine"]');
  const linkContacts = document.querySelector('.header-nav a[href*="cta"]');

  if (linkAbout) linkAbout.textContent = t.navAbout;
  if (linkTeam) linkTeam.textContent = t.navTeam;
  if (linkDoctrine) linkDoctrine.textContent = t.navDoctrine;
  if (linkContacts) linkContacts.textContent = t.navContacts;

  // 2. Перевод Hero-блока (3.2)
  // Для SVG-рендеринга:
  const svgLine1 = document.querySelector('.hero-monolith-svg text:nth-of-type(1)');
  const svgLine2 = document.querySelector('.hero-monolith-svg text:nth-of-type(2)');
  const svgLine3 = document.querySelector('.hero-monolith-svg text:nth-of-type(3)');

  if (svgLine1) svgLine1.textContent = t.heroLine1;
  if (svgLine2) svgLine2.textContent = t.heroLine2;
  if (svgLine3) svgLine3.textContent = t.heroSubtitle;

  // Для чистого HTML/CSS текста (если используется):
  const htmlLine1 = document.querySelector('.hero-line-word-1');
  const htmlLine2 = document.querySelector('.hero-line-word-2');
  const htmlSubtitle = document.querySelector('.hero-line-subtitle');
  const heroSr = document.querySelector('.hero-monolith-wrapper .sr-only');

  if (htmlLine1) htmlLine1.textContent = t.heroLine1;
  if (htmlLine2) htmlLine2.textContent = t.heroLine2;
  if (htmlSubtitle) htmlSubtitle.textContent = t.heroSubtitle;
  if (heroSr) heroSr.textContent = t.heroSr;

  // Сохранение выбора в localStorage
  localStorage.setItem('nuance_lang', currentLang);
}

export function initI18n() {
  const savedLang = localStorage.getItem('nuance_lang') || 'ru';
  const langBtns = document.querySelectorAll('.lang-btn');

  // Установка активной кнопки при старте
  langBtns.forEach(btn => {
    if (btn.getAttribute('data-lang') === savedLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyLanguage(savedLang);

  // Подписка на событие смены языка из navigation.js
  window.addEventListener('languageChange', (e) => {
    if (e.detail && e.detail.lang) {
      applyLanguage(e.detail.lang);
    }
  });
}
```

---

### 2.3. Инициализация в `src/scripts/main.js`

```javascript
import { initI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initI18n(); // Инициализация мультиязычности
  ...
});
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [x] Статус ТЗ обновлен на `Status: DONE`.
- [x] При клике на `EN` активный класс переходит на кнопку EN.
- [x] В Header пункты меняются на `ABOUT`, `TEAM`, `DOCTRINE`, `CONTACTS`.
- [x] В Hero текст переводится на:
  - Строка 1: `UNFORESEEN`
  - Строка 2: `FACTOR`
  - Строка 3: `THREE MINDSETS. ONE PERFECT SYMBIOSIS.`
- [x] При клике на `RU` весь текст мгновенно и без перезагрузки возвращается к оригинальному русскому.
- [x] Выбранный язык сохраняется в `localStorage`.
