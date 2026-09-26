import { expect } from '@playwright/test';
import { When, Then } from '../../src/fixtures/web.fixtures';
import { productByName } from '../../src/testData/products';

When('I add {string} to the cart', async ({ pages }, name: string) => {
    await pages.inventoryPage.addProduct(productByName(name).id);
});

When('I open the cart', async ({ pages }) => {
    await pages.inventoryPage.openCart();
});

When('I remove {string} from the cart', async ({ pages }, name: string) => {
    await pages.inventoryPage.removeProduct(productByName(name).id);
});

Then('the cart badge should show {int}', async ({ pages }, count: number) => {
    await expect(pages.inventoryPage.cartBadge).toHaveText(String(count));
});

Then('the cart badge should be empty', async ({ pages }) => {
    await expect(pages.inventoryPage.cartBadge).toHaveCount(0);
});