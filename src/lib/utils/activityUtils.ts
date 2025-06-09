/**
 * Activity utilities for API data fetching and sync with store
 * Similar to apiUtils.ts but specifically for activities
 */

import { Activity } from '@/lib/store/activities';
import { processMediaGallery } from './mediaUtils';

// Activity data from API or database
export interface ActivityData {
  id: string;
  name: string;
  title?: string;
  description: string;
  shortDescription?: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  difficulty: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published: boolean;
  publishedAt?: string;  // API returns string dates
  scheduledAt?: string;  // API returns string dates
  mediaGallery: string[];
  highlights?: string[];
  includedItems?: string[];
  excludedItems?: string[];
  createdAt: string;     // API returns string dates
  updatedAt: string;     // API returns string dates
  language?: string;
  slug?: string;
}

// API response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Activities API response
interface ActivitiesResponse {
  activities: ActivityData[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    pages: number;
    limit: number;
  };
}

/**
 * Fetch from API with error handling
 * @param url API endpoint URL
 * @param options Fetch options
 * @returns Response with success flag and data or error
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get activities with optional filtering
 * @param params Query parameters
 * @returns API response with activities data
 */
export async function getActivities(params: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
  language?: string;
  published?: boolean;
  location?: string;
  trending?: boolean;
  popular?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<ApiResponse<ActivitiesResponse>> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.category) queryParams.append('category', params.category);
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.search) queryParams.append('search', params.search);
  if (params.language) queryParams.append('language', params.language);
  if (params.published !== undefined) queryParams.append('published', params.published.toString());
  
  const queryString = queryParams.toString();
  const url = `/api/activities${queryString ? `?${queryString}` : ''}`;
  
  return await fetchApi<ActivitiesResponse>(url);
}

/**
 * Get a single activity by ID
 * @param id Activity ID or slug
 * @returns API response with activity data
 */
export async function getActivityById(
  id: string
): Promise<ApiResponse<ActivityData>> {
  return await fetchApi<ActivityData>(`/api/activities/${id}`);
}

/**
 * Convert ActivityData to Activity with proper type conversion
 */
export function convertToActivity(activityData: ActivityData): Activity {
  // Extract all existing fields from activityData
  const {
    id,
    name,
    description,
    shortDescription,
    price,
    duration,
    location,
    category,
    difficulty,
    status,
    published,
    mediaGallery,
    highlights,
    includedItems,
    excludedItems,
    language,
    slug,
  } = activityData;
  
  // Create a new Activity object with the proper date fields
  return {
    id,
    name,
    title: activityData.title || name,  // Use name as fallback for title
    description,
    shortDescription: shortDescription || '',
    price,
    duration,
    location,
    category,
    difficulty,
    status,
    published,
    mediaGallery: processMediaGallery({ mediaGallery }, 'activities'),
    highlights: highlights || [],
    includedItems: includedItems || [],
    excludedItems: excludedItems || [],
    // Date conversions with fallbacks
    createdAt: activityData.createdAt ? new Date(activityData.createdAt) : new Date(),
    updatedAt: activityData.updatedAt ? new Date(activityData.updatedAt) : new Date(),
    publishedAt: activityData.publishedAt ? new Date(activityData.publishedAt) : undefined,
    scheduledAt: activityData.scheduledAt ? new Date(activityData.scheduledAt) : undefined,
    language: language || 'EN',
    slug: slug || ''
  };
}

/**
 * Synchronize activity data from API to store
 * This is useful for ensuring the store has the latest data
 */
export async function syncActivitiesToStore(store: {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActivities: (activities: Activity[]) => void;
  setTotalPages: (pages: number) => void;
  setTotalCount: (count: number) => void;
  setPagination: (pagination: any) => void;
}, params: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
  language?: string;
  published?: boolean;
  location?: string;
  trending?: boolean;
  popular?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
} = {}) {
  store.setLoading(true);
  store.setError(null);
  
  const response = await getActivities(params);
  
  if (response.success && response.data) {
    // Convert ActivityData to Activity with proper type handling
    const convertedActivities = response.data.activities.map(act => convertToActivity(act));
    store.setActivities(convertedActivities);
    store.setTotalPages(response.data.pagination.pages);
    store.setTotalCount(response.data.pagination.total);
    store.setPagination(response.data.pagination);
  } else {
    store.setError(response.error || 'Failed to fetch activities');
    console.error('Activity sync failed:', response.error);
  }
  
  store.setLoading(false);
  
  return response.success;
}

export default {
  getActivities,
  getActivityById,
  convertToActivity,
  syncActivitiesToStore
};
