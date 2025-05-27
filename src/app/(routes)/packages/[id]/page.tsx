'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

// Sample package data
const packageData = {
  id: 1,
  title: "Romantic Bali Honeymoon",
  description: "Experience the perfect romantic getaway in the island of gods. This 7-day package is designed for couples who want to create unforgettable memories in Bali's most romantic settings.",
  price: 899,
  discountPrice: 799,
  rating: 4.9,
  reviews: 128,
  duration: "7 days / 6 nights",
  category: "honeymoon",
  location: "Bali, Indonesia",
  maxGuests: 2,
  images: [
    "/images/packages/honeymoon-1.jpg",
    "/images/packages/honeymoon-2.jpg",
    "/images/packages/honeymoon-3.jpg",
    "/images/packages/honeymoon-4.jpg",
  ],
  highlights: [
    "Private candlelit dinner on Jimbaran Beach",
    "Couple's spa treatment in a luxury resort",
    "Romantic sunset cruise along the coast",
    "Private villa with pool in Ubud",
    "Guided tour of Bali's most picturesque locations",
    "Professional photoshoot at scenic spots"
  ],
  inclusions: [
    "6 nights accommodation in luxury hotels/villas",
    "Daily breakfast and selected meals",
    "Private airport transfers",
    "All transportation within Bali",
    "English-speaking guide",
    "All activities and entrance fees as per itinerary",
    "Couple's spa treatment",
    "Romantic dinner on the beach",
    "Sunset cruise"
  ],
  exclusions: [
    "International flights",
    "Travel insurance",
    "Personal expenses",
    "Additional meals not mentioned in inclusions",
    "Optional activities not in the itinerary"
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival & Welcome",
      description: "Arrive at Ngurah Rai International Airport where our representative will meet you. Transfer to your luxury villa in Seminyak. Enjoy a welcome drink and rest. In the evening, experience a romantic dinner by the beach as the sun sets.",
      accommodation: "Luxury Villa in Seminyak",
      meals: "Dinner"
    },
    {
      day: 2,
      title: "Seminyak Exploration",
      description: "After breakfast, spend the morning at leisure by your private pool. In the afternoon, explore the trendy streets of Seminyak with its boutique shops and cafes. Enjoy a couple's spa treatment in the evening.",
      accommodation: "Luxury Villa in Seminyak",
      meals: "Breakfast, Dinner"
    },
    {
      day: 3,
      title: "Ubud Transfer & Cultural Experience",
      description: "Check out and transfer to Ubud. On the way, visit the sacred Monkey Forest and Tegalalang Rice Terraces. Check into your private pool villa in Ubud. Evening at leisure to explore Ubud's charming streets.",
      accommodation: "Private Pool Villa in Ubud",
      meals: "Breakfast, Lunch"
    },
    {
      day: 4,
      title: "Ubud Art & Culture",
      description: "Visit Ubud's art galleries and the Royal Palace. Participate in a private Balinese cooking class together. Afternoon at leisure. In the evening, watch a traditional Balinese dance performance.",
      accommodation: "Private Pool Villa in Ubud",
      meals: "Breakfast, Lunch"
    },
    {
      day: 5,
      title: "Batur Sunrise & Hot Springs",
      description: "Early morning trek to Mount Batur to witness a breathtaking sunrise (optional). Relax in natural hot springs afterward. Return to the villa for rest. Evening photoshoot at scenic locations around Ubud.",
      accommodation: "Private Pool Villa in Ubud",
      meals: "Breakfast, Packed Lunch"
    },
    {
      day: 6,
      title: "Transfer to Jimbaran",
      description: "Check out and transfer to Jimbaran. Visit Uluwatu Temple and watch the famous Kecak dance with the sunset as backdrop. Check into your beachfront resort. Special romantic candlelit dinner on Jimbaran Beach.",
      accommodation: "Beachfront Resort in Jimbaran",
      meals: "Breakfast, Special Dinner"
    },
    {
      day: 7,
      title: "Departure",
      description: "Free morning to enjoy the beach or last-minute shopping. Transfer to the airport for your departure flight. End of services.",
      accommodation: "None",
      meals: "Breakfast"
    }
  ],
  faqs: [
    {
      question: "What is the best time to visit Bali for a honeymoon?",
      answer: "The best time for a honeymoon in Bali is during the dry season from April to October. This period offers sunny days and lower humidity, perfect for outdoor activities and beach time."
    },
    {
      question: "Can we customize this package?",
      answer: "Yes, this package can be customized to suit your preferences. You can add or remove activities, upgrade accommodations, or extend your stay. Please contact our travel consultants for personalized adjustments."
    },
    {
      question: "Is this package suitable for non-honeymooners?",
      answer: "While this package is designed with romantic experiences for couples, it can also be enjoyed by any two people traveling together who appreciate luxury and relaxation."
    },
    {
      question: "What type of clothing should we pack?",
      answer: "Bali has a tropical climate, so light, breathable clothing is recommended. For temple visits, modest attire covering shoulders and knees is required. Don't forget swimwear, a light jacket for evenings, and comfortable walking shoes."
    }
  ],
  availableDates: [
    { date: "2025-06-15", price: 799, availability: "available" },
    { date: "2025-06-22", price: 799, availability: "available" },
    { date: "2025-06-29", price: 849, availability: "limited" },
    { date: "2025-07-06", price: 899, availability: "available" },
    { date: "2025-07-13", price: 899, availability: "available" },
    { date: "2025-07-20", price: 949, availability: "limited" },
    { date: "2025-07-27", price: 949, availability: "booked" }
  ]
};

export default function PackageDetailPage() {
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
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="text-sm text-white/60 mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link> {' / '}
          <Link href="/packages" className="hover:text-primary-500">Packages</Link> {' / '}
          <span className="text-white">{packageData.title}</span>
        </div>

        {/* Package Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{packageData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {packageData.location}
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                {packageData.duration}
              </div>
              <div className="flex items-center">
                <Star size={14} className="mr-1 text-yellow-500" />
                <span className="text-white">{packageData.rating}</span>
                <span className="ml-1">({packageData.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="p-2 rounded-full bg-dark-800 hover:bg-dark-700" title="Save to wishlist">
              <Heart size={20} className="text-white/70" />
            </button>
            <button className="p-2 rounded-full bg-dark-800 hover:bg-dark-700" title="Share">
              <Share2 size={20} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bento-card p-0 overflow-hidden mb-8">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image 
                  src={packageData.images[selectedImage] || '/images/placeholder.jpg'} 
                  alt={packageData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {packageData.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative w-24 h-16 flex-shrink-0 cursor-pointer ${selectedImage === index ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image 
                      src={image || '/images/placeholder.jpg'} 
                      alt={`${packageData.title} - image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Package Tabs */}
            <div className="mb-8">
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-4">Package Description</h2>
                    <p className="text-white/80 mb-6">{packageData.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {packageData.highlights.map((highlight, index) => (
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
                    <h2 className="text-xl font-semibold mb-6">Your 7-Day Journey</h2>
                    
                    <div className="space-y-6">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="border-l-2 border-primary-500 pl-6 pb-6 relative">
                          <div className="absolute w-4 h-4 bg-primary-500 rounded-full -left-[9px] top-0"></div>
                          <h3 className="text-lg font-semibold mb-1">Day {day.day}: {day.title}</h3>
                          <p className="text-white/80 mb-3">{day.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="text-white/60">
                              <span className="font-medium text-white">Accommodation:</span> {day.accommodation}
                            </div>
                            <div className="text-white/60">
                              <span className="font-medium text-white">Meals:</span> {day.meals}
                            </div>
                          </div>
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
                      {packageData.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-white/80">{inclusion}</p>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-xl font-semibold mb-4">What&apos;s Not Included</h2>
                    <div>
                      {packageData.exclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <CheckCircle size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-white/80">{exclusion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* FAQs Tab */}
                <TabsContent value="faqs" className="space-y-6">
                  <div className="bento-card">
                    <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                      {packageData.faqs.map((faq, index) => (
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
                <h2 className="text-3xl font-bold">${packageData.discountPrice}</h2>
                {packageData.discountPrice < packageData.price && (
                  <span className="text-white/60 line-through ml-2">${packageData.price}</span>
                )}
                <span className="text-white/70 ml-2">per person</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Select Date</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                    {packageData.availableDates.map((dateOption) => (
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
                      onClick={() => setGuests(Math.min(packageData.maxGuests, guests + 1))}
                      disabled={guests >= packageData.maxGuests}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Max {packageData.maxGuests} guests for this package</p>
                </div>
              </div>

              <div className="border-t border-dark-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Base Price</span>
                  <span>${packageData.discountPrice} x {guests}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Taxes & Fees</span>
                  <span>${Math.round(packageData.discountPrice * guests * 0.1)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total</span>
                  <span>${Math.round(packageData.discountPrice * guests * 1.1)}</span>
                </div>
              </div>

              <button 
                className={`btn-primary w-full mb-4 ${!selectedDate ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={!selectedDate}
              >
                Book Now
              </button>
              
              <button className="btn-secondary w-full">
                Inquire About This Package
              </button>

              <div className="mt-6 text-sm text-white/60 flex items-center justify-center">
                <Users size={16} className="mr-2" />
                <span>{packageData.reviews} people booked this package</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* This would be populated with PackageCard components */}
            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/packages/adventure.jpg" 
                  alt="Bali Adventure Package"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Adventure
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Bali Adventure Package</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">5 days of thrilling adventures across Bali&apos;s most exciting locations</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$749</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/packages/luxury.jpg" 
                  alt="Luxury Bali Retreat"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Luxury
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Luxury Bali Retreat</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">6 days of pure luxury and relaxation in Bali&apos;s finest resorts</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$1299</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card p-0 overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src="/images/packages/family.jpg" 
                  alt="Family Fun in Bali"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Family
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">Family Fun in Bali</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">6 days of family-friendly activities and accommodations</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">$849</span>
                    <span className="text-white/60 text-sm"> / person</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500" />
                    <span className="ml-1 text-sm">4.7</span>
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
