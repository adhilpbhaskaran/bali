'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Download, 
  Copy, 
  MoreHorizontal,
  FolderPlus,
  X,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
  uploadedAt: string;
  dimensions?: string;
}

// Sample media data (in a real app, this would come from your database)
const SAMPLE_MEDIA = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image/jpeg',
    url: '/images/hero-banner.jpg',
    size: '2.4 MB',
    uploadedAt: '2024-02-20',
    dimensions: '1920x1080'
  },
  {
    id: '2',
    name: 'about-us.jpg',
    type: 'image/jpeg',
    url: '/images/about-us.jpg',
    size: '1.8 MB',
    uploadedAt: '2024-02-19',
    dimensions: '1600x900'
  },
  {
    id: '3',
    name: 'mount-batur.jpg',
    url: '/images/activities/mount-batur.jpg',
    size: '1.2 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:30:00Z',
  },
  {
    id: '4',
    name: 'monkey-forest.jpg',
    url: '/images/activities/monkey-forest.jpg',
    size: '0.9 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:35:00Z',
  },
  {
    id: '5',
    name: 'bali-swing.jpg',
    url: '/images/activities/bali-swing.jpg',
    size: '1.5 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:40:00Z',
  },
  {
    id: '6',
    name: 'spa.jpg',
    url: '/images/activities/spa.jpg',
    size: '0.8 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:45:00Z',
  },
  {
    id: '7',
    name: 'uluwatu.jpg',
    url: '/images/activities/uluwatu.jpg',
    size: '1.3 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:50:00Z',
  },
  {
    id: '8',
    name: 'nusa-penida.jpg',
    url: '/images/activities/nusa-penida.jpg',
    size: '1.7 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T10:55:00Z',
  },
  {
    id: '9',
    name: 'rice-terraces.jpg',
    url: '/images/activities/rice-terraces.jpg',
    size: '1.1 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-15T11:00:00Z',
  },
  {
    id: '10',
    name: 'hero-background.jpg',
    url: '/images/hero-background.jpg',
    size: '2.3 MB',
    dimensions: '1920 x 1080',
    type: 'image/jpeg',
    uploadedAt: '2025-04-10T09:00:00Z',
  },
  {
    id: '11',
    name: 'logo.png',
    url: '/images/logo.png',
    size: '0.2 MB',
    dimensions: '200 x 60',
    type: 'image/png',
    uploadedAt: '2025-04-05T14:20:00Z',
  },
  {
    id: '12',
    name: 'package-luxury.jpg',
    url: '/images/packages/luxury.jpg',
    size: '1.8 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-12T16:45:00Z',
  },
  {
    id: '13',
    name: 'package-adventure.jpg',
    url: '/images/packages/adventure.jpg',
    size: '1.6 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-12T16:50:00Z',
  },
  {
    id: '14',
    name: 'package-family.jpg',
    url: '/images/packages/family.jpg',
    size: '1.4 MB',
    dimensions: '1200 x 800',
    type: 'image/jpeg',
    uploadedAt: '2025-04-12T16:55:00Z',
  },
];

// Sample folders
const SAMPLE_FOLDERS = [
  { id: '1', name: 'All', count: SAMPLE_MEDIA.length },
  { id: '2', name: 'activities', count: SAMPLE_MEDIA.filter(m => m.type.startsWith('image/')).length },
  { id: '3', name: 'packages', count: SAMPLE_MEDIA.filter(m => m.type.startsWith('image/')).length },
  { id: '4', name: 'hero', count: SAMPLE_MEDIA.filter(m => m.type.startsWith('image/')).length },
  { id: '5', name: 'branding', count: SAMPLE_MEDIA.filter(m => m.type.startsWith('image/')).length },
];

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<{id: string; name: string; count: number}[]>([]);

  // Simulated data fetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMediaItems(SAMPLE_MEDIA);
      setFolders(SAMPLE_FOLDERS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Filter media by search term and folder
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || item.type.startsWith('image/');
    return matchesSearch && matchesFolder;
  });

  // Toggle item selection
  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        // In a real app, you would upload the files to your server/storage
        setIsUploading(false);
        
        // Refresh the media list (simulated)
        // In a real app, you would fetch the updated list from your API
      }, 2000);
    }
  };

  // Handle creating a new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // In a real app, you would create the folder in your database/storage
      const newFolder = {
        id: 'new',
        name: newFolderName.trim(),
        count: 0,
      };
      
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    // In a real app, you would delete the items from your database/storage
    setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
          <label className="btn-primary px-4 py-2 flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            <span>Upload</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-white/60 hover:text-white'} transition-colors`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-white/60 hover:text-white'} transition-colors`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <div className="bento-card p-4">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <ul className="space-y-1">
              {folders.map((folder) => (
                <li key={folder.id}>
                  <button
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedFolder === folder.name
                        ? 'bg-primary-600/20 text-primary-500'
                        : 'hover:bg-dark-700 text-white/80 hover:text-white'
                    }`}
                  >
                    <span>{folder.name}</span>
                    <span className="text-xs bg-dark-700 px-2 py-0.5 rounded-full">
                      {folder.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Media Content */}
        <div className="lg:col-span-4">
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length > 0 && selectedItems.length === filteredMedia.length}
                onChange={selectAllItems}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-800"
              />
              <span className="text-sm text-white/60">
                {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
              </span>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-dark-800 text-white/60 hover:text-white transition-colors">
                  <Download size={16} />
                </button>
                <button className="p-2 rounded-lg bg-dark-800 text-white/60 hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
                <button 
                  onClick={deleteSelectedItems}
                  className="p-2 rounded-lg bg-dark-800 text-white/60 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Media Grid/List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="bento-card p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-white/40" />
              <h3 className="mt-4 text-lg font-medium">No media found</h3>
              <p className="mt-1 text-white/60">
                {searchTerm ? 'Try adjusting your search' : 'Upload some images to get started'}
              </p>
              <label className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                <Upload size={16} className="mr-2" />
                <span>Upload Images</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className={`group relative rounded-lg overflow-hidden border ${
                    selectedItems.includes(item.id) ? 'border-primary-500' : 'border-dark-700'
                  } transition-all hover:border-primary-500`}
                >
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-800/50"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {item.type.startsWith('image/') ? (
                      <Image
                    src={item.url} 
                    alt={item.name} 
                        fill
                        className="object-cover"
                  />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-dark-700">
                        <ImageIcon size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-white/60">{item.size}</p>
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button className="p-1 rounded-full bg-dark-800/80 text-white/80 hover:text-white transition-colors">
                        <Copy size={14} />
                      </button>
                      <button className="p-1 rounded-full bg-dark-800/80 text-white/80 hover:text-white transition-colors">
                        <Download size={14} />
                      </button>
                      <button className="p-1 rounded-full bg-dark-800/80 text-white/80 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bento-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider w-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.length > 0 && selectedItems.length === filteredMedia.length}
                          onChange={selectAllItems}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-800"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Preview
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Dimensions
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-900 divide-y divide-dark-800">
                    {filteredMedia.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-dark-800/50 transition-colors ${
                          selectedItems.includes(item.id) ? 'bg-primary-600/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-800"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <Image
                              src={item.url} 
                              alt={item.name} 
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium">{item.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-dark-800">
                            {item.type.split('/')[1]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                          {item.dimensions || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-white/60 hover:text-white transition-colors">
                              <Copy size={16} />
                            </button>
                            <button className="p-1 text-white/60 hover:text-white transition-colors">
                              <Download size={16} />
                            </button>
                            <button className="p-1 text-white/60 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div 
          className="fixed inset-0 bg-dark-900/80 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-folder-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewFolderModal(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowNewFolderModal(false);
            }
          }}
        >
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 id="new-folder-title" className="text-lg font-semibold">Create New Folder</h3>
              <button 
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="p-1 rounded-full hover:bg-dark-700 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="folderName" className="block text-sm font-medium text-white/80 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="block w-full px-4 py-3 border border-dark-700 rounded-lg bg-dark-900 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Blog Images"
                required
                aria-required="true"
                aria-describedby="folder-name-help"
              />
              <p id="folder-name-help" className="text-xs text-white/60 mt-1">
                Enter a descriptive name for your new folder
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 border border-dark-700 rounded-lg text-white hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                aria-label="Cancel folder creation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-primary-600 rounded-lg text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                aria-label="Create new folder"
                aria-describedby={!newFolderName.trim() ? "create-button-disabled" : undefined}
              >
                <Check size={16} aria-hidden="true" />
                <span>Create Folder</span>
              </button>
              {!newFolderName.trim() && (
                <span id="create-button-disabled" className="sr-only">
                  Button disabled: Please enter a folder name
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-dark-800 rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Uploading files...</h4>
            <button className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2 mb-2">
            <div className="bg-primary-500 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-sm text-white/60">3 of 4 files (75%)</p>
        </div>
      )}
    </div>
  );
}
