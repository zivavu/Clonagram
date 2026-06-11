import type { PostWithMedia } from '@/src/queries/posts';

export function formatAltText(
   aiDescription: string | undefined | null,
   post: PostWithMedia,
   imageIndex: number,
): string {
   const parts: string[] = [];

   const image = post.images?.[imageIndex];
   const taggedUsernames = image?.tags?.map(t => t.user.username) ?? [];

   const dateStr = post.created_at
      ? new Date(post.created_at).toLocaleDateString('en-US', {
           month: 'long',
           day: 'numeric',
           year: 'numeric',
        })
      : '';

   parts.push(`Photo by ${post.user.username} on ${dateStr}`);

   if (taggedUsernames.length > 0) {
      parts.push(`tagging @${taggedUsernames.join(', @')}`);
   }

   if (aiDescription) {
      parts.push(`— ${aiDescription}`);
   }

   return parts.join(' ');
}
