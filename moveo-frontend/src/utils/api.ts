import { API_BASE_URL } from '../config/env';

/**
 * API utility functions for data fetching with authentication support
 */

// Authentication token storage
let authToken: string | null = null;

// Build full API URL
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure API_BASE_URL doesn't end with slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${baseUrl}/${cleanEndpoint}`;
};

// Get authentication headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Generic fetch wrapper
export const apiClient = {
  // Token management methods
  setAuthToken: (token: string) => {
    authToken = token;
  },
  
  clearAuthToken: () => {
    authToken = null;
  },
  
  getAuthToken: () => authToken,

  async get<T>(endpoint: string): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Dispatch custom event for automatic logout
        window.dispatchEvent(new CustomEvent('api-unauthorized', { 
          detail: { error: 'UNAUTHORIZED' } 
        }));
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Dispatch custom event for automatic logout
        window.dispatchEvent(new CustomEvent('api-unauthorized', { 
          detail: { error: 'UNAUTHORIZED' } 
        }));
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Dispatch custom event for automatic logout
        window.dispatchEvent(new CustomEvent('api-unauthorized', { 
          detail: { error: 'UNAUTHORIZED' } 
        }));
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Dispatch custom event for automatic logout
        window.dispatchEvent(new CustomEvent('api-unauthorized', { 
          detail: { error: 'UNAUTHORIZED' } 
        }));
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};

export default apiClient;
