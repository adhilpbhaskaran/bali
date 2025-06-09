/**
 * API Utilities for consistent data fetching and synchronization
 * This module provides standardized methods for interacting with the API
 * and ensures proper error handling and data mapping.
 */

import { PackageData } from './packageLoader';
import { Package } from '@/lib/store/packages';

/**
 * Configuration for API requests
 */
interface ApiRequestConfig {
  cache?: 'no-cache' | 'force-cache' | 'only-if-cached';
  revalidate?: number;
  headers?: Record<string, string>;
}

/**
 * Standardized API response format
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * Fetch data from the API with standardized error handling
 */
export async function fetchApi<T>(
  endpoint: string, 
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(config?.headers || {})
    };
    
    const fetchOptions: RequestInit = {
      headers,
      next: {
        revalidate: config?.revalidate || 3600,
      },
      cache: config?.cache === 'no-cache' ? 'no-store' : undefined
    };
    
    const response = await fetch(`/api${endpoint}`, fetchOptions);
    const status = response.status;
    
    if (!response.ok) {
      console.warn(`API fetch failed for ${endpoint}. Status: ${status}`);
      return {
        success: false,
        error: `API request failed with status ${status}`,
        status
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
      status
    };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

/**
 * Get all packages with optional filters
 */
export async function getPackages(params: {
  page?: number;
  limit?: number;
  tourType?: 'FIT' | 'GIT';
  category?: string;
  search?: string;
  language?: string;
  published?: boolean;
} = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.tourType) queryParams.append('tourType', params.tourType);
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.language) queryParams.append('language', params.language);
  if (params.published !== undefined) queryParams.append('published', params.published.toString());
  
  const endpoint = `/packages?${queryParams.toString()}`;
  
  return fetchApi<{
    packages: PackageData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  }>(endpoint);
}

/**
 * Get a single package by ID
 */
export async function getPackageById(id: string) {
  return fetchApi<PackageData>(`/packages/${id}`, {
    cache: 'no-cache'
  });
}

/**
 * Convert PackageData to Package with proper type conversion
 */
export function convertToPackage(packageData: PackageData): Package {
  // Extract all existing fields from packageData
  const {
    id,
    name,
    description,
    shortDescription,
    price,
    basePrice,
    discountPrice,
    duration,
    location,
    category,
    tourType,
    status,
    published,
    mediaGallery,
    highlights,
    included,
    notIncluded,
    // Add any other fields from PackageData
  } = packageData;
  
  // Create a new Package object with the proper date fields
  return {
    id,
    name,
    description,
    shortDescription: shortDescription || '',
    price,
    basePrice: basePrice || price,
    discountPrice: discountPrice,
    duration,
    location,
    category,
    tourType,
    status,
    published,
    mediaGallery: mediaGallery || [],
    highlights: highlights || [],
    included: included || [],
    notIncluded: notIncluded || [],
    // Date conversions with fallbacks
    createdAt: new Date(),
    updatedAt: new Date(),
    // Optional fields in Package interface not in PackageData
    publishedAt: published ? new Date() : undefined,
    scheduledAt: undefined,
    // Add additional fields required by Package interface
    itinerary: packageData.itinerary || [],
    language: packageData.language || 'EN',
    slug: packageData.slug
  } as Package;
}

/**
 * Synchronize package data from API to store
 * This is useful for ensuring the store has the latest data
 */
export async function syncPackagesToStore(store: {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPackages: (packages: Package[]) => void;
  setTotalPages: (pages: number) => void;
  setTotalCount: (count: number) => void;
}, params: {
  page?: number;
  limit?: number;
  tourType?: 'FIT' | 'GIT';
  category?: string;
  search?: string;
  language?: string;
  published?: boolean;
} = {}) {
  store.setLoading(true);
  store.setError(null);
  
  const response = await getPackages(params);
  
  if (response.success && response.data) {
    // Convert PackageData to Package with proper type handling
    const convertedPackages = response.data.packages.map(pkg => convertToPackage(pkg));
    store.setPackages(convertedPackages);
    store.setTotalPages(response.data.pagination.pages);
    store.setTotalCount(response.data.pagination.total);
  } else {
    store.setError(response.error || 'Failed to fetch packages');
    console.error('Package sync failed:', response.error);
  }
  
  store.setLoading(false);
  
  return response.success;
}
