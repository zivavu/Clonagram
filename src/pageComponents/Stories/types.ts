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
   id: string;
   storyImageUrl: string;
   storyLength: number;
}

export interface StoryEntry {
   id: number;
   username: string;
   avatarUrl: string;
   timestamp: string;
   stories: StoryMedia[];
}

export interface StoriesPageProps {
   username: string;
   storyId: string | null;
}
