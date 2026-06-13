'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmark, MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots } from 'react-icons/tb';
import { togglePostLike } from '@/src/actions/post/togglePostLike';
import { togglePostRepost } from '@/src/actions/post/togglePostRepost';
import RepostIcon from '@/src/components/RepostIcon';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useTogglePostSave } from '@/src/hooks/useTogglePostSave';
import type { Reel } from '@/src/queries/posts';
import { styles } from './index.stylex';

interface ReelActionRailProps {
   reel: Reel;
   commentCount: number;
   onToggleComments: () => void;
}

function formatCount(n: number) {
   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
   return String(n);
}

export default function ReelActionRail({
   reel,
   commentCount,
   onToggleComments,
}: ReelActionRailProps) {
   const { data: authUser } = useAuthUser();
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(reel.like_count);
   const [isSaved, setIsSaved] = useState(false);
   const [isReposted, setIsReposted] = useState(false);
   const { mutate: toggleSave, isPending: isSavePending } = useTogglePostSave(reel);

   useEffect(() => {
      if (authUser) {
         setIsLiked(reel.likes.some(l => l.user_id === authUser.id));
         setIsSaved(reel.saves?.some(s => s.user_id === authUser.id) ?? false);
         setIsReposted(reel.reposts?.some(r => r.user_id === authUser.id) ?? false);
      }
   }, [authUser, reel]);

   async function handleLike() {
      const next = !isLiked;
      setIsLiked(next);
      setLikeCount(prev => prev + (next ? 1 : -1));
      try {
         await togglePostLike({ postId: reel.id, isLiked });
      } catch {
         setIsLiked(!next);
         setLikeCount(prev => prev + (next ? -1 : 1));
      }
   }

   async function handleRepost() {
      const next = !isReposted;
      setIsReposted(next);
      try {
         await togglePostRepost({ postId: reel.id, isReposted });
      } catch {
         setIsReposted(!next);
      }
   }

   function handleSave() {
      const next = !isSaved;
      setIsSaved(next);
      try {
         toggleSave();
      } catch {
         setIsSaved(!next);
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
               {isLiked ? <MdFavorite size={26} /> : <MdFavoriteBorder size={26} />}
            </button>
            {!reel.hide_likes && (
               <span {...stylex.props(styles.count)}>{formatCount(likeCount)}</span>
            )}
         </div>

         <div {...stylex.props(styles.group)}>
            <button
               type="button"
               onClick={e => {
                  e.stopPropagation();
                  onToggleComments();
               }}
               aria-label="Comments"
               {...stylex.props(styles.button)}
            >
               <FiMessageCircle size={24} />
            </button>
            <span {...stylex.props(styles.count)}>{formatCount(commentCount)}</span>
         </div>

         <button
            type="button"
            aria-label="Repost"
            onClick={handleRepost}
            {...stylex.props(styles.button)}
         >
            <RepostIcon size={24} isReposted={isReposted} />
         </button>

         <button type="button" aria-label="Share" {...stylex.props(styles.button)}>
            <LuSend size={22} />
         </button>

         <button
            type="button"
            onClick={handleSave}
            aria-label="Save"
            disabled={isSavePending}
            {...stylex.props(styles.button)}
         >
            {isSaved ? <MdBookmark size={24} /> : <MdBookmarkBorder size={24} />}
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
