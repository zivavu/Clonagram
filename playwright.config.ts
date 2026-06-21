import { defineConfig, devices } from '@playwright/test';

process.loadEnvFile('.env.test');

export default defineConfig({
   testDir: './e2e',
   fullyParallel: true,
   forbidOnly: !!process.env.CI,
   retries: process.env.CI ? 2 : 0,
   workers: process.env.CI ? 1 : undefined,
   reporter: 'html',
   use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
   },
   projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user1.json' },
         dependencies: ['setup'],
      },
   ],
   webServer: {
      command: 'bun run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
   },
});
