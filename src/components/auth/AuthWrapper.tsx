'use client';
import React, { ReactNode, useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Check if Clerk is properly configured
const hasValidClerkKeys = () => {
  if (typeof window === 'undefined') return false;
  
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
// Note: CLERK_SECRET_KEY should never be accessed in client-side code
  
  return publishableKey && 
         publishableKey.length > 20 && 
         !publishableKey.includes('placeholder');
};

export default function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  // Initialize clerkConfigured based on server-safe check to prevent hydration mismatch
  const [clerkConfigured, setClerkConfigured] = useState(() => {
    // On server, always return false to match initial render
    if (typeof window === 'undefined') return false;
    return hasValidClerkKeys();
  });
  
  useEffect(() => {
    setIsClient(true);
    // Only update clerkConfigured if we're on the client and it might have changed
    const currentClerkStatus = hasValidClerkKeys();
    if (clerkConfigured !== currentClerkStatus) {
      setClerkConfigured(currentClerkStatus);
    }
  }, [clerkConfigured]);

  // Render logic after all hooks are called
  if (!isClient) {
    return fallback || (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If Clerk is not properly configured, render children without auth
  if (!clerkConfigured) {
    console.warn('⚠️  Clerk not properly configured, rendering without authentication');
    return <>{children}</>;
  }

  // Only render ClerkAuthContent when Clerk is properly configured
  return <ClerkAuthContent fallback={fallback}>{children}</ClerkAuthContent>;
}

// Import Clerk hooks at the top level to avoid conditional hook calls
let useAuth: any = null;
try {
  const clerk = require('@clerk/nextjs');
  useAuth = clerk.useAuth;
} catch (error) {
  // Clerk not available
  console.warn('Clerk not available:', error);
}

// Separate component that uses Clerk hooks only when needed
function ClerkAuthContent({ children, fallback }: AuthWrapperProps) {
  // Only call the hook if Clerk is available
  if (!useAuth) {
    // Clerk not available, render children without auth
    return <>{children}</>;
  }

  try {
    const { isLoaded, userId, isSignedIn } = useAuth();
    
    // Show loading state while Clerk is initializing
    if (!isLoaded) {
      return fallback || (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return <>{children}</>;
  } catch (error) {
    // Handle Clerk configuration errors gracefully in development
    console.warn('Clerk authentication error (development mode):', error);
    
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Authentication Configuration Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Clerk authentication is not properly configured. Please check your environment variables.
                  The app will continue to work without authentication features.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // In production, silently render children without auth
    return <>{children}</>;
  }
}