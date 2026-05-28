'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import ProfileHoverCard from '@/src/components/ProfileHoverCard';

export type OtherUserUsernameProps = {
   style?: StyleXStyles;
   userProfile: { username: string | null | undefined; id: string };
};

export default function OtherUserUsername({ style, userProfile }: OtherUserUsernameProps) {
   const username = userProfile?.username;

   const link = (
      <Link href={`/profile/${userProfile.username ?? ''}`} {...stylex.props(style)}>
         {username}
      </Link>
   );

   if (!username) return link;

   return (
      <ProfileHoverCard userId={userProfile.id} userName={username}>
         {link}
      </ProfileHoverCard>
   );
}
