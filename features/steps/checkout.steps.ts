import { expect } from '@playwright/test';
import { When, Then } from '../../src/fixtures/web.fixtures';
When('I proceed to checkout', async ({ pages }) => {
    await pages.cartPage.checkout();
});
When(
    'I enter checkout information {string} {string} {string}',
    async ({ pages }, first: string, last: string, zip: string) => {
        await pages.checkoutInfoPage.fillInformation(first, last, zip);
    },
);
When('I continue to the overview', async ({ pages }) => {
    await pages.checkoutInfoPage.continue();
});
When('I finish the order', async ({ pages }) => {
    await pages.checkoutOverviewPage.finish();
});
Then('the order overview should list {string}', async ({ pages }, name: string) => {
    await expect(
        pages.checkoutOverviewPage.itemNames.filter({ hasText: name }),
    ).toHaveCount(1);
});
Then('the order total should equal the item total plus tax', async ({ pages }) => {
    const itemTotal = await pages.checkoutOverviewPage.itemTotal();
    const tax = await pages.checkoutOverviewPage.tax();
    const total = await pages.checkoutOverviewPage.total();
    expect(total).toBeCloseTo(itemTotal + tax, 2);
});
Then(
    'I should see the order confirmation {string}',
    async ({ pages }, message: string) => {
        await expect(pages.checkoutCompletePage.completeHeader).toHaveText(message);
    },
);
Then(
    'I should see the checkout error {string}',
    async ({ pages }, message: string) => {
        await expect(pages.checkoutInfoPage.errorMessage).toHaveText(message);
    },
);