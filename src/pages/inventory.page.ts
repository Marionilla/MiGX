import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
export const SORT_OPTIONS: Record<string, SortOption> = {
    'Name (A to Z)': 'az',
    'Name (Z to A)': 'za',
    'Price (low to high)': 'lohi',
    'Price (high to low)': 'hilo',
};

export class InventoryPage extends BasePage {
    readonly items: Locator = this.page.getByTestId('inventory-item');
    readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
    readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
    readonly sortSelect: Locator = this.page.getByTestId('product-sort-container');
    async sortBy(option: SortOption): Promise<void> {
        await this.sortSelect.selectOption(option);
    }
    async productNames(): Promise<string[]> {
        return this.itemNames.allTextContents();
    }
    async productPrices(): Promise<number[]> {
        const raw = await this.itemPrices.allTextContents();
        return raw.map((price) => Number(price.replace('$', '').trim()));
    }
    async addProduct(productId: string): Promise<void> {
        await this.page.getByTestId(`add-to-cart-${productId}`).click();
    }
    async removeProduct(productId: string): Promise<void> {
        await this.page.getByTestId(`remove-${productId}`).click();
    }
}