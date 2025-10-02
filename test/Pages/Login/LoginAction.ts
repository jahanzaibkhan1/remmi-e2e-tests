import { Page, expect, test } from '@playwright/test';
import { LocatorLogin } from '../../../E2E-Test-Remmi/Pages/Login/LoginLocators';
import { generateOtp } from '../../../helper/getOtp';
export class LoginActions {
  private locators: LocatorLogin;

  constructor(private page: Page) {
    this.locators = new LocatorLogin(this.page);

  }

  /** ✅ Successful login with OTP */

  async login(email: string, password: string, otpSecret: string) {
    await this.page.goto('/login');

    await test.step('Enter credentials', async () => {
      await this.locators.emailField().fill(email);
      await expect(this.locators.emailField()).toHaveValue(email);

      await this.locators.passwordField().fill(password);
      await expect(this.locators.passwordField()).toHaveValue(password);

      await this.locators.eyeIcon().click(); // toggle password visibility if needed
    });

    await test.step('Accept terms and click Sign In', async () => {
      await this.locators.termsCheckbox().check();
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

  /** ✅ Toggle password visibility */
  async togglePasswordVisibility(email: string, password: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveValue(password);

    await this.locators.eyeIcon().click(); // hide again
    await expect(this.locators.passwordField()).toHaveValue(password);
  }

  /** ✅ Login without accepting terms */
  async withoutCheckbox(email: string, password: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText(
      'You must accept the Terms of Use and Privacy Policy'
    );
    await expect(errorMessage).toBeVisible();
  }

  /** ✅ Invalid email format */
  async invalidEmail(invalidEmail: string, password: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(invalidEmail);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().check();
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText('Invalid email format');
    await expect(errorMessage).toBeVisible();
  }

  /** ✅ Incorrect password */
  async incorrectPassword(email: string, incorrectPassword: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(incorrectPassword);
    await this.locators.termsCheckbox().check();
    await this.locators.signInButton().click();

    const errorMessage = this.page.getByText('You have entered incorrect password');
    await expect(errorMessage).toBeVisible();
  }

  /** ✅ Retry login after failed attempt */
  async loginWithRetry(
    incorrectEmail: string,
    incorrectPassword: string,
    email: string,
    password: string
  ) {
    await this.page.goto('/login');

    // Incorrect credentials first
    await this.locators.emailField().fill(incorrectEmail);
    await this.locators.passwordField().fill(incorrectPassword);
    await this.locators.termsCheckbox().check();
    await this.locators.signInButton().click();
    await expect(this.page.getByText('You have entered incorrect password')).toBeVisible();

    // Retry with correct credentials
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.signInButton().click();
  }

  /** ✅ Verify OTP */
  async verifyOtp(email: string, password: string, otpSecret: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().check();
    await this.locators.signInButton().click();

    const otp = generateOtp(otpSecret);
    const otpInputs = this.locators.otpField();
    await expect(otpInputs.first()).toBeVisible();

    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }

    await this.locators.continueButton().click();
  }

  /** ✅ Invalid OTP */
  async invalidOtp(email: string, password: string, invalidOtp: string) {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);
    await this.locators.termsCheckbox().check();
    await this.locators.signInButton().click();

    const otpInputs = this.locators.otpField();
    await expect(otpInputs.first()).toBeVisible();

    for (let i = 0; i < invalidOtp.length; i++) {
      await otpInputs.nth(i).fill(invalidOtp[i]);
    }

    await this.locators.continueButton().click();
    await expect(this.page.getByText('Please enter the correct OTP code')).toBeVisible();
  }

  /** ✅ Forgot Password without OTP */
  async forgetPasswordWithoutOtp(email: string) {
    await this.page.goto('/login');

    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();

    await expect(this.page.getByText('We sent an OTP code to your email')).toBeVisible();
    await this.locators.continueButton().click();
    await expect(this.page.getByText('Please enter OTP code')).toBeVisible();
  }

  /** ✅ Verify placeholders */
  async verifyLoginPlaceholder() {
    await this.page.goto('/login');

    const emailPlaceholder = await this.locators.emailField().getAttribute('placeholder');
    const passwordPlaceholder = await this.locators.passwordField().getAttribute('placeholder');

    console.log(`Email placeholder: "${emailPlaceholder}"`);
    console.log(`Password placeholder: "${passwordPlaceholder}"`);

    expect(emailPlaceholder).toBe('Email');
    expect(passwordPlaceholder).toBe('Password');
  }
}
