import { expect, type Locator, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const FIRST_LINE = `e2e-newline-${Date.now()}-first`;
const SECOND_LINE = `e2e-newline-${Date.now()}-second`;
const MULTILINE_CAPTION = `${FIRST_LINE}\n\n${SECOND_LINE}`;

const NEWLINE_PRESERVING_VALUES = ['pre-wrap', 'pre-line', 'pre', 'break-spaces'];

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-newline-');
});

async function expectRenderedNewlines(captionElement: Locator) {
   await expect(captionElement).toBeVisible({ timeout: 15000 });
   await expect(captionElement).toHaveText(new RegExp(`${FIRST_LINE}\\n\\s*${SECOND_LINE}`));

   const whiteSpace = await captionElement.evaluate(el => getComputedStyle(el).whiteSpace);
   expect(NEWLINE_PRESERVING_VALUES).toContain(whiteSpace);
}

test('caption line breaks render in the feed and the post modal', async ({ page }) => {
   await createPostViaUI(page, MULTILINE_CAPTION);

   await page.goto('/');
   await expect(page.getByText(FIRST_LINE)).toBeVisible({ timeout: 15000 });

   await expectRenderedNewlines(page.getByText(FIRST_LINE).last());

   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Comment') })
      .filter({ hasText: FIRST_LINE })
      .last();

   await expect(postCard.getByLabel('Comment')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Comment').click();

   const postDialog = page.getByRole('dialog').first();
   await expectRenderedNewlines(postDialog.getByText(FIRST_LINE).last());
});
