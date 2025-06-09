'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';

interface BaliImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt: string;
  fallbackText?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2';
  category?: string;
  sizes?: string;
}

// Generate a simple blur data URL based on category color
const generateBlurDataURL = (category?: string): string => {
  // Default color if no category
  let color = '6366f1'; // primary color
  
  // Map categories to colors
  const categoryColors: Record<string, string> = {
    'adventure': '3b82f6', // blue
    'honeymoon': 'ec4899', // pink
    'family': '22c55e',    // green
    'luxury': '8b5cf6',    // purple
    'culture': 'f59e0b',   // amber
    'beach': '06b6d4',     // cyan
    'default': '6366f1',   // primary
  };
  
  if (category) {
    color = categoryColors[category.toLowerCase()] || categoryColors.default;
  }
  
  // Create a tiny SVG with the category color
  const svg = `<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="%23${color}" opacity="0.2"/></svg>`;
  
  // Convert to base64
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export default function BaliImage({
  src,
  alt,
  fallbackText,
  aspectRatio = '16:9',
  category,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', // Responsive sizes
  ...props
}: BaliImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);
  
  // Generate blur data URL on mount or when category changes
  useEffect(() => {
    setBlurDataURL(generateBlurDataURL(category));
  }, [category]);
  
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
          {/* Loading spinner - only show if taking too long */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/20">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          )}
          
          {/* Actual image with optimization */}
          <Image
            src={src}
            alt={alt}
            fill
            loading={props.priority ? "eager" : "lazy"}
            className="object-cover object-center"
            onLoadingComplete={handleLoadComplete}
            onError={handleError}
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
            sizes={sizes}
            quality={props.quality || 75} // Default to 75% quality for better performance
            {...props}
          />
        </>
      )}
    </div>
  );
}
}
