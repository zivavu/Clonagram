import { useEffect, useRef, useState } from 'react';
import {
   createCurveTexture,
   createProgram,
   type FilterUniformLocations,
   FRAGMENT_SHADER,
   getFilterUniformLocations,
   getPreset,
   loadTexture,
   setAdjustmentUniforms,
   setPresetUniforms,
   VERTEX_SHADER,
} from '@/src/utils/filterShader';
import { DEFAULT_ADJUSTMENTS } from '../types';

const THUMB_SIZE = 176;

function coverUVs(naturalW: number, naturalH: number) {
   const imgAspect = naturalW / naturalH;
   const halfU = imgAspect >= 1 ? 0.5 / imgAspect : 0.5;
   const halfV = imgAspect >= 1 ? 0.5 : imgAspect * 0.5;
   const u0 = 0.5 - halfU;
   const u1 = 0.5 + halfU;
   const v0 = 0.5 - halfV;
   const v1 = 0.5 + halfV;
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

function setupThumbnailGL(
   gl: WebGL2RenderingContext,
): { program: WebGLProgram; locs: FilterUniformLocations; buffer: WebGLBuffer } | null {
   const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
   if (!program) return null;

   // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
   gl.useProgram(program);

   const buffer = gl.createBuffer();
   if (!buffer) return null;
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

   const positionLoc = gl.getAttribLocation(program, 'a_position');
   const texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');

   gl.enableVertexAttribArray(positionLoc);
   gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
   gl.enableVertexAttribArray(texCoordLoc);
   gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

   return { program, locs: getFilterUniformLocations(gl, program), buffer };
}

function renderPreset(
   gl: WebGL2RenderingContext,
   locs: FilterUniformLocations,
   imageTexture: WebGLTexture,
   curvesTexture: WebGLTexture,
   presetName: string,
): void {
   gl.viewport(0, 0, THUMB_SIZE, THUMB_SIZE);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, imageTexture);
   gl.uniform1i(locs.u_image, 0);

   gl.activeTexture(gl.TEXTURE1);
   gl.bindTexture(gl.TEXTURE_2D, curvesTexture);
   gl.uniform1i(locs.u_curves, 1);

   setPresetUniforms(gl, locs, presetName, 1);
   setAdjustmentUniforms(gl, locs, DEFAULT_ADJUSTMENTS);

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
      const { program, locs, buffer } = setup;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.bufferData(
            gl.ARRAY_BUFFER,
            coverUVs(img.naturalWidth, img.naturalHeight),
            gl.STATIC_DRAW,
         );
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
      img.onerror = () => {};
      img.src = src;

      return () => {};
   }, [src, presetNames]);

   return thumbnails;
}
