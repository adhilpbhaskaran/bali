import { PrismaClient } from '@prisma/client';

// Database connection status
let dbConnected = false;
let dbError: string | null = null;

// Test database connection
export async function testDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { prisma } = await import('./prisma');
    await prisma.$connect();
    await prisma.$disconnect();
    dbConnected = true;
    dbError = null;
    return { connected: true };
  } catch (error) {
    dbConnected = false;
    dbError = error instanceof Error ? error.message : 'Unknown database error';
    console.warn('Database connection failed:', dbError);
    return { connected: false, error: dbError };
  }
}

// Get database status
export function getDatabaseStatus() {
  return { connected: dbConnected, error: dbError };
}

// Mock data for development when database is not available
export const mockData = {
  packages: [
    {
      id: 'romantic-bali-honeymoon',
      name: 'Romantic Bali Honeymoon',
      description: 'Experience the ultimate romantic getaway in Bali with your loved one. This carefully crafted honeymoon package includes luxury accommodations, private dining experiences, couples spa treatments, and romantic sunset excursions.',
      shortDescription: '7 days of pure romance in the island of gods',
      basePrice: 1299,
      discountPrice: 899,
      duration: 7,
      location: 'Ubud, Seminyak, Nusa Dua',
      category: 'Honeymoon',
      tourType: 'FIT',
      status: 'PUBLISHED',
      published: true,
      featured: true,
      trending: false,
      bestSeller: true,
      minParticipants: 2,
      maxParticipants: 2,
      isFlexibleDates: true,
      highlights: ['Private villa with infinity pool', 'Couples spa treatment', 'Romantic candlelit dinner', 'Private sunset cruise'],
      included: ['7 nights luxury accommodation', 'Daily breakfast', 'Airport transfers', 'Couples spa treatment'],
      notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'bali-adventure-package',
      name: 'Bali Adventure Package',
      description: 'Get your adrenaline pumping with this action-packed adventure tour of Bali. From white water rafting and volcano hiking to ATV rides and cliff jumping.',
      shortDescription: 'Thrilling adventures across Bali\'s most exciting spots',
      basePrice: 749,
      discountPrice: 649,
      duration: 5,
      location: 'Ubud, Kintamani, Amed',
      category: 'Adventure',
      tourType: 'GIT',
      status: 'PUBLISHED',
      published: true,
      featured: true,
      trending: false,
      bestSeller: true,
      minParticipants: 1,
      maxParticipants: 12,
      isFlexibleDates: false,
      highlights: ['Mount Batur sunrise trekking', 'White water rafting', 'ATV quad biking', 'Sekumpul waterfall exploration'],
      included: ['5 nights accommodation', 'Daily breakfast', 'All adventure activities', 'Professional guide'],
      notIncluded: ['International flights', 'Travel insurance', 'Lunch and dinner'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'luxury-bali-retreat',
      name: 'Luxury Bali Retreat',
      description: 'Indulge in the ultimate luxury experience in Bali with stays at world-class resorts, private butler service, and premium spa treatments.',
      shortDescription: 'Experience Bali\'s finest luxury resorts and spas',
      basePrice: 1999,
      discountPrice: 1299,
      duration: 6,
      location: 'Nusa Dua, Jimbaran, Uluwatu',
      category: 'Luxury',
      tourType: 'FIT',
      status: 'PUBLISHED',
      published: true,
      featured: true,
      trending: true,
      bestSeller: false,
      minParticipants: 1,
      maxParticipants: 4,
      isFlexibleDates: true,
      highlights: ['5-star beachfront resort', 'Private butler service', 'Michelin-starred dining', 'Premium spa treatments'],
      included: ['6 nights luxury resort stay', 'All meals at resort', 'Private airport transfers', 'Butler service'],
      notIncluded: ['International flights', 'Travel insurance', 'Personal shopping'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'family-fun-in-bali',
      name: 'Family Fun in Bali',
      description: 'A perfect family vacation package designed with activities and accommodations suitable for all ages. Enjoy family-friendly attractions and cultural experiences.',
      shortDescription: 'Create unforgettable memories with your loved ones',
      basePrice: 849,
      discountPrice: 749,
      duration: 6,
      location: 'Sanur, Ubud, Kuta',
      category: 'Family',
      tourType: 'GIT',
      status: 'PUBLISHED',
      published: true,
      featured: false,
      trending: false,
      bestSeller: true,
      minParticipants: 3,
      maxParticipants: 8,
      isFlexibleDates: false,
      highlights: ['Family-friendly resort with kids club', 'Bali Safari and Marine Park', 'Traditional dance show', 'Beach activities'],
      included: ['6 nights family accommodation', 'Daily breakfast', 'Family activities', 'Kids club access'],
      notIncluded: ['International flights', 'Travel insurance', 'Lunch and dinner'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'cultural-heritage-tour',
      name: 'Cultural Heritage Tour',
      description: 'Discover the authentic cultural heritage of Bali through visits to ancient temples, traditional villages, and artisan workshops.',
      shortDescription: 'Immerse yourself in Bali\'s rich cultural traditions',
      basePrice: 649,
      discountPrice: 549,
      duration: 5,
      location: 'Ubud, Klungkung, Karangasem',
      category: 'Cultural',
      tourType: 'GIT',
      status: 'PUBLISHED',
      published: true,
      featured: false,
      trending: false,
      bestSeller: false,
      minParticipants: 2,
      maxParticipants: 10,
      isFlexibleDates: false,
      highlights: ['Ancient temple complex visits', 'Traditional village homestay', 'Balinese art workshops', 'Traditional dance performances'],
      included: ['5 nights heritage accommodation', 'Daily breakfast', 'Cultural guide', 'Temple entrance fees'],
      notIncluded: ['International flights', 'Travel insurance', 'Lunch and dinner'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'wellness-spa-retreat',
      name: 'Wellness & Spa Retreat',
      description: 'Rejuvenate your mind, body, and soul in Bali\'s serene wellness retreats with daily yoga, meditation, and spa treatments.',
      shortDescription: 'Holistic wellness experience in Bali',
      basePrice: 1099,
      discountPrice: 899,
      duration: 7,
      location: 'Ubud, Seminyak',
      category: 'Wellness',
      tourType: 'FIT',
      status: 'PUBLISHED',
      published: true,
      featured: false,
      trending: true,
      bestSeller: false,
      minParticipants: 1,
      maxParticipants: 6,
      isFlexibleDates: true,
      highlights: ['Daily yoga sessions', 'Spa treatments', 'Meditation classes', 'Healthy organic meals'],
      included: ['7 nights wellness accommodation', 'Healthy meals', 'Wellness activities', 'Spa treatments'],
      notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
      language: 'EN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  activities: [
    {
      id: 'mock-activity-1',
      name: 'Temple Hopping Tour',
      description: 'Visit the most beautiful temples in Bali',
      shortDescription: 'Explore Bali temples',
      basePrice: 75,
      duration: 8,
      location: 'Ubud, Bali',
      category: 'Cultural',
      status: 'PUBLISHED',
      published: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  testimonials: [
    {
      id: 'mock-testimonial-1',
      name: 'John Doe',
      role: 'Tourist',
      location: 'USA',
      content: 'Amazing experience in Bali! The tour was well organized and the guides were fantastic.',
      rating: 5,
      status: 'PUBLISHED',
      published: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  media: [
    {
      id: 'mock-media-1',
      filename: 'bali-beach.jpg',
      originalName: 'Beautiful Bali Beach.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      url: '/images/beach.jpg',
      alt: 'Beautiful Bali Beach',
      title: 'Bali Beach',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  stats: {
    totalPackages: 6,
    totalActivities: 1,
    totalTestimonials: 1,
    totalMedia: 1,
    totalBookings: 0,
    totalRevenue: 0,
    publishedPackages: 6,
    draftPackages: 0,
    featuredPackages: 3
  }
};

// Wrapper function for database operations with fallback
export async function withDatabaseFallback<T>(
  operation: () => Promise<T>,
  fallbackData: () => T | Promise<T>,
  operationName: string = 'database operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.warn(`${operationName} failed, using fallback data:`, error);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Development mode: Using mock data for ${operationName}`);
      try {
        // Fallback data can now be a function that returns a promise
        return await (typeof fallbackData === 'function' ? fallbackData() : fallbackData);
      } catch (fallbackError) {
        console.warn(`Fallback data retrieval failed, using mock data:`, fallbackError);
        // If file system fallback fails, use mock data
        return mockData.packages as unknown as T;
      }
    }
    
    throw error;
  }
}