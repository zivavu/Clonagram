'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { RecordStoryViewSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function recordStoryView(storyId: string) {
   const { storyId: validatedStoryId } = validate(RecordStoryViewSchema, { storyId });
   const { supabase, user } = await getAuthUser();
   const { error } = await supabase
      .from('story_views')
      .upsert(
         { story_id: validatedStoryId, viewer_id: user.id },
         { onConflict: 'story_id,viewer_id', ignoreDuplicates: true },
      );
   throwIfError({ error }, 'Failed to record story view');
}
