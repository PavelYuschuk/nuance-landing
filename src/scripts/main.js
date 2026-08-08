// NUANCE Main Entry Point
import '../styles/main.css';
import { initNavigation } from './navigation.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroParallax } from './hero-parallax.js';
import { initAboutStickyScroll } from './about-scroll.js';
import { initTeamStickyScroll } from './team-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSmoothScroll(); // Initialize Lenis smooth scroll first
  initHeroParallax();
  initAboutStickyScroll();
  initTeamStickyScroll();
  console.log('NUANCE Tactical Group Website initialized with Lenis Smooth Scrolling.');
});
