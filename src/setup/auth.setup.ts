import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { authStates } from '../utils/authState';
import { authUsers } from '../testData/base.data';
import { uiPages } from '../utils/uiPages';

for (const user of authUsers) {
    setup(`authenticate as ${ user.role }`, async ({ page }) => {
        const file = authStates[user.role];
        const loginPage = new LoginPage(page);
        await page.goto(uiPages.login);
        await loginPage.doLogin(user.username, user.password);
        await page.waitForURL(/inventory.html/);
        await page.context().storageState({ path: file });
    });
}