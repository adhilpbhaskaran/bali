'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, MapPin, Star, Check, X, Heart, Share2, Home, Image as ImageIcon, FileText, Info, HelpCircle, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import BaliImage from '@/components/ui/BaliImage';
import Calendar from '@/components/ui/Calendar';
import BookingForm from '@/components/booking/BookingForm';
import { getPackageData, type PackageData } from '@/lib/utils/packageLoader';
import SafeContentRenderer from '@/components/SafeContentRenderer';

// Extended package data interface for backward compatibility
interface ExtendedPackageData extends PackageData {
  title?: string;
  minParticipants?: number;
  maxParticipants?: number;
  isFlexibleDates?: boolean;
  startDate?: string;
  endDate?: string;
  image?: string;
  spotsLeft?: number;
  availability?: string;
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
    startDate: '2024-06-15',
    endDate: '2024-06-21',
    rating: 4.6,
    reviewCount: 95,
    image: packageData.mediaGallery[0] || '/images/packages/default.jpg',
    spotsLeft: 5,
    availability: 'available',
    reviews: [],
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

// Tab interface for navigation
interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// Main component
export default function PackagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [packageData, setPackageData] = useState<ExtendedPackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const inclusionsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Define tabs
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: FileText },
    { id: 'inclusions', label: 'Inclusions', icon: Check },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'booking', label: 'Book Now', icon: CalendarIcon },
  ];

  useEffect(() => {
    const loadPackageData = async () => {
      try {
        setLoading(true);
        
        // Try to get package data using the improved lookup
         const data = getPackageData(slug);
        
        if (data && data.tourType === 'GIT') {
          const extendedData = getExtendedPackageData(data);
          setPackageData(extendedData);
        } else if (data && data.tourType !== 'GIT') {
          console.error('Package found but not a GIT package:', slug);
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
        { id: 'gallery', ref: galleryRef },
        { id: 'reviews', ref: reviewsRef },
        { id: 'faqs', ref: faqsRef },
        { id: 'booking', ref: bookingRef },
      ];
      
      // Find the current section in view
      let currentSection = 'overview'; // default
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          const sectionBottom = sectionTop + section.ref.current.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
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
      gallery: galleryRef as React.RefObject<HTMLDivElement>,
      reviews: reviewsRef as React.RefObject<HTMLDivElement>,
      faqs: faqsRef as React.RefObject<HTMLDivElement>,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-8">The package you're looking for doesn't exist.</p>
          <Link href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Browse All Packages
          </Link>
        </div>
      </div>
    );
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-600';
      case 'limited': return 'bg-orange-600';
      case 'sold-out': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <BaliImage
          src={packageData.image || '/images/packages/default.jpg'}
          alt={packageData.title || packageData.name || 'Package Image'}
          fallbackText={packageData.title || packageData.name || 'Package'}
          category={packageData.category || 'Tour'}
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
            <Link href="/packages?type=GIT" className="text-white/70 hover:text-white transition-colors">
              Upcoming Group Trips
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
              <span className="bg-green-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                GIT Package
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2">
            {/* Overview Section */}
            <div id="overview" ref={overviewRef} className="space-y-8 mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">About This Package</h2>
              <p className="text-white/80 leading-relaxed">{packageData.description}</p>

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
            </div>

            {/* Itinerary Section */}
            <div id="itinerary" ref={itineraryRef} className="space-y-8 mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Day-by-Day Itinerary</h2>
              
              {packageData.itinerary.map((day, index) => (
                <div key={index} className="bento-card p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary-500">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-white/80 mb-4">{day.description}</p>
                  
                  {/* Activities */}
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">Activities</h4>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Accommodation */}
                  <div>
                    <h4 className="text-lg font-medium mb-2">Accommodation</h4>
                    <div className="flex items-center gap-2">
                      <Home className="text-primary-500" size={16} />
                      <span className="text-white/80">{day.accommodation || 'Accommodation not specified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* What's Included Section */}
            <div id="inclusions" ref={inclusionsRef} className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Inclusions & Exclusions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What's Included</h3>
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
                  <h3 className="text-xl font-semibold mb-4">Not Included</h3>
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
            </div>

            {/* Gallery Section */}
            <div id="gallery" ref={galleryRef} className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {packageData.mediaGallery.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <BaliImage
                      src={image}
                      alt={`${packageData.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" ref={reviewsRef} className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {packageData.reviews && Array.isArray(packageData.reviews) && packageData.reviews.length > 0 ? (
                  packageData.reviews.map((review) => (
                    <div key={review.id || Math.random()} className="bento-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name?.charAt(0) || 'U'}
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
                          <div className="text-white/80 mb-2">
                            <SafeContentRenderer 
                              content={review.comment} 
                              className="text-white/80"
                            />
                          </div>
                          <p className="text-white/50 text-sm">{review.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bento-card p-6 text-center">
                    <p className="text-white/70">No reviews yet. Be the first to review this package!</p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div id="faqs" ref={faqsRef} className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {packageData.faqs?.map((faq, index) => (
                  <div key={index} className="bento-card p-6">
                    <h3 className="font-semibold mb-3">{faq.question || 'Question not available'}</h3>
                    <p className="text-white/80">{faq.answer || 'Answer not available'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div id="booking" ref={bookingRef} className="sticky top-24 scroll-mt-24">
              <div className="bento-card p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    From ${packageData.price}
                  </div>
                  <div className="text-white/70">per person</div>
                </div>

                {/* Calendar Section */}
                {packageData.availableDates && packageData.availableDates.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                    <Calendar
                      availableDates={packageData.availableDates}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      tourType="GIT"
                      className=""
                    />
                  </div>
                )}

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
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {packageData.tourType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/70">Fixed Dates</span>
                    <span className="text-green-400">
                      Group Departure
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
                selectedDate={selectedDate}
                onClose={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}