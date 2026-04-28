const { test } = require('@playwright/test');
const { searchAndAddToCart } = require('./helpers');
 
test('Test Case 2: Search Galaxy on Amazon and add to cart', async ({ page }) => {
  await searchAndAddToCart(page, 'Samsung Galaxy S24', 'Samsung Galaxy');
});
 