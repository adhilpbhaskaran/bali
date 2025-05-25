'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, ChevronRight } from 'lucide-react';

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
    <div className="bento-card overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      {/* Package Image */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        
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
      
      {/* Package Content - Improved text handling to prevent overflow */}
      <div className="p-3 sm:p-4 overflow-hidden flex flex-col h-[calc(100%-160px)] sm:h-[calc(100%-192px)]">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-1 overflow-hidden text-ellipsis">{pkg.title}</h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-xs sm:text-sm font-medium">{pkg.rating}</span>
          </div>
          <span className="text-xs text-white/70">({pkg.reviews} reviews)</span>
        </div>
        
        <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-grow">{pkg.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="text-primary-500 truncate mr-2">
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
