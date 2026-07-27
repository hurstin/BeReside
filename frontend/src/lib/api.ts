/**
 * Utility for making API calls to the NestJS backend.
 * Automatically attaches the JWT token from localStorage if available.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle No Content (204)
  if (response.status === 204) {
    return {} as T;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Failed to parse JSON response from server.');
  }

  if (!response.ok) {
    // Try to extract NestJS error message array or string
    const errorMessage = Array.isArray(data.message) ? data.message[0] : data.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  return data as T;
}

// Auth specific utilities
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}
