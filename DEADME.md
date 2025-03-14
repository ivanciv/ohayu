Automated Playwright Test Framework
Install and setup

Install Playwright & Dependencies
npm init -y npm install -D @playwright/test npx playwright install

Run the Test with HTML Report Generation
npx playwright test --reporter=html

Open the Report Once the test completes, open the report with:
npx playwright show-report

List of tests implemented:


1. UI Test on different devise, OS and size (iPhone 14, Pixel 7, Samsung Galaxy S21, iPad Mini)
Tests:

    1. Validate layout differences between iPhone 14, Pixel 7, Samsung Galaxy S21, iPad Mini

        Steps:

        1) Capture screenshot for debugging
        2) Validate layout differences (check if elements are visible and not overlapping)

    2. Validate touch interactions by using iPhone 14, Pixel 7, Samsung Galaxy S21, iPad Mini

        Steps:

        1) Capture screenshot for debugging Z) Capture console logs
        2) Handle potential popups or overlays
        3) Detect if button is inside an iframe
        4) Remove potential overlays before interactions
        5) Capture network request failures
        6) Validate touch interactions (click buttons, links)


2. Checkout Page Load Time Test from different locations (Europe, South America, Asia, Africa)

    Tests:

    1. Measure checkout load time from Europe, South America, Asia, Africa

        Steps:

        1) Open URL
        2) Click 'BuyFor' button
        3) Fill email
        4) Click 'Continue' button
        5) Calculate load time
        6) Validate load time


Test summary:

Layout difference test found that different platforms wokrs different. Some UI elements are unavailable. In the same time they available for other platforms.

Touch interactions tests found that some clicable elements are unavailable or disabled for different platforms. Console and network errors reproduced for different platforms.

Checkout Page Load Time test foumd the load time is bigger for some platforms.