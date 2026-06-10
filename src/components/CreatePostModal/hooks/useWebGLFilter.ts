import { useCallback, useEffect, useRef } from 'react';
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
import type { Adjustments } from '../types';

export interface WebGLFilterResult {
   canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

interface WebGLFilterParams {
   src: string;
   width: number;
   height: number;
   adjustments: Adjustments;
   filterPreset: string;
   filterStrength: number;
}

export function useWebGLFilter(params: WebGLFilterParams): WebGLFilterResult {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const glRef = useRef<WebGL2RenderingContext | null>(null);
   const programRef = useRef<WebGLProgram | null>(null);
   const textureRef = useRef<WebGLTexture | null>(null);
   const curvesTextureRef = useRef<WebGLTexture | null>(null);
   const presetRef = useRef<string>('');
   const uniformLocsRef = useRef<FilterUniformLocations | null>(null);
   const adjustmentsRef = useRef(params.adjustments);
   const filterPresetRef = useRef(params.filterPreset);
   const filterStrengthRef = useRef(params.filterStrength);

   adjustmentsRef.current = params.adjustments;
   filterPresetRef.current = params.filterPreset;
   filterStrengthRef.current = params.filterStrength;

   const render = useCallback(() => {
      const gl = glRef.current;
      const program = programRef.current;
      const texture = textureRef.current;
      const curvesTexture = curvesTextureRef.current;
      const locs = uniformLocsRef.current;
      if (!gl || !program || !texture || !curvesTexture || !locs) return;

      // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(locs.u_image, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curvesTexture);
      gl.uniform1i(locs.u_curves, 1);

      setPresetUniforms(gl, locs, filterPresetRef.current, filterStrengthRef.current / 100);
      setAdjustmentUniforms(gl, locs, adjustmentsRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
      if (!gl) {
         // biome-ignore lint/suspicious/noConsole: legitimate error logging for unsupported WebGL2
         console.error('WebGL2 not supported');
         return;
      }

      glRef.current = gl;

      const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      if (!program) return;

      programRef.current = program;
      // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
      gl.useProgram(program);

      const positions = new Float32Array([
         -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
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

      uniformLocsRef.current = getFilterUniformLocations(gl, program);

      return () => {
         if (textureRef.current) gl.deleteTexture(textureRef.current);
         if (curvesTextureRef.current) gl.deleteTexture(curvesTextureRef.current);
         if (program) gl.deleteProgram(program);
         glRef.current = null;
         programRef.current = null;
         textureRef.current = null;
         curvesTextureRef.current = null;
         uniformLocsRef.current = null;
      };
   }, []);

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
         // biome-ignore lint/suspicious/noConsole: legitimate error logging for image load failure
         console.error('Failed to load image for WebGL filter:', params.src);
      };
      img.src = params.src;
   }, [params.src, render]);

   useEffect(() => {
      const gl = glRef.current;
      if (!gl) return;
      if (params.filterPreset === presetRef.current && curvesTextureRef.current) return;

      const preset = getPreset(params.filterPreset);
      if (curvesTextureRef.current) gl.deleteTexture(curvesTextureRef.current);
      curvesTextureRef.current = createCurveTexture(gl, preset.curves);
      presetRef.current = params.filterPreset;

      render();
   }, [params.filterPreset, render]);

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

   // biome-ignore lint/correctness/useExhaustiveDependencies: individual adjustment values are needed to trigger re-renders
   useEffect(() => {
      if (glRef.current && textureRef.current && curvesTextureRef.current) {
         render();
      }
   }, [
      params.adjustments.brightness,
      params.adjustments.contrast,
      params.adjustments.fade,
      params.adjustments.saturation,
      params.adjustments.temperature,
      params.adjustments.vignette,
      params.filterStrength,
      render,
   ]);

   return { canvasRef };
}
