'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  User
} from 'lucide-react';
import { usePackagesStore } from '@/lib/store/packages';
import type { Package as PackageType } from '@/lib/store/packages';

export default function PackagesPage() {
  const { 
    packages, 
    loading, 
    error, 
    deletePackage, 
    fetchPackages, 
    fetchFITPackages, 
    fetchGITPackages 
  } = usePackagesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tourTypeFilter, setTourTypeFilter] = useState<'ALL' | 'FIT' | 'GIT'>('ALL');
  const [sortField, setSortField] = useState<keyof PackageType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch packages based on tour type filter with debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined
        };

        switch (tourTypeFilter) {
          case 'FIT':
            await fetchFITPackages(params);
            break;
          case 'GIT':
            await fetchGITPackages(params);
            break;
          default:
            await fetchPackages({ ...params, tourType: undefined });
        }
      };

      fetchData();
    }, searchTerm ? 500 : 0); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [tourTypeFilter, currentPage, searchTerm, fetchPackages, fetchFITPackages, fetchGITPackages]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deletePackage(id);
    }
  };

  // Since we're fetching filtered data from API, we just need to sort locally
  const filteredPackages = packages;

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);
  const paginatedPackages = sortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort toggle
  const handleSort = (field: keyof PackageType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Packages</h1>
        <Link 
          href="/admin-dashboard/packages/new" 
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Package</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        {/* Tour Type Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setTourTypeFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tourTypeFilter === 'ALL'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-white/60 hover:bg-dark-600'
            }`}
          >
            All Tours
          </button>
          <button
            onClick={() => setTourTypeFilter('FIT')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tourTypeFilter === 'FIT'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-white/60 hover:bg-dark-600'
            }`}
          >
            <User size={16} />
            FIT Tours
          </button>
          <button
            onClick={() => setTourTypeFilter('GIT')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tourTypeFilter === 'GIT'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-700 text-white/60 hover:bg-dark-600'
            }`}
          >
            <Users size={16} />
            GIT Tours
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-white/60">Loading packages...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-white/40 mb-4" />
          <h3 className="text-lg font-medium text-white/60 mb-2">
            No {tourTypeFilter === 'ALL' ? '' : tourTypeFilter} packages found
          </h3>
          <p className="text-white/40">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first package.'}
          </p>
        </div>
      )}

      {/* Packages Grid */}
      {!loading && !error && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPackages.map((pkg) => (
            <div key={pkg.id} className="bento-card p-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.tourType === 'FIT' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {pkg.tourType === 'FIT' ? (
                    <><User size={12} className="mr-1" /> FIT</>
                  ) : (
                    <><Users size={12} className="mr-1" /> GIT</>
                  )}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-1 line-clamp-2">{pkg.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${pkg.price}</span>
                <span className="text-white/60 text-sm ml-2">/ {pkg.duration} days</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pkg.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                pkg.status === 'DRAFT' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {pkg.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-dark-700 text-sm">
                <span className="mr-1">⏱️</span>
                {pkg.duration} days
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-dark-700 text-sm">
                <span className="mr-1">📍</span>
                {pkg.location}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/admin-dashboard/packages/${pkg.id}`}
                className="flex-1 btn-secondary px-3 py-2 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>View</span>
              </Link>
              <Link
                href={`/admin-dashboard/packages/${pkg.id}/edit`}
                className="flex-1 btn-secondary px-3 py-2 flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="btn-danger px-3 py-2 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          ))}
        </div>
      )}

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