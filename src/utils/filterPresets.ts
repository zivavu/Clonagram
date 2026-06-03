export type CurvePoints = [number, number][];

export interface CurveSet {
   r: Float32Array;
   g: Float32Array;
   b: Float32Array;
}

function interpolate(p1: [number, number], p2: [number, number], x: number) {
   const t = (x - p1[0]) / (p2[0] - p1[0]);
   const smoothT = t * t * (3.0 - 2.0 * t);
   return p1[1] + smoothT * (p2[1] - p1[1]);
}

export function buildCurve(points: CurvePoints) {
   const curve = new Float32Array(256);
   for (let i = 0; i < 256; i++) {
      const x = i / 255;
      let value = x;
      for (let j = 0; j < points.length - 1; j++) {
         if (x >= points[j][0] && x <= points[j + 1][0]) {
            value = interpolate(points[j], points[j + 1], x);
            break;
         }
      }
      curve[i] = Math.max(0, Math.min(1, value));
   }
   return curve;
}

export function buildCurveSet(r: CurvePoints, g: CurvePoints, b: CurvePoints): CurveSet {
   return { r: buildCurve(r), g: buildCurve(g), b: buildCurve(b) };
}

const ID: CurvePoints = [
   [0, 0],
   [1, 1],
];
const IDENTITY_CURVES = buildCurveSet(ID, ID, ID);

export interface FilterPreset {
   curves: CurveSet;
   brightness: number;
   contrast: number;
   saturation: number;
   shadowTint: [number, number, number, number];
   highlightTint: [number, number, number, number];
   fade: [number, number, number, number];
   colorBalance: [number, number, number];
   vignette: number;
}

export const PRESETS: Record<string, FilterPreset> = {
   Original: {
      curves: IDENTITY_CURVES,
      brightness: 0,
      contrast: 1,
      saturation: 1,
      shadowTint: [0, 0, 0, 0],
      highlightTint: [0, 0, 0, 0],
      fade: [0, 0, 0, 0],
      colorBalance: [0, 0, 0],
      vignette: 0,
   },

   Clarendon: {
      curves: buildCurveSet(
         [
            [0, 0],
            [0.35, 0.28],
            [0.65, 0.74],
            [1, 1],
         ],
         [
            [0, 0],
            [0.35, 0.3],
            [0.65, 0.74],
            [1, 1],
         ],
         [
            [0, 0.02],
            [0.35, 0.34],
            [0.65, 0.78],
            [1, 1],
         ],
      ),
      brightness: 0.01,
      contrast: 1.1,
      saturation: 1.18,
      shadowTint: [0.12, 0.22, 0.36, 0.14],
      highlightTint: [0.6, 0.82, 0.96, 0.18],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.0, 0.03],
      vignette: 0,
   },

   Gingham: {
      curves: buildCurveSet(
         [
            [0, 0.07],
            [0.5, 0.52],
            [1, 0.95],
         ],
         [
            [0, 0.07],
            [0.5, 0.51],
            [1, 0.93],
         ],
         [
            [0, 0.09],
            [0.5, 0.53],
            [1, 0.9],
         ],
      ),
      brightness: 0,
      contrast: 0.95,
      saturation: 0.84,
      shadowTint: [0.96, 0.88, 0.72, 0.18],
      highlightTint: [1.0, 0.96, 0.88, 0.1],
      fade: [0.93, 0.89, 0.76, 0.06],
      colorBalance: [0.01, 0.0, -0.01],
      vignette: 0.03,
   },

   Moon: {
      curves: buildCurveSet(
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
         [
            [0, 0],
            [0.25, 0.18],
            [0.5, 0.5],
            [0.75, 0.82],
            [1, 1],
         ],
      ),
      brightness: 0,
      contrast: 1.1,
      saturation: 0,
      shadowTint: [0.1, 0.12, 0.17, 0.14],
      highlightTint: [0.94, 0.96, 1.0, 0.1],
      fade: [0, 0, 0, 0],
      colorBalance: [0, 0, 0],
      vignette: 0.08,
   },

   Lark: {
      curves: buildCurveSet(
         [
            [0, 0.02],
            [0.5, 0.48],
            [1, 0.96],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
         [
            [0, 0.03],
            [0.5, 0.55],
            [1, 1.0],
         ],
      ),
      brightness: 0.03,
      contrast: 1.04,
      saturation: 0.92,
      shadowTint: [0.5, 0.64, 0.75, 0.12],
      highlightTint: [0.8, 0.94, 1.0, 0.16],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.0, 0.02],
      vignette: 0,
   },

   Reyes: {
      curves: buildCurveSet(
         [
            [0, 0.16],
            [0.5, 0.58],
            [1, 0.96],
         ],
         [
            [0, 0.14],
            [0.5, 0.56],
            [1, 0.94],
         ],
         [
            [0, 0.12],
            [0.5, 0.52],
            [1, 0.89],
         ],
      ),
      brightness: 0.04,
      contrast: 0.88,
      saturation: 0.76,
      shadowTint: [0.96, 0.84, 0.74, 0.2],
      highlightTint: [1.0, 0.94, 0.82, 0.12],
      fade: [0.94, 0.88, 0.78, 0.12],
      colorBalance: [0.02, 0.01, -0.01],
      vignette: 0,
   },

   Juno: {
      curves: buildCurveSet(
         [
            [0, 0.01],
            [0.5, 0.55],
            [1, 1.0],
         ],
         [
            [0, 0],
            [0.5, 0.52],
            [1, 0.98],
         ],
         [
            [0, 0],
            [0.5, 0.46],
            [1, 0.94],
         ],
      ),
      brightness: 0.01,
      contrast: 1.08,
      saturation: 1.18,
      shadowTint: [0.42, 0.3, 0.2, 0.14],
      highlightTint: [1.0, 0.9, 0.6, 0.16],
      fade: [0, 0, 0, 0],
      colorBalance: [0.03, 0.0, -0.02],
      vignette: 0,
   },

   Aden: {
      curves: buildCurveSet(
         [
            [0, 0.08],
            [0.5, 0.52],
            [1, 0.95],
         ],
         [
            [0, 0.08],
            [0.5, 0.52],
            [1, 0.94],
         ],
         [
            [0, 0.06],
            [0.5, 0.5],
            [1, 0.91],
         ],
      ),
      brightness: 0.01,
      contrast: 0.94,
      saturation: 0.84,
      shadowTint: [1.0, 0.76, 0.8, 0.16],
      highlightTint: [1.0, 0.94, 0.88, 0.1],
      fade: [1.0, 0.9, 0.88, 0.08],
      colorBalance: [0.01, -0.01, 0.0],
      vignette: 0,
   },

   Perpetua: {
      curves: buildCurveSet(
         [
            [0, 0.01],
            [0.5, 0.48],
            [1, 0.96],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
         [
            [0, 0.03],
            [0.5, 0.54],
            [1, 1.0],
         ],
      ),
      brightness: 0.02,
      contrast: 1.05,
      saturation: 1.05,
      shadowTint: [0.24, 0.5, 0.52, 0.14],
      highlightTint: [0.8, 0.98, 0.92, 0.14],
      fade: [0, 0, 0, 0],
      colorBalance: [-0.01, 0.01, 0.02],
      vignette: 0,
   },

   Crema: {
      curves: buildCurveSet(
         [
            [0, 0.06],
            [0.5, 0.52],
            [1, 0.96],
         ],
         [
            [0, 0.06],
            [0.5, 0.51],
            [1, 0.94],
         ],
         [
            [0, 0.04],
            [0.5, 0.48],
            [1, 0.9],
         ],
      ),
      brightness: 0.01,
      contrast: 1.0,
      saturation: 0.87,
      shadowTint: [0.52, 0.4, 0.36, 0.14],
      highlightTint: [1.0, 0.94, 0.84, 0.18],
      fade: [0.96, 0.92, 0.82, 0.08],
      colorBalance: [0.02, 0.0, -0.01],
      vignette: 0,
   },

   Ludwig: {
      curves: buildCurveSet(
         [
            [0, 0.03],
            [0.35, 0.3],
            [0.65, 0.72],
            [1, 1.0],
         ],
         [
            [0, 0.02],
            [0.5, 0.5],
            [1, 0.96],
         ],
         [
            [0, 0.01],
            [0.5, 0.47],
            [1, 0.92],
         ],
      ),
      brightness: 0,
      contrast: 1.08,
      saturation: 0.9,
      shadowTint: [0.52, 0.38, 0.26, 0.18],
      highlightTint: [1.0, 0.92, 0.78, 0.12],
      fade: [0, 0, 0, 0],
      colorBalance: [0.02, 0.0, -0.02],
      vignette: 0.08,
   },

   Slumber: {
      curves: buildCurveSet(
         [
            [0, 0.08],
            [0.5, 0.54],
            [1, 0.95],
         ],
         [
            [0, 0.1],
            [0.5, 0.55],
            [1, 0.94],
         ],
         [
            [0, 0.06],
            [0.5, 0.49],
            [1, 0.88],
         ],
      ),
      brightness: 0.02,
      contrast: 0.92,
      saturation: 0.78,
      shadowTint: [0.82, 0.8, 0.55, 0.2],
      highlightTint: [1.0, 0.96, 0.8, 0.14],
      fade: [0.92, 0.92, 0.72, 0.12],
      colorBalance: [0.01, 0.01, -0.03],
      vignette: 0.02,
   },
};

export function getPreset(name: string): FilterPreset {
   return PRESETS[name] ?? PRESETS.Original;
}
