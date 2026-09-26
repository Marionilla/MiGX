import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/** Checkout complete — order confirmation page. */
export class CheckoutCompletePage extends BasePage {
    readonly completeHeader: Locator = this.page.getByTestId('complete-header');
}