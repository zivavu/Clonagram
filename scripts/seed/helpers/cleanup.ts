import Mux from '@mux/mux-node';
import { supabase } from '../lib/supabaseAdmin';

function getMuxClient() {
   const tokenId = process.env.MUX_TOKEN_ID;
   const tokenSecret = process.env.MUX_TOKEN_SECRET;
   if (!tokenId || !tokenSecret) throw new Error('Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET');
   return new Mux({ tokenId, tokenSecret });
}

async function deleteMuxAssets(profileIds: string[]) {
   if (!profileIds.length) return;

   const { data: videos } = await supabase
      .from('post_videos')
      .select('mux_asset_id, post:posts!post_id(user_id, is_ai)')
      .not('mux_asset_id', 'is', null);

   const assetIds = (videos ?? [])
      .filter(v => {
         const post = Array.isArray(v.post) ? v.post[0] : v.post;
         return post?.is_ai && post.user_id && profileIds.includes(post.user_id);
      })
      .map(v => v.mux_asset_id as string);

   if (!assetIds.length) return;

   console.log(`Deleting ${assetIds.length} Mux assets...`);
   const mux = getMuxClient();
   await Promise.allSettled(
      assetIds.map(id =>
         mux.video.assets.delete(id).catch(err => {
            console.error(`  Failed to delete Mux asset ${id}: ${err instanceof Error ? err.message : err}`);
         }),
      ),
   );
}

async function deleteStorageFolder(bucket: string, prefix: string) {
   const { data: objects } = await supabase.storage.from(bucket).list(prefix);
   if (!objects?.length) return;

   const files = objects.filter(o => o.id !== null).map(o => `${prefix}/${o.name}`);
   const folders = objects.filter(o => o.id === null).map(o => o.name);

   if (files.length) await supabase.storage.from(bucket).remove(files);
   for (const folder of folders) await deleteStorageFolder(bucket, `${prefix}/${folder}`);
}

async function main() {
   console.log('Fetching AI profile IDs...');
   const { data: aiProfiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_ai', true);

   if (error) throw new Error(error.message);
   const ids = (aiProfiles ?? []).map(p => p.id);
   console.log(`Found ${ids.length} AI profiles.`);

   console.log('Deleting storage files...');
   for (const id of ids) {
      await Promise.all([
         deleteStorageFolder('avatars', id),
         deleteStorageFolder('posts', id),
         deleteStorageFolder('stories', id),
      ]);
   }

   await deleteMuxAssets(ids);

   console.log('Deleting AI content...');
   await supabase.from('follows').delete().in('follower_id', ids);
   await supabase.from('follows').delete().in('following_id', ids);
   await supabase.from('comments').delete().eq('is_ai', true);
   await supabase.from('story_highlights').delete().eq('is_ai', true);
   await supabase.from('stories').delete().eq('is_ai', true);
   await supabase.from('posts').delete().eq('is_ai', true);
   await supabase.from('profiles').delete().eq('is_ai', true);

   console.log('Deleting auth users...');
   for (const id of ids) {
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) console.error(`  Failed to delete ${id}: ${authError.message}`);
   }

   console.log(`✓ Cleanup complete. Deleted ${ids.length} AI profiles and their storage files.`);
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
