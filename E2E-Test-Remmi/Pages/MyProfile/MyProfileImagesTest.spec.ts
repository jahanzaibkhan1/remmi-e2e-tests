import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { E2E_MANAGER_EMAIL, E2E_MANAGER_PASSWORD, E2E_MANAGER_OTP_SECRET } = process.env;

test.describe('My Profile Tests - Remmi E2E', () => {
  let login: LoginActions;
  let profile: MyProfileActions;

  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    // Skip dynamically if credentials missing
    if (!E2E_MANAGER_EMAIL || !E2E_MANAGER_PASSWORD || !E2E_MANAGER_OTP_SECRET) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }

    // Login first
    await login.login(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, E2E_MANAGER_OTP_SECRET!);
  });

  // ---------------- Positive scenarios ----------------
  test.describe('Positive Profile Images Flows', () => {
    test('1. User can upload a profile image', async () => {
      await profile.navigateToProfilePage();
      const imagePath = path.resolve(__dirname, 'Images/High.jpg');
      await profile.UploadImageProfile(imagePath);
    });
  });
});
