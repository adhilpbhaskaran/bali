'use client';

import React, { useState } from 'react';
import { Star, Send, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import BaliImage from '@/components/ui/BaliImage';

interface ReviewSubmissionFormProps {
  itemType: 'package' | 'activity';
  itemId: string;
  itemName: string;
  onSubmitSuccess?: () => void;
  className?: string;
}

interface ReviewFormData {
  name: string;
  email: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  images: File[];
}

export default function ReviewSubmissionForm({
  itemType,
  itemId,
  itemName,
  onSubmitSuccess,
  className = ''
}: ReviewSubmissionFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    email: '',
    location: '',
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormData, string>>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReviewFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.rating === 0) newErrors.rating = 'Rating is required';
    if (!formData.title.trim()) newErrors.title = 'Review title is required';
    if (!formData.comment.trim()) newErrors.comment = 'Review comment is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    const newImages = [...formData.images, ...files];
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('itemType', itemType);
      submitData.append('itemId', itemId);
      submitData.append('itemName', itemName);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('location', formData.location);
      submitData.append('rating', formData.rating.toString());
      submitData.append('title', formData.title);
      submitData.append('comment', formData.comment);
      
      // Add images
      formData.images.forEach((image, index) => {
        submitData.append(`image_${index}`, image);
      });
      
      // Submit to API
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        body: submitData
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        onSubmitSuccess?.();
        
        // Reset form after delay
        setTimeout(() => {
          setShowForm(false);
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            location: '',
            rating: 0,
            title: '',
            comment: '',
            images: []
          });
          setImagePreviews([]);
        }, 3000);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bento-card p-6 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-white/80 mb-4">
          Your review has been submitted successfully. It will be published after moderation.
        </p>
        <p className="text-white/60 text-sm">
          We appreciate your feedback and it helps other travelers make informed decisions.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className={`bento-card p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Share Your Experience</h3>
          <p className="text-white/80 mb-4">
            Help other travelers by sharing your experience with {itemName}
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Write a Review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bento-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Write a Review</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={errors.location ? 'border-red-500' : ''}
              placeholder="City, Country"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={errors.email ? 'border-red-500' : ''}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <p className="text-white/60 text-sm mt-1">Your email will not be published</p>
        </div>

        {/* Rating */}
        <div>
          <Label>Rating *</Label>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-white/30'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-white/80">
              {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
            </span>
          </div>
          {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
        </div>

        {/* Review Title */}
        <div>
          <Label htmlFor="title">Review Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={errors.title ? 'border-red-500' : ''}
            placeholder="Summarize your experience"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Review Comment */}
        <div>
          <Label htmlFor="comment">Your Review *</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            className={`min-h-[120px] ${errors.comment ? 'border-red-500' : ''}`}
            placeholder="Share your detailed experience, what you liked, and any tips for future travelers..."
          />
          {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image-upload">Photos (Optional)</Label>
          <p id="image-upload-description" className="text-white/60 text-sm mb-2">
            Add up to 5 photos to showcase your experience. Accepted formats: JPG, PNG, GIF
          </p>
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4" role="list" aria-label="Uploaded photos">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden" role="listitem">
                  <img
                    src={preview}
                    alt={`Uploaded photo ${index + 1} of ${imagePreviews.length}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {formData.images.length < 5 && (
            <div 
              className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center"
              role="button"
              tabIndex={0}
              aria-describedby="image-upload-description"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('image-upload')?.click();
                }
              }}
            >
              <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" aria-hidden="true" />
              <p className="text-white/70 mb-2">Click to upload photos</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
                id="image-upload"
                aria-describedby="image-upload-description"
                aria-invalid={errors.images ? 'true' : 'false'}
              />
              <Label
                htmlFor="image-upload"
                className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900"
              >
                Choose Files
              </Label>
            </div>
          )}
          {errors.images && (
            <p className="text-red-500 text-sm mt-1" role="alert" aria-live="polite">
              {errors.images}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 hover:bg-primary-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={16} />
                Submit Review
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}