'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';

interface BaliImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt: string;
  fallbackText?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2';
  category?: string;
}

export default function BaliImage({
  src,
  alt,
  fallbackText,
  aspectRatio = '16:9',
  category,
  className = '',
  ...props
}: BaliImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Calculate aspect ratio padding
  const aspectRatioPadding = {
    '1:1': 'pb-[100%]',
    '16:9': 'pb-[56.25%]',
    '4:3': 'pb-[75%]',
    '3:2': 'pb-[66.66%]',
  }[aspectRatio];
  
  // Generate placeholder colors based on category
  const getPlaceholderColors = (category?: string) => {
    const categories: Record<string, { bg: string, text: string }> = {
      'adventure': { bg: 'bg-blue-700/20', text: 'text-blue-500' },
      'honeymoon': { bg: 'bg-pink-700/20', text: 'text-pink-500' },
      'family': { bg: 'bg-green-700/20', text: 'text-green-500' },
      'luxury': { bg: 'bg-purple-700/20', text: 'text-purple-500' },
      'culture': { bg: 'bg-amber-700/20', text: 'text-amber-500' },
      'beach': { bg: 'bg-cyan-700/20', text: 'text-cyan-500' },
      'default': { bg: 'bg-primary-600/20', text: 'text-primary-500' },
    };
    
    return categories[category?.toLowerCase() || 'default'] || categories.default;
  };
  
  const placeholderColors = getPlaceholderColors(category);
  
  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };
  
  return (
    <div className={`relative ${aspectRatioPadding} overflow-hidden ${className}`}>
      {/* Show placeholder if there's no src, or if there's an error */}
      {(!src || error) ? (
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${placeholderColors.bg}`}>
          <span className={`text-xl font-semibold ${placeholderColors.text}`}>
            {fallbackText || alt || 'Image'}
          </span>
          {category && (
            <span className={`text-sm mt-2 ${placeholderColors.text}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/20">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          )}
          
          {/* Actual image */}
          <Image
            src={src}
            alt={alt}
            fill
            loading={props.priority ? undefined : "lazy"}
            className="object-cover"
            onLoadingComplete={handleLoadComplete}
            onError={handleError}
            {...props}
          />
        </>
      )}
    </div>
  );
}
