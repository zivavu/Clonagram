'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { SiThreads } from 'react-icons/si';
import { TbCamera } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type UserRecentPost, userRecentPostsQuery } from '@/src/queries/posts';
import { userProfileCardQuery } from '@/src/queries/userProfiles';
import { colors } from '../../styles/tokens.stylex';
import ProfileHoverCardSkeleton from './ProfileHoverCardSkeleton';
import { styles } from './index.stylex';

interface ProfileHoverCardProps {
   username: string;
   children: React.ReactNode;
}

function formatStat(n: number): string {
   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
   if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
   return n.toLocaleString();
}

function getPostThumbnail(post: UserRecentPost): string | null {
   const firstImage = [...post.images].sort((a, b) => a.position - b.position)[0];
   if (firstImage) return firstImage.url;
   const firstVideo = [...post.videos].sort((a, b) => a.position - b.position)[0];
   if (firstVideo?.mux_playback_id) {
      return `https://image.mux.com/${firstVideo.mux_playback_id}/thumbnail.jpg`;
   }
   return null;
}

export default function ProfileHoverCard({ username, children }: ProfileHoverCardProps) {
   const [open, setOpen] = useState(false);

   const { data: profile } = useQuery({
      queryKey: ['profile-card', username],
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await userProfileCardQuery(supabase, username);
         if (error) throw error;
         return data;
      },
      enabled: open,
      staleTime: 5 * 60 * 1000,
   });

   const { data: posts = [] } = useQuery({
      queryKey: ['profile-recent-posts', profile?.id],
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await userRecentPostsQuery(supabase, profile?.id ?? '');
         if (error) throw error;
         return data ?? [];
      },
      enabled: !!profile?.id,
      staleTime: 5 * 60 * 1000,
   });

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
                  <ProfileHoverCardSkeleton />
               ) : (
                  <>
                     <div {...stylex.props(styles.header)}>
                        <UserAvatar src={profile.avatar_url} alt={profile.username} size={56} />
                        <div {...stylex.props(styles.nameBlock)}>
                           <span {...stylex.props(styles.username)}>{profile.username}</span>
                           {profile.full_name && (
                              <span {...stylex.props(styles.fullName)}>{profile.full_name}</span>
                           )}
                           <div {...stylex.props(styles.handleRow)}>
                              <SiThreads size={11} color={colors.textSecondary} />
                              <span {...stylex.props(styles.handle)}>{profile.username}</span>
                           </div>
                        </div>
                     </div>

                     <div {...stylex.props(styles.statsRow)}>
                        {(
                           [
                              { value: profile.posts_count, label: 'posts' },
                              { value: profile.followers_count, label: 'followers' },
                              { value: profile.following_count, label: 'following' },
                           ] as const
                        ).map(({ value, label }) => (
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
                                 <Image
                                    key={post.id}
                                    src={thumb}
                                    alt={`${username} post`}
                                    width={120}
                                    height={120}
                                    {...stylex.props(styles.postThumb)}
                                 />
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

                     <div {...stylex.props(styles.followButtonContainer)}>
                        <button type="button" {...stylex.props(styles.followButton)}>
                           Follow
                        </button>
                     </div>
                  </>
               )}
            </HoverCard.Content>
         </HoverCard.Portal>
      </HoverCard.Root>
   );
}
