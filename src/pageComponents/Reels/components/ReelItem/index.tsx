'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { MdLocationOn, MdVerified } from 'react-icons/md';
import FollowButton from '@/src/components/FollowButton';
import UserAvatar from '@/src/components/UserAvatar';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { supabase } from '@/src/lib/supabase/client';
import { postCommentsQuery } from '@/src/queries/comments';
import type { Reel } from '@/src/queries/posts';
import OtherUserUsername from '../../../../components/Username/OtherUserUsername';
import ReelActionRail from '../ReelActionRail';
import ReelComments from '../ReelComments';
import ReelVideo from '../ReelVideo';
import { styles } from './index.stylex';

interface ReelItemProps {
   reel: Reel;
   isCommentsOpen: boolean;
   onToggleComments: () => void;
   onCloseComments: () => void;
}

export default function ReelItem({
   reel,
   isCommentsOpen,
   onToggleComments,
   onCloseComments,
}: ReelItemProps) {
   const { data: authUser } = useAuthUser();
   const video = reel.videos[0];
   const isOwnReel = authUser?.id === reel.user.id;

   const { data: comments } = useQuery({
      queryKey: ['comments', reel.id],
      queryFn: async () => {
         const { data, error } = await postCommentsQuery(supabase, reel.id);
         if (error) throw error;
         return data;
      },
      staleTime: Infinity,
   });

   const commentCount = comments?.length ?? reel.comment_count ?? 0;

   return (
      <section {...stylex.props(styles.section)}>
         <div {...stylex.props(styles.anchor)}>
            <div {...stylex.props(styles.videoClip)}>
               {video?.mux_playback_id && <ReelVideo playbackId={video.mux_playback_id} />}
            </div>
            <div {...stylex.props(styles.info)}>
               <div {...stylex.props(styles.userRow)}>
                  <UserAvatar
                     src={reel.user.avatar_url}
                     alt={reel.user.username}
                     size={32}
                     username={reel.user.username}
                     userId={reel.user.id}
                  />
                  <OtherUserUsername userProfile={reel.user} />
                  {reel.user.is_verified && (
                     <span {...stylex.props(styles.verified)}>
                        <MdVerified size={14} />
                     </span>
                  )}
                  {!isOwnReel && (
                     <FollowButton
                        targetUserId={reel.user.id}
                        targetIsPrivate={false}
                        variant="sidebar"
                        rootStyle={styles.followButton}
                     />
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
            <div {...stylex.props(styles.railWrapper)}>
               <ReelActionRail
                  reel={reel}
                  commentCount={commentCount}
                  onToggleComments={onToggleComments}
               />
               {isCommentsOpen && <ReelComments reel={reel} onClose={onCloseComments} />}
            </div>
         </div>
      </section>
   );
}
