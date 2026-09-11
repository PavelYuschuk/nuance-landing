/* =========================================================
   Hero Monolith: Задержка 3 Тика + Плавное Растворение до 90% Секции 3.3 (TASK-059)
   ========================================================= */

export function initHeroParallax() {
  const heroContent = document.querySelector('.hero-left-content') || document.querySelector('.hero-monolith-wrapper');
  const heroSection = document.getElementById('hero');

  if (!heroContent || !heroSection) return;

  // 1. Утвержденная задержка: 3 тика скролла (~210px):
  const SCROLL_DELAY_PX = 210;

  function updateHeroScrollFade() {
    const scrollY = window.pageYOffset || window.scrollY;
    const windowHeight = window.innerHeight;

    // 2. Точка полного исчезновения: ровно 90% покрытия экрана Секцией 3.3:
    const fadeEndPx = windowHeight * 0.90;

    // ФАЗА 1: Задержка на 3 тика (текст на 100% стабилен):
    if (scrollY <= SCROLL_DELAY_PX) {
      heroContent.style.opacity = '1';
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // ФАЗА 2: Ультра-плавное растворение по кривой Smoothstep до 90% экрана:
    else if (scrollY < fadeEndPx) {
      const rawProgress = (scrollY - SCROLL_DELAY_PX) / (fadeEndPx - SCROLL_DELAY_PX);
      const clamped = Math.max(0, Math.min(1, rawProgress));
      
      // Кривая Smoothstep (S-образное кинематографичное затухание без рывков):
      const smoothProgress = clamped * clamped * (3 - 2 * clamped);
      const opacity = Math.max(0, Math.min(1, 1 - smoothProgress));

      heroContent.style.opacity = opacity.toFixed(3);
      heroContent.style.visibility = 'visible';
      heroContent.style.pointerEvents = 'auto';
    } 
    // ФАЗА 3: Полное исчезновение при достижении 90% покрытия Секцией 3.3:
    else {
      heroContent.style.opacity = '0';
      heroContent.style.visibility = 'hidden';
      heroContent.style.pointerEvents = 'none';
    }

    // TASK-080: Устранено дрожание: transform не модифицируется в JS, фиксация выполняется аппаратно через CSS
  }

  window.addEventListener('scroll', updateHeroScrollFade, { passive: true });

  // Первоначальный вызов для установки корректного opacity при загрузке:
  updateHeroScrollFade();
}

export function initHeroMonolith() {
  const block = document.querySelector('.hero-monolith-block');
  const w1 = document.querySelector('.hero-line-word-1');
  const w2 = document.querySelector('.hero-line-word-2');
  const sub = document.querySelector('.hero-line-subtitle');

  if (!block || !w1 || !w2 || !sub) return;

  function balance() {
    w1.style.letterSpacing = '';
    w2.style.letterSpacing = '';
    sub.style.letterSpacing = '';

    const targetWidth = block.getBoundingClientRect().width;
    if (targetWidth <= 0) return;

    // Balance Word 1: НЕПРЕДВИДЕННЫЙ (14 chars -> 13 intervals)
    const w1Width = w1.getBoundingClientRect().width;
    if (w1Width > 0 && Math.abs(targetWidth - w1Width) > 0.5) {
      const diff1 = targetWidth - w1Width;
      const extra1 = diff1 / 13;
      const base1 = parseFloat(window.getComputedStyle(w1).letterSpacing) || 0;
      w1.style.letterSpacing = `${base1 + extra1}px`;
    }

    // Balance Word 2: ФАКТОР (6 chars -> 5 intervals)
    const w2Width = w2.getBoundingClientRect().width;
    if (w2Width > 0 && Math.abs(targetWidth - w2Width) > 0.5) {
      const diff2 = targetWidth - w2Width;
      const extra2 = diff2 / 5;
      const base2 = parseFloat(window.getComputedStyle(w2).letterSpacing) || 0;
      w2.style.letterSpacing = `${base2 + extra2}px`;
    }

    // Balance Subtitle: ТРИ МАЙНДСЕТА. ОДИН ИДЕАЛЬНЫЙ СИМБИОЗ.
    const subWidth = sub.getBoundingClientRect().width;
    if (subWidth > 0 && Math.abs(targetWidth - subWidth) > 0.5) {
      const diffSub = targetWidth - subWidth;
      const charCount = sub.textContent.trim().length;
      const extraSub = diffSub / (charCount - 1);
      const baseSub = parseFloat(window.getComputedStyle(sub).letterSpacing) || 0;
      sub.style.letterSpacing = `${baseSub + extraSub}px`;
    }
  }

  if (document.fonts) {
    document.fonts.ready.then(() => {
      balance();
      requestAnimationFrame(balance);
    });
  }

  window.addEventListener('resize', balance, { passive: true });
  balance();
}
