# Playwright TypeScript Test Automation Framework

A comprehensive end-to-end test automation framework built with Playwright and TypeScript for UI and API testing. This project demonstrates best practices in test automation including Page Object Model, reusable utilities, comprehensive reporting, and CI/CD integration.

## 🎯 Overview

This test automation framework covers:

- **UI Testing**: E-commerce application and counter application
- **API Testing**: Notes API endpoints (authentication, CRUD operations)
- **Best Practices**: Page Object Model, reusable helpers, clean code structure
- **Reporting**: HTML reports with screenshots and API response bodies
- **CI/CD**: GitHub Actions integration

## 📋 Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-ts-tech-vault
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Running Tests

#### Run All Tests
```bash
npm test
```

#### Run UI Tests Only
```bash
npm run test:ui
```

#### Run API Tests Only
```bash
npm run test:api
```

#### Run Specific Test Suites

**E-commerce tests:**
```bash
npm run test:ecommerce
```

**Counter tests:**
```bash
npm run test:counter
```

#### Run Tests in Headed Mode
```bash
npm run test:headed
```

#### Run Tests in Debug Mode
```bash
npm run test:debug
```

#### View Test Report
```bash
npm run test:report
```

## 📁 Project Structure

```
playwright-ts-tech-vault/
├── config/
│   └── test-config.ts          # Test configuration and URLs
├── fixtures/
│   └── test-data.ts            # Test data fixtures
├── utils/
│   ├── api-helpers.ts          # API helper functions
│   └── page-objects/
│       ├── ecommerce.page.ts   # E-commerce page object
│       └── counter.page.ts     # Counter page object
├── tests/
│   ├── ui/
│   │   ├── ecommerce/
│   │   │   └── ecommerce.spec.ts
│   │   └── counter/
│   │       └── counter.spec.ts
│   └── api/
│       └── notes-api.spec.ts
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🧪 Test Coverage

### UI Tests

#### E-Commerce Application (`https://e-commerce-kib.netlify.app/`)
- ✅ Add a new product and verify it's added successfully
- ✅ Search for products using keywords that match multiple products
- ✅ Negative test scenarios (no search results, validation errors)

#### Counter Application (`https://flutter-angular.web.app/`)
- ✅ Click the "+" button and verify the counter is increased
- ✅ Multiple increment operations
- ✅ Counter value display verification
- ✅ Decrement functionality
- ✅ Rapid button clicks handling

### API Tests

#### Notes API (`https://practice.expandtesting.com/notes/api`)
- ✅ Register a new user and verify it's created
- ✅ Change password and verify it's updated successfully
- ✅ Update a note and verify it's updated successfully
- ✅ Delete a note and verify it's deleted successfully
- ✅ Negative test scenarios (invalid credentials, duplicate registration, invalid IDs)

## 🏗️ Architecture & Best Practices

### Page Object Model (POM)
- **Page Objects**: Encapsulate page interactions in reusable classes
- **Benefits**: Improved maintainability, reusability, and readability

### Helper Functions
- **API Helpers**: Centralized API interaction methods
- **Test Data Fixtures**: Reusable test data for consistency

### Configuration Management
- Centralized configuration for URLs, timeouts, and test data
- Environment-specific settings support

### Test Organization
- Tests grouped by feature/functionality
- Clear test descriptions and naming conventions
- Setup and teardown methods for test isolation

## 📊 Reporting

The framework generates comprehensive test reports including:

- **HTML Report**: Interactive HTML report with test results, traces, and screenshots
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD compatible XML format
- **Screenshots**: Automatic screenshots on test failures (UI tests)
- **API Responses**: Response bodies logged in console and reports

### Viewing Reports

After running tests, view the HTML report:
```bash
npm run test:report
```

Or open `playwright-report/index.html` in your browser.

## 🔄 CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

- Runs tests on push and pull requests
- Installs dependencies and Playwright browsers
- Executes all test suites
- Uploads test reports and artifacts
- Supports manual workflow dispatch

### Workflow Features

- ✅ Automatic test execution on code changes
- ✅ Test result artifacts (reports, screenshots, videos)
- ✅ 30-day retention for test artifacts
- ✅ Configurable timeouts and retries

## 🛠️ Configuration

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Video**: Retained on failure
- **Trace**: Collected on retry

### Test Configuration

Test-specific settings in `config/test-config.ts`:

- Application URLs
- API base URLs
- Timeout values
- Browser settings

## 📝 Writing New Tests

### UI Test Example

```typescript
import { test, expect } from '@playwright/test';
import { ECommercePage } from '@utils/page-objects/ecommerce.page';

test('should add a new product', async ({ page }) => {
  const ecommercePage = new ECommercePage(page);
  await ecommercePage.goto();
  await ecommercePage.addProduct('Product Name', '99.99', 'Description');
  await ecommercePage.verifyProductExists('Product Name');
});
```

### API Test Example

```typescript
import { test, expect, APIRequestContext } from '@playwright/test';
import { ApiHelpers } from '@utils/api-helpers';

test('should create a note', async ({ request }) => {
  const apiContext = await request.newContext({
    baseURL: 'https://practice.expandtesting.com/notes/api',
  });
  const apiHelpers = new ApiHelpers(apiContext);
  
  const response = await apiHelpers.createNote(
    token, 'Title', 'Description', 'Category'
  );
  
  expect(response.status()).toBe(200);
});
```

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Code Generation
Generate test code by recording interactions:
```bash
npm run test:codegen
```

### Trace Viewer
View detailed execution traces:
```bash
npx playwright show-trace trace.zip
```

## 📦 Dependencies

- **@playwright/test**: Playwright test framework
- **typescript**: TypeScript compiler
- **@types/node**: TypeScript type definitions for Node.js

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 📄 License

ISC

## 👤 Author

QA Test Automation Framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything passes
5. Submit a pull request

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Note**: This is a test automation framework created for interview assessment purposes. It demonstrates best practices in test automation, clean code architecture, and CI/CD integration.

