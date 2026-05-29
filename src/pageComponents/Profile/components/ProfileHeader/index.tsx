import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { MdPersonAdd, MdVerified } from 'react-icons/md';
import type { ProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import UserAvatar from '@/src/components/UserAvatar';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

interface ProfileHeaderProps {
   userProfile: ProfileWithPosts['userProfile'];
   postsCount: number;
   isOwnProfile: boolean;
}

export default function ProfileHeader({
   userProfile,
   postsCount,
   isOwnProfile,
}: ProfileHeaderProps) {
   const followersCount =
      (userProfile.followers as unknown as [{ count: number }])?.[0]?.count ?? 0;
   const followingCount =
      (userProfile.following as unknown as [{ count: number }])?.[0]?.count ?? 0;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.mainRow)}>
            <div {...stylex.props(styles.avatarSection)}>
               <UserAvatar
                  src={userProfile.avatar_url}
                  alt={userProfile.username}
                  size={150}
                  userId={userProfile.id}
               />
            </div>
            <div {...stylex.props(styles.infoSection)}>
               <div {...stylex.props(styles.usernameRow)}>
                  <h2 {...stylex.props(styles.username)}>{userProfile.username}</h2>
                  {userProfile.is_verified && <MdVerified size={20} color={colors.accentText} />}
               </div>
               {(userProfile.full_name || userProfile.bio) && (
                  <div {...stylex.props(styles.bioRow)}>
                     {userProfile.full_name && (
                        <span {...stylex.props(styles.fullName)}>{userProfile.full_name}</span>
                     )}
                     {userProfile.bio && (
                        <span {...stylex.props(styles.bioText)}>{userProfile.bio}</span>
                     )}
                  </div>
               )}
               <div {...stylex.props(styles.statsRow)}>
                  <span {...stylex.props(styles.stat)}>
                     <strong>{postsCount}</strong> posts
                  </span>
                  <span {...stylex.props(styles.stat)}>
                     <strong>{followersCount}</strong> followers
                  </span>
                  <span {...stylex.props(styles.stat)}>
                     <strong>{followingCount}</strong> following
                  </span>
               </div>
            </div>
         </div>
         <div {...stylex.props(styles.buttonsRow)}>
            {isOwnProfile ? (
               <>
                  <Link
                     href="/accounts/edit"
                     {...stylex.props(styles.button, styles.buttonSecondary)}
                  >
                     Edit profile
                  </Link>
                  <Link href="/archive" {...stylex.props(styles.button, styles.buttonSecondary)}>
                     View archive
                  </Link>
               </>
            ) : (
               <>
                  <button type="button" {...stylex.props(styles.button, styles.buttonPrimary)}>
                     Follow
                  </button>
                  <Link
                     href={`/direct/t/${userProfile.id}`}
                     {...stylex.props(styles.button, styles.buttonSecondary)}
                  >
                     Message
                  </Link>
                  <button
                     type="button"
                     {...stylex.props(styles.button, styles.buttonIcon)}
                     style={{ width: 'fit-content' }}
                  >
                     <MdPersonAdd size={16} />
                  </button>
               </>
            )}
         </div>
         {userProfile.website && (
            <Link
               href={userProfile.website}
               target="_blank"
               rel="noopener noreferrer"
               {...stylex.props(styles.websiteLink)}
            >
               {userProfile.website}
            </Link>
         )}
      </div>
   );
}
