import { test, expect } from '@playwright/test';
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

    // Skip dynamically if credentials are missing
    if (!E2E_MANAGER_EMAIL || !E2E_MANAGER_PASSWORD || !E2E_MANAGER_OTP_SECRET) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }

    // Login first
    await login.login(E2E_MANAGER_EMAIL!, E2E_MANAGER_PASSWORD!, E2E_MANAGER_OTP_SECRET!);
  });

  // ---------------- Positive Scenarios ----------------
  test.describe('Positive Profile Images Flows', () => {
    
    test('1. User can upload a profile image', async () => {
      await profile.navigateToProfilePage();
      const imagePath = path.resolve(__dirname, 'Images/High.jpg');
      await profile.UploadImageProfile(imagePath);
    });

    test('2. User can open the upload multiple images flow', async () => {
      await profile.navigateToProfilePage();
      const imagePath = path.resolve(__dirname, 'Images/Profile.jpg');
      await profile.uploadMultipleImages(imagePath);
    });

    test('3. Verify selected image is set as the profile image', async () => {
      await profile.navigateToProfilePage();
      await profile.setImageAsDefaultProfile();
    });

    test('4. Verify thumbnails appear after image upload', async () => {
      await profile.navigateToProfilePage();
      const imagePath = path.resolve(__dirname, 'Images/High.jpg');
      await profile.verifyThumbnailsAfterImageUpload(imagePath);
    });

    test('5. Verify thumbnails are removed when clicking cross button', async () => {
      await profile.navigateToProfilePage();
      const imagePath = path.resolve(__dirname, 'Images/High.jpg');
      await profile.verifyThumbnailsAreRemoved(imagePath);
    });

    // test('6. Verify options to delete and edit low resolution and agent face thumbnails ', async () => {
    //   await profile.navigateToProfilePage();

    //   const initialImage = path.resolve(__dirname, 'Images/High.jpg'); 

    //   // Perform full workflow on last thumbnail
    //   await profile.manageExistingThumbnails(initialImage);
    // });
  });
});
