import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';

export class PageManager {
    readonly loginPage: LoginPage;
    readonly inventoryPage: InventoryPage;
    
    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page);
    }
}