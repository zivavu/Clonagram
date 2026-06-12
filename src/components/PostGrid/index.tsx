'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FaComment } from 'react-icons/fa6';
import { MdCollections, MdFavorite, MdPlayArrow } from 'react-icons/md';
import { useOpenPostModal } from '../../hooks/useOpenPostModal';
import { colors } from '../../styles/tokens.stylex';
import { getPostThumbnail } from '../../utils/posts';
import { styles } from './index.stylex';

interface PostGridPost {
   id: string;
   hide_likes: boolean;
   like_count: number;
   comment_count: number;
   images: { position: number; url: string | null }[];
   videos: { position: number; mux_playback_id: string | null }[];
}

interface PostGridProps {
   posts: PostGridPost[];
   username: string;
   emptyText: string;
   alwaysShowPlayBadge?: boolean;
}

export default function PostGrid({
   posts,
   username,
   emptyText,
   alwaysShowPlayBadge = false,
}: PostGridProps) {
   const { openPostModal } = useOpenPostModal();
   const [hoveredId, setHoveredId] = useState<string | null>(null);

   if (!posts || posts.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            <span {...stylex.props(styles.emptyText)}>{emptyText}</span>
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
                  onClick={() => openPostModal(post.id, username)}
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
                        {!post.hide_likes && (
                           <span {...stylex.props(styles.statText)}>{post.like_count}</span>
                        )}
                     </div>
                     <div {...stylex.props(styles.stat)}>
                        <FaComment size={18} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>{post.comment_count ?? 0}</span>
                     </div>
                  </div>
                  {alwaysShowPlayBadge ? (
                     <div {...stylex.props(styles.badge)}>
                        <MdPlayArrow size={18} color={colors.white} />
                     </div>
                  ) : (
                     <>
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
                     </>
                  )}
               </button>
            );
         })}
      </div>
   );
}
