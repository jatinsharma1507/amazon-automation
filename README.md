Amazon Automation Tests 🛒
Automated test suite for the TestMu AI (LambdaTest) – Customer Engineering Intern assignment.
Built with Playwright + JavaScript, the tests search Amazon for an iPhone and a Samsung Galaxy device, add each to the cart, and print the price to the console — running in parallel.

📋 Test Cases
#TestDescription1iPhoneNavigate to Amazon → Search "iPhone 15" → Open first result → Print price → Add to cart2Samsung GalaxyNavigate to Amazon → Search "Samsung Galaxy S24" → Open first result → Print price → Add to cart
Both tests run simultaneously using Playwright's parallel workers.

🗂️ Project Structure
amazon-automation/
├── tests/
│   ├── helpers.js        # Shared logic: stealth setup, search, price extraction
│   ├── iphone.test.js    # Test Case 1
│   └── galaxy.test.js    # Test Case 2
├── playwright.config.js  # Parallel execution config
├── package.json
└── README.md

⚙️ Prerequisites

Node.js v18 or higher → Download
Google Chrome installed on your system

Verify Node is installed:
bashnode --version
npm --version

🚀 Installation
bash# 1. Clone the repository
git clone https://github.com/jatinsharma1507/amazon-automation.git

# 2. Go into the project folder
cd amazon-automation

# 3. Install dependencies
npm install

# 4. Install Playwright Chrome browser
npx playwright install chrome

▶️ Running the Tests
Run both tests in parallel
bashnpm test
Run with visible browser window
bashnpm run test:headed
Run only iPhone test
bashnpm run test:iphone
Run only Galaxy test
bashnpm run test:galaxy
View HTML report after run
bashnpm run report

📊 Expected Console Output
────────────────────────────────────────────
 🚀  Starting: iPhone
────────────────────────────────────────────
✅  Loaded Amazon.com
✅  Searched for "iPhone 15"
✅  Opened first search result
────────────────────────────────────────────
  💰  iPhone Price: $829.00
────────────────────────────────────────────
✅  Clicked "Add to Cart"
✅  iPhone added to cart! (Cart count: 1)

✔   iPhone test complete!

⚡ Parallel Execution
Configured in playwright.config.js:
jsfullyParallel: true,
workers: 2
Both tests open separate browser windows and run at the same time — cutting total execution time in half.

🛡️ Anti-Detection
Amazon actively blocks automated browsers. This project handles it by:

Removing the navigator.webdriver flag
Using your real installed Chrome (channel: 'chrome')
Human-like typing with random delays between keystrokes
Realistic browser headers and user agent


🛠️ Tech Stack
ToolVersionPurposePlaywright^1.43.0Browser automationNode.jsv18+RuntimeJavaScriptES2020LanguageChromeLatestBrowser

☁️ LambdaTest Cloud (Bonus)
To run on LambdaTest cloud grid:

Sign up at LambdaTest.com
Get your Username and Access Token from the dashboard
Update playwright.config.js:

jsuse: {
  connectOptions: {
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify({
      browserName: 'Chrome',
      browserVersion: 'latest',
      'LT:Options': {
        platform: 'Windows 10',
        build: 'Amazon Automation - TestMu Assignment',
        name: 'iPhone and Galaxy Tests',
        user: 'YOUR_LT_USERNAME',
        accessKey: 'YOUR_LT_ACCESS_KEY',
      }
    }))}`
  }
}

Assignment submission for TestMu AI – Customer Engineering Intern role