import { notFound, redirect } from 'next/navigation';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { getConversationQuery } from '@/src/queries/conversations';
import { getConversationAvatars, getConversationDisplayName } from '@/src/utils/conversations';

export async function loadCallData(conversationId: string) {
   const profile = await getAuthProfile();
   if (!profile) redirect('/login');

   const supabase = await createServerClient();
   const { data: conversation, error } = await getConversationQuery(supabase, conversationId);
   if (error || !conversation) notFound();

   const participants = conversation.participants ?? [];
   const otherParticipants = participants
      .filter(p => p.user_id !== profile.id)
      .map(p => ({
         id: p.user_id,
         username: p.user?.username ?? '',
         avatar_url: p.user?.avatar_url ?? null,
      }));

   const displayName = getConversationDisplayName(participants, profile.id, conversation.title);
   const avatars = getConversationAvatars(participants, profile.id);
   const displayAvatar = avatars[0]?.avatar_url ?? null;

   return {
      authUserId: profile.id,
      participants: otherParticipants,
      displayName,
      displayAvatar,
   };
}
