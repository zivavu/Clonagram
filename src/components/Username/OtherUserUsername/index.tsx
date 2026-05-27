'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import ProfileHoverCard from '@/src/components/ProfileHoverCard';

export type OtherUserUsernameProps = {
   style?: StyleXStyles;
   userProfile: { username: string | null | undefined };
};

export default function OtherUserUsername({ style, userProfile }: OtherUserUsernameProps) {
   const username = userProfile?.username;

   const link = (
      <Link href={`/profile/${username ?? ''}`} {...stylex.props(style)}>
         {username}
      </Link>
   );

   if (!username) return link;

   return <ProfileHoverCard username={username}>{link}</ProfileHoverCard>;
}
