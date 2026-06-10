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

function brightnessCurveSet(scale: number): CurveSet {
   const curve = new Float32Array(256);
   for (let i = 0; i < 256; i++) {
      curve[i] = Math.min(1, (i / 255) * scale);
   }
   return { r: curve, g: curve, b: curve };
}

const IDENTITY_CURVES = brightnessCurveSet(1);

export type BlendMode =
   | 'none'
   | 'soft-light'
   | 'overlay'
   | 'multiply'
   | 'darken'
   | 'lighten'
   | 'screen';

export const BLEND_MODE_VALUES: Record<BlendMode, number> = {
   none: 0,
   'soft-light': 1,
   overlay: 2,
   multiply: 3,
   darken: 4,
   lighten: 5,
   screen: 6,
};

export type TintColor = [number, number, number, number];

export interface FilterPreset {
   curves: CurveSet;
   brightness?: number;
   contrast?: number;
   saturation?: number;
   sepia?: number;
   hue?: number;
   shadowTint?: TintColor;
   highlightTint?: TintColor;
   fade?: TintColor;
   colorBalance?: [number, number, number];
   vignette?: number;
   blendMode?: BlendMode;
   blendTop?: TintColor;
   blendBottom?: TintColor;
}

export const PRESETS: Record<string, FilterPreset> = {
   Original: {
      curves: IDENTITY_CURVES,
   },

   Clarendon: {
      curves: IDENTITY_CURVES,
      contrast: 1.2,
      saturation: 1.35,
      blendMode: 'overlay',
      blendTop: [0.498, 0.733, 0.89, 0.2],
   },

   Gingham: {
      curves: brightnessCurveSet(1.05),
      contrast: 0.93,
      saturation: 0.92,
      hue: -2,
      blendMode: 'soft-light',
      blendTop: [0.902, 0.902, 0.98, 1],
   },

   Moon: {
      curves: brightnessCurveSet(1.1),
      contrast: 1.1,
      saturation: 0,
      blendMode: 'soft-light',
      blendTop: [0.627, 0.627, 0.627, 1],
   },

   Lark: {
      curves: brightnessCurveSet(1.08),
      contrast: 0.9,
      saturation: 1.1,
      blendMode: 'darken',
      blendTop: [0.949, 0.949, 0.949, 0.55],
   },

   Reyes: {
      curves: brightnessCurveSet(1.1),
      contrast: 0.85,
      saturation: 0.75,
      sepia: 0.22,
      blendMode: 'soft-light',
      blendTop: [0.937, 0.804, 0.678, 0.5],
   },

   Juno: {
      curves: brightnessCurveSet(1.15),
      contrast: 1.15,
      saturation: 1.8,
      sepia: 0.35,
      blendMode: 'overlay',
      blendTop: [0.498, 0.733, 0.89, 0.2],
   },

   Aden: {
      curves: brightnessCurveSet(1.13),
      contrast: 0.92,
      saturation: 0.88,
      hue: -5,
      blendMode: 'darken',
      blendTop: [0.259, 0.039, 0.055, 0.14],
   },

   Perpetua: {
      curves: brightnessCurveSet(1.05),
      contrast: 1.05,
      blendMode: 'soft-light',
      blendTop: [0, 0.357, 0.604, 0.5],
      blendBottom: [0.902, 0.757, 0.239, 0.5],
   },

   Crema: {
      curves: brightnessCurveSet(1.05),
      contrast: 1.05,
      saturation: 0.9,
      sepia: 0.5,
      hue: -2,
      blendMode: 'multiply',
      blendTop: [0.49, 0.412, 0.094, 0.1],
   },

   Ludwig: {
      curves: brightnessCurveSet(1.05),
      contrast: 1.05,
      saturation: 1.3,
      sepia: 0.25,
      blendMode: 'overlay',
      blendTop: [0.49, 0.412, 0.094, 0.1],
   },

   Slumber: {
      curves: brightnessCurveSet(1.05),
      saturation: 0.66,
      blendMode: 'soft-light',
      blendTop: [0.49, 0.412, 0.094, 0.4],
   },
};

export function getPreset(name: string): FilterPreset {
   return PRESETS[name] ?? PRESETS.Original;
}
