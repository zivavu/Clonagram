'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { DeletePostSchema, validate } from '@/src/lib/validation';
import { getMuxClient } from '../../lib/mux';
import { getAuthUser } from '../getAuthUser';

export async function deletePost(params: { postId: string }) {
   const { postId } = validate(DeletePostSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .maybeSingle();
   if (!post) throw new Error('Post not found');
   if (post.user_id !== user.id) throw new Error('Not authorized to delete this post');

   const [{ data: videos }, { data: images }] = await Promise.all([
      supabase
         .from('post_videos')
         .select('mux_asset_id')
         .eq('post_id', postId)
         .not('mux_asset_id', 'is', null),
      supabase.from('post_images').select('url').eq('post_id', postId),
   ]);

   const { error } = await supabase.from('posts').delete().eq('id', postId);

   throwIfError({ error }, 'Failed to delete post');

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
   revalidatePath('/profile');
   revalidatePath('/profile/[username]', 'page');

   await Promise.allSettled(cleanupTasks);
}
