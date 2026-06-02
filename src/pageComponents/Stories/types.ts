import type { getActiveStories } from '@/src/actions/story/getActiveStories';

export type StoryEntry = Awaited<ReturnType<typeof getActiveStories>>['entries'][number];

export interface Layout {
   mainWidth: number;
   mainHeight: number;
   sideWidth: number;
   sideHeight: number;
   gap: number;
   xOffset: number;
   isMobile: boolean;
}

export interface StoriesPageProps {
   username: string;
   storyId: string | null;
   entries: Awaited<ReturnType<typeof getActiveStories>>['entries'];
   viewedStoryIds: string[];
   currentUserId: string | null;
}
