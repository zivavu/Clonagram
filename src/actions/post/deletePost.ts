'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { DeletePostSchema, validate } from '@/src/lib/validation';
import { getMuxClient } from '../../lib/mux';
import { getAuthUser } from '../getAuthUser';

export async function deletePostAction(params: { postId: string }) {
   const { postId } = validate(DeletePostSchema, params);
   const { supabase } = await getAuthUser();

   const [{ data: videos }, { data: images }] = await Promise.all([
      supabase
         .from('post_videos')
         .select('mux_asset_id')
         .eq('post_id', postId)
         .not('mux_asset_id', 'is', null),
      supabase.from('post_images').select('url').eq('post_id', postId),
   ]);

   const { count, error } = await supabase
      .from('posts')
      .delete({ count: 'exact' })
      .eq('id', postId);

   if (error) throw new Error(`Failed to delete post: ${error.message}`);
   if (count === 0) throw new Error('Post not found or not authorized');

   const cleanupTasks: Promise<unknown>[] = [];

   if (videos?.length) {
      const mux = getMuxClient();
      cleanupTasks.push(
         ...videos
            .map(v => v.mux_asset_id)
            .filter((id): id is string => id !== null)
            .map(id => mux.video.assets.delete(id)),
      );
   }

   if (images?.length) {
      const storagePaths = images
         .map(img => {
            const match = img.url.match(/\/storage\/v1\/object\/public\/(.+)/);
            return match ? match[1] : null;
         })
         .filter((p): p is string => p !== null);

      if (storagePaths.length) {
         cleanupTasks.push(
            supabase.storage.from('posts').remove(storagePaths.map(p => p.replace(/^posts\//, ''))),
         );
      }
   }

   await Promise.allSettled(cleanupTasks);

   revalidatePath('/');
   revalidatePath('/[username]', 'page');
   revalidatePath('/reels');
}
