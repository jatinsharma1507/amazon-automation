// @ts-check
const { defineConfig, devices } = require('@playwright/test');
 
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 120000, // 2 minutes per test
 
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 },
 
    // Looks like a real Chrome browser
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
 
    launchOptions: {
      slowMo: 800,
      args: [
        '--disable-blink-features=AutomationControlled', // Hides the automation flag
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--start-maximized',
      ],
    },
 
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  },
 
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Uses your real installed Chrome — much harder to detect
      },
    },
  ],
});