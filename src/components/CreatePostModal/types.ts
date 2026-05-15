import type { PartialUser } from '@/src/types/global';

export interface PostLocation {
   lat: number;
   lon: number;
   name: string;
}

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
   imageDisplayW: number;
   imageDisplayH: number;
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
   shareToClonedbook: boolean;
}

export interface PostData {
   media: PostMedia[];
   aspectRatio: AspectRatio;
   caption: string | null;
   location: PostLocation | null;
   collaborators: PartialUser[] | [];
   postSettings: PostSettings;
}

export type MediaResult =
   | { type: 'image'; path: string }
   | { type: 'video'; assetId: string; playbackId: string; duration: number };

export interface CreatePostParams extends Omit<PostData, 'media'> {
   mediaResults: MediaResult[];
}

export type Step = 'upload' | 'crop' | 'edit' | 'caption' | 'sharing' | 'post-shared';

export const DEFAULT_ADJUSTMENTS: Adjustments = {
   brightness: 0,
   contrast: 0,
   fade: 0,
   saturation: 0,
   temperature: 0,
   vignette: 0,
};

export const DEFAULT_POST_SETTINGS: PostSettings = {
   hideLikes: false,
   commentsOff: false,
   shareToClonedbook: false,
};

export function createPostMedia(file: File): PostMedia {
   const isVideo = file.type.startsWith('video/');
   return {
      file,
      preview: URL.createObjectURL(file),
      type: isVideo ? 'video' : 'image',
      zoom: 1,
      panX: 0,
      panY: 0,
      imageDisplayW: 0,
      imageDisplayH: 0,
      filterPreset: 'Original',
      filterStrength: 100,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      tags: [],
      duration: 0,
      coverTime: 0,
      trimStart: 0,
      trimEnd: 0,
      muted: false,
      frames: undefined,
   };
}

export function revokeMediaUrls(media: PostMedia): void {
   URL.revokeObjectURL(media.preview);
   if (media.poster) URL.revokeObjectURL(media.poster);
   for (const url of media.frames ?? []) URL.revokeObjectURL(url);
}
