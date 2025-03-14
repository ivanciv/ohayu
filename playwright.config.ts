import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://ohayu.com/esim/united-arab-emirates-ae/',
    trace: 'on-first-retry',
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot:'on',
    video:'on',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iPhone 14',
      use: { ...devices['iPhone 14'] },
    },

    {
      name: 'Pixel 7',
      use: { ...devices['Pixel 7'] },
    },

    {
      name: 'Samsung Galaxy S21',
      use: { ...devices['Samsung Galaxy S21'] },
    },

    {
      name: 'iPad Mini',
      use: { ...devices['iPad Mini'] },
    },

  ], 
});
