import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Ensure critical environment variables exist
 */
const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) throw new Error('BASE_URL is missing in .env or GitHub secrets!');

/**
 * Playwright Test Configuration
 * See: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './E2E-Test-Remmi',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000, // 60s

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: `results-${Date.now()}.xml` }],
  ],

  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1320, height: 620 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: process.env.CI ? 50 : 0,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1320, height: 620 },
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], viewport: { width: 1320, height: 620 } },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], viewport: { width: 1320, height: 620 } },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1320, height: 620 } },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1320, height: 620 } },
    // },
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
