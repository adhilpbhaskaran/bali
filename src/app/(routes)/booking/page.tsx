'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BookingForm from '@/components/booking/BookingForm';

// Sample data for packages and activities
const packages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    description: "7 days of pure romance in the island of gods",
    price: 899,
    discountPrice: 799,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    duration: "7 days / 6 nights",
    maxGuests: 2,
    availableDates: [
      { date: "2025-06-15", price: 799, availability: "available" },
      { date: "2025-06-22", price: 799, availability: "available" },
      { date: "2025-06-29", price: 849, availability: "limited" },
      { date: "2025-07-06", price: 899, availability: "available" },
      { date: "2025-07-13", price: 899, availability: "available" },
      { date: "2025-07-20", price: 949, availability: "limited" },
      { date: "2025-07-27", price: 949, availability: "booked" }
    ]
  },
  {
    id: 2,
    title: "Bali Adventure Package",
    description: "5 days of thrilling adventures across Bali's most exciting locations",
    price: 749,
    discountPrice: 699,
    image: "/images/packages/adventure.jpg",
    category: "adventure",
    duration: "5 days / 4 nights",
    maxGuests: 4,
    availableDates: [
      { date: "2025-06-10", price: 699, availability: "available" },
      { date: "2025-06-17", price: 699, availability: "available" },
      { date: "2025-06-24", price: 749, availability: "limited" },
      { date: "2025-07-01", price: 799, availability: "available" },
      { date: "2025-07-08", price: 799, availability: "available" }
    ]
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    description: "6 days of pure luxury and relaxation in Bali's finest resorts",
    price: 1299,
    discountPrice: 1199,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    duration: "6 days / 5 nights",
    maxGuests: 2,
    availableDates: [
      { date: "2025-06-12", price: 1199, availability: "available" },
      { date: "2025-06-19", price: 1199, availability: "available" },
      { date: "2025-06-26", price: 1299, availability: "limited" },
      { date: "2025-07-03", price: 1399, availability: "available" }
    ]
  }
];

const activities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    description: "Experience a magical sunrise from the top of an active volcano",
    price: 65,
    discountPrice: 55,
    image: "/images/activities/mount-batur.jpg",
    category: "adventure",
    duration: "6 hours",
    maxGuests: 10,
    availableDates: [
      { date: "2025-06-10", price: 55, availability: "available" },
      { date: "2025-06-11", price: 55, availability: "available" },
      { date: "2025-06-12", price: 55, availability: "available" },
      { date: "2025-06-13", price: 55, availability: "available" },
      { date: "2025-06-14", price: 65, availability: "limited" },
      { date: "2025-06-15", price: 65, availability: "limited" }
    ]
  },
  {
    id: 2,
    title: "Ubud Cultural Tour",
    description: "Immerse yourself in Balinese culture with this comprehensive tour",
    price: 45,
    discountPrice: 45,
    image: "/images/activities/ubud-cultural.jpg",
    category: "cultural",
    duration: "8 hours",
    maxGuests: 15,
    availableDates: [
      { date: "2025-06-10", price: 45, availability: "available" },
      { date: "2025-06-12", price: 45, availability: "available" },
      { date: "2025-06-14", price: 45, availability: "available" },
      { date: "2025-06-16", price: 45, availability: "available" },
      { date: "2025-06-18", price: 45, availability: "available" }
    ]
  },
  {
    id: 3,
    title: "Bali Swing Experience",
    description: "Soar high above the jungle canopy on Bali's famous swings",
    price: 35,
    discountPrice: 30,
    image: "/images/activities/bali-swing.jpg",
    category: "adventure",
    duration: "3 hours",
    maxGuests: 20,
    availableDates: [
      { date: "2025-06-10", price: 30, availability: "available" },
      { date: "2025-06-11", price: 30, availability: "available" },
      { date: "2025-06-12", price: 30, availability: "available" },
      { date: "2025-06-13", price: 30, availability: "available" },
      { date: "2025-06-14", price: 35, availability: "available" },
      { date: "2025-06-15", price: 35, availability: "available" }
    ]
  }
];

// Wrap the component that uses useSearchParams in Suspense
function BookingContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'package';
  const id = searchParams.get('id');
  
  const [bookingItem, setBookingItem] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Find the selected package or activity
    if (type === 'package' && id) {
      const selectedPackage = packages.find(p => p.id.toString() === id);
      if (selectedPackage) {
        setBookingItem(selectedPackage);
      } else {
        setError('Package not found');
      }
    } else if (type === 'activity' && id) {
      const selectedActivity = activities.find(a => a.id.toString() === id);
      if (selectedActivity) {
        setBookingItem(selectedActivity);
      } else {
        setError('Activity not found');
      }
    } else {
      setError('Invalid booking type or ID');
    }
    
    setLoading(false);
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !bookingItem) {
    return (
      <div className="container-custom py-16">
        <div className="bento-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Error</h2>
          <p className="text-white/70 mb-6">{error || 'Unable to load booking information'}</p>
          <Link href="/packages" className="btn-primary">
            Browse Packages
          </Link>
        </div>
      </div>
    );
  }

  const item = bookingItem as any;

  return (
    <div className="container-custom py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Item Details */}
        <div className="lg:col-span-2">
          <div className="bento-card overflow-hidden">
            <div className="relative h-64 sm:h-80">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>
                <div>
                  {item.discountPrice < item.price ? (
                    <div className="text-right">
                      <span className="text-white/50 line-through mr-2">${item.price}</span>
                      <span className="text-2xl font-bold text-primary">${item.discountPrice}</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-primary">${item.price}</span>
                  )}
                  <p className="text-sm text-white/60">per person</p>
                </div>
              </div>
              
              <p className="text-white/80 mb-6">{item.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-primary">⏱</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">👥</span>
                  <span>Max {item.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">🏷️</span>
                  <span className="capitalize">{item.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="lg:col-span-1">
          <BookingForm item={item} type={type} />
        </div>
      </div>
    </div>
  );
}

// Main component that wraps BookingContent with Suspense
export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
