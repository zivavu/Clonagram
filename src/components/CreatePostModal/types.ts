export type AspectRatio = 'original' | '1:1' | '4:5' | '16:9' | '9:16';

export const RATIO_NUMERIC: Record<AspectRatio, number | null> = {
   original: null,
   '1:1': 1,
   '4:5': 4 / 5,
   '16:9': 16 / 9,
   '9:16': 9 / 16,
};

export interface Adjustments {
   brightness: number;
   contrast: number;
   fade: number;
   saturation: number;
   temperature: number;
   vignette: number;
}

export interface SelectedFile {
   file: File;
   preview: string;
   zoom: number;
   panX: number;
   panY: number;
   filterPreset: string;
   adjustments: Adjustments;
}

export type Step = 'upload' | 'crop' | 'edit';
