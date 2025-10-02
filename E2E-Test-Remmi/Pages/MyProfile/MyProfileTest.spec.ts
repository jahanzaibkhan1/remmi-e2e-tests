import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


// Pull user from env
const user = {
  email: process.env.E2E_MANAGER_EMAIL!,
  password: process.env.E2E_MANAGER_PASSWORD!,
  otpSecret: process.env.E2E_MANAGER_OTP_SECRET!,
};

test('Verify profile fields display correctly and are non-editable', async ({ page }) => {
  const login = new LoginActions(page);
  await login.login(user.email, user.password, user.otpSecret);

  const profileActions = new MyProfileActions(page);
  await profileActions.navigateToProfilePage();
  await profileActions.verifyAllProfileFields();
});
