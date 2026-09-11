/* ==========================================
   TASK-010, TASK-011, TASK-012, TASK-013: Sticky Scroll & Character Selector Engine for Section 3.4 Team
   ========================================== */

import { initSideRays, setSideRaysColor } from './side-rays.js';

const PLAYER_ACCENTS = ['#C1FF00', '#00E5FF', '#FFC107'];

export function initTeamStickyScroll() {
  const section = document.querySelector('.team-sticky-section');
  const rosterCards = document.querySelectorAll('.roster-card');
  const infoLayers = document.querySelectorAll('.player-info-layer');
  const portraitLayers = document.querySelectorAll('.player-portrait-layer, .player-portrait-img');
  const bgLayers = document.querySelectorAll('.team-bg-layer');

  if (!section || rosterCards.length === 0) return;

  // Initialize SideRays WebGL shader layer (Zone 2)
  initSideRays();

  let lastActiveIndex = -1;

  function animateStatBars(layer) {
    const statFills = layer.querySelectorAll('.stat-bar-fill');
    statFills.forEach(fill => {
      const targetVal = fill.getAttribute('data-stat-val') || '0%';
      fill.style.width = targetVal;
    });
  }

  function resetStatBars(layer) {
    const statFills = layer.querySelectorAll('.stat-bar-fill');
    statFills.forEach(fill => {
      fill.style.width = '0%';
    });
  }

  function updateTeamScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;
    
    if (sectionHeight <= 0) return;

    // Calculate scroll progress from 0.0 to 1.0 inside 300vh sticky section
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / sectionHeight));

    // 3 Players:
    // Player 0 (Presa4ek): 0% - 33.3%
    // Player 1 (Art1zi): 33.3% - 66.6%
    // Player 2 (Matvi4): 66.6% - 100%
    let activeIndex = 0;
    if (progress >= 0.666) {
      activeIndex = 2;
    } else if (progress >= 0.333) {
      activeIndex = 1;
    } else {
      activeIndex = 0;
    }

    if (activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex;
      // Update SideRays WebGL rayColor2
      if (PLAYER_ACCENTS[activeIndex]) {
        setSideRaysColor(PLAYER_ACCENTS[activeIndex]);
      }
    }

    // Active state sync on left roster cards (Zone 3)
    rosterCards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Active state sync & stat bars animation on center info panel layers (Zone 4)
    infoLayers.forEach((layer, idx) => {
      if (idx === activeIndex) {
        layer.classList.add('active');
        animateStatBars(layer);
      } else {
        layer.classList.remove('active');
        resetStatBars(layer);
      }
    });

    // Active state sync on right PNG portrait images (Zone 1)
    portraitLayers.forEach((layer, idx) => {
      if (idx === activeIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    // Active state sync on dynamic background layers (Zone 0)
    bgLayers.forEach((bg, idx) => {
      if (idx === activeIndex) {
        bg.classList.add('active');
      } else {
        bg.classList.remove('active');
      }
    });
  }

  // Click-to-scroll interactivity for roster cards
  rosterCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const targetY = sectionTop + (index * (sectionHeight / 3)) + 10;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', updateTeamScroll, { passive: true });
  window.addEventListener('resize', updateTeamScroll, { passive: true });

  // TASK-076: Запуск инвертированного параллакса фона и портретов при движении мыши
  initTeamParallax(section, bgLayers, portraitLayers);

  updateTeamScroll();
}

// ==========================================
// TASK-076: Инвертированный параллакс фонов Zone 0 и портретов Zone 1
// ==========================================
function initTeamParallax(section, bgLayers, portraitLayers) {
  let targetBgX = 0;
  let targetBgY = 0;
  let currentBgX = 0;
  let currentBgY = 0;

  let targetPortX = 0;
  let targetPortY = 0;
  let currentPortX = 0;
  let currentPortY = 0;

  let isMouseActive = false;

  const handleMouseMove = (e) => {
    // Нормализация координат от -1 до +1 относительно центра экрана
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // 1. ИНВЕРТИРОВАННЫЙ ФОН ZONE 0 (полная интенсивность)
    targetBgX = -normX * 28; // макс. 28px
    targetBgY = -normY * 18; // макс. 18px

    // 2. ИНВЕРТИРОВАННЫЙ ПОРТРЕТ ZONE 1 (интенсивность уменьшена ровно в 2 раза)
    targetPortX = -normX * 14; // макс. 14px
    targetPortY = -normY * 9;  // макс. 9px

    isMouseActive = true;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  const renderParallax = () => {
    if (isMouseActive) {
      // Плавная интерполяция (Lerp)
      currentBgX += (targetBgX - currentBgX) * 0.08;
      currentBgY += (targetBgY - currentBgY) * 0.08;

      currentPortX += (targetPortX - currentPortX) * 0.08;
      currentPortY += (targetPortY - currentPortY) * 0.08;

      // 1. Смещение активного фона (с масштабом scale 1.04)
      bgLayers.forEach((bg) => {
        if (bg.classList.contains('active')) {
          bg.style.transform = `scale(1.04) translate3d(${currentBgX.toFixed(2)}px, ${currentBgY.toFixed(2)}px, 0)`;
        }
      });

      // 2. Смещение активного портрета (СТРОГО БЕЗ scale)
      portraitLayers.forEach((portrait) => {
        if (portrait.classList.contains('active')) {
          portrait.style.transform = `translate3d(${currentPortX.toFixed(2)}px, ${currentPortY.toFixed(2)}px, 0)`;
        }
      });
    }
    requestAnimationFrame(renderParallax);
  };

  requestAnimationFrame(renderParallax);
}
