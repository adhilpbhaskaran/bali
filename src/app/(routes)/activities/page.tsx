'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown, ShoppingBag } from 'lucide-react';
import ActivityCard from '@/components/activities/ActivityCard';
import Link from 'next/link';

// Sample data for activities
const allActivities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    description: "Witness a breathtaking sunrise from Bali's active volcano",
    price: 65,
    rating: 4.8,
    reviews: 320,
    image: "/images/activities/mount-batur.jpg",
    duration: "6 hours",
    category: "adventure",
  },
  {
    id: 2,
    title: "Ubud Cultural Tour",
    description: "Explore the cultural heart of Bali with local guides",
    price: 45,
    rating: 4.9,
    reviews: 215,
    image: "/images/activities/ubud-tour.jpg",
    duration: "8 hours",
    category: "cultural",
  },
  {
    id: 3,
    title: "Bali Swing Experience",
    description: "Soar high above the jungle canopy on giant swings",
    price: 35,
    rating: 4.7,
    reviews: 189,
    image: "/images/activities/bali-swing.jpg",
    duration: "3 hours",
    category: "adventure",
  },
  {
    id: 4,
    title: "Traditional Balinese Spa",
    description: "Indulge in authentic Balinese massage and treatments",
    price: 55,
    rating: 4.9,
    reviews: 276,
    image: "/images/activities/spa.jpg",
    duration: "2 hours",
    category: "wellness",
  },
  {
    id: 5,
    title: "Uluwatu Temple & Kecak Dance",
    description: "Visit the iconic sea temple and watch traditional fire dance",
    price: 40,
    rating: 4.8,
    reviews: 198,
    image: "/images/activities/uluwatu.jpg",
    duration: "4 hours",
    category: "cultural",
  },
  {
    id: 6,
    title: "Nusa Penida Island Tour",
    description: "Explore the stunning beaches and cliffs of Nusa Penida",
    price: 85,
    rating: 4.9,
    reviews: 245,
    image: "/images/activities/nusa-penida.jpg",
    duration: "10 hours",
    category: "adventure",
  },
  {
    id: 7,
    title: "Bali Cooking Class",
    description: "Learn to cook authentic Balinese dishes with local chefs",
    price: 50,
    rating: 4.8,
    reviews: 167,
    image: "/images/activities/cooking-class.jpg",
    duration: "4 hours",
    category: "cultural",
  },
  {
    id: 8,
    title: "Waterbom Bali Water Park",
    description: "Enjoy thrilling water slides and pools at Asia's best water park",
    price: 45,
    rating: 4.7,
    reviews: 312,
    image: "/images/activities/waterbom.jpg",
    duration: "Full day",
    category: "family",
  },
  {
    id: 9,
    title: "Bali ATV Ride Adventure",
    description: "Off-road adventure through rice fields, jungle, and villages",
    price: 60,
    rating: 4.6,
    reviews: 178,
    image: "/images/activities/atv.jpg",
    duration: "2 hours",
    category: "adventure",
  },
  {
    id: 10,
    title: "Dolphin Watching Tour",
    description: "Early morning boat trip to see dolphins in their natural habitat",
    price: 55,
    rating: 4.5,
    reviews: 145,
    image: "/images/activities/dolphins.jpg",
    duration: "3 hours",
    category: "nature",
  },
  {
    id: 11,
    title: "Bali Instagram Tour",
    description: "Visit the most photogenic spots in Bali for perfect Instagram shots",
    price: 65,
    rating: 4.7,
    reviews: 203,
    image: "/images/activities/instagram-tour.jpg",
    duration: "8 hours",
    category: "photography",
  },
  {
    id: 12,
    title: "Tanah Lot Sunset Tour",
    description: "Experience magical sunset at Bali's iconic sea temple",
    price: 40,
    rating: 4.8,
    reviews: 256,
    image: "/images/activities/tanah-lot.jpg",
    duration: "4 hours",
    category: "cultural",
  },
];

// Filter options
const categories = [
  { id: 'all', name: 'All Activities' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'wellness', name: 'Wellness & Spa' },
  { id: 'family', name: 'Family Friendly' },
  { id: 'nature', name: 'Nature & Wildlife' },
  { id: 'photography', name: 'Photography' },
  { id: 'water', name: 'Water Activities' },
];

const durations = [
  { id: 'all', name: 'Any Duration' },
  { id: 'half-day', name: 'Half Day (< 4 hours)' },
  { id: 'full-day', name: 'Full Day (4-8 hours)' },
  { id: 'multi-day', name: 'Multi-Day' },
];

const priceRanges = [
  { id: 'all', name: 'Any Price' },
  { id: '0-50', name: 'Under $50' },
  { id: '50-100', name: '$50 - $100' },
  { id: '100+', name: '$100+' },
];

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Filter activities based on selected filters
  const filteredActivities = allActivities.filter((activity) => {
    // Search term filter
    if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && activity.category !== selectedCategory) {
      return false;
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      const duration = parseInt(activity.duration.split(' ')[0]) || 0;
      
      if (selectedDuration === 'half-day' && duration >= 4) return false;
      if (selectedDuration === 'full-day' && (duration < 4 || duration > 8)) return false;
      if (selectedDuration === 'multi-day' && duration <= 8) return false;
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const price = activity.price;
      
      if (selectedPrice === '0-50' && (price < 0 || price > 50)) return false;
      if (selectedPrice === '50-100' && (price < 50 || price > 100)) return false;
      if (selectedPrice === '100+' && price < 100) return false;
    }

    return true;
  });

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Activities & Experiences</h1>
              <p className="text-white/70 max-w-3xl">
                Discover unforgettable activities and experiences in Bali. From thrilling adventures to cultural 
                immersions, find the perfect additions to your Bali journey.
              </p>
            </div>
            
            {/* Cart Button */}
            <div className="hidden md:block">
              <Link href="/cart" className="relative btn-secondary">
                <ShoppingBag size={18} className="mr-2" />
                My Trip
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Mobile Cart Button */}
            <div className="md:hidden">
              <Link href="/cart" className="relative btn-secondary w-full flex items-center justify-center">
                <ShoppingBag size={18} className="mr-2" />
                My Trip
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
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
                Activity Type
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
            Showing {filteredActivities.length} of {allActivities.length} activities
          </p>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-bento">
            <p className="text-xl mb-2">No activities found</p>
            <p className="text-white/70">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
