/**
 * Environment configuration
 * Centralizes access to environment variables
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Environment
export const ENV = import.meta.env.VITE_ENV || import.meta.env.MODE;

// Development mode check
export const isDevelopment = ENV === 'development';
export const isProduction = ENV === 'production';

// Validate required environment variables
if (!API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in environment variables');
}

export default {
  API_BASE_URL,
  ENV,
  isDevelopment,
  isProduction,
};
