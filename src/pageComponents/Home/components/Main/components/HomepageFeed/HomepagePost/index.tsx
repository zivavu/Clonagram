'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmark, MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { useOpenPostModal } from '@/src/hooks/useOpenPostModal';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { getPost } from '../../../../../../../actions/post/getPost';
import PostMediaCarousel from '../../../../../../../components/PostMediaCarousel/PostMediaCarousel';
import { useAuthUser } from '../../../../../../../hooks/useAuthUser';
import { useTogglePostLike } from '../../../../../../../hooks/useTogglePostLike';
import { useTogglePostSave } from '../../../../../../../hooks/useTogglePostSave';
import { queryKeys } from '../../../../../../../lib/queryKeys';
import { useOwnerActionsModal } from '../../../../../../../store/createModalStore';
import { colors } from '../../../../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

interface HomepagePostProps {
   post: PostWithMedia;
   index: number;
}

function getAspectRatio(post: PostWithMedia): string {
   switch (post.aspect_ratio) {
      case '16:9':
         return '16 / 9';
      case '1:1':
         return '1 / 1';
      case 'original': {
         const media = post.images?.[0] ?? post.videos?.[0];
         if (media?.width && media?.height) {
            return `${media.width} / ${media.height}`;
         }
         return '1 / 1';
      }
      default:
         return '4 / 5';
   }
}

export default function HomepagePost({ post: initialPost }: HomepagePostProps) {
   const { data: currentUser } = useAuthUser();

   const { open: openOwnerActionsModal } = useOwnerActionsModal();
   const { openPostModal } = useOpenPostModal();
   const currentImageIndex = useRef(0);

   function handleOpenPostModal(post: PostWithMedia, index = 0) {
      openPostModal(post, { initialImageIndex: index });
   }

   const { data: post } = useQuery({
      initialData: initialPost,
      initialDataUpdatedAt: Date.now(),
      queryKey: queryKeys.post(initialPost.id),
      queryFn: () => getPost(initialPost.id),
      staleTime: Infinity,
   });

   const { mutate: togglePostLike } = useTogglePostLike(post);
   const { mutate: togglePostSave } = useTogglePostSave(post);
   const isLiked = post.likes.some(l => l.user_id === currentUser?.id);
   const isSaved = post.saves?.some(s => s.user_id === currentUser?.id);

   const isOwner = post.user.id === currentUser?.id;

   if (!post) return null;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <UserAvatar
               src={post.user.avatar_url}
               alt={post.user.username}
               size={32}
               username={post.user.username}
               userId={post.user.id}
            />
            <OtherUserUsername style={styles.topUsername} userProfile={post.user} />
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
            width="100%"
            height="auto"
            sizes="(max-width: 767px) calc(100vw - 32px), 468px"
            aspectRatio={getAspectRatio(post)}
            onImageChange={index => {
               currentImageIndex.current = index;
            }}
            onImageClick={(clickedPost, index) => handleOpenPostModal(clickedPost, index)}
            dotsBelow
         />
         <div {...stylex.props(styles.iconsBar)}>
            <div {...stylex.props(styles.iconBarItem)}>
               <button
                  type="button"
                  aria-label="Like"
                  title="Like"
                  onClick={() => togglePostLike()}
                  {...stylex.props(styles.iconBarItemButton)}
               >
                  {isLiked ? (
                     <MdFavorite size={26} color={colors.textPrimary} />
                  ) : (
                     <MdFavoriteBorder size={26} color={colors.textPrimary} />
                  )}
                  {!post.hide_likes && (post.like_count ?? 0) > 0 && <span>{post.like_count}</span>}
               </button>
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button
                  type="button"
                  aria-label="Comment"
                  onClick={() => handleOpenPostModal(post, currentImageIndex.current)}
                  {...stylex.props(styles.iconBarItemButton)}
               >
                  <FiMessageCircle size={26} color={colors.textPrimary} />
                  {(post.comment_count ?? 0) > 0 && <span>{post.comment_count}</span>}
               </button>
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Repost">
                  <TbRepeat size={26} color={colors.textPrimary} />
               </button>
            </div>
            <button type="button" aria-label="Share">
               <LuSend size={24} color={colors.textPrimary} />
            </button>
            <button
               type="button"
               aria-label="Bookmark"
               style={{ marginLeft: 'auto' }}
               onClick={() => togglePostSave()}
            >
               {isSaved ? (
                  <MdBookmark size={26} color={colors.textPrimary} />
               ) : (
                  <MdBookmarkBorder size={26} color={colors.textPrimary} />
               )}
            </button>
         </div>
         <div {...stylex.props(styles.descriptionContainer)}>
            {post.caption && (
               <>
                  <OtherUserUsername style={styles.bottomUsername} userProfile={post.user} />
                  <span {...stylex.props(styles.description)}>{post.caption}</span>
               </>
            )}
         </div>
      </div>
   );
}
