'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from './index.stylex';

interface UserListItemProps {
   avatarUrl: string;
   avatarAlt?: string;
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
   name,
   subtitle,
   rightElement,
   onClick,
   role,
}: UserListItemProps) {
   return (
      <button type="button" {...stylex.props(styles.row)} onClick={onClick} role={role}>
         <div {...stylex.props(styles.info)}>
            <Image src={avatarUrl} alt={avatarAlt} width={44} height={44} {...stylex.props(styles.avatar)} />
            <div {...stylex.props(styles.names)}>
               <div {...stylex.props(styles.name)}>{name}</div>
               <div {...stylex.props(styles.subtitle)}>{subtitle}</div>
            </div>
         </div>
         {rightElement && <div {...stylex.props(styles.right)}>{rightElement}</div>}
      </button>
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
