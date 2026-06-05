'use client';

import * as stylex from '@stylexjs/stylex';
import UserAvatar from '@/src/components/UserAvatar';
import { styles } from './index.stylex';

interface UserListItemProps {
   avatarUrl: string | null;
   avatarAlt?: string;
   username: string;
   userId?: string;
   name: React.ReactNode;
   subtitle: React.ReactNode;
   rightElement?: React.ReactNode;
   onClick?: () => void;
   role?: string;
   ariaSelected?: boolean;
}

export function UserListItem({
   avatarUrl,
   avatarAlt = 'User',
   username,
   userId,
   name,
   subtitle,
   rightElement,
}: UserListItemProps) {
   return (
      <div {...stylex.props(styles.row)}>
         <div {...stylex.props(styles.info)}>
            <UserAvatar src={avatarUrl} alt={avatarAlt} size={44} username={username} userId={userId} />
            <div {...stylex.props(styles.names)}>
               <div {...stylex.props(styles.name)}>{name}</div>
               <div {...stylex.props(styles.subtitle)}>{subtitle}</div>
            </div>
         </div>
         {rightElement && <div {...stylex.props(styles.right)}>{rightElement}</div>}
      </div>
   );
}

interface UserListSkeletonProps {
   count?: number;
}

export function UserListSkeleton({ count = 1 }: UserListSkeletonProps) {
   return (
      <>
         {Array.from({ length: count }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders have no stable id
            <div key={`sk-${i}`} {...stylex.props(styles.skeletonRow)} aria-hidden="true">
               <div {...stylex.props(styles.skeletonAvatar)} />
               <div {...stylex.props(styles.skeletonLines)}>
                  <div {...stylex.props(styles.skeletonName)} />
                  <div {...stylex.props(styles.skeletonSubtitle)} />
               </div>
            </div>
         ))}
      </>
   );
}
