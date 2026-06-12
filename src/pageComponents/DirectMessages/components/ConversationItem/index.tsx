'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import {
   IoMailUnreadOutline,
   IoNotificationsOffOutline,
   IoNotificationsOutline,
   IoTrashOutline,
} from 'react-icons/io5';
import { TbArrowRight } from 'react-icons/tb';
import { deleteConversation } from '@/src/actions/dm/deleteConversation';
import { markConversationUnread } from '@/src/actions/dm/markConversationUnread';
import { moveConversation } from '@/src/actions/dm/moveConversation';
import { toggleMute } from '@/src/actions/dm/toggleMute';
import { toast } from '@/src/components/AppToast';
import DeleteConfirmModal from '@/src/components/DeleteConfirmModal';
import UserAvatar from '@/src/components/UserAvatar';
import { queryKeys } from '@/src/lib/queryKeys';
import type { ConversationSummary } from '@/src/queries/conversations';
import {
   getConversationAvatars,
   getConversationDisplayName,
   isUnread,
} from '@/src/utils/conversations';
import { formatTimestamp } from '@/src/utils/time';
import { styles as sidebarStyles } from '../RecipientsSidebar/index.stylex';
import { styles } from './index.stylex';

interface ConversationItemProps {
   summary: ConversationSummary;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
}

export default function ConversationItem({
   summary,
   authUserId,
   folder,
   currentFolderHref,
}: ConversationItemProps) {
   const queryClient = useQueryClient();
   const conv = summary.conversation;
   const [menuOpen, setMenuOpen] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   const displayName = getConversationDisplayName(conv.participants, authUserId, conv.title);
   const avatars = getConversationAvatars(conv.participants, authUserId);
   const unread = isUnread(summary, authUserId);
   const href = `${currentFolderHref}/${conv.id}`;
   const isMuted = summary.is_muted ?? false;

   const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations(folder, authUserId) });

   const { mutate: markUnread } = useMutation({
      mutationFn: () => markConversationUnread(conv.id),
      onSuccess: invalidate,
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: muteToggle } = useMutation({
      mutationFn: () => toggleMute(conv.id, !isMuted),
      onSuccess: invalidate,
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: doDelete } = useMutation({
      mutationFn: () => deleteConversation(conv.id),
      onSuccess: invalidate,
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: doMove } = useMutation({
      mutationFn: () => moveConversation(conv.id, folder === 'primary' ? 'general' : 'primary'),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.conversations('primary', authUserId),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.conversations('general', authUserId),
         });
      },
      onError: (e: Error) => toast(e.message),
   });

   const showMenuTrigger = isHovered || menuOpen;

   return (
      <li
         {...stylex.props(styles.wrapper, menuOpen && styles.wrapperActive)}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <Link href={href} {...stylex.props(styles.link)}>
            <UserAvatar
               src={avatars[0]?.avatar_url ?? null}
               alt={displayName}
               size={56}
               username={avatars[0]?.username ?? ''}
               userId={avatars[0]?.id}
               useHoverCard={false}
               disableLink={true}
            />
            <div {...stylex.props(sidebarStyles.threadContent)}>
               <span
                  {...stylex.props(
                     sidebarStyles.threadName,
                     unread && sidebarStyles.threadNameUnread,
                  )}
               >
                  {displayName}
               </span>
               <div {...stylex.props(sidebarStyles.threadPreviewRow)}>
                  <span
                     {...stylex.props(
                        sidebarStyles.threadPreview,
                        unread && sidebarStyles.threadPreviewUnread,
                     )}
                  >
                     {conv.last_message_preview ?? 'No messages yet'}
                  </span>
                  {conv.last_message_at && (
                     <span {...stylex.props(sidebarStyles.threadTimestamp)}>
                        {' · '}
                        {formatTimestamp(conv.last_message_at)}
                     </span>
                  )}
               </div>
            </div>
            {unread && <div {...stylex.props(styles.unreadDot)} />}
         </Link>

         <div {...stylex.props(styles.rightActions)}>
            {isMuted && <IoNotificationsOffOutline {...stylex.props(styles.muteIndicator)} />}
            <DropdownMenu.Root onOpenChange={setMenuOpen}>
               <DropdownMenu.Trigger asChild>
                  <button
                     type="button"
                     {...stylex.props(
                        styles.menuTrigger,
                        showMenuTrigger && styles.menuTriggerVisible,
                     )}
                     aria-label="Conversation options"
                  >
                     <HiOutlineDotsHorizontal />
                  </button>
               </DropdownMenu.Trigger>
               <DropdownMenu.Portal>
                  <DropdownMenu.Content
                     {...stylex.props(styles.menuContent)}
                     side="bottom"
                     align="center"
                  >
                     <DropdownMenu.Item
                        {...stylex.props(styles.menuItem)}
                        onSelect={() => markUnread()}
                     >
                        <IoMailUnreadOutline {...stylex.props(styles.menuItemIcon)} />
                        Mark as unread
                     </DropdownMenu.Item>

                     <DropdownMenu.Item
                        {...stylex.props(styles.menuItem)}
                        onSelect={() => muteToggle()}
                     >
                        {isMuted ? (
                           <IoNotificationsOutline {...stylex.props(styles.menuItemIcon)} />
                        ) : (
                           <IoNotificationsOffOutline {...stylex.props(styles.menuItemIcon)} />
                        )}
                        {isMuted ? 'Unmute' : 'Mute'}
                     </DropdownMenu.Item>

                     {folder !== 'requests' && (
                        <DropdownMenu.Item
                           {...stylex.props(styles.menuItem)}
                           onSelect={() => doMove()}
                        >
                           <TbArrowRight {...stylex.props(styles.menuItemIcon)} />
                           {folder === 'primary' ? 'Move to General' : 'Move to Primary'}
                        </DropdownMenu.Item>
                     )}

                     <DropdownMenu.Item
                        {...stylex.props(styles.menuItem, styles.menuItemDanger)}
                        onSelect={() => setShowDeleteConfirm(true)}
                     >
                        <IoTrashOutline {...stylex.props(styles.menuItemIcon)} />
                        Delete
                     </DropdownMenu.Item>
                  </DropdownMenu.Content>
               </DropdownMenu.Portal>
            </DropdownMenu.Root>
         </div>

         <DeleteConfirmModal
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            onConfirm={() => doDelete()}
            title="Delete chat from inbox?"
            description="This will remove the chat from your inbox and erase the chat history. To stop receiving new messages from this account, first block the account then delete the chat."
         />
      </li>
   );
}
