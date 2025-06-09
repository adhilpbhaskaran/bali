'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Palmtree, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useActivitiesStore, Activity } from '@/lib/store/activities';

export default function ActivitiesPage() {
  const activities = useActivitiesStore((state) => state.activities);
  const deleteActivity = useActivitiesStore((state) => state.deleteActivity);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<keyof Activity>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteActivity(id);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || activity.category === selectedCategory)
  );

  // Filter and sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const paginatedActivities = sortedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort toggle
  const handleSort = (field: keyof Activity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'wellness', label: 'Wellness' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Link 
          href="/admin-dashboard/activities/new" 
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Activity</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-white/40" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedActivities.map((activity) => (
          <div key={activity.id} className="bento-card p-6 space-y-4">
            {activity.image && (
              <div className="aspect-video rounded-lg overflow-hidden bg-dark-700">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold">{activity.name}</h3>
              <p className="text-white/60 text-sm mt-1">{activity.shortDescription}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${activity.price}</span>
                <span className="text-white/60 text-sm ml-2">/ {activity.duration}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/admin-dashboard/activities/${activity.id}`}
                className="flex-1 btn-secondary px-3 py-2 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>View</span>
              </Link>
              <Link
                href={`/admin-dashboard/activities/${activity.id}/edit`}
                className="flex-1 btn-secondary px-3 py-2 flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => handleDelete(activity.id)}
                className="btn-danger px-3 py-2 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 hover:bg-dark-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
