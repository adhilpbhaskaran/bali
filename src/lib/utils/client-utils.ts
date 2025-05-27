/**
 * Utility functions for client-side operations
 * These help prevent hydration errors and ensure consistent rendering
 */

/**
 * Safely access browser-only APIs
 * @returns true if code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely access localStorage with fallbacks
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = <T>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Format a date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate a unique ID (client-side only)
 */
export const generateId = (): string => {
  if (!isBrowser()) return 'server-generated-id';
  return crypto.randomUUID();
};
