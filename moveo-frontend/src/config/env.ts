export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const ENV = import.meta.env.VITE_ENV || import.meta.env.MODE;
export const isProduction = ENV === 'production';
export const isDevelopment = ENV === 'development';

if (!API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in .env');
}

export default {
  API_BASE_URL,
  ENV,
  isDevelopment,
  isProduction,
};
