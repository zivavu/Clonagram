'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { FaComment } from 'react-icons/fa6';
import { MdCollections, MdFavorite, MdPlayArrow } from 'react-icons/md';
import type { PostsWithMedia } from '@/src/queries/posts';
import { usePostViewModal } from '@/src/store/usePostViewModalStore';
import { colors } from '../../../styles/tokens.stylex';
import { getPostThumbnail } from '../../../utils/posts';
import { styles } from './index.stylex';

interface ExploreGridProps {
   posts: PostsWithMedia;
   emptyState?: ReactNode;
}

function isPostTall(index: number): boolean {
   const positionInGroup = index % 5;
   const groupIndex = Math.floor(index / 5);
   const isTallOnRight = groupIndex % 2 === 0;
   return isTallOnRight ? positionInGroup === 2 : positionInGroup === 0;
}

export default function ExploreGrid({ posts, emptyState }: ExploreGridProps) {
   const pathname = usePathname();
   const { open } = usePostViewModal();
   const [hoveredId, setHoveredId] = useState<string | null>(null);

   if (posts.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            {emptyState ?? <span {...stylex.props(styles.emptyText)}>No posts to show</span>}
         </div>
      );
   }

   return (
      <div {...stylex.props(styles.grid)}>
         {posts.map((post, index) => {
            const thumbnail = getPostThumbnail(post);
            if (!thumbnail) return null;

            const isTall = isPostTall(index);
            const hasMultipleImages = post.images.length > 1;
            const isVideoOnly = post.videos.length > 0 && post.images.length === 0;
            const isHovered = hoveredId === post.id;

            return (
               <button
                  key={post.id}
                  type="button"
                  {...stylex.props(styles.item, isTall && styles.itemTall)}
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => open(post.id, { returnPath: pathname })}
               >
                  <Image
                     src={thumbnail}
                     alt="Explore post"
                     fill
                     sizes="(max-width: 960px) 33vw, 317px"
                     style={{ objectFit: 'cover' }}
                  />
                  <div {...stylex.props(styles.overlay, isHovered && styles.overlayVisible)}>
                     <div {...stylex.props(styles.stat)}>
                        <MdFavorite size={20} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>{post.like_count}</span>
                     </div>
                     <div {...stylex.props(styles.stat)}>
                        <FaComment size={18} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>{post.comment_count ?? 0}</span>
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
