'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useActivitiesStore } from '@/lib/store/activities';
import ActivityCard from '@/components/activities/ActivityCard';
import { filterAndMapActivities, getSectionTitle } from '@/components/activities/ActivityCardUtils';

export default function ActivityTestPage() {
  const { activities, loading, error, fetchActivities } = useActivitiesStore();
  const [adventureActivities, setAdventureActivities] = useState<any[]>([]);
  const [culturalActivities, setculturalActivities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all activities when component mounts
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    // When activities are loaded, filter them by category
    if (activities && activities.length > 0) {
      // Use our utility functions to filter and map activities by category
      const adventure = filterAndMapActivities(activities, 'adventure');
      const cultural = filterAndMapActivities(activities, 'cultural');
      
      setAdventureActivities(adventure);
      setculturalActivities(cultural);
      
      console.log('Activities loaded:', activities.length);
      console.log('Adventure activities:', adventure.length);
      console.log('Cultural activities:', cultural.length);
    }
  }, [activities]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Activities Test Page</h1>
      
      {loading && <p className="text-lg">Loading activities...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {/* Adventure Activities Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{getSectionTitle('adventure')}</h2>
          <Link href="/activities?category=adventure" className="btn-primary flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adventureActivities.length > 0 ? (
            adventureActivities.map((activity) => (
              <ActivityCard key={`adventure-${activity.id}`} activity={activity} />
            ))
          ) : (
            <p>No adventure activities found.</p>
          )}
        </div>
      </section>
      
      {/* Cultural Activities Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{getSectionTitle('cultural')}</h2>
          <Link href="/activities?category=cultural" className="btn-primary flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {culturalActivities.length > 0 ? (
            culturalActivities.map((activity) => (
              <ActivityCard key={`cultural-${activity.id}`} activity={activity} />
            ))
          ) : (
            <p>No cultural activities found.</p>
          )}
        </div>
      </section>
      
      {/* All Activities Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activities && activities.length > 0 ? (
            filterAndMapActivities(activities).slice(0, 8).map((activity) => (
              <ActivityCard key={`all-${activity.id}`} activity={activity} />
            ))
          ) : (
            <p>No activities found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
