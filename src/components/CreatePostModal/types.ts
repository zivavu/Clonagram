import type { PartialUser } from '@/src/types/global';

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

export interface TaggedPerson {
   user: PartialUser;
   x: number;
   y: number;
}

export interface PostMedia {
   file: File;
   preview: string;
   type: 'image' | 'video';
   zoom: number;
   panX: number;
   panY: number;
   filterPreset: string;
   filterStrength: number;
   adjustments: Adjustments;
   tags: TaggedPerson[];
   duration: number;
   coverTime: number;
   trimStart: number;
   trimEnd: number;
   muted: boolean;
   frames?: string[];
   poster?: string;
}

export interface PostSettings {
   hideLikes: boolean;
   commentsOff: boolean;
   shareToThreads: boolean;
   shareToFacebook: boolean;
   shareToClonedbook: boolean;
}

export type Step = 'upload' | 'crop' | 'edit' | 'caption';
