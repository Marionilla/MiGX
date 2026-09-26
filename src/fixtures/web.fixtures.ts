import { test as base, createBdd } from 'playwright-bdd';
import { PageManager } from './manage.page.fixtures';

export interface Fixtures { pages: PageManager; }

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        await use(new PageManager(page));
    },
});

export const { Given, When, Then } = createBdd(test);