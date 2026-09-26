import { expect } from '@playwright/test';
import { Given, Then } from '../../src/fixtures/web.fixtures';
import { uiPages } from '../../src/utils/uiPages';

Given('I open the login page', async ({ page }) => {
  await page.goto(uiPages.login);
});

Then('I should be on the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/inventory\.html/);
});