'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReviewSubmissionForm from '@/components/reviews/ReviewSubmissionForm';
import GoogleReviewsSync from '@/components/reviews/GoogleReviewsSync';
import SafeContentRenderer from '@/components/SafeContentRenderer';
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
  ChevronUp
} from 'lucide-react';

// Sample activity data
const activityData = {
  id: 1,
  title: "Mount Batur Sunrise Trek",
  description: "Experience a magical sunrise from the top of an active volcano. This early morning trek takes you to the summit of Mount Batur (1,717m) to witness a spectacular sunrise over the surrounding mountains and Lake Batur.",
  price: 65,
  discountPrice: 55,
  rating: 4.8,
  reviews: 156,
  reviewsList: [
    {
      name: "Sarah Johnson",
      rating: 5,
      date: "2023-12-15",
      comment: "Absolutely incredible experience! The trek was challenging but our guide was patient and encouraging. The sunrise view was breathtaking and worth every step. Highly recommend!",
      images: ["/images/reviews/review1-1.jpg", "/images/reviews/review1-2.jpg"]
    },
    {
      name: "Michael Chen",
      rating: 4,
      date: "2023-11-22",
      comment: "Great trek with amazing views. Our guide was knowledgeable about the volcano and surrounding area. The only downside was that it was quite crowded at the summit."
    }
  ],
  duration: "6 hours",
  category: "adventure",
  location: "Kintamani, Bali, Indonesia",
  maxGuests: 10,
  images: [
    "/images/activities/mount-batur-1.jpg",
    "/images/activities/mount-batur-2.jpg",
    "/images/activities/mount-batur-3.jpg",
    "/images/activities/mount-batur-4.jpg",
  ],
  highlights: [
    "Witness a spectacular sunrise from the summit of an active volcano",
    "Professional English-speaking guide",
    "Breakfast at the summit",
    "Visit to natural hot springs (optional)",
    "Incredible photo opportunities",
    "Learn about local geology and culture"
  ],
  inclusions: [
    "Hotel pickup and drop-off (selected hotels only)",
    "Professional English-speaking guide",
    "Breakfast at the summit",
    "Bottled water",
    "Flashlight/torch for pre-dawn climbing",
    "Local insurance"
  ],
  exclusions: [
    "Hot springs entrance fee (if option selected)",
    "Personal expenses",
    "Tips for guides",
    "Additional food and drinks"
  ],
  itinerary: [
    {
      time: "01:30 - 02:30",
      title: "Hotel Pickup",
      description: "Our driver will pick you up from your hotel in Ubud, Seminyak, Kuta, or Sanur areas."
    },
    {
      time: "03:30",
      title: "Arrival at Starting Point",
      description: "Arrive at the starting point in Toya Bungkah village. Meet your trekking guide and receive a safety briefing before beginning the climb."
    },
    {
      time: "03:45 - 05:45",
      title: "Trekking to the Summit",
      description: "Begin the trek to the summit. The path starts easy but becomes steeper as you ascend. Your guide will set a comfortable pace with rest stops along the way."
    },
    {
      time: "05:45 - 07:00",
      title: "Sunrise and Breakfast",
      description: "Reach the summit before sunrise. Witness the spectacular sunrise over Mount Abang, Mount Agung, and Lake Batur. Enjoy a simple breakfast prepared by your guide."
    },
    {
      time: "07:00 - 08:30",
      title: "Descent",
      description: "Begin the descent down the volcano. Your guide will take you on a slightly different route, showing you volcanic features and explaining the 2000 eruption."
    },
    {
      time: "08:30 - 09:30",
      title: "Optional Hot Springs Visit",
      description: "For those who selected this option, visit the natural hot springs by Lake Batur to soothe your muscles after the trek (additional fee)."
    },
    {
      time: "09:30 - 10:30",
      title: "Return to Hotel",
      description: "Your driver will take you back to your hotel."
    }
  ],
  faqs: [
    {
      question: "How difficult is the Mount Batur trek?",
      answer: "The trek is considered moderately challenging. It involves approximately 2 hours of uphill climbing on sometimes steep and uneven terrain. A reasonable level of fitness is recommended, but most people in good health can complete it."
    },
    {
      question: "What should I wear for the trek?",
      answer: "Wear comfortable athletic clothing in layers (it&apos;s cold before sunrise but warms up quickly), hiking shoes or sturdy sneakers with good grip, a light jacket or windbreaker, and a hat. Bring a small backpack for water and personal items."
    },
    {
      question: "Is this trek suitable for children?",
      answer: "The trek is suitable for children aged 10 and above who are used to walking and hiking. Children must be accompanied by an adult at all times."
    },
    {
      question: "What happens if there is bad weather?",
      answer: "In case of heavy rain or unsafe conditions, the trek may be rescheduled or canceled with a full refund. Light rain usually doesn't affect the trek, but visibility at sunrise may be reduced."
    }
  ],
  availableDates: [
    { date: "2025-06-10", price: 55, availability: "available" },
    { date: "2025-06-11", price: 55, availability: "available" },
    { date: "2025-06-12", price: 55, availability: "available" },
    { date: "2025-06-13", price: 55, availability: "available" },
    { date: "2025-06-14", price: 65, availability: "limited" },
    { date: "2025-06-15", price: 65, availability: "limited" },
    { date: "2025-06-16", price: 55, availability: "available" }
  ]
};

export default function ActivityDetail({ params }: { params: { id: string } }) {
  // Using params to get the activity ID
  const activityId = params.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <Image 
          src={activityData.images[0] || '/images/placeholder.jpg'} 
          alt={activityData.title}
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
            <Link href="/activities" className="text-white/70 hover:text-white transition-colors">
              Activities
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white">{activityData.title}</span>
          </nav>
        </div>

        {/* Activity Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                Activity
              </span>
              <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                Adventure
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{activityData.title}</h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl leading-relaxed">{activityData.description}</p>
            
            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <MapPin size={20} />
                </div>
                <span className="text-lg font-medium">{activityData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Clock size={20} />
                </div>
                <span className="text-lg font-medium">{activityData.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                </div>
                <span className="text-lg font-medium">{activityData.rating} ({activityData.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Users size={20} />
                </div>
                <span className="text-lg font-medium">Max {activityData.maxGuests} people</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bento-card p-0 overflow-hidden mb-8">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image 
                  src={activityData.images[selectedImage] || '/images/placeholder.jpg'} 
                  alt={activityData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {activityData.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative w-24 h-16 flex-shrink-0 cursor-pointer ${selectedImage === index ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image 
                      src={image || '/images/placeholder.jpg'} 
                      alt={`${activityData.title} - image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Tabs */}
            <div className="mb-8">
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-4">Activity Description</h2>
                    <p className="text-white/80 mb-6">{activityData.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {activityData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle size={16} className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-white/80">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-6">Activity Schedule</h2>
                    
                    <div className="space-y-6">
                      {activityData.itinerary.map((item, index) => (
                        <div key={index} className="border-l-2 border-primary-500 pl-6 pb-6 relative">
                          <div className="absolute w-4 h-4 bg-primary-500 rounded-full -left-[9px] top-0"></div>
                          <div className="text-sm text-primary-400 mb-1">{item.time}</div>
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          <p className="text-white/80">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Inclusions Tab */}
                <TabsContent value="inclusions" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-4">What&apos;s Included</h2>
                    <div className="mb-6">
                      {activityData.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-white/80">{inclusion}</p>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-4">What&apos;s Not Included</h2>
                    <div>
                      {activityData.exclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <CheckCircle size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-white/80">{exclusion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                    
                    {/* Google Reviews Sync */}
                    <div className="mb-8">
                      <GoogleReviewsSync 
                        itemType="activity"
                        itemId={activityData.id.toString()}
                        itemName={activityData.title}
                        autoSync={true}
                        syncInterval={300000} // 5 minutes
                        className="mb-6"
                      />
                    </div>
                    
                    {/* Existing Reviews Display */}
                    {activityData.reviewsList && activityData.reviewsList.length > 0 ? (
                      <div className="space-y-4 mb-8">
                        {activityData.reviewsList.map((review, index) => (
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
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mt-4 overflow-x-auto">
                                {review.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative w-20 h-20 flex-shrink-0">
                                    <Image 
                                      src={image} 
                                      alt={`Review image ${imgIndex + 1}`}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
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
                        itemType="activity"
                        itemId={activityData.id.toString()}
                        itemName={activityData.title}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* FAQs Tab */}
                <TabsContent value="faqs" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                      {activityData.faqs.map((faq, index) => (
                        <div key={index} className="border border-dark-700 rounded-lg overflow-hidden">
                          <button
                            className="flex justify-between items-center w-full p-4 text-left"
                            onClick={() => toggleFaq(index)}
                          >
                            <h3 className="font-medium">{faq.question}</h3>
                            {expandedFaqs.includes(index) ? (
                              <ChevronUp size={18} className="text-white/70" />
                            ) : (
                              <ChevronDown size={18} className="text-white/70" />
                            )}
                          </button>
                          {expandedFaqs.includes(index) && (
                            <div className="p-4 pt-0 text-white/80 border-t border-dark-700">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Booking and Price */}
          <div className="lg:col-span-1">
            <div className="bento-card sticky top-24">
              <div className="flex items-baseline mb-4">
                <h2 className="text-3xl font-bold">${activityData.discountPrice}</h2>
                {activityData.discountPrice < activityData.price && (
                  <span className="text-white/60 line-through ml-2">${activityData.price}</span>
                )}
                <span className="text-white/70 ml-2">per person</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Select Date</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                    {activityData.availableDates.map((dateOption) => (
                      <button
                        key={dateOption.date}
                        className={`flex justify-between items-center p-3 rounded-lg border ${
                          selectedDate === dateOption.date 
                            ? 'border-primary-500 bg-primary-900/20' 
                            : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                        } ${dateOption.availability === 'booked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => dateOption.availability !== 'booked' && setSelectedDate(dateOption.date)}
                        disabled={dateOption.availability === 'booked'}
                      >
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-white/70" />
                          <span>
                            {new Date(dateOption.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">${dateOption.price}</span>
                          <span className={`text-xs ${
                            dateOption.availability === 'limited' 
                              ? 'text-yellow-500' 
                              : dateOption.availability === 'booked' 
                                ? 'text-red-500' 
                                : 'text-green-500'
                          }`}>
                            {dateOption.availability === 'limited' 
                              ? 'Limited' 
                              : dateOption.availability === 'booked' 
                                ? 'Sold Out' 
                                : 'Available'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Number of Guests</label>
                  <div className="flex items-center border border-dark-700 bg-dark-800 rounded-lg">
                    <button 
                      className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">{guests}</div>
                    <button 
                      className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                      onClick={() => setGuests(Math.min(activityData.maxGuests, guests + 1))}
                      disabled={guests >= activityData.maxGuests}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Max {activityData.maxGuests} guests for this activity</p>
                </div>
              </div>

              <div className="border-t border-dark-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Base Price</span>
                  <span>${activityData.discountPrice} x {guests}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Taxes & Fees</span>
                  <span>${Math.round(activityData.discountPrice * guests * ((activityData as any).taxRate || 0.05))}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total</span>
                  <span>${Math.round(activityData.discountPrice * guests * (1 + ((activityData as any).taxRate || 0.05)))}</span>
                </div>
              </div>

              <Link 
                href={`/booking?type=activity&id=${activityData.id}`}
                className={`btn-primary w-full mb-4 block text-center ${!selectedDate ? 'opacity-70 pointer-events-none' : ''}`}
              >
                Book Now
              </Link>
              
              <button className="btn-secondary w-full">
                Inquire About This Activity
              </button>

              <div className="mt-6 text-sm text-white/60 flex items-center justify-center">
                <Users size={16} className="mr-2" />
                <span>{activityData.reviews} people booked this activity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Activities */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* This would be populated with ActivityCard components */}
            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/activities/ubud-cultural.jpg" 
                  alt="Ubud Cultural Tour"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Cultural
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Ubud Cultural Tour</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">Immerse yourself in Balinese culture with this comprehensive tour</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$45</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.7</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/activities/bali-swing.jpg" 
                  alt="Bali Swing Experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Adventure
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Bali Swing Experience</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">Soar high above the jungle canopy on Bali&apos;s famous swings</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$30</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.6</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/activities/white-water-rafting.jpg" 
                  alt="Ayung River Rafting"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Adventure
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Ayung River Rafting</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">Navigate thrilling rapids through stunning rainforest scenery</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$40</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
