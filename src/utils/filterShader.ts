export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_texCoord;
uniform sampler2D u_image;
uniform sampler2D u_curves;

// Preset uniforms
uniform float u_presetActive;
uniform float u_pBrightness;
uniform float u_pContrast;
uniform float u_pSaturation;
uniform vec4 u_pShadowTint;
uniform vec4 u_pHighlightTint;
uniform vec4 u_pFade;
uniform vec3 u_pColorBalance;
uniform float u_pVignette;
uniform float u_filterStrength;

// User-controlled adjustments
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_temperature;
uniform float u_fade;
uniform float u_vignette;

out vec4 outColor;

const vec3 LUM_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

// Half-texel correction ensures we always hit exact LUT texel centers,
// eliminating linear interpolation error on the identity curve.
vec3 applyCurves(vec3 c) {
  const float S = 255.0 / 256.0;
  const float B = 0.5 / 256.0;
  c.r = texture(u_curves, vec2(c.r * S + B, 0.5)).r;
  c.g = texture(u_curves, vec2(c.g * S + B, 0.5)).g;
  c.b = texture(u_curves, vec2(c.b * S + B, 0.5)).b;
  return c;
}

vec3 setSaturation(vec3 c, float amount) {
  float lum = dot(c, LUM_WEIGHTS);
  return mix(vec3(lum), c, amount);
}

void main() {
  vec4 color = texture(u_image, v_texCoord);
  vec3 originalRGB = color.rgb;
  vec3 filtered = color.rgb;

  if (u_presetActive > 0.5) {
    // 1. Per-channel tone curves (single-pass)
    filtered = applyCurves(filtered);

    // 2. Preset saturation
    filtered = setSaturation(filtered, u_pSaturation);

    // 3. Preset color balance shift
    filtered += u_pColorBalance;

    // 4. Split toning: luminance-weighted color tint for shadows and highlights
    float lum = dot(clamp(filtered, 0.0, 1.0), LUM_WEIGHTS);
    if (u_pShadowTint.a > 0.0) {
      float mask = pow(1.0 - lum, 1.8) * u_pShadowTint.a;
      filtered = mix(filtered, u_pShadowTint.rgb, mask);
    }
    if (u_pHighlightTint.a > 0.0) {
      float mask = pow(lum, 1.6) * u_pHighlightTint.a;
      filtered = mix(filtered, u_pHighlightTint.rgb, mask);
    }

    // 5. Preset fade (lifts shadows toward a matte color)
    if (u_pFade.a > 0.0) {
      float mask = pow(1.0 - lum, 1.2) * u_pFade.a;
      filtered = mix(filtered, u_pFade.rgb, mask);
    }

    // 6. Preset contrast + brightness
    filtered = (filtered - 0.5) * u_pContrast + 0.5;
    filtered += u_pBrightness;
  }

  // ── User adjustments ──
  filtered += u_brightness;
  filtered = (filtered - 0.5) * u_contrast + 0.5;
  filtered = setSaturation(filtered, u_saturation);
  filtered.r += u_temperature * 0.08;
  filtered.g += u_temperature * 0.02;
  filtered.b -= u_temperature * 0.10;

  if (u_fade > 0.0) {
    filtered = filtered * (1.0 - u_fade * 0.7) + u_fade * 0.35;
  } else if (u_fade < 0.0) {
    filtered = pow(max(filtered, vec3(0.0)), vec3(1.0 - u_fade * 0.3));
  }

  vec2 vc = v_texCoord - 0.5;
  float dist = length(vc) * 1.4142;
  float v = u_pVignette + u_vignette;
  filtered *= clamp(1.0 - dist * v * 1.4, 0.0, 1.0);

  filtered = clamp(filtered, 0.0, 1.0);

  // Blend filtered result with the original based on filter strength
  color.rgb = mix(originalRGB, filtered, u_filterStrength);

  outColor = color;
}`;

export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
   const shader = gl.createShader(type);
   if (!shader) return null;
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
       // biome-ignore lint/suspicious/noConsole: legitimate shader compile error logging
       console.error('Shader compile error:', gl.getShaderInfoLog(shader));
       gl.deleteShader(shader);
       return null;
    }
   return shader;
}

export function createProgram(
   gl: WebGL2RenderingContext,
   vertexSource: string,
   fragmentSource: string,
): WebGLProgram | null {
   const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
   const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
   if (!vertexShader || !fragmentShader) return null;

   const program = gl.createProgram();
   if (!program) return null;

   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
       // biome-ignore lint/suspicious/noConsole: legitimate program link error logging
       console.error('Program link error:', gl.getProgramInfoLog(program));
       gl.deleteProgram(program);
       return null;
    }

   return program;
}

export function loadTexture(gl: WebGL2RenderingContext, image: HTMLImageElement | HTMLCanvasElement): WebGLTexture {
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
   return texture;
}

// ── Tone curve helpers ──────────────────────────────────────────────────────

export type CurvePoints = [number, number][];

export interface CurveSet {
   r: Float32Array;
   g: Float32Array;
   b: Float32Array;
}

function interpolate(p1: [number, number], p2: [number, number], x: number): number {
   const t = (x - p1[0]) / (p2[0] - p1[0]);
   const smoothT = t * t * (3.0 - 2.0 * t);
   return p1[1] + smoothT * (p2[1] - p1[1]);
}

export function buildCurve(points: CurvePoints): Float32Array {
   const curve = new Float32Array(256);
   for (let i = 0; i < 256; i++) {
      const x = i / 255;
      let value = x;
      for (let j = 0; j < points.length - 1; j++) {
         if (x >= points[j][0] && x <= points[j + 1][0]) {
            value = interpolate(points[j], points[j + 1], x);
            break;
         }
      }
      curve[i] = Math.max(0, Math.min(1, value));
   }
   return curve;
}

export function buildCurveSet(r: CurvePoints, g: CurvePoints, b: CurvePoints): CurveSet {
   return { r: buildCurve(r), g: buildCurve(g), b: buildCurve(b) };
}

const ID: CurvePoints = [
   [0, 0],
   [1, 1],
];
const IDENTITY_CURVES = buildCurveSet(ID, ID, ID);

// ── Filter preset definition ────────────────────────────────────────────────

export interface FilterPreset {
   curves: CurveSet;
   brightness: number;
   contrast: number;
   saturation: number;
   shadowTint: [number, number, number, number];
   highlightTint: [number, number, number, number];
   fade: [number, number, number, number];
   colorBalance: [number, number, number];
   vignette: number;
}

// ── Preset recipes ──────────────────────────────────────────────────────────

export const PRESETS: Record<string, FilterPreset> = {
   Original: {
      curves: IDENTITY_CURVES,
      brightness: 0,
      contrast: 1,
      saturation: 1,
      shadowTint: [0, 0, 0, 0],
      highlightTint: [0, 0, 0, 0],
      fade: [0, 0, 0, 0],
      colorBalance: [0, 0, 0],
      vignette: 0,
   },

   // Cool, vivid, high contrast — signature Instagram look.
   Clarendon: {
      curves: buildCurveSet(
         [
            [0, 0],
            [0.35, 0.28],
            [0.65, 0.74],
            [1, 1],
         ],
         [
            [0, 0],
            [0.35, 0.3],
            [0.65, 0.74],
            [1, 1],
         ],
         [
            [0, 0.02],
            [0.35, 0.34],
            [0.65, 0.78],
            [1, 1],
         ],
      ),
      brightness: 0.01,
      contrast: 1.1,
      saturation: 1.18,
      shadowTint: [0.12, 0.22, 0.36, 0.14],
      highlightTint: [0.6, 0.82, 0.96, 0.18],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.0, 0.03],
      vignette: 0,
   },

   // Warm, vintage, slight haze with cream shadows.
   Gingham: {
      curves: buildCurveSet(
         [
            [0, 0.07],
            [0.5, 0.52],
            [1, 0.95],
         ],
         [
            [0, 0.07],
            [0.5, 0.51],
            [1, 0.93],
         ],
         [
            [0, 0.09],
            [0.5, 0.53],
            [1, 0.9],
         ],
      ),
      brightness: 0,
      contrast: 0.95,
      saturation: 0.84,
      shadowTint: [0.96, 0.88, 0.72, 0.18],
      highlightTint: [1.0, 0.96, 0.88, 0.1],
      fade: [0.93, 0.89, 0.76, 0.06],
      colorBalance: [0.01, 0.0, -0.01],
      vignette: 0.03,
   },

   // Black & white, slight cool tone in grays.
   Moon: {
      curves: buildCurveSet(
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
      ),
      brightness: 0,
      contrast: 1.1,
      saturation: 0,
      shadowTint: [0.1, 0.12, 0.17, 0.14],
      highlightTint: [0.94, 0.96, 1.0, 0.1],
      fade: [0, 0, 0, 0],
      colorBalance: [0, 0, 0],
      vignette: 0.08,
   },

   // Brighter and cooler, washes out warm tones.
   Lark: {
      curves: buildCurveSet(
         [
            [0, 0.02],
            [0.5, 0.48],
            [1, 0.96],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
         [
            [0, 0.03],
            [0.5, 0.55],
            [1, 1.0],
         ],
      ),
      brightness: 0.03,
      contrast: 1.04,
      saturation: 0.92,
      shadowTint: [0.5, 0.64, 0.75, 0.12],
      highlightTint: [0.8, 0.94, 1.0, 0.16],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.0, 0.02],
      vignette: 0,
   },

   // Faded vintage film — heavy shadow lift and dusty warm tone.
   Reyes: {
      curves: buildCurveSet(
         [
            [0, 0.16],
            [0.5, 0.58],
            [1, 0.96],
         ],
         [
            [0, 0.14],
            [0.5, 0.56],
            [1, 0.94],
         ],
         [
            [0, 0.12],
            [0.5, 0.52],
            [1, 0.89],
         ],
      ),
      brightness: 0.04,
      contrast: 0.88,
      saturation: 0.76,
      shadowTint: [0.96, 0.84, 0.74, 0.2],
      highlightTint: [1.0, 0.94, 0.82, 0.12],
      fade: [0.94, 0.88, 0.78, 0.12],
      colorBalance: [0.02, 0.01, -0.01],
      vignette: 0,
   },

   // Warm and vivid — pumps reds and yellows.
   Juno: {
      curves: buildCurveSet(
         [
            [0, 0.01],
            [0.5, 0.55],
            [1, 1.0],
         ],
         [
            [0, 0],
            [0.5, 0.52],
            [1, 0.98],
         ],
         [
            [0, 0],
            [0.5, 0.46],
            [1, 0.94],
         ],
      ),
      brightness: 0.01,
      contrast: 1.08,
      saturation: 1.18,
      shadowTint: [0.42, 0.3, 0.2, 0.14],
      highlightTint: [1.0, 0.9, 0.6, 0.16],
      fade: [0, 0, 0, 0],
      colorBalance: [0.03, 0.0, -0.02],
      vignette: 0,
   },

   // Soft pastel with pink-rose shadows.
   Aden: {
      curves: buildCurveSet(
         [
            [0, 0.08],
            [0.5, 0.52],
            [1, 0.95],
         ],
         [
            [0, 0.08],
            [0.5, 0.52],
            [1, 0.94],
         ],
         [
            [0, 0.06],
            [0.5, 0.5],
            [1, 0.91],
         ],
      ),
      brightness: 0.01,
      contrast: 0.94,
      saturation: 0.84,
      shadowTint: [1.0, 0.76, 0.8, 0.16],
      highlightTint: [1.0, 0.94, 0.88, 0.1],
      fade: [1.0, 0.9, 0.88, 0.08],
      colorBalance: [0.01, -0.01, 0.0],
      vignette: 0,
   },

   // Cool pastels with a green/teal bias.
   Perpetua: {
      curves: buildCurveSet(
         [
            [0, 0.01],
            [0.5, 0.48],
            [1, 0.96],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
      ),
      brightness: 0.02,
      contrast: 1.05,
      saturation: 1.05,
      shadowTint: [0.24, 0.5, 0.52, 0.14],
      highlightTint: [0.8, 0.98, 0.92, 0.14],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.01, 0.02],
      vignette: 0,
   },

   // Warm cream with magenta-pink highlights.
   Crema: {
      curves: buildCurveSet(
         [
            [0, 0.06],
            [0.5, 0.52],
            [1, 0.96],
         ],
         [
            [0, 0.06],
            [0.5, 0.51],
            [1, 0.94],
         ],
         [
            [0, 0.04],
            [0.5, 0.48],
            [1, 0.9],
         ],
      ),
      brightness: 0.01,
      contrast: 1.0,
      saturation: 0.87,
      shadowTint: [0.52, 0.4, 0.36, 0.14],
      highlightTint: [1.0, 0.94, 0.84, 0.18],
      fade: [0.96, 0.92, 0.82, 0.08],
      colorBalance: [0.02, 0.0, -0.01],
      vignette: 0,
   },

   // Warm vintage with amber shadows and subtle vignette.
   Ludwig: {
      curves: buildCurveSet(
         [
            [0, 0.03],
            [0.35, 0.3],
            [0.65, 0.72],
            [1, 1.0],
         ],
         [
            [0, 0.02],
            [0.5, 0.5],
            [1, 0.96],
         ],
         [
            [0, 0.01],
            [0.5, 0.47],
            [1, 0.92],
         ],
      ),
      brightness: 0,
      contrast: 1.08,
      saturation: 0.9,
      shadowTint: [0.52, 0.38, 0.26, 0.18],
      highlightTint: [1.0, 0.92, 0.78, 0.12],
      fade: [0, 0, 0, 0],
      colorBalance: [0.02, 0.0, -0.02],
      vignette: 0.08,
   },

   // Hazy, dreamy, yellow-green wash.
   Slumber: {
      curves: buildCurveSet(
         [
            [0, 0.08],
            [0.5, 0.54],
            [1, 0.95],
         ],
         [
            [0, 0.1],
            [0.5, 0.55],
            [1, 0.94],
         ],
         [
            [0, 0.06],
            [0.5, 0.49],
            [1, 0.88],
         ],
      ),
      brightness: 0.02,
      contrast: 0.92,
      saturation: 0.78,
      shadowTint: [0.82, 0.8, 0.55, 0.2],
      highlightTint: [1.0, 0.96, 0.8, 0.14],
      fade: [0.92, 0.92, 0.72, 0.12],
      colorBalance: [0.01, 0.01, -0.03],
      vignette: 0.02,
   },
};

export function createCurveTexture(gl: WebGL2RenderingContext, curveSet: CurveSet): WebGLTexture {
   const data = new Uint8Array(256 * 4);
   for (let i = 0; i < 256; i++) {
      data[i * 4 + 0] = Math.round(curveSet.r[i] * 255);
      data[i * 4 + 1] = Math.round(curveSet.g[i] * 255);
      data[i * 4 + 2] = Math.round(curveSet.b[i] * 255);
      data[i * 4 + 3] = 255;
   }

   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   // NEAREST to guarantee exact LUT texel hits (no interpolation between curve points)
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

   return texture;
}

export function getPreset(name: string): FilterPreset {
   return PRESETS[name] ?? PRESETS.Original;
}
