import { processImage } from '../lib/imageProcessor';
import { supabase } from '../lib/supabaseAdmin';
import { downloadImage, getPortraitPhoto } from '../lib/unsplash';

const CONCURRENCY = 5;

async function updateAvatar(profileId: string, username: string): Promise<void> {
   const photo = await getPortraitPhoto();
   const buf = await downloadImage(photo.url);
   const processed = await processImage(buf, 'avatar');

   const storagePath = `${profileId}/avatar.webp`;
   const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(storagePath, processed.buffer, { contentType: 'image/webp', upsert: true });
   if (uploadError) throw new Error(`Upload failed for ${username}: ${uploadError.message}`);

   const avatarUrl = supabase.storage.from('avatars').getPublicUrl(storagePath).data.publicUrl;

   const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, avatar_attribution: photo.attribution })
      .eq('id', profileId);
   if (updateError)
      throw new Error(`Profile update failed for ${username}: ${updateError.message}`);

   console.log(`✓ ${username}`);
}

async function main() {
   const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('is_ai', true);

   if (error) throw new Error(`Failed to fetch AI profiles: ${error.message}`);
   if (!profiles?.length) {
      console.log('No AI profiles found.');
      return;
   }

   console.log(`Updating avatars for ${profiles.length} AI profiles...`);

   const queue = [...profiles];
   async function worker() {
      while (queue.length > 0) {
         const profile = queue.shift()!;
         try {
            await updateAvatar(profile.id, profile.username);
         } catch (err) {
            console.error(`✗ ${profile.username}: ${err instanceof Error ? err.message : err}`);
         }
      }
   }

   await Promise.all(Array.from({ length: CONCURRENCY }, worker));
   console.log('Done.');
}

main().catch(err => {
   console.error(err instanceof Error ? err.message : err);
   process.exit(1);
});
