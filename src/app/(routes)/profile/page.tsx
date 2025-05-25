'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  User, 
  CalendarDays, 
  Heart, 
  Settings, 
  FileText,
  LogOut,
  Edit,
  CreditCard
} from 'lucide-react';

// Profile components
import PersonalInfo from '@/components/profile/PersonalInfo';
import BookingHistory from '@/components/profile/BookingHistory';
import SavedItems from '@/components/profile/SavedItems';
import AccountSettings from '@/components/profile/AccountSettings';
import TravelDocuments from '@/components/profile/TravelDocuments';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal-info');

  // Sample user data - in a real app, this would come from an API or context
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatars/user1.jpg',
    memberSince: '2024-10-15',
    upcomingTrips: 1,
    completedTrips: 3,
    savedItems: 5
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 md:pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom px-4 sm:px-6 md:px-8">
        {/* Profile Header - Responsive for all devices */}
        <div className="bento-card mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
              <Image 
                src={user.avatar} 
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </div>
                <Link href="/auth/logout" className="btn-secondary flex items-center justify-center gap-1 text-sm py-1.5 px-3">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 sm:mt-4">
                <div className="text-center">
                  <p className="text-xs text-white/70">Member Since</p>
                  <p className="font-medium">{new Date(user.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/70">Upcoming Trips</p>
                  <p className="font-medium">{user.upcomingTrips}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/70">Completed Trips</p>
                  <p className="font-medium">{user.completedTrips}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/70">Saved Items</p>
                  <p className="font-medium">{user.savedItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content - Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation - Hidden on Mobile */}
          <div className="hidden md:block">
            <div className="bento-card overflow-hidden">
              <nav>
                <ul className="divide-y divide-dark-700">
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'personal-info' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('personal-info')}
                    >
                      <User size={18} className={`mr-3 ${activeTab === 'personal-info' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Personal Information</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'bookings' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('bookings')}
                    >
                      <CalendarDays size={18} className={`mr-3 ${activeTab === 'bookings' ? 'text-primary-500' : 'text-white/70'}`} />
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
                      <span>Saved Items</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'documents' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('documents')}
                    >
                      <FileText size={18} className={`mr-3 ${activeTab === 'documents' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Travel Documents</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'payment' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('payment')}
                    >
                      <CreditCard size={18} className={`mr-3 ${activeTab === 'payment' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Payment Methods</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center w-full px-6 py-4 text-left hover:bg-dark-700 transition-colors ${
                        activeTab === 'settings' ? 'bg-dark-700 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings size={18} className={`mr-3 ${activeTab === 'settings' ? 'text-primary-500' : 'text-white/70'}`} />
                      <span>Account Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="md:hidden mb-6">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full overflow-x-auto flex flex-nowrap -mx-1 px-1 pb-1 no-scrollbar">
                <TabsTrigger value="personal-info" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <User size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <CalendarDays size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <Heart size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Saved</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <FileText size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Documents</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <CreditCard size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Payment</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="whitespace-nowrap flex-shrink-0 mx-0.5">
                  <Settings size={14} className="mr-1 md:mr-2" />
                  <span className="md:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'personal-info' && <PersonalInfo />}
            {activeTab === 'bookings' && <BookingHistory />}
            {activeTab === 'saved' && <SavedItems />}
            {activeTab === 'documents' && <TravelDocuments />}
            {activeTab === 'payment' && (
              <div className="bento-card">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <p className="text-white/70 mb-6">Manage your payment methods for faster checkout.</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 border border-dark-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-600 rounded mr-4 flex items-center justify-center text-white font-bold">
                        Visa
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-white/60 text-sm">Expires 12/2028</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="text-white/70 hover:text-white p-2">
                        <Edit size={16} />
                      </button>
                      <button className="text-white/70 hover:text-red-500 p-2 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <button className="btn-primary">Add New Payment Method</button>
              </div>
            )}
            {activeTab === 'settings' && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
