'use client';

import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { acceptRequest } from '@/src/actions/dm/acceptRequest';
import { blockAndDeleteRequest } from '@/src/actions/dm/blockAndDeleteRequest';
import { deleteRequest } from '@/src/actions/dm/deleteRequest';
import { toast } from '@/src/components/AppToast';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { styles } from '../../index.stylex';

interface RequestActionsProps {
   conversationId: string;
   senderUserId: string;
   senderProfile: {
      id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
   } | null;
}

export default function RequestActions({
   conversationId,
   senderUserId,
   senderProfile,
}: RequestActionsProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   async function run(action: () => Promise<void>, redirectToRequests = false) {
      setLoading(true);
      try {
         await action();
         router.push(redirectToRequests ? '/direct/requests' : '/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Something went wrong.');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div {...stylex.props(styles.requestActionsContainer)}>
         {senderProfile && (
            <div {...stylex.props(styles.requestInfoSection)}>
               <div {...stylex.props(styles.requestInfoTitle)}>
                  Accept message request from{' '}
                  <OtherUserUsername
                     style={styles.requestInfoUsername}
                     userProfile={senderProfile}
                  />
                  ?
               </div>
               <div {...stylex.props(styles.requestInfoSubtitle)}>
                  If you accept, they will also be able to call you and see info such as your
                  activity status and when you&apos;ve read messages.
               </div>
            </div>
         )}
         <div {...stylex.props(styles.requestButtonsRow)}>
            <button
               type="button"
               {...stylex.props(styles.requestButton)}
               disabled={loading}
               onClick={() => run(() => blockAndDeleteRequest(conversationId, senderUserId), true)}
            >
               Block
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               type="button"
               {...stylex.props(styles.requestButton, styles.requestButtonDanger)}
               disabled={loading}
               onClick={() => run(() => deleteRequest(conversationId), true)}
            >
               Delete
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               type="button"
               {...stylex.props(styles.requestButton)}
               disabled={loading}
               onClick={() => run(() => acceptRequest(conversationId))}
            >
               Accept
            </button>
         </div>
      </div>
   );
}
