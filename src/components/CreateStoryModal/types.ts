export type Step = 'upload' | 'preview' | 'sharing' | 'story-shared';

export interface StoryMedia {
   file: File;
   preview: string;
   type: 'image' | 'video';
}

export type StoryMediaResult =
   | { type: 'image'; url: string; blurDataUrl: string }
   | { type: 'video'; assetId: string; playbackId: string; duration: number };
