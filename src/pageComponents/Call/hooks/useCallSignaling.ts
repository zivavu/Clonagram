'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/src/lib/supabase/client';

export type CallSignalType =
   | 'invite'
   | 'accept'
   | 'decline'
   | 'join'
   | 'offer'
   | 'answer'
   | 'ice-candidate'
   | 'leave'
   | 'end';

export interface CallSignal {
   type: CallSignalType;
   fromUserId: string;
   toUserId?: string;
   conversationId: string;
   callType: 'audio' | 'video';
   sdp?: RTCSessionDescriptionInit;
   candidate?: RTCIceCandidateInit;
   callerName?: string;
   callerAvatar?: string | null;
}

export function useCallSignaling(channelName: string, onSignal: (signal: CallSignal) => void) {
   const onSignalRef = useRef(onSignal);
   onSignalRef.current = onSignal;

   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
   const waitersRef = useRef<Array<() => void>>([]);
   const subscribedRef = useRef(false);

   useEffect(() => {
      subscribedRef.current = false;

      const channel = supabase
         .channel(channelName)
         .on('broadcast', { event: 'signal' }, ({ payload }) => {
            onSignalRef.current(payload as CallSignal);
         })
         .subscribe(status => {
            if (status === 'SUBSCRIBED') {
               subscribedRef.current = true;
               for (const resolve of waitersRef.current) resolve();
               waitersRef.current = [];
            }
         });

      channelRef.current = channel;

      return () => {
         supabase.removeChannel(channel);
         channelRef.current = null;
         subscribedRef.current = false;
      };
   }, [channelName]);

   async function send(signal: CallSignal) {
      if (!subscribedRef.current) {
         await new Promise<void>(resolve => {
            waitersRef.current.push(resolve);
         });
      }
      await channelRef.current?.send({
         type: 'broadcast',
         event: 'signal',
         payload: signal,
      });
   }

   return { send };
}
