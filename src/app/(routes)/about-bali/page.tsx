'use client';

import Link from 'next/link';
import { Download, MapPin, Calendar, Info } from 'lucide-react';
import BaliImage from '@/components/ui/BaliImage';

export default function AboutBaliPage() {
  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] rounded-bento overflow-hidden mb-12">
          <BaliImage
            src="/images/about-bali-hero.jpg"
            alt="Beautiful Bali"
            fallbackText="Island of the Gods"
            category="culture"
            priority={true}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-dark-900/40 z-[1]" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-[2]">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up" style={{ fontFamily: 'Samona, sans-serif' }}>About Bali</h1>
            <div className="h-1 w-24 bg-primary-500 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover the island of gods - a paradise of stunning landscapes, rich culture, and unforgettable experiences
            </p>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bento-card p-6">
            <div className="flex items-center mb-3">
              <MapPin className="text-primary-500 mr-2" size={20} />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p className="text-white/70 text-sm">
              Indonesia, between Java and Lombok islands. 8° south of the equator.
            </p>
          </div>
          
          <div className="bento-card p-6">
            <div className="flex items-center mb-3">
              <Calendar className="text-primary-500 mr-2" size={20} />
              <h3 className="font-semibold">Best Time to Visit</h3>
            </div>
            <p className="text-white/70 text-sm">
              April to October (dry season). Peak seasons: July-August and December-January.
            </p>
          </div>
          
          <div className="bento-card p-6">
            <div className="flex items-center mb-3">
              <Info className="text-primary-500 mr-2" size={20} />
              <h3 className="font-semibold">Language</h3>
            </div>
            <p className="text-white/70 text-sm">
              Balinese and Indonesian. English is widely spoken in tourist areas.
            </p>
          </div>
          
          <div className="bento-card p-6">
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <h3 className="font-semibold">Currency</h3>
            </div>
            <p className="text-white/70 text-sm">
              Indonesian Rupiah (IDR). Credit cards accepted at most establishments.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 gradient-text">The Island of the Gods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white/80 mb-4">
                Bali, often called the Island of the Gods, is a paradise on earth that captivates visitors with its stunning landscapes, rich cultural heritage, and warm hospitality. Located in the Indonesian archipelago, this small island packs an incredible diversity of experiences within its shores.
              </p>
              <p className="text-white/80 mb-4">
                From the moment you arrive, you'll be enchanted by Bali's unique blend of natural beauty and spiritual depth. Terraced rice fields cascade down hillsides, pristine beaches stretch along the coastline, and ancient temples stand as testament to the island's deep-rooted Hindu traditions.
              </p>
              <p className="text-white/80">
                Whether you're seeking adventure, relaxation, cultural immersion, or spiritual awakening, Bali offers something for every traveler. Its magic lies not just in its physical beauty, but in the way it touches your soul and stays with you long after you've left its shores.
              </p>
            </div>
            <div className="relative h-80 rounded-bento overflow-hidden">
              <BaliImage
                src="/images/our-story.jpg"
                alt="Our Story"
                fallbackText="Bali Culture"
                category="culture"
                priority={false}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Regions of Bali */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Regions of Bali</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/ubud.jpg"
                  alt="Ubud"
                  fallbackText="Ubud Region"
                  category="culture"
                  priority={false}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Ubud</h3>
                <p className="text-white/70 text-sm mb-4">
                  The cultural heart of Bali, known for art, spirituality, lush rice terraces, and wellness retreats. Home to the Sacred Monkey Forest and numerous art galleries.
                </p>
                <Link href="/packages?region=ubud" className="text-primary-400 text-sm flex items-center">
                  Explore Ubud Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
            
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/seminyak.jpg"
                  alt="Seminyak"
                  fallbackText="Seminyak Region"
                  category="beach"
                  priority={false}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Seminyak & Kuta</h3>
                <p className="text-white/70 text-sm mb-4">
                  Vibrant beach areas with world-class dining, shopping, and nightlife. Kuta offers more budget-friendly options, while Seminyak is known for luxury resorts and beach clubs.
                </p>
                <Link href="/packages?region=seminyak-kuta" className="text-primary-400 text-sm flex items-center">
                  Explore Seminyak & Kuta Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
            
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/nusa-dua.jpg"
                  alt="Nusa Dua"
                  fallbackText="Nusa Dua Region"
                  category="beach"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Nusa Dua</h3>
                <p className="text-white/70 text-sm mb-4">
                  Upscale resort enclave with pristine beaches, luxury accommodations, and family-friendly activities. Perfect for those seeking a more secluded, refined experience.
                </p>
                <Link href="/packages?region=nusa-dua" className="text-primary-400 text-sm flex items-center">
                  Explore Nusa Dua Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
            
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/uluwatu.jpg"
                  alt="Uluwatu"
                  fallbackText="Uluwatu Region"
                  category="beach"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Uluwatu</h3>
                <p className="text-white/70 text-sm mb-4">
                  Dramatic clifftop area in the Bukit Peninsula, famous for surfing, the iconic sea temple, and stunning sunset views. Home to some of Bali's most Instagram-worthy beach clubs.
                </p>
                <Link href="/packages?region=uluwatu" className="text-primary-400 text-sm flex items-center">
                  Explore Uluwatu Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
            
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/canggu.jpg"
                  alt="Canggu"
                  fallbackText="Canggu Region"
                  category="beach"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Canggu</h3>
                <p className="text-white/70 text-sm mb-4">
                  Trendy beach town with a laid-back vibe, popular among digital nomads and surfers. Known for its hip cafes, co-working spaces, and black sand beaches.
                </p>
                <Link href="/packages?region=canggu" className="text-primary-400 text-sm flex items-center">
                  Explore Canggu Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
            
            <div className="bento-card overflow-hidden">
              <div className="relative h-48">
                <BaliImage
                  src="/images/regions/north-bali.jpg"
                  alt="North Bali"
                  fallbackText="North Bali Region"
                  category="adventure"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">North & East Bali</h3>
                <p className="text-white/70 text-sm mb-4">
                  Less-visited regions offering a glimpse of traditional Balinese life, black sand beaches, excellent diving spots, and majestic mountain scenery.
                </p>
                <Link href="/packages?region=north-east" className="text-primary-400 text-sm flex items-center">
                  Explore North & East Bali Packages
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Balinese Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Balinese Culture & Traditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <p className="text-white/80 mb-4">
                Bali's unique culture is a tapestry of Hindu-Buddhist traditions, ancient rituals, and artistic expressions that permeate every aspect of daily life. Unlike the rest of predominantly Muslim Indonesia, Bali maintains its distinct Hindu heritage, creating a spiritual atmosphere that's palpable throughout the island.
              </p>
              <p className="text-white/80 mb-4">
                The Balinese calendar is filled with religious ceremonies and festivals, with temples coming alive with colorful decorations, music, and dance performances. The concept of Tri Hita Karana—harmony between humans, nature, and the divine—guides the Balinese way of life.
              </p>
              <p className="text-white/80 mb-4">
                Art is inseparable from religion in Bali, with traditional painting, wood carving, stone sculpting, and dance all serving as forms of devotion. Each village typically specializes in a particular craft, passed down through generations.
              </p>
              <p className="text-white/80">
                Visitors are welcome to observe and even participate in many ceremonies, though proper attire (a sarong and sash) and respectful behavior are essential when visiting temples and attending religious events.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="bento-card overflow-hidden h-full">
                <div className="relative h-48">
                  <BaliImage
                    src="/images/balinese-ceremony.jpg"
                    alt="Balinese Ceremony"
                    fallbackText="Balinese Culture"
                    category="culture"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Key Cultural Experiences</h3>
                  <ul className="text-white/70 text-sm space-y-2">
                    <li>• Attending a traditional Balinese dance performance</li>
                    <li>• Visiting ancient temples like Besakih or Tanah Lot</li>
                    <li>• Participating in a purification ceremony at Tirta Empul</li>
                    <li>• Learning traditional crafts like batik or silver making</li>
                    <li>• Experiencing a Balinese cooking class</li>
                    <li>• Witnessing a traditional cremation ceremony (if available)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Essential Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-4">Before You Go</h3>
              <ul className="text-white/80 space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Check visa requirements - most nationalities get 30 days visa-free</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Pack light, breathable clothing and modest attire for temple visits</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Bring sunscreen, insect repellent, and a reusable water bottle</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Exchange some currency before arrival or at the airport</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Consider travel insurance that covers activities like surfing and scooter riding</span>
                </li>
              </ul>
            </div>
            
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-4">While in Bali</h3>
              <ul className="text-white/80 space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Stay hydrated and be cautious with street food and tap water</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Respect local customs and dress modestly at temples (sarongs are often provided)</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Bargain politely at markets, but remember fair pricing supports locals</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Use ride-hailing apps or pre-arranged transport for convenience and fair pricing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 mr-2 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Be cautious when riding scooters and always wear a helmet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Travel Guide */}
        <div className="bg-gradient-to-r from-deepBlue-800 to-purple-900 rounded-bento p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Download Our Bali Travel Guide</h2>
              <p className="text-white/80 max-w-xl">
                Get our comprehensive Bali travel guide with detailed information about destinations, 
                cultural insights, practical tips, and much more. Perfect for planning your trip!
              </p>
            </div>
            <button className="btn-primary flex items-center">
              <Download size={18} className="mr-2" />
              Download PDF Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
