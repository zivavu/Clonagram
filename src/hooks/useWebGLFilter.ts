import { useCallback, useEffect, useRef } from 'react';
import type { Adjustments } from '../components/CreatePostModal/types';
import {
   createProgram,
   FRAGMENT_SHADER,
   IDENTITY_MATRIX,
   loadTexture,
   PRESET_MATRICES,
   VERTEX_SHADER,
} from '../utils/filterShader';

export interface WebGLFilterResult {
   canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

interface WebGLFilterParams {
   src: string;
   width: number;
   height: number;
   adjustments: Adjustments;
   filterPreset: string;
}

export function useWebGLFilter(params: WebGLFilterParams): WebGLFilterResult {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const glRef = useRef<WebGL2RenderingContext | null>(null);
   const programRef = useRef<WebGLProgram | null>(null);
   const textureRef = useRef<WebGLTexture | null>(null);
   const uniformLocsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
   const adjustmentsRef = useRef(params.adjustments);
   const presetRef = useRef(params.filterPreset);

   // Keep refs in sync with props
   adjustmentsRef.current = params.adjustments;
   presetRef.current = params.filterPreset;

   const render = useCallback(() => {
      const gl = glRef.current;
      const program = programRef.current;
      const texture = textureRef.current;
      const locs = uniformLocsRef.current;
      if (!gl || !program || !texture) return;

      gl.useProgram(program);

      // Bind texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (locs.u_image) gl.uniform1i(locs.u_image, 0);

      const adj = adjustmentsRef.current;
      if (locs.u_brightness) gl.uniform1f(locs.u_brightness, adj.brightness / 100);
      if (locs.u_contrast) gl.uniform1f(locs.u_contrast, 1 + adj.contrast / 100);
      if (locs.u_saturation) gl.uniform1f(locs.u_saturation, 1 + adj.saturation / 100);
      if (locs.u_temperature) gl.uniform1f(locs.u_temperature, adj.temperature / 100);
      if (locs.u_fade) gl.uniform1f(locs.u_fade, adj.fade / 100);
      if (locs.u_vignette) gl.uniform1f(locs.u_vignette, adj.vignette / 100);

      const matrix = PRESET_MATRICES[presetRef.current] || IDENTITY_MATRIX;
      if (locs.u_colorMatrix) gl.uniformMatrix4fv(locs.u_colorMatrix, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }, []);

   // Initialize WebGL context and program
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
      if (!gl) {
         console.error('WebGL2 not supported');
         return;
      }

      glRef.current = gl;

      const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      if (!program) return;

      programRef.current = program;
      gl.useProgram(program);

      // Create fullscreen quad
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

      // Cache uniform locations
      uniformLocsRef.current = {
         u_image: gl.getUniformLocation(program, 'u_image'),
         u_brightness: gl.getUniformLocation(program, 'u_brightness'),
         u_contrast: gl.getUniformLocation(program, 'u_contrast'),
         u_saturation: gl.getUniformLocation(program, 'u_saturation'),
         u_temperature: gl.getUniformLocation(program, 'u_temperature'),
         u_fade: gl.getUniformLocation(program, 'u_fade'),
         u_vignette: gl.getUniformLocation(program, 'u_vignette'),
         u_colorMatrix: gl.getUniformLocation(program, 'u_colorMatrix'),
      };

      return () => {
         if (textureRef.current) gl.deleteTexture(textureRef.current);
         if (program) gl.deleteProgram(program);
         glRef.current = null;
         programRef.current = null;
         textureRef.current = null;
         uniformLocsRef.current = {};
      };
   }, []);

   // Load image when src changes
   useEffect(() => {
      const gl = glRef.current;
      if (!gl) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
         if (textureRef.current) gl.deleteTexture(textureRef.current);
         textureRef.current = loadTexture(gl, img);
         render();
      };
      img.onerror = () => {
         console.error('Failed to load image for WebGL filter:', params.src);
      };
      img.src = params.src;
   }, [params.src, render]);

   // Update canvas size when dimensions change
   useEffect(() => {
      const canvas = canvasRef.current;
      const gl = glRef.current;
      if (!canvas || !gl) return;
      if (params.width === 0 || params.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = params.width * dpr;
      canvas.height = params.height * dpr;
      canvas.style.width = `${params.width}px`;
      canvas.style.height = `${params.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      render();
   }, [params.width, params.height, render]);

   // Re-render when adjustments or preset change
   useEffect(() => {
      if (glRef.current && textureRef.current) {
         render();
      }
   }, [
      params.adjustments.brightness,
      params.adjustments.contrast,
      params.adjustments.fade,
      params.adjustments.saturation,
      params.adjustments.temperature,
      params.adjustments.vignette,
      params.filterPreset,
      render,
   ]);

   return { canvasRef };
}
