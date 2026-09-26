import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage } from '../pages/checkoutInfo.page';
import { CheckoutOverviewPage } from '../pages/checkoutOverview.page';
import { CheckoutCompletePage } from '../pages/checkoutComplete.page';

export class PageManager {
    readonly loginPage: LoginPage;
    readonly inventoryPage: InventoryPage;
    readonly cartPage: CartPage;
    readonly checkoutInfoPage: CheckoutInfoPage;
    readonly checkoutOverviewPage: CheckoutOverviewPage;
    readonly checkoutCompletePage: CheckoutCompletePage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutInfoPage = new CheckoutInfoPage(page);
        this.checkoutOverviewPage = new CheckoutOverviewPage(page);
        this.checkoutCompletePage = new CheckoutCompletePage(page);
    }
}