import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';

export class MyProfileActions {
  private locators: MyProfileLocators;

  constructor(private page: Page) {
    this.locators = new MyProfileLocators(page);
  }

  // ---------------- Navigation ----------------
  async navigateToProfilePage() {
    await test.step('Navigate to My Profile page', async () => {
      const profileIcon = this.locators.profileIcon();
      await expect(profileIcon).toBeVisible({ timeout: 20000 });
      await profileIcon.click({ force: true });

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
    await test.step('Enter PIN and save', async () => {
      const pinField = this.locators.pin().first();
      await pinField.fill(pin);
      expect(await pinField.inputValue()).toBe(pin);

      const updateButton = this.locators.updateButton().first();

      // Ensure visible and scroll into view
      await expect(updateButton).toBeVisible({ timeout: 10000 });
      await updateButton.scrollIntoViewIfNeeded();

      // Try normal click first, then force click if needed
      try {
        await updateButton.click({ timeout: 5000 });
      } catch {
        console.log('Normal click failed, using force click');
        await updateButton.click({ force: true });
      }

      // Wait for toast
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

      const saveButton = this.locators.saveButton().first();
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

      const saveButton = this.locators.saveButton().first();
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

      const saveButton = this.locators.saveButton().first();
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

      const updateButton = this.locators.updateButton().first();
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

  // ---------------- Image Upload ----------------
  async UploadImageProfile(imagePath: string) {
    await test.step('Upload a profile image', async () => {
      // Validate the image path parameter
      if (!imagePath) {
        throw new Error('Image path is required for upload');
      }

      // Navigate to images tab
      const imagesTab = this.locators.imagesTab().first();
      await expect(imagesTab).toBeVisible({ timeout: 15000 });
      await imagesTab.click({ force: true });

      // Click add profile image button
      const addProfileImage = this.locators.addProfileImage().first();
      await expect(addProfileImage).toBeVisible({ timeout: 15000 });
      await addProfileImage.click({ force: true });

      // Handle file upload
      const uploadImage = this.locators.uploadImage().first();
      await expect(uploadImage).toBeVisible({ timeout: 15000 });
      await uploadImage.setInputFiles(imagePath);

      // Wait for upload completion (you may need to adjust this based on your app's behavior)
      // For example, wait for an upload success message or UI change
      const toast = this.locators.toast().first();
      await expect.soft(toast).toBeVisible({ timeout: 10000 });
      
      console.log(`Profile image uploaded successfully from: ${imagePath}`);
    });
  }
}
