'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmark, MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import { dislikePostAction } from '@/src/actions/likes/dislikePost';
import { likePostAction } from '@/src/actions/likes/likePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import type { Reel } from '@/src/queries/posts';
import { styles } from './index.stylex';

interface ReelActionRailProps {
   reel: Reel;
   onToggleComments: () => void;
}

function formatCount(n: number): string {
   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
   return String(n);
}

export default function ReelActionRail({ reel, onToggleComments }: ReelActionRailProps) {
   const { data: authUser } = useAuthUser();
   const [saved, setSaved] = useState(false);
   const [isLiked, setIsLiked] = useState(() => reel.likes.some(l => l.user_id === authUser?.id));
   const [likeCount, setLikeCount] = useState(reel.like_count);

   async function handleLike() {
      const next = !isLiked;
      setIsLiked(next);
      setLikeCount(prev => prev + (next ? 1 : -1));
      try {
         if (next) {
            await likePostAction({ postId: reel.id });
         } else {
            await dislikePostAction({ postId: reel.id });
         }
      } catch {
         setIsLiked(!next);
         setLikeCount(prev => prev + (next ? -1 : 1));
      }
   }

   return (
      <div {...stylex.props(styles.rail)}>
         <div {...stylex.props(styles.group)}>
            <button
               type="button"
               onClick={handleLike}
               aria-label="Like"
               {...stylex.props(styles.button)}
            >
               {isLiked ? (
                  <MdFavorite {...stylex.props(styles.likedIcon)} size={26} />
               ) : (
                  <MdFavoriteBorder size={26} />
               )}
            </button>
            <span {...stylex.props(styles.count)}>{formatCount(likeCount)}</span>
         </div>

         <div {...stylex.props(styles.group)}>
            <button
               type="button"
               onClick={onToggleComments}
               aria-label="Comments"
               {...stylex.props(styles.button)}
            >
               <FiMessageCircle size={24} />
            </button>
            <span {...stylex.props(styles.count)}>{formatCount(reel.comment_count)}</span>
         </div>

         <button type="button" aria-label="Repost" {...stylex.props(styles.button)}>
            <TbRepeat size={24} />
         </button>

         <button type="button" aria-label="Share" {...stylex.props(styles.button)}>
            <LuSend size={22} />
         </button>

         <button
            type="button"
            onClick={() => setSaved(prev => !prev)}
            aria-label="Save"
            {...stylex.props(styles.button)}
         >
            {saved ? <MdBookmark size={24} /> : <MdBookmarkBorder size={24} />}
         </button>

         <button type="button" aria-label="More" {...stylex.props(styles.button)}>
            <TbDots size={24} />
         </button>

         {reel.user.avatar_url && (
            <Image
               src={reel.user.avatar_url}
               alt={reel.user.username}
               width={28}
               height={28}
               {...stylex.props(styles.avatar)}
            />
         )}
      </div>
   );
}
