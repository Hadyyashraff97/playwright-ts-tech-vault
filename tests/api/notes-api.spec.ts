/**
 * Notes API Tests
 * Tests for the Notes API endpoints
 */

import { test, expect } from '@playwright/test';
import { ApiHelpers } from '../../utils/api-helpers';
import { TestData } from '../../fixtures/test-data';
import { TEST_CONFIG } from '../../config/test-config';

let apiHelpers: ApiHelpers;
let authToken: string;
let createdNoteId: string;
let registeredEmail: string;

test.describe('Notes API Tests', () => {
  test.beforeEach(async ({ request }) => {
    // Create API helpers with the request fixture and baseURL
    apiHelpers = new ApiHelpers(request, TEST_CONFIG.API_BASE_URL);
  });

  test.describe('User Registration', () => {
    test('should register a new user and verify it is created successfully', async () => {
      registeredEmail = TestData.user.email;
      
      // Register new user
      const response = await apiHelpers.registerUser(
        registeredEmail,
        TestData.user.name,
        TestData.user.password
      );

      // Verify response
      expect(response.status()).toBe(201);
      
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      expect(responseBody.data).toBeDefined();
      expect(responseBody.data.email).toBe(registeredEmail);
      
      // Store response body for report
      console.log('Registration Response:', JSON.stringify(responseBody, null, 2));
    });

    test('should handle duplicate email registration (negative test)', async () => {
      // Try to register with the same email again
      const response = await apiHelpers.registerUser(
        registeredEmail,
        TestData.user.name,
        TestData.user.password
      );

      expect([400]).toContain(response.status());
      
      const responseBody = await response.json();
      console.log('Duplicate Registration Response:', JSON.stringify(responseBody, null, 2));
    });
  });


  test.describe('Password Management', () => {
    // Setup: Register and login before each password test to make tests independent
    test.beforeEach(async () => {
      // Use unique email for each test run to avoid conflicts
      const uniqueEmail = `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
      registeredEmail = uniqueEmail;
      
      // Register a new user
      const registerResponse = await apiHelpers.registerUser(
        registeredEmail,
        TestData.user.name,
        TestData.user.password
      );
      
      expect(registerResponse.status()).toBe(201);
      
      // Login to get authentication token
      const loginResponse = await apiHelpers.login(registeredEmail, TestData.user.password);
      expect(loginResponse.status()).toBe(200);
      
      authToken = await apiHelpers.extractToken(loginResponse);
      expect(authToken).toBeTruthy();
    });

    test('should change the password and verify it is updated successfully', async () => {

      // Change password
      const response = await apiHelpers.changePassword(
        authToken,
        TestData.user.password,
        TestData.user.newPassword
      );

      // Verify response
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      
      // Verify new password works by logging in
      const loginResponse = await apiHelpers.login(registeredEmail, TestData.user.newPassword);
      expect(loginResponse.status()).toBe(200);
      
      // Update auth token for subsequent tests
      authToken = await apiHelpers.extractToken(loginResponse);
      
      // Change password back to original for cleanup
      const revertResponse = await apiHelpers.changePassword(
        authToken,
        TestData.user.newPassword,
        TestData.user.password
      );
      expect(revertResponse.status()).toBe(200);
      
      authToken = await apiHelpers.extractToken(
        await apiHelpers.login(registeredEmail, TestData.user.password)
      );
      
      console.log('Change Password Response:', JSON.stringify(await response.json(), null, 2));
    });

  });

  test.describe('Note Management', () => {
    // Setup: Register and login before each note test to make tests independent
    test.beforeEach(async () => {
      // Use unique email for each test run to avoid conflicts
      const uniqueEmail = `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
      registeredEmail = uniqueEmail;
      
      // Register a new user
      const registerResponse = await apiHelpers.registerUser(
        registeredEmail,
        TestData.user.name,
        TestData.user.password
      );
      
      expect(registerResponse.status()).toBe(201);
      
      // Login to get authentication token
      const loginResponse = await apiHelpers.login(registeredEmail, TestData.user.password);
      expect(loginResponse.status()).toBe(200);
      
      authToken = await apiHelpers.extractToken(loginResponse);
      expect(authToken).toBeTruthy();
      
      // Reset createdNoteId for each test
      createdNoteId = '';
    });

    test('should create a note for testing update and delete operations', async () => {
      const response = await apiHelpers.createNote(
        authToken,
        TestData.note.title,
        TestData.note.description,
        TestData.note.category
      );

      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      expect(responseBody.data).toBeDefined();
      expect(responseBody.data.id).toBeDefined();
      
      createdNoteId = responseBody.data.id;
      
      console.log('Create Note Response:', JSON.stringify(responseBody, null, 2));
    });

    test('should update a note and verify it is updated successfully', async () => {
      // DEBUG: Log token and test data
      console.log('=== DEBUG: Starting Update Note Test ===');
      console.log('Auth Token:', authToken ? `${authToken.substring(0, 20)}...` : 'MISSING');
      console.log('Test Data:', {
        title: TestData.note.title,
        description: TestData.note.description,
        category: TestData.note.category
      });

      // Create a note first (createdNoteId is reset in beforeEach)
      console.log('=== Creating Note ===');
      const createResponse = await apiHelpers.createNote(
        authToken,
        TestData.note.title,
        TestData.note.description,
        TestData.note.category
      );
      
      console.log('Create Note Status:', createResponse.status());
      const createBody = await createResponse.json();
      console.log('Create Note Response Body:', JSON.stringify(createBody, null, 2));
      
      // Check if creation was successful
      if (createResponse.status() !== 200) {
        console.error('ERROR: Note creation failed with status:', createResponse.status());
        console.error('Response:', JSON.stringify(createBody, null, 2));
        throw new Error(`Note creation failed with status ${createResponse.status()}. Response: ${JSON.stringify(createBody)}`);
      }
      
      expect(createResponse.status()).toBe(200);
      expect(createBody.data).toBeDefined();
      expect(createBody.data.id).toBeDefined();
      
      createdNoteId = createBody.data.id;
      console.log('Created Note ID:', createdNoteId);

      // Update the note
      console.log('=== Updating Note ===');
      console.log('Updating Note ID:', createdNoteId);
      console.log('Update Data:', {
        title: TestData.note.updatedTitle,
        description: TestData.note.updatedDescription,
        category: TestData.note.category, // Category is required for update
        completed: false
      });
      
      const response = await apiHelpers.updateNote(
        authToken,
        createdNoteId,
        TestData.note.updatedTitle,
        TestData.note.updatedDescription,
        TestData.note.category, // Add category parameter (required by API)
        false
      );

      console.log('Update Note Status:', response.status());
      
      // Parse response body once (response.json() can only be called once)
      const updateResponseBody = await response.json();
      console.log('Update Note Response Body:', JSON.stringify(updateResponseBody, null, 2));
      
      // If status is not 200, log detailed error
      if (response.status() !== 200) {
        console.error('ERROR: Update failed with status:', response.status());
        console.error('Full Response:', JSON.stringify(updateResponseBody, null, 2));
        console.error('Note ID used:', createdNoteId);
        console.error('Token used:', authToken ? `${authToken.substring(0, 20)}...` : 'MISSING');
        throw new Error(`Update note failed with status ${response.status()}. Response: ${JSON.stringify(updateResponseBody)}`);
      }

      // Verify response
      expect(response.status()).toBe(200);
      expect(updateResponseBody.success).toBe(true);
      expect(updateResponseBody.data.title).toBe(TestData.note.updatedTitle);
      expect(updateResponseBody.data.description).toBe(TestData.note.updatedDescription);
      
      // Verify note was updated by fetching it
      const getResponse = await apiHelpers.getNoteById(authToken, createdNoteId);
      const getBody = await getResponse.json();
      expect(getBody.data.title).toBe(TestData.note.updatedTitle);
      
      console.log('=== Update Note Test Completed Successfully ===');
    });

    test('should delete a note and verify it is deleted successfully', async () => {
      // Create a note first (createdNoteId is reset in beforeEach)
      const createResponse = await apiHelpers.createNote(
        authToken,
        TestData.note.title,
        TestData.note.description,
        TestData.note.category
      );
      expect(createResponse.status()).toBe(200);
      const createBody = await createResponse.json();
      createdNoteId = createBody.data.id;

      // Delete the note
      const response = await apiHelpers.deleteNote(authToken, createdNoteId);

      // Verify response
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      
      // Verify note was deleted by trying to fetch it
      const getResponse = await apiHelpers.getNoteById(authToken, createdNoteId);
      expect([404, 400]).toContain(getResponse.status());
      
      console.log('Delete Note Response:', JSON.stringify(responseBody, null, 2));
    });

    test('should get all notes', async () => {
      const response = await apiHelpers.getNotes(authToken);
      
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
      expect(Array.isArray(responseBody.data)).toBe(true);
      
      console.log('Get All Notes Response:', JSON.stringify(responseBody, null, 2));
    });
  });

  test.describe('Negative Test Scenarios', () => {
    // Setup: Register and login before each negative test
    test.beforeEach(async () => {
      // Use unique email for each test run
      const uniqueEmail = `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
      registeredEmail = uniqueEmail;
      
      // Register a new user
      const registerResponse = await apiHelpers.registerUser(
        registeredEmail,
        TestData.user.name,
        TestData.user.password
      );
      
      expect(registerResponse.status()).toBe(201);
      
      // Login to get authentication token
      const loginResponse = await apiHelpers.login(registeredEmail, TestData.user.password);
      expect(loginResponse.status()).toBe(200);
      
      authToken = await apiHelpers.extractToken(loginResponse);
      expect(authToken).toBeTruthy();
    });

    test('should handle update note with invalid ID', async () => {

      const invalidId = 'invalid-note-id-12345';
      const response = await apiHelpers.updateNote(
        authToken,
        invalidId,
        'Updated Title',
        'Updated Description',
        'Personal', // Category is required by API
        false
      );

      expect([404, 400]).toContain(response.status());
      
      const responseBody = await response.json();
      console.log('Invalid Note ID Update Response:', JSON.stringify(responseBody, null, 2));
    });

    test('should handle delete note with invalid ID', async () => {
      // authToken is already set by beforeEach hook

      const invalidId = 'invalid-note-id-12345';
      const response = await apiHelpers.deleteNote(authToken, invalidId);

      expect([404, 400]).toContain(response.status());
      
      const responseBody = await response.json();
      console.log('Invalid Note ID Delete Response:', JSON.stringify(responseBody, null, 2));
    });

    test('should handle API requests without authentication token', async () => {
      // This test intentionally doesn't use authToken from beforeEach
      // Use empty token to test unauthorized access
      const response = await apiHelpers.getNotes('');

      expect([401, 403]).toContain(response.status());
      
      const responseBody = await response.json();
      console.log('Unauthorized Request Response:', JSON.stringify(responseBody, null, 2));
    });
  });
});

