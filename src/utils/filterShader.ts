import type { Adjustments } from '@/src/components/CreatePostModal/types';
import { BLEND_MODE_VALUES, type CurveSet, getPreset, type TintColor } from './filterPresets';

export {
   type BlendMode,
   buildCurve,
   buildCurveSet,
   type CurvePoints,
   type CurveSet,
   type FilterPreset,
   getPreset,
   PRESETS,
   type TintColor,
} from './filterPresets';
export { FRAGMENT_SHADER, VERTEX_SHADER } from './filterShaderSources';

const FILTER_UNIFORM_NAMES = [
   'u_image',
   'u_curves',
   'u_presetActive',
   'u_pBrightness',
   'u_pContrast',
   'u_pSaturation',
   'u_pSepia',
   'u_pHue',
   'u_pShadowTint',
   'u_pHighlightTint',
   'u_pFade',
   'u_pColorBalance',
   'u_pVignette',
   'u_pBlendMode',
   'u_pBlendTop',
   'u_pBlendBottom',
   'u_filterStrength',
   'u_brightness',
   'u_contrast',
   'u_saturation',
   'u_temperature',
   'u_fade',
   'u_vignette',
] as const;

export type FilterUniformLocations = Record<
   (typeof FILTER_UNIFORM_NAMES)[number],
   WebGLUniformLocation | null
>;

export function getFilterUniformLocations(gl: WebGL2RenderingContext, program: WebGLProgram) {
   const locs = {} as FilterUniformLocations;
   for (const name of FILTER_UNIFORM_NAMES) {
      locs[name] = gl.getUniformLocation(program, name);
   }
   return locs;
}

export function setPresetUniforms(
   gl: WebGL2RenderingContext,
   locs: FilterUniformLocations,
   presetName: string,
   filterStrength: number,
) {
   const NO_TINT: TintColor = [0, 0, 0, 0];
   const preset = getPreset(presetName);
   gl.uniform1f(locs.u_presetActive, presetName === 'Original' ? 0.0 : 1.0);
   gl.uniform1f(locs.u_pBrightness, preset.brightness ?? 0);
   gl.uniform1f(locs.u_pContrast, preset.contrast ?? 1);
   gl.uniform1f(locs.u_pSaturation, preset.saturation ?? 1);
   gl.uniform1f(locs.u_pSepia, preset.sepia ?? 0);
   gl.uniform1f(locs.u_pHue, ((preset.hue ?? 0) * Math.PI) / 180);
   gl.uniform4fv(locs.u_pShadowTint, preset.shadowTint ?? NO_TINT);
   gl.uniform4fv(locs.u_pHighlightTint, preset.highlightTint ?? NO_TINT);
   gl.uniform4fv(locs.u_pFade, preset.fade ?? NO_TINT);
   gl.uniform3fv(locs.u_pColorBalance, preset.colorBalance ?? [0, 0, 0]);
   gl.uniform1f(locs.u_pVignette, preset.vignette ?? 0);
   gl.uniform1f(locs.u_pBlendMode, BLEND_MODE_VALUES[preset.blendMode ?? 'none']);
   gl.uniform4fv(locs.u_pBlendTop, preset.blendTop ?? preset.blendBottom ?? NO_TINT);
   gl.uniform4fv(locs.u_pBlendBottom, preset.blendBottom ?? preset.blendTop ?? NO_TINT);
   gl.uniform1f(locs.u_filterStrength, filterStrength);
}

export function setAdjustmentUniforms(
   gl: WebGL2RenderingContext,
   locs: FilterUniformLocations,
   adjustments: Adjustments,
) {
   gl.uniform1f(locs.u_brightness, adjustments.brightness / 100);
   gl.uniform1f(locs.u_contrast, 1 + adjustments.contrast / 100);
   gl.uniform1f(locs.u_saturation, 1 + adjustments.saturation / 100);
   gl.uniform1f(locs.u_temperature, adjustments.temperature / 100);
   gl.uniform1f(locs.u_fade, adjustments.fade / 100);
   gl.uniform1f(locs.u_vignette, adjustments.vignette / 100);
}

export function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
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
) {
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

export function loadTexture(
   gl: WebGL2RenderingContext,
   image: HTMLImageElement | HTMLCanvasElement,
) {
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

export function createCurveTexture(gl: WebGL2RenderingContext, curveSet: CurveSet) {
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
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

   return texture;
}
