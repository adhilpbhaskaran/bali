'use client'
import React, { useState } from 'react';
import { Upload, X, Plus, Image as ImageIcon, Video } from 'lucide-react';
import type { MediaItem } from '@/lib/store/packages';

interface MediaGalleryProps {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

export default function MediaGallery({ items, onChange }: MediaGalleryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    type: 'image',
    title: '',
    description: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const item: MediaItem = {
          id: crypto.randomUUID(),
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url,
          title: newItem.title || '',
          description: newItem.description || '',
          thumbnail: file.type.startsWith('video/') ? undefined : url,
        };
        onChange([...items, item]);
        setShowAddModal(false);
        setNewItem({ type: 'image', title: '', description: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleVideoUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling
    
    if (newItem.url) {
      const item: MediaItem = {
        id: crypto.randomUUID(),
        type: 'video',
        url: newItem.url,
        title: newItem.title || '',
        description: newItem.description || '',
      };
      onChange([...items, item]);
      setShowAddModal(false);
      setNewItem({ type: 'image', title: '', description: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.title || ''}
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="relative w-full h-32 bg-dark-700 rounded-lg flex items-center justify-center">
                <Video className="w-8 h-8 text-white/60" />
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title || ''}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-50"
                  />
                )}
              </div>
            )}
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="absolute top-2 right-2 p-1 rounded-full bg-dark-900/80 opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
            >
              <X size={16} className="text-white" />
            </button>
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
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddModal(true);
          }}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-700 rounded-lg hover:border-primary-500 transition-colors"
        >
          <Plus size={24} />
          <span className="text-sm">Add Media</span>
        </button>
      </div>

      {/* Add Media Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-media-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowAddModal(false);
            }
          }}
        >
          <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 id="add-media-title" className="text-lg font-semibold mb-4">Add Media</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4" role="radiogroup" aria-labelledby="media-type-label">
                <span id="media-type-label" className="sr-only">Select media type</span>
                <button
                  type="button"
                  onClick={() => setNewItem((prev: Partial<MediaItem>) => ({ ...prev, type: 'image' }))}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    newItem.type === 'image' ? 'border-primary-500' : 'border-dark-700'
                  } flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800`}
                  role="radio"
                  aria-checked={newItem.type === 'image'}
                  aria-label="Select image type"
                >
                  <ImageIcon size={24} aria-hidden="true" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewItem((prev: Partial<MediaItem>) => ({ ...prev, type: 'video' }))}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    newItem.type === 'video' ? 'border-primary-500' : 'border-dark-700'
                  } flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800`}
                  role="radio"
                  aria-checked={newItem.type === 'video'}
                  aria-label="Select video type"
                >
                  <Video size={24} aria-hidden="true" />
                  <span>Video</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="media-title" className="block text-sm font-medium text-white/80 mb-1">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    id="media-title"
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem((prev: Partial<MediaItem>) => ({ ...prev, title: e.target.value }))}
                    className="block w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter a title"
                    aria-required="false"
                  />
                </div>

                <div>
                  <label htmlFor="media-description" className="block text-sm font-medium text-white/80 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    id="media-description"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem((prev: Partial<MediaItem>) => ({ ...prev, description: e.target.value }))}
                    className="block w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter a description"
                    aria-required="false"
                  />
                </div>

                {newItem.type === 'image' ? (
                  <div>
                    <label 
                      htmlFor="media-upload" 
                      className="block text-sm font-medium text-white/80 mb-1"
                    >
                      Upload Image
                    </label>
                    <div 
                      className="border-2 border-dashed border-dark-700 rounded-lg p-4 text-center"
                      role="button"
                      tabIndex={0}
                      aria-describedby="upload-instructions"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          document.getElementById('media-upload')?.click();
                        }
                      }}
                    >
                      <input
                        type="file"
                        id="media-upload"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                        className="sr-only"
                        aria-describedby="upload-instructions"
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-white/40" aria-hidden="true" />
                        <p id="upload-instructions" className="text-sm text-white/60">
                          Click to upload or drag and drop
                        </p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVideoUrlSubmit} noValidate>
                    <div>
                      <label htmlFor="video-url" className="block text-sm font-medium text-white/80 mb-1">
                        Video URL
                      </label>
                      <input
                        type="url"
                        id="video-url"
                        value={newItem.url || ''}
                        onChange={(e) => setNewItem((prev: Partial<MediaItem>) => ({ ...prev, url: e.target.value }))}
                        className="block w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                        required
                        aria-required="true"
                        aria-describedby="video-url-help"
                      />
                      <p id="video-url-help" className="text-xs text-white/60 mt-1">
                        Supported platforms: YouTube, Vimeo, and direct video links
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded"
                        aria-label="Cancel adding video"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                        aria-label="Add video to gallery"
                      >
                        Add Video
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {newItem.type === 'image' && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800 rounded"
                  aria-label="Cancel adding image"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}