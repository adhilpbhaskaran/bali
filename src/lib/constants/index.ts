// Application-wide constants to replace magic numbers and hardcoded values

// =============================================================================
// BREAKPOINTS & RESPONSIVE DESIGN
// =============================================================================
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`
} as const;

// =============================================================================
// TIMING & DELAYS
// =============================================================================
export const TIMING = {
  // Animation durations (ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
  ANIMATION_VERY_SLOW: 1000,
  
  // Debounce delays (ms)
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_RESIZE: 250,
  DEBOUNCE_SCROLL: 100,
  DEBOUNCE_INPUT: 500,
  
  // Timeout delays (ms)
  TIMEOUT_SHORT: 1000,
  TIMEOUT_MEDIUM: 3000,
  TIMEOUT_LONG: 5000,
  TIMEOUT_VERY_LONG: 10000,
  
  // Retry delays (ms)
  RETRY_DELAY_BASE: 1000,
  RETRY_DELAY_MAX: 30000,
  
  // Cache durations (ms)
  CACHE_SHORT: 5 * 60 * 1000, // 5 minutes
  CACHE_MEDIUM: 30 * 60 * 1000, // 30 minutes
  CACHE_LONG: 24 * 60 * 60 * 1000, // 24 hours
  
  // Session timeouts (ms)
  SESSION_WARNING: 25 * 60 * 1000, // 25 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Image loading timeouts (ms)
  IMAGE_LOAD_TIMEOUT: 10000,
  IMAGE_RETRY_DELAY: 2000
} as const;

// =============================================================================
// LIMITS & CONSTRAINTS
// =============================================================================
export const LIMITS = {
  // Content limits
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CONTENT_LENGTH: 10000,
  MAX_COMMENT_LENGTH: 1000,
  MAX_BIO_LENGTH: 300,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_DOCUMENT_SIZE: 25 * 1024 * 1024, // 25MB
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
  
  // API limits
  MAX_RETRY_ATTEMPTS: 3,
  MAX_CONCURRENT_REQUESTS: 5,
  
  // Search limits
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MAX_SEARCH_RESULTS: 50,
  
  // User limits
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  
  // Rate limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // Log storage
  MAX_STORED_LOGS: 100,
  MAX_LOG_ENTRY_SIZE: 1000
} as const;

// =============================================================================
// DIMENSIONS & SIZING
// =============================================================================
export const DIMENSIONS = {
  // Image dimensions
  THUMBNAIL_SIZE: 150,
  SMALL_IMAGE_SIZE: 300,
  MEDIUM_IMAGE_SIZE: 600,
  LARGE_IMAGE_SIZE: 1200,
  
  // Avatar sizes
  AVATAR_SMALL: 32,
  AVATAR_MEDIUM: 48,
  AVATAR_LARGE: 64,
  AVATAR_EXTRA_LARGE: 96,
  
  // Icon sizes
  ICON_SMALL: 16,
  ICON_MEDIUM: 24,
  ICON_LARGE: 32,
  ICON_EXTRA_LARGE: 48,
  
  // Layout dimensions
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 200,
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  
  // Container widths
  CONTAINER_SM: 640,
  CONTAINER_MD: 768,
  CONTAINER_LG: 1024,
  CONTAINER_XL: 1280,
  
  // Border radius
  RADIUS_SMALL: 4,
  RADIUS_MEDIUM: 8,
  RADIUS_LARGE: 12,
  RADIUS_EXTRA_LARGE: 16,
  
  // Z-index layers
  Z_INDEX_DROPDOWN: 1000,
  Z_INDEX_STICKY: 1020,
  Z_INDEX_FIXED: 1030,
  Z_INDEX_MODAL_BACKDROP: 1040,
  Z_INDEX_MODAL: 1050,
  Z_INDEX_POPOVER: 1060,
  Z_INDEX_TOOLTIP: 1070,
  Z_INDEX_TOAST: 1080
} as const;

// =============================================================================
// API ENDPOINTS
// =============================================================================
export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_VERIFY: '/api/auth/verify',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',
  AUTH_ME: '/api/auth/me',
  
  // User management
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_SETTINGS: '/api/users/settings',
  
  // Content management
  POSTS: '/api/posts',
  PAGES: '/api/pages',
  MEDIA: '/api/media',
  COMMENTS: '/api/comments',
  
  // Reviews and testimonials
  REVIEWS: '/api/reviews',
  TESTIMONIALS: '/api/testimonials',
  GOOGLE_REVIEWS: '/api/reviews/google',
  
  // External services
  GOOGLE_PLACES: '/api/external/google-places',
  ANALYTICS: '/api/analytics',
  
  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_CONTENT: '/api/admin/content',
  ADMIN_SETTINGS: '/api/admin/settings'
} as const;

// =============================================================================
// HTTP STATUS CODES
// =============================================================================
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================
export const ERROR_MESSAGES = {
  // Generic
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Account has been locked. Please contact support.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED_ACCESS: 'You are not authorized to access this resource.',
  
  // Validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: `Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters long.`,
  PASSWORD_TOO_LONG: `Password must be no more than ${LIMITS.MAX_PASSWORD_LENGTH} characters long.`,
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  
  // File upload
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Content
  CONTENT_NOT_FOUND: 'The requested content was not found.',
  CONTENT_TOO_LONG: 'Content exceeds the maximum allowed length.',
  INVALID_CONTENT: 'Content contains invalid characters or formatting.',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  
  // Server
  SERVER_ERROR: 'Internal server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.'
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  REGISTRATION_SUCCESS: 'Account created successfully.',
  PASSWORD_RESET_SUCCESS: 'Password reset email sent.',
  PASSWORD_CHANGED_SUCCESS: 'Password changed successfully.',
  
  // Content
  CONTENT_SAVED: 'Content saved successfully.',
  CONTENT_PUBLISHED: 'Content published successfully.',
  CONTENT_DELETED: 'Content deleted successfully.',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  
  // File upload
  FILE_UPLOADED: 'File uploaded successfully.',
  
  // Reviews
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  REVIEW_UPDATED: 'Review updated successfully.'
} as const;

// =============================================================================
// ROUTES
// =============================================================================
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  GALLERY: '/gallery',
  REVIEWS: '/reviews',
  BLOG: '/blog',
  
  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // User routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DASHBOARD: '/dashboard',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_SETTINGS: '/admin/settings',
  
  // CMS routes
  CMS: '/cms',
  CMS_POSTS: '/cms/posts',
  CMS_PAGES: '/cms/pages',
  CMS_MEDIA: '/cms/media'
} as const;

// =============================================================================
// STORAGE KEYS
// =============================================================================
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // Preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  
  // Cache
  CACHE_PREFIX: 'cache_',
  
  // Logs
  APP_LOGS: 'app_logs',
  
  // Temporary data
  FORM_DRAFT: 'form_draft_',
  SEARCH_HISTORY: 'search_history'
} as const;

// =============================================================================
// REGEX PATTERNS
// =============================================================================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  CREDIT_CARD: /^[0-9]{13,19}$/,
  POSTAL_CODE: /^[0-9]{5}(-[0-9]{4})?$/
} as const;

// =============================================================================
// FILE TYPES
// =============================================================================
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
  ARCHIVES: ['application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip']
} as const;

// =============================================================================
// SOCIAL MEDIA
// =============================================================================
export const SOCIAL_MEDIA = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  PINTEREST: 'pinterest'
} as const;

// =============================================================================
// THEME COLORS
// =============================================================================
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#64748B',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4'
} as const;

// =============================================================================
// ENVIRONMENT VARIABLES
// =============================================================================
export const ENV_VARS = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
} as const;

// Type exports for better TypeScript support
export type Breakpoint = keyof typeof BREAKPOINTS;
export type MediaQuery = keyof typeof MEDIA_QUERIES;
export type Route = typeof ROUTES[keyof typeof ROUTES];
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type SocialMedia = typeof SOCIAL_MEDIA[keyof typeof SOCIAL_MEDIA];