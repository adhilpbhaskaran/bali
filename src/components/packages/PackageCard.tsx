'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Clock, ChevronRight } from 'lucide-react';
import BaliImage from '@/components/ui/BaliImage';

interface PackageProps {
  package: {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    duration: string;
  };
}

export default function PackageCard({ package: pkg }: PackageProps) {
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
    <div className="bento-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      {/* Package Image */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden flex-shrink-0">
        <BaliImage
          src={pkg.image}
          alt={pkg.title}
          fallbackText={pkg.title}
          category={pkg.category}
          className="transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent z-[1]" />
        
        {/* Category Badge - Moved to top-left with z-index to prevent overlap */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary-600/90 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full z-10">
          {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-dark-800/90 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full flex items-center z-10">
          <Clock size={isSmallScreen ? 10 : 12} className="mr-1" />
          {pkg.duration}
        </div>
      </div>
      
      {/* Package Content - Completely redesigned to prevent overflow */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title with strict height control */}
        <div className="mb-1 h-6 sm:h-7 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{pkg.title}</h3>
        </div>
        
        {/* Rating with fixed height */}
        <div className="flex items-center mb-2 h-5">
          <div className="flex items-center mr-2">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-xs sm:text-sm font-medium">{pkg.rating}</span>
          </div>
          <span className="text-xs text-white/70">({pkg.reviews} reviews)</span>
        </div>
        
        {/* Description with strict height control */}
        <div className="mb-2 sm:mb-3 h-8 sm:h-10 overflow-hidden">
          <p className="text-white/70 text-xs sm:text-sm line-clamp-2">{pkg.description}</p>
        </div>
        
        {/* Price and button with fixed positioning */}
        <div className="flex justify-between items-center mt-auto pt-1">
          <div className="text-primary-500 truncate mr-2 max-w-[60%]">
            <span className="text-base sm:text-lg font-bold">${pkg.price}</span>
            <span className="text-xs sm:text-sm text-white/70"> / person</span>
          </div>
          
          <Link href={`/packages/${pkg.id}`} className="btn-secondary flex-shrink-0 flex items-center text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-3">
            View <ChevronRight size={isSmallScreen ? 14 : 16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
