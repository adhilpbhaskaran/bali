'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import FormWrapper from '@/components/FormWrapper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Check, 
  Info
} from 'lucide-react';
import { useActivitiesStore } from '@/lib/store/activities';
import MediaGallery from '@/components/MediaGallery';
import type { MediaItem } from '@/lib/store/activities';

export default function NewActivityPage() {
  // Use client-side only rendering to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter();
  const addActivity = useActivitiesStore((state) => state.addActivity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    duration: '',
    category: '',
    location: '',
    includedItems: [''],
    excludedItems: [''],
    highlights: [''],
    status: 'draft' as const,
    taxRate: '5'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle array field changes (included items, excluded items, highlights)
  const handleArrayFieldChange = (index: number, value: string, fieldName: 'includedItems' | 'excludedItems' | 'highlights') => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [fieldName]: newArray }));
  };

  // Add new item to array fields
  const addArrayItem = (fieldName: 'includedItems' | 'excludedItems' | 'highlights') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (index: number, fieldName: 'includedItems' | 'excludedItems' | 'highlights') => {
    if (formData[fieldName].length > 1) {
      const newArray = [...formData[fieldName]];
      newArray.splice(index, 1);
      setFormData(prev => ({ ...prev, [fieldName]: newArray }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent any form submission
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove preview image
  const removeImage = () => {
    setPreviewImage(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!previewImage) newErrors.image = 'Activity image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling
    
    // Reset error states
    setShowErrorMessage(false);
    
    if (!validateForm()) return;
    
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    // Reset error and success states
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
    setErrorMessage('');
    
    // Add the new activity to the store
    const success = addActivity({
      ...formData,
      price: Number(formData.price),
      image: previewImage || undefined,
      mediaGallery,
    });
    
    if (success) {
      // Show success message
      setShowSuccessMessage(true);
      
      // Redirect to activities list after a delay
      setTimeout(() => {
        router.push('/admin-dashboard/activities');
      }, 2000);
    } else {
      // Show error message
      setErrorMessage('Failed to save activity. Please try again.');
      setShowErrorMessage(true);
      
      // Clear error message after delay
      setTimeout(() => {
        setShowErrorMessage(false);
        setErrorMessage('');
        setIsSubmitting(false);
      }, 5000);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value !== '') || previewImage) {
      setShowCancelConfirmation(true);
    } else {
      router.push('/admin-dashboard/activities');
    }
  };

  // Don't render until client-side to prevent hydration errors
  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin-dashboard/activities" 
          className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Add New Activity</h1>
      </div>

      <FormWrapper onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Activity Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                    Activity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="e.g., Mount Batur Sunrise Trek"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-white/80 mb-1">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${errors.shortDescription ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="Brief one-line description (displayed in cards)"
                    maxLength={100}
                  />
                  {errors.shortDescription ? (
                    <p className="mt-1 text-sm text-red-500">{errors.shortDescription}</p>
                  ) : (
                    <p className="mt-1 text-xs text-white/60">{formData.shortDescription.length}/100 characters</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`block w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="Detailed description of the activity"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Activity Highlights</h2>
              
              <div className="space-y-4">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayFieldChange(index, e.target.value, 'highlights')}
                      className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`Highlight #${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'highlights')}
                      className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                >
                  + Add Highlight
                </button>
              </div>
            </div>

            <div className="bento-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Media Gallery</h2>
                <p className="text-sm text-white/60">Add additional images and videos</p>
              </div>
              
              <MediaGallery
                items={mediaGallery}
                onChange={setMediaGallery}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bento-card p-6 space-y-6">
                <h2 className="text-xl font-semibold">What&apos;s Included</h2>
                
                <div className="space-y-4">
                  {formData.includedItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange(index, e.target.value, 'includedItems')}
                        className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Included item #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'includedItems')}
                        className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('includedItems')}
                    className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              <div className="bento-card p-6 space-y-6">
                <h2 className="text-xl font-semibold">What&apos;s Not Included</h2>
                
                <div className="space-y-4">
                  {formData.excludedItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange(index, e.target.value, 'excludedItems')}
                        className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Excluded item #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'excludedItems')}
                        className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('excludedItems')}
                    className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Activity Image</h2>
              
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-lg ${errors.image ? 'border-red-500' : 'border-dark-700'} p-4 text-center`}>
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Activity preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 rounded-full bg-dark-900/80 hover:bg-red-500/80 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-white/40" />
                      </div>
                      <p className="mt-2 text-sm text-white/60">
                        Drag and drop an image, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        Recommended: 1200 x 800px (3:2 ratio)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                  >
                    {previewImage ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image}</p>
                )}
              </div>
            </div>

            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Activity Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-white/80 mb-1">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white/40">$</span>
                    </div>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`block w-full pl-8 px-4 py-3 border ${errors.price ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-white/80 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`block w-full px-4 py-3 border ${errors.taxRate ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="5.0"
                  />
                  <p className="mt-1 text-xs text-white/60">Default tax rate is 5%. Enter percentage value (e.g., 5 for 5%)</p>
                  {errors.taxRate && (
                    <p className="mt-1 text-sm text-red-500">{errors.taxRate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-white/80 mb-1">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${errors.duration ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="e.g., 3 hours"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    <option value="">Select a category</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="wellness">Wellness</option>
                    <option value="food">Food & Dining</option>
                    <option value="water">Water Activities</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white/80 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${errors.location ? 'border-red-500' : 'border-dark-700'} rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    placeholder="e.g., Ubud, Bali"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-white/80 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                  <p className="mt-1 text-xs text-white/60 flex items-center gap-1">
                    <Info size={12} />
                    <span>Draft activities won&apos;t be visible on the website</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-dark-700 rounded-lg text-white hover:bg-dark-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary-600 rounded-lg text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={20} />
                <span>Save Activity</span>
              </>
            )}
          </button>
        </div>
      </FormWrapper>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
            <p className="text-white/60 mb-6">Are you sure you want to submit this activity?</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Submit
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
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Activity Added!</h3>
            <p className="text-white/60 mb-6">
              Your activity has been successfully added. Redirecting to activities list...
            </p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {showErrorMessage && errorMessage && (
        <div className="fixed bottom-4 right-4 bg-dark-800 rounded-lg shadow-lg p-4 w-80 z-50 border-l-4 border-red-500 animate-slide-up">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Info className="text-red-500 mr-3" />
              <p>{errorMessage}</p>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowErrorMessage(false);
                setErrorMessage('');
              }}
              className="text-white/60 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Discard Changes?</h3>
            <p className="text-white/60 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white"
              >
                Keep Editing
              </button>
              <button
                onClick={() => router.push('/admin-dashboard/activities')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
