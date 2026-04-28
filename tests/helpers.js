/**
 * Injects scripts that hide Playwright/automation signals from Amazon.
 * Call this BEFORE page.goto() on every test.
 */
async function stealthSetup(page) {
  // Remove the "webdriver" property that sites check for
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

    // Fake plugins list (real browsers have these)
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    // Fake language settings
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    // Override Chrome runtime so it looks populated
    window.chrome = { runtime: {} };

    // Prevent detection via permissions API
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });
}

/**
 * Waits a random amount of time to mimic human behaviour.
 */
async function humanDelay(page, min = 800, max = 2000) {
  const ms = Math.floor(Math.random() * (max - min) + min);
  await page.waitForTimeout(ms);
}

/**
 * Extracts the price from an Amazon product page.
 * Tries multiple selectors because Amazon's layout varies by product.
 */
async function getPrice(page) {
  const selectors = [
    '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
    '.a-price[data-a-size="xl"] .a-offscreen',
    '.a-price[data-a-size="b"] .a-offscreen',
    '.a-price .a-offscreen',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '#price_inside_buybox',
    '.a-color-price',
  ];

  for (const selector of selectors) {
    try {
      const el = page.locator(selector).first();
      const visible = await el.isVisible({ timeout: 2000 });
      if (visible) {
        const text = await el.textContent();
        if (text && text.includes('$')) return text.trim();
      }
    } catch {}
  }
  return 'Price not available';
}

/**
 * Core search-and-add-to-cart flow shared by both tests.
 * @param {import('@playwright/test').Page} page
 * @param {string} searchTerm   e.g. "iPhone 15"
 * @param {string} label        e.g. "iPhone" or "Samsung Galaxy"
 */
async function searchAndAddToCart(page, searchTerm, label) {
  const divider = '─'.repeat(44);

  // ── 1. Navigate ──────────────────────────────────
  console.log(`\n${divider}`);
  console.log(` 🚀  Starting: ${label}`);
  console.log(divider);

  await stealthSetup(page);
  await page.goto('https://www.amazon.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await humanDelay(page, 1500, 3000);
  console.log('✅  Loaded Amazon.com');

  // ── 2. Search ─────────────────────────────────────
  const searchBox = page.locator('#twotabsearchtextbox');
  await searchBox.waitFor({ state: 'visible', timeout: 15000 });
  await searchBox.click();
  await humanDelay(page, 300, 600);

  // Type like a human: character by character with small delays
  await searchBox.pressSequentially(searchTerm, { delay: 80 });
  await humanDelay(page, 400, 700);
  await page.keyboard.press('Enter');
  console.log(`✅  Searched for "${searchTerm}"`);

  // ── 3. Pick first result ──────────────────────────
  await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 20000 });
  await humanDelay(page, 600, 1200);

 const firstResult = page.locator([
    '[data-component-type="s-search-result"] h2 a',
    '.s-result-item h2 a',
    '[data-component-type="s-search-result"] .a-link-normal.s-underline-text',
    '[data-component-type="s-search-result"] .a-link-normal',
  ].join(', ')).first();
  await firstResult.waitFor({ state: 'visible', timeout: 15000 });
  await firstResult.click();

  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  await humanDelay(page, 1000, 2000);

  // ── 4. Print price ────────────────────────────────
  const price = await getPrice(page);
  console.log(divider);
  console.log(`  💰  ${label} Price: ${price}`);
  console.log(divider);

  // ── 5. Add to cart ────────────────────────────────
  try {
    const addToCart = page.locator('#add-to-cart-button');
    await addToCart.waitFor({ state: 'visible', timeout: 10000 });
    await humanDelay(page, 500, 1000);
    await addToCart.click();
    console.log('✅  Clicked "Add to Cart"');

    // Dismiss upsell popup if it appears (protection plan, etc.)
    await humanDelay(page, 1500, 2500);
    const dismissors = [
      'button:has-text("No thanks")',
      '#attachSiAddWarrantyText',
      '[data-action="a-popover-close"]',
    ];
    for (const sel of dismissors) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click();
        break;
      }
    }

    // Verify cart updated
    const cartCount = page.locator('#nav-cart-count');
    const count = await cartCount.textContent({ timeout: 5000 }).catch(() => '?');
    console.log(`✅  ${label} added to cart! (Cart count: ${count?.trim()})`);
  } catch {
    console.log('ℹ️   "Add to Cart" unavailable — item may need a size/colour selection or login.');
  }

  console.log(`\n✔   ${label} test complete!\n`);
}

module.exports = { stealthSetup, humanDelay, getPrice, searchAndAddToCart };