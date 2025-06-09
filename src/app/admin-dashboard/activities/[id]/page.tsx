'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Clock, MapPin, Tag, DollarSign } from 'lucide-react';
import { useActivitiesStore, type Activity } from '@/lib/store/activities';

export default function ViewActivityPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const getActivity = useActivitiesStore((state) => state.getActivity);
  const [activityData, setActivityData] = useState<Activity | null>(null);

  useEffect(() => {
    const data = getActivity(params.id);
    if (!data) {
      router.push('/admin-dashboard/activities');
      return;
    }
    setActivityData(data);
  }, [params.id, getActivity, router]);

  if (!activityData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin-dashboard/activities"
            className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">{activityData.name}</h1>
        </div>
        <Link
          href={`/admin-dashboard/activities/${params.id}/edit`}
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Edit size={16} />
          <span>Edit Activity</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {activityData.image && (
            <div className="bento-card overflow-hidden">
              <img
                src={activityData.image}
                alt={activityData.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bento-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            {activityData.shortDescription && (
              <p className="text-lg text-white/80">{activityData.shortDescription}</p>
            )}
            {activityData.description && (
              <p className="text-white/60 whitespace-pre-wrap">{activityData.description}</p>
            )}
          </div>

          {/* Highlights */}
          {activityData.highlights.length > 0 && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Highlights</h2>
              <ul className="space-y-2">
                {activityData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Media Gallery */}
          {activityData.mediaGallery && activityData.mediaGallery.length > 0 && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Media Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activityData.mediaGallery.map((item) => (
                  <div key={item.id} className="relative aspect-video">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title || ''}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-700 rounded-lg flex items-center justify-center">
                        <iframe
                          src={item.url}
                          title={item.title || 'Video'}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {(item.title || item.description) && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-dark-900/80 rounded-b-lg">
                        {item.title && (
                          <p className="text-sm font-medium truncate">{item.title}</p>
                        )}
                        {item.description && (
                          <p className="text-xs text-white/60 truncate">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included/Not Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activityData.includedItems.length > 0 && (
              <div className="bento-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">What's Included</h2>
                <ul className="space-y-2">
                  {activityData.includedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activityData.excludedItems.length > 0 && (
              <div className="bento-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">What's Not Included</h2>
                <ul className="space-y-2">
                  {activityData.excludedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Details */}
          <div className="bento-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Activity Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Price</span>
                <span className="text-2xl font-bold">${activityData.price}</span>
              </div>

              <div className="border-t border-dark-700 pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-white/40" />
                  <div>
                    <p className="text-sm text-white/60">Duration</p>
                    <p>{activityData.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-white/40" />
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p>{activityData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-white/40" />
                  <div>
                    <p className="text-sm text-white/60">Category</p>
                    <p>{activityData.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activityData.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
              }`}>
                {activityData.status.charAt(0).toUpperCase() + activityData.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}