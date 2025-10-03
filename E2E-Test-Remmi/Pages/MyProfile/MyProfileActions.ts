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
      const profileIcon = this.locators.profileIcon();
      await expect(profileIcon).toBeVisible({ timeout: 20000 });
      await profileIcon.click({ force: true });

      const myProfileBtn = this.locators.myProfileButton();
      await expect(myProfileBtn).toBeVisible({ timeout: 20000 });
      await myProfileBtn.click({ force: true });
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
 // enter and Save 
  async enterPinAndSave(pin: string) {

    const pinField = this.locators.pin().first();
    await pinField.fill(pin);
    expect(await pinField.inputValue()).toBe(pin);

    const updateButton = this.locators.updateButton().first();
    await expect(updateButton).toBeVisible({ timeout: 10000 });
    await updateButton.scrollIntoViewIfNeeded();
    await updateButton.click({ force: true });

    const toast = this.locators.successToast().first();
    await expect(toast).toBeVisible({timeout:10000})
    await expect(toast).toContainText(/Profile has been updated/i);
    ;
  }

  // ---------------- Library Navigation ----------------
  async navigateToLibrary() {
    await test.step('Navigate to Library page', async () => {
      const libraryIcon = this.locators.libraryLink().first();
      await expect(libraryIcon).toBeVisible({ timeout: 15000 });
      await libraryIcon.scrollIntoViewIfNeeded();
      await libraryIcon.click({ force: true });
    });
  }

  // ---------------- Private Download ----------------

  async downloadWithCorrectPin(pin: string) {
    // ---------------- Navigate and select document ----------------
    await test.step('Navigate to library and select document', async () => {
      const libraryLink = this.locators.libraryLink().first();
      await expect(libraryLink).toBeVisible({ timeout: 15000 });
      await libraryLink.scrollIntoViewIfNeeded();
      await libraryLink.click({ force: true });

      const image = this.locators.clickImage().first();
      await image.click({ force: true });
    });

    // ---------------- Download with correct PIN ----------------
    await test.step('Download document with correct PIN', async () => {
      const downloadBtn = this.locators.privateDownloadButton().first();
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.scrollIntoViewIfNeeded();
      await downloadBtn.click({ force: true });

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      // // Verify toast Error
      const toast = this.locators.errorToast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toHaveText(/Please enter PIN first/i);
      console.log(toast);

       // Fill PIN
      const pinPopup = this.locators.pinPopupField().first();
      await expect(pinPopup).toBeVisible({ timeout: 15000 });
      await pinPopup.fill(pin);

      // // Verify toast
      const toastmessage = this.locators.successToast().first();
      await expect(toastmessage).toBeVisible({ timeout: 15000 });
      await expect(toastmessage).toHaveText(/PIN matched successfully/i);

    });
  }
  // Verify PIN is required 
  async VerifyPINisRequired(pin: string) {
    // ---------------- Navigate and select document ----------------
    await test.step('Navigate to library and select document', async () => {
      const libraryLink = this.locators.libraryLink().first();
      await expect(libraryLink).toBeVisible({ timeout: 15000 });
      await libraryLink.scrollIntoViewIfNeeded();
      await libraryLink.click({ force: true });

      const image = this.locators.clickImage().first();
      await image.click({ force: true });
    });

    // ---------------- Download with Empty PIN ----------------
    await test.step('Download document with correct PIN', async () => {
      const downloadBtn = this.locators.privateDownloadButton().first();
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.scrollIntoViewIfNeeded();
      await downloadBtn.click({ force: true });

      // Fill PIN
      const pinPopup = this.locators.pinPopupField().first();
      await expect(pinPopup).toBeVisible({ timeout: 15000 });
      await pinPopup.fill(pin);

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      // // Verify toast
      const toast = this.locators.successToast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toHaveText(/PIN matched successfully/i);

    });
  }
  // download With Incorrect Pin
  async downloadWithIncorrectPin(pin: string) {
    await test.step('Download with incorrect PIN', async () => {
      const downloadBtn = this.locators.privateDownloadButton().first();
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.scrollIntoViewIfNeeded();
      await downloadBtn.click({ force: true });

      // Fill PIN
      const pinPopup = this.locators.pinPopupField().first();
      await expect(pinPopup).toBeVisible({ timeout: 15000 });
      await pinPopup.fill(pin);

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      // // Verify toast
      const toast = this.locators.successToast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(this.locators.errorToast().first()).toHaveText(/Invalid pin/i);
    });
  }
  // Download with Empty PIN
  async downloadWithEmptyPin() {
    await test.step('Download with empty PIN', async () => {
      const libraryLink = this.locators.libraryLink().first();
      await expect(libraryLink).toBeVisible({ timeout: 15000 });
      await libraryLink.scrollIntoViewIfNeeded();
      await libraryLink.click({ force: true });

      const image = this.locators.clickImage().first();
      await image.click({ force: true });
    });

    // ---------------- Download with correct PIN ----------------
    await test.step('Download document with correct PIN', async () => {
      const downloadBtn = this.locators.privateDownloadButton().first();
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.scrollIntoViewIfNeeded();
      await downloadBtn.click({ force: true });

      const saveButton = this.locators.saveButton();
      await saveButton.click({ force: true });

      // // Verify toast
      const toast = this.locators.errorToast().first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toHaveText(/Please enter PIN first/i);
    });
  }

  // ---------------- Calendar ----------------
  async updateCalendarColor(color: string) {
    await test.step(`Update calendar color to ${color}`, async () => {
      const colorField = this.locators.calendarColor().first();
      await colorField.fill(color);
      const updateButton = this.locators.updateButton()
      await updateButton.scrollIntoViewIfNeeded();
      await this.locators.updateButton();
      expect(await colorField.inputValue()).toBe(color);
    });
  }

  async tryInvalidCalendarColor(invalidColor: string) {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      const colorField = this.locators.calendarColor().first();
      await expect(colorField).toBeVisible({ timeout: 15000 });
      await colorField.fill(invalidColor);
      await expect(this.locators.errorToast().first()).toHaveText(/invalid color/i);
    });
  }

}
