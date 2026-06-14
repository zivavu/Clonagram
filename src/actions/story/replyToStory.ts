'use server';
import 'server-only';

import { getStoryThumbnail } from '@/src/lib/getStoryThumbnail';
import { ReplyToStorySchema, validate } from '@/src/lib/validation';
import { findOrCreateDirectConversation } from '../dm/findOrCreateDirectConversation';
import { getAuthUser } from '../getAuthUser';
import { sendStoryMessage } from './sendStoryMessage';

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

   const conversationId = await findOrCreateDirectConversation(supabase, user.id, storyOwnerId);

   await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .eq('folder', 'requests');

   await sendStoryMessage(supabase, {
      conversationId,
      senderId: user.id,
      content: trimmed,
      storyId,
      mediaUrl: storyThumbnailUrl,
      ownerId: storyOwnerId,
      notificationType: 'story_reply',
   });
}
