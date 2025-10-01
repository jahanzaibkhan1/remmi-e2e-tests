import { Page, expect, test } from '@playwright/test';
import { LoginLocators } from './loginLocators';
import { generateOtp } from '../../../helper/getOtp';

export class LoginActions {
  private locators: LoginLocators;

  constructor(private page: Page) {
    this.locators = new LoginLocators(this.page);
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
  async togglePasswordVisibility(email: string, password: string): Promise<void> {
    await this.page.goto('/login');

    await this.locators.emailField().fill(email);
    await this.locators.passwordField().fill(password);

    // Toggle ON
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveValue(password);
    process.stdout.write(`✅ Password Toggled Successfully: ${password}\n`);

    // Toggle OFF
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveValue(password);
    process.stdout.write(`✅ Password Hidden Successfully\n`);
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
    await expect(errorMessage).toContainText('Terms of Use'); // partial match
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
    await expect(errorMessage).toHaveText('Invalid email format');
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
    await expect(errorMessage).toHaveText('You have entered incorrect password');
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

    const incorrectEmailMsg = this.page.getByText('You have entered incorrect email');
    await expect(incorrectEmailMsg).toBeVisible();
    await expect(incorrectEmailMsg).toHaveText('You have entered incorrect email');
    process.stdout.write(`❌ Tried login with incorrect credentials: ${incorrectEmail} / ${incorrectPassword}\n`);

    // Retry with correct credentials
    await this.locators.emailField().clear();
    await this.locators.emailField().fill(email);
    await this.locators.passwordField().clear();
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

    const otpError = this.page.getByText('Please enter the correct OTP code');
    await expect(otpError).toBeVisible();
    await expect(otpError).toHaveText('Please enter the correct OTP code');
  }

  /** ✅ Forgot Password without OTP */
  async forgetPasswordWithoutOtp(email: string) {
    await this.page.goto('/login');
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();

    const otpSent = this.page.getByText('We sent an OTP code to your email');
    await expect(otpSent).toBeVisible();
    await expect(otpSent).toHaveText('We sent an OTP code to your email');

    await this.locators.continueButton().click();

    const otpRequired = this.page.getByText('Please enter OTP code');
    await expect(otpRequired).toBeVisible();
    await expect(otpRequired).toHaveText('Please enter OTP code');
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
