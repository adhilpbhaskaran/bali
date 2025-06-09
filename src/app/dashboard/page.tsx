'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Package, Star, Clock, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Handle authentication with error handling for development
  let userState = { user: null, isLoaded: false };
  let authError = null;
  
  try {
    const auth = useUser();
    userState = {
      user: auth.user,
      isLoaded: auth.isLoaded
    };
  } catch (error) {
    console.warn('Clerk authentication error in Dashboard:', error);
    authError = error;
    // In development, create a mock user to allow app to continue
    userState = {
      user: {
        firstName: 'Development',
        username: 'dev-user',
        emailAddresses: [{ emailAddress: 'dev@example.com' }]
      } as any,
      isLoaded: true
    };
  }
  
  const { user, isLoaded } = userState;

  if (!isLoaded) {
    return (
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
        <div className="container-custom flex justify-center items-center" style={{ minHeight: '50vh' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Show development warning if there's an auth error
  if (authError && process.env.NODE_ENV === 'development') {
    return (
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
        <div className="container-custom">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Development Mode - Dashboard
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Running in development mode with mock user data. Configure Clerk for full authentication.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 bg-primary-600/30 flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.firstName || user?.username || 'User'}
              </h1>
              <p className="text-white/70">Manage your bookings and preferences</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="bg-dark-800 border-b border-dark-700 w-full justify-start mb-6 overflow-x-auto">
            <TabsTrigger 
              value="bookings"
              className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
            >
              My Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:text-primary-500 data-[state=active]:border-b-2 data-[state=active]:border-primary-500"
            >
              Profile Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-dark-800 border-dark-700 text-white">
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription className="text-white/70">View and manage your upcoming and past trips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CalendarDays className="mx-auto h-12 w-12 text-primary-500/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-white/70 mb-4">When you book a package or activity, it will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-6">
            <Card className="bg-dark-800 border-dark-700 text-white">
              <CardHeader>
                <CardTitle>Your Favorites</CardTitle>
                <CardDescription className="text-white/70">Packages and activities you've saved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="mx-auto h-12 w-12 text-primary-500/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-white/70 mb-4">Save packages and activities to view them here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-dark-800 border-dark-700 text-white">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-white/70">Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                      <div className="bg-dark-700 border border-dark-600 rounded-md px-3 py-2">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                      <div className="bg-dark-700 border border-dark-600 rounded-md px-3 py-2">
                        {user?.emailAddresses[0]?.emailAddress}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-4">
                    To update your profile information, please use the account settings in the user menu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}