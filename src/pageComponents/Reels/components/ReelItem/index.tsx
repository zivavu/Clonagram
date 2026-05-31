'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { MdLocationOn, MdVerified } from 'react-icons/md';
import UserAvatar from '@/src/components/UserAvatar';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import type { Reel } from '@/src/queries/posts';
import ReelActionRail from '../ReelActionRail';
import ReelVideo from '../ReelVideo';
import { styles } from './index.stylex';

interface ReelItemProps {
   reel: Reel;
   onToggleComments: () => void;
}

export default function ReelItem({ reel, onToggleComments }: ReelItemProps) {
   const { data: authUser } = useAuthUser();
   const video = reel.videos[0];
   const isOwnReel = authUser?.id === reel.user.id;

   return (
      <section {...stylex.props(styles.section)}>
         <div {...stylex.props(styles.row)}>
            <div {...stylex.props(styles.videoWrapper)}>
               {video?.mux_playback_id && <ReelVideo playbackId={video.mux_playback_id} />}
               <div {...stylex.props(styles.overlay)}>
                  <div {...stylex.props(styles.userRow)}>
                     <UserAvatar
                        src={reel.user.avatar_url}
                        alt={reel.user.username}
                        size={32}
                        userId={reel.user.id}
                     />
                     <Link
                        href={`/profile/${reel.user.username}`}
                        {...stylex.props(styles.username)}
                     >
                        {reel.user.username}
                     </Link>
                     {reel.user.is_verified && (
                        <span {...stylex.props(styles.verified)}>
                           <MdVerified size={14} />
                        </span>
                     )}
                     {!isOwnReel && (
                        <button type="button" {...stylex.props(styles.follow)}>
                           · Follow
                        </button>
                     )}
                  </div>
                  {reel.location_name && (
                     <span {...stylex.props(styles.location)}>
                        <MdLocationOn size={14} />
                        {reel.location_name}
                     </span>
                  )}
                  {reel.caption && <p {...stylex.props(styles.caption)}>{reel.caption}</p>}
               </div>
            </div>
            <ReelActionRail reel={reel} onToggleComments={onToggleComments} />
         </div>
      </section>
   );
}
