import { Page } from '@playwright/test';

export const myProfileLocators = {
  profile: (page: Page) => page.locator('.user_thumb.ng-star-inserted'),
  myProfileButton: (page: Page) => page.getByRole('menuitem', { name: 'My Profile' }).locator('a'),
  firstName: (page: Page) => page.getByRole('textbox', { name: 'First Name *' }),
  lastName: (page: Page) => page.getByRole('textbox', { name: 'Last Name *' }),
  jobTitle: (page: Page) => page.getByRole('textbox', { name: 'Job Title' }),
  email: (page: Page) => page.getByRole('textbox', { name: 'Email *' }),
  mobileNumber: (page: Page) => page.locator('div').filter({ hasText: /^Mobile Number$/ }),
  telephone: (page: Page) => page.locator('div').filter({ hasText: /^Telephone$/ }).nth(1),
  password: (page: Page) => page.locator('input[type="password"]'),
  generatePassword: (page: Page) => page.getByRole('button', { name: 'Generate Password' }),
  role: (page: Page) => page.locator("input[formcontrolname='role']"),
  group: (page: Page) => page.locator("input[formcontrolname='group']"),
  office: (page: Page) => page.locator("input[formcontrolname='office']"),
  pin: (page: Page) => page.locator("input[placeholder='e.g 1234']"),
  calenderColor: (page: Page) => page.locator("//div[@class='colorbox']"),
  biography: (page: Page) => page.getByRole('textbox', { name: 'Biography' }),
};
