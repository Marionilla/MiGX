import { expect } from '@playwright/test';
import { Given, Then } from '../../src/fixtures/web.fixtures';
import { uiPages } from '../../src/utils/uiPages';
import { userByKey } from '../../src/testData/base.data';

Given('I open the login page', async ({ page }) => {
    await page.goto(uiPages.login);
});

Given('I am logged in as {string}', async ({ page, pages }, key: string) => {
    const user = userByKey(key);
    await page.goto(uiPages.login);
    await pages.loginPage.doLogin(user.username, user.password);
    await expect(page).toHaveURL(/inventory\.html/);
});

Given('I am on the inventory page', async ({ page }) => {
    await page.goto(uiPages.inventory);
    await expect(page).toHaveURL(/inventory\.html/);
});

Then('I should be on the inventory page', async ({ page }) => {
    await expect(page).toHaveURL(/inventory\.html/);
});