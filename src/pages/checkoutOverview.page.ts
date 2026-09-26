import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/** Checkout step two — order overview with price totals. */
export class CheckoutOverviewPage extends BasePage {
    readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
    readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
    readonly taxLabel: Locator = this.page.getByTestId('tax-label');
    readonly totalLabel: Locator = this.page.getByTestId('total-label');
    readonly finishButton: Locator = this.page.getByTestId('finish');

    /** Parse the dollar amount out of a "Label: $NN.NN" summary line. */
    private static parseAmount(text: string | null): number {
        const match = text?.match(/\$([\d.]+)/);
        if (!match) {
            throw new Error(`Could not parse amount from "${text}"`);
        }
        return Number(match[1]);
    }

    async itemTotal(): Promise<number> {
        return CheckoutOverviewPage.parseAmount(await this.subtotalLabel.textContent());
    }

    async tax(): Promise<number> {
        return CheckoutOverviewPage.parseAmount(await this.taxLabel.textContent());
    }

    async total(): Promise<number> {
        return CheckoutOverviewPage.parseAmount(await this.totalLabel.textContent());
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}