'use client';

import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS, MEDIA_QUERIES } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';

// Screen size type
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Device type
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Orientation type
export type Orientation = 'portrait' | 'landscape';

// Screen info interface
interface ScreenInfo {
  width: number;
  height: number;
  size: ScreenSize;
  device: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  pixelRatio: number;
}

// Responsive utilities class
class ResponsiveUtils {
  private listeners: Set<(screenInfo: ScreenInfo) => void> = new Set();
  private currentScreenInfo: ScreenInfo | null = null;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    
    if (this.isClient) {
      this.updateScreenInfo();
      this.setupEventListeners();
    }
  }

  /**
   * Get current screen information
   */
  getScreenInfo(): ScreenInfo {
    if (!this.currentScreenInfo) {
      this.updateScreenInfo();
    }
    return this.currentScreenInfo!;
  }

  /**
   * Get current screen size
   */
  getScreenSize(): ScreenSize {
    return this.getScreenInfo().size;
  }

  /**
   * Get current device type
   */
  getDeviceType(): DeviceType {
    return this.getScreenInfo().device;
  }

  /**
   * Check if current screen matches size
   */
  isSize(size: ScreenSize): boolean {
    return this.getScreenSize() === size;
  }

  /**
   * Check if current screen is at least the specified size
   */
  isAtLeast(size: ScreenSize): boolean {
    const current = this.getScreenInfo().width;
    return current >= BREAKPOINTS[size];
  }

  /**
   * Check if current screen is at most the specified size
   */
  isAtMost(size: ScreenSize): boolean {
    const current = this.getScreenInfo().width;
    return current <= BREAKPOINTS[size];
  }

  /**
   * Check if current screen is between two sizes
   */
  isBetween(minSize: ScreenSize, maxSize: ScreenSize): boolean {
    const current = this.getScreenInfo().width;
    return current >= BREAKPOINTS[minSize] && current <= BREAKPOINTS[maxSize];
  }

  /**
   * Check if device is mobile
   */
  isMobile(): boolean {
    return this.getScreenInfo().isMobile;
  }

  /**
   * Check if device is tablet
   */
  isTablet(): boolean {
    return this.getScreenInfo().isTablet;
  }

  /**
   * Check if device is desktop
   */
  isDesktop(): boolean {
    return this.getScreenInfo().isDesktop;
  }

  /**
   * Check if device supports touch
   */
  isTouch(): boolean {
    return this.getScreenInfo().isTouch;
  }

  /**
   * Check if device is in portrait orientation
   */
  isPortrait(): boolean {
    return this.getScreenInfo().orientation === 'portrait';
  }

  /**
   * Check if device is in landscape orientation
   */
  isLandscape(): boolean {
    return this.getScreenInfo().orientation === 'landscape';
  }

  /**
   * Get responsive value based on screen size
   */
  getResponsiveValue<T>(values: Partial<Record<ScreenSize, T>>, fallback: T): T {
    const size = this.getScreenSize();
    const sizeOrder: ScreenSize[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    
    // Find the largest size that has a value and is <= current size
    for (const checkSize of sizeOrder) {
      if (values[checkSize] !== undefined && this.isAtLeast(checkSize)) {
        return values[checkSize]!;
      }
    }
    
    return fallback;
  }

  /**
   * Subscribe to screen changes
   */
  subscribe(callback: (screenInfo: ScreenInfo) => void): () => void {
    this.listeners.add(callback);
    
    // Call immediately with current info
    if (this.currentScreenInfo) {
      callback(this.currentScreenInfo);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Check if media query matches
   */
  matchesMediaQuery(query: string): boolean {
    if (!this.isClient) return false;
    return window.matchMedia(query).matches;
  }

  /**
   * Get CSS media query for breakpoint
   */
  getMediaQuery(size: ScreenSize, type: 'min' | 'max' = 'min'): string {
    const width = BREAKPOINTS[size];
    return `(${type}-width: ${width}px)`;
  }

  /**
   * Get optimal image size based on screen
   */
  getOptimalImageSize(): { width: number; height: number } {
    const { width, pixelRatio } = this.getScreenInfo();
    const optimalWidth = Math.min(width * pixelRatio, 1920); // Cap at 1920px
    
    return {
      width: optimalWidth,
      height: Math.round(optimalWidth * 0.6) // 16:10 aspect ratio
    };
  }

  /**
   * Get recommended grid columns based on screen size
   */
  getGridColumns(): number {
    return this.getResponsiveValue({
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6
    }, 1);
  }

  /**
   * Get recommended container padding
   */
  getContainerPadding(): string {
    return this.getResponsiveValue({
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
      '2xl': '4rem'
    }, '1rem');
  }

  /**
   * Get recommended font size multiplier
   */
  getFontSizeMultiplier(): number {
    return this.getResponsiveValue({
      xs: 0.875,
      sm: 0.9,
      md: 1,
      lg: 1.1,
      xl: 1.125,
      '2xl': 1.25
    }, 1);
  }

  // Private methods
  private updateScreenInfo(): void {
    if (!this.isClient) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = this.getScreenSizeFromWidth(width);
    const device = this.getDeviceTypeFromWidth(width);
    const orientation = height > width ? 'portrait' : 'landscape';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pixelRatio = window.devicePixelRatio || 1;

    this.currentScreenInfo = {
      width,
      height,
      size,
      device,
      orientation,
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isDesktop: device === 'desktop',
      isTouch,
      pixelRatio
    };

    // Notify listeners
    this.listeners.forEach(callback => {
      try {
        callback(this.currentScreenInfo!);
      } catch (error) {
        logger.error('Error in responsive listener', error as Error);
      }
    });
  }

  private getScreenSizeFromWidth(width: number): ScreenSize {
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }

  private getDeviceTypeFromWidth(width: number): DeviceType {
    if (width < BREAKPOINTS.md) return 'mobile';
    if (width < BREAKPOINTS.lg) return 'tablet';
    return 'desktop';
  }

  private setupEventListeners(): void {
    if (!this.isClient) return;

    const handleResize = () => {
      this.updateScreenInfo();
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(() => {
        this.updateScreenInfo();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    });
  }
}

// Create singleton instance
export const responsive = new ResponsiveUtils();

// React hooks

/**
 * Hook to get current screen information
 */
export function useScreenInfo(): ScreenInfo {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => {
    return responsive.getScreenInfo();
  });

  useEffect(() => {
    const unsubscribe = responsive.subscribe(setScreenInfo);
    return unsubscribe;
  }, []);

  return screenInfo;
}

/**
 * Hook to get current screen size
 */
export function useScreenSize(): ScreenSize {
  const screenInfo = useScreenInfo();
  return screenInfo.size;
}

/**
 * Hook to get current device type
 */
export function useDeviceType(): DeviceType {
  const screenInfo = useScreenInfo();
  return screenInfo.device;
}

/**
 * Hook to check if screen matches size
 */
export function useIsSize(size: ScreenSize): boolean {
  const currentSize = useScreenSize();
  return currentSize === size;
}

/**
 * Hook to check if screen is at least the specified size
 */
export function useIsAtLeast(size: ScreenSize): boolean {
  const screenInfo = useScreenInfo();
  return screenInfo.width >= BREAKPOINTS[size];
}

/**
 * Hook to check if screen is at most the specified size
 */
export function useIsAtMost(size: ScreenSize): boolean {
  const screenInfo = useScreenInfo();
  return screenInfo.width <= BREAKPOINTS[size];
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'mobile';
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'tablet';
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'desktop';
}

/**
 * Hook to check if device supports touch
 */
export function useIsTouch(): boolean {
  const screenInfo = useScreenInfo();
  return screenInfo.isTouch;
}

/**
 * Hook to get responsive value
 */
export function useResponsiveValue<T>(
  values: Partial<Record<ScreenSize, T>>,
  fallback: T
): T {
  const screenInfo = useScreenInfo();
  
  return responsive.getResponsiveValue(values, fallback);
}

/**
 * Hook to check media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook for debounced screen size changes
 */
export function useDebouncedScreenSize(delay: number = 250): ScreenSize {
  const [debouncedSize, setDebouncedSize] = useState<ScreenSize>(() => {
    return responsive.getScreenSize();
  });
  
  const currentSize = useScreenSize();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSize(currentSize);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentSize, delay]);

  return debouncedSize;
}

// Utility functions

/**
 * Generate responsive CSS classes
 */
export function generateResponsiveClasses(
  baseClass: string,
  values: Partial<Record<ScreenSize, string>>
): string {
  const classes: string[] = [];
  
  Object.entries(values).forEach(([size, value]) => {
    if (value) {
      const prefix = size === 'xs' ? '' : `${size}:`;
      classes.push(`${prefix}${baseClass}-${value}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Get responsive image srcSet
 */
export function getResponsiveImageSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Get responsive image sizes attribute
 */
export function getResponsiveImageSizes(): string {
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 50vw',
    '(max-width: 1024px) 33vw',
    '25vw'
  ].join(', ');
}

/**
 * Create responsive style object
 */
export function createResponsiveStyles<T>(
  values: Partial<Record<ScreenSize, T>>
): Record<string, T> {
  const styles: Record<string, T> = {};
  
  Object.entries(values).forEach(([size, value]) => {
    if (value !== undefined) {
      const mediaQuery = MEDIA_QUERIES[size as ScreenSize];
      styles[`@media ${mediaQuery}`] = value;
    }
  });
  
  return styles;
}

/**
 * Check if device has high DPI
 */
export function isHighDPI(): boolean {
  if (typeof window === 'undefined') return false;
  return window.devicePixelRatio > 1;
}

/**
 * Get safe area insets for mobile devices
 */
export function getSafeAreaInsets(): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  if (typeof window === 'undefined' || !responsive.isMobile()) {
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  }

  const style = getComputedStyle(document.documentElement);
  
  return {
    top: style.getPropertyValue('env(safe-area-inset-top)') || '0px',
    right: style.getPropertyValue('env(safe-area-inset-right)') || '0px',
    bottom: style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
    left: style.getPropertyValue('env(safe-area-inset-left)') || '0px'
  };
}

export default responsive;