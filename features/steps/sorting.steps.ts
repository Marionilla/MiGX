import { expect } from '@playwright/test';
import { When, Then } from '../../src/fixtures/web.fixtures';
import { SORT_OPTIONS } from '../../src/pages/inventory.page';

When('I sort the products by {string}', async ({ pages }, label: string) => {
    const option = SORT_OPTIONS[label];
    expect(option, `Unknown sort option "${label}"`).toBeDefined();
    await pages.inventoryPage.sortBy(option!);
});

Then(
    'the products should be sorted by {word} in {string} order',
    async ({ pages }, field: string, direction: string) => {
        if (field === 'price') {
            const prices = await pages.inventoryPage.productPrices();
            const expected = [...prices].sort((a, b) => a - b);
            if (direction === 'descending') expected.reverse();
            expect(prices).toEqual(expected);
        } else {
            const names = await pages.inventoryPage.productNames();
            const expected = [...names].sort((a, b) => a.localeCompare(b));
            if (direction === 'descending') expected.reverse();
            expect(names).toEqual(expected);
        }
    },
);