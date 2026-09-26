import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
    readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
    readonly checkoutButton: Locator = this.page.getByTestId('checkout');

    async removeProduct(productId: string): Promise<void> {
        await this.page.getByTestId(`remove - ${ productId }`).click();
    }
    
    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }
}