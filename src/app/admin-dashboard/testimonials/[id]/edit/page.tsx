'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Upload, 
  X, 
  CheckCircle,
  Package,
  Palmtree,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useTestimonialsStore } from '@/lib/store/testimonials';
import { usePackagesStore } from '@/lib/store/packages';
import { useActivitiesStore } from '@/lib/store/activities';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const testimonialId = params.id;
  
  const testimonials = useTestimonialsStore((state) => state.testimonials);
  const getTestimonial = useTestimonialsStore((state) => state.getTestimonial);
  const updateTestimonial = useTestimonialsStore((state) => state.updateTestimonial);
  const packages = usePackagesStore((state) => state.packages);
  const activities = useActivitiesStore((state) => state.activities);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState('');
  const [relatedType, setRelatedType] = useState<'none' | 'package' | 'activity'>('none');
  const [packageId, setPackageId] = useState('');
  const [activityId, setActivityId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'pending' | 'rejected'>('published');
  
  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Sample images for selection
  const sampleImages = [
    '/images/testimonials/sarah.jpg',
    '/images/testimonials/david.jpg',
    '/images/testimonials/emma.jpg',
    '/images/testimonials/john.jpg',
    '/images/testimonials/lisa.jpg',
    '/images/testimonials/michael.jpg',
  ];

  // Load testimonial data
  useEffect(() => {
    const testimonial = getTestimonial(testimonialId);
    
    if (!testimonial) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    
    setName(testimonial.name);
    setRole(testimonial.role || '');
    setLocation(testimonial.location || '');
    setContent(testimonial.content);
    setRating(testimonial.rating);
    setImage(testimonial.image || '');
    setFeatured(testimonial.featured);
    setStatus(testimonial.status);
    
    if (testimonial.packageId) {
      setRelatedType('package');
      setPackageId(testimonial.packageId);
    } else if (testimonial.activityId) {
      setRelatedType('activity');
      setActivityId(testimonial.activityId);
    } else {
      setRelatedType('none');
    }
    
    setIsLoading(false);
  }, [testimonialId, getTestimonial]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!content.trim()) newErrors.content = 'Testimonial content is required';
    if (content.trim().length < 20) newErrors.content = 'Testimonial content should be at least 20 characters';
    
    if (relatedType === 'package' && !packageId) {
      newErrors.packageId = 'Please select a package';
    }
    
    if (relatedType === 'activity' && !activityId) {
      newErrors.activityId = 'Please select an activity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Create testimonial object
    const testimonialData = {
      name,
      role: role || undefined,
      location: location || undefined,
      content,
      rating,
      image: image || undefined,
      packageId: relatedType === 'package' ? packageId : undefined,
      activityId: relatedType === 'activity' ? activityId : undefined,
      featured,
      status,
    };
    
    // Update testimonial in store
    updateTestimonial(testimonialId, testimonialData);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Reset form and redirect after delay
    setTimeout(() => {
      router.push('/admin-dashboard/testimonials');
    }, 1500);
  };

  // Handle cancel
  const handleCancel = () => {
    const testimonial = getTestimonial(testimonialId);
    
    const hasChanges = 
      testimonial?.name !== name ||
      testimonial?.role !== role ||
      testimonial?.location !== location ||
      testimonial?.content !== content ||
      testimonial?.rating !== rating ||
      testimonial?.image !== image ||
      testimonial?.featured !== featured ||
      testimonial?.status !== status ||
      (testimonial?.packageId ? 'package' : testimonial?.activityId ? 'activity' : 'none') !== relatedType ||
      testimonial?.packageId !== packageId ||
      testimonial?.activityId !== activityId;
    
    if (hasChanges) {
      setShowConfirmModal(true);
    } else {
      router.push('/admin-dashboard/testimonials');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bento-card p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">Testimonial Not Found</h3>
        <p className="text-white/60 mb-6">
          The testimonial you're trying to edit doesn't exist or has been deleted.
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
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Testimonial</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2 rounded-lg bg-dark-800 border ${
                      errors.name ? 'border-red-500' : 'border-dark-700'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">
                    Role/Occupation
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 rounded-lg bg-dark-800 border border-dark-700"
                    placeholder="E.g., Travel Enthusiast, Photographer"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 rounded-lg bg-dark-800 border border-dark-700"
                    placeholder="E.g., United States, Canada"
                  />
                </div>
              </div>
            </div>
            
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Testimonial Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className={`w-full p-2 rounded-lg bg-dark-800 border ${
                      errors.content ? 'border-red-500' : 'border-dark-700'
                    }`}
                    placeholder="Enter testimonial content"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Media & Settings */}
          <div className="space-y-6">
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Profile Image</h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {sampleImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImage(img)}
                      className={`relative h-16 w-16 rounded-full overflow-hidden border-2 ${
                        image === img ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Sample ${index + 1}`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                      {image === img && (
                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                          <CheckCircle className="text-primary-500" size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {image && image !== '' && !sampleImages.includes(image) && (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary-500">
                      <Image
                        src={image}
                        alt="Custom image"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-0 right-0 bg-red-500 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="h-16 w-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center hover:border-primary-500"
                  >
                    <Upload size={20} className="text-white/60" />
                  </button>
                </div>
                
                <p className="text-sm text-white/60">
                  Select a profile image for the testimonial or leave blank to use initials.
                </p>
              </div>
            </div>
            
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Related Package/Activity</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Testimonial Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRelatedType('none')}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                        relatedType === 'none'
                          ? 'bg-primary-600/20 border-primary-500 text-primary-500'
                          : 'border-dark-700 hover:border-white/40'
                      }`}
                    >
                      <Star size={24} className="mb-2" />
                      <span className="text-sm">General</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setRelatedType('package');
                        setActivityId('');
                      }}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                        relatedType === 'package'
                          ? 'bg-primary-600/20 border-primary-500 text-primary-500'
                          : 'border-dark-700 hover:border-white/40'
                      }`}
                    >
                      <Package size={24} className="mb-2" />
                      <span className="text-sm">Package</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setRelatedType('activity');
                        setPackageId('');
                      }}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                        relatedType === 'activity'
                          ? 'bg-primary-600/20 border-primary-500 text-primary-500'
                          : 'border-dark-700 hover:border-white/40'
                      }`}
                    >
                      <Palmtree size={24} className="mb-2" />
                      <span className="text-sm">Activity</span>
                    </button>
                  </div>
                </div>
                
                {relatedType === 'package' && (
                  <div>
                    <label htmlFor="packageId" className="block text-sm font-medium mb-1">
                      Select Package
                    </label>
                    <select
                      id="packageId"
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className={`w-full p-2 rounded-lg bg-dark-800 border ${
                        errors.packageId ? 'border-red-500' : 'border-dark-700'
                      }`}
                    >
                      <option value="">Select a package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                    {errors.packageId && (
                      <p className="mt-1 text-sm text-red-500">{errors.packageId}</p>
                    )}
                  </div>
                )}
                
                {relatedType === 'activity' && (
                  <div>
                    <label htmlFor="activityId" className="block text-sm font-medium mb-1">
                      Select Activity
                    </label>
                    <select
                      id="activityId"
                      value={activityId}
                      onChange={(e) => setActivityId(e.target.value)}
                      className={`w-full p-2 rounded-lg bg-dark-800 border ${
                        errors.activityId ? 'border-red-500' : 'border-dark-700'
                      }`}
                    >
                      <option value="">Select an activity</option>
                      {activities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      ))}
                    </select>
                    {errors.activityId && (
                      <p className="mt-1 text-sm text-red-500">{errors.activityId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Testimonial
                  </label>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                        featured ? 'bg-primary-500' : 'bg-dark-700'
                      }`}
                    />
                    <span
                      className={`absolute h-5 w-5 rounded-full bg-white transition-transform top-0.5 ${
                        featured ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'pending' | 'rejected')}
                    className="w-full p-2 rounded-lg bg-dark-800 border border-dark-700"
                  >
                    <option value="published">Published</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-dark-700 rounded-lg hover:bg-dark-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Discard Changes?</h3>
            <p className="text-white/60 mb-6">
              You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white"
              >
                Continue Editing
              </button>
              <button
                onClick={() => router.push('/admin-dashboard/testimonials')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Testimonial Updated!</h3>
            <p className="text-white/60 mb-6">
              Your testimonial has been successfully updated. Redirecting to testimonials list...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
