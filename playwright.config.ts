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

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Limit parallelism on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Default timeout per test */
  timeout: 60000, // 60s

  /* Reporters: List + HTML + JUnit */
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: `results-${Date.now()}.xml` }],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: BASE_URL,
    headless: true, // Run tests in headless mode (CI-friendly)
    viewport: { width: 1320, height: 620 }, // Default desktop viewport
    screenshot: 'only-on-failure', // Capture screenshot only on failure
    video: 'retain-on-failure', // Retain video only on failure
    trace: 'on-first-retry', // Collect trace on retry

    /* Browser launch options for CI */
    launchOptions: {
      slowMo: process.env.CI ? 50 : 0, // Slow motion to reduce flakiness in CI
      args: [
        '--disable-gpu',      
        '--no-sandbox',       
        '--disable-dev-shm-usage',
      ],
    },
  },

  /* Projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1320, height: 620 }, // <-- viewport override here
      },
    },
    // Uncomment to test on Firefox browser
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], viewport: { width: 1320, height: 620 } },
    // },
    // Uncomment to test on Safari browser
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], viewport: { width: 1320, height: 620 } },
    // },

    // Mobile emulation projects
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // Branded browser projects
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1320, height: 620 } },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1320, height: 620 } },
    // },
  ],

  /* Optional: Run local dev server before tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
