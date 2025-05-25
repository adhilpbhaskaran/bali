'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard, 
  FileText, 
  Download,
  Star,
  MessageSquare
} from 'lucide-react';

// Sample booking data
const upcomingBookings = [
  {
    id: 'BK-2025-001',
    title: 'Romantic Bali Honeymoon',
    type: 'package',
    image: '/images/packages/honeymoon.jpg',
    startDate: '2025-06-15',
    endDate: '2025-06-22',
    duration: '7 days',
    guests: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 1798,
    location: 'Bali, Indonesia'
  }
];

const pastBookings = [
  {
    id: 'BK-2024-045',
    title: 'Mount Batur Sunrise Trek',
    type: 'activity',
    image: '/images/activities/mount-batur.jpg',
    date: '2024-12-10',
    duration: '6 hours',
    guests: 2,
    status: 'completed',
    paymentStatus: 'paid',
    amount: 110,
    location: 'Kintamani, Bali',
    hasReview: true,
    rating: 5
  },
  {
    id: 'BK-2024-032',
    title: 'Ubud Cultural Tour',
    type: 'activity',
    image: '/images/activities/ubud-cultural.jpg',
    date: '2024-12-08',
    duration: '8 hours',
    guests: 2,
    status: 'completed',
    paymentStatus: 'paid',
    amount: 90,
    location: 'Ubud, Bali',
    hasReview: true,
    rating: 4
  },
  {
    id: 'BK-2024-018',
    title: 'Luxury Bali Retreat',
    type: 'package',
    image: '/images/packages/luxury.jpg',
    startDate: '2024-08-12',
    endDate: '2024-08-18',
    duration: '6 days',
    guests: 1,
    status: 'completed',
    paymentStatus: 'paid',
    amount: 1199,
    location: 'Bali, Indonesia',
    hasReview: false
  }
];

const cancelledBookings = [
  {
    id: 'BK-2024-022',
    title: 'Bali Swing Experience',
    type: 'activity',
    image: '/images/activities/bali-swing.jpg',
    date: '2024-09-15',
    duration: '3 hours',
    guests: 2,
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: 60,
    refundAmount: 54, // 90% refund
    location: 'Ubud, Bali',
    cancellationReason: 'Weather conditions'
  }
];

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="bento-card">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">My Bookings</h2>
      
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-4 sm:mb-6 w-full overflow-x-auto no-scrollbar">
          <TabsTrigger value="upcoming" className="whitespace-nowrap text-xs sm:text-sm">
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="ml-1 sm:ml-2 bg-primary-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {upcomingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="whitespace-nowrap text-xs sm:text-sm">Past</TabsTrigger>
          <TabsTrigger value="cancelled" className="whitespace-nowrap text-xs sm:text-sm">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <div key={booking.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                  <div className="relative h-40 sm:h-48 md:h-auto">
                    <Image 
                      src={booking.image} 
                      alt={booking.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={true}
                    />
                  </div>
                  <div className="p-3 sm:p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1">{booking.title}</h3>
                        <div className="flex items-center text-white/70 text-xs sm:text-sm mb-2 sm:mb-4">
                          <MapPin size={12} className="mr-1" />
                          {booking.location}
                        </div>
                      </div>
                      <div className="px-2 sm:px-3 py-1 bg-green-900/30 text-green-400 text-xs sm:text-sm rounded-full">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Booking ID</p>
                        <p className="font-medium text-xs sm:text-sm">{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Date</p>
                        <p className="font-medium text-xs sm:text-sm">
                          {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Duration</p>
                        <p className="font-medium text-xs sm:text-sm">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Guests</p>
                        <p className="font-medium text-xs sm:text-sm">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-dark-700 pt-3 sm:pt-4">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-white/60 text-xs mb-1">Total Amount</p>
                        <p className="text-lg sm:text-xl font-semibold">${booking.amount}</p>
                        <p className="text-green-400 text-xs">{booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/booking/${booking.id}/details`} className="btn-secondary flex items-center text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3">
                          <FileText size={12} className="mr-1 sm:mr-2" />
                          View Details
                        </Link>
                        <Link href={`/booking/${booking.id}/voucher`} className="btn-primary flex items-center text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3">
                          <Download size={12} className="mr-1 sm:mr-2" />
                          Download Voucher
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-white/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
              <p className="text-white/70 mb-6">You don't have any upcoming trips or activities scheduled.</p>
              <Link href="/packages" className="btn-primary">
                Browse Packages
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-6">
          {pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <div key={booking.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative h-48 md:h-auto">
                    <Image 
                      src={booking.image} 
                      alt={booking.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{booking.title}</h3>
                        <div className="flex items-center text-white/70 text-sm mb-4">
                          <MapPin size={14} className="mr-1" />
                          {booking.location}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Booking ID</p>
                        <p className="font-medium">{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Date</p>
                        <p className="font-medium">
                          {booking.type === 'package' ? (
                            <>
                              {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'N/A'}
                            </>
                          ) : (
                            booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Duration</p>
                        <p className="font-medium">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Guests</p>
                        <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-dark-700 pt-4">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-white/60 text-xs mb-1">Total Amount</p>
                        <p className="text-xl font-semibold">${booking.amount}</p>
                        <p className="text-green-400 text-xs">{booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/booking/${booking.id}/details`} className="btn-secondary flex items-center text-sm">
                          <FileText size={14} className="mr-2" />
                          View Details
                        </Link>
                        {booking.hasReview ? (
                          <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                className={i < (booking.rating || 0) ? 'fill-yellow-500' : 'text-white/30'} 
                              />
                            ))}
                          </div>
                        ) : (
                          <Link href={`/reviews/write?booking=${booking.id}`} className="btn-primary flex items-center text-sm">
                            <MessageSquare size={14} className="mr-2" />
                            Write Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-white/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No past bookings</h3>
              <p className="text-white/70 mb-6">You haven't completed any trips or activities yet.</p>
              <Link href="/packages" className="btn-primary">
                Browse Packages
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-6">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map(booking => (
              <div key={booking.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative h-48 md:h-auto">
                    <Image 
                      src={booking.image} 
                      alt={booking.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{booking.title}</h3>
                        <div className="flex items-center text-white/70 text-sm mb-4">
                          <MapPin size={14} className="mr-1" />
                          {booking.location}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-red-900/30 text-red-400 text-sm rounded-full">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Booking ID</p>
                        <p className="font-medium">{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Date</p>
                        <p className="font-medium">
                          {booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Duration</p>
                        <p className="font-medium">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Guests</p>
                        <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-dark-800 p-3 rounded-lg mb-4">
                      <p className="text-white/60 text-xs mb-1">Cancellation Reason</p>
                      <p className="text-white/80">{booking.cancellationReason}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-dark-700 pt-4">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-white/60 text-xs mb-1">Refund Amount</p>
                        <p className="text-xl font-semibold">${booking.refundAmount}</p>
                        <p className="text-white/60 text-xs">Original amount: ${booking.amount}</p>
                      </div>
                      <div>
                        <Link href={`/booking/${booking.id}/details`} className="btn-secondary flex items-center text-sm">
                          <FileText size={14} className="mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-white/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No cancelled bookings</h3>
              <p className="text-white/70">You don't have any cancelled bookings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
