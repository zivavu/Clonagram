'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { SendStickerSchema, validate } from '@/src/lib/validation';

export async function sendSticker(conversationId: string, stickerUrl: string): Promise<void> {
   const { conversationId: cid, stickerUrl: url } = validate(SendStickerSchema, {
      conversationId,
      stickerUrl,
   });
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      sticker_url: url,
   });
   throwIfError({ error }, 'Failed to send sticker');
}
