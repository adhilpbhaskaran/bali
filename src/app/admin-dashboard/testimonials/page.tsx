'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import SafeContentRenderer from '@/components/SafeContentRenderer';
import { useTestimonialsStore } from '@/lib/store/testimonials';

export default function TestimonialsPage() {
  const testimonials = useTestimonialsStore((state) => state.testimonials);
  const toggleFeatured = useTestimonialsStore((state) => state.toggleFeatured);
  const updateStatus = useTestimonialsStore((state) => state.updateStatus);
  const deleteTestimonial = useTestimonialsStore((state) => state.deleteTestimonial);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const itemsPerPage = 6;

  // Filter testimonials based on search and status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      testimonial.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle status change
  const handleStatusChange = (id: string, status: 'published' | 'pending' | 'rejected') => {
    updateStatus(id, status as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED');
    
    setSuccessMessage(`Testimonial status updated to ${status}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle featured toggle
  const handleFeaturedToggle = (id: string) => {
    toggleFeatured(id);
    
    const testimonial = testimonials.find(t => t.id === id);
    setSuccessMessage(`Testimonial ${testimonial?.featured ? 'removed from' : 'added to'} featured`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      deleteTestimonial(testimonialToDelete);
      setShowDeleteModal(false);
      setTestimonialToDelete(null);
      
      setSuccessMessage('Testimonial deleted successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Link 
          href="/admin-dashboard/testimonials/new" 
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search testimonials..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bento-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                {testimonial.image ? (
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-600/20 flex items-center justify-center">
                    <span className="text-primary-500 text-lg font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-base font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-white/60">{testimonial.location || testimonial.role || ''}</p>
                </div>
              </div>
              <StatusBadge status={testimonial.status} />
            </div>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'} 
                />
              ))}
            </div>
            
            <div className="text-sm text-white/80 line-clamp-3">
              <SafeContentRenderer 
                content={testimonial.content} 
                className="text-sm text-white/80"
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <button
                  onClick={() => handleFeaturedToggle(testimonial.id)}
                  className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1 ${
                    testimonial.featured 
                      ? 'bg-primary-600/20 text-primary-500' 
                      : 'bg-dark-700 text-white/60 hover:text-white'
                  }`}
                >
                  {testimonial.featured ? 'Featured' : 'Feature'}
                </button>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/admin-dashboard/testimonials/${testimonial.id}`}
                  className="p-1.5 rounded-lg bg-dark-700 text-white/60 hover:text-white transition-colors"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/admin-dashboard/testimonials/${testimonial.id}/edit`}
                  className="p-1.5 rounded-lg bg-dark-700 text-white/60 hover:text-primary-500 transition-colors"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDeleteClick(testimonial.id)}
                  className="p-1.5 rounded-lg bg-dark-700 text-white/60 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-dark-700 text-xs text-white/40">
              <span>
                General Review
              </span>
              <span>
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <div className="bento-card p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-white/40" />
          </div>
          <h3 className="text-xl font-medium mb-2">No testimonials found</h3>
          <p className="text-white/60 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search filters' 
              : 'Add your first testimonial to get started'}
          </p>
          <Link
            href="/admin-dashboard/testimonials/new"
            className="btn-primary px-4 py-2 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Testimonial</span>
          </Link>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 id="delete-modal-title" className="text-lg font-semibold mb-4">Delete Testimonial</h3>
            <p id="delete-modal-description" className="text-white/60 mb-6">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                aria-label="Confirm deletion of testimonial"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-dark-800 rounded-lg shadow-lg p-4 w-80 z-50 border-l-4 border-green-500 animate-slide-up">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
