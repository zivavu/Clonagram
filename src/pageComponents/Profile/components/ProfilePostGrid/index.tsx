'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { MdCollections, MdFavorite, MdPlayArrow } from 'react-icons/md';
import type { ProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import PostFullViewModal from '../../../../components/PostViewModal';
import { usePostViewModal } from '../../../../store/postViewModalStore';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

interface ProfilePostGridProps {
   posts: ProfileWithPosts['posts'];
}

type ProfilePost = ProfileWithPosts['posts'][number];

function getPostThumbnail(post: ProfilePost): string | null {
   const firstImage = [...post.images].sort((a, b) => a.position - b.position)[0];
   if (firstImage) return firstImage.url;
   const firstVideo = [...post.videos].sort((a, b) => a.position - b.position)[0];
   if (firstVideo?.mux_playback_id) {
      return `https://image.mux.com/${firstVideo.mux_playback_id}/thumbnail.jpg`;
   }
   return null;
}

export default function ProfilePostGrid({ posts }: ProfilePostGridProps) {
   const { open: openModal } = usePostViewModal();

   const [hoveredId, setHoveredId] = useState<string | null>(null);

   if (!posts || posts.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            <span {...stylex.props(styles.emptyText)}>No posts yet</span>
         </div>
      );
   }

   return (
      <>
         <PostFullViewModal />
         <div {...stylex.props(styles.grid)}>
            {posts.map(post => {
               const thumbnail = getPostThumbnail(post);
               if (!thumbnail) return null;

               const hasMultipleImages = post.images.length > 1;
               const isVideoOnly = post.videos.length > 0 && post.images.length === 0;
               const isHovered = hoveredId === post.id;

               return (
                  <button
                     key={post.id}
                     type="button"
                     {...stylex.props(styles.postContainer)}
                     onMouseEnter={() => setHoveredId(post.id)}
                     onMouseLeave={() => setHoveredId(null)}
                     onClick={() => openModal(post.id, 0)}
                  >
                     <Image
                        src={thumbnail}
                        alt="Post"
                        fill
                        sizes="(max-width: 1385px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                     />
                     <div {...stylex.props(styles.overlay, isHovered && styles.overlayVisible)}>
                        <div {...stylex.props(styles.stat)}>
                           <MdFavorite size={20} color={colors.white} />
                           <span {...stylex.props(styles.statText)}>{post.like_count}</span>
                        </div>
                        <div {...stylex.props(styles.stat)}>
                           <FiMessageCircle size={20} color={colors.white} />
                           <span {...stylex.props(styles.statText)}>{post.comment_count}</span>
                        </div>
                     </div>
                     {hasMultipleImages && (
                        <div {...stylex.props(styles.badge)}>
                           <MdCollections size={18} color={colors.white} />
                        </div>
                     )}
                     {isVideoOnly && (
                        <div {...stylex.props(styles.badge)}>
                           <MdPlayArrow size={18} color={colors.white} />
                        </div>
                     )}
                  </button>
               );
            })}
         </div>
      </>
   );
}
