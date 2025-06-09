'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Toaster } from 'sonner';

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin-dashboard');

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Skip Links for Accessibility - Always render to prevent hydration mismatch */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all duration-200"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              mainContent.focus();
              mainContent.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 focus:z-[9999] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all duration-200 ${isAdminRoute ? 'hidden' : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const navigation = document.getElementById('navigation');
            if (navigation) {
              navigation.focus();
              navigation.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      >
        Skip to navigation
      </a>
      {!isAdminRoute && (
        <Header />
      )}
      <main 
        id="main-content" 
        className="flex-grow w-full" 
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      {!isAdminRoute && (
        <Footer />
      )}
      {!isAdminRoute && (
        <WhatsAppButton />
      )}
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{}}
      />
    </div>
  );
}