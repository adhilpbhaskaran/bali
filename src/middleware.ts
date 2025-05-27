// Middleware temporarily disabled for deployment testing
// All routes are now public

export const config = {
  matcher: [
    // Disable middleware for deployment testing
    // '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // '/(api|trpc)(.*)',
  ],
}