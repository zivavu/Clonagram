'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import PostMediaCarousel from '../../../../../../../components/PostMediaCarousel/PostMediaCarousel';
import { useAuthUser } from '../../../../../../../hooks/useAuthUser';
import { usePostViewModal } from '../../../../../../../store/postViewModalStore';
import { useOwnerActionsModal } from '../../../../../../../store/useOwnerActionsModalStore';
import { styles } from './index.stylex';

interface HomepagePostProps {
   post: PostWithMedia;
   index: number;
}

function containerHeight(post: PostWithMedia): string {
   switch (post.aspect_ratio) {
      case '16:9':
         return '263.25px';
      case '1:1':
         return '468px';
      case 'original': {
         const media = post.images?.[0] ?? post.videos?.[0];
         if (media?.width && media?.height) {
            return `${Math.min(585, Math.round((468 * media.height) / media.width))}px`;
         }
         return '468px';
      }
      default:
         return '585px';
   }
}

export default function HomepagePost({ post }: HomepagePostProps) {
   const { data: currentUser } = useAuthUser();

   const { open: openOwnerActionsModal } = useOwnerActionsModal();
   const { open: openPostFullViewModal } = usePostViewModal();
   const currentImageIndex = useRef(0);

   const isOwner = post.user.id === currentUser?.id;

   if (!post) return null;

   console.log(post);

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
            <span {...stylex.props(styles.topUsername)}>{post.user.username}</span>
            <span {...stylex.props(styles.separator)}>•</span>
            <span {...stylex.props(styles.createdAt)} suppressHydrationWarning>
               {post.created_at ? formatRelativeTimeShortUnit(post.created_at) : ''}
            </span>
            {isOwner && (
               <button
                  type="button"
                  aria-label="Open Actions Modal"
                  {...stylex.props(styles.actionsIcon)}
               >
                  <TbDots
                     {...stylex.props(styles.actionsIcon)}
                     onClick={() => openOwnerActionsModal(post.id)}
                  />
               </button>
            )}
         </div>
         <PostMediaCarousel
            post={post}
            width="468px"
            sizes="468px"
            height={containerHeight(post)}
            onImageChange={index => {
               currentImageIndex.current = index;
            }}
         />
         <div {...stylex.props(styles.iconsBar)}>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Like">
                  <MdFavoriteBorder size={24} />
               </button>
               {post.like_count > 0 && <span>{post.like_count}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button
                  type="button"
                  aria-label="Comment"
                  onClick={() => openPostFullViewModal(post, currentImageIndex.current)}
               >
                  <FiMessageCircle size={24} />
               </button>
               {(post.comments[0]?.count ?? 0) > 0 && <span>{post.comments[0]?.count}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Repost">
                  <TbRepeat size={24} />
               </button>
            </div>
            <button type="button" aria-label="Share">
               <LuSend size={20} />
            </button>
            <button type="button" aria-label="Bookmark" style={{ marginLeft: 'auto' }}>
               <MdBookmarkBorder size={24} />
            </button>
         </div>
         <div {...stylex.props(styles.descriptionContainer)}>
            {post.caption && (
               <>
                  <span {...stylex.props(styles.bottomUsername)}>{post.user.username}</span>
                  <span {...stylex.props(styles.description)}>{post.caption}</span>
               </>
            )}
         </div>
      </div>
   );
}
