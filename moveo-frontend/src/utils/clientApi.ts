import { API_BASE_URL } from "../config/env";

const contentHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

  return `${baseUrl}/${cleanEndpoint}`;
};

export const clientApi = {
  async get<T>(endpoint: string): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: contentHeaders,
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText} (${response.status})`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: contentHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText} (${response.status})`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: contentHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.statusText} (${response.status})`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T | void> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: contentHeaders,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.statusText} (${response.status})`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return;
  }
};

export default clientApi;