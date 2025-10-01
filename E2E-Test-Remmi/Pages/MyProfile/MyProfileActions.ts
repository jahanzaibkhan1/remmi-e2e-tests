import { Page, Locator } from '@playwright/test';
import { myProfileLocators } from './MyProfileLocators';

export class MyProfileActions {
  constructor(private page: Page) {}

  // ---------------- Navigation ----------------
  async navigateToProfilePage() {
    const profileIcon: Locator = myProfileLocators.profile(this.page);
    await profileIcon.waitFor({ state: 'visible' });
    await profileIcon.click();

    const myProfileBtn: Locator = await myProfileLocators.myProfileButton(this.page);
    await myProfileBtn.scrollIntoViewIfNeeded();
    await myProfileBtn.click({ force: true });

    // Wait for page to load completely
    await this.page.waitForTimeout(2000); // extra wait for data
  }

  // ---------------- Verify single field ----------------
  private async verifyField(fieldName: string, getField: () => Promise<Locator>) {
    let field: Locator;

    try {
      field = await getField();
      await field.waitFor({ state: 'visible', timeout: 2000 });
    } catch {
      console.log(`${fieldName} not visible or does not exist`);
      return;
    }

    // Get value
    const tag = await field.evaluate(el => el.tagName.toUpperCase());
    let value = '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      value = await field.inputValue();
    } else {
      value = (await field.textContent())?.trim() || '';
    }

    console.log(`${fieldName} value: "${value || 'EMPTY'}"`);

    // Check if non-editable
    let nonEditable = false;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      const isDisabled = await field.isDisabled();
      const isReadonly = (await field.getAttribute('readonly')) !== null;
      nonEditable = isDisabled || isReadonly;
    } else {
      const contentEditable = await field.getAttribute('contenteditable');
      nonEditable = contentEditable !== 'true';
    }

    if (nonEditable) {
      console.log(`${fieldName} is non-editable ✅`);
    } else {
      console.log(`${fieldName} is editable ⚠️`);
    }
  }

  // ---------------- Verify all fields ----------------
  async verifyAllProfileFields() {
    await this.verifyField('First Name', async () => await myProfileLocators.firstName(this.page));
    await this.verifyField('Last Name', async () => await myProfileLocators.lastName(this.page));
    await this.verifyField('Email', async () => await myProfileLocators.email(this.page));
    await this.verifyField('Mobile Number', async () => await myProfileLocators.mobileNumber(this.page));
    await this.verifyField('Telephone', async () => await myProfileLocators.telephone(this.page));
    await this.verifyField('Job Title', async () => await myProfileLocators.jobTitle(this.page));
    await this.verifyField('Biography', async () => await myProfileLocators.biography(this.page));
    await this.verifyField('Role', async () => await myProfileLocators.role(this.page));
    await this.verifyField('Group', async () => await myProfileLocators.group(this.page));
    await this.verifyField('Office', async () => await myProfileLocators.office(this.page));
}
}
