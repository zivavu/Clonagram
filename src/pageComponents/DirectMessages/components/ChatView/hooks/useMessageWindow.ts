'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { queryKeys, staleTime } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import {
   type ConversationMessages,
   fetchMessageWindow,
   MESSAGES_PAGE_SIZE,
} from '@/src/queries/messages';

interface UseMessageWindowParams {
   conversationId: string;
   initialMessages: ConversationMessages;
   containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useMessageWindow({
   conversationId,
   initialMessages,
   containerRef,
}: UseMessageWindowParams) {
   const [limit, setLimit] = useState(MESSAGES_PAGE_SIZE);
   const [isLoadingOlder, setIsLoadingOlder] = useState(false);
   const heightBeforePrependRef = useRef<number | null>(null);

   const { data: messages = initialMessages, refetch } = useQuery({
      queryKey: queryKeys.messages(conversationId),
      queryFn: () => fetchMessageWindow(supabase, conversationId, limit),
      initialData: initialMessages,
      staleTime: staleTime.always,
   });

   const hasOlderMessages = messages.length >= limit;

   // biome-ignore lint/correctness/useExhaustiveDependencies: resets the window when switching conversations
   useEffect(() => {
      setLimit(MESSAGES_PAGE_SIZE);
   }, [conversationId]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: refetches only when the window grows past its initial size
   useEffect(() => {
      if (limit === MESSAGES_PAGE_SIZE) return;
      let isStale = false;
      setIsLoadingOlder(true);
      refetch().finally(() => {
         if (!isStale) setIsLoadingOlder(false);
      });
      return () => {
         isStale = true;
      };
   }, [limit]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: runs after older messages are prepended, to keep the viewport anchored
   useEffect(() => {
      const container = containerRef.current;
      const heightBeforePrepend = heightBeforePrependRef.current;
      if (!container || heightBeforePrepend === null) return;
      container.scrollTop += container.scrollHeight - heightBeforePrepend;
      heightBeforePrependRef.current = null;
   }, [messages, containerRef]);

   function loadOlderMessages() {
      const container = containerRef.current;
      if (!container || isLoadingOlder || !hasOlderMessages) return;
      heightBeforePrependRef.current = container.scrollHeight;
      setLimit(current => current + MESSAGES_PAGE_SIZE);
   }

   return { messages, loadOlderMessages, hasOlderMessages, isLoadingOlder };
}
