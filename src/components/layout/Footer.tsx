'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Packages', href: '/packages' },
      { name: 'Activities', href: '/activities' },
      { name: 'About Bali', href: '/about-bali' },
      { name: 'About Us', href: '/about-us' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Packages',
    links: [
      { name: 'Honeymoon Packages', href: '/packages?type=honeymoon' },
      { name: 'Family Packages', href: '/packages?type=family' },
      { name: 'Adventure Packages', href: '/packages?type=adventure' },
      { name: 'Luxury Packages', href: '/packages?type=luxury' },
      { name: 'Budget Packages', href: '/packages?type=budget' },
    ],
  },
  {
    title: 'Activities',
    links: [
      { name: 'Water Sports', href: '/activities?category=water-sports' },
      { name: 'Cultural Tours', href: '/activities?category=cultural-tours' },
      { name: 'Adventure Activities', href: '/activities?category=adventure' },
      { name: 'Spa & Wellness', href: '/activities?category=spa-wellness' },
      { name: 'Food & Dining', href: '/activities?category=food-dining' },
    ],
  },
];

export default function Footer() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
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
  
  return (
    <footer className="bg-dark-800 pt-10 sm:pt-16 pb-6 sm:pb-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/images/logo/logo.svg"
                alt="Bali Malayali"
                width={150}
                height={50}
                loading="lazy"
                className="h-8 sm:h-10 w-auto mb-3 sm:mb-4"
              />
            </Link>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 max-w-md">
              Premium Bali experiences, curated by people who understand you. We specialize in creating unforgettable journeys through the island of gods.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={isSmallScreen ? 18 : 20} aria-hidden="true" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={isSmallScreen ? 18 : 20} aria-hidden="true" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={isSmallScreen ? 18 : 20} aria-hidden="true" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 rounded"
                aria-label="Follow us on YouTube"
              >
                <Youtube size={isSmallScreen ? 18 : 20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-white text-sm sm:text-base font-semibold mb-2 sm:mb-4">{column.title}</h3>
              <ul className="space-y-1 sm:space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <p className="text-white/70 text-xs sm:text-sm text-center sm:text-left">
                  &copy; {new Date().getFullYear()} Bali Malayali. All rights reserved.
                </p>
                <Link 
                  href="/admin-dashboard" 
                  className="text-white/70 hover:text-white text-xs sm:text-sm transition-colors underline"
                >
                  Agent Portal
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:space-x-6">
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
