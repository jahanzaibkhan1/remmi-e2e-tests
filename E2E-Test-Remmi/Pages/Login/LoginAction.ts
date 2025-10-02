import { Page, expect, test, Locator } from '@playwright/test';
import { LocatorLogin } from './LoginLocators';
import { generateOtp } from '../../../helper/getOtp';
import { LoginMessages } from './LoginMessages';

export class LoginActions {
  private locators: LocatorLogin;

  constructor(private page: Page) {
    this.locators = new LocatorLogin(this.page);
  }

  /** Successful login with OTP */
  async login(email: string, password: string, otpSecret: string) {
    await this.page.goto('/login');

    await test.step('Enter credentials', async () => {
      await this.locators.emailField().fill(email);
      await expect(this.locators.emailField()).toHaveValue(email);

      await this.locators.passwordField().fill(password);
      await expect(this.locators.passwordField()).toHaveValue(password);
    });

    await test.step('Accept terms and click Sign In', async () => {
      await this.locators.termsCheckbox().scrollIntoViewIfNeeded();
      await this.locators.termsCheckbox().click({ force: true });
      await this.locators.signInButton().click();
    });

    await test.step('Enter OTP', async () => {
      const otp = generateOtp(otpSecret);
      const otpInputs = this.locators.otpField();
      for (let i = 0; i < otp.length; i++) {
        await otpInputs.nth(i).fill(otp[i]);
      }
      await this.locators.continueButton().click();
    });

    await expect(this.page).toHaveURL('/');
  }

  /** Toggle password visibility */
  async togglePasswordVisibility(email: string, password: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);

    // Toggle ON
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'text');

    // Toggle OFF
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'password');
  }

  /** Login without accepting terms */
  async withoutCheckbox(email: string, password: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText(LoginMessages.termsNotAccepted, { exact: false });
    await expect(errorMessage).toBeVisible();
  }

  /** Invalid email format */
  async invalidEmail(invalidEmail: string, password: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(invalidEmail);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText(/invalid email/i);
    await expect(errorMessage).toBeVisible();
  }

  /** Incorrect password */
  async incorrectPassword(email: string, incorrectPassword: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(incorrectPassword);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText(LoginMessages.incorrectPassword, { exact: false });
    await expect(errorMessage).toBeVisible();
  }

  /** Retry login without OTP */
  async loginWithRetryWithoutOtp(
    incorrectEmail: string,
    incorrectPassword: string,
    email: string,
    password: string
  ) {
    await this.page.goto('/login');

    // First attempt with wrong credentials
    await this.locators.emailField().fill(incorrectEmail);
    await this.locators.passwordField().fill(incorrectPassword);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();

    await expect(this.page.getByText(LoginMessages.incorrect_Email_Password, { exact: false })).toBeVisible();

    // Retry with correct credentials
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();
  }

  /** Verify OTP */
  async verifyOtp(email: string, password: string, otpSecret: string) {
    await this.page.goto('/login');

    await test.step('Enter credentials', async () => {
      await this.locators.emailField().fill(email);
      await expect(this.locators.emailField()).toHaveValue(email);

      await this.locators.passwordField().fill(password);
      await expect(this.locators.passwordField()).toHaveValue(password);
    });

    await test.step('Accept terms and click Sign In', async () => {
      await this.locators.termsCheckbox().scrollIntoViewIfNeeded();
      await this.locators.termsCheckbox().click({ force: true });
      await this.locators.signInButton().click();
    });

    await test.step('Enter OTP', async () => {
      const otp = generateOtp(otpSecret);
      const otpInputs = this.locators.otpField();
      for (let i = 0; i < otp.length; i++) {
        await otpInputs.nth(i).fill(otp[i]);
      }
      await this.locators.continueButton().click();
    });
  }

  /** Invalid OTP */
  async invalidOtp(email: string, password: string, invalidOtp: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();

    const otpInputs = this.locators.otpField();
    for (let i = 0; i < invalidOtp.length; i++) {
      await otpInputs.nth(i).fill(invalidOtp[i]);
    }
    await this.locators.continueButton().click();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  /** Forgot Password without OTP */
  async forgetPasswordWithoutOtp(email: string) {
    await this.page.goto('/login');
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();
    await expect(this.page.getByText(LoginMessages.otpPageHeader, { exact: false })).toBeVisible();
    await this.locators.continueOtpButton().scrollIntoViewIfNeeded();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText(LoginMessages.otpRequired, { exact: false })).toBeVisible();
  }

  /** Verify placeholders */
  async verifyLoginPlaceholder() {
    await this.page.goto('/login');
    await expect(this.locators.emailField()).toHaveAttribute('placeholder', LoginMessages.emailPlaceholder);
    await expect(this.locators.passwordField()).toHaveAttribute('placeholder', LoginMessages.passwordPlaceholder);
  }

  /** Edge case: empty email */
  async emptyEmail(password: string) {
    await this.page.goto('/login');
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
  }

  /** Edge case: empty password */
  async emptyPassword(email: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  /** Edge case: OTP shorter/longer than expected */
  async invalidOtpLength(email: string, password: string, otp: string) {
    await this.page.goto('/login');
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();

    const otpInputs = this.locators.otpField();
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
    await this.locators.continueButton().click();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  /** Both Email and Password Empty */
  async emptyEmailAndPassword() {
    await this.page.goto('/login');
    await this.locators.termsCheckbox().click({ force: true });
    await this.locators.signInButton().click();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }
}
