'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    image: string;
    rating: number;
    text: string;
    package: string;
  };
}

export default function TestimonialCard({ testimonial }: TestimonialProps) {
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
    <div className="bento-card p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden mr-2 sm:mr-3">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-semibold">{testimonial.name}</h4>
          <p className="text-white/70 text-xs sm:text-sm">{testimonial.location}</p>
        </div>
      </div>
      
      {/* Rating Stars */}
      <div className="flex mb-2 sm:mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={isSmallScreen ? 14 : 16}
            className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
          />
        ))}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-white/80 mb-3 sm:mb-4 text-xs sm:text-sm italic">"{testimonial.text}"</p>
      
      {/* Package Info */}
      <div className="text-xs text-white/60">
        <span>Experience:</span> <span className="text-primary-400">{testimonial.package}</span>
      </div>
    </div>
  );
}
