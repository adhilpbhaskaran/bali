'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, MapPin, Star, Check, X, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import BaliImage from '@/components/ui/BaliImage';
import BookingForm from '@/components/booking/BookingForm';
import { getPackageData, type PackageData } from '@/lib/utils/packageLoader';

// Extended package data interface for backward compatibility
interface ExtendedPackageData extends PackageData {
  title?: string;
  minParticipants?: number;
  maxParticipants?: number;
  isFlexibleDates?: boolean;
  startDate?: string;
  endDate?: string;
  image?: string;
  // Make sure reviews is an array to match PackageData
  reviews?: any[];
  faqs?: Array<{ question: string; answer: string }>;
}

// Default values for missing properties
const getExtendedPackageData = (packageData: PackageData): ExtendedPackageData => {
  return {
    ...packageData,
    title: packageData.name,
    minParticipants: packageData.tourType === 'FIT' ? 1 : 4,
    maxParticipants: packageData.tourType === 'FIT' ? 100 : 20,
    isFlexibleDates: packageData.tourType === 'FIT',
    startDate: '2024-04-01',
    endDate: '2024-04-07',
    rating: 4.8,
    reviewCount: packageData.reviewCount || 64,
    image: packageData.mediaGallery[0] || '/images/packages/default.jpg',
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
    ]
  };
};

// Mock data for fallback
const mockPackageData = {
  'luxury-bali-retreat': {
    id: 1,
    name: "Luxury Bali Retreat",
    title: "Luxury Bali Retreat", 
    shortDescription: "5 days of ultimate luxury in paradise",
    description: "Experience the pinnacle of luxury with our exclusive Bali retreat package.",
    price: 1299,
    duration: 5,
    minParticipants: 1,
    maxParticipants: 4,
    category: "luxury",
    location: "Seminyak, Ubud",
    tourType: "FIT",
    isFlexibleDates: true,
    status: "available",
    startDate: "2024-04-01",
    endDate: "2024-04-06",
    rating: 4.8,
    reviewCount: 64,
    image: "/images/packages/luxury-1.jpg",
    mediaGallery: [
      "/images/packages/luxury-1.jpg",
      "/images/packages/luxury-2.jpg"
    ],
    highlights: [
      "5-star luxury resort",
      "Private butler service",
      "Premium spa treatments"
    ],
    included: [
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
      },
      {
        day: 2,
        title: "Spa & Wellness Day",
        description: "Rejuvenate with premium spa treatments",
        activities: ["Morning yoga", "Full body massage", "Facial treatment"],
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: "5-Star Beachfront Resort"
      },
      {
        day: 3,
        title: "Private Yacht Experience",
        description: "Exclusive yacht charter around Bali's coast",
        activities: ["Private yacht charter", "Snorkeling", "Sunset dinner"],
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: "5-Star Beachfront Resort"
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely incredible luxury experience! Every detail was perfect.",
        date: "2024-01-15",
        avatar: "/images/testimonials/sarah.jpg"
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 5,
        comment: "The butler service and spa treatments were world-class. Highly recommended!",
        date: "2024-01-10",
        avatar: "/images/testimonials/michael.jpg"
      }
    ],
    faqs: [
      {
        question: "What's included in the butler service?",
        answer: "Our butler service includes personal assistance with dining reservations, activity bookings, unpacking/packing, and any special requests during your stay."
      },
      {
        question: "Can dietary restrictions be accommodated?",
        answer: "Yes, our resort chefs can accommodate all dietary restrictions including vegetarian, vegan, gluten-free, and other special dietary needs."
      }
    ]
  },
  'romantic-bali-honeymoon': {
    id: 1,
    name: "Romantic Bali Honeymoon",
    title: "Romantic Bali Honeymoon",
    shortDescription: "7 days of pure romance in the island of gods",
    description: "Experience the ultimate romantic getaway in Bali with your loved one. This carefully crafted honeymoon package includes luxury accommodations, private dining experiences, couples spa treatments, and romantic sunset excursions. Create unforgettable memories as you explore Bali's most beautiful and intimate locations together.",
    price: 899,
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
    reviewCount: 128,
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
    ],
    reviews: [
      {
        id: 1,
        name: "Emma & James",
        rating: 5,
        comment: "Perfect honeymoon! Every moment was magical and romantic.",
        date: "2024-01-20",
        avatar: "/images/testimonials/couple1.jpg"
      }
    ],
    faqs: [
      {
        question: "Is this package suitable for honeymoons?",
        answer: "Yes! This package is specifically designed for couples and includes romantic experiences like private dinners, couples spa treatments, and sunset cruises."
      }
    ]
  }
};

export default function BestsellerPackageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [packageData, setPackageData] = useState<ExtendedPackageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackageData = async () => {
      try {
        setLoading(true);
        
        // Try to get package data using the improved lookup
         const data = getPackageData(slug);
        
        if (data && data.tourType === 'FIT') {
          const extendedData = getExtendedPackageData(data);
          setPackageData(extendedData);
        } else if (data && data.tourType !== 'FIT') {
          console.error('Package found but not a FIT package:', slug);
          setPackageData(null);
        } else {
          console.error('Package not found for slug:', slug);
          setPackageData(null);
        }
      } catch (error) {
        console.error('Error loading package data:', error);
        setPackageData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPackageData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
          <p className="text-white/70 mb-6">The package you're looking for doesn't exist.</p>
          <Link href="/packages" className="btn-primary">
            Browse All Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <BaliImage
          src={packageData.image}
          alt={packageData.title || packageData.name || 'Package Image'}
          fallbackText={packageData.title || packageData.name}
          category={packageData.category}
          aspectRatio="16:9"
          className="w-full h-full object-cover"
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
            <Link href="/packages?type=FIT" className="text-white/70 hover:text-white transition-colors">
              Bestsellers
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
                FIT Package
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
                <span className="text-lg font-medium">{packageData.minParticipants}-{packageData.maxParticipants} people</span>
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
                <span className="text-lg font-medium">{packageData.rating} ({packageData.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'itinerary', label: 'Itinerary' },
                { id: 'included', label: 'What\'s Included' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'faq', label: 'FAQ' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Smooth scroll to section
                    const element = document.getElementById(tab.id);
                    if (element) {
                      const headerOffset = 100;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div id="overview" className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Package</h2>
                  <p className="text-white/80 leading-relaxed">{packageData.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Package Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {packageData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="text-primary-500 mt-1 flex-shrink-0" size={16} />
                        <span className="text-white/80">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Gallery */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {packageData.mediaGallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <BaliImage
                          src={image}
                          alt={`${packageData.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div id="itinerary">
                <h2 className="text-2xl font-bold mb-6">Day by Day Itinerary</h2>
                <div className="space-y-6">
                  {packageData.itinerary.map((day, index) => (
                    <div key={index} className="bento-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{day.title}</h3>
                          <p className="text-white/80 mb-4">{day.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Activities</h4>
                              <ul className="space-y-1">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-white/70 text-sm flex items-center gap-2">
                                    <div className="w-1 h-1 bg-primary-500 rounded-full" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Meals & Accommodation</h4>
                              <div className="space-y-1 text-sm text-white/70">
                                <div>Breakfast: {day.meals?.breakfast ? '✓' : '✗'}</div>
                                <div>Lunch: {day.meals?.lunch ? '✓' : '✗'}</div>
                                <div>Dinner: {day.meals?.dinner ? '✓' : '✗'}</div>
                                <div className="mt-2 font-medium">{day.accommodation}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'included' && (
              <div id="included" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-400">What's Included</h3>
                  <div className="space-y-3">
                    {packageData.included.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="text-green-400 mt-1 flex-shrink-0" size={16} />
                        <span className="text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Not Included</h3>
                  <div className="space-y-3">
                    {packageData.notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="text-red-400 mt-1 flex-shrink-0" size={16} />
                        <span className="text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div id="reviews">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {Array.isArray(packageData.reviews) && packageData.reviews.map((review) => (
                    <div key={review.id} className="bento-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/30'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-white/80 mb-2">{review.comment}</p>
                          <p className="text-white/50 text-sm">{review.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div id="faq">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {packageData.faqs?.map((faq, index) => (
                    <div key={index} className="bento-card p-6">
                      <h3 className="font-semibold mb-3">{faq.question}</h3>
                      <p className="text-white/80">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bento-card p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    ${packageData.price}
                  </div>
                  <div className="text-white/70">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Duration</span>
                    <span>{packageData.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Group Size</span>
                    <span>{packageData.minParticipants}-{packageData.maxParticipants} people</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Tour Type</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {packageData.tourType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/70">Flexible Dates</span>
                    <span className={packageData.isFlexibleDates ? 'text-green-400' : 'text-red-400'}>
                    {packageData.isFlexibleDates ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="btn-primary w-full mb-4"
                >
                  Book Now
                </button>

                <div className="flex gap-2">
                  <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                    <Heart size={16} />
                    Save
                  </button>
                  <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Book {packageData.title}</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <BookingForm
                item={{
                  id: typeof packageData.id === 'string' ? parseInt(packageData.id, 10) || 0 : packageData.id || 0,
                  title: packageData.title || packageData.name || 'Package',
                  price: packageData.basePrice || packageData.price || 0,
                  maxParticipants: packageData.maxParticipants || 10,
                  availableDates: packageData.availableDates || []
                }}
                type="package"
                onClose={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}