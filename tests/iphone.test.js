const { test } = require('@playwright/test');
const { searchAndAddToCart } = require('./helpers');
 
test('Test Case 1: Search iPhone on Amazon and add to cart', async ({ page }) => {
  await searchAndAddToCart(page, 'iPhone 15', 'iPhone');
});