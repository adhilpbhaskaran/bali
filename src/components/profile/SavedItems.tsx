'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  Trash,
  ShoppingCart
} from 'lucide-react';

// Sample saved items data
const savedPackages = [
  {
    id: 1,
    title: "Romantic Bali Honeymoon",
    description: "7 days of pure romance in the island of gods",
    price: 899,
    discountPrice: 799,
    image: "/images/packages/honeymoon.jpg",
    category: "honeymoon",
    duration: "7 days",
    location: "Bali, Indonesia",
    rating: 4.9,
    reviews: 128,
    savedOn: "2025-05-10"
  },
  {
    id: 3,
    title: "Luxury Bali Retreat",
    description: "6 days of pure luxury and relaxation in Bali's finest resorts",
    price: 1299,
    discountPrice: 1199,
    image: "/images/packages/luxury.jpg",
    category: "luxury",
    duration: "6 days",
    location: "Bali, Indonesia",
    rating: 4.9,
    reviews: 84,
    savedOn: "2025-05-08"
  }
];

const savedActivities = [
  {
    id: 1,
    title: "Mount Batur Sunrise Trek",
    description: "Experience a magical sunrise from the top of an active volcano",
    price: 65,
    discountPrice: 55,
    image: "/images/activities/mount-batur.jpg",
    category: "adventure",
    duration: "6 hours",
    location: "Kintamani, Bali",
    rating: 4.8,
    reviews: 156,
    savedOn: "2025-05-12"
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
    location: "Ubud, Bali",
    rating: 4.6,
    reviews: 210,
    savedOn: "2025-05-05"
  },
  {
    id: 5,
    title: "Uluwatu Temple & Kecak Dance",
    description: "Visit the clifftop temple and watch the mesmerizing Kecak fire dance at sunset",
    price: 40,
    discountPrice: 35,
    image: "/images/activities/uluwatu-kecak.jpg",
    category: "cultural",
    duration: "5 hours",
    location: "Uluwatu, Bali",
    rating: 4.7,
    reviews: 142,
    savedOn: "2025-04-28"
  }
];

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState(savedPackages);
  const [activities, setActivities] = useState(savedActivities);
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

  const removePackage = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const removeActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="bento-card">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Saved Items</h2>
      
      <Tabs defaultValue="packages" onValueChange={setActiveTab}>
        <TabsList className="mb-4 sm:mb-6 w-full overflow-x-auto no-scrollbar">
          <TabsTrigger value="packages" className="whitespace-nowrap text-xs sm:text-sm">
            Packages
            {packages.length > 0 && (
              <span className="ml-1 sm:ml-2 bg-primary-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {packages.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activities" className="whitespace-nowrap text-xs sm:text-sm">
            Activities
            {activities.length > 0 && (
              <span className="ml-1 sm:ml-2 bg-primary-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {activities.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-6">
          {packages.length > 0 ? (
            packages.map(pkg => (
              <div key={pkg.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative h-48 md:h-auto">
                    <Image 
                      src={pkg.image} 
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                    </div>
                  </div>
                  <div className="p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/packages/${pkg.id}`} className="hover:text-primary-500 transition-colors">
                        <h3 className="text-xl font-semibold mb-1">{pkg.title}</h3>
                      </Link>
                      <button 
                        className="text-white/60 hover:text-red-500 transition-colors"
                        onClick={() => removePackage(pkg.id)}
                        title="Remove from saved items"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {pkg.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center">
                        <Star size={14} className="mr-1 text-yellow-500" />
                        <span className="text-white">{pkg.rating}</span>
                        <span className="ml-1">({pkg.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold">${pkg.discountPrice}</span>
                        {pkg.discountPrice < pkg.price && (
                          <span className="text-white/60 line-through ml-2">${pkg.price}</span>
                        )}
                        <span className="text-white/60 text-sm"> / person</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/packages/${pkg.id}`} className="btn-secondary text-sm">
                          View Details
                        </Link>
                        <Link href={`/booking?type=package&id=${pkg.id}`} className="btn-primary flex items-center text-sm">
                          <ShoppingCart size={14} className="mr-2" />
                          Book Now
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-dark-700">
                      <p className="text-white/60 text-xs">
                        Saved on {new Date(pkg.savedOn).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-white/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No saved packages</h3>
              <p className="text-white/70 mb-6">You haven&apos;t saved any packages yet. Browse our packages and click the heart icon to save them for later.</p>
              <Link href="/packages" className="btn-primary">
                Browse Packages
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          {activities.length > 0 ? (
            activities.map(activity => (
              <div key={activity.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative h-48 md:h-auto">
                    <Image 
                      src={activity.image} 
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                    </div>
                  </div>
                  <div className="p-4 md:col-span-2">
                    <div className="flex justify-between items-start mb-3">
                      <Link href={`/activities/${activity.id}`} className="hover:text-primary-500 transition-colors">
                        <h3 className="text-xl font-semibold mb-1">{activity.title}</h3>
                      </Link>
                      <button 
                        className="text-white/60 hover:text-red-500 transition-colors"
                        onClick={() => removeActivity(activity.id)}
                        title="Remove from saved items"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {activity.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {activity.duration}
                      </div>
                      <div className="flex items-center">
                        <Star size={14} className="mr-1 text-yellow-500" />
                        <span className="text-white">{activity.rating}</span>
                        <span className="ml-1">({activity.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">{activity.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold">${activity.discountPrice}</span>
                        {activity.discountPrice < activity.price && (
                          <span className="text-white/60 line-through ml-2">${activity.price}</span>
                        )}
                        <span className="text-white/60 text-sm"> / person</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/activities/${activity.id}`} className="btn-secondary text-sm">
                          View Details
                        </Link>
                        <Link href={`/booking?type=activity&id=${activity.id}`} className="btn-primary flex items-center text-sm">
                          <ShoppingCart size={14} className="mr-2" />
                          Book Now
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-dark-700">
                      <p className="text-white/60 text-xs">
                        Saved on {new Date(activity.savedOn).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-white/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No saved activities</h3>
              <p className="text-white/70 mb-6">You haven&apos;t saved any activities yet. Browse our activities and click the heart icon to save them for later.</p>
              <Link href="/activities" className="btn-primary">
                Browse Activities
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
