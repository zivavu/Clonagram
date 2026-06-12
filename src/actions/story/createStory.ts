'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import type { StoryMediaResult } from '@/src/components/CreateStoryModal/types';
import { throwIfError } from '@/src/lib/unwrap';
import { getAuthUser } from '../getAuthUser';

export async function createStory(params: { mediaResult: StoryMediaResult }) {
   const { supabase, user } = await getAuthUser();

   const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({ user_id: user.id })
      .select('id')
      .single();

   throwIfError({ error: storyError }, 'Failed to create story');
   if (!story) throw new Error('Failed to create story: no data returned');

   const { mediaResult } = params;

   if (mediaResult.type === 'image') {
      const { error } = await supabase.from('story_images').insert({
         story_id: story.id,
         position: 0,
         url: mediaResult.url,
         blur_data_url: mediaResult.blurDataUrl,
      });
      throwIfError({ error }, 'Failed to insert story image');
   } else {
      const { error } = await supabase.from('story_videos').insert({
         story_id: story.id,
         position: 0,
         mux_asset_id: mediaResult.assetId,
         mux_playback_id: mediaResult.playbackId,
         mux_status: 'ready',
         duration: mediaResult.duration,
      });
      throwIfError({ error }, 'Failed to insert story video');
   }

   revalidatePath('/');
   revalidatePath('/stories/[username]', 'page');
}
