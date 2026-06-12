'use server';
import 'server-only';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getStoryThumbnail } from '@/src/lib/getStoryThumbnail';
import { throwIfError } from '@/src/lib/unwrap';
import { ReplyToStorySchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function replyToStory(params: { storyId: string; content: string }) {
   const { storyId, content } = validate(ReplyToStorySchema, params);
   const trimmed = content.trim();
   const { supabase, user } = await getAuthUser();

   const { data: story } = await supabase
      .from('stories')
      .select('user_id')
      .eq('id', storyId)
      .single();

   if (!story) throw new Error('Story not found');

   const storyOwnerId = story.user_id;

   const storyThumbnailUrl = await getStoryThumbnail(supabase, storyId);

   const { data: existingId } = await supabase.rpc('find_direct_conversation', {
      p_user_a: user.id,
      p_user_b: storyOwnerId,
   });
   let conversationId = existingId as string | null;

   if (!conversationId) {
      conversationId = randomUUID();
      const { error: convError } = await supabase
         .from('conversations')
         .insert({ id: conversationId, title: null });
      throwIfError({ error: convError }, 'Failed to create conversation');

      const { data: followerData } = await supabase
         .from('follows')
         .select('follower_id')
         .eq('follower_id', storyOwnerId)
         .eq('following_id', user.id)
         .eq('status', 'accepted')
         .single();

      const folder = followerData ? 'primary' : 'requests';

      const { error: partError } = await supabase.from('conversation_participants').insert([
         { conversation_id: conversationId, user_id: user.id, role: 'admin', folder: 'primary' },
         {
            conversation_id: conversationId,
            user_id: storyOwnerId,
            role: 'member',
            folder,
         },
      ]);
      throwIfError({ error: partError }, 'Failed to add conversation participants');
   }

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: trimmed,
      story_id: storyId,
      media_url: storyThumbnailUrl,
   });
   throwIfError({ error: msgError }, 'Failed to insert message');

   const { error: notifError } = await supabase.from('notifications').insert({
      user_id: storyOwnerId,
      actor_id: user.id,
      type: 'story_reply',
      story_id: storyId,
   });
   throwIfError({ error: notifError }, 'Failed to insert notification');

   revalidatePath('/');
   revalidatePath('/stories/[username]', 'page');
}
