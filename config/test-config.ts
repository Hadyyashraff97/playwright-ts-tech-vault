/**
 * Test Configuration
 * Centralized configuration for test environments and URLs
 */

export const TEST_CONFIG = {
  // UI Test URLs
  ECOMMERCE_URL: 'https://e-commerce-kib.netlify.app/',
  COUNTER_URL: 'https://flutter-angular.web.app/',
  
  // API Configuration
  API_BASE_URL: 'https://practice.expandtesting.com/notes/api',
  
  // Test Data
  DEFAULT_TIMEOUT: 30000,
  RETRY_COUNT: 2,
  
  // Browser Configuration
  HEADLESS: process.env.CI === 'true',
  SLOW_MO: 0,
} as const;

