'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Award, Users, Clock } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="relative h-80 md:h-96 rounded-bento overflow-hidden mb-12">
          <Image
            src="/images/about-us-hero.jpg"
            alt="Bali Malayali Team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-dark-900/40" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Your trusted partner for premium Bali experiences, curated by people who understand you
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white/80 mb-4">
                Bali Malayali was born from a deep love for Bali and a passion for creating meaningful travel experiences. Founded in 2018 by a group of travel enthusiasts from Kerala, India, our journey began when we discovered the magical similarities between Bali's rich culture and our own heritage.
              </p>
              <p className="text-white/80 mb-4">
                What started as a small operation helping friends and family explore Bali has grown into a full-service destination management company. We've maintained our personal touch while expanding our offerings to serve travelers from around the world.
              </p>
              <p className="text-white/80">
                Our name "Bali Malayali" represents the bridge we've built between Bali and our Kerala roots. As Malayalis (people from Kerala) who fell in love with Bali, we bring a unique perspective that combines deep local knowledge with an understanding of what makes a truly memorable journey.
              </p>
            </div>
            <div className="relative h-80 rounded-bento overflow-hidden">
              <Image
                src="/images/our-story.jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Founder 1 */}
            <div className="bento-card overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/team/founder1.jpg"
                  alt="Rahul Menon"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Rahul Menon</h3>
                <p className="text-primary-400 text-sm mb-3">Founder & CEO</p>
                <p className="text-white/70 text-sm mb-4">
                  A travel enthusiast with over 15 years of experience in the tourism industry. Rahul's vision and leadership have been instrumental in establishing Bali Malayali as a trusted name in premium travel experiences.
                </p>
                <div className="flex space-x-3">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="mailto:rahul@balimalayali.com" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bento-card overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/team/founder2.jpg"
                  alt="Priya Nair"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Priya Nair</h3>
                <p className="text-primary-400 text-sm mb-3">Co-Founder & Operations Director</p>
                <p className="text-white/70 text-sm mb-4">
                  With a background in hospitality management, Priya ensures that every Bali Malayali experience exceeds expectations. Her attention to detail and commitment to excellence are evident in every package we offer.
                </p>
                <div className="flex space-x-3">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="mailto:priya@balimalayali.com" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Founder 3 */}
            <div className="bento-card overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/team/founder3.jpg"
                  alt="Made Wayan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Made Wayan</h3>
                <p className="text-primary-400 text-sm mb-3">Local Experiences Director</p>
                <p className="text-white/70 text-sm mb-4">
                  Born and raised in Bali, Made brings authentic local knowledge and connections to our team. His deep understanding of Balinese culture ensures our guests experience the true essence of the island.
                </p>
                <div className="flex space-x-3">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="mailto:made@balimalayali.com" className="text-white/60 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card p-6 text-center">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-white/70">
                We're committed to delivering exceptional experiences that exceed expectations. From the moment you contact us to the end of your journey, we strive for excellence in every detail.
              </p>
            </div>
            
            <div className="bento-card p-6 text-center">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-white/70">
                We believe in showcasing the real Bali, beyond the tourist hotspots. Our deep local connections allow us to offer authentic experiences that honor Balinese culture and traditions.
              </p>
            </div>
            
            <div className="bento-card p-6 text-center">
              <div className="bg-primary-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-primary-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalization</h3>
              <p className="text-white/70">
                We understand that every traveler is unique. That's why we take the time to understand your preferences and create customized experiences that reflect your interests and travel style.
              </p>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 rounded-bento overflow-hidden">
              <Image
                src="/images/what-sets-us-apart.jpg"
                alt="Bali Malayali Experience"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary-600/20 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cultural Bridge</h3>
                    <p className="text-white/70 text-sm">Our unique perspective as Malayalis who understand both Indian and Balinese cultures allows us to create experiences that resonate with travelers from diverse backgrounds.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-600/20 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Local Expertise</h3>
                    <p className="text-white/70 text-sm">Our team includes Balinese locals who provide insider knowledge and access to hidden gems that most tourists never discover.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-600/20 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Personalized Service</h3>
                    <p className="text-white/70 text-sm">We maintain a high staff-to-client ratio to ensure personalized attention throughout your journey. Your dedicated travel consultant is always available to assist you.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary-600/20 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sustainable Tourism</h3>
                    <p className="text-white/70 text-sm">We're committed to responsible travel practices that respect Bali's environment and culture. We partner with local communities and support conservation efforts.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-deepBlue-800 to-purple-900 rounded-bento p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-white/80 mb-6">
                We'd love to hear from you and help plan your perfect Bali experience. 
                Reach out to us through any of the following channels:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Our Office</h3>
                    <p className="text-white/70">Jl. Sunset Road No. 88, Seminyak, Kuta, Bali 80361, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-white/70">+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-white/70">info@balimalayali.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Link href="/contact" className="btn-primary px-8 py-3 text-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
