import type { AspectRatio, PostMedia } from '../components/CreatePostModal/types';
import {
   createCurveTexture,
   createProgram,
   FRAGMENT_SHADER,
   getPreset,
   VERTEX_SHADER,
} from './filterShader';

const OUTPUT_SIZES: Record<Exclude<AspectRatio, 'original'>, { w: number; h: number }> = {
   '1:1': { w: 1080, h: 1080 },
   '4:5': { w: 1080, h: 1350 },
   '16:9': { w: 1920, h: 1080 },
   '9:16': { w: 1080, h: 1920 },
};

function outputSize(
   aspectRatio: AspectRatio,
   naturalW: number,
   naturalH: number,
): { w: number; h: number } {
   if (aspectRatio !== 'original') return OUTPUT_SIZES[aspectRatio];
   const maxDim = 2048;
   const longer = Math.max(naturalW, naturalH);
   if (longer <= maxDim) return { w: naturalW, h: naturalH };
   const scale = maxDim / longer;
   return { w: Math.round(naturalW * scale), h: Math.round(naturalH * scale) };
}

function buildVertexBuffer(
   media: PostMedia,
   outW: number,
   outH: number,
   naturalW: number,
   naturalH: number,
): Float32Array {
   const { zoom, panX, panY, imageDisplayW, imageDisplayH } = media;
   const displayW = imageDisplayW || naturalW;
   const displayH = imageDisplayH || naturalH;

   const imgRatio = displayW / displayH;
   const cropRatio = outW / outH;

   const cropBoxW = imgRatio >= cropRatio ? displayH * cropRatio : displayW;
   const cropBoxH = imgRatio >= cropRatio ? displayH : displayW / cropRatio;

   const halfU = cropBoxW / (2 * zoom * displayW);
   const halfV = cropBoxH / (2 * zoom * displayH);
   const panU = panX / (zoom * displayW);
   const panV = panY / (zoom * displayH);

   const u0 = 0.5 - halfU - panU;
   const u1 = 0.5 + halfU - panU;
   const v0 = 0.5 - halfV - panV;
   const v1 = 0.5 + halfV - panV;

   return new Float32Array([
      -1,
      -1,
      u0,
      v0,
      1,
      -1,
      u1,
      v0,
      -1,
      1,
      u0,
      v1,
      -1,
      1,
      u0,
      v1,
      1,
      -1,
      u1,
      v0,
      1,
      1,
      u1,
      v1,
   ]);
}

function loadBitmapTexture(
   gl: WebGL2RenderingContext,
   image: HTMLImageElement | ImageBitmap,
): WebGLTexture {
   const texture = gl.createTexture();
   if (!texture) throw new Error('Failed to create WebGL texture');
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

async function loadImage(src: string): Promise<HTMLImageElement> {
   return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
   });
}

export async function bakeImage(media: PostMedia, aspectRatio: AspectRatio): Promise<Blob> {
   const img = await loadImage(media.preview);
   const { w: outW, h: outH } = outputSize(aspectRatio, img.naturalWidth, img.naturalHeight);

   const canvas = new OffscreenCanvas(outW, outH);
   const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
   if (!gl) throw new Error('WebGL2 not supported');

   const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
   if (!program) throw new Error('Failed to create WebGL program');
   // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
   gl.useProgram(program);

   const vertices = buildVertexBuffer(media, outW, outH, img.naturalWidth, img.naturalHeight);
   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

   const posLoc = gl.getAttribLocation(program, 'a_position');
   const uvLoc = gl.getAttribLocation(program, 'a_texCoord');
   gl.enableVertexAttribArray(posLoc);
   gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
   gl.enableVertexAttribArray(uvLoc);
   gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);
   gl.viewport(0, 0, outW, outH);

   const imageTexture = loadBitmapTexture(gl, img);

   const preset = getPreset(media.filterPreset);
   const curvesTexture = createCurveTexture(gl, preset.curves);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, imageTexture);
   gl.activeTexture(gl.TEXTURE1);
   gl.bindTexture(gl.TEXTURE_2D, curvesTexture);

   const u = (name: string) => gl.getUniformLocation(program, name);
   gl.uniform1i(u('u_image'), 0);
   gl.uniform1i(u('u_curves'), 1);
   gl.uniform1f(u('u_presetActive'), media.filterPreset === 'Original' ? 0.0 : 1.0);
   gl.uniform1f(u('u_pBrightness'), preset.brightness);
   gl.uniform1f(u('u_pContrast'), preset.contrast);
   gl.uniform1f(u('u_pSaturation'), preset.saturation);
   gl.uniform4fv(u('u_pShadowTint'), preset.shadowTint);
   gl.uniform4fv(u('u_pHighlightTint'), preset.highlightTint);
   gl.uniform4fv(u('u_pFade'), preset.fade);
   gl.uniform3fv(u('u_pColorBalance'), preset.colorBalance);
   gl.uniform1f(u('u_pVignette'), preset.vignette);
   gl.uniform1f(u('u_filterStrength'), media.filterStrength / 100);

   const adj = media.adjustments;
   gl.uniform1f(u('u_brightness'), adj.brightness / 100);
   gl.uniform1f(u('u_contrast'), 1 + adj.contrast / 100);
   gl.uniform1f(u('u_saturation'), 1 + adj.saturation / 100);
   gl.uniform1f(u('u_temperature'), adj.temperature / 100);
   gl.uniform1f(u('u_fade'), adj.fade / 100);
   gl.uniform1f(u('u_vignette'), adj.vignette / 100);

   gl.drawArrays(gl.TRIANGLES, 0, 6);

   gl.deleteTexture(imageTexture);
   gl.deleteTexture(curvesTexture);
   gl.deleteProgram(program);

   return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
}
