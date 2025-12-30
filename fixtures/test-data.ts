/**
 * Test Data Fixtures
 * Centralized test data for reuse across tests
 */

export const TestData = {
  // User Data
  user: {
    name: `TestUser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'Test@123456',
    newPassword: 'NewTest@123456',
  },

  // Product Data
  product: {
    name: `Test Product ${Date.now()}`,
    description: 'This is a test product description',
    price: '99.99',
    category: 'Electronics',
  },

  // Search Keywords
  searchKeywords: {
    multipleResults: 'laptop',
    singleResult: 'iphone',
    noResults: 'xyzabc123nonexistent',
  },

  // Note Data
  note: {
    title: `Test Note ${Date.now()}`,
    description: 'This is a test note description',
    category: 'Personal',
    updatedTitle: `Updated Note ${Date.now()}`,
    updatedDescription: 'This is an updated test note description',
  },
} as const;

