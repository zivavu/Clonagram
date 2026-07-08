import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const TEST_CAPTION = `e2e-feed-${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-feed-');
});

test('a newly created post appears in the home feed', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   await page.goto('/');
   await expect(page.getByRole('link', { name: 'Home' })).toBeVisible({ timeout: 10000 });
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });
});
