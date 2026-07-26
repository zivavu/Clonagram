import { expect, test } from '@playwright/test';
import { getUserId, makeServiceClient, USER_1_EMAIL } from './helpers';

const AI_CAPTION = `e2e-hideai-${Date.now()}`;

test.beforeAll(async () => {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   if (!userId) throw new Error(`Missing e2e user ${USER_1_EMAIL}`);

   await supabase.from('profiles').update({ hide_ai_content: false }).eq('id', userId);

   const { data, error } = await supabase
      .from('posts')
      .insert({
         user_id: userId,
         caption: AI_CAPTION,
         type: 'photo',
         aspect_ratio: '1:1',
         is_ai: true,
      })
      .select('id')
      .single();
   if (error) throw error;

   const { error: imageError } = await supabase.from('post_images').insert({
      post_id: data.id,
      position: 0,
      url: 'https://picsum.photos/seed/e2e-hideai/600/600',
      width: 600,
      height: 600,
   });
   if (imageError) throw imageError;
});

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   if (!userId) return;
   await supabase.from('posts').delete().eq('user_id', userId).like('caption', 'e2e-hideai-%');
   await supabase.from('profiles').update({ hide_ai_content: false }).eq('id', userId);
});

test('toggling Hide AI content drops AI posts from the home feed without a reload', async ({
   page,
}, testInfo) => {
   test.skip(
      testInfo.project.name === 'mobile-chrome',
      'The More nav button is hidden below 768px',
   );

   await page.goto('/');
   await expect(page.getByText(AI_CAPTION)).toBeVisible({ timeout: 15000 });

   await page.getByRole('button', { name: 'More' }).click();
   await page.getByRole('button', { name: 'Toggle AI content visibility' }).click();

   await expect(page.getByText(AI_CAPTION)).toBeHidden({ timeout: 15000 });
});
