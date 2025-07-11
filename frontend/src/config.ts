// src/config.ts

/**
 * Determines the API URL based on the environment.
 * @returns The API URL.
 */
export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    // Replace with your actual production API URL
    return 'https://your-production-api-url.com'; 
  }
  // Default to localhost for development
  return 'http://localhost:3001'; 
};
