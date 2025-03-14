import { expect, Locator, Page } from '@playwright/test';

export class EsimPage {
  readonly page: Page;
  readonly baseURL: String;
  readonly mainContent: Locator;
  readonly buyForButton: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;

  constructor(page) {
    this.page = page;
    this.mainContent = page.locator('body');
    this.buyForButton = page.getByText('Buy for');
    this.emailInput = page.locator('input[type="email"]');
    this.continueButton = page.locator('#auth > button');
  }

  async visit() {
    await this.page.goto('');
    await this.page.waitForSelector('body', { state: 'visible' });
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async scrollDown() {
    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }

  async clickBuyForButton() {
    await this.buyForButton.waitFor({state: "attached"});
    await this.buyForButton.click({force: true});
  }

  async fillEmailInput(email) {
    await this.emailInput.waitFor({state: "attached"});
    await this.emailInput.fill(email);
  }

  async clickContinueButton() {
    await this.continueButton.waitFor({state: "visible"});
    await this.continueButton.click({force: true});
  }

}