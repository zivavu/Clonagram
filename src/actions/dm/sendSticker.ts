'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { SendStickerSchema, validate } from '@/src/lib/validation';

export async function sendSticker(conversationId: string, stickerUrl: string) {
   const { conversationId: cid, stickerUrl: url } = validate(SendStickerSchema, {
      conversationId,
      stickerUrl,
   });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      sticker_url: url,
   });
   throwIfError({ error }, 'Failed to send sticker');

   await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', cid)
      .eq('user_id', user.id)
      .eq('folder', 'requests');
}
