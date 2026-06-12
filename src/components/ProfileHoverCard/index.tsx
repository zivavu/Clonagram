'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { TbCamera } from 'react-icons/tb';
import { getProfileCard, getUserRecentPosts } from '@/src/actions/profile/getProfileCard';
import UserAvatar from '@/src/components/UserAvatar';
import { queryKeys } from '@/src/lib/queryKeys';
import { getPostThumbnail } from '@/src/utils/posts';
import { useAuthUser } from '../../hooks/useAuthUser';
import { colors } from '../../styles/tokens.stylex';
import FollowButton from '../FollowButton';
import OtherUserUsername from '../Username/OtherUserUsername';
import { styles } from './index.stylex';
import ProfileHoverCardSkeleton from './ProfileHoverCardSkeleton';

interface ProfileHoverCardProps {
   userId: string;
   children: React.ReactNode;
}

function formatStat(n: number) {
   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
   if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
   return n.toLocaleString();
}

export default function ProfileHoverCard({ userId, children }: ProfileHoverCardProps) {
   const [open, setOpen] = useState(false);

   const { data: authedUser } = useAuthUser();

   const { data: profile } = useQuery({
      queryKey: queryKeys.profileCard(userId),
      queryFn: async () => getProfileCard({ userId }),
      enabled: open,
      staleTime: Infinity,
   });

   const { data: posts = [] } = useQuery({
      queryKey: queryKeys.profileRecentPosts(userId),
      queryFn: async () => getUserRecentPosts(userId),
      enabled: open,
      staleTime: Infinity,
   });

   const isOwner = authedUser?.id === userId;

   return (
      <HoverCard.Root open={open} onOpenChange={setOpen} openDelay={400} closeDelay={250}>
         <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
         <HoverCard.Portal>
            <HoverCard.Content
               side="bottom"
               sideOffset={6}
               align="start"
               {...stylex.props(styles.content)}
            >
               {!profile ? (
                  <div {...stylex.props(styles.skeletonWrapper)}>
                     <ProfileHoverCardSkeleton />
                  </div>
               ) : (
                  <>
                     <div {...stylex.props(styles.header)}>
                        <UserAvatar
                           src={profile.avatar_url}
                           alt={profile.username}
                           size={56}
                           username={profile.username}
                           userId={profile.id}
                           useHoverCard={false}
                        />
                        <div {...stylex.props(styles.nameBlock)}>
                           <OtherUserUsername
                              userProfile={{ username: profile.username, id: profile.id }}
                              useHoverCard={false}
                              style={styles.username}
                           />
                           {profile.full_name && (
                              <span {...stylex.props(styles.fullName)}>{profile.full_name}</span>
                           )}
                        </div>
                     </div>

                     <div {...stylex.props(styles.statsRow)}>
                        {[
                           { value: profile.posts[0]?.count ?? 0, label: 'posts' },
                           { value: profile.followers[0]?.count ?? 0, label: 'followers' },
                           { value: profile.following[0]?.count ?? 0, label: 'following' },
                        ].map(({ value, label }) => (
                           <div key={label} {...stylex.props(styles.statItem)}>
                              <span {...stylex.props(styles.statValue)}>{formatStat(value)}</span>
                              <span {...stylex.props(styles.statLabel)}>{label}</span>
                           </div>
                        ))}
                     </div>

                     {posts.length > 0 ? (
                        <div {...stylex.props(styles.postsContainer)}>
                           {posts.map(post => {
                              const thumb = getPostThumbnail(post);
                              return thumb ? (
                                 <Link
                                    key={post.id}
                                    href={`/profile/${profile.username}/${post.id}`}
                                 >
                                    <Image
                                       src={thumb}
                                       alt={`${profile.username} post`}
                                       width={120}
                                       height={120}
                                    />
                                 </Link>
                              ) : null;
                           })}
                        </div>
                     ) : (
                        <div {...stylex.props(styles.emptyState)}>
                           <div {...stylex.props(styles.gradientRing)}>
                              <div {...stylex.props(styles.gradientRingInner)}>
                                 <TbCamera size={26} color={colors.textSecondary} />
                              </div>
                           </div>
                           <span {...stylex.props(styles.emptyTitle)}>No posts yet</span>
                           <span {...stylex.props(styles.emptySubtitle)}>
                              When {profile.username} shares photos and reels, you&apos;ll see them
                              here.
                           </span>
                        </div>
                     )}

                     {!isOwner && (
                        <div {...stylex.props(styles.followButtonContainer)}>
                           <FollowButton
                              targetUserId={profile.id}
                              targetIsPrivate={profile.is_private}
                              variant="card"
                           />
                        </div>
                     )}
                  </>
               )}
            </HoverCard.Content>
         </HoverCard.Portal>
      </HoverCard.Root>
   );
}
