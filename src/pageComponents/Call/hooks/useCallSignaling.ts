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

   useEffect(() => {
      const channel = supabase
         .channel(channelName)
         .on('broadcast', { event: 'signal' }, ({ payload }) => {
            onSignalRef.current(payload as CallSignal);
         })
         .subscribe();

      channelRef.current = channel;

      return () => {
         supabase.removeChannel(channel);
         channelRef.current = null;
      };
   }, [channelName]);

   async function send(signal: CallSignal) {
      await channelRef.current?.send({
         type: 'broadcast',
         event: 'signal',
         payload: signal,
      });
   }

   return { send };
}
