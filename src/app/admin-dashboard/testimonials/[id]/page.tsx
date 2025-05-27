'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Palmtree,
  Calendar,
  User,
  MapPin,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useTestimonialsStore } from '@/lib/store/testimonials';
import { usePackagesStore } from '@/lib/store/packages';
import { useActivitiesStore } from '@/lib/store/activities';

export default function TestimonialDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const testimonialId = params.id;
  
  const getTestimonial = useTestimonialsStore((state) => state.getTestimonial);
  const toggleFeatured = useTestimonialsStore((state) => state.toggleFeatured);
  const updateStatus = useTestimonialsStore((state) => state.updateStatus);
  const deleteTestimonial = useTestimonialsStore((state) => state.deleteTestimonial);
  
  const getPackage = usePackagesStore((state) => state.getPackage);
  const getActivity = useActivitiesStore((state) => state.getActivity);
  
  const [testimonial, setTestimonial] = useState<any>(null);
  const [relatedItem, setRelatedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load testimonial data
  useEffect(() => {
    const loadData = () => {
      const testimonialData = getTestimonial(testimonialId);
      
      if (!testimonialData) {
        setIsLoading(false);
        return;
      }
      
      setTestimonial(testimonialData);
      
      // Load related package or activity
      if (testimonialData.packageId) {
        const packageData = getPackage(testimonialData.packageId);
        setRelatedItem({
          type: 'package',
          data: packageData
        });
      } else if (testimonialData.activityId) {
        const activityData = getActivity(testimonialData.activityId);
        setRelatedItem({
          type: 'activity',
          data: activityData
        });
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [testimonialId, getTestimonial, getPackage, getActivity]);

  // Handle status change
  const handleStatusChange = (status: 'published' | 'pending' | 'rejected') => {
    updateStatus(testimonialId, status);
    
    setSuccessMessage(`Testimonial status updated to ${status}`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Update local state
    setTestimonial((prev: any) => ({
      ...prev,
      status
    }));
  };

  // Handle featured toggle
  const handleFeaturedToggle = () => {
    toggleFeatured(testimonialId);
    
    const newFeaturedState = !testimonial.featured;
    setSuccessMessage(`Testimonial ${newFeaturedState ? 'added to' : 'removed from'} featured`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Update local state
    setTestimonial((prev: any) => ({
      ...prev,
      featured: newFeaturedState
    }));
  };

  // Handle delete
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteTestimonial(testimonialId);
    setShowDeleteModal(false);
    
    setSuccessMessage('Testimonial deleted successfully');
    setShowSuccessMessage(true);
    
    // Redirect after delay
    setTimeout(() => {
      router.push('/admin-dashboard/testimonials');
    }, 1500);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <CheckCircle className="w-4 h-4 mr-1" />
            Published
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="bento-card p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">Testimonial Not Found</h3>
        <p className="text-white/60 mb-6">
          The testimonial you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          href="/admin-dashboard/testimonials"
          className="btn-primary px-4 py-2 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Testimonials</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin-dashboard/testimonials"
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Testimonial Details</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin-dashboard/testimonials/${testimonialId}/edit`}
            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Link>
          
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center gap-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bento-card p-6">
            <div className="flex flex-col items-center text-center">
              {testimonial.image ? (
                <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary-600/20 flex items-center justify-center mb-4">
                  <span className="text-primary-500 text-4xl font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <h2 className="text-xl font-semibold">{testimonial.name}</h2>
              
              <div className="flex items-center justify-center mt-2 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'} 
                  />
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                {testimonial.role && (
                  <div className="flex items-center justify-center text-white/70">
                    <Briefcase size={16} className="mr-2" />
                    <span>{testimonial.role}</span>
                  </div>
                )}
                
                {testimonial.location && (
                  <div className="flex items-center justify-center text-white/70">
                    <MapPin size={16} className="mr-2" />
                    <span>{testimonial.location}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-dark-700 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Status</span>
                  <StatusBadge status={testimonial.status} />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white/60">Featured</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    testimonial.featured 
                      ? 'bg-primary-600/20 text-primary-500' 
                      : 'bg-dark-700 text-white/60'
                  }`}>
                    {testimonial.featured ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white/60">Created</span>
                  <span className="text-white/80">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bento-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Actions</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Change Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange('published')}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                      testimonial.status === 'published'
                        ? 'bg-green-900/30 text-green-500 border border-green-500/50'
                        : 'bg-dark-800 hover:bg-dark-700'
                    }`}
                  >
                    <CheckCircle size={16} />
                    <span>Publish</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                      testimonial.status === 'pending'
                        ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/50'
                        : 'bg-dark-800 hover:bg-dark-700'
                    }`}
                  >
                    <Clock size={16} />
                    <span>Pending</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                      testimonial.status === 'rejected'
                        ? 'bg-red-900/30 text-red-500 border border-red-500/50'
                        : 'bg-dark-800 hover:bg-dark-700'
                    }`}
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Featured Status
                </label>
                <button
                  onClick={handleFeaturedToggle}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    testimonial.featured
                      ? 'bg-red-900/30 text-red-500 border border-red-500/50'
                      : 'bg-primary-600/20 text-primary-500 border border-primary-500/50'
                  }`}
                >
                  <Star size={16} className={testimonial.featured ? '' : 'fill-primary-500'} />
                  <span>{testimonial.featured ? 'Remove from Featured' : 'Add to Featured'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Testimonial Content & Related Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card p-6">
            <h3 className="text-lg font-semibold mb-4">Testimonial Content</h3>
            
            <div className="bg-dark-800 rounded-lg p-6 relative">
              <div className="absolute -top-3 -left-3 text-primary-500 text-5xl opacity-30">"</div>
              <div className="absolute -bottom-3 -right-3 text-primary-500 text-5xl opacity-30">"</div>
              
              <p className="text-white/90 italic relative z-10">
                {testimonial.content}
              </p>
            </div>
          </div>
          
          {relatedItem && (
            <div className="bento-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                Related {relatedItem.type === 'package' ? 'Package' : 'Activity'}
              </h3>
              
              {relatedItem.data ? (
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={relatedItem.data.images?.[0] || '/images/placeholder.jpg'} 
                      alt={relatedItem.data.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium">{relatedItem.data.title}</h4>
                    
                    {relatedItem.type === 'package' && relatedItem.data.duration && (
                      <div className="flex items-center text-white/70 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span className="text-sm">{relatedItem.data.duration}</span>
                      </div>
                    )}
                    
                    {relatedItem.data.price && (
                      <div className="text-primary-500 font-semibold mt-1">
                        ${relatedItem.data.price}
                        {relatedItem.data.priceUnit && <span className="text-white/60 text-sm"> / {relatedItem.data.priceUnit}</span>}
                      </div>
                    )}
                    
                    <Link
                      href={`/admin-dashboard/${relatedItem.type === 'package' ? 'packages' : 'activities'}/${relatedItem.data.id}`}
                      className="text-sm text-primary-500 hover:underline mt-2 inline-block"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-dark-800 p-4 rounded-lg text-white/60">
                  This {relatedItem.type} no longer exists or has been deleted.
                </div>
              )}
            </div>
          )}
          
          <div className="bento-card p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center mt-0.5">
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Testimonial Created</p>
                  <p className="text-sm text-white/60">
                    {new Date(testimonial.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {testimonial.createdAt !== testimonial.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mt-0.5">
                    <Edit size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Testimonial Updated</p>
                    <p className="text-sm text-white/60">
                      {new Date(testimonial.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Testimonial</h3>
            <p className="text-white/60 mb-6">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
