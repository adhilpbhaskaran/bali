/**
 * Utility functions for activity card rendering
 * This ensures consistent activity card rendering across the application
 */
import { ActivityData } from '@/lib/utils/activityUtils';
import { getPrimaryImage, ensureMinimumImages } from '@/lib/utils/mediaUtils';

// Interface for the props expected by ActivityCard component
export interface ActivityCardProps {
  id: number | string; // Updated to accept both number and string
  title: string;
  slug: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  difficulty: string;
  status?: string;
  rating?: number;
  reviewCount?: number;
  shortDescription?: string;
  // Add missing properties needed by ActivityCard
  description: string;
  reviews: number;
}

/**
 * Maps activity data to the props needed by the ActivityCard component
 * This ensures consistent prop structure across all activity card instances
 * 
 * @param activityData Activity data from API or local source
 * @returns Props object for ActivityCard component
 */
export function mapToActivityCardProps(activityData: ActivityData | any): ActivityCardProps {
  // Ensure we have valid image URLs with fallbacks
  const mediaGallery = ensureMinimumImages(activityData.mediaGallery || [activityData.image], 'activities');
  const primaryImage = getPrimaryImage(mediaGallery, 'activities');
  
  // Convert ID to number if possible, otherwise use string
  const id = typeof activityData.id === 'number' ? activityData.id : 
             !isNaN(Number(activityData.id)) ? Number(activityData.id) : activityData.id;
  
  return {
    id,
    title: activityData.title || activityData.name || 'Bali Activity',
    slug: activityData.slug || '',
    image: primaryImage,
    price: typeof activityData.price === 'number' ? activityData.price : 0,
    duration: activityData.duration || '1 hour',
    location: activityData.location || 'Bali',
    category: activityData.category || 'Adventure',
    difficulty: activityData.difficulty || 'Easy',
    status: activityData.status || 'PUBLISHED',
    rating: typeof activityData.rating === 'number' ? activityData.rating : 4.5,
    reviewCount: activityData.reviewCount || activityData.reviews || 0,
    shortDescription: activityData.shortDescription || 
      (activityData.description ? activityData.description.substring(0, 100) + '...' : 'Experience this amazing Bali activity'),
    // Add missing properties needed by ActivityCard
    description: activityData.description || '',
    reviews: activityData.reviewCount || activityData.reviews || 0
  };
}

/**
 * Filters activities by category and maps them to ActivityCardProps
 * 
 * @param activities Array of activity data
 * @param category Category to filter by (optional)
 * @returns Array of props ready for ActivityCard components
 */
export function filterAndMapActivities(
  activities: ActivityData[] | any[],
  category?: string
): ActivityCardProps[] {
  if (!activities || !Array.isArray(activities)) {
    console.warn('Invalid activities data provided to filterAndMapActivities', activities);
    return [];
  }
  
  const filteredActivities = category 
    ? activities.filter(act => act.category === category)
    : activities;
    
  return filteredActivities.map(act => mapToActivityCardProps(act));
}

/**
 * Gets a section title based on activity category
 * 
 * @param category Activity category
 * @returns Appropriate section title
 */
export function getSectionTitle(category?: string): string {
  if (!category) return 'Featured Activities';
  
  const categoryTitles: Record<string, string> = {
    'adventure': 'Adventure Activities',
    'cultural': 'Cultural Experiences',
    'wellness': 'Wellness Activities',
    'water': 'Water Activities',
    'nature': 'Nature Experiences',
    'food': 'Food & Culinary',
  };
  
  return categoryTitles[category.toLowerCase()] || `${category} Activities`;
}

/**
 * Gets a section description based on activity category
 * 
 * @param category Activity category
 * @returns Appropriate section description
 */
export function getSectionDescription(category?: string): string {
  if (!category) return 'Explore our most popular activities';
  
  const categoryDescriptions: Record<string, string> = {
    'adventure': 'Get your adrenaline pumping with these exciting adventures',
    'cultural': 'Immerse yourself in Bali\'s rich cultural heritage',
    'wellness': 'Relax and rejuvenate with our wellness experiences',
    'water': 'Dive into Bali\'s stunning underwater world and thrilling water sports',
    'nature': 'Explore Bali\'s breathtaking natural landscapes and wildlife',
    'food': 'Taste the authentic flavors of Bali\'s cuisine',
  };
  
  return categoryDescriptions[category.toLowerCase()] || `Discover our amazing ${category} activities`;
}

export default {
  mapToActivityCardProps,
  filterAndMapActivities,
  getSectionTitle,
  getSectionDescription
};
