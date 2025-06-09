'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign,
  X
} from 'lucide-react';

// Sample data for packages and activities
const allPackages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    description: "7 days of pure romance in the island of gods",
    price: 899,
    discountPrice: 799,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    duration: "7 days",
    location: "Bali, Indonesia",
    rating: 4.9,
    reviews: 128,
    type: "package"
  },
  {
    id: 2,
    title: "Bali Adventure Package",
    description: "5 days of thrilling adventures across Bali's most exciting locations",
    price: 749,
    discountPrice: 699,
    image: "/images/packages/adventure.jpg",
    category: "adventure",
    duration: "5 days",
    location: "Bali, Indonesia",
    rating: 4.8,
    reviews: 96,
    type: "package"
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    description: "6 days of pure luxury and relaxation in Bali's finest resorts",
    price: 1299,
    discountPrice: 1199,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    duration: "6 days",
    location: "Bali, Indonesia",
    rating: 4.9,
    reviews: 84,
    type: "package"
  },
  {
    id: 4,
    title: "Family Fun in Bali",
    description: "6 days of family-friendly activities and accommodations",
    price: 849,
    discountPrice: 799,
    image: "/images/packages/family.jpg",
    category: "family",
    duration: "6 days",
    location: "Bali, Indonesia",
    rating: 4.7,
    reviews: 72,
    type: "package"
  },
  {
    id: 5,
    title: "Budget Bali Explorer",
    description: "5 days of exploring Bali on a budget without compromising on experiences",
    price: 599,
    discountPrice: 549,
    image: "/images/packages/budget.jpg",
    category: "budget",
    duration: "5 days",
    location: "Bali, Indonesia",
    rating: 4.6,
    reviews: 108,
    type: "package"
  }
];

const allActivities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    description: "Experience a magical sunrise from the top of an active volcano",
    price: 65,
    discountPrice: 55,
    image: "/images/activities/mount-batur.jpg",
    category: "adventure",
    duration: "6 hours",
    location: "Kintamani, Bali",
    rating: 4.8,
    reviews: 156,
    type: "activity"
  },
  {
    id: 2,
    title: "Ubud Cultural Tour",
    description: "Immerse yourself in Balinese culture with this comprehensive tour",
    price: 45,
    discountPrice: 45,
    image: "/images/activities/ubud-cultural.jpg",
    category: "cultural",
    duration: "8 hours",
    location: "Ubud, Bali",
    rating: 4.7,
    reviews: 124,
    type: "activity"
  },
  {
    id: 3,
    title: "Bali Swing Experience",
    description: "Soar high above the jungle canopy on Bali's famous swings",
    price: 35,
    discountPrice: 30,
    image: "/images/activities/bali-swing.jpg",
    category: "adventure",
    duration: "3 hours",
    location: "Ubud, Bali",
    rating: 4.6,
    reviews: 210,
    type: "activity"
  },
  {
    id: 4,
    title: "Ayung River Rafting",
    description: "Navigate thrilling rapids through stunning rainforest scenery",
    price: 45,
    discountPrice: 40,
    image: "/images/activities/white-water-rafting.jpg",
    category: "adventure",
    duration: "4 hours",
    location: "Ubud, Bali",
    rating: 4.8,
    reviews: 178,
    type: "activity"
  },
  {
    id: 5,
    title: "Uluwatu Temple & Kecak Dance",
    description: "Visit the clifftop temple and watch the mesmerizing Kecak fire dance at sunset",
    price: 40,
    discountPrice: 35,
    image: "/images/activities/uluwatu-kecak.jpg",
    category: "cultural",
    duration: "5 hours",
    location: "Uluwatu, Bali",
    rating: 4.7,
    reviews: 142,
    type: "activity"
  }
];

// Combine packages and activities for search
const allItems = [...allPackages, ...allActivities];

// Component that uses useSearchParams wrapped in Suspense
function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Available filter options
  const categories = [
    { name: 'Adventure', value: 'adventure' },
    { name: 'Cultural', value: 'cultural' },
    { name: 'Honeymoon', value: 'honeymoon' },
    { name: 'Family', value: 'family' },
    { name: 'Luxury', value: 'luxury' },
    { name: 'Budget', value: 'budget' }
  ];

  const durations = [
    { name: '1-3 hours', value: 'short' },
    { name: '4-8 hours', value: 'medium' },
    { name: '1-3 days', value: 'long' },
    { name: '4+ days', value: 'extended' }
  ];

  // Filter and search logic
  useEffect(() => {
    let filtered = allItems;

    // Filter by type
    if (searchType !== 'all') {
      filtered = filtered.filter(item => item.type === searchType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(item => {
      const price = item.discountPrice || item.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by duration
    if (selectedDurations.length > 0) {
      filtered = filtered.filter(item => {
        const duration = item.duration.toLowerCase();
        if (selectedDurations.includes('short') && (duration.includes('hour') && parseInt(duration) <= 3)) return true;
        if (selectedDurations.includes('medium') && (duration.includes('hour') && parseInt(duration) > 3 && parseInt(duration) <= 8)) return true;
        if (selectedDurations.includes('long') && (duration.includes('day') && parseInt(duration) >= 1 && parseInt(duration) <= 3)) return true;
        if (selectedDurations.includes('extended') && (duration.includes('day') && parseInt(duration) > 3)) return true;
        return false;
      });
    }

    setResults(filtered);
  }, [searchQuery, searchType, priceRange, selectedCategories, selectedDurations]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle duration selection
  const toggleDuration = (duration: string) => {
    if (selectedDurations.includes(duration)) {
      setSelectedDurations(selectedDurations.filter(d => d !== duration));
    } else {
      setSelectedDurations([...selectedDurations, duration]);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-white/70">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages, activities, or destinations"
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="package">Packages</option>
                <option value="activity">Activities</option>
              </select>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-6 bg-dark-800 border border-dark-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-grow">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        min="0"
                        max={priceRange[1]}
                        className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <span>to</span>
                    <div className="relative flex-grow">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        min={priceRange[0]}
                        className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => toggleCategory(category.value)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedCategories.includes(category.value) ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/70 hover:bg-dark-600'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Duration */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Duration</h3>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        type="button"
                        onClick={() => toggleDuration(duration.value)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedDurations.includes(duration.value) ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/70 hover:bg-dark-600'}`}
                      >
                        {duration.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedDurations([]);
                    setPriceRange([0, 2000]);
                  }}
                  className="text-white/70 hover:text-white"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-primary-500 hover:text-primary-400"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
        
        {/* Search Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <Link 
                href={`/${item.type === 'package' ? 'packages' : 'activities'}/${item.id}`} 
                key={`${item.type}-${item.id}`}
                className="bento-card overflow-hidden hover:border-primary-500/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-2 py-1 rounded capitalize">
                    {item.type}
                  </div>
                  {item.discountPrice && item.discountPrice < item.price && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Save ${item.price - item.discountPrice}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{item.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-y-2">
                    <div className="flex items-center text-xs text-white/60 w-1/2">
                      <MapPin size={14} className="mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center text-xs text-white/60 w-1/2">
                      <Clock size={14} className="mr-1" />
                      {item.duration}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      {item.discountPrice && item.discountPrice < item.price ? (
                        <div>
                          <span className="text-lg font-bold">${item.discountPrice}</span>
                          <span className="text-white/50 line-through ml-2">${item.price}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">${item.price}</span>
                      )}
                    </div>
                    <span className="text-primary-500 text-sm">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bento-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
            <p className="text-white/70 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchType('all');
                setSelectedCategories([]);
                setSelectedDurations([]);
                setPriceRange([0, 2000]);
              }}
              className="btn-primary"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that wraps SearchContent with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
        <div className="container-custom flex justify-center items-center" style={{ minHeight: '50vh' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
