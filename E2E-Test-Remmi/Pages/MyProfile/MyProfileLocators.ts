import { Page, Locator } from '@playwright/test';

/**
 * Class-based locators for My Profile page
 * Organized by sections: Navigation, Fields, PIN, Calendar, Buttons, Toasts
 */
export class MyProfileLocators {
  constructor(private page: Page) { }

  // ---------------- Navigation ----------------
  profileIcon(): Locator {
    return this.page.locator('.user_thumb.ng-star-inserted');
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
    return this.page.locator('div').filter({ hasText: /^Email \*\+61Mobile NumberTelephone$/ }).getByRole('textbox').nth(1);
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

  // ---------------- Private Library Download ----------------
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

  pinPopupField(): Locator {
    return this.page.getByPlaceholder('PIN');
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  // ---------------- Calendar ----------------
  calendarColor(): Locator {
    return this.page.locator('input.p-colorpicker-preview.p-inputtext[data-pc-section="input"]');
  }

  // ---------------- Buttons ----------------
  updateButton(): Locator {
    return this.page.locator('button:has-text("Update")');
  }

  // ---------------- Toasts / Messages ----------------
  successToast(): Locator {
    return this.page.locator('.toast-success');
  }

  errorToast(): Locator {
    return this.page.locator('.toast-error');
  }
}
