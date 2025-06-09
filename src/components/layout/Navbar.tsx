'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import BaliImage from '@/components/ui/BaliImage';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close dropdowns when toggling mobile menu
    setIsPackagesOpen(false);
    setIsAboutOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const togglePackagesDropdown = () => {
    setIsPackagesOpen(!isPackagesOpen);
    // Close other dropdown
    setIsAboutOpen(false);
  };

  const toggleAboutDropdown = () => {
    setIsAboutOpen(!isAboutOpen);
    // Close other dropdown
    setIsPackagesOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/90 backdrop-blur-md py-2' : 'bg-transparent py-4'}`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Bali Malayali - Home">
            <BaliImage 
              src="/logo.png" 
              alt="Bali Malayali Logo" 
              width={150} 
              height={40} 
              className="h-10 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            
            {/* Packages Dropdown */}
            <div className="relative">
              <div 
                className={`nav-link flex items-center cursor-pointer ${isActive('/packages') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
                onClick={togglePackagesDropdown}
                onKeyDown={(e) => handleKeyDown(e, togglePackagesDropdown)}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={isPackagesOpen}
                aria-controls="packages-dropdown"
              >
                Packages <ChevronDown size={16} className="ml-1" aria-hidden="true" />
              </div>
              
              {isPackagesOpen && (
                <div 
                  id="packages-dropdown"
                  className="absolute top-full left-0 mt-2 w-64 bg-dark-800 rounded-lg shadow-lg py-2 z-50"
                  role="menu"
                >
                  <Link 
                    href="/packages" 
                    className="block px-4 py-2 hover:bg-dark-700 text-white hover:text-primary-500"
                    role="menuitem"
                    onClick={() => setIsPackagesOpen(false)}
                  >
                    All Packages
                  </Link>
                  <Link 
                    href="/packages/bestseller" 
                    className="block px-4 py-2 hover:bg-dark-700 text-white hover:text-primary-500"
                    role="menuitem"
                    onClick={() => setIsPackagesOpen(false)}
                  >
                    Best Seller Packages
                  </Link>
                  <Link 
                    href="/packages/Upcoming-Group-Trips" 
                    className="block px-4 py-2 hover:bg-dark-700 text-white hover:text-primary-500"
                    role="menuitem"
                    onClick={() => setIsPackagesOpen(false)}
                  >
                    Upcoming Group Trips
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/activities" 
              className={`nav-link ${isActive('/activities') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
              aria-current={isActive('/activities') ? 'page' : undefined}
            >
              Activities
            </Link>
            
            {/* About Dropdown */}
            <div className="relative">
              <div 
                className={`nav-link flex items-center cursor-pointer ${isActive('/about') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
                onClick={toggleAboutDropdown}
                onKeyDown={(e) => handleKeyDown(e, toggleAboutDropdown)}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={isAboutOpen}
                aria-controls="about-dropdown"
              >
                About <ChevronDown size={16} className="ml-1" aria-hidden="true" />
              </div>
              
              {isAboutOpen && (
                <div 
                  id="about-dropdown"
                  className="absolute top-full left-0 mt-2 w-64 bg-dark-800 rounded-lg shadow-lg py-2 z-50"
                  role="menu"
                >
                  <Link 
                    href="/about-us" 
                    className="block px-4 py-2 hover:bg-dark-700 text-white hover:text-primary-500"
                    role="menuitem"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/about-bali" 
                    className="block px-4 py-2 hover:bg-dark-700 text-white hover:text-primary-500"
                    role="menuitem"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    About Bali
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/blog" 
              className={`nav-link ${isActive('/blog') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
              aria-current={isActive('/blog') ? 'page' : undefined}
            >
              Blog
            </Link>
            
            <Link 
              href="/contact" 
              className={`nav-link ${isActive('/contact') ? 'text-primary-500' : 'text-white hover:text-primary-500'}`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              Contact
            </Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-dark-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-white" aria-hidden="true" />
              ) : (
                <Moon size={20} className="text-white" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={toggleTheme} 
              className="p-2 mr-2 rounded-full hover:bg-dark-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-white" aria-hidden="true" />
              ) : (
                <Moon size={20} className="text-white" aria-hidden="true" />
              )}
            </button>
            
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-full hover:bg-dark-700 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-white" aria-hidden="true" />
              ) : (
                <Menu size={24} className="text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden bg-dark-800 shadow-lg py-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`block py-2 ${isActive('/') ? 'text-primary-500' : 'text-white'}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            
            {/* Mobile Packages Dropdown */}
            <div>
              <div 
                className={`flex justify-between items-center py-2 ${isActive('/packages') ? 'text-primary-500' : 'text-white'}`}
                onClick={togglePackagesDropdown}
                onKeyDown={(e) => handleKeyDown(e, togglePackagesDropdown)}
                tabIndex={0}
                role="button"
                aria-expanded={isPackagesOpen}
                aria-controls="mobile-packages-dropdown"
              >
                <span>Packages</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isPackagesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </div>
              
              {isPackagesOpen && (
                <div 
                  id="mobile-packages-dropdown"
                  className="pl-4 mt-2 space-y-2"
                  role="menu"
                >
                  <Link 
                    href="/packages" 
                    className={`block py-2 ${isActive('/packages') && pathname === '/packages' ? 'text-primary-500' : 'text-white/80'}`}
                    role="menuitem"
                  >
                    All Packages
                  </Link>
                  <Link 
                    href="/packages/bestseller" 
                    className={`block py-2 ${isActive('/packages/bestseller') ? 'text-primary-500' : 'text-white/80'}`}
                    role="menuitem"
                  >
                    Best Seller Packages
                  </Link>
                  <Link 
                    href="/packages/Upcoming-Group-Trips" 
                    className={`block py-2 ${isActive('/packages/Upcoming-Group-Trips') ? 'text-primary-500' : 'text-white/80'}`}
                    role="menuitem"
                  >
                    Upcoming Group Trips
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/activities" 
              className={`block py-2 ${isActive('/activities') ? 'text-primary-500' : 'text-white'}`}
              aria-current={isActive('/activities') ? 'page' : undefined}
            >
              Activities
            </Link>
            
            {/* Mobile About Dropdown */}
            <div>
              <div 
                className={`flex justify-between items-center py-2 ${isActive('/about') ? 'text-primary-500' : 'text-white'}`}
                onClick={toggleAboutDropdown}
                onKeyDown={(e) => handleKeyDown(e, toggleAboutDropdown)}
                tabIndex={0}
                role="button"
                aria-expanded={isAboutOpen}
                aria-controls="mobile-about-dropdown"
              >
                <span>About</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </div>
              
              {isAboutOpen && (
                <div 
                  id="mobile-about-dropdown"
                  className="pl-4 mt-2 space-y-2"
                  role="menu"
                >
                  <Link 
                    href="/about-us" 
                    className={`block py-2 ${isActive('/about-us') ? 'text-primary-500' : 'text-white/80'}`}
                    role="menuitem"
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/about-bali" 
                    className={`block py-2 ${isActive('/about-bali') ? 'text-primary-500' : 'text-white/80'}`}
                    role="menuitem"
                  >
                    About Bali
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/blog" 
              className={`block py-2 ${isActive('/blog') ? 'text-primary-500' : 'text-white'}`}
              aria-current={isActive('/blog') ? 'page' : undefined}
            >
              Blog
            </Link>
            
            <Link 
              href="/contact" 
              className={`block py-2 ${isActive('/contact') ? 'text-primary-500' : 'text-white'}`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
