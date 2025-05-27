'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Upload, X, Check, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePackagesStore } from '@/lib/store/packages';
import MediaGallery from '@/components/MediaGallery';
import type { MediaItem, Package } from '@/lib/store/packages';

export default function EditPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const getPackage = usePackagesStore((state) => state.getPackage);
  const updatePackage = usePackagesStore((state) => state.updatePackage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    duration: '',
    minParticipants: '',
    startDate: '',
    endDate: '',
    location: '',
    category: '',
    status: 'draft' as Package['status'],
    included: [''],
    notIncluded: [''],
    highlights: [''],
    itinerary: [{
      id: crypto.randomUUID(),
      day: 1,
      title: '',
      description: '',
      activities: [''],
      meals: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      accommodation: ''
    }]
  });

  useEffect(() => {
    const packageData = getPackage(params.id);
    if (!packageData) {
      router.push('/admin-dashboard/packages');
      return;
    }

    // Set form data
    setFormData({
      name: packageData.name || '',
      description: packageData.description || '',
      shortDescription: packageData.shortDescription || '',
      price: packageData.price?.toString() || '',
      duration: packageData.duration?.toString() || '',
      minParticipants: packageData.minParticipants?.toString() || '',
      startDate: packageData.startDate || '',
      endDate: packageData.endDate || '',
      location: packageData.location || '',
      category: packageData.category || '',
      status: packageData.status || 'draft',
      included: Array.isArray(packageData.included) && packageData.included.length > 0 
        ? packageData.included.map(item => item || '')
        : [''],
      notIncluded: Array.isArray(packageData.notIncluded) && packageData.notIncluded.length > 0
        ? packageData.notIncluded.map(item => item || '')
        : [''],
      highlights: Array.isArray(packageData.highlights) && packageData.highlights.length > 0
        ? packageData.highlights.map(item => item || '')
        : [''],
      itinerary: Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0
        ? packageData.itinerary.map(day => ({
            id: day.id || crypto.randomUUID(),
            day: day.day || 1,
            title: day.title || '',
            description: day.description || '',
            activities: Array.isArray(day.activities) ? day.activities.map(activity => activity || '') : [''],
            meals: {
              breakfast: day.meals?.breakfast || '',
              lunch: day.meals?.lunch || '',
              dinner: day.meals?.dinner || ''
            },
            accommodation: day.accommodation || ''
          }))
        : [{
            id: crypto.randomUUID(),
            day: 1,
            title: '',
            description: '',
            activities: [''],
            meals: {
              breakfast: '',
              lunch: '',
              dinner: ''
            },
            accommodation: ''
          }]
    });

    // Set preview image
    if (packageData.image) {
      setPreviewImage(packageData.image);
    }

    // Set media gallery
    if (packageData.mediaGallery) {
      setMediaGallery(packageData.mediaGallery);
    }
  }, [params.id, getPackage, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
  const handleArrayFieldChange = (index: number, value: string, fieldName: 'included' | 'notIncluded' | 'highlights') => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [fieldName]: newArray }));
  };

  // Add new item to array fields
  const addArrayItem = (fieldName: 'included' | 'notIncluded' | 'highlights') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (index: number, fieldName: 'included' | 'notIncluded' | 'highlights') => {
    if (formData[fieldName].length > 1) {
      const newArray = [...formData[fieldName]];
      newArray.splice(index, 1);
      setFormData(prev => ({ ...prev, [fieldName]: newArray }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!previewImage) {
      newErrors.image = 'Package image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) return;
    
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      // Convert string values to appropriate types
      const updatedPackage = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        minParticipants: formData.minParticipants ? Number(formData.minParticipants) : undefined,
        image: previewImage!,
        mediaGallery: mediaGallery || [],
        included: formData.included.filter(Boolean),
        notIncluded: formData.notIncluded.filter(Boolean),
        highlights: formData.highlights.filter(Boolean),
      };
      
      // Update the package
      updatePackage(params.id, updatedPackage);
      
      // Use router.push instead of window.location.href
      router.push('/admin-dashboard/packages');
    } catch (error) {
      console.error('Error updating package:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCancelConfirmation(true);
  };

  // Add itinerary day
  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          id: crypto.randomUUID(),
          day: prev.itinerary.length + 1,
          title: '',
          description: '',
          activities: [''],
          meals: {
            breakfast: '',
            lunch: '',
            dinner: ''
          },
          accommodation: ''
        }
      ]
    }));
  };

  // Remove itinerary day
  const removeItineraryDay = (index: number) => {
    if (formData.itinerary.length > 1) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary
          .filter((_, i) => i !== index)
          .map((day, i) => ({ ...day, day: i + 1 }))
      }));
    }
  };

  // Update itinerary day
  const updateItineraryDay = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  // Add activity to itinerary day
  const addActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: [...(day.activities || []), ''] }
          : day
      )
    }));
  };

  // Remove activity from itinerary day
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? { 
              ...day, 
              activities: day.activities.filter((_, j) => j !== activityIndex)
            }
          : day
      )
    }));
  };

  // Update activity in itinerary day
  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              activities: day.activities.map((activity, j) => 
                j === activityIndex ? value : activity
              )
            }
          : day
      )
    }));
  };

  // Update meals in itinerary day
  const updateMeals = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              meals: { ...day.meals, [mealType]: value }
            }
          : day
      )
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin-dashboard/packages" 
          className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Edit Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Package Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Bali Adventure Package"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-white/80 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief one-line description (displayed in cards)"
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-white/60">{formData.shortDescription.length}/100 characters</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
                    Full Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Detailed description of the package"
                  />
                </div>
              </div>
            </div>

            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Package Highlights</h2>
              
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

            <div className="bento-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Day-wise Itinerary</h2>
              
              <div className="space-y-8">
                {formData.itinerary.map((day, dayIndex) => (
                  <div key={day.id} className="space-y-4 pb-6 border-b border-dark-700 last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Day {day.day}</h3>
                      {formData.itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(dayIndex)}
                          className="p-2 text-white/60 hover:text-red-500"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                          className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Arrival and Welcome Dinner"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Description
                        </label>
                        <textarea
                          value={day.description}
                          onChange={(e) => updateItineraryDay(dayIndex, 'description', e.target.value)}
                          rows={3}
                          className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Describe the day's activities and experiences"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Activities
                        </label>
                        <div className="space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder={`Activity #${activityIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeActivity(dayIndex, activityIndex)}
                                className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addActivity(dayIndex)}
                            className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                          >
                            + Add Activity
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-1">
                            Breakfast
                          </label>
                          <input
                            type="text"
                            value={day.meals.breakfast}
                            onChange={(e) => updateMeals(dayIndex, 'breakfast', e.target.value)}
                            className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Breakfast details"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-1">
                            Lunch
                          </label>
                          <input
                            type="text"
                            value={day.meals.lunch}
                            onChange={(e) => updateMeals(dayIndex, 'lunch', e.target.value)}
                            className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Lunch details"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-1">
                            Dinner
                          </label>
                          <input
                            type="text"
                            value={day.meals.dinner}
                            onChange={(e) => updateMeals(dayIndex, 'dinner', e.target.value)}
                            className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Dinner details"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Accommodation
                        </label>
                        <input
                          type="text"
                          value={day.accommodation}
                          onChange={(e) => updateItineraryDay(dayIndex, 'accommodation', e.target.value)}
                          className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Luxury Resort & Spa"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                >
                  + Add Day
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bento-card p-6 space-y-6">
                <h2 className="text-xl font-semibold">What's Included</h2>
                
                <div className="space-y-4">
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange(index, e.target.value, 'included')}
                        className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Included item #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'included')}
                        className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('included')}
                    className="px-4 py-2 border border-dashed border-dark-700 rounded-lg text-white/60 hover:text-white hover:border-primary-500 transition-colors w-full"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              <div className="bento-card p-6 space-y-6">
                <h2 className="text-xl font-semibold">What's Not Included</h2>
                
                <div className="space-y-4">
                  {formData.notIncluded.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange(index, e.target.value, 'notIncluded')}
                        className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Not included item #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'notIncluded')}
                        className="p-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('notIncluded')}
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
              <h2 className="text-xl font-semibold">Package Image</h2>
              
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-lg ${errors.image ? 'border-red-500' : 'border-dark-700'} p-4 text-center`}>
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Package preview" 
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
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
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
              <h2 className="text-xl font-semibold">Package Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-white/80 mb-1">
                    Price (USD)
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
                      className="block w-full pl-8 px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-white/80 mb-1">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label htmlFor="minParticipants" className="block text-sm font-medium text-white/80 mb-1">
                    Min Participants
                  </label>
                  <input
                    type="number"
                    id="minParticipants"
                    name="minParticipants"
                    value={formData.minParticipants}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="wellness">Wellness</option>
                    <option value="food">Food & Dining</option>
                    <option value="water">Water Activities</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white/80 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Ubud, Bali"
                  />
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
                    <option value="available">Available</option>
                    <option value="almost_full">Almost Full</option>
                    <option value="full">Full</option>
                  </select>
                  <p className="mt-1 text-xs text-white/60 flex items-center gap-1">
                    <Info size={12} />
                    <span>Draft packages won't be visible on the website</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-white/80 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-white/80 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Submit Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowConfirmation(false);
        }}>
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Save Changes</h3>
            <p className="text-white/60 mb-6">Are you sure you want to save these changes?</p>
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowCancelConfirmation(false);
        }}>
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Discard Changes?</h3>
            <p className="text-white/60 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowCancelConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin-dashboard/packages')}
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