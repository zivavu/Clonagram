export type SeedNiche =
   | 'travel'
   | 'fitness'
   | 'food'
   | 'fashion'
   | 'art'
   | 'photography'
   | 'lifestyle'
   | 'music'
   | 'tech'
   | 'wellness';

export type SeedAspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

export interface SeedImageMeta {
   blurDataUrl: string;
   width: number;
   height: number;
}

export interface SeedPost {
   id: string;
   caption: string;
   aspectRatio: SeedAspectRatio;
   imageCount: number;
   images: Array<SeedImageMeta | null>;
   collaboratorProfileIds: string[];
   imageTags: Array<{ profileId: string; x: number; y: number }>;
}

export interface SeedStory {
   id: string;
   description: string;
   hasImage: boolean;
   image: SeedImageMeta | null;
}

export interface SeedHighlight {
   id: string;
   title: string;
   storyIds: string[];
}

export interface SeedProfile {
   id: string;
   niche: SeedNiche;
   username: string;
   fullName: string;
   bio: string;
   website: string | null;
   isVerified: boolean;
   isPrivate: boolean;
   hasImages: boolean;
   commentPool: string[];
   posts: SeedPost[];
   stories: SeedStory[];
   highlights: SeedHighlight[];
   avatar: SeedImageMeta | null;
}

export interface SeedFollow {
   followerId: string;
   followingId: string;
}

export interface SeedLike {
   postId: string;
   profileId: string;
   createdAt: string;
}

export interface SeedSave {
   postId: string;
   profileId: string;
   createdAt: string;
}

export interface SeedRepost {
   postId: string;
   profileId: string;
   createdAt: string;
}

export interface SeedComment {
   id: string;
   postId: string;
   authorProfileId: string;
   text: string;
   createdAt: string;
}

export interface SeedGraph {
   follows: SeedFollow[];
   likes: SeedLike[];
   saves: SeedSave[];
   reposts: SeedRepost[];
   comments: SeedComment[];
}

export interface SeedData {
   profiles: SeedProfile[];
   graph: SeedGraph;
}
