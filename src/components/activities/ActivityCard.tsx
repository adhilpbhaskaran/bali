'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, Plus, ShoppingCart } from 'lucide-react';
import BaliImage from '@/components/ui/BaliImage';

interface ActivityProps {
  activity: {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    duration: string;
    category: string;
  };
}

export default function ActivityCard({ activity }: ActivityProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
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
  
  return (
    <div 
      className="bento-card overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Activity Image */}
      <div className="relative w-full overflow-hidden">
        <BaliImage
          src={activity.image}
          alt={activity.title}
          fallbackText={activity.title}
          category={activity.category}
          aspectRatio="4:3"
          className="transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-[1]" />
        
        {/* Category Badge - Added z-index to prevent overlap */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary-600/90 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full z-10">
          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-dark-800/90 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full flex items-center z-10">
          <Clock size={isSmallScreen ? 10 : 12} className="mr-1" />
          {activity.duration}
        </div>
        
        {/* Quick Action Buttons - Visible on Hover */}
        <div 
          className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex space-x-1.5 sm:space-x-2 transition-all duration-300 ${
            isHovered || isSmallScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 sm:p-2 rounded-full"
            title="Add to Cart"
          >
            <ShoppingCart size={isSmallScreen ? 14 : 16} />
          </button>
          <button 
            className="bg-dark-700 hover:bg-dark-600 text-white p-1.5 sm:p-2 rounded-full"
            title="Add to Trip"
          >
            <Plus size={isSmallScreen ? 14 : 16} />
          </button>
        </div>
      </div>
      
      {/* Activity Content - Added overflow-hidden to prevent content from expanding outside the card during hover */}
      <div className="p-3 sm:p-4 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">{activity.title}</h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-500 mr-1">
            <Star size={isSmallScreen ? 12 : 14} fill="currentColor" />
          </div>
          <span className="text-xs sm:text-sm font-medium">{activity.rating}</span>
          <span className="text-xs text-white/60 ml-1">({activity.reviews} reviews)</span>
        </div>
        
        <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{activity.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-white/60">From</span>
            <p className="text-lg sm:text-xl font-bold text-white">${activity.price}</p>
          </div>
          
          <Link 
            href={`/activities/${activity.id}`}
            className="btn-primary py-1 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
