import { test } from '@playwright/test';
import { LoginActions } from './LoginAction';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, E2E_MANAGER_OTP_SECRET } = process.env;

test.describe('Login Tests - Remmi E2E', () => {
  let login: LoginActions;

  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);

    // Skip dynamically if credentials missing
    if (!E2E_MANAGER_EMAIL || !E2E_MANAGER_PASSWORD || !E2E_MANAGER_OTP_SECRET) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }
  });

  test.describe('Positive Flows', () => {
    test('Successful login with OTP', async () => {
      await login.login(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, E2E_MANAGER_OTP_SECRET!);
    });

    test('Verify OTP during login', async () => {
      await login.verifyOtp(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, E2E_MANAGER_OTP_SECRET!);
    });

    test('Verify login placeholders', async () => {
      await login.verifyLoginPlaceholder();
    });
  });

  test.describe('Negative Flows', () => {
    test('Toggle password visibility', async () => {
      await login.togglePasswordVisibility(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!);
    });

    test('Login without accepting terms', async () => {
      await login.withoutCheckbox(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!);
    });

    test('Invalid email format', async () => {
      await login.invalidEmail('invalid-email', E2E_MANAGER_PASSWORD!);
    });

    test('Incorrect password', async () => {
      await login.incorrectPassword(E2E_MANAGER_EMAIL!, 'WrongPass123!');
    });

    test('Retry login after failed attempt', async () => {
      await login.loginWithRetryWithoutOtp('wrong@example.com', 'WrongPass123!', E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!);
    });

    test('Login with invalid OTP', async () => {
      await login.invalidOtp(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, '123456');
    });

    test('Forgot Password without entering OTP', async () => {
      await login.forgetPasswordWithoutOtp(E2E_MANAGER_EMAIL!);
    });

    // Edge cases
    test('Empty email', async () => {
      await login.emptyEmail(E2E_MANAGER_PASSWORD!);
    });

    test('Empty password', async () => {
      await login.emptyPassword(E2E_MANAGER_EMAIL!);
    });

    test('Both email and password empty', async () => {
      await login.emptyEmailAndPassword();
    });

    test('OTP shorter/longer than expected', async () => {
      await login.invalidOtpLength(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, '12'); // Short OTP example
    });
  });
});
