import { getMuxThumbnailUrl } from './mux';

interface PostMediaSource {
   images: { position: number; url: string | null }[];
   videos: { position: number; mux_playback_id: string | null }[];
}

export function getPostThumbnail(post: PostMediaSource) {
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

export function nextCursorFrom<T extends { created_at: string | null }>(
   rows: T[],
   pageSize: number,
) {
   return rows.length === pageSize ? (rows[rows.length - 1].created_at ?? null) : null;
}

interface EqChainable<T> {
   eq(column: string, value: unknown): T;
}

interface CommentFilterChainable<T> extends EqChainable<T> {
   lte(column: string, value: unknown): T;
}

export function filterVisibleCommentCount<T extends CommentFilterChainable<T>>(query: T): T {
   return query
      .lte('comments.created_at', new Date().toISOString())
      .eq('comments.is_deleted', false);
}

interface PostWithVisibleCommentCount {
   comment_count?: number;
   visible_comment_count?: { count: number }[] | null;
}

export function applyVisibleCommentCount<T extends PostWithVisibleCommentCount>(posts: T[]): T[] {
   return posts.map(post => {
      const visible = post.visible_comment_count?.[0]?.count;
      return visible === undefined ? post : { ...post, comment_count: visible };
   });
}

export function scopePostEngagementToUser<T extends EqChainable<T>>(
   query: T,
   userId: string,
   relationPrefix?: string,
): T {
   const prefix = relationPrefix ? `${relationPrefix}.` : '';
   return query
      .eq(`${prefix}likes.user_id`, userId)
      .eq(`${prefix}saves.user_id`, userId)
      .eq(`${prefix}reposts.user_id`, userId);
}
