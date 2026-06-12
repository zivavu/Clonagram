import { getMuxThumbnailUrl } from './mux';

interface PostMediaSource {
   images: { position: number; url: string | null }[];
   videos: { position: number; mux_playback_id: string | null }[];
}

export function getPostThumbnail(post: PostMediaSource): string | null {
   const items = [
      ...post.images.map(img => ({ position: img.position, url: img.url })),
      ...post.videos
         .filter((v): v is { position: number; mux_playback_id: string } => !!v.mux_playback_id)
         .map(v => ({
            position: v.position,
            url: getMuxThumbnailUrl(v.mux_playback_id),
         })),
   ].sort((a, b) => a.position - b.position);

   return items[0]?.url ?? null;
}

type PostWithOwner = {
   hide_likes?: boolean;
   user_id?: string;
   user?: { id: string };
   like_count?: number;
};

export function hideLikesForNonOwners<T extends PostWithOwner>(
   posts: T[],
   currentUserId: string | undefined,
): T[] {
   return posts.map(post => {
      if (!post.hide_likes) return post;
      const ownerId = post.user_id ?? post.user?.id;
      if (ownerId && ownerId !== currentUserId && post.like_count !== undefined) {
         return { ...post, like_count: 0 };
      }
      return post;
   });
}
