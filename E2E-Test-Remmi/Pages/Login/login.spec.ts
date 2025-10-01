import { test } from '@playwright/test';
import { LoginActions } from './LoginAction';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Extract credentials directly from env
const { E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, E2E_MANAGER_OTP_SECRET } = process.env;

if (!E2E_MANAGER_EMAIL || !E2E_MANAGER_PASSWORD || !E2E_MANAGER_OTP_SECRET) {
  throw new Error('Please set E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, and E2E_MANAGER_OTP_SECRET in your .env');
}

test.describe('Login Tests - Remmi E2E', () => {
  let login: LoginActions;

  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
  });

  test('Successful login with OTP', async () => {
    await login.login(E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, E2E_MANAGER_OTP_SECRET);
  });

  test('Toggle password visibility', async () => {
    await login.togglePasswordVisibility(E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD);
  });

  test('Login without accepting terms', async () => {
    await login.withoutCheckbox(E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD);
  });

  test('Invalid email format', async () => {
    await login.invalidEmail('invalid-email', E2E_MANAGER_PASSWORD);
  });

  test('Incorrect password', async () => {
    await login.incorrectPassword(E2E_MANAGER_EMAIL, 'WrongPass123!');
  });

  test('Retry login after failed attempt', async () => {
    await login.loginWithRetry('wrongemail@example.com', 'WrongPass123!', E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD);
  });

  test('Verify OTP during login', async () => {
    await login.verifyOtp(E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, E2E_MANAGER_OTP_SECRET);
  });

  test('Login with invalid OTP', async () => {
    await login.invalidOtp(E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, '123456');
  });

  test('Forgot Password without entering OTP', async () => {
    await login.forgetPasswordWithoutOtp(E2E_MANAGER_EMAIL);
  });

  test('Verify login placeholders', async () => {
    await login.verifyLoginPlaceholder();
  });
});
