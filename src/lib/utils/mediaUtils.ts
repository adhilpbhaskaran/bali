/**
 * Media utilities for handling images and other media assets
 * This module provides functions to ensure proper image display and fallbacks
 */

// Default images to use when package/activity images are missing
const DEFAULT_IMAGES = {
  packages: [
    '/images/packages/default-1.jpg',
    '/images/packages/default-2.jpg',
    '/images/packages/default-3.jpg',
    '/images/packages/default-4.jpg',
    '/images/packages/default-5.jpg',
  ],
  activities: [
    '/images/activities/default-1.jpg',
    '/images/activities/default-2.jpg',
    '/images/activities/default-3.jpg',
    '/images/activities/default-4.jpg',
    '/images/activities/default-5.jpg',
  ],
  // Fallback to reliable external images if local ones fail
  fallback: {
    packages: [
      'https://source.unsplash.com/random/800x600/?bali,travel',
      'https://source.unsplash.com/random/800x600/?vacation',
      'https://source.unsplash.com/random/800x600/?resort',
      'https://source.unsplash.com/random/800x600/?beach',
      'https://source.unsplash.com/random/800x600/?island',
    ],
    activities: [
      'https://source.unsplash.com/random/800x600/?activity',
      'https://source.unsplash.com/random/800x600/?adventure',
      'https://source.unsplash.com/random/800x600/?tour',
      'https://source.unsplash.com/random/800x600/?hiking',
      'https://source.unsplash.com/random/800x600/?surfing',
    ],
  },
  hero: '/images/hero-default.jpg',
  thumbnail: '/images/thumbnail-default.jpg'
};

// Minimum number of images required for proper display
const MIN_IMAGES = 5;

/**
 * Check if an image URL is valid (exists)
 * 
 * @param url Image URL to check
 * @returns Promise that resolves to boolean indicating if image exists
 */
export async function checkImageExists(url: string): Promise<boolean> {
  // Skip check for data URLs or relative paths
  if (url.startsWith('data:') || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/'))) {
    return true;
  }
  
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Ensure a package or activity has the minimum required number of images
 * If not enough images are provided, fill with defaults
 * 
 * @param images Array of image URLs or undefined
 * @param type 'packages' or 'activities'
 * @returns Array with at least MIN_IMAGES images
 */
export function ensureMinimumImages(
  images: string[] | undefined,
  type: 'packages' | 'activities'
): string[] {
  const defaultSet = DEFAULT_IMAGES[type];
  const fallbackSet = DEFAULT_IMAGES.fallback[type];
  
  // If no images, return all defaults
  if (!images || images.length === 0) {
    return [...defaultSet];
  }
  
  // Filter out empty strings or undefined values
  const validImages = images.filter(img => img && img.trim() !== '');
  
  // If fewer than minimum, add defaults to fill
  if (validImages.length < MIN_IMAGES) {
    const needed = MIN_IMAGES - validImages.length;
    // Try local defaults first, then fallback to external images if needed
    return [...validImages, ...defaultSet.slice(0, needed), ...fallbackSet.slice(0, needed)];
  }
  
  // Already has enough images
  return validImages;
}

/**
 * Get the primary/hero image from a gallery, or a default if none exists
 * 
 * @param images Array of image URLs or undefined
 * @param type 'packages' or 'activities'
 * @returns Primary image URL
 */
export function getPrimaryImage(
  images: string[] | undefined,
  type: 'packages' | 'activities'
): string {
  if (!images || images.length === 0) {
    return DEFAULT_IMAGES[type][0];
  }
  
  // Filter out empty strings or undefined values
  const validImages = images.filter(img => img && img.trim() !== '');
  return validImages.length > 0 ? validImages[0] : DEFAULT_IMAGES[type][0];
}

/**
 * Get a thumbnail image (could be different from primary)
 * 
 * @param images Array of image URLs or undefined
 * @returns Thumbnail image URL
 */
export function getThumbnailImage(images: string[] | undefined): string {
  if (!images || images.length === 0) {
    return DEFAULT_IMAGES.thumbnail;
  }
  
  // Filter out empty strings or undefined values
  const validImages = images.filter(img => img && img.trim() !== '');
  if (validImages.length === 0) return DEFAULT_IMAGES.thumbnail;
  
  // Use the second image if available, otherwise first
  return validImages.length > 1 ? validImages[1] : validImages[0];
}

/**
 * Generate complete image URLs for packages/activities with proper domain
 * 
 * @param images Array of potentially relative image paths
 * @param basePath Optional base path/domain for the images
 * @returns Array of complete image URLs
 */
export function getFullImageUrls(
  images: string[] | undefined,
  basePath: string = ''
): string[] {
  if (!images || images.length === 0) {
    return [];
  }
  
  return images.filter(img => img && img.trim() !== '').map(img => {
    // If image already has a protocol or is an absolute URL, return as is
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
      return img;
    }
    // Otherwise, prepend the base path
    return `${basePath}/${img}`;
  });
}

/**
 * Process an entire package or activity's media gallery to ensure it meets requirements
 * 
 * @param item Package or activity with mediaGallery property
 * @param type 'packages' or 'activities'
 * @returns Array of properly formatted image URLs with minimum length
 */
export function processMediaGallery(
  item: { mediaGallery?: string[] } | undefined,
  type: 'packages' | 'activities'
): string[] {
  if (!item) {
    return ensureMinimumImages([], type);
  }
  
  // First ensure URLs are complete
  const fullUrls = getFullImageUrls(item.mediaGallery);
  
  // Then ensure minimum count
  return ensureMinimumImages(fullUrls, type);
}

export default {
  ensureMinimumImages,
  getPrimaryImage,
  getThumbnailImage,
  getFullImageUrls,
  processMediaGallery,
  checkImageExists,
  DEFAULT_IMAGES,
  MIN_IMAGES
};
