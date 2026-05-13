'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import UserAvatar from '@/src/components/UserAvatar';
import type { Notification, NotificationType } from '@/src/mocks/notifications';
import { NOTIFICATIONS, VERIFIED_USERS } from '@/src/mocks/notifications';
import { useNotificationsPortalStore } from '@/src/store/useNotificationsPortalStore';
import { styles } from './index.stylex';

type FilterCategory = 'all' | 'people_you_follow' | 'comments' | 'follows';

const FILTER_CATEGORIES: { key: FilterCategory; label: string }[] = [
   { key: 'all', label: 'All' },
   { key: 'people_you_follow', label: 'People you follow' },
   { key: 'comments', label: 'Comments' },
   { key: 'follows', label: 'Follows' },
];

const typeMatchesCategory = (type: NotificationType, category: FilterCategory): boolean => {
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

function formatTimeAgo(dateString: string): string {
   const date = new Date(dateString);
   const now = new Date();
   const diffMs = now.getTime() - date.getTime();
   const diffMins = Math.floor(diffMs / (1000 * 60));
   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

   if (diffMins < 1) return 'now';
   if (diffMins < 60) return `${diffMins}m`;
   if (diffHours < 24) return `${diffHours}h`;
   if (diffDays < 7) return `${diffDays}d`;
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getGroupLabel(dateString: string): string | null {
   const date = new Date(dateString);
   const now = new Date();
   const diffMs = now.getTime() - date.getTime();
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
   const diffMonths =
      now.getMonth() - date.getMonth() + (now.getFullYear() - date.getFullYear()) * 12;

   if (diffDays < 1) return 'Today';
   if (diffMonths < 1) return 'This month';
   return 'Earlier';
}

function getNotificationText(notification: Notification): React.ReactNode {
   const { actors, type, target, message } = notification;
   const firstActor = actors[0];
   const othersCount = actors.length - 1;
   const isVerified = VERIFIED_USERS.has(firstActor.username);

   const actorName = (
      <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
         {firstActor.username}
         {isVerified && (
            <MdVerified style={{ color: 'rgb(0, 149, 246)', fontSize: 14, flexShrink: 0 }} />
         )}
         {othersCount > 0 && ` and ${othersCount} other${othersCount > 1 ? 's' : ''}`}
      </span>
   );

   switch (type) {
      case 'like':
         return (
            <>
               {actorName} liked your {target?.type ?? 'post'}.
            </>
         );
      case 'comment':
         return (
            <>
               {actorName} commented: {message}
            </>
         );
      case 'follow':
         return <>{actorName} started following you.</>;
      case 'mention':
         return (
            <>
               {actorName} mentioned you in a comment: {message}
            </>
         );
      case 'tag':
         return (
            <>
               {actorName} tagged you in a {target?.type ?? 'post'}.
            </>
         );
      case 'story_like':
         return <>{actorName} liked your story.</>;
      default:
         return <>{actorName} interacted with you.</>;
   }
}

function NotificationItem({ notification }: { notification: Notification }) {
   const firstActor = notification.actors[0];

   return (
      <div {...stylex.props(styles.notificationItem)}>
         <div {...stylex.props(styles.notificationAvatarWrapper)}>
            <UserAvatar src={firstActor.avatar_url} alt={firstActor.username} size={44} />
            {notification.actors.length > 1 && (
               <div {...stylex.props(styles.secondaryAvatar)}>
                  <UserAvatar
                     src={notification.actors[1].avatar_url}
                     alt={notification.actors[1].username}
                     size={20}
                  />
               </div>
            )}
         </div>
         <div {...stylex.props(styles.notificationBody)}>
            <div {...stylex.props(styles.notificationText)}>
               {getNotificationText(notification)}
               <span {...stylex.props(styles.timeAgo)}>
                  {formatTimeAgo(notification.createdAt)}
               </span>
            </div>
         </div>
         {notification.type === 'follow' ? (
            <button {...stylex.props(styles.followButton)}>Follow</button>
         ) : notification.target?.thumbnailUrl ? (
            <Image
               src={notification.target.thumbnailUrl}
               alt="Post"
               width={44}
               height={44}
               {...stylex.props(styles.targetThumbnail)}
            />
         ) : null}
      </div>
   );
}

export default function NotificationsPortal() {
   const { isOpen, close } = useNotificationsPortalStore();
   const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
   const [showFilterPanel, setShowFilterPanel] = useState(false);
   const [filterState, setFilterState] = useState({
      tagsMentions: false,
      comments: false,
      follows: false,
      verified: false,
      following: false,
   });
   const [appliedFilter, setAppliedFilter] = useState(filterState);

   const filteredNotifications = NOTIFICATIONS.filter(n => {
      if (!typeMatchesCategory(n.type, activeCategory)) return false;

      const anyCategoryChecked =
         appliedFilter.tagsMentions || appliedFilter.comments || appliedFilter.follows;
      if (anyCategoryChecked) {
         let matches = false;
         if (appliedFilter.tagsMentions && (n.type === 'mention' || n.type === 'tag'))
            matches = true;
         if (
            appliedFilter.comments &&
            (n.type === 'comment' || n.type === 'mention' || n.type === 'tag')
         )
            matches = true;
         if (appliedFilter.follows && n.type === 'follow') matches = true;
         if (!matches) return false;
      }

      if (appliedFilter.verified && !n.actors.some(a => VERIFIED_USERS.has(a.username)))
         return false;

      return true;
   });

   const groups: { label: string; items: Notification[] }[] = [];
   const groupMap = new Map<string, Notification[]>();
   for (const n of filteredNotifications) {
      const label = getGroupLabel(n.createdAt) ?? 'Earlier';
      if (!groupMap.has(label)) groupMap.set(label, []);
      groupMap.get(label)?.push(n);
   }
   const order = ['Today', 'This month', 'Earlier'];
   for (const label of order) {
      const items = groupMap.get(label);
      if (items) groups.push({ label, items });
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} onClick={close} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <Dialog.Description style={{ display: 'none' }}>
                  Your recent notifications
               </Dialog.Description>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Notifications</Dialog.Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                     <button
                        {...stylex.props(styles.filterButton)}
                        onClick={() => setShowFilterPanel(prev => !prev)}
                        aria-label="Filter notifications"
                     >
                        Filter
                     </button>
                     <Dialog.Close asChild>
                        <button {...stylex.props(styles.closeButton)} aria-label="Close">
                           <IoCloseOutline style={{ fontSize: 30 }} />
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

               {showFilterPanel && (
                  <div {...stylex.props(styles.filterPanel)}>
                     <div {...stylex.props(styles.filterSectionTitle)}>Categories</div>
                     <label {...stylex.props(styles.filterOption)}>
                        Tags & mentions
                        <input
                           type="checkbox"
                           checked={filterState.tagsMentions}
                           onChange={e =>
                              setFilterState(s => ({ ...s, tagsMentions: e.target.checked }))
                           }
                           {...stylex.props(styles.filterCheckbox)}
                        />
                     </label>
                     <label {...stylex.props(styles.filterOption)}>
                        Comments
                        <input
                           type="checkbox"
                           checked={filterState.comments}
                           onChange={e =>
                              setFilterState(s => ({ ...s, comments: e.target.checked }))
                           }
                           {...stylex.props(styles.filterCheckbox)}
                        />
                     </label>
                     <label {...stylex.props(styles.filterOption)}>
                        Follows
                        <input
                           type="checkbox"
                           checked={filterState.follows}
                           onChange={e =>
                              setFilterState(s => ({ ...s, follows: e.target.checked }))
                           }
                           {...stylex.props(styles.filterCheckbox)}
                        />
                     </label>

                     <div {...stylex.props(styles.filterDivider)} />

                     <div {...stylex.props(styles.filterSectionTitle)}>Account types</div>
                     <label {...stylex.props(styles.filterOption)}>
                        Verified
                        <input
                           type="checkbox"
                           checked={filterState.verified}
                           onChange={e =>
                              setFilterState(s => ({ ...s, verified: e.target.checked }))
                           }
                           {...stylex.props(styles.filterCheckbox)}
                        />
                     </label>
                     <label {...stylex.props(styles.filterOption)}>
                        Following
                        <input
                           type="checkbox"
                           checked={filterState.following}
                           onChange={e =>
                              setFilterState(s => ({ ...s, following: e.target.checked }))
                           }
                           {...stylex.props(styles.filterCheckbox)}
                        />
                     </label>

                     <button
                        {...stylex.props(styles.applyButton)}
                        onClick={() => {
                           setAppliedFilter({ ...filterState });
                           setShowFilterPanel(false);
                        }}
                     >
                        Apply
                     </button>
                  </div>
               )}

               <div {...stylex.props(styles.list)}>
                  {groups.map(group => (
                     <div key={group.label}>
                        <div {...stylex.props(styles.groupHeader)}>{group.label}</div>
                        {group.items.map(notification => (
                           <NotificationItem key={notification.id} notification={notification} />
                        ))}
                     </div>
                  ))}
                  {filteredNotifications.length === 0 && (
                     <div {...stylex.props(styles.emptyState)}>No notifications to show.</div>
                  )}
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
