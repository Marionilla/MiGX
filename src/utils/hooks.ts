import type { Page } from '@playwright/test';
import { buildUrl } from './urlBuilder';
import type { UiPage } from '../pages/pages';

type PageObjectConstructor<T> = new (page: Page) => T;
/** Navigate to a known page and return its Page Object (reference openPage).
- const loginPage = await openPage(page, LoginPage, 'login'); */

export async function openPage<T>(
    page: Page,
    PageObjectClass: PageObjectConstructor<T>,
    targetPage: UiPage,
    params?: Record<string, string>,
): Promise<T> {
    await page.goto(buildUrl(targetPage, params));
    return new PageObjectClass(page);
}