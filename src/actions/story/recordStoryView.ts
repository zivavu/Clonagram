'use server';
import 'server-only';

import { getAuthUser } from '../getAuthUser';

export async function recordStoryView(storyId: string) {
   const { supabase, user } = await getAuthUser();
   await supabase
      .from('story_views')
      .upsert(
         { story_id: storyId, viewer_id: user.id },
         { onConflict: 'story_id,viewer_id', ignoreDuplicates: true },
      );
}
