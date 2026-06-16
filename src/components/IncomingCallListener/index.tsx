'use client';

import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { supabase } from '@/src/lib/supabase/client';
import type { CallSignal } from '@/src/pageComponents/Call/hooks/useCallSignaling';
import UserAvatar from '../UserAvatar';
import { styles } from './index.stylex';

interface IncomingCall {
   conversationId: string;
   callType: 'audio' | 'video';
   callerName: string;
   callerAvatar: string | null;
   callerUserId: string;
}

export default function IncomingCallListener() {
   const { data: authUser } = useAuthUser();
   const router = useRouter();
   const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      if (!authUser?.id) return;

      const channel = supabase
         .channel(`user-call:${authUser.id}`)
         .on('broadcast', { event: 'signal' }, ({ payload }) => {
            const signal = payload as CallSignal;
            if (signal.type !== 'invite') return;

            setIncomingCall({
               conversationId: signal.conversationId,
               callType: signal.callType,
               callerName: signal.callerName ?? 'Someone',
               callerAvatar: signal.callerAvatar ?? null,
               callerUserId: signal.fromUserId,
            });

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
               setIncomingCall(null);
            }, 30000);
         })
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, [authUser?.id]);

   function handleAccept() {
      if (!incomingCall) return;
      setIncomingCall(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      router.push(`/direct/${incomingCall.conversationId}/call?type=${incomingCall.callType}`);
   }

   function handleDecline() {
      setIncomingCall(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
   }

   if (!incomingCall) return null;

   const typeLabel =
      incomingCall.callType === 'video' ? 'Incoming video call' : 'Incoming audio call';

   return (
      <div {...stylex.props(styles.overlay)}>
         <div {...stylex.props(styles.modal)}>
            <UserAvatar
               src={incomingCall.callerAvatar}
               alt={incomingCall.callerName}
               size={72}
               username={incomingCall.callerName}
            />
            <div {...stylex.props(styles.callerName)}>{incomingCall.callerName}</div>
            <div {...stylex.props(styles.callTypeLabel)}>{typeLabel}</div>
            <div {...stylex.props(styles.actions)}>
               <button {...stylex.props(styles.acceptBtn)} onClick={handleAccept}>
                  Accept
               </button>
               <button {...stylex.props(styles.declineBtn)} onClick={handleDecline}>
                  Decline
               </button>
            </div>
         </div>
      </div>
   );
}
