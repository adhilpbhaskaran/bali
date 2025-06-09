'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/nextjs';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Packages', href: '/packages' },
  { name: 'Activities & Experiences', href: '/activities' },
  { name: 'About Bali', href: '/about-bali' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Handle authentication with error handling for development
  let auth;
  let authError = null;
  
  try {
    auth = useAuth();
  } catch (error) {
    console.warn('Clerk authentication error in Header:', error);
    authError = error;
    // In development, assume not authenticated but allow app to continue
    auth = { isLoaded: true, userId: null, isSignedIn: false };
  }
  
  const { isLoaded, userId, isSignedIn } = auth;

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check screen size on mount and resize
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-800/90 backdrop-blur-md shadow-md py-1 sm:py-2'
          : 'bg-transparent py-2 sm:py-4'
      }`}
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center">
              <Image
                src="/images/logo/logo.svg"
                alt="Bali Malayali"
                width={150}
                height={50}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            id="navigation" 
            className="hidden md:flex items-center space-x-8" 
            role="navigation" 
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white hover:text-primary-400 transition-colors duration-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section - Top Right */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && isSignedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Link 
                href="/sign-in" 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm mr-4"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white p-2 rounded-md hover:bg-dark-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-dark-800/95 backdrop-blur-sm shadow-lg animate-slide-down max-h-[85vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="container-custom px-4 py-3 sm:py-4">
            <nav 
              className="flex flex-col space-y-3" 
              role="navigation" 
              aria-label="Mobile navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link text-sm sm:text-base py-2 px-3 rounded-md hover:bg-dark-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {isLoaded && isSignedIn ? (
                <div className="flex flex-col space-y-2 mt-3">
                  <Link 
                    href="/dashboard" 
                    className="text-white hover:text-yellow-400 transition-colors flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Go to dashboard"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="py-2 px-3">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <Link 
                  href="/sign-in" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm mt-3 text-center focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Sign in to account"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
