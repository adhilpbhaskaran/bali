'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, Users, MapPin, Tag } from 'lucide-react';
import { usePackagesStore, type Package } from '@/lib/store/packages';

export default function ViewPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const getPackage = usePackagesStore((state) => state.getPackage);
  const [packageData, setPackageData] = useState<Package | null>(null);

  useEffect(() => {
    const data = getPackage(params.id);
    if (!data) {
      router.push('/admin-dashboard/packages');
      return;
    }
    setPackageData(data);
  }, [params.id, getPackage, router]);

  if (!packageData) {
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
            href="/admin-dashboard/packages"
            className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">{packageData.name || 'Untitled Package'}</h1>
        </div>
        <Link
          href={`/admin-dashboard/packages/${params.id}/edit`}
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Edit size={16} />
          <span>Edit Package</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {packageData.image && (
            <div className="bento-card overflow-hidden">
              <img
                src={packageData.image}
                alt={packageData.name || 'Package image'}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bento-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            {packageData.shortDescription && (
              <p className="text-lg text-white/80">{packageData.shortDescription}</p>
            )}
            {packageData.description && (
              <p className="text-white/60 whitespace-pre-wrap">{packageData.description}</p>
            )}
          </div>

          {/* Highlights */}
          {packageData.highlights.length > 0 && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Highlights</h2>
              <ul className="space-y-2">
                {packageData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Media Gallery */}
          {packageData.mediaGallery && packageData.mediaGallery.length > 0 && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Media Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {packageData.mediaGallery.map((item) => (
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

          {/* Itinerary */}
          {packageData.itinerary && packageData.itinerary.length > 0 && (
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Day-wise Itinerary</h2>
              <div className="space-y-8">
                {packageData.itinerary.map((day) => (
                  <div key={day.id} className="space-y-4 pb-6 border-b border-dark-700 last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Day {day.day}: {day.title}</h3>
                    </div>

                    <div className="space-y-4">
                      <p className="text-white/80">{day.description}</p>

                      {day.activities.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white/60 mb-2">Activities</h4>
                          <ul className="space-y-1">
                            {day.activities.map((activity, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary-500">•</span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {day.meals.breakfast && (
                          <div>
                            <h4 className="text-sm font-medium text-white/60 mb-1">Breakfast</h4>
                            <p>{day.meals.breakfast}</p>
                          </div>
                        )}
                        {day.meals.lunch && (
                          <div>
                            <h4 className="text-sm font-medium text-white/60 mb-1">Lunch</h4>
                            <p>{day.meals.lunch}</p>
                          </div>
                        )}
                        {day.meals.dinner && (
                          <div>
                            <h4 className="text-sm font-medium text-white/60 mb-1">Dinner</h4>
                            <p>{day.meals.dinner}</p>
                          </div>
                        )}
                      </div>

                      {day.accommodation && (
                        <div>
                          <h4 className="text-sm font-medium text-white/60 mb-1">Accommodation</h4>
                          <p>{day.accommodation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included/Not Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packageData.included.length > 0 && (
              <div className="bento-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">What's Included</h2>
                <ul className="space-y-2">
                  {packageData.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {packageData.notIncluded.length > 0 && (
              <div className="bento-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">What's Not Included</h2>
                <ul className="space-y-2">
                  {packageData.notIncluded.map((item, index) => (
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
          {/* Package Details */}
          <div className="bento-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Package Details</h2>
            
            <div className="space-y-4">
              {packageData.price !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Price</span>
                  <span className="text-2xl font-bold">${packageData.price}</span>
                </div>
              )}

              <div className="border-t border-dark-700 pt-4 space-y-4">
                {packageData.duration !== undefined && (
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white/60">Duration</p>
                      <p>{packageData.duration} days</p>
                    </div>
                  </div>
                )}

                {packageData.minParticipants !== undefined && (
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white/60">Group Size</p>
                      <p>Minimum {packageData.minParticipants} people</p>
                    </div>
                  </div>
                )}

                {packageData.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white/60">Location</p>
                      <p>{packageData.location}</p>
                    </div>
                  </div>
                )}

                {packageData.category && (
                  <div className="flex items-center gap-3">
                    <Tag size={20} className="text-white/40" />
                    <div>
                      <p className="text-sm text-white/60">Category</p>
                      <p>{packageData.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          {(packageData.startDate || packageData.endDate) && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Dates</h2>
              <div className="space-y-2">
                {packageData.startDate && (
                  <div>
                    <p className="text-sm text-white/60">Start Date</p>
                    <p>{new Date(packageData.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {packageData.endDate && (
                  <div>
                    <p className="text-sm text-white/60">End Date</p>
                    <p>{new Date(packageData.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="bento-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                packageData.status === 'available' ? 'bg-green-500/20 text-green-500' :
                packageData.status === 'almost_full' ? 'bg-yellow-500/20 text-yellow-500' :
                packageData.status === 'full' ? 'bg-red-500/20 text-red-500' :
                'bg-gray-500/20 text-gray-500'
              }`}>
                {packageData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 