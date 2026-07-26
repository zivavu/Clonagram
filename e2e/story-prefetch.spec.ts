import { expect, test } from '@playwright/test';
import { createTestImageBuffer, getUserId, makeServiceClient, USER_1_EMAIL } from './helpers';

const STORAGE_PREFIX = 'e2e-prefetch';
const createdStoryIds: string[] = [];
const uploadedPaths: string[] = [];

test.afterAll(async () => {
   const supabase = makeServiceClient();
   if (createdStoryIds.length > 0) {
      await supabase.from('stories').delete().in('id', createdStoryIds);
   }
   if (uploadedPaths.length > 0) {
      await supabase.storage.from('stories').remove(uploadedPaths);
   }
});

test('upcoming story media is fetched before the viewer clicks to it', async ({ page }) => {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   if (!userId) throw new Error(`Missing e2e user ${USER_1_EMAIL}`);

   // Three media on one entry, so the viewer opens on the first and the next
   // two are the ones the prefetch should warm. The images have to live on the
   // Supabase host — the CSP blocks other image origins, so a prefetch of an
   // outside URL would fail and prove nothing.
   await page.goto('/');
   for (const [i, color] of ['#111827', '#7c3aed', '#059669'].entries()) {
      const buffer = await createTestImageBuffer(page, color);
      const path = `${STORAGE_PREFIX}/${Date.now()}-${i}.png`;
      const { error: uploadError } = await supabase.storage
         .from('stories')
         .upload(path, buffer, { contentType: 'image/png', upsert: true });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);

      const { data: story, error } = await supabase
         .from('stories')
         .insert({ user_id: userId })
         .select('id')
         .single();
      if (error) throw error;
      createdStoryIds.push(story.id);

      const { error: imageError } = await supabase.from('story_images').insert({
         story_id: story.id,
         position: 0,
         url: supabase.storage.from('stories').getPublicUrl(path).data.publicUrl,
      });
      if (imageError) throw imageError;
   }

   // Read back in the order the viewer groups them, so extra stories left by
   // another spec cannot shift which media count as "upcoming".
   const { data: activeStories, error: readError } = await supabase
      .from('stories')
      .select('id, created_at, story_images(url)')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true });
   if (readError) throw readError;

   const orderedUrls = (activeStories ?? [])
      .map(story => story.story_images[0]?.url)
      .filter((url): url is string => !!url);
   expect(orderedUrls.length).toBeGreaterThanOrEqual(3);

   const requested = new Set<string>();
   page.on('request', request => requested.add(request.url()));

   await page.goto('/stories/e2euser1');
   await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible({
      timeout: 10000,
   });

   // Both lookahead media should be on the wire without a single click. The
   // window has to stay under PICTURE_DURATION (6s) — past that the viewer
   // auto-advances and would request them on its own, which would pass whether
   // or not anything was prefetched.
   await expect.poll(() => requested.has(orderedUrls[1]), { timeout: 3000 }).toBe(true);
   expect(requested.has(orderedUrls[2])).toBe(true);
});
