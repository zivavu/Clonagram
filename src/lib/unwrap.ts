export function throwIfError(result: { error: { message: string } | null }, message: string): void {
   if (result.error) {
      throw new Error(`${message}: ${result.error.message}`);
   }
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
