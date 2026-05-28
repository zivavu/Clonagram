import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { MdPersonAdd, MdVerified } from 'react-icons/md';
import type { ProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import UserAvatar from '@/src/components/UserAvatar';
import { colors, spacing } from '../../../../styles/tokens.stylex';

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
         <div {...stylex.props(styles.avatarSection)}>
            <UserAvatar src={userProfile.avatar_url} alt={userProfile.username} size={150} />
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
                     <button type="button" {...stylex.props(styles.button, styles.buttonIcon)}>
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
      </div>
   );
}

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing.xl,
      paddingBottom: spacing.xl,
      borderBottom: `1px solid ${colors.separator}`,
      width: '100%',
   },
   avatarSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexShrink: 0,
      width: '150px',
   },
   infoSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
      flex: 1,
   },
   usernameRow: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
   },
   username: {
      fontSize: '20px',
      fontWeight: 400,
      color: colors.textPrimary,
      margin: 0,
   },
   bioRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
   },
   fullName: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   bioText: {
      fontSize: '14px',
      color: colors.textPrimary,
      whiteSpace: 'pre-wrap',
   },
   statsRow: {
      display: 'flex',
      gap: spacing.xl,
      fontSize: '16px',
      color: colors.textPrimary,
   },
   stat: {
      fontSize: '16px',
      color: colors.textPrimary,
   },
   buttonsRow: {
      display: 'flex',
      gap: spacing.sm,
   },
   button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '7px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
   },
   buttonPrimary: {
      backgroundColor: colors.primaryButton,
      color: colors.white,
   },
   buttonSecondary: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
   },
   buttonIcon: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      padding: '7px',
   },
   websiteLink: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.accentText,
   },
});
