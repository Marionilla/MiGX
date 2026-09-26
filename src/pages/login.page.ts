import { BasePage } from './base.page'

export class LoginPage extends BasePage {
    readonly userName = this.page.getByPlaceholder('Username');
    readonly password = this.page.getByPlaceholder('Password');
    readonly loginButton = this.page.getByRole('button', { name: 'Login' });
    readonly errorMessage = this.page.getByTestId('error');

    async fillLogin(username: string): Promise<void> {
        await this.userName.fill(username);
    }

    async fillPassword(password: string): Promise<void> {
        await this.password.fill(password);
    }

    async doLogin(username: string, password: string): Promise<void> {
        await this.fillLogin(username);
        await this.fillPassword(password);
        await this.loginButton.click();
    }
}