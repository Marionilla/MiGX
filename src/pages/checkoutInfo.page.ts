import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/** Checkout step one — customer information form. */
export class CheckoutInfoPage extends BasePage {
    readonly firstName: Locator = this.page.getByTestId('firstName');
    readonly lastName: Locator = this.page.getByTestId('lastName');
    readonly postalCode: Locator = this.page.getByTestId('postalCode');
    readonly errorMessage: Locator = this.page.getByTestId('error');
    readonly continueButton: Locator = this.page.getByTestId('continue');

    async fillInformation(
        firstName: string,
        lastName: string,
        postalCode: string,
    ): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }
    
    async continue(): Promise<void> {
        await this.continueButton.click();
    }
}