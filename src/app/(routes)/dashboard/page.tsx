'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock, Users, Package, CreditCard, Heart, Settings, LogOut } from 'lucide-react';

// Sample data for bookings
const bookings = [
  {
    id: 'BK-2025-001',
    title: 'Romantic Bali Honeymoon',
    status: 'upcoming',
    date: '2025-06-15',
    duration: '7 days',
    guests: 2,
    amount: 899,
    image: '/images/packages/honeymoon.jpg',
  },
  {
    id: 'BK-2024-089',
    title: 'Ubud Cultural Tour',
    status: 'completed',
    date: '2024-12-10',
    duration: '8 hours',
    guests: 2,
    amount: 45,
    image: '/images/activities/ubud-tour.jpg',
  },
];

// Sample data for saved trips
const savedTrips = [
  {
    id: 'ST-2025-001',
    title: 'Family Adventure',
    items: 4,
    totalAmount: 1245,
    lastUpdated: '2025-05-20',
  },
  {
    id: 'ST-2025-002',
    title: 'Solo Exploration',
    items: 2,
    totalAmount: 150,
    lastUpdated: '2025-05-15',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('bookings');
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatar-placeholder.jpg',
  };

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
              <p className="text-white/70">{user.email}</p>
            </div>
          </div>
          <div>
            <Link href="/contact" className="btn-primary">
              Need Help?
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <div className="bento-card p-0 overflow-hidden">
              <nav>
                <ul>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'bookings' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('bookings')}
                    >
                      <Package size={18} className={`mr-3 ${activeTab === 'bookings' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>My Bookings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'saved' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('saved')}
                    >
                      <Heart size={18} className={`mr-3 ${activeTab === 'saved' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Saved Trips</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'profile' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <Settings size={18} className={`mr-3 ${activeTab === 'profile' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Profile Settings</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/auth/logout"
                      className="flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors text-red-400 hover:text-red-300"
                    >
                      <LogOut size={18} className="mr-3" />
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            {/* My Bookings */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Bookings</h2>
                  <Tabs defaultValue="upcoming">
                    <TabsList className="bg-dark-800">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bento-card p-4 md:p-6">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-32 md:w-48 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                            <Image
                              src={booking.image}
                              alt={booking.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row justify-between mb-2">
                              <h3 className="text-lg font-semibold mb-1 md:mb-0">{booking.title}</h3>
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'upcoming' ? 'bg-green-900/30 text-green-400' :
                                booking.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                              <div className="flex items-center text-white/70">
                                <Calendar size={16} className="mr-2" />
                                <span>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center text-white/70">
                                <Clock size={16} className="mr-2" />
                                <span>{booking.duration}</span>
                              </div>
                              <div className="flex items-center text-white/70">
                                <Users size={16} className="mr-2" />
                                <span>{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div>
                                <span className="text-white/70 text-sm">Booking ID: </span>
                                <span className="font-medium">{booking.id}</span>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className="text-white/70 text-sm mr-2">Total:</span>
                                <span className="text-xl font-bold">${booking.amount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-dark-700 flex flex-col md:flex-row justify-end gap-3">
                          <Link href={`/bookings/${booking.id}`} className="btn-secondary text-center">
                            View Details
                          </Link>
                          {booking.status === 'upcoming' && (
                            <>
                              <button className="btn-secondary">Modify</button>
                              <button className="btn-secondary text-red-400 hover:text-red-300">Cancel</button>
                            </>
                          )}
                          {booking.status === 'completed' && (
                            <button className="btn-secondary">Leave Review</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bento-card p-8 text-center">
                    <p className="text-white/70 mb-4">You don't have any bookings yet.</p>
                    <Link href="/packages" className="btn-primary">
                      Explore Packages
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved Trips */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Saved Trips</h2>
                  <Link href="/trip-planner" className="btn-primary">
                    Create New Trip
                  </Link>
                </div>

                {savedTrips.length > 0 ? (
                  <div className="space-y-4">
                    {savedTrips.map((trip) => (
                      <div key={trip.id} className="bento-card p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>
                            <p className="text-white/70 mb-4">Last updated: {new Date(trip.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            <div className="flex items-center text-white/70">
                              <Package size={16} className="mr-2" />
                              <span>{trip.items} {trip.items === 1 ? 'Item' : 'Items'}</span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-end">
                            <div className="mb-3">
                              <span className="text-white/70 text-sm mr-2">Estimated Total:</span>
                              <span className="text-xl font-bold">${trip.totalAmount}</span>
                            </div>
                            <div className="flex gap-3">
                              <Link href={`/trip-planner/${trip.id}`} className="btn-primary">
                                Edit Trip
                              </Link>
                              <button className="btn-secondary">Book Now</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bento-card p-8 text-center">
                    <p className="text-white/70 mb-4">You don't have any saved trips yet.</p>
                    <Link href="/trip-planner" className="btn-primary">
                      Start Planning
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                
                <div className="bento-card p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          defaultValue="John"
                          className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          defaultValue="Doe"
                          className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue="john.doe@example.com"
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue="+1 (123) 456-7890"
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="bento-card p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-white/70 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-white/70 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="bento-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-dark-700 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-white/70">Receive email notifications for booking updates</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-dark-700 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-white/70">Receive promotional emails and special offers</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-dark-700 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-white/70">Receive SMS notifications</span>
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
