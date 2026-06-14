'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import UserAvatar from '@/src/components/UserAvatar';
import type { ConversationMessage } from '@/src/queries/messages';
import { usePostViewModal } from '@/src/store/usePostViewModalStore';
import { styles } from './index.stylex';

interface PostShareMessageProps {
   post: NonNullable<ConversationMessage['post']>;
}

export default function PostShareMessage({ post }: PostShareMessageProps) {
   const { open } = usePostViewModal();

   const sortedImages = [...(post.images ?? [])].sort((a, b) => a.position - b.position);
   const firstImageUrl = sortedImages[0]?.url;

   function handleClick() {
      open(post.id);
   }

   return (
      <button type="button" {...stylex.props(styles.card)} onClick={handleClick}>
         {post.user && (
            <div {...stylex.props(styles.cardHeader)}>
               <UserAvatar
                  src={post.user.avatar_url}
                  alt={post.user.username}
                  size={24}
                  username={post.user.username}
                  userId={post.user.id}
                  disableLink
                  useHoverCard={false}
                  showStoryRing={false}
               />
               <span {...stylex.props(styles.username)}>{post.user.username}</span>
            </div>
         )}
         {firstImageUrl && (
            <Image
               src={firstImageUrl}
               alt={post.caption ?? 'Shared post'}
               width={220}
               height={220}
               {...stylex.props(styles.image)}
            />
         )}
         {post.caption && <p {...stylex.props(styles.caption)}>{post.caption}</p>}
      </button>
   );
}
