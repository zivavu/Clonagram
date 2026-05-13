import { useCallback, useEffect, useRef } from 'react';
import type { Adjustments } from '../components/CreatePostModal/types';
import {
   createCurveTexture,
   createProgram,
   FRAGMENT_SHADER,
   getPreset,
   loadTexture,
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
   filterStrength: number;
}

const PRESET_UNIFORMS = [
   'u_presetActive',
   'u_pBrightness',
   'u_pContrast',
   'u_pSaturation',
   'u_pShadowTint',
   'u_pHighlightTint',
   'u_pFade',
   'u_pColorBalance',
   'u_pVignette',
   'u_filterStrength',
] as const;

const USER_UNIFORMS = [
   'u_brightness',
   'u_contrast',
   'u_saturation',
   'u_temperature',
   'u_fade',
   'u_vignette',
] as const;

export function useWebGLFilter(params: WebGLFilterParams): WebGLFilterResult {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const glRef = useRef<WebGL2RenderingContext | null>(null);
   const programRef = useRef<WebGLProgram | null>(null);
   const textureRef = useRef<WebGLTexture | null>(null);
   const curvesTextureRef = useRef<WebGLTexture | null>(null);
   const presetRef = useRef<string>('');
   const uniformLocsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
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
      if (!gl || !program || !texture || !curvesTexture) return;

      // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (locs.u_image) gl.uniform1i(locs.u_image, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curvesTexture);
      if (locs.u_curves) gl.uniform1i(locs.u_curves, 1);

      // Preset uniforms
      const preset = getPreset(filterPresetRef.current);
      if (locs.u_presetActive)
         gl.uniform1f(locs.u_presetActive, filterPresetRef.current === 'Original' ? 0.0 : 1.0);
      if (locs.u_pBrightness) gl.uniform1f(locs.u_pBrightness, preset.brightness);
      if (locs.u_pContrast) gl.uniform1f(locs.u_pContrast, preset.contrast);
      if (locs.u_pSaturation) gl.uniform1f(locs.u_pSaturation, preset.saturation);
      if (locs.u_pShadowTint) gl.uniform4fv(locs.u_pShadowTint, preset.shadowTint);
      if (locs.u_pHighlightTint) gl.uniform4fv(locs.u_pHighlightTint, preset.highlightTint);
      if (locs.u_pFade) gl.uniform4fv(locs.u_pFade, preset.fade);
      if (locs.u_pColorBalance) gl.uniform3fv(locs.u_pColorBalance, preset.colorBalance);
      if (locs.u_pVignette) gl.uniform1f(locs.u_pVignette, preset.vignette);
      if (locs.u_filterStrength)
         gl.uniform1f(locs.u_filterStrength, filterStrengthRef.current / 100);

      // User adjustment uniforms
      const adj = adjustmentsRef.current;
      if (locs.u_brightness) gl.uniform1f(locs.u_brightness, adj.brightness / 100);
      if (locs.u_contrast) gl.uniform1f(locs.u_contrast, 1 + adj.contrast / 100);
      if (locs.u_saturation) gl.uniform1f(locs.u_saturation, 1 + adj.saturation / 100);
      if (locs.u_temperature) gl.uniform1f(locs.u_temperature, adj.temperature / 100);
      if (locs.u_fade) gl.uniform1f(locs.u_fade, adj.fade / 100);
      if (locs.u_vignette) gl.uniform1f(locs.u_vignette, adj.vignette / 100);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }, []);

   // Initialize WebGL
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

      const locs: Record<string, WebGLUniformLocation | null> = {
         u_image: gl.getUniformLocation(program, 'u_image'),
         u_curves: gl.getUniformLocation(program, 'u_curves'),
      };
      for (const name of PRESET_UNIFORMS) locs[name] = gl.getUniformLocation(program, name);
      for (const name of USER_UNIFORMS) locs[name] = gl.getUniformLocation(program, name);
      uniformLocsRef.current = locs;

      return () => {
         if (textureRef.current) gl.deleteTexture(textureRef.current);
         if (curvesTextureRef.current) gl.deleteTexture(curvesTextureRef.current);
         if (program) gl.deleteProgram(program);
         glRef.current = null;
         programRef.current = null;
         textureRef.current = null;
         curvesTextureRef.current = null;
         uniformLocsRef.current = {};
      };
   }, []);

   // Load image
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

   // Update curve texture when preset changes
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

   // Update canvas size
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
      // Re-render when adjustments or filter strength change
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
