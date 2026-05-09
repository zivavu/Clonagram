import { useEffect, useRef, useState } from 'react';
import {
   createProgram,
   FRAGMENT_SHADER,
   IDENTITY_MATRIX,
   loadTexture,
   PRESET_MATRICES,
   VERTEX_SHADER,
} from '@/src/utils/filterShader';

const THUMB_SIZE = 176;

function setupThumbnailGL(gl: WebGL2RenderingContext): WebGLProgram | null {
   const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
   if (!program) return null;

   gl.useProgram(program);

   const positions = new Float32Array([
      -1, -1, 0, 0,
      1, -1, 1, 0,
      -1, 1, 0, 1,
      -1, 1, 0, 1,
      1, -1, 1, 0,
      1, 1, 1, 1,
   ]);

   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

   const positionLoc = gl.getAttribLocation(program, 'a_position');
   const texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');

   gl.enableVertexAttribArray(positionLoc);
   gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
   gl.enableVertexAttribArray(texCoordLoc);
   gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

   return program;
}

function renderPreset(
   gl: WebGL2RenderingContext,
   program: WebGLProgram,
   texture: WebGLTexture,
   presetName: string,
): void {
   gl.viewport(0, 0, THUMB_SIZE, THUMB_SIZE);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);

   gl.uniform1f(gl.getUniformLocation(program, 'u_brightness'), 0);
   gl.uniform1f(gl.getUniformLocation(program, 'u_contrast'), 1);
   gl.uniform1f(gl.getUniformLocation(program, 'u_saturation'), 1);
   gl.uniform1f(gl.getUniformLocation(program, 'u_temperature'), 0);
   gl.uniform1f(gl.getUniformLocation(program, 'u_fade'), 0);
   gl.uniform1f(gl.getUniformLocation(program, 'u_vignette'), 0);

   const matrix = PRESET_MATRICES[presetName] || IDENTITY_MATRIX;
   gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_colorMatrix'), false, matrix);

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

      const program = setupThumbnailGL(gl);
      if (!program) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
         const texture = loadTexture(gl, img);
         const newThumbnails: Record<string, string> = {};
         const newUrls: string[] = [];

         for (const name of presetNames) {
            renderPreset(gl, program, texture, name);
            const blob = await canvasToBlob(canvas);
            if (blob) {
               const url = URL.createObjectURL(blob);
               newThumbnails[name] = url;
               newUrls.push(url);
            }
         }

         gl.deleteTexture(texture);
         gl.deleteProgram(program);

         prevUrlsRef.current = newUrls;
         setThumbnails(newThumbnails);
      };
      img.onerror = () => {
         console.error('Failed to load image for filter thumbnails:', src);
      };
      img.src = src;

      return () => {
         // cleanup handled by the next effect run
      };
   }, [src, presetNames]);

   return thumbnails;
}
