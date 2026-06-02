'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { MdCollections, MdFavorite, MdPlayArrow } from 'react-icons/md';
import type { ProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import { usePostViewModal } from '../../../../store/postViewModalStore';
import { colors } from '../../../../styles/tokens.stylex';
import { getPostThumbnail } from '../../../../utils/posts';
import { styles } from './index.stylex';

interface ProfilePostGridProps {
   posts: ProfileWithPosts['posts'];
   username: string;
}

export default function ProfilePostGrid({ posts, username }: ProfilePostGridProps) {
   const pathname = usePathname();
   const { open } = usePostViewModal();

   const [hoveredId, setHoveredId] = useState<string | null>(null);

   if (!posts || posts.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            <span {...stylex.props(styles.emptyText)}>No posts yet</span>
         </div>
      );
   }

   return (
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
                  onClick={() => {
                     open(post.id, { returnPath: pathname });
                     window.history.pushState(
                        { postModal: true },
                        '',
                        `/profile/${username}/${post.id}`,
                     );
                  }}
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
                        <span {...stylex.props(styles.statText)}>{post.likes.length}</span>
                     </div>
                     <div {...stylex.props(styles.stat)}>
                        <FiMessageCircle size={20} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>
                           {post.comments[0]?.count ?? 0}
                        </span>
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
   );
}
