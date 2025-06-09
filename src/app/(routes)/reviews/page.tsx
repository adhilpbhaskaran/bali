'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Quote, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import SafeContentRenderer from '@/components/SafeContentRenderer';

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "John & Sarah Smith",
    location: "Australia",
    avatar: "/images/testimonials/couple1.jpg",
    rating: 5,
    date: "2025-05-10",
    title: "Our dream honeymoon came true!",
    text: "We booked the Romantic Bali Honeymoon package and it exceeded all our expectations. From the private villa in Ubud to the sunset dinner on the beach, everything was perfectly arranged. Our guide, Made, was knowledgeable and friendly, making our first trip to Bali unforgettable. We'll definitely be back!",
    package: "Romantic Bali Honeymoon",
    packageId: 1,
    verified: true,
    images: [
      "/images/testimonials/honeymoon1.jpg",
      "/images/testimonials/honeymoon2.jpg"
    ]
  },
  {
    id: 2,
    name: "Michael Johnson",
    location: "United States",
    avatar: "/images/testimonials/person1.jpg",
    rating: 5,
    date: "2025-05-05",
    title: "Adventure of a lifetime!",
    text: "The Bali Adventure Package was exactly what I was looking for. Climbing Mount Batur for sunrise was challenging but so worth it! The white water rafting was exhilarating and the cycling tour through the villages gave me a glimpse into local life. The team at Bali Malayali made everything smooth and stress-free. Highly recommend!",
    package: "Bali Adventure Package",
    packageId: 2,
    verified: true,
    images: [
      "/images/testimonials/adventure1.jpg",
      "/images/testimonials/adventure2.jpg"
    ]
  },
  {
    id: 3,
    name: "The Patel Family",
    location: "India",
    avatar: "/images/testimonials/family1.jpg",
    rating: 4,
    date: "2025-04-28",
    title: "Perfect family vacation with kids",
    text: "We traveled with our two children (ages 7 and 10) and booked the Family Fun in Bali package. The itinerary was well-balanced with activities that kept both kids and adults entertained. The water park was a hit with the kids, and we parents loved the cultural experiences. The only minor issue was one hotel transfer that was delayed, but the team quickly resolved it. Overall, a wonderful family experience!",
    package: "Family Fun in Bali",
    packageId: 4,
    verified: true,
    images: [
      "/images/testimonials/family1.jpg"
    ]
  },
  {
    id: 4,
    name: "Emma Wilson",
    location: "United Kingdom",
    avatar: "/images/testimonials/person2.jpg",
    rating: 5,
    date: "2025-04-20",
    title: "Luxurious and relaxing getaway",
    text: "The Luxury Bali Retreat was worth every penny. The accommodations were stunning, especially the cliff-top villa in Uluwatu with infinity pool. The private chef prepared amazing meals, and the spa treatments were divine. I appreciated the attention to detail and personalized service throughout the trip. Thank you for helping me disconnect and recharge in style!",
    package: "Luxury Bali Retreat",
    packageId: 3,
    verified: true,
    images: [
      "/images/testimonials/luxury1.jpg",
      "/images/testimonials/luxury2.jpg",
      "/images/testimonials/luxury3.jpg"
    ]
  },
  {
    id: 5,
    name: "David Chen",
    location: "Singapore",
    avatar: "/images/testimonials/person3.jpg",
    rating: 4,
    date: "2025-04-15",
    title: "Great value for money",
    text: "I was looking for an affordable way to experience Bali without missing out on the highlights, and the Budget Bali Explorer delivered exactly that. The accommodations were simple but clean and comfortable. I was impressed by how much was included in the package - all the main temples, a cooking class, and even a traditional dance performance. Great option for solo travelers on a budget!",
    package: "Budget Bali Explorer",
    packageId: 5,
    verified: true,
    images: []
  },
  {
    id: 6,
    name: "Sophie & Thomas",
    location: "France",
    avatar: "/images/testimonials/couple2.jpg",
    rating: 5,
    date: "2025-04-10",
    title: "Magical cultural experience",
    text: "We booked several activities through Bali Malayali, including the Ubud Cultural Tour and the Uluwatu Temple & Kecak Dance. Both were exceptional experiences with knowledgeable guides who spoke excellent English and French. We learned so much about Balinese culture and traditions. The small group size made it feel personal and allowed us to ask many questions. Merci beaucoup!",
    package: "Ubud Cultural Tour",
    packageId: 2,
    verified: true,
    images: [
      "/images/testimonials/cultural1.jpg"
    ]
  },
  {
    id: 7,
    name: "James Wilson",
    location: "Canada",
    avatar: "/images/testimonials/person4.jpg",
    rating: 3,
    date: "2025-04-05",
    title: "Good experience with some room for improvement",
    text: "The Mount Batur Sunrise Trek was beautiful and our guide was excellent. However, the transportation was late picking us up, which caused some stress early in the morning. The breakfast at the summit was quite basic compared to what was advertised. That said, the views were spectacular and worth the early wake-up. With some small improvements to logistics, this could be a 5-star experience.",
    package: "Mount Batur Sunrise Trek",
    packageId: 1,
    verified: true,
    images: [
      "/images/testimonials/trekking1.jpg"
    ]
  },
  {
    id: 8,
    name: "Olivia & Daniel",
    location: "Germany",
    avatar: "/images/testimonials/couple3.jpg",
    rating: 5,
    date: "2025-03-28",
    title: "Exceeded our expectations in every way",
    text: "We spent our honeymoon in Bali with a custom package created by Bali Malayali. From the moment we arrived until our departure, everything was flawless. The team surprised us with special touches throughout our stay - flower petals in our villa, a complimentary couples massage, and a sunset photoshoot. The attention to detail and personalized service made our honeymoon truly special. We can't thank you enough!",
    package: "Custom Honeymoon Package",
    packageId: null,
    verified: true,
    images: [
      "/images/testimonials/custom1.jpg",
      "/images/testimonials/custom2.jpg"
    ]
  }
];

// Filter options
const ratingOptions = [5, 4, 3, 2, 1];
const packageOptions = [
  "All Packages",
  "Romantic Bali Honeymoon",
  "Bali Adventure Package",
  "Luxury Bali Retreat",
  "Family Fun in Bali",
  "Budget Bali Explorer",
  "Custom Packages",
  "Activities & Tours"
];

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("All Packages");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter testimonials based on selected filters
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (selectedRating !== null && testimonial.rating !== selectedRating) {
      return false;
    }
    
    if (selectedPackage !== "All Packages") {
      if (selectedPackage === "Activities & Tours") {
        return testimonial.package === "Ubud Cultural Tour" || 
               testimonial.package === "Mount Batur Sunrise Trek";
      } else if (selectedPackage === "Custom Packages") {
        return testimonial.package === "Custom Honeymoon Package";
      } else {
        return testimonial.package === selectedPackage;
      }
    }
    
    return true;
  });
  
  // Sort testimonials based on selected sort option
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });
  
  // Calculate average rating
  const averageRating = testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length;
  
  // Count ratings by star
  const ratingCounts = ratingOptions.reduce((acc, rating) => {
    acc[rating] = testimonials.filter(t => t.rating === rating).length;
    return acc;
  }, {} as Record<number, number>);
  
  // Calculate percentage for each rating
  const calculatePercentage = (rating: number) => {
    return (ratingCounts[rating] / testimonials.length) * 100;
  };

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Reviews Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Read authentic reviews from travelers who have experienced our Bali tours and packages. 
            See what our customers have to say about their journey with Bali Malayali.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bento-card mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Overall Rating</h2>
              <div className="flex items-center mb-2">
                <span className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.round(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-white/70 text-sm">Based on {testimonials.length} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Rating Breakdown</h2>
              <div className="space-y-2">
                {ratingOptions.map((rating) => (
                  <div key={rating} className="flex items-center">
                    <button 
                      className={`flex items-center w-16 ${selectedRating === rating ? 'text-primary-500' : 'text-white/70'}`}
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    >
                      {rating} <Star size={14} className="ml-1 fill-current" />
                    </button>
                    <div className="flex-grow mx-3 bg-dark-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full rounded-full"
                        style={{ width: `${calculatePercentage(rating)}%` }}
                      ></div>
                    </div>
                    <span className="text-white/70 text-sm w-16">
                      {ratingCounts[rating]} {ratingCounts[rating] === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bento-card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                className="flex items-center text-white/70 hover:text-white mr-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                <span>Filter Reviews</span>
                {showFilters ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
              {(selectedRating !== null || selectedPackage !== "All Packages") && (
                <button 
                  className="text-primary-500 text-sm"
                  onClick={() => {
                    setSelectedRating(null);
                    setSelectedPackage("All Packages");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-white/70 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Filter by Rating</h3>
                  <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating}
                        className={`flex items-center px-3 py-1 rounded-full ${
                          selectedRating === rating
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-800 text-white/70 hover:bg-dark-700'
                        }`}
                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      >
                        {rating} <Star size={14} className={`ml-1 ${selectedRating === rating ? 'fill-white' : 'fill-yellow-500'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Package Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Filter by Package</h3>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2 w-full focus:ring-primary-500 focus:border-primary-500"
                  >
                    {packageOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {sortedTestimonials.length > 0 ? (
          <div className="space-y-6">
            {sortedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bento-card">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Reviewer Info */}
                  <div className="md:w-1/4">
                    <div className="flex items-center mb-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image 
                          src={testimonial.avatar || '/images/avatars/default.jpg'} 
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-white/60 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/30'
                          } mr-1`}
                        />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                      {new Date(testimonial.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {testimonial.verified && (
                      <div className="inline-flex items-center px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                        </svg>
                        Verified Purchase
                      </div>
                    )}
                  </div>
                  
                  {/* Review Content */}
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">{testimonial.title}</h3>
                    <div className="relative">
                      <Quote size={24} className="absolute -left-2 -top-2 text-primary-500/20" />
                      <div className="text-white/80 mb-4 pl-6">
                        <SafeContentRenderer 
                          content={testimonial.text} 
                          className="text-white/80"
                        />
                      </div>
                    </div>
                    
                    {testimonial.package && (
                      <div className="mb-4">
                        <span className="text-white/60 text-sm">Package: </span>
                        {testimonial.packageId ? (
                          <Link 
                            href={`/packages/${testimonial.packageId}`} 
                            className="text-primary-500 hover:underline text-sm"
                          >
                            {testimonial.package}
                          </Link>
                        ) : (
                          <span className="text-white text-sm">{testimonial.package}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Review Images */}
                    {testimonial.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Photos from {testimonial.name.split(' ')[0]}</h4>
                        <div className="flex flex-wrap gap-2">
                          {testimonial.images.map((image, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image 
                                src={image} 
                                alt={`Review photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bento-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No reviews found</h2>
            <p className="text-white/70 mb-6">Try adjusting your filters to see more reviews</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setSelectedRating(null);
                setSelectedPackage("All Packages");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="bento-card mt-10 bg-gradient-to-r from-primary-900/50 to-purple-900/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Share Your Experience</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Have you traveled with us? We'd love to hear about your experience! Your feedback helps us improve our services and assists other travelers in planning their perfect Bali adventure.
            </p>
            <Link href="/contact?subject=Review" className="btn-primary">
              Write a Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
