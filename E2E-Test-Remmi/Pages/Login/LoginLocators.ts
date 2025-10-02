import { Locator, Page } from '@playwright/test';

export class LocatorLogin {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Email input field */
  emailField(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  /** Password input field */
  passwordField(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  /** Eye icon to toggle password visibility */
  eyeIcon(): Locator {
    return this.page.locator("//img[@class='icon-close']");
  }

  /** Terms & conditions checkbox with partial text match */
  termsCheckbox(): Locator {
    return this.page.getByText(/I agree to all the statements/i, { exact: false });
  }


  /** Sign in button */
  signInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  /** OTP input fields */
  otpField(): Locator {
    return this.page.locator('input.otp-input');
  }

  /** Continue button (after OTP) */
  continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  /** Forgot Password link */
  forgetPasswordLink(): Locator {
    return this.page.getByText('Forgot Password?');
  }

  /** Reset email input field */
  resetEmailField(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  /** Continue button on Reset Password */
  continueResetButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  continueOtpButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  /** New password input field */
  newPasswordField(): Locator {
    return this.page.getByRole('textbox', { name: 'Enter your new password' });
  }
}
