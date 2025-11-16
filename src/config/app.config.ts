/**
 * Application configuration
 * Centralized configuration for URLs and other app settings
 */

export const appConfig = {
  // Backend API base URL
  backendUrl: process.env.BACKEND_URL || process.env.BASE_URL || 'http://localhost:4000',
  
  // Frontend application URL (for email links and redirects)
  frontendUrl: process.env.FRONTEND_URL || 'https://gear-quest-hub.onrender.com',
  
  // API base URL (backend URL + /api)
  apiBaseUrl: (process.env.BACKEND_URL || process.env.BASE_URL || 'http://localhost:4000') + '/api',
};

// Export individual values for convenience
export const BACKEND_URL = appConfig.backendUrl;
export const FRONTEND_URL = appConfig.frontendUrl;
export const API_BASE_URL = appConfig.apiBaseUrl;

