import type { AspectRatio, PostMedia } from '../components/CreatePostModal/types';
import {
   createCurveTexture,
   createProgram,
   FRAGMENT_SHADER,
   getFilterUniformLocations,
   getPreset,
   setAdjustmentUniforms,
   setPresetUniforms,
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
   const v0 = 0.5 - halfV + panV;
   const v1 = 0.5 + halfV + panV;

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

export async function bakeImage(
   media: PostMedia,
   aspectRatio: AspectRatio,
): Promise<{ blob: Blob; width: number; height: number; blurDataURL?: string }> {
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

   const locs = getFilterUniformLocations(gl, program);
   gl.uniform1i(locs.u_image, 0);
   gl.uniform1i(locs.u_curves, 1);
   setPresetUniforms(gl, locs, media.filterPreset, media.filterStrength / 100);
   setAdjustmentUniforms(gl, locs, media.adjustments);

   gl.drawArrays(gl.TRIANGLES, 0, 6);

   gl.deleteTexture(imageTexture);
   gl.deleteTexture(curvesTexture);
   gl.deleteProgram(program);

   const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.75 });

   const blurW = outW >= outH ? 16 : Math.max(1, Math.round((16 * outW) / outH));
   const blurH = outH >= outW ? 16 : Math.max(1, Math.round((16 * outH) / outW));
   const blurCanvas = new OffscreenCanvas(blurW, blurH);
   const blurCtx = blurCanvas.getContext('2d');
   if (!blurCtx) throw new Error('Failed to create 2D context for blur');
   const fullBitmap = await createImageBitmap(canvas);
   blurCtx.drawImage(fullBitmap, 0, 0, blurW, blurH);
   fullBitmap.close();
   const blurBlob = await blurCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.5 });
   const blurBuffer = await blurBlob.arrayBuffer();
   const bytes = new Uint8Array(blurBuffer);
   let binary = '';
   for (const byte of bytes) binary += String.fromCharCode(byte);
   const blurDataURL = `data:image/jpeg;base64,${btoa(binary)}`;

   return { blob, blurDataURL, width: outW, height: outH };
}
