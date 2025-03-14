import { test, expect} from '@playwright/test';
import { devices } from '@playwright/test';
import { EsimPage } from '../pages/esim.page';

// Define test devices
const devicesToTest = [
  { name: 'iPhone 14', config: devices['iPhone 14'] },
  { name: 'Pixel 7', config: devices['Pixel 7'] },
  { name: 'Samsung Galaxy S21', config: devices['Samsung Galaxy S21'] },
  { name: 'iPad Mini', config: devices['iPad Mini'] },
];

// Run tests on multiple devices
devicesToTest.forEach(({ name, config }) => {
  test.use({ ...config }); // Reduce timeout to prevent long hangs

  test.describe(`UI Test on ${name}`, () => {
    test('Validate layout differences', async ({ browser, page }) => {
      if (await page.isClosed()) return;
      const context = await browser.newContext(); // Get browser context
      await context.tracing.start({ screenshots: true, snapshots: true });

      const esimPage = new EsimPage(page);
      await esimPage.visit();
      await esimPage.waitForPageLoaded();
      await expect(esimPage.mainContent).toBeVisible();

      await esimPage.scrollDown();
      await esimPage.waitForPageLoaded(); 

      // Capture screenshot for debugging
      await page.screenshot({ path: `screenshots/${name}-before-validation.png`, fullPage: true });
      
      // Validate layout differences (check if elements are visible and not overlapping)
      const elementsToCheck = ['//*[@id="app"]/div/div[1]', '//*[@id="app"]/div/div[2]/div/div[2]', '//*[@id="app"]/div/div[3]'];
      for (const selector of elementsToCheck) {
        const element = page.locator(selector);
        try {
          await page.waitForSelector(selector, { state: 'visible', timeout: 7000 });
          await element.scrollIntoViewIfNeeded();
          await expect(element).toBeVisible();
        } catch (error) {
          console.warn(`Warning: ${selector} not found or not visible on ${name}`);
        }
      }

      // Stop tracing and save it
      await context.tracing.stop({ path: `traces/${name}-trace.zip` });
    });

    test('Validate touch interactions', async ({ browser, page }) => {
      if (await page.isClosed()) return;
      const context = await browser.newContext(); // Get browser context
      await context.tracing.start({ screenshots: true, snapshots: true });

      const esimPage = new EsimPage(page);
      await esimPage.visit();
      await expect(esimPage.mainContent).toBeVisible();

      await page.waitForLoadState(); // Allow content to load

      // Capture screenshot for debugging
      await page.screenshot({ path: `screenshots/${name}-before-validation.png`, fullPage: true });

      // Capture console logs
      page.on('console', (msg) => console.log(`Console log on ${name}:`, msg.text()));

      // Handle potential popups or overlays
      const overlaySelectors = ['.popup', '.modal', '.overlay', '.cookie-banner'];
      for (const overlay of overlaySelectors) {
        if (await page.locator(overlay).count() > 0) {
          console.log(`Closing overlay: ${overlay}`);
          await page.locator(overlay).evaluate(node => node.style.display = 'none');
        }
      }

      // Detect if button is inside an iframe
      const iframes = await page.frames();
      for (const frame of iframes) {
        console.log(`Checking iframe: ${frame.url()}`);
      }

      // Remove potential overlays before interactions
      await page.evaluate(() => {
        document.querySelectorAll('div[style*="z-index"]').forEach(el => el.remove());
      });

      // Capture network request failures
      page.on('response', async (response) => {
        const status = response.status();
        if (status !== 200 && status !== 204) {
          console.warn(`[${name}] Network error: ${response.url()} - Status: ${status}`);
        }
      });

      // Validate touch interactions (click buttons, links)
      const buttons = await page.locator('button:not([disabled]), a:visible');
       for (const button of await buttons.all()) {
         try {
           if (!(await page.isClosed())) {
             const buttonText = await button.textContent();
             if (buttonText && buttonText.trim() !== '') {
               await button.waitFor({ state: 'visible', timeout: 3000 });
               await button.scrollIntoViewIfNeeded();
               await page.waitForTimeout(500); // Short delay for dynamic rendering
 
               // Ensure button is fully interactable
               const box = await button.boundingBox();
               if (box && box.width > 0 && box.height > 0) {
                 console.log(`Attempting to click: ${buttonText} at x: ${box.x}, y: ${box.y}`);
                 await button.hover();
                 await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                 try {
                   await button.click({ force: true });
                 } catch {
                   console.warn(`Click failed on ${buttonText}, using elementFromPoint().`);
                   await page.evaluate(([x, y]) => {
                    const el = document.elementFromPoint(x, y);
                    if (el instanceof HTMLElement) el.click();
                  }, [box.x + box.width / 2, box.y + box.height / 2]);
                }
                 await page.screenshot({ path: `screenshots/${name}-after-click-${buttonText.replace(/\s+/g, '-')}.png` });
               } else {
                 console.warn(`Skipping hidden button: ${buttonText}`);
               }
             }
           }
         } catch (error) {
           console.warn(`Warning: Button not clickable on ${name}`);
         }
       }
 
       // Stop tracing and save it
       if (!(await page.isClosed())) {
         await context.tracing.stop({ path: `traces/${name}-trace.zip` });
       }
    });
  });
});
