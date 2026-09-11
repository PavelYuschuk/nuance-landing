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
    case 'top-zone1': // TASK-070: Смещение источника лучей строго над Zone 1 (колонки 9-12)
      return { anchor: [0.78 * w, -outside * h], dir: [-0.08, 1] };
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
