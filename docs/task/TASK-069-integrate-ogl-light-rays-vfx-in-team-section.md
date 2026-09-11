# TASK-069: Интеграция WebGL-компонента LightRays (React Bits / OGL) в Секцию 3.4 Team

**Status:** DONE  
**Target File(s):** `src/scripts/light-rays.js` (NEW), `src/scripts/main.js`, `src/styles/team.css`, `index.html`  
**Parent Specification:** TASK-010, TASK-011 (Zone 2 Reserved Architecture), TASK-060, TASK-066  
**Dependencies:** `ogl` (уже установлена в `package.json`, версия `^1.0.11`)  

---

## 1. Контекст и Постановка Задачи

Пользователь поставил задачу добавить в секцию **3.4 Team Character Selector** поверх фона и градиента визуальный шейдерный эффект объемных лучей света **<LightRays />** из библиотеки React Bits:

> *«поверх фона и градиента добавить эффект:  
> ## Integrate the <LightRays /> component from React Bits  
> RaysOrigin: "top-center", raysColor: "#c1f2ff", raysSpeed: 0.5, lightSpread: 0.2, rayLength: 1.2, followMouse: true, mouseInfluence: 0.3, noiseAmount: 0.1, distortion: 0.05, pulsating: true, fadeDistance: 1.7, saturation: 0.8»*

### 1.1. Адаптация стека (React $\to$ Vanilla JS)
Проект **NUANCE** построен на стеке **Vanilla JS + HTML5 + CSS (Vite)** без React.  
Компонент `LightRays` из React Bits представляет собой тонкую обертку над WebGL-библиотекой **`ogl`** (`Renderer`, `Program`, `Triangle`, `Mesh`).  
Поскольку пакет `ogl` (`^1.0.11`) уже установлен в проекте, шейдер и логика переносятся в высокопроизводительный нативный модуль `src/scripts/light-rays.js` с сохранением 100% математики лучей, интерактивности мыши и шейдерных функций.

---

## 2. Архитектура Размещения Слоев (Zone 2 Matrix)

В пятизонной архитектуре Секции 3.4 (TASK-010 / TASK-011) слой **`Zone 2`** изначально был зарезервирован как специальный оверлейный VFX-слой:

```
┌────────────────────────────────────────────────────────┐
│ Zone 4 (Текст, Цитаты) + Zone 3 (Ростер) [z-index: 5]  │
├────────────────────────────────────────────────────────┤
│ Zone 1: Character Portrait PNG [z-index: 4]            │
├────────────────────────────────────────────────────────┤
│ Zone 2: WebGL LightRays VFX Canvas [z-index: 2] ◄── NEW│
├────────────────────────────────────────────────────────┤
│ Zone 0: Фото баз + 90% Оверлей + Градиент [z-index: 1] │
└────────────────────────────────────────────────────────┘
```

1. **Расположение:**  
   Слой `.team-zone-2` размещается строго поверх фоновых баз и радиального градиента `Zone 0` (`z-index: 1`), но строго позади контента (`z-index: 4`–`5`).
2. **Оптический эффект:**  
   Объемные лучи цвета `#c1f2ff` (холодный тактический циановый свет) исходят из верхней центральной точки вьюпорта (`top-center`), мягко озаряя локации баз и силуэт персонажа, придавая секции глубокую трехмерность и динамику.
3. **Производительность:**  
   Интегрируется встроенный `IntersectionObserver`: WebGL-рендер запускается только тогда, когда Секция 3.4 находится на экране, потребляя 0% ресурсов GPU/CPU в остальных секциях сайта.
4. **Прозрачность кликов:**  
   Элемент снабжается `pointer-events: none;`, полностью сохраняя доступность скролла и кликов по карточкам бойцов.

---

## 3. Спецификация Нативного Модуля `src/scripts/light-rays.js` (NEW)

Создается новый файл [src/scripts/light-rays.js](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/src/scripts/light-rays.js):

```javascript
/* ==========================================
   TASK-069: WebGL LightRays Component (powered by OGL)
   Adapted from React Bits for NUANCE Landing
   ========================================== */

import { Renderer, Program, Triangle, Mesh } from 'ogl';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float lightMode;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;

  if (lightMode > 0.5) {
    vec3 mapped = vec3(1.0) - exp(-max(fragColor.rgb, vec3(0.0)) * 1.35);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    vec3 ink = mix(hue * 0.25, hue * 0.72, energy);
    fragColor = vec4(mix(vec3(1.0), ink, energy), 1.0);
  }
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

export function initLightRays(containerSelector = '.team-zone-2', customOptions = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  // Опции пользователя по умолчанию
  const options = {
    raysOrigin: 'top-center',
    raysColor: '#c1f2ff',
    raysSpeed: 0.5,
    lightSpread: 0.2,
    rayLength: 1.2,
    pulsating: true,
    fadeDistance: 1.7,
    saturation: 0.8,
    followMouse: true,
    mouseInfluence: 0.3,
    noiseAmount: 0.1,
    distortion: 0.05,
    lightMode: false,
    ...customOptions
  };

  let renderer = null;
  let uniforms = null;
  let mesh = null;
  let animationId = null;
  let isVisible = false;

  const mousePos = { x: 0.5, y: 0.5 };
  const smoothMouse = { x: 0.5, y: 0.5 };

  // 1. Инициализация WebGL через OGL
  const setupWebGL = () => {
    renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    });

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';

    // Очистка контейнера и добавление canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(gl.canvas);

    uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(options.raysColor) },
      raysSpeed: { value: options.raysSpeed },
      lightSpread: { value: options.lightSpread },
      rayLength: { value: options.rayLength },
      pulsating: { value: options.pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: options.fadeDistance },
      saturation: { value: options.saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: options.mouseInfluence },
      noiseAmount: { value: options.noiseAmount },
      distortion: { value: options.distortion },
      lightMode: { value: options.lightMode ? 1.0 : 0.0 }
    };

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms
    });
    mesh = new Mesh(gl, { geometry, program });

    updatePlacement();
  };

  // 2. Обновление размеров и привязки лучей
  const updatePlacement = () => {
    if (!container || !renderer) return;

    renderer.dpr = Math.min(window.devicePixelRatio, 2);
    const { clientWidth: wCSS, clientHeight: hCSS } = container;
    renderer.setSize(wCSS, hCSS);

    const dpr = renderer.dpr;
    const w = wCSS * dpr;
    const h = hCSS * dpr;

    if (uniforms) {
      uniforms.iResolution.value = [w, h];
      const { anchor, dir } = getAnchorAndDir(options.raysOrigin, w, h);
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
    }
  };

  // 3. Анимационный цикл requestAnimationFrame
  const loop = t => {
    if (!renderer || !uniforms || !mesh || !isVisible) {
      return;
    }

    uniforms.iTime.value = t * 0.001;

    if (options.followMouse && options.mouseInfluence > 0.0) {
      const smoothing = 0.92;
      smoothMouse.x = smoothMouse.x * smoothing + mousePos.x * (1 - smoothing);
      smoothMouse.y = smoothMouse.y * smoothing + mousePos.y * (1 - smoothing);
      uniforms.mousePos.value = [smoothMouse.x, smoothMouse.y];
    }

    try {
      renderer.render({ scene: mesh });
      animationId = requestAnimationFrame(loop);
    } catch (err) {
      console.warn('LightRays render error:', err);
    }
  };

  // 4. Отслеживание мыши
  const handleMouseMove = e => {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mousePos.x = (e.clientX - rect.left) / rect.width;
    mousePos.y = (e.clientY - rect.top) / rect.height;
  };

  if (options.followMouse) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  window.addEventListener('resize', updatePlacement, { passive: true });

  // 5. IntersectionObserver для энергосбережения
  const observer = new IntersectionObserver(
    entries => {
      const entry = entries[0];
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!renderer) {
          setupWebGL();
        }
        if (!animationId) {
          animationId = requestAnimationFrame(loop);
        }
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    },
    { threshold: 0.05 }
  );

  observer.observe(container);

  // Возврат API для управления (например, динамической смены цвета лучей)
  return {
    setRaysColor: color => {
      options.raysColor = color;
      if (uniforms) uniforms.raysColor.value = hexToRgb(color);
    },
    destroy: () => {
      if (animationId) cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updatePlacement);
      if (renderer && renderer.gl) {
        const ext = renderer.gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    }
  };
}
```

---

## 4. Спецификация Стилизации (`src/styles/team.css`)

Добавление стилей слоя `.team-zone-2` (строки 90–100):

```css
/* =========================================================
   TASK-069: Zone 2 - WebGL LightRays VFX Canvas Layer
   ========================================================= */
.team-zone-2,
.light-rays-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2; /* Строго поверх Zone 0 (z:1) и под контентом (z:4) */
  overflow: hidden;
}

.custom-rays canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
```

---

## 5. Спецификация Разметки и Инициализации

### 5.1. Разметка в `index.html` (строка 231)
```html
<!-- Zone 2: WebGL LightRays VFX Overlay Layer (TASK-069) -->
<div class="team-zone-2 light-rays-container custom-rays"></div>
```

### 5.2. Подключение в `src/scripts/main.js`
В точке входа приложения импортируется и запускается эффект с заданными пользователем параметрами:

```javascript
import { initLightRays } from './light-rays.js';

document.addEventListener('DOMContentLoaded', () => {
  // ... существующие инициализации (initNavigation, initI18n, initTeamStickyScroll и др.)
  
  // TASK-069: Инициализация WebGL LightRays в секции 3.4
  initLightRays('.team-zone-2', {
    raysOrigin: 'top-center',
    raysColor: '#c1f2ff',
    raysSpeed: 0.5,
    lightSpread: 0.2,
    rayLength: 1.2,
    followMouse: true,
    mouseInfluence: 0.3,
    noiseAmount: 0.1,
    distortion: 0.05,
    pulsating: true,
    fadeDistance: 1.7,
    saturation: 0.8
  });
});
```

---

## 6. План Верификации и Тестирования

1. **Проверка рендеринга WebGL лучей:**
   - [x] Выполнено: При попадании в Секцию 3.4 сверху вниз мягко струятся световые лучи нежного цианового оттенка `#c1f2ff`.
   - [x] Выполнено: Лучи расположены поверх военной базы и темного градиента `Zone 0`, но строго под текстом «КОМАНДА», карточками ростера и портретом бойца.
2. **Проверка динамики и физики:**
   - [x] Выполнено: Присутствует деликатная пульсация (`pulsating: true`) и мягкое волновое искажение (`distortion: 0.05`).
   - [x] Выполнено: При движении курсора мыши лучи плавно ориентируются в сторону курсора (`mouseInfluence: 0.3`).
3. **Проверка производительности (0% утечек):**
   - [x] Выполнено: Когда пользователь находится в Секции 3.2 (Hero) или 3.5 (Доктрина), цикл `requestAnimationFrame` автоматически останавливается благодаря `IntersectionObserver`.
   - [x] Выполнено: Отсутствуют блокировки кликов (`pointer-events: none`).
