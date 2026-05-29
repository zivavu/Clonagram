import 'server-only';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '../../../../lib/supabase/server';
import { userProfilesQuery } from '../../../../queries/userProfiles';
import { styles } from './index.stylex';
import LogoutButton from './LogoutButton';

export default async function RightSidebar() {
   const profile = await getAuthProfile();

   const supabase = await createServerClient();
   const { data: suggestedUsers, error } = await userProfilesQuery(supabase, { limit: 6 });

   if (error) {
      return 'Failed to load suggested users';
   }

   return (
      <aside {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.profileCard)}>
            <UserAvatar src={profile?.avatar_url ?? null} alt={profile?.username ?? ''} size={44} />
            <div {...stylex.props(styles.profileInfo)}>
               {profile && (
                  <OtherUserUsername style={styles.profileUsername} userProfile={profile} />
               )}
               <span {...stylex.props(styles.profileName)}>{profile?.full_name}</span>
            </div>
            <LogoutButton />
         </div>

         <div {...stylex.props(styles.suggestionsHeader)}>
            <span {...stylex.props(styles.suggestionsLabel)}>Suggested for you</span>
            <Link href="/explore/people" {...stylex.props(styles.seeAllLink)}>
               See all
            </Link>
         </div>

         <div {...stylex.props(styles.suggestionsList)}>
            {suggestedUsers.map(user => (
               <div key={user.id} {...stylex.props(styles.suggestionItem)}>
                  <UserAvatar src={user.avatar_url} alt={user.username} size={44} />
                  <div {...stylex.props(styles.suggestionInfo)}>
                     <OtherUserUsername style={styles.suggestionUsername} userProfile={user} />
                     {user.full_name && (
                        <span {...stylex.props(styles.suggestionSubtext)}>
                           {user.full_name.length > 22
                              ? `${user.full_name.slice(0, 22)}…`
                              : user.full_name}
                        </span>
                     )}
                  </div>
                  <button type="button" {...stylex.props(styles.followButton)}>
                     Follow
                  </button>
               </div>
            ))}
         </div>
      </aside>
   );
}
