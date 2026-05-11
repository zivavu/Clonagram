import { useEffect, useRef, useState } from 'react';
import {
   createCurveTexture,
   createProgram,
   FRAGMENT_SHADER,
   getPreset,
   loadTexture,
   VERTEX_SHADER,
} from '@/src/utils/filterShader';

const THUMB_SIZE = 176;

interface ThumbnailLocs {
   u_image: WebGLUniformLocation | null;
   u_curves: WebGLUniformLocation | null;
   u_pBrightness: WebGLUniformLocation | null;
   u_pContrast: WebGLUniformLocation | null;
   u_pSaturation: WebGLUniformLocation | null;
   u_pShadowTint: WebGLUniformLocation | null;
   u_pHighlightTint: WebGLUniformLocation | null;
   u_pFade: WebGLUniformLocation | null;
   u_pColorBalance: WebGLUniformLocation | null;
   u_pVignette: WebGLUniformLocation | null;
   u_brightness: WebGLUniformLocation | null;
   u_contrast: WebGLUniformLocation | null;
   u_saturation: WebGLUniformLocation | null;
   u_temperature: WebGLUniformLocation | null;
   u_fade: WebGLUniformLocation | null;
   u_vignette: WebGLUniformLocation | null;
}

function setupThumbnailGL(gl: WebGL2RenderingContext): { program: WebGLProgram; locs: ThumbnailLocs } | null {
   const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
   if (!program) return null;

   // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
   gl.useProgram(program);

   const positions = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1]);

   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

   const positionLoc = gl.getAttribLocation(program, 'a_position');
   const texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');

   gl.enableVertexAttribArray(positionLoc);
   gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
   gl.enableVertexAttribArray(texCoordLoc);
   gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

   const locs: ThumbnailLocs = {
      u_image: gl.getUniformLocation(program, 'u_image'),
      u_curves: gl.getUniformLocation(program, 'u_curves'),
      u_pBrightness: gl.getUniformLocation(program, 'u_pBrightness'),
      u_pContrast: gl.getUniformLocation(program, 'u_pContrast'),
      u_pSaturation: gl.getUniformLocation(program, 'u_pSaturation'),
      u_pShadowTint: gl.getUniformLocation(program, 'u_pShadowTint'),
      u_pHighlightTint: gl.getUniformLocation(program, 'u_pHighlightTint'),
      u_pFade: gl.getUniformLocation(program, 'u_pFade'),
      u_pColorBalance: gl.getUniformLocation(program, 'u_pColorBalance'),
      u_pVignette: gl.getUniformLocation(program, 'u_pVignette'),
      u_brightness: gl.getUniformLocation(program, 'u_brightness'),
      u_contrast: gl.getUniformLocation(program, 'u_contrast'),
      u_saturation: gl.getUniformLocation(program, 'u_saturation'),
      u_temperature: gl.getUniformLocation(program, 'u_temperature'),
      u_fade: gl.getUniformLocation(program, 'u_fade'),
      u_vignette: gl.getUniformLocation(program, 'u_vignette'),
   };

   return { program, locs };
}

function renderPreset(
   gl: WebGL2RenderingContext,
   locs: ThumbnailLocs,
   imageTexture: WebGLTexture,
   curvesTexture: WebGLTexture,
   presetName: string,
): void {
   const preset = getPreset(presetName);

   gl.viewport(0, 0, THUMB_SIZE, THUMB_SIZE);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, imageTexture);
   if (locs.u_image) gl.uniform1i(locs.u_image, 0);

   gl.activeTexture(gl.TEXTURE1);
   gl.bindTexture(gl.TEXTURE_2D, curvesTexture);
   if (locs.u_curves) gl.uniform1i(locs.u_curves, 1);

   if (locs.u_pBrightness) gl.uniform1f(locs.u_pBrightness, preset.brightness);
   if (locs.u_pContrast) gl.uniform1f(locs.u_pContrast, preset.contrast);
   if (locs.u_pSaturation) gl.uniform1f(locs.u_pSaturation, preset.saturation);
   if (locs.u_pShadowTint) gl.uniform4fv(locs.u_pShadowTint, preset.shadowTint);
   if (locs.u_pHighlightTint) gl.uniform4fv(locs.u_pHighlightTint, preset.highlightTint);
   if (locs.u_pFade) gl.uniform4fv(locs.u_pFade, preset.fade);
   if (locs.u_pColorBalance) gl.uniform3fv(locs.u_pColorBalance, preset.colorBalance);
   if (locs.u_pVignette) gl.uniform1f(locs.u_pVignette, preset.vignette);

   if (locs.u_brightness) gl.uniform1f(locs.u_brightness, 0);
   if (locs.u_contrast) gl.uniform1f(locs.u_contrast, 1);
   if (locs.u_saturation) gl.uniform1f(locs.u_saturation, 1);
   if (locs.u_temperature) gl.uniform1f(locs.u_temperature, 0);
   if (locs.u_fade) gl.uniform1f(locs.u_fade, 0);
   if (locs.u_vignette) gl.uniform1f(locs.u_vignette, 0);

   gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
   return new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.85);
   });
}

export function useFilterThumbnails(src: string, presetNames: string[]): Record<string, string> {
   const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
   const prevUrlsRef = useRef<string[]>([]);

   useEffect(() => {
      for (const url of prevUrlsRef.current) {
         URL.revokeObjectURL(url);
      }
      prevUrlsRef.current = [];
      setThumbnails({});

      if (!src) return;

      const canvas = document.createElement('canvas');
      canvas.width = THUMB_SIZE;
      canvas.height = THUMB_SIZE;

      const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
      if (!gl) return;

      const setup = setupThumbnailGL(gl);
      if (!setup) return;
      const { program, locs } = setup;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
         const imageTexture = loadTexture(gl, img);
         const newThumbnails: Record<string, string> = {};
         const newUrls: string[] = [];

         for (const name of presetNames) {
            const preset = getPreset(name);
            const curvesTexture = createCurveTexture(gl, preset.curves);
            renderPreset(gl, locs, imageTexture, curvesTexture, name);
            gl.deleteTexture(curvesTexture);

            const blob = await canvasToBlob(canvas);
            if (blob) {
               const url = URL.createObjectURL(blob);
               newThumbnails[name] = url;
               newUrls.push(url);
            }
         }

         gl.deleteTexture(imageTexture);
         gl.deleteProgram(program);

         prevUrlsRef.current = newUrls;
         setThumbnails(newThumbnails);
      };
      img.onerror = () => {
         console.error('Failed to load image for filter thumbnails:', src);
      };
      img.src = src;

      return () => {};
   }, [src, presetNames]);

   return thumbnails;
}
