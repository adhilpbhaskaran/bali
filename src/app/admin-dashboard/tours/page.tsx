'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePackagesStore } from '@/lib/store/packages';

export default function ToursPage() {
  const packages = usePackagesStore((state) => state.packages);
  const [tourTypeFilter, setTourTypeFilter] = useState<'all' | 'FIT' | 'GIT'>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTours = packages.filter(pkg => {
    if (tourTypeFilter !== 'all' && pkg.tourType !== tourTypeFilter) return false;
    if (statusFilter !== 'all' && pkg.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string, tourType: string) => {
    if (tourType === 'GIT') {
      switch (status) {
        case 'available': return 'bg-green-500/20 text-green-400';
        case 'almost_full': return 'bg-yellow-500/20 text-yellow-400';
        case 'sold_out': return 'bg-red-500/20 text-red-400';
        default: return 'bg-gray-500/20 text-gray-400';
      }
    } else {
      switch (status) {
        case 'available': return 'bg-blue-500/20 text-blue-400';
        case 'trending': return 'bg-purple-500/20 text-purple-400';
        case 'best_seller': return 'bg-orange-500/20 text-orange-400';
        default: return 'bg-gray-500/20 text-gray-400';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard" className="text-white/60 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Tours Management</h1>
        </div>
        
        <Link 
          href="/admin-dashboard/packages/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Tour
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select 
          value={tourTypeFilter}
          onChange={(e) => setTourTypeFilter(e.target.value as 'all' | 'FIT' | 'GIT')}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Tour Types</option>
          <option value="FIT">FIT Tours</option>
          <option value="GIT">GIT Tours</option>
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          {tourTypeFilter === 'GIT' || tourTypeFilter === 'all' ? (
            <>
              <option value="available">Available</option>
              <option value="almost_full">Almost Full</option>
              <option value="sold_out">Sold Out</option>
            </>
          ) : null}
          {tourTypeFilter === 'FIT' || tourTypeFilter === 'all' ? (
            <>
              <option value="available">Available</option>
              <option value="trending">Trending</option>
              <option value="best_seller">Best Seller</option>
            </>
          ) : null}
        </select>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bento-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{tour.name}</h3>
                <p className="text-sm text-white/60">{tour.location}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tour.tourType === 'FIT' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {tour.tourType}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status, tour.tourType)}`}>
                  {tour.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-white/60">
                <Calendar size={14} className="mr-2" />
                {tour.tourType === 'FIT' ? 'Flexible Dates' : `${tour.startDate} - ${tour.endDate}`}
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Users size={14} className="mr-2" />
                {tour.tourType === 'FIT' 
                  ? `Min ${tour.minParticipants} guests`
                  : `${tour.currentBookings || 0}/${tour.maxParticipants} booked`
                }
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Clock size={14} className="mr-2" />
                {tour.duration} days
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">${tour.price}</span>
              <Link 
                href={`/admin-dashboard/packages/${tour.id}/edit`}
                className="text-primary-500 hover:text-primary-400 text-sm font-medium"
              >
                Edit Tour
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}