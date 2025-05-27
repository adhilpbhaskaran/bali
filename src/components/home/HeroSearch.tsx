'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

// Sample suggestions data
const searchSuggestions = [
  { id: 1, text: 'Ubud Rice Terraces', category: 'Destination' },
  { id: 2, text: 'Seminyak Beach Resorts', category: 'Accommodation' },
  { id: 3, text: 'Bali Honeymoon Packages', category: 'Package' },
  { id: 4, text: 'Mount Batur Sunrise Trek', category: 'Activity' },
  { id: 5, text: 'Uluwatu Temple', category: 'Attraction' },
  { id: 6, text: 'Balinese Cooking Class', category: 'Activity' },
  { id: 7, text: 'Luxury Villas in Canggu', category: 'Accommodation' },
  { id: 8, text: 'Nusa Penida Island Tour', category: 'Tour' },
  { id: 9, text: 'Bali Family Adventure', category: 'Package' },
  { id: 10, text: 'Tegallalang Rice Terrace', category: 'Attraction' },
  { id: 11, text: 'Bali Spiritual Retreat', category: 'Package' },
  { id: 12, text: 'Waterbom Bali', category: 'Activity' },
  { id: 13, text: 'Sacred Monkey Forest', category: 'Attraction' },
  { id: 14, text: 'Bali Nightlife', category: 'Experience' },
  { id: 15, text: 'Tanah Lot Temple', category: 'Attraction' },
];

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof searchSuggestions>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // In a real app, you might navigate to search results here
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would navigate to search results
    console.log({ searchQuery });
  };

  return (
    <div className="w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search destinations, activities, packages..."
            className="bg-dark-800/40 backdrop-blur-sm border border-white/30 text-white text-sm sm:text-base rounded-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 w-full focus:ring-primary-500 focus:border-primary-500 shadow-lg transition-all duration-300 hover:bg-dark-800/60 focus:bg-dark-800/60"
            autoComplete="off"
          />
          <button 
            type="submit" 
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-1.5 sm:p-2 transition-all duration-200"
            aria-label="Search"
          >
            <Search size={isSmallScreen ? 18 : 20} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-dark-800/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <ul className="py-1">
              {filteredSuggestions.map((suggestion) => (
                <li 
                  key={suggestion.id} 
                  className="px-4 py-2 hover:bg-dark-700 cursor-pointer transition-colors duration-150 flex justify-between items-center"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <span className="text-white text-sm sm:text-base">{suggestion.text}</span>
                  <span className="text-white/50 text-xs">{suggestion.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
