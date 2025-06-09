import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Security configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                   process.env.CLERK_SECRET_KEY &&
                   !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') &&
                   !process.env.CLERK_SECRET_KEY.includes('placeholder');

// Security warning for development
if (isDevelopment && !hasClerkKeys) {
  console.warn('⚠️  Development Mode: Clerk not configured, using fallback authentication');
}

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/auth(.*)',
  '/packages(.*)',
  '/activities(.*)',
  '/about-bali(.*)',
  '/about-us(.*)',
  '/contact(.*)'
]);

// Define protected routes that always require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/cms(.*)',
  '/admin-dashboard(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  
  // Always allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }
  
  // For protected routes, always require authentication
  if (isProtectedRoute(request)) {
    // In development without Clerk, redirect to fallback auth
    if (isDevelopment && !hasClerkKeys) {
      // Check for session cookie or redirect to login
      const sessionCookie = request.cookies.get('next-auth.session-token') || 
                           request.cookies.get('__Secure-next-auth.session-token');
      
      if (!sessionCookie && !pathname.includes('/admin-dashboard/login')) {
        return NextResponse.redirect(new URL('/admin-dashboard/login', request.url));
      }
      return NextResponse.next();
    }
    
    // Use Clerk protection for production
    await auth.protect();
  }
  
  return NextResponse.next();
}, {
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};