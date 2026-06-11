'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { SendStickerSchema, validate } from '@/src/lib/validation';

export async function sendSticker(conversationId: string, stickerUrl: string): Promise<void> {
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
}
