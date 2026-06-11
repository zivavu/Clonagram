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
   startSlug: string;
   basePath: string;
   showReply?: boolean;
   closeHref?: string;
   entries: Awaited<ReturnType<typeof getActiveStories>>['entries'];
   viewedStoryIds: string[];
   reactedStoryIds: string[];
   currentUserId: string | null;
}
