import { test, expect } from '@playwright/test';
import { EsimPage } from '../pages/esim.page';

// Define test locations
const locations = [
  { name: 'Europe', options: { geolocation: { latitude: 48.8566, longitude: 2.3522 }, locale: 'fr-FR' } },
  { name: 'South America', options: { geolocation: { latitude: -23.5505, longitude: -46.6333 }, locale: 'pt-BR' } },
  { name: 'Asia', options: { geolocation: { latitude: 35.6895, longitude: 139.6917 }, locale: 'ja-JP' } },
  { name: 'Africa', options: { geolocation: { latitude: -1.286389, longitude: 36.817223 }, locale: 'en-KE' } },
];

// Run test for each location
test.describe('Checkout Page Load Time', () => {
  for (const location of locations) {
    test(`Measure checkout load time from ${location.name}`, async ({ browser, page }) => {
      const startTime = Date.now();
      const context = await browser.newContext(); 
      await context.tracing.start({ screenshots: true, snapshots: true });
        
      const esimPage = new EsimPage(page);
      await esimPage.visit();
      await esimPage.waitForPageLoaded();
      await expect(esimPage.buyForButton).toBeVisible();
      await esimPage.clickBuyForButton();
      await expect(esimPage.emailInput).toBeVisible();
      await esimPage.fillEmailInput('test@example.com');
      await expect(esimPage.emailInput).toBeVisible();
      await esimPage.clickContinueButton();
        
      const endTime = Date.now();
      const loadTime = (endTime - startTime) / 1000;
      console.log(`Checkout load time from ${location.name}: ${loadTime} seconds`);
      expect(loadTime).toBeLessThan(5);
    });
  }
});
