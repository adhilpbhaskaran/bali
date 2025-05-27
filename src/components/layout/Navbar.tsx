'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogIn,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-900/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Bali Malayali
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/packages" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/packages') 
                  ? 'text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
            >
              Packages
            </Link>
            <Link 
              href="/activities" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/activities') 
                  ? 'text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
            >
              Activities
            </Link>
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-800 transition-colors">
                About
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 rounded-lg bg-dark-800 shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link 
                  href="/about-bali" 
                  className={`block px-4 py-2 hover:bg-dark-700 ${
                    isActive('/about-bali') ? 'text-primary-500' : 'text-white/80'
                  }`}
                >
                  About Bali
                </Link>
                <Link 
                  href="/about-us" 
                  className={`block px-4 py-2 hover:bg-dark-700 ${
                    isActive('/about-us') ? 'text-primary-500' : 'text-white/80'
                  }`}
                >
                  About Us
                </Link>
              </div>
            </div>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/contact') 
                  ? 'text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <button 
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-800 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <button className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-800 transition-colors">
              <Search size={20} />
            </button>
            {/* Authentication links removed for deployment testing */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-800 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <button
              className="p-2 ml-2 rounded-lg text-white/80 hover:text-white hover:bg-dark-800 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-dark-900/95 z-40 lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '60px' }}
      >
        <div className="container-custom py-6">
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              href="/packages" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/packages') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              Packages
            </Link>
            <Link 
              href="/activities" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/activities') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              Activities
            </Link>
            <Link 
              href="/about-bali" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/about-bali') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              About Bali
            </Link>
            <Link 
              href="/about-us" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/about-us') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive('/contact') 
                  ? 'bg-primary-900/20 text-primary-500 font-medium' 
                  : 'text-white/80 hover:text-white hover:bg-dark-800'
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            {/* Mobile authentication links removed for deployment testing */}
          </nav>
        </div>
      </div>
    </header>
  );
}
