'use client';

import { useState, useEffect } from 'react';
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

export default function SearchPage() {
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

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDurations([]);
    setPriceRange([0, 2000]);
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

        {/* Search Bar */}
        <div className="bento-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search packages, activities, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="package">Packages</option>
                <option value="activity">Activities</option>
              </select>
              <button 
                className="btn-secondary flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  className="text-primary-500 text-sm flex items-center"
                  onClick={clearFilters}
                >
                  <X size={14} className="mr-1" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center bg-dark-800 border border-dark-700 rounded-lg px-3 py-2">
                      <DollarSign size={14} className="text-white/70 mr-1" />
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="bg-transparent w-full focus:outline-none"
                      />
                    </div>
                    <span className="text-white/70">to</span>
                    <div className="flex items-center bg-dark-800 border border-dark-700 rounded-lg px-3 py-2">
                      <DollarSign size={14} className="text-white/70 mr-1" />
                      <input
                        type="number"
                        min={priceRange[0]}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="bg-transparent w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedCategories.includes(category.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-800 text-white/70 hover:bg-dark-700'
                        }`}
                        onClick={() => toggleCategory(category.value)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Duration</h3>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedDurations.includes(duration.value)
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-800 text-white/70 hover:bg-dark-700'
                        }`}
                        onClick={() => toggleDuration(duration.value)}
                      >
                        {duration.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <Link 
                key={`${item.type}-${item.id}`}
                href={`/${item.type}s/${item.id}`}
                className="bento-card p-0 overflow-hidden hover:shadow-bento-hover transition-shadow"
              >
                <div className="relative h-48">
                  <Image 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    {item.type === 'package' ? 'Package' : 'Activity'}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-dark-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {item.duration}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold">${item.discountPrice || item.price}</span>
                      {item.discountPrice && item.discountPrice < item.price && (
                        <span className="text-white/60 line-through ml-2 text-sm">${item.price}</span>
                      )}
                      <span className="text-white/60 text-sm"> / person</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500" />
                      <span className="ml-1 text-sm">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bento-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-white/70 mb-6">Try adjusting your search criteria or filters</p>
            <button 
              className="btn-primary"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
