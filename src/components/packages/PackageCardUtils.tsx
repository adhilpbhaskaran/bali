/**
 * Utility functions for package card rendering
 * This ensures consistent package card rendering across the application
 */
import { PackageData } from '@/lib/utils/packageLoader';
import { getPrimaryImage, ensureMinimumImages } from '@/lib/utils/mediaUtils';

// Interface for the props expected by PackageCard component
export interface PackageCardProps {
  id: number;
  name: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  duration: number;
  minParticipants: number;
  maxParticipants: number;
  category: string;
  location: string;
  tourType: 'FIT' | 'GIT';
  status: string;
  image: string;
  mediaGallery: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    };
    accommodation: string;
  }[];
  rating: number;
  reviews: number;
  isFlexibleDates: boolean;
  startDate: string;
  endDate: string;
  slug?: string;
  reviewCount?: number;
}

/**
 * Maps package data to the props needed by the PackageCard component
 * This ensures consistent prop structure across all package card instances
 * 
 * @param packageData Package data from API or local source
 * @returns Props object for PackageCard component
 */
export function mapToPackageCardProps(packageData: PackageData | any): PackageCardProps {
  // Ensure we have valid image URLs with fallbacks
  const mediaGallery = ensureMinimumImages(packageData.mediaGallery || [packageData.image], 'packages');
  const primaryImage = getPrimaryImage(mediaGallery, 'packages');
  
  // Convert ID to number if it's a string
  const id = typeof packageData.id === 'string' ? 
    parseInt(packageData.id, 10) || 1 : 
    Number(packageData.id) || 1;
  
  return {
    id,
    name: packageData.name || packageData.title || 'Bali Package',
    title: packageData.title || packageData.name || 'Bali Package',
    shortDescription: packageData.shortDescription || (packageData.description ? packageData.description.substring(0, 100) + '...' : 'Experience the beauty of Bali'),
    description: packageData.description || 'A wonderful Bali experience awaits you',
    price: typeof packageData.price === 'number' ? packageData.price : 0,
    discountPrice: packageData.discountPrice,
    duration: typeof packageData.duration === 'number' ? packageData.duration : 1,
    minParticipants: typeof packageData.minParticipants === 'number' ? packageData.minParticipants : 1,
    maxParticipants: typeof packageData.maxParticipants === 'number' ? packageData.maxParticipants : 10,
    category: packageData.category || 'adventure',
    location: packageData.location || 'Bali',
    tourType: packageData.tourType || 'FIT',
    status: packageData.status || 'active',
    image: primaryImage,
    mediaGallery,
    highlights: Array.isArray(packageData.highlights) ? packageData.highlights : ['Beautiful scenery', 'Local culture', 'Amazing food'],
    included: Array.isArray(packageData.included) ? packageData.included : ['Hotel accommodation', 'Transportation', 'Guide'],
    notIncluded: Array.isArray(packageData.notIncluded) ? packageData.notIncluded : ['Airfare', 'Personal expenses', 'Tips'],
    itinerary: Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 ? packageData.itinerary.map((day: any) => ({
      day: typeof day.day === 'number' ? day.day : 1,
      title: day.title || 'Day Trip',
      description: day.description || 'Explore Bali',
      activities: Array.isArray(day.activities) ? day.activities : ['Sightseeing'],
      meals: { 
        breakfast: day.meals?.breakfast ?? true, 
        lunch: day.meals?.lunch ?? false, 
        dinner: day.meals?.dinner ?? false 
      },
      accommodation: day.accommodation || 'Hotel'
    })) : [
      {
        day: 1,
        title: 'Day 1: Arrival',
        description: 'Welcome to Bali',
        activities: ['Airport pickup', 'Hotel check-in'],
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: 'Hotel'
      }
    ],
    rating: typeof packageData.rating === 'number' ? packageData.rating : 4.5,
    reviews: typeof packageData.reviewCount === 'number' ? packageData.reviewCount : 0,
    isFlexibleDates: typeof packageData.isFlexibleDates === 'boolean' ? packageData.isFlexibleDates : false,
    startDate: typeof packageData.startDate === 'string' ? packageData.startDate : new Date().toISOString(),
    endDate: typeof packageData.endDate === 'string' ? packageData.endDate : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewCount: packageData.reviewCount || packageData.reviews || 0,
    slug: packageData.slug || ''
  };
}

/**
 * Filters packages by tourType and maps them to PackageCardProps
 * 
 * @param packages Array of package data
 * @param tourType 'FIT' or 'GIT'
 * @returns Array of props ready for PackageCard components
 */
export function filterAndMapPackages(
  packages: PackageData[] | any[],
  tourType: 'FIT' | 'GIT'
): PackageCardProps[] {
  if (!packages || !Array.isArray(packages)) {
    console.warn('Invalid packages data provided to filterAndMapPackages', packages);
    return [];
  }
  
  return packages
    .filter(pkg => pkg.tourType === tourType)
    .map(pkg => mapToPackageCardProps(pkg));
}

/**
 * Gets a section title based on tourType
 * 
 * @param tourType 'FIT' or 'GIT'
 * @returns Appropriate section title
 */
export function getSectionTitle(tourType: 'FIT' | 'GIT'): string {
  return tourType === 'FIT' 
    ? 'Best Sellers' 
    : 'Upcoming Group Trips';
}

/**
 * Gets a section description based on tourType
 * 
 * @param tourType 'FIT' or 'GIT'
 * @returns Appropriate section description
 */
export function getSectionDescription(tourType: 'FIT' | 'GIT'): string {
  return tourType === 'FIT'
    ? 'Our most popular Flexible Independent Travel packages'
    : 'Join our scheduled Group Inclusive Tour trips';
}

export default {
  mapToPackageCardProps,
  filterAndMapPackages,
  getSectionTitle,
  getSectionDescription
};
