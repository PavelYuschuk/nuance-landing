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
