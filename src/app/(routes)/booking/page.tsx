'use client';

import { useState, useEffect } from 'react';
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

export default function BookingPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'package';
  const id = searchParams.get('id');
  
  const [bookingItem, setBookingItem] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    // For now, we'll use our sample data
    setLoading(true);
    
    try {
      if (type === 'package' && id) {
        const pkg = packages.find(p => p.id.toString() === id);
        if (pkg) {
          setBookingItem({
            ...pkg,
            type: 'package'
          });
        } else {
          setError('Package not found');
        }
      } else if (type === 'activity' && id) {
        const activity = activities.find(a => a.id.toString() === id);
        if (activity) {
          setBookingItem({
            ...activity,
            type: 'activity'
          });
        } else {
          setError('Activity not found');
        }
      } else {
        setError('Invalid booking type or ID');
      }
    } catch {
      setError('An error occurred while loading the booking information');
    } finally {
      setLoading(false);
    }
  }, [type, id]);

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="text-sm text-white/60 mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link> {' / '}
          {type === 'package' ? (
            <>
              <Link href="/packages" className="hover:text-primary-500">Packages</Link> {' / '}
              {bookingItem && (
                <>
                  <Link href={`/packages/${id}`} className="hover:text-primary-500">{bookingItem.title}</Link> {' / '}
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/activities" className="hover:text-primary-500">Activities</Link> {' / '}
              {bookingItem && (
                <>
                  <Link href={`/activities/${id}`} className="hover:text-primary-500">{bookingItem.title}</Link> {' / '}
                </>
              )}
            </>
          )}
          <span className="text-white">Booking</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bento-card p-8 text-center">
                <p className="text-white/70">Loading booking information...</p>
              </div>
            ) : error ? (
              <div className="bento-card p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/" className="btn-primary">
                  Return to Homepage
                </Link>
              </div>
            ) : bookingItem ? (
              <BookingForm
                packageId={type === 'package' ? bookingItem.id : undefined}
                activityId={type === 'activity' ? bookingItem.id : undefined}
                title={bookingItem.title}
                price={bookingItem.discountPrice || bookingItem.price}
                type={bookingItem.type}
                maxGuests={bookingItem.maxGuests}
                availableDates={bookingItem.availableDates}
              />
            ) : null}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            {!loading && !error && bookingItem && (
              <div className="bento-card sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src={bookingItem.image || '/images/placeholder.jpg'} 
                    alt={bookingItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-1">{bookingItem.title}</h3>
                <p className="text-white/70 text-sm mb-4">{bookingItem.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Category:</span>
                    <span className="font-medium">{bookingItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="font-medium">{bookingItem.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Price:</span>
                    <div>
                      <span className="font-medium">${bookingItem.discountPrice || bookingItem.price}</span>
                      {bookingItem.discountPrice && bookingItem.discountPrice < bookingItem.price && (
                        <span className="text-white/60 line-through ml-2">${bookingItem.price}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-dark-700 pt-4">
                  <p className="text-white/70 text-sm">
                    Need help with your booking? Contact our support team at <a href="mailto:support@balimalayali.com" className="text-primary-500 hover:underline">support@balimalayali.com</a> or call us at <a href="tel:+6281234567890" className="text-primary-500 hover:underline">+62 812-3456-7890</a>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
