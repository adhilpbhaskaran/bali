'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, User, Tag, ChevronRight } from 'lucide-react';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Must-Visit Places in Bali for First-Time Visitors",
    excerpt: "Exploring Bali for the first time? Discover the essential places that should be on every traveler's itinerary, from sacred temples to pristine beaches.",
    image: "/images/blog/top-10-places.jpg",
    category: "Travel Guide",
    author: "Sarah Johnson",
    date: "2025-05-15",
    readTime: "8 min read",
    tags: ["bali", "travel guide", "beaches", "temples"]
  },
  {
    id: 2,
    title: "The Ultimate Bali Food Guide: Local Delicacies You Must Try",
    excerpt: "Dive into Bali's rich culinary scene with our comprehensive guide to local foods, from savory Babi Guling to sweet Dadar Gulung.",
    image: "/images/blog/food-guide.jpg",
    category: "Food & Dining",
    author: "Michael Wong",
    date: "2025-05-10",
    readTime: "6 min read",
    tags: ["bali", "food", "cuisine", "restaurants"]
  },
  {
    id: 3,
    title: "Planning the Perfect Honeymoon in Bali: A Complete Guide",
    excerpt: "Everything you need to know to plan a romantic and unforgettable honeymoon in the Island of Gods, from luxury villas to intimate experiences.",
    image: "/images/blog/honeymoon-guide.jpg",
    category: "Honeymoon",
    author: "Emily Parker",
    date: "2025-05-05",
    readTime: "10 min read",
    tags: ["bali", "honeymoon", "romance", "luxury"]
  },
  {
    id: 4,
    title: "Bali with Kids: Family-Friendly Activities and Accommodations",
    excerpt: "Traveling to Bali with children? Discover the best family-friendly activities, beaches, and places to stay for an unforgettable family vacation.",
    image: "/images/blog/family-guide.jpg",
    category: "Family Travel",
    author: "David Thompson",
    date: "2025-04-28",
    readTime: "7 min read",
    tags: ["bali", "family", "kids", "activities"]
  },
  {
    id: 5,
    title: "Bali's Hidden Gems: Off-the-Beaten-Path Destinations",
    excerpt: "Escape the crowds and discover Bali's lesser-known treasures, from secret waterfalls to quiet villages that offer authentic cultural experiences.",
    image: "/images/blog/hidden-gems.jpg",
    category: "Adventure",
    author: "Lisa Chen",
    date: "2025-04-20",
    readTime: "9 min read",
    tags: ["bali", "hidden gems", "adventure", "local culture"]
  },
  {
    id: 6,
    title: "Bali on a Budget: How to Enjoy Paradise Without Breaking the Bank",
    excerpt: "Traveling to Bali doesn't have to be expensive. Learn insider tips on how to experience the best of Bali while keeping your costs low.",
    image: "/images/blog/budget-travel.jpg",
    category: "Budget Travel",
    author: "James Wilson",
    date: "2025-04-15",
    readTime: "8 min read",
    tags: ["bali", "budget", "tips", "affordable"]
  }
];

// Categories for filtering
const categories = [
  "All Categories",
  "Travel Guide",
  "Food & Dining",
  "Honeymoon",
  "Family Travel",
  "Adventure",
  "Budget Travel",
  "Culture",
  "Wellness"
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Filter blog posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bali Travel Blog</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Discover travel tips, local insights, and inspiration for your Bali adventure. 
            Our experts share their knowledge to help you plan the perfect trip.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bento-card mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-3 focus:ring-primary-500 focus:border-primary-500 md:w-48"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <Link href={`/blog/${filteredPosts[0].id}`} className="block">
              <div className="bento-card p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <Image 
                      src={filteredPosts[0].image || '/images/placeholder.jpg'} 
                      alt={filteredPosts[0].title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      {filteredPosts[0].category}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center text-sm text-white/60 mb-3">
                      <div className="flex items-center mr-4">
                        <Calendar size={14} className="mr-1" />
                        {new Date(filteredPosts[0].date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {filteredPosts[0].author}
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{filteredPosts[0].title}</h2>
                    <p className="text-white/70 mb-4">{filteredPosts[0].excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{filteredPosts[0].readTime}</span>
                      <span className="text-primary-500 flex items-center text-sm font-medium">
                        Read More <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(1).map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="block">
                <div className="bento-card p-0 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={post.image || '/images/placeholder.jpg'} 
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-xs text-white/60 mb-3">
                      <div className="flex items-center mr-3">
                        <Calendar size={12} className="mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        {post.author}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-white/60 text-xs">{post.readTime}</span>
                      <span className="text-primary-500 flex items-center text-sm font-medium">
                        Read More <ChevronRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bento-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No articles found</h2>
            <p className="text-white/70 mb-6">Try adjusting your search criteria</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : null}

        {/* Tags Section */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map((tag) => (
              <button
                key={tag}
                className="flex items-center px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm transition-colors"
                onClick={() => setSearchQuery(tag)}
              >
                <Tag size={14} className="mr-2 text-primary-500" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bento-card mt-16 bg-gradient-to-r from-primary-900/50 to-purple-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-white/70 mb-0">
                Get the latest travel tips, exclusive offers, and Bali insights delivered straight to your inbox.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-dark-800/50 border border-dark-700 text-white rounded-lg px-4 py-3 w-full focus:ring-primary-500 focus:border-primary-500"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-white/50 text-xs mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
