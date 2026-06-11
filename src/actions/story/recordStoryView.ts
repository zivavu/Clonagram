'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { RecordStoryViewSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function recordStoryView(storyId: string) {
   const { storyId: validatedStoryId } = validate(RecordStoryViewSchema, { storyId });
   const { supabase, user } = await getAuthUser();
   await supabase
      .from('story_views')
      .upsert(
         { story_id: validatedStoryId, viewer_id: user.id },
         { onConflict: 'story_id,viewer_id', ignoreDuplicates: true },
      );
   revalidatePath('/');
   revalidatePath('/stories/[username]', 'page');
}
