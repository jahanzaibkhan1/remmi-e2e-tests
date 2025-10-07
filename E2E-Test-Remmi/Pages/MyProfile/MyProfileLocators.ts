import { Page, Locator } from '@playwright/test';

/**
 * Locators for the My Profile page.
 * Organized into clear sections for navigation, fields, buttons, PIN, and toast messages.
 */
export class MyProfileLocators {
  constructor(private page: Page) {}

  // ---------------- Navigation ----------------
  /**
   * Returns the locator for the profile icon.
   * Note: After uploading a profile image, the class or structure may change.
   * This method attempts to handle both the default and post-upload states.
   */
  profileIcon(): Locator {
    // Try the default selector first
    const defaultIcon = this.page.locator('.user_thumb.ng-star-inserted');
    // After image upload, the class may change (e.g., to .user_thumb.has-image or similar)
    const uploadedIcon = this.page.locator("div.user-thumbnail-placeholder >> img");
    // Return whichever is visible, fallback to default
    return this.page.locator("div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted");
  }

  myProfileButton(): Locator {
    return this.page.getByRole('menuitem', { name: 'My Profile' }).locator('a');
  }

  // ---------------- Profile Fields ----------------
  firstName(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name *' });
  }

  lastName(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name *' });
  }

  email(): Locator {
    return this.page.getByRole('textbox', { name: 'Email *' });
  }

  mobileNumber(): Locator {
    return this.page
      .locator('div')
      .filter({ hasText: /^Email \*\+61Mobile NumberTelephone$/ })
      .getByRole('textbox')
      .nth(1);
  }

  telephone(): Locator {
    return this.page.locator('div').filter({ hasText: /^Telephone$/ }).nth(1);
  }

  jobTitle(): Locator {
    return this.page.getByRole('textbox', { name: 'Job Title' });
  }

  biography(): Locator {
    return this.page.getByRole('textbox', { name: 'Biography' });
  }

  role(): Locator {
    return this.page.locator("input[formcontrolname='role']");
  }

  group(): Locator {
    return this.page.locator("input[formcontrolname='group']");
  }

  office(): Locator {
    return this.page.locator("input[formcontrolname='office']");
  }

  // ---------------- Password & PIN ----------------
  password(): Locator {
    return this.page.locator('input[type="password"]');
  }

  generatePassword(): Locator {
    return this.page.getByRole('button', { name: 'Generate Password' });
  }

  pin(): Locator {
    return this.page.locator("input[placeholder='e.g 1234']");
  }

  pinPopupField(): Locator {
    return this.page.getByPlaceholder('PIN');
  }

  // ---------------- Private Library ----------------
  libraryLink(): Locator {
    return this.page.locator("//li[@data-label='Library']");
  }

  searchBox(): Locator {
    return this.page.locator('#wrapper').getByRole('textbox', { name: 'Search' });
  }

  clickImage(): Locator {
    return this.page.locator("(//img[@class='img-hub2 ng-star-inserted'])[1]");
  }

  privateDownloadButton(): Locator {
    return this.page.locator('.p-element.mr-3.pi.pi-download');
  }

  // ---------------- Calendar ----------------
  calendarColor(): Locator {
    return this.page.locator(
      'input.p-colorpicker-preview.p-inputtext[data-pc-section="input"]'
    );
  }

  // ---------------- Buttons ----------------
  updateButton(): Locator {
    return this.page.locator('button:has-text("Update")').first();
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  pinConfirmButton(): Locator {
    return this.page.getByRole('button', { name: /Confirm|OK|Save/i });
  }

  // ---------------- Toasts / Messages ----------------
  
  toast(): Locator {
    return this.page.locator('div[role="alert"]');
  }

  profileUpdatedToast(): Locator {
    return this.page.getByRole('alert', { name: /Profile has been updated/i });
  }

  pinMatchedToast(): Locator {
    return this.page.getByRole('alert', { name: /PIN matched successfully/i });
  }

  pinEmptyErrorToast(): Locator {
    return this.page.getByRole('alert', { name: /Please enter PIN first/i });
  }

  pinInvalidErrorToast(): Locator {
    return this.page.getByRole('alert', { name: /Invalid PIN/i });
  }

  // ---------------- Images Tab ----------------
  imagesTab(): Locator {
    return this.page.getByText('Images', { exact: true });;
  }
  addProfileImage(): Locator {
    return this.page.locator("i[class='pi pi-plus f-12']");
  }
  uploadImage(index: number = 0): Locator {
    return this.page.locator('[ptooltip="Upload Image"]');
  }
  updateImages(): Locator {
    return this.page.locator('button:has-text("Update Images")');
  }
  AddMoreImages():Locator{
    return this.page.locator("i[class='pi pi-plus f-12']");
  }
  uploadMoreImage(index: number = 0): Locator {
    return this.page.locator('div.ml-5 input[type="file"]');
  }
}
