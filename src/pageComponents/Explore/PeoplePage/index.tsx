import 'server-only';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import FollowButton from '@/src/components/FollowButton';
import { UserListItem } from '@/src/components/UserListItem';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { type FollowState, getBatchFollowStatuses } from '@/src/queries/followStatus';
import { getMutualFollowerSubtitles } from '@/src/queries/mutualFollowers';
import { userProfilesQuery } from '@/src/queries/userProfiles';
import { styles } from './index.stylex';

export default async function PeoplePage({ tab }: { tab: string | null }) {
   const isMore = tab === 'more';
   const supabase = await createServerClient();
   const profile = await getAuthProfile(supabase);

    const { data: users, error } = await userProfilesQuery(supabase, {
       limit: 30,
       excludeId: profile?.id,
       order: isMore ? 'asc' : 'desc',
       hideAi: profile?.hide_ai_content ?? false,
    });

   if (error) return 'Failed to load suggested users';

   const userIds = users.map(u => u.id);

   const [followStatuses, subtitles] = await Promise.all([
      profile
         ? getBatchFollowStatuses(supabase, profile.id, userIds)
         : Promise.resolve({} as Record<string, FollowState>),
      profile
         ? getMutualFollowerSubtitles(supabase, profile.id, userIds)
         : Promise.resolve(Object.fromEntries(userIds.map(id => [id, 'Suggested for you']))),
   ]);

   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
               <Link href="/explore/people" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(!isMore ? styles.headerActive : styles.headerInactive)}>
                     Suggested for you
                  </span>
               </Link>
               <Link href="/explore/people?tab=more" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(isMore ? styles.headerActive : styles.headerInactive)}>
                     More accounts
                  </span>
               </Link>
            </div>
            <div {...stylex.props(styles.list)}>
               {users.map(user => (
                  <UserListItem
                     key={user.id}
                     avatarUrl={user.avatar_url}
                     avatarAlt={user.username}
                     username={user.username}
                     userId={user.id}
                     name={<OtherUserUsername userProfile={user} useHoverCard={false} />}
                     fullName={subtitles[user.id] ?? 'Suggested for you'}
                     rightElement={
                        <FollowButton
                           targetUserId={user.id}
                           targetIsPrivate={user.is_private}
                           initialState={followStatuses[user.id] ?? 'none'}
                           variant="sidebar"
                        />
                     }
                  />
               ))}
            </div>
         </div>
      </div>
   );
}
