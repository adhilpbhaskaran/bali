'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PackageCard from '@/components/packages/PackageCard';
import { usePackagesStore } from '@/lib/store/packages';

// Sample data for packages - Enhanced to match CMS form structure
const staticPackages = [
  {
    id: 1,
    name: "Romantic Bali Honeymoon",
    slug: "romantic-bali-honeymoon",
    title: "Romantic Bali Honeymoon", // Keep for backward compatibility
    shortDescription: "7 days of pure romance in the island of gods",
    description: "Experience the ultimate romantic getaway in Bali with your loved one. This carefully crafted honeymoon package includes luxury accommodations, private dining experiences, couples spa treatments, and romantic sunset excursions. Create unforgettable memories as you explore Bali's most beautiful and intimate locations together.",
    price: 899,
    taxRate: 0.05, // 5% tax rate
    duration: 7,
    minParticipants: 2,
    maxParticipants: 2,
    category: "honeymoon",
    location: "Ubud, Seminyak, Nusa Dua",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "available",
    startDate: "2024-02-01",
    endDate: "2024-02-08",
    rating: 4.9,
    reviews: 128,
    image: "/images/packages/honeymoon-1.jpg",
    mediaGallery: [
      "/images/packages/honeymoon-1.jpg",
      "/images/packages/honeymoon-2.jpg",
      "/images/packages/honeymoon-3.jpg",
      "/images/packages/honeymoon-4.jpg"
    ],
    highlights: [
      "Private villa with infinity pool",
      "Couples spa treatment at luxury resort",
      "Romantic candlelit dinner on the beach",
      "Private sunset cruise",
      "Professional photography session"
    ],
    included: [
      "7 nights luxury accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Couples spa treatment",
      "Romantic dinner setup",
      "Private tour guide"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Additional meals not mentioned",
      "Tips and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Welcome",
        description: "Arrive in Bali and transfer to your luxury villa",
        activities: ["Airport pickup", "Villa check-in", "Welcome drink"],
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: "Luxury Villa in Seminyak"
      },
      {
        day: 2,
        title: "Ubud Cultural Experience",
        description: "Explore the cultural heart of Bali",
        activities: ["Tegallalang Rice Terraces", "Ubud Monkey Forest", "Traditional market visit"],
        meals: { breakfast: true, lunch: true, dinner: false },
        accommodation: "Luxury Villa in Seminyak"
      }
    ]
  },
  {
    id: 2,
    name: "Bali Adventure Package",
    slug: "bali-adventure-package-group",
    title: "Bali Adventure Package",
    shortDescription: "Thrilling adventures across Bali's most exciting spots",
    description: "Get your adrenaline pumping with this action-packed adventure tour of Bali. From white water rafting and volcano hiking to ATV rides and cliff jumping, this package is designed for thrill-seekers who want to experience Bali's wild side while enjoying comfortable accommodations and expert guidance.",
    price: 749,
    taxRate: 0.05,
    duration: 5,
    minParticipants: 1,
    maxParticipants: 12,
    category: "adventure",
    location: "Ubud, Kintamani, Amed",
    tourType: "GIT",
    isFlexibleDates: false,
    status: "available",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    rating: 4.8,
    reviews: 96,
    image: "/images/waterfall.jpg",
    mediaGallery: [
      "/images/waterfall.jpg",
      "/images/dirtbike.jpg",
      "/images/surfing.jpg"
    ],
    highlights: [
      "Mount Batur sunrise trekking",
      "White water rafting on Ayung River",
      "ATV quad biking adventure",
      "Sekumpul waterfall exploration",
      "Traditional Balinese cooking class"
    ],
    included: [
      "5 nights accommodation",
      "Daily breakfast",
      "All adventure activities",
      "Professional guide",
      "Safety equipment",
      "Transportation"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunch and dinner",
      "Personal expenses",
      "Optional activities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Orientation",
        description: "Welcome to your Bali adventure",
        activities: ["Airport transfer", "Hotel check-in", "Adventure briefing"],
        meals: { breakfast: false, lunch: false, dinner: false },
        accommodation: "Adventure Lodge Ubud"
      }
    ]
  },
  {
    id: 3,
    name: "Luxury Bali Retreat",
    slug: "luxury-bali-retreat",
    title: "Luxury Bali Retreat",
    shortDescription: "Experience Bali's finest luxury resorts and spas",
    description: "Indulge in the ultimate luxury experience in Bali with stays at world-class resorts, private butler service, exclusive dining experiences, and premium spa treatments. This package is designed for discerning travelers who appreciate the finer things in life and want to experience Bali in absolute comfort and style.",
    price: 1299,
    duration: 6,
    minParticipants: 1,
    maxParticipants: 4,
    category: "luxury",
    location: "Nusa Dua, Jimbaran, Uluwatu",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "trending",
    startDate: "2024-04-01",
    endDate: "2024-04-07",
    rating: 5.0,
    reviews: 64,
    image: "/images/packages/luxury.jpg",
    mediaGallery: [
      "/images/packages/luxury.jpg",
      "/images/villa.jpg",
      "/images/beachclub.jpg"
    ],
    highlights: [
      "5-star beachfront resort accommodation",
      "Private butler service",
      "Michelin-starred dining experience",
      "Premium spa treatments",
      "Private yacht charter",
      "Helicopter tour of Bali"
    ],
    included: [
      "6 nights luxury resort stay",
      "All meals at resort",
      "Private airport transfers",
      "Butler service",
      "Spa treatments",
      "Premium activities"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal shopping",
      "Additional spa treatments",
      "Alcoholic beverages"
    ],
    itinerary: [
      {
        day: 1,
        title: "Luxury Arrival",
        description: "VIP arrival and resort orientation",
        activities: ["Private transfer", "Resort check-in", "Welcome ceremony"],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: "5-Star Beachfront Resort"
      }
    ]
  },
  {
    id: 4,
    name: "Family Fun in Bali",
    slug: "family-fun-bali-group",
    title: "Family Fun in Bali",
    shortDescription: "Create unforgettable memories with your loved ones",
    description: "A perfect family vacation package designed with activities and accommodations suitable for all ages. Enjoy family-friendly attractions, cultural experiences, beach time, and educational tours that will create lasting memories for parents and children alike while ensuring comfort and safety throughout your stay.",
    price: 849,
    duration: 6,
    minParticipants: 3,
    maxParticipants: 8,
    category: "family",
    location: "Sanur, Ubud, Kuta",
    tourType: "GIT",
    isFlexibleDates: false,
    status: "available",
    startDate: "2024-06-15",
    endDate: "2024-06-21",
    rating: 4.7,
    reviews: 112,
    image: "/images/packages/family.jpg",
    mediaGallery: [
      "/images/packages/family.jpg",
      "/images/beach.jpg",
      "/images/riceterrace.jpg"
    ],
    highlights: [
      "Family-friendly resort with kids club",
      "Bali Safari and Marine Park visit",
      "Traditional Balinese dance show",
      "Beach activities and water sports",
      "Cultural village tour",
      "Cooking class for the whole family"
    ],
    included: [
      "6 nights family accommodation",
      "Daily breakfast",
      "Family activities",
      "Kids club access",
      "Transportation",
      "English-speaking guide"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunch and dinner",
      "Personal expenses",
      "Optional activities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Family Arrival",
        description: "Welcome to your family adventure",
        activities: ["Airport pickup", "Hotel check-in", "Kids club orientation"],
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: "Family Resort Sanur"
      }
    ]
  },
  {
    id: 5,
    name: "Cultural Heritage Tour",
    slug: "cultural-heritage-bali-group",
    title: "Cultural Heritage Tour",
    shortDescription: "Immerse yourself in Bali's rich cultural traditions",
    description: "Discover the authentic cultural heritage of Bali through visits to ancient temples, traditional villages, and artisan workshops. This package offers deep insights into Balinese Hindu culture, traditional arts, and local customs while staying in heritage properties that reflect the island's architectural beauty.",
    price: 649,
    duration: 5,
    minParticipants: 2,
    maxParticipants: 10,
    category: "cultural",
    location: "Ubud, Klungkung, Karangasem",
    tourType: "GIT",
    isFlexibleDates: false,
    status: "available",
    startDate: "2024-05-10",
    endDate: "2024-05-15",
    rating: 4.6,
    reviews: 89,
    image: "/images/packages/cultural.jpg",
    mediaGallery: [
      "/images/packages/cultural.jpg",
      "/images/riceterrace.jpg",
      "/images/ulundanu.jpg"
    ],
    highlights: [
      "Ancient temple complex visits",
      "Traditional village homestay experience",
      "Balinese art and craft workshops",
      "Traditional dance performances",
      "Local market and cooking experiences",
      "Sacred water temple ceremonies"
    ],
    included: [
      "5 nights heritage accommodation",
      "Daily breakfast",
      "Cultural guide",
      "Temple entrance fees",
      "Workshop materials",
      "Traditional performances"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunch and dinner",
      "Personal expenses",
      "Shopping"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cultural Immersion",
        description: "Begin your cultural journey",
        activities: ["Temple visit", "Traditional village tour", "Art workshop"],
        meals: { breakfast: false, lunch: true, dinner: false },
        accommodation: "Heritage Hotel Ubud"
      }
    ]
  },
  {
    id: 6,
    name: "Wellness & Spa Retreat",
    slug: "wellness-spa-retreat",
    title: "Wellness & Spa Retreat",
    shortDescription: "Rejuvenate your mind, body, and soul in paradise",
    description: "Escape to a world of tranquility and wellness with this comprehensive spa and wellness retreat. Featuring daily yoga sessions, meditation classes, organic spa treatments, healthy cuisine, and holistic healing practices in Bali's most serene locations.",
    price: 999,
    duration: 8,
    minParticipants: 1,
    maxParticipants: 6,
    category: "wellness",
    location: "Ubud, Canggu, Amed",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "trending",
    startDate: "2024-07-01",
    endDate: "2024-07-09",
    rating: 4.9,
    reviews: 156,
    image: "/images/packages/wellness.jpg",
    mediaGallery: [
      "/images/packages/wellness.jpg",
      "/images/villa.jpg",
      "/images/riceterrace.jpg"
    ],
    highlights: [
      "Daily yoga and meditation sessions",
      "Organic spa treatments",
      "Healthy gourmet cuisine",
      "Detox and cleansing programs",
      "Sound healing therapy",
      "Mindfulness workshops"
    ],
    included: [
      "8 nights wellness resort stay",
      "All organic meals",
      "Daily yoga classes",
      "Spa treatments",
      "Wellness consultations",
      "Airport transfers"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Additional spa treatments",
      "Personal expenses",
      "Optional excursions"
    ],
    itinerary: [
      {
        day: 1,
        title: "Wellness Welcome",
        description: "Begin your wellness journey",
        activities: ["Arrival consultation", "Welcome yoga session", "Spa orientation"],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: "Wellness Resort Ubud"
      }
    ]
  },
  {
    id: 7,
    name: "Budget Backpacker Special",
    slug: "budget-backpacker-bali-group",
    title: "Budget Backpacker Special",
    shortDescription: "Explore Bali on a budget without missing the highlights",
    description: "Perfect for budget-conscious travelers who want to experience the best of Bali without breaking the bank. This package includes comfortable hostel accommodations, group tours to major attractions, local transportation, and authentic local dining experiences.",
    price: 299,
    duration: 4,
    minParticipants: 1,
    maxParticipants: 15,
    category: "budget",
    location: "Kuta, Ubud, Sanur",
    tourType: "GIT",
    isFlexibleDates: false,
    status: "available",
    startDate: "2024-08-01",
    endDate: "2024-08-05",
    rating: 4.3,
    reviews: 203,
    image: "/images/packages/budget.jpg",
    mediaGallery: [
      "/images/packages/budget.jpg",
      "/images/beach.jpg",
      "/images/riceterrace.jpg"
    ],
    highlights: [
      "Major temple visits",
      "Rice terrace exploration",
      "Beach time and surfing lessons",
      "Local market tours",
      "Traditional food experiences",
      "Backpacker community activities"
    ],
    included: [
      "4 nights hostel accommodation",
      "Daily breakfast",
      "Group tours",
      "Local transportation",
      "English-speaking guide",
      "Airport pickup"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunch and dinner",
      "Personal expenses",
      "Optional activities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Budget Adventure Begins",
        description: "Start your budget-friendly Bali experience",
        activities: ["Hostel check-in", "Group orientation", "Beach visit"],
        meals: { breakfast: false, lunch: false, dinner: false },
        accommodation: "Backpacker Hostel Kuta"
      }
    ]
  },
  {
    id: 8,
    name: "Romantic Sunset Cruise",
    slug: "romantic-sunset-cruise",
    title: "Romantic Sunset Cruise",
    shortDescription: "Intimate sailing experience with dinner and entertainment",
    description: "Set sail on a romantic sunset cruise around Bali's beautiful coastline. Enjoy a private dinner, live music, and breathtaking views as you watch the sun set over the Indian Ocean. Perfect for couples celebrating special occasions.",
    price: 459,
    duration: 3,
    minParticipants: 2,
    maxParticipants: 2,
    category: "honeymoon",
    location: "Benoa Harbor, Nusa Dua",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "available",
    startDate: "2024-09-01",
    endDate: "2024-09-04",
    rating: 4.8,
    reviews: 87,
    image: "/images/packages/cruise.jpg",
    mediaGallery: [
      "/images/packages/cruise.jpg",
      "/images/bluesea.jpg",
      "/images/beachclub.jpg"
    ],
    highlights: [
      "Private sunset sailing",
      "Romantic dinner on deck",
      "Live acoustic music",
      "Champagne toast",
      "Professional photography"
    ],
    included: [
      "3 nights beachfront accommodation",
      "Daily breakfast",
      "Sunset cruise with dinner",
      "Airport transfers",
      "Photography session"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Additional meals",
      "Personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Time",
        description: "Relax and prepare for your romantic cruise",
        activities: ["Hotel check-in", "Beach relaxation", "Spa treatment"],
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: "Beachfront Resort Nusa Dua"
      }
    ]
  },
  {
    id: 9,
    name: "Volcano Trekking Adventure",
    slug: "volcano-trekking-bali-group",
    title: "Volcano Trekking Adventure",
    shortDescription: "Challenging trek to active volcanoes with sunrise views",
    description: "Experience the thrill of trekking to Bali's active volcanoes. This adventure package includes guided treks to Mount Batur and Mount Agung, with sunrise viewing, hot springs, and traditional breakfast cooked by volcanic steam.",
    price: 589,
    duration: 4,
    minParticipants: 4,
    maxParticipants: 12,
    category: "adventure",
    location: "Kintamani, Besakih, Amed",
    tourType: "GIT",
    isFlexibleDates: false,
    status: "available",
    startDate: "2024-10-15",
    endDate: "2024-10-19",
    rating: 4.7,
    reviews: 134,
    image: "/images/packages/volcano.jpg",
    mediaGallery: [
      "/images/packages/volcano.jpg",
      "/images/drone.jpg",
      "/images/riceterrace.jpg"
    ],
    highlights: [
      "Mount Batur sunrise trek",
      "Mount Agung challenging climb",
      "Natural hot springs",
      "Volcanic steam cooking",
      "Traditional village visit"
    ],
    included: [
      "4 nights mountain lodge accommodation",
      "All meals",
      "Professional trekking guide",
      "Safety equipment",
      "Transportation",
      "Hot springs entry"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal trekking gear",
      "Tips for guides"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Preparation",
        description: "Gear up for your volcano adventure",
        activities: ["Equipment briefing", "Fitness assessment", "Local village tour"],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: "Mountain Lodge Kintamani"
      }
    ]
  },
  {
    id: 10,
    name: "Luxury Villa Escape",
    slug: "luxury-villa-escape",
    title: "Luxury Villa Escape",
    shortDescription: "Private villa with personal butler and chef services",
    description: "Indulge in the ultimate luxury with a private villa featuring infinity pool, personal butler, private chef, and exclusive access to premium amenities. Perfect for those seeking privacy and personalized service.",
    price: 1899,
    duration: 5,
    minParticipants: 2,
    maxParticipants: 8,
    category: "luxury",
    location: "Seminyak, Canggu",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "trending",
    startDate: "2024-11-01",
    endDate: "2024-11-06",
    rating: 5.0,
    reviews: 45,
    image: "/images/packages/luxury-villa.jpg",
    mediaGallery: [
      "/images/packages/luxury-villa.jpg",
      "/images/villa.jpg",
      "/images/beachclub.jpg"
    ],
    highlights: [
      "Private infinity pool villa",
      "24/7 personal butler service",
      "Private chef for all meals",
      "Luxury car with driver",
      "Exclusive beach club access",
      "Premium spa treatments"
    ],
    included: [
      "5 nights luxury villa",
      "All meals by private chef",
      "Butler service",
      "Luxury transportation",
      "Daily spa treatments",
      "Beach club membership"
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Alcoholic beverages",
      "Shopping expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Luxury Arrival",
        description: "VIP welcome to your private villa",
        activities: ["Private transfer", "Villa orientation", "Welcome massage"],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: "Private Luxury Villa Seminyak"
      }
    ]
  }
];

// Filter options
const categories = [
  { id: 'all', name: 'All Packages' },
  { id: 'honeymoon', name: 'Honeymoon' },
  { id: 'family', name: 'Family' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'budget', name: 'Budget' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'wellness', name: 'Wellness' },
];

const durations = [
  { id: 'all', name: 'Any Duration' },
  { id: '1-3', name: '1-3 Days' },
  { id: '4-7', name: '4-7 Days' },
  { id: '8-14', name: '8-14 Days' },
  { id: '15+', name: '15+ Days' },
];

const priceRanges = [
  { id: 'all', name: 'Any Price' },
  { id: '0-500', name: 'Under $500' },
  { id: '500-1000', name: '$500 - $1000' },
  { id: '1000-1500', name: '$1000 - $1500' },
  { id: '1500+', name: '$1500+' },
];

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  // Get packages from store
  const { 
    packages, 
    loading, 
    error, 
    fetchPackages,
    fetchFITPackages, 
    fetchGITPackages 
  } = usePackagesStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFITCount, setVisibleFITCount] = useState(8); // Number of FIT packages to show initially
  const [visibleGITCount, setVisibleGITCount] = useState(6); // Number of GIT packages to show initially
  
  // Determine if we should show FIT and GIT sections based on the type parameter
  const showFITSection = !typeParam || typeParam.toUpperCase() === 'FIT';
  const showGITSection = !typeParam || typeParam.toUpperCase() === 'GIT';

  // Fetch packages on component mount
  useEffect(() => {
    const loadPackages = async () => {
      try {
        // Fetch packages based on what sections we need to show
        if (showFITSection && showGITSection) {
          // If showing both, fetch all packages
          await fetchPackages();
        } else if (showFITSection) {
          // If only showing FIT, fetch FIT packages
          await fetchFITPackages();
        } else if (showGITSection) {
          // If only showing GIT, fetch GIT packages
          await fetchGITPackages();
        }
      } catch (error) {
        console.error('Failed to load packages:', error);
      }
    };
    
    loadPackages();
  }, [showFITSection, showGITSection]); // Removed store functions from dependency array
  
  // Transform API data to match component interface
  const transformPackageData = (pkg: any) => {
    return {
      id: pkg.id || Math.random().toString(),
      name: pkg.name || pkg.title || '',
      title: pkg.name || pkg.title || '',
      shortDescription: pkg.shortDescription || pkg.description?.substring(0, 100) + '...' || '',
      description: pkg.description || '',
      price: pkg.discountPrice || pkg.price || pkg.basePrice || 0,
      taxRate: 0.05,
      duration: pkg.duration || 1,
      minParticipants: pkg.minParticipants || 1,
      maxParticipants: pkg.maxParticipants || 10,
      category: pkg.category || (pkg.tourType === 'FIT' ? 'bestseller' : 'group-trip'),
      location: pkg.location || 'Bali, Indonesia',
      tourType: pkg.tourType || 'FIT',
      isFlexibleDates: pkg.isFlexibleDates ?? (pkg.tourType === 'FIT'),
      status: pkg.status || 'available',
      startDate: pkg.startDate || new Date().toISOString().split('T')[0],
      endDate: pkg.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: pkg.rating || 4.5,
      reviews: pkg.reviews || pkg.reviewCount || 0,
      image: pkg.mediaGallery?.[0] || pkg.image || '/images/beach.jpg',
      mediaGallery: pkg.mediaGallery || [pkg.image || '/images/beach.jpg'],
      highlights: pkg.highlights || [],
      included: pkg.included || [],
      notIncluded: pkg.notIncluded || [],
      itinerary: pkg.itinerary || [],
      // Ensure slug is available for URL generation
      slug: pkg.slug || pkg.name?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '') || ''
    };
  };
  
  // Use API data if available, fallback to static data
  const allPackagesData = useMemo(() => {
    return packages.length > 0 
      ? packages.map(transformPackageData)
      : staticPackages; // Use the static data as fallback
  }, [packages]);

  // Filter packages based on selected filters - memoized to prevent unnecessary recalculations
  const filteredPackages = useMemo(() => {
    return allPackagesData.filter((pkg) => {
      // Search term filter - only run if search term exists
      if (searchTerm && !pkg.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter - only run if category is selected
      if (selectedCategory !== 'all' && pkg.category !== selectedCategory) {
        return false;
      }

      // Duration filter - only run if duration is selected
      if (selectedDuration !== 'all') {
        const duration = pkg.duration;
        
        if (selectedDuration === '1-3' && (duration < 1 || duration > 3)) return false;
        if (selectedDuration === '4-7' && (duration < 4 || duration > 7)) return false;
        if (selectedDuration === '8-14' && (duration < 8 || duration > 14)) return false;
        if (selectedDuration === '15+' && duration < 15) return false;
      }

      // Price filter - only run if price is selected
      if (selectedPrice !== 'all') {
        const price = pkg.price;
        
        if (selectedPrice === '0-500' && (price < 0 || price > 500)) return false;
        if (selectedPrice === '500-1000' && (price < 500 || price > 1000)) return false;
        if (selectedPrice === '1000-1500' && (price < 1000 || price > 1500)) return false;
        if (selectedPrice === '1500+' && price < 1500) return false;
      }

      return true;
    });
  }, [allPackagesData, searchTerm, selectedCategory, selectedDuration, selectedPrice]);

  // Memoized package slices to prevent hook order issues
  const gitPackagesSlice = useMemo(() => {
    const gitPackages = allPackagesData.filter(pkg => pkg.tourType === 'GIT');
    return gitPackages.slice(0, visibleGITCount);
  }, [allPackagesData, visibleGITCount]);

  const fitPackagesSlice = useMemo(() => {
    const fitPackages = filteredPackages.filter(pkg => pkg.tourType === 'FIT');
    return fitPackages.slice(0, visibleFITCount);
  }, [filteredPackages, visibleFITCount]);

  // Reset visible counts when filters change
  useEffect(() => {
    setVisibleFITCount(8);
    setVisibleGITCount(6);
  }, [searchTerm, selectedCategory, selectedDuration, selectedPrice]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-white/70">Loading packages...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading packages</p>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Bali Travel Packages</h1>
          <p className="text-white/70 max-w-3xl">
            Discover our carefully curated Bali travel packages designed to give you the perfect island experience. 
            From romantic honeymoons to thrilling adventures, we have something for everyone.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              className="md:hidden flex items-center justify-center bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Filter Options */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-2">
                Package Type
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-white/70 mb-2">
                Duration
              </label>
              <select
                id="duration"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {durations.map((duration) => (
                  <option key={duration.id} value={duration.id}>
                    {duration.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white/70 mb-2">
                Price Range
              </label>
              <select
                id="price"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
              >
                {priceRanges.map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upcoming Trips Section */}
        {showGITSection && (
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Upcoming Group Trips</h2>
              <p className="text-white/70 max-w-3xl">
                Join our scheduled group departures with fixed dates. These Group Inclusive Tours (GIT) offer great value and the opportunity to meet fellow travelers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {gitPackagesSlice.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
            
            {/* Load more button for GIT packages */}
            {allPackagesData.filter(pkg => pkg.tourType === 'GIT').length > visibleGITCount && (
              <div className="mb-12 text-center">
                <button 
                  onClick={() => setVisibleGITCount(prev => prev + 6)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Load More Group Trips
                </button>
              </div>
            )}
          </div>
        )}

        {/* Divider - only show if both sections are visible */}
        {showFITSection && showGITSection && (
          <div className="border-t border-dark-700 mb-12"></div>
        )}

        {/* Bestsellers Section */}
        {showFITSection && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Bestsellers</h2>
              <p className="text-white/70 max-w-3xl mb-6">
                Customize your perfect Bali experience with our most popular packages. Choose your dates and personalize your itinerary.
              </p>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-white/70">
                Showing {filteredPackages.filter(pkg => pkg.tourType === 'FIT').length} bestseller packages • Browse by category above for better organization
              </p>
            </div>

            {/* Bestsellers Grid */}
            {filteredPackages.filter(pkg => pkg.tourType === 'FIT').length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Only render visible packages to improve performance */}
                  {fitPackagesSlice.map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} />
                  ))}
                </div>
                
                {/* Load more button if there are more packages to show */}
                {filteredPackages.filter(pkg => pkg.tourType === 'FIT').length > visibleFITCount && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => setVisibleFITCount(prev => prev + 8)}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Load More Packages
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-dark-800 rounded-bento">
                <p className="text-xl mb-2">No bestseller packages found</p>
                <p className="text-white/70">Try adjusting your filters or search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
