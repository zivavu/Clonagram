'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaComment } from 'react-icons/fa6';
import { MdFavorite, MdPlayArrow } from 'react-icons/md';
import type { ProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import { usePostViewModal } from '../../../../store/usePostViewModalStore';
import { colors } from '../../../../styles/tokens.stylex';
import { getPostThumbnail } from '../../../../utils/posts';
import { styles } from './index.stylex';

interface ProfileReelsGridProps {
   reels: ProfileWithPosts['posts'];
   username: string;
}

export default function ProfileReelsGrid({ reels, username }: ProfileReelsGridProps) {
   const pathname = usePathname();
   const { open } = usePostViewModal();
   const [hoveredId, setHoveredId] = useState<string | null>(null);

   if (reels.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            <span {...stylex.props(styles.emptyText)}>No reels yet</span>
         </div>
      );
   }

   return (
      <div {...stylex.props(styles.grid)}>
         {reels.map(reel => {
            const thumbnail = getPostThumbnail(reel);
            if (!thumbnail) return null;

            const isHovered = hoveredId === reel.id;

            return (
               <button
                  key={reel.id}
                  type="button"
                  {...stylex.props(styles.reelContainer)}
                  onMouseEnter={() => setHoveredId(reel.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                     open(reel.id, { returnPath: pathname });
                     window.history.pushState(
                        { postModal: true },
                        '',
                        `/profile/${username}/${reel.id}`,
                     );
                  }}
               >
                  <Image
                     src={thumbnail}
                     alt="Reel"
                     fill
                     sizes="(max-width: 1385px) 33vw, 25vw"
                     style={{ objectFit: 'cover' }}
                  />
                  <div {...stylex.props(styles.overlay, isHovered && styles.overlayVisible)}>
                     <div {...stylex.props(styles.stat)}>
                        <MdFavorite size={20} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>{reel.like_count}</span>
                     </div>
                     <div {...stylex.props(styles.stat)}>
                        <FaComment size={18} color={colors.white} />
                        <span {...stylex.props(styles.statText)}>{reel.comment_count ?? 0}</span>
                     </div>
                  </div>
                  <div {...stylex.props(styles.badge)}>
                     <MdPlayArrow size={18} color={colors.white} />
                  </div>
               </button>
            );
         })}
      </div>
   );
}
