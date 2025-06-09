import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutContent from './layout-content'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bali Malayali - Your Gateway to Bali',
  description: 'Discover the magic of Bali with our tailor-made travel packages',
}

// Check if Clerk is properly configured
const hasValidClerkKeys = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  return publishableKey && 
         secretKey && 
         publishableKey.length > 20 && 
         secretKey.length > 20 &&
         !publishableKey.includes('placeholder') &&
         !secretKey.includes('placeholder');
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only wrap with ClerkProvider if keys are valid
  if (hasValidClerkKeys()) {
    return (
      <ClerkProvider 
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <html lang="en">
          <body className={inter.className} suppressHydrationWarning={true}>
            <RootLayoutContent>{children}</RootLayoutContent>
          </body>
        </html>
      </ClerkProvider>
    )
  }

  // Fallback without ClerkProvider for development
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  )
}
