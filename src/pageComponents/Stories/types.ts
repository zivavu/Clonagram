import type { Media } from '@/src/types/global';

export interface Layout {
   mainWidth: number;
   mainHeight: number;
   sideWidth: number;
   sideHeight: number;
   gap: number;
   xOffset: number;
   isMobile: boolean;
}

export interface StoryEntry {
   id: number;
   username: string;
   avatarUrl: string;
   timestamp: string;
   stories: Media[];
}

export interface StoriesPageProps {
   username: string;
   storyId: string | null;
}
