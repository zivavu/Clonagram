'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { MdCollections, MdFavorite, MdPlayArrow } from 'react-icons/md';
import type { ProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import { colors } from '../../../../styles/tokens.stylex';

interface ProfilePostGridProps {
   posts: ProfileWithPosts['posts'];
}

interface ProfilePost {
   id: string;
   like_count: number;
   comment_count: number;
   images: Array<{
      id: string;
      url: string;
      position: number;
      width: number | null;
      height: number | null;
   }>;
   videos: Array<{
      id: string;
      mux_playback_id: string | null;
      position: number;
      width: number | null;
      height: number | null;
   }>;
}

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
         {(posts as ProfilePost[]).map(post => {
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
   );
}

const styles = stylex.create({
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '4px',
      width: '100%',
      '@media (min-width: 1386px)': {
         gridTemplateColumns: 'repeat(4, 1fr)',
      },
   },
   postContainer: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1 / 1',
      backgroundColor: colors.bgSecondary,
   },
   overlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      opacity: 0,
      transition: 'opacity 0.2s ease',
   },
   overlayVisible: {
      opacity: 1,
   },
   stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
   },
   statText: {
      color: colors.white,
      fontSize: '16px',
      fontWeight: 700,
   },
   badge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
   },
   emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingBottom: '80px',
   },
   emptyText: {
      fontSize: '16px',
      color: colors.textSecondary,
   },
});
