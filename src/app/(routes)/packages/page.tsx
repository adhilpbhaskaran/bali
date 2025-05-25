'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import PackageCard from '@/components/packages/PackageCard';

// Sample data for packages
const allPackages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    description: "7 days of pure romance in the island of gods",
    price: 899,
    rating: 4.9,
    reviews: 128,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    duration: "7 days",
  },
  {
    id: 2,
    title: "Bali Adventure Package",
    description: "Thrilling adventures across Bali's most exciting spots",
    price: 749,
    rating: 4.8,
    reviews: 96,
    image: "/images/packages/adventure.jpg",
    category: "adventure",
    duration: "5 days",
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    description: "Experience Bali's finest luxury resorts and spas",
    price: 1299,
    rating: 5.0,
    reviews: 64,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    duration: "6 days",
  },
  {
    id: 4,
    title: "Family Fun in Bali",
    description: "Create unforgettable memories with your loved ones",
    price: 849,
    rating: 4.7,
    reviews: 112,
    image: "/images/packages/family.jpg",
    category: "family",
    duration: "6 days",
  },
  {
    id: 5,
    title: "Budget Bali Explorer",
    description: "Experience the best of Bali without breaking the bank",
    price: 599,
    rating: 4.6,
    reviews: 87,
    image: "/images/packages/budget.jpg",
    category: "budget",
    duration: "5 days",
  },
  {
    id: 6,
    title: "Bali Cultural Immersion",
    description: "Dive deep into Balinese traditions and cultural experiences",
    price: 799,
    rating: 4.8,
    reviews: 76,
    image: "/images/packages/cultural.jpg",
    category: "cultural",
    duration: "7 days",
  },
  {
    id: 7,
    title: "Bali Wellness & Yoga Retreat",
    description: "Rejuvenate your mind, body, and soul in serene Bali",
    price: 999,
    rating: 4.9,
    reviews: 92,
    image: "/images/packages/wellness.jpg",
    category: "wellness",
    duration: "8 days",
  },
  {
    id: 8,
    title: "Ultimate Bali Experience",
    description: "The complete Bali journey covering all must-see destinations",
    price: 1499,
    rating: 4.9,
    reviews: 104,
    image: "/images/packages/ultimate.jpg",
    category: "luxury",
    duration: "10 days",
  },
];

// Filter options
const categories = [
  { id: 'all', name: 'All Packages' },
  { id: 'honeymoon', name: 'Honeymoon' },
  { id: 'family', name: 'Family' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'budget', name: 'Budget' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'wellness', name: 'Wellness' },
];

const durations = [
  { id: 'all', name: 'Any Duration' },
  { id: '1-3', name: '1-3 Days' },
  { id: '4-7', name: '4-7 Days' },
  { id: '8-14', name: '8-14 Days' },
  { id: '15+', name: '15+ Days' },
];

const priceRanges = [
  { id: 'all', name: 'Any Price' },
  { id: '0-500', name: 'Under $500' },
  { id: '500-1000', name: '$500 - $1000' },
  { id: '1000-1500', name: '$1000 - $1500' },
  { id: '1500+', name: '$1500+' },
];

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter packages based on selected filters
  const filteredPackages = allPackages.filter((pkg) => {
    // Search term filter
    if (searchTerm && !pkg.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && pkg.category !== selectedCategory) {
      return false;
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      const duration = parseInt(pkg.duration.split(' ')[0]);
      
      if (selectedDuration === '1-3' && (duration < 1 || duration > 3)) return false;
      if (selectedDuration === '4-7' && (duration < 4 || duration > 7)) return false;
      if (selectedDuration === '8-14' && (duration < 8 || duration > 14)) return false;
      if (selectedDuration === '15+' && duration < 15) return false;
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const price = pkg.price;
      
      if (selectedPrice === '0-500' && (price < 0 || price > 500)) return false;
      if (selectedPrice === '500-1000' && (price < 500 || price > 1000)) return false;
      if (selectedPrice === '1000-1500' && (price < 1000 || price > 1500)) return false;
      if (selectedPrice === '1500+' && price < 1500) return false;
    }

    return true;
  });

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Bali Travel Packages</h1>
          <p className="text-white/70 max-w-3xl">
            Discover our carefully curated Bali travel packages designed to give you the perfect island experience. 
            From romantic honeymoons to thrilling adventures, we have something for everyone.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              className="md:hidden flex items-center justify-center bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Filter Options */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-2">
                Package Type
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-white/70 mb-2">
                Duration
              </label>
              <select
                id="duration"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {durations.map((duration) => (
                  <option key={duration.id} value={duration.id}>
                    {duration.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white/70 mb-2">
                Price Range
              </label>
              <select
                id="price"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {priceRanges.map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/70">
            Showing {filteredPackages.length} of {allPackages.length} packages
          </p>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-bento">
            <p className="text-xl mb-2">No packages found</p>
            <p className="text-white/70">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
