'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getMuxClient } from '../../lib/mux';
import { createServerClient } from '../../lib/supabase/server';

export async function deletePost(params: { postId: string }): Promise<void> {
   const supabase = await createServerClient();

   const { data: userData, error: userError } = await supabase.auth.getUser();
   if (userError || !userData.user) {
      throw new Error('Unauthorized');
   }

   const { data: videos } = await supabase
      .from('post_videos')
      .select('mux_asset_id')
      .eq('post_id', params.postId)
      .not('mux_asset_id', 'is', null);

   const { count, error } = await supabase
      .from('posts')
      .delete({ count: 'exact' })
      .eq('id', params.postId);

   if (error) throw new Error(`Failed to delete post: ${error.message}`);
   if (count === 0) throw new Error('Post not found or not authorized');

   if (videos?.length) {
      const mux = getMuxClient();
      await Promise.allSettled(videos.map(v => mux.video.assets.delete(v.mux_asset_id)));
   }

   revalidatePath('/');
}
