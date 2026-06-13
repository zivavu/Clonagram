'use server';
import 'server-only';

import { getStoryThumbnail } from '@/src/lib/getStoryThumbnail';
import { ReactToStorySchema, validate } from '@/src/lib/validation';
import { findOrCreateDirectConversation } from '../dm/findOrCreateDirectConversation';
import { getAuthUser } from '../getAuthUser';
import { sendStoryMessage } from './sendStoryMessage';

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

      return { liked: false };
   }

   await supabase.from('story_reactions').insert({
      story_id: validatedStoryId,
      user_id: user.id,
      emoji: validatedEmoji,
   });

   const storyThumbnailUrl = await getStoryThumbnail(supabase, validatedStoryId);

   const conversationId = await findOrCreateDirectConversation(supabase, user.id, storyOwnerId);

   await sendStoryMessage(supabase, {
      conversationId,
      senderId: user.id,
      content: validatedEmoji,
      storyId: validatedStoryId,
      mediaUrl: storyThumbnailUrl,
      ownerId: storyOwnerId,
      notificationType: 'story_like',
   });

   return { liked: true };
}
