'use server';
import 'server-only';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getStoryThumbnail } from '@/src/lib/getStoryThumbnail';
import { ReactToStorySchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function toggleStoryReaction(
   storyId: string,
   emoji: string,
): Promise<{ liked: boolean }> {
   const { storyId: validatedStoryId, emoji: validatedEmoji } = validate(ReactToStorySchema, {
      storyId,
      emoji,
   });
   const { supabase, user } = await getAuthUser();

   const { data: story } = await supabase
      .from('stories')
      .select('user_id')
      .eq('id', validatedStoryId)
      .single();

   if (!story) throw new Error('Story not found');

   const storyOwnerId = story.user_id;

   const { data: existingReaction } = await supabase
      .from('story_reactions')
      .select('emoji')
      .eq('story_id', validatedStoryId)
      .eq('user_id', user.id)
      .maybeSingle();

   if (existingReaction) {
      await supabase
         .from('story_reactions')
         .delete()
         .eq('story_id', validatedStoryId)
         .eq('user_id', user.id);

      const { data: likeMessage } = await supabase
         .from('messages')
         .select('id')
         .eq('story_id', validatedStoryId)
         .eq('sender_id', user.id)
         .maybeSingle();

      if (likeMessage) {
         await supabase.from('messages').update({ is_deleted: true }).eq('id', likeMessage.id);
      }

      revalidatePath('/');
      revalidatePath('/stories/[username]', 'page');
      return { liked: false };
   }

   await supabase.from('story_reactions').insert({
      story_id: validatedStoryId,
      user_id: user.id,
      emoji: validatedEmoji,
   });

   const storyThumbnailUrl = await getStoryThumbnail(supabase, validatedStoryId);

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
      if (convError) throw convError;

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
      if (partError) throw partError;
   }

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: validatedEmoji,
      story_id: validatedStoryId,
      media_url: storyThumbnailUrl,
   });
   if (msgError) throw msgError;

   const { error: notifError } = await supabase.from('notifications').insert({
      user_id: storyOwnerId,
      actor_id: user.id,
      type: 'story_like',
      story_id: validatedStoryId,
   });
   if (notifError) throw notifError;

   revalidatePath('/');
   revalidatePath('/stories/[username]', 'page');
   return { liked: true };
}
