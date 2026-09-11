// NUANCE Main Entry Point
import '../styles/main.css';
import { initNavigation } from './navigation.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroParallax, initHeroMonolith } from './hero-parallax.js';
import { initAboutStickyScroll } from './about-scroll.js';
import { initTeamStickyScroll } from './team-scroll.js';
import { initDoctrineLogoParallax } from './doctrine-scroll.js';
import { initI18n } from './i18n.js';
import { initLightRays } from './light-rays.js';
import { initBorderGlow } from './border-glow.js';
import { initTargetCursor } from './target-cursor.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initI18n();
  initSmoothScroll(); // TASK-079: Initialize SmoothScroll.js engine first
  initHeroParallax();
  initHeroMonolith();
  initAboutStickyScroll();
  initTeamStickyScroll();
  initDoctrineLogoParallax();

  // TASK-070: Инициализация WebGL LightRays со смещением вправо над Zone 1
  initLightRays('.team-zone-2', {
    raysOrigin: 'top-zone1',
    raysColor: '#c1f2ff',
    raysSpeed: 0.5,
    lightSpread: 0.22,
    rayLength: 1.25,
    followMouse: true,
    mouseInfluence: 0.25,
    noiseAmount: 0.1,
    distortion: 0.05,
    pulsating: true,
    fadeDistance: 1.7,
    saturation: 0.8
  });

  // TASK-075: Обновленная инициализация BorderGlow для иллюстраций Genesis
  initBorderGlow('.genesis-image-block', {
    edgeSensitivity: 20,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: '#141C29',
    borderRadius: 14,
    glowRadius: 50,
    glowIntensity: 2.2,
    coneSpread: 26,
    fillOpacity: 0.45,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-075: Обновленная инициализация BorderGlow для карточек Доктрины
  initBorderGlow('.doctrine-card', {
    edgeSensitivity: 22,
    glowColor: '185 100 60', // Тактический циан NUANCE
    backgroundColor: 'rgba(20, 28, 41, 0.4)',
    borderRadius: 16,
    glowRadius: 60,
    glowIntensity: 2.5,
    coneSpread: 28,
    fillOpacity: 0.5,
    colors: ['#00E5FF', '#C1FF00', '#38bdf8']
  });

  // TASK-074: Инициализация тактического курсора TargetCursor
  initTargetCursor({
    targetSelector: '.cursor-target, a, button, [role="button"], input, select, textarea, .doctrine-card, .lang-switcher-btn, .lang-dropdown-item, .team-roster-item',
    spinDuration: 3.5,
    hideDefaultCursor: true,
    hoverDuration: 0.2,
    parallaxOn: true,
    cursorColor: '#ffffff',
    cursorColorOnTarget: '#00E5FF' // При захвате цели цвет переходит в тактический циановый оттенок NUANCE
  });

  console.log('NUANCE Tactical Group Website initialized with TargetCursor and SmoothScroll.js.');
});
