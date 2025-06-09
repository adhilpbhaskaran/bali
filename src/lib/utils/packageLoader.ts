// Client-side package loader - no fs module needed

export interface PackageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  basePrice?: number; // Added for TypeScript compatibility
  discountPrice?: number; // Added for TypeScript compatibility
  duration: number;
  location: string;
  category: string;
  tourType: 'FIT' | 'GIT';
  status: string;
  published: boolean;
  mediaGallery: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals?: { // Added for TypeScript compatibility
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    };
    accommodation?: string; // Added for TypeScript compatibility
  }[];
  createdAt: string;
  updatedAt: string;
  language: string;
  // Additional fields for compatibility
  rating?: number;
  reviewCount?: number;
  image?: string;
  reviews?: any[];
  availableDates?: Array<{ date: string; price: number; availability: 'available' | 'limited' | 'booked'; spotsLeft?: number }>;
  minParticipants?: number;
  maxParticipants?: number;
  isFlexibleDates?: boolean;
  startDate?: string;
  endDate?: string;
  taxRate?: number;
}

class PackageLoader {
  private static instance: PackageLoader;
  private packages: Map<string, PackageData> = new Map();
  private loaded = false;

  private constructor() {}

  static getInstance(): PackageLoader {
    if (!PackageLoader.instance) {
      PackageLoader.instance = new PackageLoader();
    }
    return PackageLoader.instance;
  }

  private loadPackages(): void {
    if (this.loaded) return;

    try {
      // Use mock data for client-side compatibility
      this.loadMockPackages();
      this.loaded = true;
    } catch (error) {
      console.error('Error loading packages:', error);
      this.loadMockPackages();
      this.loaded = true;
    }
  }

  private loadMockPackages(): void {
    // Mock package data for client-side rendering
    const mockPackages: PackageData[] = [
      // FIT Packages
      {
        id: 'romantic-bali-honeymoon',
        name: 'Romantic Bali Honeymoon',
        slug: 'romantic-bali-honeymoon',
        description: 'Experience the ultimate romantic getaway in Bali with your loved one.',
        shortDescription: 'Perfect honeymoon package for couples',
        price: 1299,
        duration: 7,
        location: 'Bali, Indonesia',
        category: 'Honeymoon',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/honeymoon-1.jpg'],
        highlights: ['Private villa accommodation', 'Romantic dinner setup', 'Couple spa treatment'],
        included: ['Accommodation', 'Breakfast', 'Airport transfer'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Bali',
            description: 'Welcome to paradise',
            activities: ['Airport pickup', 'Check-in to villa']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'luxury-bali-retreat',
        name: 'Luxury Bali Retreat',
        slug: 'luxury-bali-retreat',
        description: 'Indulge in the ultimate luxury experience in Bali with stays at world-class resorts.',
        shortDescription: 'Experience Bali\'s finest luxury resorts and spas',
        price: 1999,
        duration: 6,
        location: 'Nusa Dua, Jimbaran, Uluwatu',
        category: 'Luxury',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/luxury.jpg', '/images/villa.jpg'],
        highlights: ['5-star beachfront resort', 'Private butler service', 'Premium spa treatments'],
        included: ['Luxury accommodation', 'All meals', 'Airport transfers'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'VIP Arrival',
            description: 'Luxury welcome to Bali',
            activities: ['VIP airport pickup', 'Resort check-in', 'Welcome dinner']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'family-fun-in-bali',
        name: 'Family Fun in Bali',
        slug: 'family-fun-in-bali',
        description: 'Create unforgettable memories with your family in Bali.',
        shortDescription: 'Perfect family vacation with activities for all ages',
        price: 899,
        duration: 5,
        location: 'Kuta, Ubud, Sanur',
        category: 'Family',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/family-1.jpg'],
        highlights: ['Kid-friendly activities', 'Family accommodation', 'Cultural experiences'],
        included: ['Accommodation', 'Breakfast', 'Family activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Family Arrival',
            description: 'Begin your family adventure',
            activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'cultural-heritage-tour',
        name: 'Cultural Heritage Tour',
        slug: 'cultural-heritage-tour',
        description: 'Immerse yourself in Bali\'s rich cultural heritage and traditions.',
        shortDescription: 'Discover the authentic culture of Bali',
        price: 749,
        duration: 6,
        location: 'Ubud, Tegallalang, Besakih',
        category: 'Cultural',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/riceterrace.jpg', '/images/kecek2.jpg'],
        highlights: ['Traditional dance performances', 'Temple visits', 'Art village tours'],
        included: ['Accommodation', 'Breakfast', 'Cultural activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Cultural Immersion Begins',
            description: 'Start your cultural journey',
            activities: ['Airport pickup', 'Hotel check-in', 'Evening dance performance']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'wellness-spa-retreat',
        name: 'Wellness & Spa Retreat',
        slug: 'wellness-spa-retreat',
        description: 'Rejuvenate your mind, body, and soul in Bali\'s serene wellness retreats.',
        shortDescription: 'Holistic wellness experience in Bali',
        price: 1099,
        duration: 7,
        location: 'Ubud, Seminyak',
        category: 'Wellness',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/wellness.jpg'],
        highlights: ['Daily yoga sessions', 'Spa treatments', 'Meditation classes'],
        included: ['Wellness accommodation', 'Healthy meals', 'Wellness activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Begin Your Wellness Journey',
            description: 'Start your path to rejuvenation',
            activities: ['Airport pickup', 'Retreat check-in', 'Welcome meditation']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'budget-backpacker-special',
        name: 'Budget Backpacker Special',
        slug: 'budget-backpacker-special',
        description: 'Experience the best of Bali on a budget without compromising on experiences.',
        shortDescription: 'Affordable Bali adventure for backpackers',
        price: 399,
        duration: 5,
        location: 'Kuta, Canggu, Ubud',
        category: 'Budget',
        tourType: 'FIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/budget.jpg'],
        highlights: ['Hostel accommodations', 'Group activities', 'Local transportation'],
        included: ['Hostel stays', 'Some activities', 'Guide assistance'],
        notIncluded: ['International flights', 'Most meals', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Backpacker Arrival',
            description: 'Start your budget adventure',
            activities: ['Airport arrival', 'Hostel check-in', 'Orientation walk']
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      // GIT Packages
      {
        id: 'romantic-bali-honeymoon-group',
        name: 'Romantic Bali Honeymoon - Group Tour',
        slug: 'romantic-bali-honeymoon-group',
        description: 'Join other couples for a romantic group tour of Bali.',
        shortDescription: '7 days of romance with other couples - Fixed departure dates',
        price: 799,
        duration: 7,
        location: 'Ubud, Seminyak, Nusa Dua',
        category: 'Honeymoon',
        tourType: 'GIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/packages/honeymoon-1.jpg'],
        highlights: ['Fixed Valentine\'s departure', 'Meet other couples', 'Group romantic activities'],
        included: ['Accommodation', 'Breakfast', 'Group activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Group Arrival & Welcome',
            description: 'Meet your fellow travelers',
            activities: ['Airport pickup', 'Group check-in', 'Welcome dinner']
          }
        ],
        availableDates: [
          {
            date: '2024-06-15',
            price: 799,
            availability: 'available',
            spotsLeft: 8
          },
          {
            date: '2024-07-01',
            price: 849,
            availability: 'limited',
            spotsLeft: 3
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'bali-adventure-package-group',
        name: 'Bali Adventure Package - Group Tour',
        slug: 'bali-adventure-package-group',
        description: 'Get your adrenaline pumping with this action-packed adventure tour of Bali.',
        shortDescription: 'Thrilling adventures across Bali\'s most exciting spots',
        price: 749,
        duration: 5,
        location: 'Ubud, Kintamani, Amed',
        category: 'Adventure',
        tourType: 'GIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/waterfall.jpg'],
        highlights: ['White water rafting', 'Volcano hiking', 'ATV rides'],
        included: ['Accommodation', 'Activities', 'Guide'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Adventure Begins',
            description: 'Start your thrilling journey',
            activities: ['Hotel check-in', 'Equipment briefing']
          }
        ],
        availableDates: [
          {
            date: '2024-06-20',
            price: 749,
            availability: 'available',
            spotsLeft: 6
          },
          {
            date: '2024-07-05',
            price: 799,
            availability: 'available',
            spotsLeft: 8
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'cultural-heritage-tour-group',
        name: 'Cultural Heritage Tour - Group',
        slug: 'cultural-heritage-tour-group',
        description: 'Immerse yourself in Bali\'s rich cultural heritage with a group of like-minded travelers.',
        shortDescription: 'Discover authentic Balinese culture with a group',
        price: 649,
        duration: 6,
        location: 'Ubud, Tegallalang, Besakih',
        category: 'Cultural',
        tourType: 'GIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/riceterrace.jpg'],
        highlights: ['Traditional dance performances', 'Temple visits', 'Art village tours'],
        included: ['Accommodation', 'Breakfast', 'Cultural activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Group Cultural Immersion',
            description: 'Begin your cultural journey together',
            activities: ['Airport pickup', 'Hotel check-in', 'Group orientation']
          }
        ],
        availableDates: [
          {
            date: '2024-06-10',
            price: 649,
            availability: 'available',
            spotsLeft: 10
          },
          {
            date: '2024-07-15',
            price: 699,
            availability: 'limited',
            spotsLeft: 4
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'bali-cultural-immersion',
        name: 'Bali Cultural Immersion',
        slug: 'bali-cultural-immersion',
        description: 'Deep dive into Balinese culture with this immersive group experience.',
        shortDescription: 'Experience authentic Balinese traditions and customs',
        price: 599,
        duration: 5,
        location: 'Ubud, Batuan, Celuk',
        category: 'Cultural',
        tourType: 'GIT',
        status: 'PUBLISHED',
        published: true,
        mediaGallery: ['/images/kecek2.jpg'],
        highlights: ['Traditional craft workshops', 'Temple ceremonies', 'Local home stays'],
        included: ['Accommodation', 'Most meals', 'Cultural activities'],
        notIncluded: ['International flights', 'Personal expenses'],
        itinerary: [
          {
            day: 1,
            title: 'Cultural Welcome',
            description: 'Begin your cultural journey',
            activities: ['Airport pickup', 'Traditional welcome ceremony', 'Orientation dinner']
          }
        ],
        availableDates: [
          {
            date: '2024-06-05',
            price: 599,
            availability: 'available',
            spotsLeft: 12
          },
          {
            date: '2024-07-10',
            price: 649,
            availability: 'available',
            spotsLeft: 8
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: 'en'
      }
    ];

    mockPackages.forEach(pkg => {
      this.packages.set(pkg.slug, pkg);
    });
  }

  getPackage(slug: string): PackageData | null {
    this.loadPackages();
    return this.packages.get(slug) || null;
  }

  getAllPackages(): PackageData[] {
    this.loadPackages();
    return Array.from(this.packages.values());
  }

  getPackagesByType(type: 'FIT' | 'GIT'): PackageData[] {
    this.loadPackages();
    return Array.from(this.packages.values()).filter(pkg => pkg.tourType === type);
  }

  getPackagesByCategory(category: string): PackageData[] {
    this.loadPackages();
    return Array.from(this.packages.values()).filter(pkg => pkg.category === category);
  }

  findPackageBySlugOrName(slug: string): PackageData | null {
    this.loadPackages();
    
    // First try exact slug match
    let foundPackage = this.packages.get(slug);
    if (foundPackage) return foundPackage;
    
    // Then try to find by generated slug from name
    const allPackages = Array.from(this.packages.values());
    foundPackage = allPackages.find(pkg => {
      const generatedSlug = pkg.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
      return generatedSlug === slug;
    });
    
    return foundPackage || null;
  }
}

export const packageLoader = PackageLoader.getInstance();

// Helper functions for backward compatibility
export function getPackageData(slug: string): PackageData | null {
  if (!slug) {
    return null;
  }
  return packageLoader.findPackageBySlugOrName(slug);
}

export function getAllPackageData(): PackageData[] {
  return packageLoader.getAllPackages();
}

export function getAllPackages(): PackageData[] {
  return packageLoader.getAllPackages();
}

export function getFITPackages(): PackageData[] {
  return packageLoader.getPackagesByType('FIT');
}

export function getGITPackages(): PackageData[] {
  return packageLoader.getPackagesByType('GIT');
}