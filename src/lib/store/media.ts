import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface MediaItem {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  folder?: string
  title?: string
  description?: string
  altText?: string
  caption?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
}

interface MediaState {
  media: MediaItem[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalCount: number
  searchQuery: string
  searchTerm: string
  folderFilter: string
  typeFilter: string
  selectedItems: string[]
  viewMode: 'grid' | 'list'
  pagination: {
    page: number
    totalPages: number
    total: number
    pages: number
    limit: number
  }
  filters: {
    folder?: string
    type?: string
  }
  
  // Actions
  fetchMedia: (params?: {
    page?: number
    limit?: number
    search?: string
    folder?: string
    type?: string
  }) => Promise<void>
  uploadMedia: (files: File | File[], folder?: string) => Promise<MediaItem[] | null>
  updateMedia: (id: string, mediaData: any) => Promise<MediaItem | null>
  deleteMedia: (ids: string[]) => Promise<boolean>
  bulkUpdateMedia: (ids: string[], updates: any) => Promise<boolean>
  bulkDeleteMedia: (ids: string[]) => Promise<boolean>
  getMediaItem: (id: string) => Promise<MediaItem | null>
  
  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setSearchTerm: (term: string) => void
  setFolderFilter: (folder: string) => void
  setTypeFilter: (type: string) => void
  setCurrentPage: (page: number) => void
  setSelectedItems: (items: string[]) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setFilters: (filters: { folder?: string; type?: string }) => void
  toggleSelectedItem: (id: string) => void
  clearSelection: () => void
}

export const useMediaStore = create<MediaState>()(devtools(
  (set, get) => ({
    media: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    searchQuery: '',
    searchTerm: '',
    folderFilter: '',
    typeFilter: '',
    selectedItems: [],
    viewMode: 'grid' as const,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      pages: 1,
      limit: 20
    },
    filters: {},

    fetchMedia: async (params = {}) => {
      set({ loading: true, error: null })
      try {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.set('page', params.page.toString())
        if (params.limit) queryParams.set('limit', params.limit.toString())
        if (params.search) queryParams.set('search', params.search)
        if (params.folder) queryParams.set('folder', params.folder)
        if (params.type) queryParams.set('type', params.type)

        const response = await fetch(`/api/media?${queryParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch media')
        }

        const data = await response.json()
        set({
          media: data.media,
          currentPage: data.pagination.page,
          totalPages: data.pagination.totalPages,
          totalCount: data.pagination.total,
          pagination: {
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            total: data.pagination.total,
            pages: data.pagination.totalPages,
            limit: data.pagination.limit || 20
          },
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch media',
          loading: false 
        })
      }
    },

    uploadMedia: async (files, folder) => {
      set({ loading: true, error: null })
      try {
        const formData = new FormData()
        const fileArray = Array.isArray(files) ? files : [files]
        fileArray.forEach((file) => {
          formData.append('files', file)
        })
        if (folder) {
          formData.append('folder', folder)
        }

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload media')
        }

        const uploadedMedia = await response.json()
        set((state) => ({
          media: [...uploadedMedia, ...state.media],
          totalCount: state.totalCount + uploadedMedia.length,
          loading: false
        }))
        return uploadedMedia
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to upload media',
          loading: false 
        })
        return null
      }
    },

    updateMedia: async (id, mediaData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mediaData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update media')
        }

        const updatedMedia = await response.json()
        set((state) => ({
          media: state.media.map((item) =>
            item.id === id ? updatedMedia : item
          ),
          loading: false
        }))
        return updatedMedia
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update media',
          loading: false 
        })
        return null
      }
    },

    deleteMedia: async (ids) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/media', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete media')
        }

        set((state) => ({
          media: state.media.filter((item) => !ids.includes(item.id)),
          totalCount: state.totalCount - ids.length,
          selectedItems: state.selectedItems.filter(id => !ids.includes(id)),
          loading: false
        }))
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete media',
          loading: false 
        })
        return false
      }
    },

    bulkUpdateMedia: async (ids, updates) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/media', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids, updates }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to bulk update media')
        }

        const updatedMedia = await response.json()
        set((state) => ({
          media: state.media.map((item) => {
            const updated = updatedMedia.find((u: MediaItem) => u.id === item.id)
            return updated || item
          }),
          loading: false
        }))
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to bulk update media',
          loading: false 
        })
        return false
      }
    },

    getMediaItem: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/media/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch media item')
        }

        const mediaItem = await response.json()
        set({ loading: false })
        return mediaItem
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch media item',
          loading: false 
        })
        return null
      }
    },

    bulkDeleteMedia: async (ids) => {
      return await get().deleteMedia(ids)
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setFolderFilter: (folder) => set({ folderFilter: folder }),
    setTypeFilter: (type) => set({ typeFilter: type }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setSelectedItems: (items) => set({ selectedItems: items }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setFilters: (filters) => set({ filters }),
    
    toggleSelectedItem: (id) => {
      set((state) => ({
        selectedItems: state.selectedItems.includes(id)
          ? state.selectedItems.filter(item => item !== id)
          : [...state.selectedItems, id]
      }))
    },
    
    clearSelection: () => set({ selectedItems: [] }),
  }),
  { name: 'media-store' }
))