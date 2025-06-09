import { NextResponse } from 'next/server';

// Error types for better categorization
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  NETWORK = 'NETWORK_ERROR'
}

// Custom error class with additional context
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date();
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error creators
export const createValidationError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.VALIDATION, 400, true, context);

export const createAuthenticationError = (message: string = 'Authentication required') =>
  new AppError(message, ErrorType.AUTHENTICATION, 401);

export const createAuthorizationError = (message: string = 'Insufficient permissions') =>
  new AppError(message, ErrorType.AUTHORIZATION, 403);

export const createNotFoundError = (resource: string = 'Resource') =>
  new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404);

export const createRateLimitError = (message: string = 'Rate limit exceeded') =>
  new AppError(message, ErrorType.RATE_LIMIT, 429);

export const createDatabaseError = (message: string, context?: Record<string, any>) =>
  new AppError(message, ErrorType.DATABASE, 500, true, context);

export const createExternalApiError = (service: string, message?: string) =>
  new AppError(
    message || `External service ${service} is unavailable`,
    ErrorType.EXTERNAL_API,
    502
  );

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle our custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          type: error.type,
          message: error.message,
          timestamp: error.timestamp.toISOString(),
          ...(process.env.NODE_ENV === 'development' && {
            context: error.context,
            stack: error.stack
          })
        }
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors from libraries like Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      {
        error: {
          type: ErrorType.VALIDATION,
          message: 'Validation failed',
          details: error.issues,
          timestamp: new Date().toISOString()
        }
      },
      { status: 400 }
    );
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  const stack = error instanceof Error ? error.stack : undefined;

  return NextResponse.json(
    {
      error: {
        type: ErrorType.INTERNAL,
        message: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack })
      }
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Client-side error handler
export function handleClientError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log error (in production, this would go to your error tracking service)
  console.error(`Client Error${context ? ` in ${context}` : ''}:`, {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  });

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error tracking service
    // errorTrackingService.captureException(error, { context });
  }
}

// Promise error handler with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }

      // Don't retry on certain error types
      if (error instanceof AppError) {
        if (
          error.type === ErrorType.VALIDATION ||
          error.type === ErrorType.AUTHENTICATION ||
          error.type === ErrorType.AUTHORIZATION ||
          error.type === ErrorType.NOT_FOUND
        ) {
          throw error;
        }
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(backoffMultiplier, attempt - 1))
      );
    }
  }

  throw lastError;
}

// React error boundary helper
export function getErrorBoundaryFallback(error: Error, errorInfo: any) {
  return {
    hasError: true,
    error: {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    }
  };
}

// Validation helper
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): T {
  if (value === null || value === undefined || value === '') {
    throw createValidationError(`${fieldName} is required`);
  }
  return value;
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data?: T; error?: Error }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    handleClientError(err, 'safeAsync operation');
    return { error: err, data: fallback };
  }
}

// Type guard for checking if error is operational
export function isOperationalError(error: unknown): error is AppError {
  return error instanceof AppError && error.isOperational;
}