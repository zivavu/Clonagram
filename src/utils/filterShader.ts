import type { CurveSet } from './filterPresets';

export {
   buildCurve,
   buildCurveSet,
   type CurvePoints,
   type CurveSet,
   type FilterPreset,
   getPreset,
   PRESETS,
} from './filterPresets';
export { FRAGMENT_SHADER, VERTEX_SHADER } from './filterShaderSources';

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
