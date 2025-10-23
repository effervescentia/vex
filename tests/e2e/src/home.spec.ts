import { $, test } from 'playwright-elements';

test('load home page', async ({ page }) => {
  await page.goto('/');

  await $('body').expect().toHaveText('Home');
});
