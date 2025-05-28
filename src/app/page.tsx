import Link from "next/link";
import { Search, MapPin, Calendar, Users, ChevronRight, Star } from "lucide-react";
import BaliImage from "@/components/ui/BaliImage";

// Components
import HeroSearch from "@/components/home/HeroSearch";
import PackageCard from "@/components/packages/PackageCard";
import ActivityCard from "@/components/activities/ActivityCard";
import TestimonialCard from "@/components/home/TestimonialCard";

// Sample data for featured packages
const featuredPackages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    description: "7 days of pure romance in the island of gods",
    price: 899,
    rating: 4.9,
    reviews: 128,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    duration: "7 days",
  },
  {
    id: 2,
    title: "Bali Adventure Package",
    description: "Thrilling adventures across Bali's most exciting spots",
    price: 749,
    rating: 4.8,
    reviews: 96,
    image: "/images/packages/adventure.jpg",
    category: "adventure",
    duration: "5 days",
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    description: "Experience Bali's finest luxury resorts and spas",
    price: 1299,
    rating: 5.0,
    reviews: 64,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    duration: "6 days",
  },
  {
    id: 4,
    title: "Family Fun in Bali",
    description: "Create unforgettable memories with your loved ones",
    price: 849,
    rating: 4.7,
    reviews: 112,
    image: "/images/packages/family.jpg",
    category: "family",
    duration: "6 days",
  },
];

// Sample data for popular activities
const popularActivities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    description: "Witness a breathtaking sunrise from Bali's active volcano",
    price: 65,
    rating: 4.8,
    reviews: 320,
    image: "/images/activities/mount-batur.jpg",
    duration: "6 hours",
    category: "adventure",
  },
  {
    id: 2,
    title: "Ubud Cultural Tour",
    description: "Explore the cultural heart of Bali with local guides",
    price: 45,
    rating: 4.9,
    reviews: 215,
    image: "/images/activities/ubud-tour.jpg",
    duration: "8 hours",
    category: "cultural",
  },
  {
    id: 3,
    title: "Bali Swing Experience",
    description: "Soar high above the jungle canopy on giant swings",
    price: 35,
    rating: 4.7,
    reviews: 189,
    image: "/images/activities/bali-swing.jpg",
    duration: "3 hours",
    category: "adventure",
  },
  {
    id: 4,
    title: "Traditional Balinese Spa",
    description: "Indulge in authentic Balinese massage and treatments",
    price: 55,
    rating: 4.9,
    reviews: 276,
    image: "/images/activities/spa.jpg",
    duration: "2 hours",
    category: "wellness",
  },
  {
    id: 5,
    title: "Uluwatu Temple & Kecak Dance",
    description: "Visit the iconic sea temple and watch traditional fire dance",
    price: 40,
    rating: 4.8,
    reviews: 198,
    image: "/images/activities/uluwatu.jpg",
    duration: "4 hours",
    category: "cultural",
  },
  {
    id: 6,
    title: "Nusa Penida Island Tour",
    description: "Explore the stunning beaches and cliffs of Nusa Penida",
    price: 85,
    rating: 4.9,
    reviews: 245,
    image: "/images/activities/nusa-penida.jpg",
    duration: "10 hours",
    category: "adventure",
  },
];

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah & Michael",
    location: "Australia",
    image: "/images/testimonials/couple1.jpg",
    rating: 5,
    text: "Our honeymoon in Bali was absolutely perfect thanks to Bali Malayali. Every detail was taken care of, and we felt like royalty throughout our stay.",
    package: "Romantic Bali Honeymoon",
  },
  {
    id: 2,
    name: "The Patel Family",
    location: "India",
    image: "/images/testimonials/family1.jpg",
    rating: 5,
    text: "As an Indian family, we appreciated how Bali Malayali understood our preferences. The vegetarian food options and family-friendly activities were perfect!",
    package: "Family Fun in Bali",
  },
  {
    id: 3,
    name: "John Williams",
    location: "United States",
    image: "/images/testimonials/solo1.jpg",
    rating: 5,
    text: "The adventure package was exactly what I was looking for. The guides were knowledgeable, and the experiences were authentic and thrilling.",
    package: "Bali Adventure Package",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Overlay */}
      <div className="relative">
        <section className="relative h-screen w-full overflow-hidden">
          <BaliImage
            src="/images/bluebeach1.jpg"
            alt="Bali Paradise"
            fallbackText="Beautiful Bali"
            priority={true}
            className="object-cover w-full h-full"
          />
        </section>

        {/* Hero Content - Centered on hero image */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 md:mb-8">
                <h1 className="font-bold animate-slide-up">
                  <span className="text-white block text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight" style={{ fontFamily: 'Samona, sans-serif' }}>Discover Bali</span>
                  <span className="text-white/90 block text-sm sm:text-lg md:text-2xl lg:text-3xl mt-3 sm:mt-4">Your Adventure Awaits!</span>
                </h1>
              </div>
              <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Experience the magic of Bali with our tailor-made travel packages. From serene beaches to vibrant culture, we have something for every traveler.
              </p>
              
              {/* Hero Search */}
              <div className="w-full max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <HeroSearch />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      <section className="py-10 sm:py-16 md:py-20 bg-dark-900 relative z-10">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Featured Packages</h2>
              <p className="text-sm sm:text-base text-white/70">Handpicked experiences for your perfect Bali getaway</p>
            </div>
            <Link href="/packages" className="btn-primary text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4 flex items-center gap-1 sm:gap-2">
              View All <ChevronRight size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-hidden">
            {featuredPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="animate-slide-right" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PackageCard package={pkg} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gradient-to-br from-deepBlue-900 to-purple-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Bali Malayali</h2>
            <p className="text-white/70 max-w-2xl mx-auto">We're not just a travel agency, we're your personal guides to the best of Bali</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bento-card text-center p-8">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Service</h3>
              <p className="text-white/70">Tailored experiences based on your preferences and needs</p>
            </div>
            
            <div className="bento-card text-center p-8">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
              <p className="text-white/70">Insider knowledge from our team of local Balinese experts</p>
            </div>
            
            <div className="bento-card text-center p-8">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Options</h3>
              <p className="text-white/70">Customize any package or create your own dream itinerary</p>
            </div>
            
            <div className="bento-card text-center p-8">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-white/70">Round-the-clock assistance throughout your Bali journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Activities */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Activities</h2>
              <p className="text-white/70">Unforgettable experiences waiting for you in Bali</p>
            </div>
            <Link href="/activities" className="btn-primary flex items-center gap-2">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularActivities.slice(0, 6).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Real experiences from travelers who explored Bali with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-deepBlue-800/90 to-purple-900/90 z-10" />
        <BaliImage
          src="/images/bali-beach.jpg"
          alt="Bali Beach"
          fallbackText="Beautiful Bali Beach"
          category="beach"
          priority={false}
          className="object-cover"
        />
        <div className="relative z-20 container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Bali Adventure?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today and let's start planning your perfect Bali experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-3 text-lg">
              Contact Us
            </Link>
            <Link href="/packages" className="btn-secondary px-8 py-3 text-lg">
              Browse Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
