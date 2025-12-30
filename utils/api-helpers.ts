/**
 * API Helper Functions
 * Reusable functions for API testing
 */

import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiHelpers {
  constructor(
    private request: APIRequestContext,
    private baseURL: string = 'https://practice.expandtesting.com/notes/api'
  ) {}

  private url(path: string): string {
    return `${this.baseURL}${path}`;
  }

  /**
   * Register a new user
   */
  async registerUser(email: string, name: string, password: string): Promise<APIResponse> {
    return await this.request.post(this.url('/users/register'), {
      data: {
        email,
        name,
        password,
      },
    });
  }

  /**
   * Login and get authentication token
   */
  async login(email: string, password: string): Promise<APIResponse> {
    return await this.request.post(this.url('/users/login'), {
      data: {
        email,
        password,
      },
    });
  }

  /**
   * Change user password
   */
  async changePassword(token: string, currentPassword: string, newPassword: string): Promise<APIResponse> {
    return await this.request.post(this.url('/users/change-password'), {
      headers: {
        'x-auth-token': token,
      },
      data: {
        currentPassword,
        newPassword,
      },
    });
  }

  /**
   * Create a new note
   */
  async createNote(token: string, title: string, description: string, category: string): Promise<APIResponse> {
    const url = this.url('/notes');
    const requestData = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      data: {
        title,
        description,
        category,
      },
    };
    
    // DEBUG: Log request details
    console.log('=== API DEBUG: Create Note Request ===');
    console.log('URL:', url);
    console.log('Headers:', { ...requestData.headers, 'x-auth-token': token ? `${token.substring(0, 20)}...` : 'MISSING' });
    console.log('Request Body:', requestData.data);
    
    const response = await this.request.post(url, requestData);
    
    // DEBUG: Log response details (don't consume the response body here)
    console.log('Response Status:', response.status());
    console.log('Response Headers:', response.headers());
    
    return response;
  }

  /**
   * Get all notes
   */
  async getNotes(token: string): Promise<APIResponse> {
    return await this.request.get(this.url('/notes'), {
      headers: {
        'x-auth-token': token,
      },
    });
  }

  /**
   * Get a specific note by ID
   */
  async getNoteById(token: string, noteId: string): Promise<APIResponse> {
    return await this.request.get(this.url(`/notes/${noteId}`), {
      headers: {
        'x-auth-token': token,
      },
    });
  }

  /**
   * Update a note
   * Note: Category is required by the API (must be one of: Home, Work, Personal)
   */
  async updateNote(
    token: string,
    noteId: string,
    title: string,
    description: string,
    category: string,
    completed: boolean = false
  ): Promise<APIResponse> {
    const url = this.url(`/notes/${noteId}`);
    const requestData = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      data: {
        title,
        description,
        category,
        completed,
      },
    };
    
    // DEBUG: Log request details
    console.log('=== API DEBUG: Update Note Request ===');
    console.log('URL:', url);
    console.log('Headers:', { ...requestData.headers, 'x-auth-token': token ? `${token.substring(0, 20)}...` : 'MISSING' });
    console.log('Request Body:', requestData.data);
    console.log('Note ID:', noteId);
    
    const response = await this.request.put(url, requestData);
    
    // DEBUG: Log response details (don't consume the response body here)
    console.log('Response Status:', response.status());
    console.log('Response Headers:', response.headers());
    
    return response;
  }

  /**
   * Delete a note
   */
  async deleteNote(token: string, noteId: string): Promise<APIResponse> {
    return await this.request.delete(this.url(`/notes/${noteId}`), {
      headers: {
        'x-auth-token': token,
      },
    });
  }

  /**
   * Extract token from login response
   */
  async extractToken(loginResponse: APIResponse): Promise<string> {
    const body = await loginResponse.json();
    
    // Check if response structure is valid
    if (!body || !body.data || !body.data.token) {
      throw new Error(`Invalid login response structure. Response: ${JSON.stringify(body)}`);
    }
    
    return body.data.token;
  }
}

