import { expect, test } from '@playwright/test';

test('explore page loads with tabs and people suggestions', async ({ page }) => {
   await page.goto('/explore');

   // For-you and non-personalized tab links should be visible for authenticated users
   await expect(page.getByRole('link', { name: 'For you' })).toBeVisible({ timeout: 10000 });
   await expect(page.getByRole('link', { name: 'Not personalized' })).toBeVisible({
      timeout: 10000,
   });

   // Navigate to explore/people and verify the suggested users list loads
   await page.goto('/explore/people');

   await expect(page.getByRole('link', { name: 'Suggested for you' })).toBeVisible({
      timeout: 10000,
   });

   // e2euser2 exists and e2euser1 doesn't follow them — should appear in suggestions
   await expect(page.getByText('e2euser2')).toBeVisible({ timeout: 10000 });
});
