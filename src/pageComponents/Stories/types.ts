export interface Layout {
   mainWidth: number;
   mainHeight: number;
   sideWidth: number;
   sideHeight: number;
   gap: number;
   xOffset: number;
   isMobile: boolean;
}

export interface StoryMedia {
   storyImageUrl: string;
}

export interface StoryEntry {
   username: string;
   avatarUrl: string;
   timestamp: string;
   stories: StoryMedia[];
}

export interface StoriesPageProps {
   username: string;
   storyId: string | null;
}
