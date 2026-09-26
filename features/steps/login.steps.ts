import { expect } from '@playwright/test';
import { When, Then } from '../../src/fixtures/web.fixtures';
import { LOGIN_ERRORS, userByKey } from '../../src/testData/base.data';

When('I log in as {string}', async ({ pages }, key: string) => {
  const user = userByKey(key);
  await pages.loginPage.doLogin(user.username, user.password);
});

When('I enter username {string}', async ({ pages }, username: string) => {
  await pages.loginPage.fillLogin(username);
});

When('I enter password {string}', async ({ pages }, password: string) => {
  await pages.loginPage.fillPassword(password);
});

When('I submit the login form', async ({ pages }) => {
  await pages.loginPage.loginButton.click();
});

Then('I should see the login error {string}', async ({ pages }, key: string) => {
  const expected = LOGIN_ERRORS[key as keyof typeof LOGIN_ERRORS];
  expect(expected, `Unknown login error key "${key}"`).toBeDefined();
  await expect(pages.loginPage.errorMessage).toHaveText(expected);
});