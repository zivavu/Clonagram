import { expect, test } from '@playwright/test';

test.describe('unauthenticated', () => {
   test.use({ storageState: { cookies: [], origins: [] } });

   test('redirects to login when not authenticated', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/login/);
   });

   test('shows error with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email adress').fill('no-such-user@example.com');
      await page.getByLabel('Password').fill('WrongPassword1!');
      await page.getByRole('button', { name: 'Log in', exact: true }).click();
      await expect(
         page.getByRole('alert').filter({ hasText: /invalid|credentials|password|email/i }),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
   });

   test.describe('signup form validation', () => {
      test('underage birthdate shows error', async ({ page }) => {
         await page.goto('/emailsignup');

         await page.getByLabel('Email address').fill('test@example.com');
         await page.getByLabel('Password').fill('MySecureP@ssw0rd123!');

         await page.getByRole('button', { name: 'Month' }).click();
         await page.getByRole('menuitem', { name: 'January' }).click();
         await page.getByRole('button', { name: 'Day' }).click();
         await page.getByRole('menuitem', { name: '15' }).click();
         await page.getByRole('button', { name: 'Year' }).click();
         await page.getByRole('menuitem', { name: '2020', exact: true }).click();

         await page.getByLabel('Full Name').fill('Young User');
         await page.getByLabel('Username').fill('younguser');
         await page.getByRole('button', { name: 'Submit' }).click();

         await expect(page.getByRole('alert').filter({ hasText: '13' })).toBeVisible();
         await expect(page).toHaveURL('/emailsignup');
      });

      test('taken username shows error', async ({ page }) => {
         await page.goto('/emailsignup');

         await page.getByLabel('Email address').fill('unique-test@example.com');
         await page.getByLabel('Password').fill('MySecureP@ssw0rd123!');

         await page.getByRole('button', { name: 'Month' }).click();
         await page.getByRole('menuitem', { name: 'June' }).click();
         await page.getByRole('button', { name: 'Day' }).click();
         await page.getByRole('menuitem', { name: '15' }).click();
         await page.getByRole('button', { name: 'Year' }).click();
         await page.waitForSelector('[role="menuitem"]');
         await page.evaluate(() => {
            const item = Array.from(document.querySelectorAll('[role="menuitem"]')).find(
               el => el.textContent?.trim() === '2000',
            );
            item?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
         });
         await page.getByRole('menuitem', { name: '2000', exact: true }).click();

         await page.getByLabel('Full Name').fill('Test User');
         await page.getByLabel('Username').fill('e2euser1');

         await page
            .waitForResponse(
               res =>
                  res.url().includes('/rest/v1/profiles') &&
                  res.url().includes('username') &&
                  res.status() === 200,
               { timeout: 5000 },
            )
            .catch(() => null);

         await page.getByRole('button', { name: 'Submit' }).click();

         await expect(page.getByText('e2euser1 is not available')).toBeVisible();
         await expect(page).toHaveURL('/emailsignup');
      });
   });
});

test.describe('authenticated', () => {
   test.use({ storageState: 'playwright/.auth/user2.json' });

   test('logout redirects to login', async ({ page }, testInfo) => {
      test.skip(
         testInfo.project.name === 'mobile-chrome',
         'Logout lives in the desktop-only More menu',
      );
      await page.goto('/');
      await page.getByRole('button', { name: 'More' }).click();
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
      await page.getByRole('button', { name: 'Log out' }).click();
      await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
   });
});
