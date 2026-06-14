'use client';

import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { acceptRequest } from '@/src/actions/dm/acceptRequest';
import { blockAndDeleteRequest } from '@/src/actions/dm/blockAndDeleteRequest';
import { deleteRequest } from '@/src/actions/dm/deleteRequest';
import { toast } from '@/src/components/AppToast';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { styles } from '../../index.stylex';

interface RequestActionsProps {
   conversationId: string;
   authUserId: string;
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
   authUserId,
   senderUserId,
   senderProfile,
}: RequestActionsProps) {
   const router = useRouter();
   const queryClient = useQueryClient();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const channel = supabase
         .channel(`follow-auto-accept-${authUserId}-${senderUserId}`)
         .on(
            'postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'follows',
               filter: `follower_id=eq.${authUserId}`,
            },
            async payload => {
               if (payload.new.following_id === senderUserId) {
                  try {
                     await acceptRequest({ conversationId });
                  } catch (e) {
                     toast(e instanceof Error ? e.message : 'Something went wrong.');
                  }
               }
            },
         )
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [authUserId, senderUserId, conversationId]);

   async function run(action: () => Promise<void>) {
      setLoading(true);
      try {
         await action();
         await queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
         router.push('/direct/requests');
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
               onClick={() => run(() => blockAndDeleteRequest({ conversationId, senderUserId }))}
            >
               Block
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               type="button"
               {...stylex.props(styles.requestButton, styles.requestButtonDanger)}
               disabled={loading}
               onClick={() => run(() => deleteRequest({ conversationId }))}
            >
               Delete
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               type="button"
               {...stylex.props(styles.requestButton)}
               disabled={loading}
               onClick={() => run(() => acceptRequest({ conversationId }))}
            >
               Accept
            </button>
         </div>
      </div>
   );
}
