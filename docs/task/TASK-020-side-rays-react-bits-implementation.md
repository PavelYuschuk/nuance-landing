# TASK-020: Интеграция Компонента SideRays от React Bits в "3.6. Call to Action"

**Status:** DONE  
**Target File(s):** `src/scripts/side-rays.js`, `src/styles/socials.css`, `index.html`, `src/scripts/main.js`  
**Reference:** React Bits (`SideRays` Component Specification)  
**Dependency:** `ogl` (`^1.0.11` в `package.json`)

---

## 1. Контекст и Цель Модификации
Полная адаптация и интеграция фирменного WebGL-компонента **SideRays от React Bits** в секцию "3.6. Call to Action".Разработан модульный скрипт для Vanilla JS (Vite), реализующий 100% точность фрагментного и вертексного шейдеров, динамические уникальные юниформы (`iSpeed`, `iRayColor1`, `iRayColor2`, `iTilt`, `iSpread`, `iFalloff`, `iOpacity`) и очистку контекста при скролле (IntersectionObserver).

---

## 2. Инженерная Спецификация (Design Spec)

### 2.1. Конфигурационная Матрица Пропсов (SideRays React Bits Props)

| Параметр (Prop) | Значение | Тип | Назначение |
| :--- | :--- | :--- | :--- |
| **`speed`** | `2.5` | `number` | Скорость колебания лучей |
| **`rayColor1`** | `#EAB308` | `string (hex)` | Ядро светового луча (Золотой) |
| **`rayColor2`** | `#96C8FF` | `string (hex)` | Внешний спектр лучей (Голубой) |
| **`intensity`** | `2.0` | `number` | Общая яркость пучка |
| **`spread`** | `2.0` | `number` | Угол веера лучевого спектра |
| **`origin`** | `"top-right"` | `string` | Исходная точка (правый верхний угол) |
| **`tilt`** | `0` | `number` | Угол наклона веера в градусах (0°) |
| **`saturation`**| `1.5` | `number` | Насыщенность цвета (1.5 = буст цвета) |
| **`blend`** | `0.75` | `number` | Баланс смешивания слоев (0.75) |
| **`falloff`** | `1.6` | `number` | Затухание яркости по расстоянию |
| **`opacity`** | `1.0` | `number` | Прозрачность шейдерного слоя (100%) |

---

### 2.2. Исполнительный Модуль Шейдера для Vite (`src/scripts/side-rays.js`)

Верстальщик создает файл `src/scripts/side-rays.js` с переводным кодом шейдеров OGL:

```javascript
import { Renderer, Program, Triangle, Mesh } from 'ogl';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const originToFlip = origin => {
  switch (origin) {
    case 'top-left': return [1, 0];
    case 'bottom-right': return [0, 1];
    case 'bottom-left': return [1, 1];
    default: return [0, 0]; // top-right
  }
};

const vert = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const frag = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export function initSideRays(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const config = {
    speed: 2.5,
    rayColor1: '#EAB308',
    rayColor2: '#96c8ff',
    intensity: 2.0,
    spread: 2.0,
    origin: 'top-right',
    tilt: 0,
    saturation: 1.5,
    blend: 0.75,
    falloff: 1.6,
    opacity: 1.0,
    ...options
  };

  let renderer, animId;
  const [flipX, flipY] = originToFlip(config.origin);

  renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
  const gl = renderer.gl;
  gl.canvas.style.width = '100%';
  gl.canvas.style.height = '100%';

  container.appendChild(gl.canvas);

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: [1, 1] },
    iSpeed: { value: config.speed },
    iRayColor1: { value: hexToRgb(config.rayColor1) },
    iRayColor2: { value: hexToRgb(config.rayColor2) },
    iIntensity: { value: config.intensity },
    iSpread: { value: config.spread },
    iFlipX: { value: flipX },
    iFlipY: { value: flipY },
    iTilt: { value: config.tilt },
    iSaturation: { value: config.saturation },
    iBlend: { value: config.blend },
    iFalloff: { value: config.falloff },
    iOpacity: { value: config.opacity }
  };

  const geometry = new Triangle(gl);
  const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 600;
    renderer.setSize(w, h);
    uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
  }

  function loop(t) {
    uniforms.iTime.value = t * 0.001;
    renderer.render({ scene: mesh });
    animId = requestAnimationFrame(loop);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      resize();
      if (!animId) animId = requestAnimationFrame(loop);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0.1 });

  observer.observe(container);
  window.addEventListener('resize', resize);
  resize();
}
```

---

### 2.3. CSS Спецификация (`src/styles/socials.css`)

```css
.cta-siderays-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 600px;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен в `Status: To do`.
- [ ] Создан модуль `src/scripts/side-rays.js` с точно переведенным шейдером React Bits.
- [ ] Параметры инициализации заданы точно по пропсам (`speed: 2.5`, `rayColor1: #EAB308`, `rayColor2: #96c8ff`, `intensity: 2`, `spread: 2`, `origin: top-right`, `tilt: 0`, `saturation: 1.5`, `blend: 0.75`, `falloff: 1.6`, `opacity: 1.0`).
- [ ] В `main.js` вызван `initSideRays('.cta-siderays-wrapper')`.
- [ ] Шейдер активируется с помощью IntersectionObserver и корректно отрисовывает лучи света.
