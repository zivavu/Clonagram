'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BiLink } from 'react-icons/bi';
import { MdPersonAdd, MdVerified } from 'react-icons/md';
import type { ProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import FollowButton from '@/src/components/FollowButton';
import NoteBubble from '@/src/components/NoteBubble';
import UserAvatar from '@/src/components/UserAvatar';
import type { FollowState } from '@/src/queries/followStatus';
import { useNewNoteModalStore } from '@/src/store/createModalStore';
import { useFollowListModal } from '@/src/store/useFollowListModalStore';
import { colors } from '../../../../styles/tokens.stylex';
import MessageButton from './components/MessageButton';
import { styles } from './index.stylex';

function parseWebsiteLinks(website: string | null) {
   if (!website) return [];
   try {
      const parsed = JSON.parse(website);
      if (Array.isArray(parsed)) return parsed as Array<{ title: string; url: string }>;
   } catch {
      return [{ title: website, url: website }];
   }
   return [];
}

interface ProfileHeaderProps {
   userProfile: ProfileWithPosts['userProfile'];
   postsCount: number;
   isOwnProfile: boolean;
   followStatus: FollowState;
   note: string | null;
}

export default function ProfileHeader({
   userProfile,
   postsCount,
   isOwnProfile,
   followStatus,
   note,
}: ProfileHeaderProps) {
   const followersCount = userProfile.followers?.[0]?.count ?? 0;
   const followingCount = userProfile.following?.[0]?.count ?? 0;

   const openFollowList = useFollowListModal(state => state.open);
   const openNoteModal = useNewNoteModalStore(s => s.open);

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.mainRow)}>
            <div {...stylex.props(styles.avatarSection)}>
               {note && (
                  <NoteBubble
                     content={note}
                     onClick={isOwnProfile ? openNoteModal : undefined}
                     size="md"
                  />
               )}
               <UserAvatar
                  src={userProfile.avatar_url}
                  alt={userProfile.username}
                  size={150}
                  username={userProfile.username}
                  userId={userProfile.id}
                  useHoverCard={false}
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
                  <button
                     type="button"
                     {...stylex.props(styles.statButton)}
                     onClick={() =>
                        openFollowList('followers', userProfile.id, userProfile.username)
                     }
                  >
                     <strong>{followersCount}</strong> followers
                  </button>
                  <button
                     type="button"
                     {...stylex.props(styles.statButton)}
                     onClick={() =>
                        openFollowList('following', userProfile.id, userProfile.username)
                     }
                  >
                     <strong>{followingCount}</strong> following
                  </button>
               </div>
               {parseWebsiteLinks(userProfile.website).map(link => (
                  <Link
                     key={link.url}
                     href={link.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     {...stylex.props(styles.websiteLink)}
                  >
                     <BiLink size={16} />
                     {link.title || link.url}
                  </Link>
               ))}
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
                  <Link
                     href="/archive/stories"
                     {...stylex.props(styles.button, styles.buttonSecondary)}
                  >
                     View archive
                  </Link>
               </>
            ) : (
               <>
                  <FollowButton
                     targetUserId={userProfile.id}
                     targetIsPrivate={userProfile.is_private}
                     initialState={followStatus}
                     variant="profile"
                  />
                  <MessageButton targetUserId={userProfile.id} />
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
      </div>
   );
}
