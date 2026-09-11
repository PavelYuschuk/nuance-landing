# TASK-065: Кастомный Dropdown-Переключатель Языков (Українська, English, Русский)

**Status:** DONE  
**Target File(s):** `index.html`, `src/styles/header.css`, `src/scripts/i18n.js`, `src/scripts/navigation.js`  
**Parent Specification:** TASK-044, TASK-061, TASK-062  
**Reference Asset:** Пользовательский референс дропдауна языков (`media_1789075049594.png`)

---

## 1. Контекст и Постановка Задачи

Пользователь предоставил скриншот референса интерфейса выбора языка (`media_1789075049594.png`) и сформулировал следующие требования:

> *«Изучи прикрепленное изображение смены языка. Надо повторить с адаптацией для нашего сайта.*  
> *1. Точно такая же кнопка, но с прозрачным фоном, в которой пишется выбранный язык.*  
> *2. В выпадающем списке 3 языка: Українська, English, Русский.»*

### Ключевые требования:
1. **Кнопка-триггер (В шапке сайта):**
   - **Прозрачный фон:** `background: transparent` (без серых или темных глухих подложек).
   - **Тонкая эстетичная рамка:** полупрозрачный бордер, гармонирующий с темной неоновой палитрой NUANCE (`border: 1px solid rgba(255, 255, 255, 0.18)`).
   - **Слева:** Векторная иконка глобуса 🌐 (`16×16px`).
   - **По центру:** Полное наименование текущего активного языка (например: `Українська`, `English` или `Русский`).
   - **Справа:** Компактная векторная иконка стрелки/шеврона вниз `⌄` (`14×14px`), плавно поворачивающаяся на 180° при открытии меню.
   - **Ховер-эффект:** мягкое осветление рамки, микросвечение и подсветка текста.

2. **Выпадающее меню (Dropdown List):**
   - 3 поддерживаемых языка:
     1. `Українська` (`uk`)
     2. `English` (`en`)
     3. `Русский` (`ru`)
   - **Стилизация:** премиальный Dark Glassmorphism в стиле NUANCE Tactical (`background: rgba(14, 20, 30, 0.94); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7)`).
   - **Радио-индикаторы (Radio Indicator):**
     - Слева от названия каждого языка расположен кастомный круглый радио-индикатор (`16×16px`).
     - Неактивный: деликатная окружность с рамкой `rgba(255, 255, 255, 0.3)`.
     - Активный (выбранный): яркая циановая окантовка (`#00F0FF`) со светящейся внутренней точкой (`#00F0FF`) и неоновым свечением.

3. **Интерактивность и UX:**
   - Клик по кнопке открывает/закрывает дропдаун.
   - Клик по пункту меню переключает язык на всем сайте, обновляет метку на кнопке, закрывает меню и сохраняет выбор в `localStorage` (`nuance_lang`).
   - Закрытие по клику вне меню (Outside Click).
   - Закрытие по нажатию клавиши `Escape`.
   - Полная поддержка WAI-ARIA (`aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"`, `role="option"`, `aria-selected`).

---

## 2. Анализ Референса (`media_1789075049594.png`) и Адаптация под Бренд NUANCE

| Элемент | В Референсе | Адаптация под NUANCE Landing |
| :--- | :--- | :--- |
| **Фон кнопки** | Светлый / монохромный | **Строго прозрачный** (`background: transparent`), обеспечивающий чистое просвечивание фонового градиента шапки |
| **Рамка кнопки** | Скругленный прямоугольник | Тонкая рамка `border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 8px` |
| **Иконка слева** | Глобус (контурная сетка) | Векторный SVG глобус с меридианами, цвет `#FFFFFF` (или `currentColor`) |
| **Текст кнопки** | Название выбранного языка | `Українська` / `English` / `Русский` шрифтом `'Bounded', sans-serif` или `'Inter', sans-serif` |
| **Иконка справа** | Шеврон вниз | Векторный шеврон с плавной CSS-анимацией поворота `transform: rotate(180deg)` |
| **Выпадающий список** | 3 языка в столбик | Список с отступами `padding: 6px`, позиционированный `top: calc(100% + 8px); right: 0;` |
| **Радио-кнопка** | Круг с точкой внутри | Кастомный радио-баттон с акцентным цветом бренда `#00F0FF` (Cyan) и мягким блюром свечения |
| **Поведение** | Выбор кликом | Бесшовное переключение словарей в `i18n.js` без перезагрузки страницы |

---

## 3. Спецификация Разметки (`index.html`)

### 3.1. Замена Блока `.lang-switcher` в Header (строки 33–38)

#### БЫЛО:
```html
<div class="header-controls">
  <div class="lang-switcher">
    <button class="lang-btn active" data-lang="ru">RU</button>
    <span class="lang-divider">|</span>
    <button class="lang-btn" data-lang="en">EN</button>
  </div>
  
  <button class="mobile-toggle" aria-label="Открыть меню">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>
```

#### СТАЛО:
```html
<div class="header-controls">
  <!-- TASK-065: Кастомный выпадающий переключатель языков по референсу -->
  <div class="lang-switcher" id="langSwitcher">
    <!-- Кнопка-триггер с прозрачным фоном, иконкой глобуса и шевроном -->
    <button type="button" 
            class="lang-trigger" 
            id="langTrigger" 
            aria-haspopup="listbox" 
            aria-expanded="false" 
            aria-label="Выбрать язык сайта">
      <!-- Векторная иконка глобуса -->
      <svg class="lang-globe-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      
      <!-- Текст текущего выбранного языка -->
      <span class="lang-current-label" id="langCurrentLabel">Русский</span>
      
      <!-- Векторная иконка шеврона (стрелка вниз) -->
      <svg class="lang-chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <!-- Выпадающее меню с 3 языками и радио-индикаторами -->
    <div class="lang-dropdown" id="langDropdown" role="listbox" aria-labelledby="langTrigger">
      <!-- 1. Українська -->
      <button type="button" class="lang-dropdown-item" role="option" data-lang="uk" aria-selected="false">
        <span class="lang-radio" aria-hidden="true"></span>
        <span class="lang-text">Українська</span>
      </button>

      <!-- 2. English -->
      <button type="button" class="lang-dropdown-item" role="option" data-lang="en" aria-selected="false">
        <span class="lang-radio" aria-hidden="true"></span>
        <span class="lang-text">English</span>
      </button>

      <!-- 3. Русский -->
      <button type="button" class="lang-dropdown-item active" role="option" data-lang="ru" aria-selected="true">
        <span class="lang-radio" aria-hidden="true"></span>
        <span class="lang-text">Русский</span>
      </button>
    </div>
  </div>
  
  <button class="mobile-toggle" aria-label="Открыть меню">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>
```

---

## 4. Спецификация Стилизации (`src/styles/header.css`)

### 4.1. Обновление стилей переключателя языков (замена строк 123–160)

```css
/* =========================================================
   TASK-065: Custom Dropdown Language Switcher (UK / EN / RU)
   ========================================================= */

/* Контейнер-обертка дропдауна */
.lang-switcher {
  position: relative;
  display: inline-block;
  user-select: none;
}

/* Кнопка-триггер: полностью прозрачный фон, тонкий бордер */
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  color: #FFFFFF;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: border-color 0.25s cubic-bezier(0.25, 1, 0.5, 1),
              background 0.25s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
}

/* Ховер состояние триггера */
.lang-trigger:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.08);
}

/* Состояние при открытом дропдауне */
.lang-switcher.is-open .lang-trigger {
  border-color: rgba(0, 240, 255, 0.6);
  background: rgba(0, 240, 255, 0.06);
  box-shadow: 0 0 16px rgba(0, 240, 255, 0.15);
}

/* Иконка глобуса */
.lang-globe-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s ease;
}

.lang-trigger:hover .lang-globe-icon,
.lang-switcher.is-open .lang-globe-icon {
  color: #00F0FF;
}

/* Текстовая метка языка */
.lang-current-label {
  white-space: nowrap;
  font-family: 'Bounded', sans-serif;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: #FFFFFF;
}

/* Иконка шеврона с плавной анимацией вращения */
.lang-chevron-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease;
}

.lang-switcher.is-open .lang-chevron-icon {
  transform: rotate(180deg);
  color: #00F0FF;
}

/* Выпадающий список (Glassmorphic Dropdown) */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 165px;
  background: rgba(14, 20, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7),
              0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 1000;
  
  /* Анимация появления */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.22s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.22s cubic-bezier(0.25, 1, 0.5, 1),
              visibility 0.22s;
}

/* Видимое состояние меню при открытии */
.lang-switcher.is-open .lang-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* Элемент списка (кнопка языка) */
.lang-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  outline: none;
  transition: background 0.18s ease, color 0.18s ease;
}

.lang-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.lang-dropdown-item.active {
  background: rgba(0, 240, 255, 0.08);
}

/* Круглый радио-индикатор */
.lang-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Внутренняя точка активного радио-баттона */
.lang-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00F0FF;
  opacity: 0;
  transform: scale(0.4);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.8);
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ховер состояние элемента списка */
.lang-dropdown-item:hover .lang-radio {
  border-color: rgba(255, 255, 255, 0.7);
}

.lang-dropdown-item:hover .lang-text {
  color: #FFFFFF;
}

/* Активное состояние элемента списка */
.lang-dropdown-item.active .lang-radio {
  border-color: #00F0FF;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.35);
}

.lang-dropdown-item.active .lang-radio::after {
  opacity: 1;
  transform: scale(1);
}

/* Текст языка внутри дропдауна */
.lang-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  transition: color 0.18s ease;
}

.lang-dropdown-item.active .lang-text {
  color: #FFFFFF;
  font-weight: 600;
}
```

### 4.2. Адаптивность для экранов 2K (строки 298–302)

```css
@media (min-width: 2049px) {
  .lang-trigger {
    padding: 8px 16px;
    font-size: 0.95rem;
    gap: 10px;
  }

  .lang-globe-icon {
    width: 18px;
    height: 18px;
  }

  .lang-current-label {
    font-size: 0.92rem;
  }

  .lang-dropdown {
    min-width: 180px;
    padding: 8px;
    gap: 4px;
  }

  .lang-dropdown-item {
    padding: 10px 14px;
  }

  .lang-text {
    font-size: 0.95rem;
  }
}
```

---

## 5. Спецификация Модуля Мультиязычности (`src/scripts/i18n.js`)

Добавляется словарь украинского языка (`uk`), маппинг отображаемых названий языков для кнопки, а также логика обновления метки триггера и атрибутов доступности.

```javascript
/* ==========================================
   TASK-065: Multilingual Module (UK / EN / RU) for Header & Hero
   ========================================== */

const TRANSLATIONS = {
  uk: {
    navAbout: 'Про нас',
    navTeam: 'Команда',
    navDoctrine: 'Доктрина',
    navContacts: 'Контакти',
    heroLine1: 'НЕПЕРЕДБАЧУВАНИЙ',
    heroLine2: 'НЮАНС',
    heroSubtitle: 'ТРИ МАЙНДСЕТИ. ОДИН ІДЕАЛЬНИЙ СИМБІОЗ.',
    heroSr: 'НЕПЕРЕДБАЧУВАНИЙ НЮАНС — Три майндсети. Один ідеальний симбіоз.'
  },
  en: {
    navAbout: 'ABOUT',
    navTeam: 'TEAM',
    navDoctrine: 'DOCTRINE',
    navContacts: 'CONTACTS',
    heroLine1: 'UNFORESEEN',
    heroLine2: 'NUANCE',
    heroSubtitle: 'THREE MINDSETS. ONE PERFECT SYMBIOSIS.',
    heroSr: 'UNFORESEEN NUANCE — Three mindsets. One perfect symbiosis.'
  },
  ru: {
    navAbout: 'О Нас',
    navTeam: 'Команда',
    navDoctrine: 'Доктрина',
    navContacts: 'Контакты',
    heroLine1: 'НЕПРЕДВИДЕННЫЙ',
    heroLine2: 'НЮАНС',
    heroSubtitle: 'ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.',
    heroSr: 'НЕПРЕДВИДЕННЫЙ НЮАНС — Три майндсета. Один идеальный симбиоз.'
  }
};

// Соответствие кодов языков и их названий для кнопки-триггера
const LANG_DISPLAY_NAMES = {
  uk: 'Українська',
  en: 'English',
  ru: 'Русский'
};

export function applyLanguage(lang) {
  // Валидация поддерживаемого языка (дефолт: ru)
  const currentLang = ['uk', 'en', 'ru'].includes(lang) ? lang : 'ru';
  const t = TRANSLATIONS[currentLang];
  document.documentElement.lang = currentLang;

  // 1. Обновление текста на кнопке-триггере языка
  const langCurrentLabel = document.getElementById('langCurrentLabel');
  if (langCurrentLabel) {
    langCurrentLabel.textContent = LANG_DISPLAY_NAMES[currentLang];
  }

  // 2. Обновление активного состояния элементов выпадающего списка
  const dropdownItems = document.querySelectorAll('.lang-dropdown-item');
  dropdownItems.forEach(item => {
    const itemLang = item.getAttribute('data-lang');
    if (itemLang === currentLang) {
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    }
  });

  // 3. Перевод Header (3.1)
  const linkAbout = document.querySelector('.header-nav a[href*="genesis"]');
  const linkTeam = document.querySelector('.header-nav a[href*="team"]');
  const linkDoctrine = document.querySelector('.header-nav a[href*="doctrine"]');
  const linkContacts = document.querySelector('.header-nav a[href*="cta"]');

  if (linkAbout) linkAbout.textContent = t.navAbout;
  if (linkTeam) linkTeam.textContent = t.navTeam;
  if (linkDoctrine) linkDoctrine.textContent = t.navDoctrine;
  if (linkContacts) linkContacts.textContent = t.navContacts;

  // 4. Перевод Hero-блока (3.2) - SVG монолит
  const svgLine1 = document.querySelector('.hero-monolith-svg text:nth-of-type(1)');
  const svgLine2 = document.querySelector('.hero-monolith-svg text:nth-of-type(2)');
  const svgLine3 = document.querySelector('.hero-monolith-svg text:nth-of-type(3)');
  const heroSvg = document.querySelector('.hero-monolith-svg');

  if (svgLine1) svgLine1.textContent = t.heroLine1;
  if (svgLine2) svgLine2.textContent = t.heroLine2;
  if (svgLine3) svgLine3.textContent = t.heroSubtitle;
  if (heroSvg) heroSvg.setAttribute('aria-label', t.heroSr);

  // Для чистого HTML/CSS текста (если присутствует fallback):
  const htmlLine1 = document.querySelector('.hero-line-word-1');
  const htmlLine2 = document.querySelector('.hero-line-word-2');
  const htmlSubtitle = document.querySelector('.hero-line-subtitle');
  const heroSr = document.querySelector('.hero-left-content .sr-only, .hero-monolith-wrapper .sr-only');

  if (htmlLine1) htmlLine1.textContent = t.heroLine1;
  if (htmlLine2) htmlLine2.textContent = t.heroLine2;
  if (htmlSubtitle) htmlSubtitle.textContent = t.heroSubtitle;
  if (heroSr) heroSr.textContent = t.heroSr;

  // 5. Сохранение выбора в localStorage
  try {
    localStorage.setItem('nuance_lang', currentLang);
  } catch (e) {
    console.warn('localStorage not accessible:', e);
  }
}

export function initI18n() {
  let savedLang = 'ru';
  try {
    savedLang = localStorage.getItem('nuance_lang') || 'ru';
  } catch (e) {
    console.warn('localStorage error:', e);
  }

  // Применяем сохраненный язык при инициализации
  applyLanguage(savedLang);

  // Слушатель глобального события смены языка
  window.addEventListener('languageChange', (e) => {
    if (e.detail && e.detail.lang) {
      applyLanguage(e.detail.lang);
    }
  });
}
```

---

## 6. Спецификация Интерактивности Меню (`src/scripts/navigation.js`)

Обновление функции `initNavigation()` для управления открытием/закрытием дропдауна, закрытием при клике вне меню и выборе элемента:

```javascript
/* ==========================================
   TASK-065: Dropdown Logic in initNavigation()
   ========================================== */

export function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.querySelector('.btn-scroll-top');

  // Дропдаун переключения языков (TASK-065)
  const langSwitcher = document.getElementById('langSwitcher');
  const langTrigger = document.getElementById('langTrigger');
  const langDropdown = document.getElementById('langDropdown');
  const dropdownItems = document.querySelectorAll('.lang-dropdown-item');

  // Открытие / закрытие дропдауна по клику на кнопку-триггер
  if (langTrigger && langSwitcher) {
    langTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSwitcher.classList.toggle('is-open');
      langTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Обработка выбора языка в выпадающем списке
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = item.getAttribute('data-lang');
        
        // Закрываем меню
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');

        // Диспатчим кастомное событие смены языка
        window.dispatchEvent(new CustomEvent('languageChange', { 
          detail: { lang: selectedLang } 
        }));
      });
    });

    // Закрытие дропдауна при клике вне его области (Outside Click)
    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) {
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langSwitcher.classList.contains('is-open')) {
        langSwitcher.classList.remove('is-open');
        langTrigger.setAttribute('aria-expanded', 'false');
        langTrigger.focus();
      }
    });
  }

  // Mobile menu toggle
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      headerNav.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        headerNav.classList.remove('open');
      });
    });
  }

  // Scroll to top button in footer
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Smooth active highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.header-nav a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}
```

---

### 7. План Верификации и Тестирования
 
 1. **Визуальная проверка по референсу `media_1789075049594.png`:**
-   - [x] Выполнено: Кнопка-триггер в `header` отображает иконку глобуса слева, название языка по центру и шеврон справа.
-   - [x] Выполнено: Фон кнопки 100% прозрачный, тонкая полупрозрачная рамка гармонирует со стилем навигации.
-   - [x] Выполнено: При наведении на кнопку появляется легкая подсветка рамки и фона.
-   - [x] Выполнено: При клике шеврон плавно поворачивается на 180°, а снизу появляется выпадающее меню с затемнением и эффектом матового стекла (glassmorphism).
 
 2. **Проверка радио-индикаторов и списка языков:**
-   - [x] Выполнено: Список содержит строго 3 пункта: `Українська`, `English`, `Русский`.
-   - [x] Выполнено: Каждый пункт имеет круглый радио-индикатор слева.
-   - [x] Выполнено: Активный выбранный язык имеет циановую рамку и яркую неоновую точку внутри радио-круга.
-   - [x] Выполнено: Неактивные языки отображаются деликатным приглушенным контуром.
 
 3. **Проверка интерактивности и локализации:**
-   - [x] Выполнено: При клике на `Українська`:
-     - Текст кнопки меняется на `Українська`.
-     - Навигация переключается на украинский (`Про нас`, `Команда`, `Доктрина`, `Контакти`).
-     - В Hero-блоке строка 1 меняется на `НЕПЕРЕДБАЧУВАНИЙ`, строка 2 на `НЮАНС`, подзаголовок на `ТРИ МАЙНДСЕТИ. ОДИН ІДЕАЛЬНИЙ СИМБІОЗ.`.
-     - Дропдаун плавно закрывается.
-   - [x] Выполнено: При клике на `English`:
-     - Текст кнопки меняется на `English`.
-     - Навигация переключается на `ABOUT`, `TEAM`, `DOCTRINE`, `CONTACTS`.
-     - Hero-блок отображает `UNFORESEEN`, `NUANCE`, `THREE MINDSETS. ONE PERFECT SYMBIOSIS.`.
-   - [x] Выполнено: При клике на `Русский`:
-     - Текст кнопки меняется на `Русский`.
-     - Навигация переключается на `О Нас`, `Команда`, `Доктрина`, `Контакты`.
-     - Hero-блок отображает `НЕПРЕДВИДЕННЫЙ`, `НЮАНС`, `ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.`.
 
 4. **Проверка поведения при закрытии:**
-   - [x] Выполнено: Клик в любую свободную область страницы (Outside Click) закрывает открытый дропдаун.
-   - [x] Выполнено: Нажатие клавиши `Escape` закрывает дропдаун и возвращает фокус на кнопку-триггер.
-   - [x] Выполнено: Состояние языка сохраняется в `localStorage` и восстанавливается при перезагрузке страницы.
