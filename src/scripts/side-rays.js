/* ==========================================
   TASK-020: SideRays Component Specification from React Bits (powered by OGL)
   ========================================== */

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

export function initSideRays(containerSelector = '.cta-siderays-wrapper', options = {}) {
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
  gl.canvas.style.display = 'block';

  // Ensure canvas is attached cleanly to container
  container.innerHTML = '';
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
  const program = new Program(gl, { vertex: vert, fragment: frag, uniforms, transparent: true });
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
  window.addEventListener('resize', resize, { passive: true });
  resize();
}

// Alias for backwards compatibility with CTA caller
export function initCtaSideRays() {
  initSideRays('.cta-siderays-wrapper');
}

export function setSideRaysColor() {}
