import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';
import fs from 'fs';
import path from 'path';

export class MyProfileActions {
  private locators: MyProfileLocators;

  constructor(private page: Page) {
    this.locators = new MyProfileLocators(page);
  }

  // ---------------- Navigation ----------------
  async navigateToProfilePage() {
    await test.step('Navigate to My Profile page', async () => {
      // Use the updated profileIcon locator (handles both default and uploaded image states)
      const profileIcon = this.locators.profileIcon();
      await expect(profileIcon).toBeVisible({ timeout: 20000 });
      await profileIcon.click({ force: true });

      // Use the updated myProfileButton locator
      const myProfileButton = this.locators.myProfileButton();
      await expect(myProfileButton).toBeVisible({ timeout: 20000 });
      await myProfileButton.click({ force: true });
    });
  }

  // ---------------- Field Verification ----------------
  private async verifyField(fieldName: string, getField: () => Locator) {
    await test.step(`Verify field: ${fieldName}`, async () => {
      const field = getField().first();
      await expect(field).toBeVisible({ timeout: 15000 });

      const tag = await field.evaluate(el => el.tagName.toUpperCase());
      let value = '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        value = await field.inputValue();
      } else {
        value = (await field.textContent())?.trim() || '';
      }

      console.log(`${fieldName} value: "${value || 'EMPTY'}"`);

      const nonEditable = (tag === 'INPUT' || tag === 'TEXTAREA')
        ? await field.isDisabled() || (await field.getAttribute('readonly')) !== null
        : (await field.getAttribute('contenteditable')) !== 'true';

      console.log(`${fieldName} non-editable? ${nonEditable ? '✅ Yes' : '❌ No'}`);
      expect(nonEditable).toBe(true);
    });
  }

  async verifyAllProfileFields() {
    await this.verifyField('First Name', () => this.locators.firstName());
    await this.verifyField('Last Name', () => this.locators.lastName());
    await this.verifyField('Email', () => this.locators.email());
    await this.verifyField('Mobile Number', () => this.locators.mobileNumber());
    await this.verifyField('Telephone', () => this.locators.telephone());
    await this.verifyField('Job Title', () => this.locators.jobTitle());
    await this.verifyField('Biography', () => this.locators.biography());
    await this.verifyField('Role', () => this.locators.role());
    await this.verifyField('Group', () => this.locators.group());
    await this.verifyField('Office', () => this.locators.office());
  }

  // ---------------- PIN ----------------
  async enterPinAndSave(pin: string) {
    await test.step('Enter PIN and save profile', async () => {
      const pinField = this.locators.pin().first();
      await expect(pinField).toBeVisible({ timeout: 10000 });
      await pinField.fill(pin);
      expect(await pinField.inputValue()).toBe(pin);

      const updateButton = this.locators.updateButton().first();
      await expect(updateButton).toBeVisible({ timeout: 10000 });
      await updateButton.scrollIntoViewIfNeeded();
      await updateButton.click({ force: true });

      const toast = this.locators.profileUpdatedToast().first();
      await expect.soft(toast).toHaveText(/Profile has been updated/i, { timeout: 15000 });
    });
  }


  // ---------------- Library ----------------
  async navigateToLibrary() {
    await test.step('Navigate to Library page', async () => {
      const libraryLink = this.locators.libraryLink().first();
      await expect(libraryLink).toBeVisible({ timeout: 15000 });
      await libraryLink.scrollIntoViewIfNeeded();
      await libraryLink.click({ force: true });
    });
  }

  // ---------------- Private Download ----------------
  async downloadWithCorrectPin(pin: string) {
    await test.step('Download with correct PIN', async () => {
      const image = this.locators.clickImage().first();
      await image.click({ force: true });

      const downloadBtn = this.locators.privateDownloadButton().first();
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.click({ force: true });

      // Fill PIN directly in the popup
      const pinPopup = this.locators.pinPopupField().first();
      await expect(pinPopup).toBeVisible({ timeout: 15000 });
      await pinPopup.fill(pin);

      const confirmButton = this.page.getByRole('button', { name: /Confirm|Save/i });
      await expect(confirmButton).toBeVisible({ timeout: 10000 });
      await confirmButton.scrollIntoViewIfNeeded();
      await confirmButton.click({ force: true });

      // Wait for PIN matched success toast
      const successToast = this.locators.pinMatchedToast().first();
      await expect.soft(successToast).toBeVisible({ timeout: 7000 });
      await expect.soft(successToast).toContainText(/PIN matched successfully/i);
    });
  }

  // ---------------- Verify PIN Required ----------------
  async verifyPINIsRequired() {
    await test.step('Verify PIN is required before download', async () => {

      const image = this.locators.clickImage().first();
      await image.click({ force: true });

      const downloadBtn = this.locators.privateDownloadButton().first();
      await downloadBtn.click({ force: true });

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      const toast = this.locators.pinEmptyErrorToast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toHaveText(/Please enter PIN first/i);
      console.log(toast);
    });
  }

  // ---------------- Incorrect PIN ----------------
  async downloadWithIncorrectPin(pin: string) {
    await test.step('Download with incorrect PIN', async () => {
      const image = this.locators.clickImage().first();
      await image.click({ force: true });
      const downloadBtn = this.locators.privateDownloadButton().first();
      await downloadBtn.click({ force: true });

      const pinPopup = this.locators.pinPopupField().first();
      await pinPopup.fill(pin);

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      const errorToast = this.locators.pinInvalidErrorToast().first();
      await expect(errorToast).toBeVisible({ timeout: 15000 });
      await expect(errorToast).toHaveText(/Invalid PIN/i);
      console.log(errorToast);
    });
  }

  // ---------------- Empty PIN ----------------
  async downloadWithEmptyPin() {
    await test.step('Download with empty PIN', async () => {
      const image = this.locators.clickImage().first();
      await image.click({ force: true });

      const downloadBtn = this.locators.privateDownloadButton().first();
      await downloadBtn.click({ force: true });

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      const errorToast = this.locators.pinEmptyErrorToast().first();
      await expect(errorToast).toBeVisible({ timeout: 15000 });
      await expect(errorToast).toHaveText(/Please enter PIN first/i);
      console.log(errorToast);
    });
  }

  // ---------------- Calendar ----------------
  async updateCalendarColor(color: string) {
    await test.step(`Update calendar color to ${color}`, async () => {
      const colorField = this.locators.calendarColor().first();
      await colorField.fill(color);
      expect(await colorField.inputValue()).toBe(color);

      const updateButton = this.locators.updateButton();
      await updateButton.scrollIntoViewIfNeeded();
      await updateButton.click({ force: true });
    });
  }
  // ---------------- Invalid Calendar Color ----------------
  async tryInvalidCalendarColor(invalidColor: string) {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      const colorField = this.locators.calendarColor().first();
      await colorField.fill(invalidColor);
      const errorToast = this.locators.pinInvalidErrorToast().first();
      await expect(errorToast).toHaveText(/invalid color/i);
    });
  }
  // ---------------- Navigate to Images Tab ----------------

  async UploadImageProfile(imagePath: string) {
    await test.step('Upload a profile image', async () => {
      // Navigate to Images tab
      const imagesTab = this.locators.imagesTab().first();
      await imagesTab.click({ force: true });

      // Check if "Add a profile image" button is visible
      const addProfileImage = this.locators.addProfileImage().first();
      const isAddProfileImageVisible = await addProfileImage.isVisible();

      if (!isAddProfileImageVisible) {
        // If image already exists, log and skip upload
        console.log('Profile image already exists. Skipping upload.');
        return;
      }

      // Click "Add a profile image" button
      await addProfileImage.click({ force: true });

      // Optionally click upload icon if required
      const uploadImage = this.locators.uploadImage().first();
      // Uncomment if needed:
      // await uploadImage.click({ force: true });

      // Upload the image file
      const fileInput = await this.page.$('input[type="file"]');
      if (!fileInput) throw new Error('File input not found for image upload');
      await fileInput.setInputFiles(imagePath);

      // Move the image slightly to the left before saving
      const moveIcon = this.page.locator('div.ngx-ic-move').first();
      const boundingBox = await moveIcon.boundingBox();
      if (boundingBox) {
        await moveIcon.hover();
        await this.page.mouse.move(
          boundingBox.x + boundingBox.width / 2,
          boundingBox.y + boundingBox.height / 2
        );
        await this.page.mouse.down();
        await this.page.mouse.move(
          boundingBox.x + boundingBox.width / 2 - 30,
          boundingBox.y + boundingBox.height / 2,
          { steps: 5 }
        );
        await this.page.mouse.up();
      } else {
        throw new Error('Move icon bounding box not found');
      }

      // Click "Update Images" to save
      const updateImages = this.locators.updateImages().first();
      await updateImages.click({ force: true });

      // Wait for success toast
      const toast = this.locators.toast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toHaveText(/Images updated successfully/i);
    });
  }
  // ------------------- Verify multiple images can be uploaded -------------------
  async uploadMultipleImages(imagePath: string) {
    // Click on the Images tab
    const imagesTab = this.locators.imagesTab().first();
    await expect(imagesTab).toBeVisible({ timeout: 10000 });
    await imagesTab.click({ force: true });

    // Click the "Add More Images" button
    const addMoreImagesButton = this.locators.AddMoreImagesButton().first();
    await expect(addMoreImagesButton).toBeVisible({ timeout: 10000 });
    await addMoreImagesButton.click({ force: true });

    // Click the last visible "Upload Image" button
    const uploadButtons = this.locators.uploadMoreImageButton();
    const count = await uploadButtons.count();
    if (count === 0) throw new Error('No "Upload Image" buttons found');

    const lastUploadButton = uploadButtons.nth(count - 1);
    await lastUploadButton.scrollIntoViewIfNeeded();
    await lastUploadButton.click({ force: true });

    // 🎯 FIX: Target the matching input[type="file"] by nth index
    const fileInputs = this.page.locator('input[type="file"][name="profile"]');
    const fileInputCount = await fileInputs.count();

    console.log(`Found ${fileInputCount} file inputs — clicking last one...`);
    const lastFileInput = fileInputs.nth(fileInputCount - 1);

    await lastFileInput.setInputFiles(imagePath);

    // Move the image slightly to the left before saving
    const moveIcon = this.page.locator('div.ngx-ic-move').first();
    const boundingBox = await moveIcon.boundingBox();
    if (boundingBox) {
      await moveIcon.hover();
      await this.page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );
      await this.page.mouse.down();
      await this.page.mouse.move(
        boundingBox.x + boundingBox.width / 2 - 30,
        boundingBox.y + boundingBox.height / 2,
        { steps: 5 }
      );
      await this.page.mouse.up();
    } else {
      throw new Error('Move icon bounding box not found');
    }

    const updateImages = this.locators.updateImages().first();
    updateImages.scrollIntoViewIfNeeded();
    await updateImages.click({ force: true });

    console.log('✅ Successfully uploaded image from path:', imagePath);
  }
  // ---------------- Verify user can set selected image as profile image ----------------
  async setImageAsDefaultProfile() {
    const imagesTab = this.locators.imagesTab().first();
    await expect(imagesTab).toBeVisible({ timeout: 10000 });
    await imagesTab.click({ force: true });
    // verify check box is cliked
    const checkbox = this.locators.defaultProfileCheckbox();
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click({ force: true });
    // ✅ Verify selected image appears as profile image
    const profileImage = this.page.locator("div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted");
    await expect(profileImage.first()).toBeVisible({ timeout: 15000 });
    await expect(profileImage.first()).toHaveAttribute('src', /.+/);
  }

  // ---------------- Verify thumbnails appear after image upload ----------------

  async verifyThumbnailsAfterImageUpload(imagePath: string) {
    await test.step('Verify thumbnails appear after image upload', async () => {
      // Go to Images tab
      const imagesTab = this.locators.imagesTab().first();
      await imagesTab.click({ force: true });

      // Click “Add a profile image” button
      const addProfileImage = this.locators.addProfileImage().first();
      await addProfileImage.click({ force: true });

      // Click the last visible "Upload Image" button (after Add More Image)
      const uploadButtons = this.locators.uploadMoreImageButton();
      const count = await uploadButtons.count();
      if (count === 0) throw new Error('No "Upload Image" buttons found');

      // Click only the last upload button (the one that appears after Add More Image)
      const lastUploadButton = uploadButtons.nth(count - 1);
      await lastUploadButton.scrollIntoViewIfNeeded();
      await lastUploadButton.click({ force: true });

      // Only target the last file input (the one that appears after Add More Image)
      const fileInputs = this.page.locator('input[type="file"][name="profile"]');
      const fileInputCount = await fileInputs.count();
      if (fileInputCount === 0) throw new Error('❌ No file input found for upload');
      const lastFileInput = fileInputs.nth(fileInputCount - 1);

      await lastFileInput.setInputFiles(imagePath);

      // ✅ Verify 3 thumbnails appear (Low Resolution, Agent Face, Agent Face Selection)
      const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(2);
      const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
      const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);

      await expect(lowResolutionImg).toBeVisible();
      await expect(croppedFaceImg).toBeVisible();
      await expect(agentFaceText).toBeVisible();
      console.log('✅ Verified: Three thumbnails (Low Resolution, Agent Face, Agent Face Selection) appear successfully');
    });
  }


  // ---------------- Verify thumbnails are removed when clicking cross button ----------------

  async verifyThumbnailsAreRemoved(imagePath: string) {
    await test.step('Verify thumbnails are removed when clicking cross button', async () => {
      // Go to Images tab
      const imagesTab = this.locators.imagesTab().first();
      await imagesTab.click({ force: true });

      // Click “Add a profile image” button
      const addProfileImage = this.locators.addProfileImage().first();
      await addProfileImage.click({ force: true });

      // Click the last visible "Upload Image" button (after Add More Image)
      const uploadButtons = this.locators.uploadMoreImageButton();
      const uploadCount = await uploadButtons.count();
      if (uploadCount === 0) throw new Error('No "Upload Image" buttons found');

      const lastUploadButton = uploadButtons.nth(uploadCount - 1);
      await lastUploadButton.scrollIntoViewIfNeeded();
      await lastUploadButton.click({ force: true });

      // Set file for the last input
      const fileInputs = this.page.locator('input[type="file"][name="profile"]');
      const fileInputCount = await fileInputs.count();
      if (fileInputCount === 0) throw new Error('No file input found for upload');
      const lastFileInput = fileInputs.nth(fileInputCount - 1);
      await lastFileInput.setInputFiles(imagePath);

      // ✅ Verify 3 thumbnails appear
      const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(-1);
      const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
      const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);

      await expect(lowResolutionImg).toBeVisible();
      await expect(croppedFaceImg).toBeVisible();
      await expect(agentFaceText).toBeVisible();
      console.log('✅ Verified: Three thumbnails appear successfully');

      // ✅ Click the cross (delete) icon for the last thumbnail
      const crossIcon = this.page
        .locator('app-user-profile-images div.row > div')
        .last()
        .locator('i.pi.pi-times.f-12');

      if (await crossIcon.count() > 0 && await crossIcon.isVisible()) {
        // Ensure the cross icon is in view before clicking
        await crossIcon.scrollIntoViewIfNeeded();
        // Use JS evaluate to click the icon, handling SVGElement/HTMLElement
        await crossIcon.evaluate((el: HTMLElement | SVGElement) => {
          if (typeof (el as HTMLElement).click === 'function') {
            (el as HTMLElement).click();
          } else if (typeof (el as SVGElement).dispatchEvent === 'function') {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          }
        });

        // ✅ Verify the actual visible success message
        const successMessage = this.page.getByRole('alert', { name: 'Image deleted' });
        await expect(successMessage).toBeVisible();
        console.log('✅ Cross (delete) button clicked and image deleted successfully');
      } else {
        console.warn('⚠️ Cross (delete) button not found or not visible. Skipping delete step.');
      }
    });
  }

 // ---------------- Verify options to delete and edit low resolution and agent face thumbnails ----------------

 async manageExistingThumbnails(newImage: string) {
  await test.step('Edit and delete existing thumbnails', async () => {

    // ----------- Go to Images tab -----------
    await this.locators.imagesTab().first().click({ force: true });

    // ----------- Get all existing thumbnail containers -----------
    const thumbnails = this.page.locator('div.profile-section');
    const count = await thumbnails.count();
    if (count === 0) throw new Error('No thumbnails found to manage');

    console.log(`🖼️ Found ${count} existing thumbnails`);

    // ----------- Loop through thumbnails (or just last one) -----------
    for (let i = 0; i < count; i++) {
      const thumbnail = thumbnails.nth(i);

      // Edit icon
      const editIcon = thumbnail.locator('div.edit-icon > .d-flex > img[alt="edit"]');
      if (await editIcon.isVisible()) {
        await editIcon.scrollIntoViewIfNeeded();
        await editIcon.click({ force: true });
        console.log(`✏️ Clicked edit icon for thumbnail ${i + 1}`);

        const uploadIcon = thumbnail.locator('i.p-element.pi.pi-cloud-upload');
        await expect(uploadIcon).toBeVisible();
        await uploadIcon.click({ force: true });

        const editFileInput = thumbnail.locator('input[type="file"][name="profile"]');
        await expect(editFileInput).toBeVisible();
        await editFileInput.setInputFiles(newImage);
        console.log(`📤 Uploaded new image: ${newImage} for thumbnail ${i + 1}`);

        const updateMessage = this.page.getByRole('alert', { name: 'Image updated' });
        await expect(updateMessage).toBeVisible({ timeout: 10000 });
        console.log(`✅ Thumbnail ${i + 1} updated successfully`);
      }

      // Delete icon
      const deleteIcon = thumbnail.locator('div.edit-icon1 > .d-flex > img[src*="delete_icon.svg"]');
      if (await deleteIcon.isVisible()) {
        await deleteIcon.scrollIntoViewIfNeeded();
        await deleteIcon.click({ force: true });
        console.log(`🗑️ Clicked delete icon for thumbnail ${i + 1}`);

        const deleteMessage = this.page.getByRole('alert', { name: 'Image deleted' });
        await expect(deleteMessage).toBeVisible({ timeout: 10000 });
        console.log(`✅ Thumbnail ${i + 1} deleted successfully`);
      }
    }

    // ----------- Optionally, re-upload image to the last thumbnail -----------
    const lastThumbnail = thumbnails.nth(count - 1);
    const reUploadIcon = lastThumbnail.locator('i.p-element.pi.pi-cloud-upload');
    if (await reUploadIcon.isVisible()) {
      await reUploadIcon.scrollIntoViewIfNeeded();
      await reUploadIcon.click({ force: true });

      const reUploadInput = lastThumbnail.locator('input[type="file"][name="profile"]');
      await reUploadInput.setInputFiles(newImage);
      console.log(`📤 Re-uploaded new image to last thumbnail`);

      const finalUpdateMessage = this.page.getByRole('alert', { name: 'Image updated' });
      await expect(finalUpdateMessage).toBeVisible({ timeout: 10000 });
      console.log('✅ Last thumbnail re-uploaded and updated successfully');
    }
  });
}



}