'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { getNotifications } from '@/src/actions/notifications/getNotifications';
import { markNotificationsRead } from '@/src/actions/notifications/markNotificationsRead';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import UserAvatar from '@/src/components/UserAvatar';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import type { NotificationRow } from '@/src/queries/notifications';
import { useNotificationsPortalStore } from '@/src/store/createModalStore';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import DialogOverlay from '../DialogOverlay';
import { styles } from './index.stylex';

type FilterCategory = 'all' | 'people_you_follow' | 'comments' | 'follows';

const FILTER_CATEGORIES: { key: FilterCategory; label: string }[] = [
   { key: 'all', label: 'All' },
   { key: 'people_you_follow', label: 'People you follow' },
   { key: 'comments', label: 'Comments' },
   { key: 'follows', label: 'Follows' },
];

const typeMatchesCategory = (type: string, category: FilterCategory) => {
   switch (category) {
      case 'all':
         return true;
      case 'people_you_follow':
         return type === 'like' || type === 'comment' || type === 'story_like';
      case 'comments':
         return type === 'comment' || type === 'mention' || type === 'tag';
      case 'follows':
         return type === 'follow';
      default:
         return true;
   }
};

function getGroupLabel(date: Date) {
   const now = new Date();
   const diffMs = now.getTime() - date.getTime();
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
   const diffMonths =
      now.getMonth() - date.getMonth() + (now.getFullYear() - date.getFullYear()) * 12;

   if (diffDays < 1) return 'Today';
   if (diffMonths < 1) return 'This month';
   return 'Earlier';
}

function getTargetGroupKey(row: NotificationRow) {
   if (row.type === 'follow') return `${row.type}-${row.id}`;
   return `${row.type}-${row.post_id ?? ''}-${row.story_id ?? ''}-${row.comment_id ?? ''}`;
}

type GroupedNotification = {
   id: string;
   type: NotificationRow['type'];
   actors: NotificationRow['actor'][];
   createdAt: string;
   postId: string | null;
   postAuthorUsername: string | null;
   storyId: string | null;
   commentId: string | null;
};

function groupNotifications(rows: NotificationRow[]): GroupedNotification[] {
   if (rows.length === 0) return [];

   const groups: GroupedNotification[] = [];
   let current: GroupedNotification | null = null;

   for (const row of rows) {
      const groupKey = getTargetGroupKey(row);

      if (current && getTargetGroupKey(rows[rows.indexOf(row) - 1]) === groupKey) {
         current.actors.push(row.actor);
      } else {
         const postData = row.post as { user: { username: string } } | null;
         current = {
            id: row.id,
            type: row.type,
            actors: [row.actor],
            createdAt: row.created_at ?? '',
            postId: row.post_id,
            postAuthorUsername: postData?.user?.username ?? null,
            storyId: row.story_id,
            commentId: row.comment_id,
         };
         groups.push(current);
      }
   }

   return groups;
}

function NotificationRowComponent({
   notification,
   authUsername,
}: {
   notification: GroupedNotification;
   authUsername: string | undefined;
}) {
   const firstActor = notification.actors[0];
   const othersCount = notification.actors.length - 1;
   const actorName = (
      <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
         {firstActor.username}
         {othersCount > 0 && ` and ${othersCount} other${othersCount > 1 ? 's' : ''}`}
      </span>
   );

   const text = (() => {
      switch (notification.type) {
         case 'like':
            return <>{actorName} liked your post.</>;
         case 'comment':
            return <>{actorName} commented on your post.</>;
         case 'follow':
            return <>{actorName} started following you.</>;
         case 'mention':
            return <>{actorName} mentioned you.</>;
         case 'tag':
            return <>{actorName} tagged you in a post.</>;
         case 'story_like':
            return <>{actorName} liked your story.</>;
         case 'story_reply':
            return <>{actorName} replied to your story.</>;
         default:
            return <>{actorName} interacted with you.</>;
      }
   })();

   const inner = (
      <>
         <div {...stylex.props(styles.notificationAvatarWrapper)}>
            <UserAvatar
               src={firstActor.avatar_url}
               alt={firstActor.username}
               size={44}
               username={firstActor.username}
               userId={firstActor.id}
               useHoverCard={false}
               disableLink={true}
            />
         </div>
         <div {...stylex.props(styles.notificationBody)}>
            <div {...stylex.props(styles.notificationText)}>
               {text}
               <span {...stylex.props(styles.timeAgo)}>
                  {formatRelativeTimeShortUnit(notification.createdAt)}
               </span>
            </div>
         </div>
      </>
   );

   const href =
      notification.type === 'follow'
         ? `/profile/${firstActor.username}`
         : (notification.type === 'story_like' || notification.type === 'story_reply') &&
             notification.storyId &&
             authUsername
           ? `/stories/${authUsername}/${notification.storyId}`
           : notification.postAuthorUsername && notification.postId
             ? `/profile/${notification.postAuthorUsername}/${notification.postId}`
             : null;

   if (href) {
      return (
         <Link href={href} {...stylex.props(styles.notificationItem, styles.notificationLink)}>
            {inner}
         </Link>
      );
   }

   return <div {...stylex.props(styles.notificationItem)}>{inner}</div>;
}

export default function NotificationsPortal() {
   const { isOpen, close } = useNotificationsPortalStore();
   const { data: authUser } = useAuthUser();
   const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

   const { data: notificationRows = [] } = useQuery({
      queryKey: authUser?.id ? queryKeys.notifications(authUser.id) : ['notifications'],
      queryFn: () => getNotifications() as Promise<NotificationRow[]>,
      enabled: isOpen && !!authUser?.id,
      staleTime: 30_000,
   });

   useEffect(() => {
      if (isOpen) {
         const unreadIds = notificationRows.filter(n => !n.read).map(n => n.id);
         if (unreadIds.length) {
            markNotificationsRead(unreadIds).catch(() => {});
         }
      }
   }, [isOpen, notificationRows]);

   const grouped = groupNotifications(notificationRows);

   const filtered = grouped.filter(n => typeMatchesCategory(n.type, activeCategory));

   const map = new Map<string, GroupedNotification[]>();
   for (const n of filtered) {
      const label = getGroupLabel(new Date(n.createdAt)) ?? 'Earlier';
      if (!map.has(label)) map.set(label, []);
      map.get(label)?.push(n);
   }
   const order = ['Today', 'This month', 'Earlier'];
   const timeGroups = order
      .map(label => ({ label, items: map.get(label) ?? [] }))
      .filter(g => g.items.length > 0);

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <HiddenDialogDescription>Your recent notifications</HiddenDialogDescription>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Notifications</Dialog.Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <Dialog.Close asChild>
                        <button {...stylex.props(styles.closeButton)} aria-label="Close">
                           <IoCloseOutline size={30} />
                        </button>
                     </Dialog.Close>
                  </div>
               </div>

               <div {...stylex.props(styles.chipsRow)}>
                  {FILTER_CATEGORIES.map(cat => (
                     <button
                        key={cat.key}
                        {...stylex.props(
                           styles.chip,
                           activeCategory === cat.key && styles.chipActive,
                        )}
                        onClick={() => setActiveCategory(cat.key)}
                     >
                        {cat.label}
                     </button>
                  ))}
               </div>

               <div {...stylex.props(styles.list)}>
                  {timeGroups.map(group => (
                     <div key={group.label}>
                        <div {...stylex.props(styles.groupHeader)}>{group.label}</div>
                        {group.items.map(n => (
                           <NotificationRowComponent
                              key={n.id}
                              notification={n}
                              authUsername={authUser?.username}
                           />
                        ))}
                     </div>
                  ))}
                  {filtered.length === 0 && (
                     <div {...stylex.props(styles.emptyState)}>No notifications to show.</div>
                  )}
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
