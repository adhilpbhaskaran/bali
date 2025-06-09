'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Home,
  Image as ImageIcon,
  FileText,
  Info,
  HelpCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { useParams } from 'next/navigation';
import { getPackageData, type PackageData } from '@/lib/utils/packageLoader';
import ReviewSubmissionForm from '@/components/reviews/ReviewSubmissionForm';
import GoogleReviewsSync from '@/components/reviews/GoogleReviewsSync';
import SafeContentRenderer from '@/components/SafeContentRenderer';
import { getPackageById } from '@/lib/utils/apiUtils';
import { ensureMinimumImages, getPrimaryImage, processMediaGallery } from '@/lib/utils/mediaUtils';
import { logger } from '@/lib/utils/logger';

// Legacy data mapping for backward compatibility
const packageSlugMap: { [key: string]: string } = {
  '1': 'romantic-bali-honeymoon',
  '2': 'bali-adventure-package',
  '3': 'luxury-bali-retreat',
  '4': 'family-fun-in-bali',
  '5': 'cultural-heritage-tour',
  '6': 'wellness-spa-retreat',
  '7': 'budget-backpacker-special',
  '8': 'romantic-bali-honeymoon-group',
  '9': 'bali-adventure-package-group',
  '10': 'cultural-heritage-tour-group'
};

// Extended package data interface for backward compatibility
interface ExtendedPackageData extends PackageData {
  title?: string;
  availableDates?: Array<{ date: string; price: number; availability: 'available' | 'limited' | 'booked'; spotsLeft?: number }>;
  faqs?: Array<{ question: string; answer: string }>;
}

// Tab interface for navigation
interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// Default values for missing properties
const getExtendedPackageData = (packageData: PackageData): ExtendedPackageData => {
  // Ensure we have at least 5 images for proper gallery display
  const enhancedMediaGallery = ensureMinimumImages(packageData.mediaGallery, 'packages');
  
  return {
    ...packageData,
    title: packageData.name,
    price: packageData.basePrice || packageData.price || 0,
    discountPrice: packageData.discountPrice,
    minParticipants: packageData.tourType === 'FIT' ? 1 : 4,
    maxParticipants: 100,
    isFlexibleDates: packageData.tourType === 'FIT',
    startDate: '2024-02-01',
    endDate: '2024-02-08',
    rating: 4.8,
    reviewCount: 95,
    taxRate: 0.05,
    // Use the getPrimaryImage utility to get the hero image
    image: getPrimaryImage(packageData.mediaGallery, 'packages'),
    // Replace the mediaGallery with our enhanced version
    mediaGallery: enhancedMediaGallery,
    availableDates: [
      { date: '2025-01-15', price: packageData.basePrice || packageData.price || 0, availability: 'available' },
      { date: '2025-01-22', price: packageData.basePrice || packageData.price || 0, availability: 'available' },
      { date: '2025-01-29', price: (packageData.basePrice || packageData.price || 0) + 50, availability: 'limited' },
      { date: '2025-02-05', price: packageData.basePrice || packageData.price || 0, availability: 'available' }
    ],
    faqs: [
      {
        question: 'What\'s included in this package?',
        answer: 'This package includes ' + packageData.included.join(', ').toLowerCase() + '.'
      },
      {
        question: 'Can I customize the itinerary?',
        answer: packageData.tourType === 'FIT' 
          ? 'Yes, we offer flexible customization options for FIT packages.' 
          : 'This is a group tour with fixed itinerary, but we can accommodate special requests.'
      }
    ],
    reviews: [] // Empty array for reviews data
  };
};

// Mock package data for fallback
const mockPackages = [
  {
    id: 1,
    name: "Romantic Bali Honeymoon",
    title: "Romantic Bali Honeymoon",
    shortDescription: "7 days of pure romance in paradise",
    description: "Experience the ultimate romantic getaway in Bali with your loved one.",
    price: 899,
    duration: 7,
    category: "honeymoon",
    location: "Ubud, Seminyak",
    tourType: "FIT",
    status: "available",
    rating: 4.9,
    reviews: 128,
    image: "/images/packages/honeymoon-1.jpg",
    mediaGallery: ["/images/packages/honeymoon-1.jpg"],
    highlights: ["Private villa", "Couples spa", "Romantic dinner"],
    included: ["Accommodation", "Breakfast", "Transfers"],
    notIncluded: ["Flights", "Insurance"],
    itinerary: [],
    faqs: [
      {
        question: "What's included in the honeymoon package?",
        answer: "The package includes 7 nights luxury accommodation, daily breakfast, airport transfers, couples spa treatment, romantic dinner setup, and a private tour guide."
      },
      {
        question: "Can we customize the itinerary?",
        answer: "Yes, we offer flexible customization options to make your honeymoon perfect. Contact our team to discuss your preferences."
      }
    ]
  },
  {
    id: 2,
    name: "Bali Adventure Package",
    title: "Bali Adventure Package",
    shortDescription: "Thrilling adventures across Bali's most exciting spots",
    description: "Get your adrenaline pumping with this action-packed adventure tour of Bali. From white water rafting and volcano hiking to ATV rides and cliff jumping, this package is designed for thrill-seekers who want to experience Bali's wild side while enjoying comfortable accommodations and expert guidance.",
    price: 749,
    discountPrice: 749,
    duration: 5,
    minParticipants: 1,
    maxParticipants: 100,
    category: "adventure",
    location: "Ubud, Kintamani, Amed",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "available",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    rating: 4.8,
    reviews: 96,
    image: "/images/waterfall.jpg",
    taxRate: 0.05,
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
    availableDates: [
      { date: "2025-01-10", price: 749, availability: "available" },
      { date: "2025-01-17", price: 749, availability: "available" },
      { date: "2025-01-24", price: 749, availability: "limited" },
      { date: "2025-01-31", price: 799, availability: "available" },
      { date: "2025-02-07", price: 749, availability: "available" },
      { date: "2025-02-14", price: 799, availability: "limited" },
      { date: "2025-02-21", price: 749, availability: "available" },
      { date: "2025-02-28", price: 799, availability: "available" }
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
    ],
    faqs: [
      {
        question: "What's the fitness level required?",
        answer: "Moderate fitness level is recommended. Most activities are suitable for beginners with proper guidance and safety equipment."
      },
      {
        question: "Is safety equipment provided?",
        answer: "Yes, all safety equipment including helmets, life jackets, and protective gear is provided and regularly maintained."
      }
    ]
  },
  {
    id: 3,
    name: "Luxury Bali Retreat",
    title: "Luxury Bali Retreat",
    shortDescription: "Experience Bali's finest luxury resorts and spas",
    description: "Indulge in the ultimate luxury experience in Bali with stays at world-class resorts, private butler service, exclusive dining experiences, and premium spa treatments. This package is designed for discerning travelers who appreciate the finer things in life and want to experience Bali in absolute comfort and style.",
    price: 1299,
    discountPrice: 1299,
    duration: 6,
    minParticipants: 1,
    maxParticipants: 100,
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
     taxRate: 0.05,
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
    availableDates: [
      { date: "2025-01-05", price: 1299, availability: "available" },
      { date: "2025-01-12", price: 1299, availability: "available" },
      { date: "2025-01-19", price: 1399, availability: "limited" },
      { date: "2025-01-26", price: 1299, availability: "available" },
      { date: "2025-02-02", price: 1399, availability: "available" },
      { date: "2025-02-09", price: 1399, availability: "limited" },
      { date: "2025-02-16", price: 1299, availability: "available" },
      { date: "2025-02-23", price: 1399, availability: "available" }
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
    ],
    faqs: [
      {
        question: "What luxury amenities are included?",
        answer: "Private butler service, premium spa treatments, fine dining experiences, private transfers, and access to exclusive resort facilities."
      },
      {
        question: "Can we arrange private excursions?",
        answer: "Absolutely! We can arrange private yacht charters, helicopter tours, and exclusive cultural experiences tailored to your preferences."
      }
    ]
  },
   {
     id: 4,
     name: "Family Fun in Bali",
     title: "Family Fun in Bali",
     shortDescription: "Perfect family vacation with kid-friendly activities",
     description: "Create lasting memories with your family in Bali. This package is specially designed for families with children, featuring kid-friendly accommodations, safe activities, and experiences that both parents and children will enjoy. From water parks to cultural shows, every day is filled with fun and learning opportunities.",
     price: 849,
     discountPrice: 849,
     duration: 6,
     minParticipants: 2,
     maxParticipants: 100,
     category: "family",
     location: "Sanur, Ubud, Nusa Dua",
     tourType: "FIT",
     isFlexibleDates: true,
     status: "available",
     startDate: "2024-05-01",
     endDate: "2024-05-07",
     rating: 4.7,
     reviews: 89,
     image: "/images/packages/family.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/family.jpg",
       "/images/beach.jpg",
       "/images/beachclub.jpg"
     ],
     highlights: [
       "Family-friendly resort with kids club",
       "Water park and beach activities",
       "Cultural workshops for children",
       "Safe and supervised excursions",
       "Family cooking class"
     ],
     included: [
       "6 nights family accommodation",
       "Daily breakfast",
       "Kids club activities",
       "Family-friendly tours",
       "Airport transfers",
       "Professional family guide"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Lunch and dinner",
       "Personal expenses",
       "Optional activities"
     ],
     availableDates: [
       { date: "2025-01-08", price: 849, availability: "available" },
       { date: "2025-01-15", price: 849, availability: "available" },
       { date: "2025-01-22", price: 899, availability: "limited" },
       { date: "2025-01-29", price: 849, availability: "available" },
       { date: "2025-02-05", price: 899, availability: "available" },
       { date: "2025-02-12", price: 899, availability: "limited" },
       { date: "2025-02-19", price: 849, availability: "available" },
       { date: "2025-02-26", price: 899, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Family Arrival",
         description: "Welcome to your family adventure in Bali",
         activities: ["Airport transfer", "Resort check-in", "Kids club orientation"],
         meals: { breakfast: false, lunch: false, dinner: true },
         accommodation: "Family Resort Sanur"
       }
     ],
     faqs: [
       {
         question: "Is this package suitable for young children?",
         answer: "Yes, this package is designed for families with children of all ages. We provide age-appropriate activities and ensure safety measures are in place."
       },
       {
         question: "Are babysitting services available?",
         answer: "Yes, our partner resorts offer professional babysitting services so parents can enjoy some alone time while children are safely cared for."
       }
     ]
   },
   {
     id: 5,
     name: "Cultural Heritage Tour",
     title: "Cultural Heritage Tour",
     shortDescription: "Deep dive into Bali's rich cultural heritage",
     description: "Immerse yourself in the authentic culture of Bali with this comprehensive heritage tour. Visit ancient temples, participate in traditional ceremonies, learn local crafts, and stay with local families to truly understand the Balinese way of life. This package is perfect for culture enthusiasts and those seeking meaningful travel experiences.",
     price: 699,
     discountPrice: 699,
     duration: 5,
     minParticipants: 1,
     maxParticipants: 100,
     category: "cultural",
     location: "Ubud, Klungkung, Karangasem",
     tourType: "FIT",
     isFlexibleDates: true,
     status: "available",
     startDate: "2024-06-01",
     endDate: "2024-06-06",
     rating: 4.8,
     reviews: 72,
     image: "/images/packages/cultural.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/cultural.jpg",
       "/images/ulundanu.jpg",
       "/images/riceterrace.jpg"
     ],
     highlights: [
       "Ancient temple visits with local priests",
       "Traditional craft workshops",
       "Homestay with Balinese family",
       "Participation in local ceremonies",
       "Traditional dance performances"
     ],
     included: [
       "5 nights accommodation",
       "Daily breakfast",
       "Cultural activities",
       "Local guide",
       "Transportation",
       "Temple entrance fees"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Lunch and dinner",
       "Personal expenses",
       "Donations at temples"
     ],
     availableDates: [
       { date: "2025-01-12", price: 699, availability: "available" },
       { date: "2025-01-19", price: 699, availability: "available" },
       { date: "2025-01-26", price: 699, availability: "limited" },
       { date: "2025-02-02", price: 749, availability: "available" },
       { date: "2025-02-09", price: 699, availability: "available" },
       { date: "2025-02-16", price: 749, availability: "limited" },
       { date: "2025-02-23", price: 699, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Cultural Immersion Begins",
         description: "Start your cultural journey in Bali",
         activities: ["Airport transfer", "Traditional welcome ceremony", "Village orientation"],
         meals: { breakfast: false, lunch: true, dinner: true },
         accommodation: "Traditional Homestay Ubud"
       }
     ],
     faqs: [
       {
         question: "Do I need to follow any dress codes?",
         answer: "Yes, when visiting temples, modest dress is required. We provide sarongs and sashes, and our guide will explain the proper etiquette."
       },
       {
         question: "Can I participate in actual ceremonies?",
         answer: "Yes, with respect and proper guidance, you can participate in certain ceremonies. Our local guides will ensure you understand the significance and proper behavior."
       }
     ]
   },
   {
     id: 6,
     name: "Wellness & Spa Retreat",
     title: "Wellness & Spa Retreat",
     shortDescription: "Rejuvenate your mind, body, and soul",
     description: "Escape the stress of daily life with this comprehensive wellness retreat in Bali. Featuring daily yoga sessions, meditation classes, spa treatments, healthy cuisine, and healing therapies, this package is designed to restore your inner balance and leave you feeling refreshed and renewed.",
     price: 999,
     discountPrice: 999,
     duration: 7,
     minParticipants: 1,
     maxParticipants: 100,
     category: "wellness",
     location: "Ubud, Canggu",
     tourType: "FIT",
     isFlexibleDates: true,
     status: "trending",
     startDate: "2024-07-01",
     endDate: "2024-07-08",
     rating: 4.9,
     reviews: 156,
     image: "/images/packages/wellness.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/wellness.jpg",
       "/images/activities/spa.jpg",
       "/images/villa.jpg"
     ],
     highlights: [
       "Daily yoga and meditation sessions",
       "Traditional Balinese spa treatments",
       "Healthy organic meals",
       "Healing therapy sessions",
       "Wellness workshops",
       "Nature walks and mindfulness activities"
     ],
     included: [
       "7 nights wellness resort stay",
       "All healthy meals",
       "Daily yoga classes",
       "Spa treatments",
       "Meditation sessions",
       "Airport transfers"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Additional spa treatments",
       "Personal expenses",
       "Optional excursions"
     ],
     availableDates: [
       { date: "2025-01-06", price: 999, availability: "available" },
       { date: "2025-01-13", price: 999, availability: "available" },
       { date: "2025-01-20", price: 1049, availability: "limited" },
       { date: "2025-01-27", price: 999, availability: "available" },
       { date: "2025-02-03", price: 1049, availability: "available" },
       { date: "2025-02-10", price: 1049, availability: "limited" },
       { date: "2025-02-17", price: 999, availability: "available" },
       { date: "2025-02-24", price: 1049, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Wellness Journey Begins",
         description: "Start your path to wellness and rejuvenation",
         activities: ["Airport transfer", "Wellness consultation", "Welcome yoga session"],
         meals: { breakfast: false, lunch: true, dinner: true },
         accommodation: "Wellness Resort Ubud"
       }
     ],
     faqs: [
       {
         question: "Do I need yoga experience?",
         answer: "No prior yoga experience is required. Our certified instructors cater to all levels, from beginners to advanced practitioners."
       },
       {
         question: "What type of meals are provided?",
         answer: "We provide healthy, organic, and locally-sourced meals. Vegetarian, vegan, and special dietary requirements can be accommodated."
       }
     ]
   },
   {
     id: 7,
     name: "Budget Backpacker Special",
     title: "Budget Backpacker Special",
     shortDescription: "Affordable Bali adventure for budget travelers",
     description: "Experience the best of Bali without breaking the bank. This budget-friendly package includes hostel accommodations, group tours, local transportation, and authentic experiences that give you great value for money. Perfect for solo travelers, students, and anyone looking to explore Bali on a budget.",
     price: 299,
     discountPrice: 299,
     duration: 4,
     minParticipants: 1,
     maxParticipants: 100,
     category: "budget",
     location: "Kuta, Ubud, Canggu",
     tourType: "FIT",
     isFlexibleDates: true,
     status: "available",
     startDate: "2024-08-01",
     endDate: "2024-08-05",
     rating: 4.5,
     reviews: 203,
     image: "/images/packages/budget.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/budget.jpg",
       "/images/beach.jpg",
       "/images/riceterrace.jpg"
     ],
     highlights: [
       "Budget-friendly hostel accommodation",
       "Group tours with fellow travelers",
       "Local food experiences",
       "Beach and temple visits",
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
     availableDates: [
       { date: "2025-01-14", price: 299, availability: "available" },
       { date: "2025-01-21", price: 299, availability: "available" },
       { date: "2025-01-28", price: 299, availability: "limited" },
       { date: "2025-02-04", price: 329, availability: "available" },
       { date: "2025-02-11", price: 299, availability: "available" },
       { date: "2025-02-18", price: 329, availability: "limited" },
       { date: "2025-02-25", price: 299, availability: "available" }
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
     ],
     faqs: [
       {
         question: "What type of accommodation is provided?",
         answer: "You'll stay in clean, safe hostels with shared dormitory rooms. Private rooms may be available for an additional cost."
       },
       {
         question: "Are meals included?",
         answer: "Only breakfast is included. This allows you to explore local warungs and street food, which is part of the authentic budget travel experience."
       }
     ]
   },
   // GIT (Group Inclusive Tours) - Fixed Date Packages
   {
     id: 8,
     name: "Romantic Bali Honeymoon - Group Tour",
     title: "Romantic Bali Honeymoon - Group Tour",
     shortDescription: "7 days of romance with other couples - Fixed departure dates",
     description: "Join other couples for a romantic group tour of Bali. This fixed-date departure includes all the romance of our honeymoon package with the added benefit of meeting like-minded couples. Perfect for those who enjoy socializing while experiencing Bali's most romantic locations.",
     price: 799,
     discountPrice: 799,
     duration: 7,
     minParticipants: 4,
     maxParticipants: 16,
     category: "honeymoon",
     location: "Ubud, Seminyak, Nusa Dua",
     tourType: "GIT",
     isFlexibleDates: false,
     status: "available",
     startDate: "2025-02-14",
     endDate: "2025-02-21",
     rating: 4.8,
     reviews: 89,
     image: "/images/packages/honeymoon-1.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/honeymoon-1.jpg",
       "/images/packages/honeymoon-2.jpg",
       "/images/packages/honeymoon-3.jpg"
     ],
     highlights: [
       "Fixed Valentine's departure",
       "Meet other couples",
       "Group romantic activities",
       "Shared experiences",
       "Professional group guide"
     ],
     included: [
       "7 nights luxury accommodation",
       "Daily breakfast",
       "Airport transfers",
       "Group activities",
       "Professional guide"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Personal expenses",
       "Individual spa treatments"
     ],
     availableDates: [
       { date: "2025-02-14", price: 799, availability: "available" },
       { date: "2025-03-14", price: 799, availability: "limited" },
       { date: "2025-04-14", price: 849, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Group Arrival & Welcome",
         description: "Meet your fellow travelers and begin the journey",
         activities: ["Airport pickup", "Group check-in", "Welcome dinner"],
         meals: { breakfast: false, lunch: false, dinner: true },
         accommodation: "Luxury Resort Seminyak"
       }
     ],
     faqs: [
       {
         question: "How many couples will be in the group?",
         answer: "Our group tours accommodate 2-8 couples (4-16 people total) to ensure an intimate yet social experience."
       }
     ]
   },
   {
     id: 9,
     name: "Bali Adventure Package - Group Tour",
     title: "Bali Adventure Package - Group Tour",
     shortDescription: "5 days of adventure with fellow thrill-seekers - Fixed dates",
     description: "Join a group of adventure enthusiasts for an action-packed tour of Bali. Fixed departure dates ensure you'll meet like-minded travelers while experiencing the best adventure activities Bali has to offer.",
     price: 649,
     discountPrice: 649,
     duration: 5,
     minParticipants: 6,
     maxParticipants: 20,
     category: "adventure",
     location: "Ubud, Kintamani, Amed",
     tourType: "GIT",
     isFlexibleDates: false,
     status: "available",
     startDate: "2025-03-01",
     endDate: "2025-03-06",
     rating: 4.7,
     reviews: 134,
     image: "/images/waterfall.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/waterfall.jpg",
       "/images/dirtbike.jpg",
       "/images/surfing.jpg"
     ],
     highlights: [
       "Group volcano trekking",
       "Team white water rafting",
       "Group ATV adventures",
       "Shared camping experience",
       "Adventure photography"
     ],
     included: [
       "5 nights accommodation",
       "Daily breakfast",
       "All adventure activities",
       "Professional guide",
       "Safety equipment"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Lunch and dinner",
       "Personal expenses"
     ],
     availableDates: [
       { date: "2025-03-01", price: 649, availability: "available" },
       { date: "2025-03-15", price: 649, availability: "limited" },
       { date: "2025-04-01", price: 699, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Adventure Group Assembly",
         description: "Meet your adventure team and gear up",
         activities: ["Group meeting", "Equipment briefing", "Team building"],
         meals: { breakfast: false, lunch: false, dinner: true },
         accommodation: "Adventure Lodge Ubud"
       }
     ],
     faqs: [
       {
         question: "What's the group size for adventure tours?",
         answer: "Our adventure groups range from 6-20 people to ensure safety while maintaining the excitement of group activities."
       }
     ]
   },
   {
     id: 10,
     name: "Cultural Heritage Tour - Group Experience",
     title: "Cultural Heritage Tour - Group Experience",
     shortDescription: "5 days of cultural immersion with fellow culture enthusiasts",
     description: "Experience Bali's rich cultural heritage with a group of like-minded travelers. Fixed departure dates allow for deeper cultural experiences and meaningful connections with both locals and fellow travelers.",
     price: 599,
     discountPrice: 599,
     duration: 5,
     minParticipants: 8,
     maxParticipants: 24,
     category: "cultural",
     location: "Ubud, Klungkung, Karangasem",
     tourType: "GIT",
     isFlexibleDates: false,
     status: "available",
     startDate: "2025-03-10",
     endDate: "2025-03-15",
     rating: 4.9,
     reviews: 98,
     image: "/images/packages/cultural.jpg",
     taxRate: 0.05,
     mediaGallery: [
       "/images/packages/cultural.jpg",
       "/images/ulundanu.jpg",
       "/images/riceterrace.jpg"
     ],
     highlights: [
       "Group temple ceremonies",
       "Traditional craft workshops",
       "Community homestay experience",
       "Group cultural performances",
       "Shared learning experiences"
     ],
     included: [
       "5 nights accommodation",
       "Daily breakfast",
       "Cultural activities",
       "Local guide",
       "Transportation"
     ],
     notIncluded: [
       "International flights",
       "Travel insurance",
       "Lunch and dinner",
       "Personal expenses"
     ],
     availableDates: [
       { date: "2025-03-10", price: 599, availability: "available" },
       { date: "2025-03-24", price: 599, availability: "limited" },
       { date: "2025-04-07", price: 649, availability: "available" }
     ],
     itinerary: [
       {
         day: 1,
         title: "Cultural Group Introduction",
         description: "Meet fellow culture enthusiasts and begin the journey",
         activities: ["Group welcome ceremony", "Cultural orientation", "Traditional dinner"],
         meals: { breakfast: false, lunch: true, dinner: true },
         accommodation: "Traditional Homestay Ubud"
       }
     ],
     faqs: [
       {
         question: "How authentic are the cultural experiences?",
         answer: "Our group cultural tours provide authentic experiences with real participation in local ceremonies and traditions, guided by local cultural experts."
       }
     ]
   }
 ];
 
 // Function to get package by ID
export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [packageData, setPackageData] = useState<ExtendedPackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const inclusionsRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  
  // Define tabs
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: FileText },
    { id: 'inclusions', label: 'Inclusions', icon: Check },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'booking', label: 'Book Now', icon: CalendarIcon },
  ];

  useEffect(() => {
    const loadPackageData = async () => {
      try {
        setLoading(true);
        setError(null);
        logger.debug(`Loading package data for ID: ${id}`);
        
        // APPROACH 1: Try API fetch using apiUtils getPackageById
        const apiResponse = await getPackageById(id);
        
        if (apiResponse.success && apiResponse.data) {
          logger.api('getPackageById', apiResponse.data);
          setPackageData(getExtendedPackageData(apiResponse.data));
          return;
        }
        
        logger.debug('API fetch did not return data, trying alternative methods');
        
        // APPROACH 2: Check if ID is a numeric legacy ID that needs slug mapping
        if (/^\d+$/.test(id) && packageSlugMap[id]) {
          const slug = packageSlugMap[id];
          logger.debug(`Using legacy mapping: ID ${id} → slug ${slug}`);
          
          // Try API with the mapped slug
          const apiResponseBySlug = await getPackageById(slug);
          if (apiResponseBySlug.success && apiResponseBySlug.data) {
            logger.api('getPackageById (by slug)', apiResponseBySlug.data);
            setPackageData(getExtendedPackageData(apiResponseBySlug.data));
            return;
          }
          
          // If API doesn't work, try local data with mapped slug
          const mappedData = getPackageData(slug);
          if (mappedData) {
            logger.debug(`Found package via legacy slug mapping in local data: ${mappedData.name}`);
            setPackageData(getExtendedPackageData(mappedData));
            return;
          }
        }
        
        // APPROACH 3: Try direct lookup in local data using ID as slug
        const directData = getPackageData(id);
        if (directData) {
          logger.debug(`Found package via direct lookup in local data: ${directData.name}`);
          setPackageData(getExtendedPackageData(directData));
          return;
        }
        
        // APPROACH 4: Last resort - search mock packages by ID or name-based slug
        logger.debug('Trying mock package data as final fallback');
        const mockPackage = mockPackages.find(p => 
          String(p.id) === id || 
          p.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
        );
          
        if (mockPackage) {
          logger.debug(`Found matching mock package: ${mockPackage.name}`);
          setPackageData(getExtendedPackageData(mockPackage as any));
          return;
        }
        
        // If all approaches fail, throw error
        throw new Error('Package not found after trying all data sources');
      } catch (error) {
        console.error('Error loading package data:', error);
        setError('We couldn\'t find the package you\'re looking for. It may have been removed or the URL is incorrect.');
        setPackageData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPackageData();
  }, [id]);
  
  // Handle scroll spy and sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current || !heroRef.current) return;
      
      // Make tabs sticky when scrolling past hero section
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setIsTabsSticky(heroBottom <= 0);
      
      // Update active tab based on scroll position
      const scrollPosition = window.scrollY + 120; // Offset for sticky header
      
      const sections = [
        { id: 'overview', ref: overviewRef },
        { id: 'itinerary', ref: itineraryRef },
        { id: 'inclusions', ref: inclusionsRef },
        { id: 'terms', ref: termsRef },
        { id: 'faqs', ref: faqsRef },
        { id: 'gallery', ref: galleryRef },
        { id: 'reviews', ref: reviewsRef },
        { id: 'booking', ref: bookingRef },
      ];
      
      // Find the current section in view
      let currentSection = 'overview'; // default
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          
          if (scrollPosition >= sectionTop - 150) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      setActiveTab(currentSection);
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    // Use type assertion to tell TypeScript these refs are definitely RefObject<HTMLDivElement>
    const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
      overview: overviewRef as React.RefObject<HTMLDivElement>,
      itinerary: itineraryRef as React.RefObject<HTMLDivElement>,
      inclusions: inclusionsRef as React.RefObject<HTMLDivElement>,
      terms: termsRef as React.RefObject<HTMLDivElement>,
      faqs: faqsRef as React.RefObject<HTMLDivElement>,
      gallery: galleryRef as React.RefObject<HTMLDivElement>,
      reviews: reviewsRef as React.RefObject<HTMLDivElement>,
      booking: bookingRef as React.RefObject<HTMLDivElement>,
    };
    
    const sectionRef = sectionRefs[sectionId];
    if (sectionRef?.current) {
      const headerOffset = 100; // Offset for sticky header and padding
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update active tab immediately for better UX
      setActiveTab(sectionId);
    }
  };
  
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Package Not Found</h1>
          <p className="text-xl mb-8">{error || "The package you're looking for doesn't exist."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-lg transition-colors">
              Browse All Packages
            </Link>
            <Link href="/" className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-lg transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <Image 
          src={packageData.image || '/images/packages/default.jpg'} 
          alt={packageData.name || 'Package Image'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 z-10">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/50">/</span>
            <Link href="/packages" className="text-white/70 hover:text-white transition-colors">
              Packages
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white">{packageData.title}</span>
          </nav>
        </div>
        
        {/* Package Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                {packageData.category.charAt(0).toUpperCase() + packageData.category.slice(1)}
              </span>
              <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                {packageData.tourType} Package
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{packageData.title}</h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl leading-relaxed">{packageData.shortDescription}</p>
            
            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Clock size={20} />
                </div>
                <span className="text-lg font-medium">{packageData.duration} days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Users size={20} />
                </div>
                <span className="text-lg font-medium">{packageData.minParticipants}-{packageData.maxParticipants} guests</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <MapPin size={20} />
                </div>
                <span className="text-lg font-medium">{packageData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                </div>
                <span className="text-lg font-medium">{packageData.rating} ({packageData.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs Navigation */}
      <div 
        ref={tabsRef}
        className={`bg-dark-800 border-b border-dark-700 transition-all duration-300 z-30 ${isTabsSticky ? 'sticky top-0' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-white/70 hover:text-white'}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview Section */}
            <div id="overview" ref={overviewRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">About This Package</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-white/80 leading-relaxed">{packageData.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={20} className="text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Itinerary Section */}
            <div id="itinerary" ref={itineraryRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Day by Day Itinerary</h2>
              <div className="space-y-4">
                {packageData.itinerary && Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 ? 
                  packageData.itinerary.map((day, index) => (
                    <div key={index} className="border border-dark-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold">Day {day.day}: {day.title}</h4>
                          <p className="text-white/70">{day.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Activities</h5>
                          <ul className="space-y-1">
                            {Array.isArray(day.activities) ? day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="text-white/70 text-sm">• {activity}</li>
                            )) : <li className="text-white/70 text-sm">No activities listed</li>}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Meals & Accommodation</h5>
                          <div className="text-white/70 text-sm space-y-1">
                            <p>Breakfast: {day.meals?.breakfast ? '✓' : '✗'}</p>
                            <p>Lunch: {day.meals?.lunch ? '✓' : '✗'}</p>
                            <p>Dinner: {day.meals?.dinner ? '✓' : '✗'}</p>
                            <p className="mt-2"><strong>Stay:</strong> {day.accommodation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : (
                  <div className="text-center py-8 text-white/60">
                    <p>No itinerary information available for this package.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Inclusions Section */}
            <div id="inclusions" ref={inclusionsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Inclusions & Exclusions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-500">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {packageData.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-500">Not Included</h3>
                  <ul className="space-y-2">
                    {packageData.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X size={18} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Terms & Conditions Section */}
            <div id="terms" ref={termsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>
              <div className="space-y-4 text-white/80">
                <p>Please read the following terms and conditions carefully before booking:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>All bookings require a 20% non-refundable deposit to secure your spot.</li>
                  <li>Full payment is due 30 days before the trip start date.</li>
                  <li>Cancellations made 30+ days before departure receive a 80% refund (excluding deposit).</li>
                  <li>Cancellations made 15-29 days before departure receive a 50% refund (excluding deposit).</li>
                  <li>No refunds for cancellations made less than 15 days before departure.</li>
                  <li>We strongly recommend purchasing travel insurance to cover unexpected cancellations.</li>
                  <li>Itinerary may be subject to minor changes due to weather or local conditions.</li>
                </ul>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div id="faqs" ref={faqsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {packageData.faqs && Array.isArray(packageData.faqs) && packageData.faqs.length > 0 ? 
                  packageData.faqs.map((faq, index) => (
                    <div key={index} className="border border-dark-700 rounded-lg">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-dark-800/50"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFaqs.includes(index) ? (
                          <ChevronUp size={20} className="text-primary-500" />
                        ) : (
                          <ChevronDown size={20} className="text-white/60" />
                        )}
                      </button>
                      {expandedFaqs.includes(index) && (
                        <div className="px-4 pb-4">
                          <p className="text-white/70">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                : (
                  <div className="text-center py-8 text-white/60">
                    <p>No itinerary information available for this package.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gallery Section */}
            <div id="gallery" ref={galleryRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image 
                    src={packageData.mediaGallery[selectedImage]} 
                    alt={`${packageData.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {packageData.mediaGallery && Array.isArray(packageData.mediaGallery) && packageData.mediaGallery.length > 0 ? 
                    packageData.mediaGallery.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-[9.5rem] rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-500' : 'border-transparent'
                        }`}
                      >
                        <Image 
                          src={image} 
                          alt={`${packageData.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))
                  : (
                    <div className="text-center py-8 text-white/60">
                      <p>No gallery images available for this package.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div id="reviews" ref={reviewsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-8">
                {/* Google Reviews Sync */}
                <div className="mb-8">
                  <GoogleReviewsSync 
                    itemType="package"
                    itemId={packageData.id}
                    itemName={packageData.name}
                    autoSync={true}
                    syncInterval={300000} // 5 minutes
                    className="mb-6"
                  />
                </div>
                
                {/* Existing Reviews Display */}
                {packageData.reviews && Array.isArray(packageData.reviews) && packageData.reviews.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {packageData.reviews.map((review, index) => (
                      <div key={index} className="border border-dark-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-white/60">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-white/80">
                    <SafeContentRenderer 
                      content={review.comment} 
                      className="text-white/80"
                    />
                  </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60 mb-8">
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
                
                {/* Review Submission Form */}
                <div className="border-t border-dark-700 pt-8">
                  <h4 className="text-lg font-semibold mb-4">Share Your Experience</h4>
                  <ReviewSubmissionForm 
                    itemType="package"
                    itemId={packageData.id}
                    itemName={packageData.name}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div id="booking" ref={bookingRef} className="sticky top-24 scroll-mt-24">
              <BookingForm 
                item={{
                  id: parseInt(packageData.id) || 1, // Convert string ID to number
                  title: packageData.title || packageData.name,
                  price: packageData.price,
                  discountPrice: packageData.discountPrice,
                  minParticipants: packageData.minParticipants || 1,
                  maxParticipants: packageData.maxParticipants || 10,
                  tourType: packageData.tourType,
                  availableDates: packageData.availableDates || []
                }} 
                type="package"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
