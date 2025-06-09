import { create } from 'zustand'
import { getPackages, getPackageById, syncPackagesToStore } from '@/lib/utils/apiUtils'

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  title?: string
  description?: string
  thumbnail?: string
}

export interface Package {
  id: string
  name: string
  description: string
  shortDescription?: string
  price: number
  duration: number
  location: string
  category: string
  tourType: 'FIT' | 'GIT'
  status: 'available' | 'almost_full' | 'full' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  published: boolean
  publishedAt?: Date
  scheduledAt?: Date
  startDate?: string
  endDate?: string
  minParticipants?: number
  image?: string
  mediaGallery: {
    id: string
    type: 'image' | 'video'
    url: string
    title?: string
    description?: string
  }[]
  highlights?: string[]
  included?: string[]
  notIncluded?: string[]
  itinerary: {
    id: string
    day: number
    title: string
    description: string
    activities: string[]
    meals: {
      breakfast?: string
      lunch?: string
      dinner?: string
    }
    accommodation?: string
  }[]
  createdAt: Date
  updatedAt: Date
  language?: string
  slug?: string
}

interface PackagesState {
  packages: Package[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalCount: number
  searchQuery: string
  statusFilter: string
  categoryFilter: string
  tourTypeFilter: 'ALL' | 'FIT' | 'GIT'
  featuredFilter: boolean | null
  trendingFilter: boolean | null
  bestSellerFilter: boolean | null
  locationFilter: string
  languageFilter: string
  minPriceFilter: number | null
  maxPriceFilter: number | null
  minDurationFilter: number | null
  maxDurationFilter: number | null
  
  // Actions
  fetchPackages: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    category?: string
    language?: string
    tourType?: 'FIT' | 'GIT'
    featured?: boolean
    trending?: boolean
    bestSeller?: boolean
    location?: string
    minPrice?: number
    maxPrice?: number
    minDuration?: number
    maxDuration?: number
  }) => Promise<void>
  fetchFITPackages: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) => Promise<void>
  fetchGITPackages: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    upcoming?: boolean
  }) => Promise<void>
  addPackage: (packageData: any) => Promise<Package | null>
  updatePackage: (id: string, packageData: any) => Promise<Package | null>
  deletePackage: (id: string) => Promise<boolean>
  getPackage: (id: string) => Promise<Package | null>
  getFITPackage: (id: string) => Promise<Package | null>
  getGITPackage: (id: string) => Promise<Package | null>
  publishPackage: (id: string) => Promise<boolean>
  unpublishPackage: (id: string) => Promise<boolean>
  schedulePackage: (id: string, scheduledAt: Date) => Promise<boolean>
  
  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setCategoryFilter: (category: string) => void
  setTourTypeFilter: (tourType: 'ALL' | 'FIT' | 'GIT') => void
  setCurrentPage: (page: number) => void
}

// Create the store with React 19 compatibility in mind
export const usePackagesStore = create<PackagesState>((set, get) => ({
    packages: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    searchQuery: '',
    statusFilter: '',
    categoryFilter: '',
    tourTypeFilter: 'ALL',
    featuredFilter: null,
    trendingFilter: null,
    bestSellerFilter: null,
    locationFilter: '',
    languageFilter: 'EN',
    minPriceFilter: null,
    maxPriceFilter: null,
    minDurationFilter: null,
    maxDurationFilter: null,

    fetchPackages: async (params = {}) => {
      set({ loading: true, error: null })
      try {
        const state = get()
        const queryParams = new URLSearchParams()
        
        // Pagination parameters
        if (params.page) queryParams.set('page', params.page.toString())
        if (params.limit) queryParams.set('limit', params.limit.toString())
        
        // Basic search parameters
        if (params.search || state.searchQuery) queryParams.set('search', params.search || state.searchQuery)
        if (params.status || state.statusFilter) queryParams.set('status', params.status || state.statusFilter)
        if (params.category || state.categoryFilter) queryParams.set('category', params.category || state.categoryFilter)
        if (params.language || state.languageFilter) queryParams.set('language', params.language || state.languageFilter)
        if (params.tourType || (state.tourTypeFilter !== 'ALL' && state.tourTypeFilter)) {
          queryParams.set('tourType', params.tourType || state.tourTypeFilter)
        }
        
        // Advanced filtering
        if (params.featured !== undefined || state.featuredFilter !== null) {
          queryParams.set('featured', String(params.featured ?? state.featuredFilter))
        }
        if (params.trending !== undefined || state.trendingFilter !== null) {
          queryParams.set('trending', String(params.trending ?? state.trendingFilter))
        }
        if (params.bestSeller !== undefined || state.bestSellerFilter !== null) {
          queryParams.set('bestSeller', String(params.bestSeller ?? state.bestSellerFilter))
        }
        if (params.location || state.locationFilter) {
          queryParams.set('location', params.location || state.locationFilter)
        }
        
        // Price range filtering
        if (params.minPrice !== undefined || state.minPriceFilter !== null) {
          queryParams.set('minPrice', String(params.minPrice ?? state.minPriceFilter))
        }
        if (params.maxPrice !== undefined || state.maxPriceFilter !== null) {
          queryParams.set('maxPrice', String(params.maxPrice ?? state.maxPriceFilter))
        }
        
        // Duration range filtering
        if (params.minDuration !== undefined || state.minDurationFilter !== null) {
          queryParams.set('minDuration', String(params.minDuration ?? state.minDurationFilter))
        }
        if (params.maxDuration !== undefined || state.maxDurationFilter !== null) {
          queryParams.set('maxDuration', String(params.maxDuration ?? state.maxDurationFilter))
        }
        
        const response = await fetch(`/api/packages?${queryParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }
        
        const data = await response.json()
        
        set({
          packages: data.packages || [],
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
          currentPage: params.page || 1,
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch packages',
          loading: false 
        })
      }
    },
    
    fetchFITPackages: async (params = {}) => {
      set({ loading: true, error: null })
      try {
        const queryParams = new URLSearchParams()
        
        // Add FIT specific filter
        queryParams.set('tourType', 'FIT')
        
        // Add other parameters
        if (params.page) queryParams.set('page', params.page.toString())
        if (params.limit) queryParams.set('limit', params.limit.toString())
        if (params.search) queryParams.set('search', params.search)
        if (params.status) queryParams.set('status', params.status)
        
        const response = await fetch(`/api/packages?${queryParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch FIT packages')
        }
        
        const data = await response.json()
        
        set({
          packages: data.packages || [],
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
          currentPage: params.page || 1,
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch FIT packages',
          loading: false 
        })
      }
    },
    
    fetchGITPackages: async (params = {}) => {
      set({ loading: true, error: null })
      try {
        const queryParams = new URLSearchParams()
        
        // Add GIT specific filter
        queryParams.set('tourType', 'GIT')
        
        // Add other parameters
        if (params.page) queryParams.set('page', params.page.toString())
        if (params.limit) queryParams.set('limit', params.limit.toString())
        if (params.search) queryParams.set('search', params.search)
        if (params.status) queryParams.set('status', params.status)
        if (params.upcoming) queryParams.set('upcoming', 'true')
        
        const response = await fetch(`/api/packages?${queryParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch GIT packages')
        }
        
        const data = await response.json()
        
        set({
          packages: data.packages || [],
          totalPages: data.totalPages || 1,
          totalCount: data.totalCount || 0,
          currentPage: params.page || 1,
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch GIT packages',
          loading: false 
        })
      }
    },
    
    addPackage: async (packageData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packageData),
        })

        if (!response.ok) {
          throw new Error('Failed to add package')
        }

        const newPackage = await response.json()
        
        // Update the packages list with the new package
        set(state => ({
          packages: [...state.packages, newPackage],
          loading: false
        }))
        
        return newPackage
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to add package',
          loading: false 
        })
        return null
      }
    },
    
    updatePackage: async (id, packageData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/packages/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packageData),
        })

        if (!response.ok) {
          throw new Error('Failed to update package')
        }

        const updatedPackage = await response.json()
        
        // Update the packages list with the updated package
        set(state => ({
          packages: state.packages.map(pkg => 
            pkg.id === id ? updatedPackage : pkg
          ),
          loading: false
        }))
        
        return updatedPackage
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update package',
          loading: false 
        })
        return null
      }
    },
    
    deletePackage: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/packages/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete package')
        }

        // Remove the deleted package from the list
        set(state => ({
          packages: state.packages.filter(pkg => pkg.id !== id),
          loading: false
        }))
        
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete package',
          loading: false 
        })
        return false
      }
    },
    
    getPackage: async (id) => {
      set({ loading: true, error: null })
      try {
        // First check if the package is already in the store
        const existingPackage = get().packages.find(pkg => pkg.id === id)
        if (existingPackage) {
          set({ loading: false })
          return existingPackage
        }
        
        // If not, fetch it from the API
        const response = await fetch(`/api/packages/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch package')
        }
        
        const packageData = await response.json()
        set({ loading: false })
        return packageData
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch package',
          loading: false 
        })
        return null
      }
    },
    
    getFITPackage: async (id) => {
      set({ loading: true, error: null })
      try {
        // First check if the package is already in the store
        const existingPackage = get().packages.find(pkg => pkg.id === id && pkg.tourType === 'FIT')
        if (existingPackage) {
          set({ loading: false })
          return existingPackage
        }
        
        // If not, fetch it from the API
        const response = await fetch(`/api/dashboard/packages/FIT/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch FIT package')
        }
        
        const packageData = await response.json()
        set({ loading: false })
        return packageData
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch FIT package',
          loading: false 
        })
        return null
      }
    },
    
    getGITPackage: async (id) => {
      set({ loading: true, error: null })
      try {
        // First check if the package is already in the store
        const existingPackage = get().packages.find(pkg => pkg.id === id && pkg.tourType === 'GIT')
        if (existingPackage) {
          set({ loading: false })
          return existingPackage
        }
        
        // If not, fetch it from the API
        const response = await fetch(`/api/dashboard/packages/GIT/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch GIT package')
        }
        
        const packageData = await response.json()
        set({ loading: false })
        return packageData
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch GIT package',
          loading: false 
        })
        return null
      }
    },
    
    publishPackage: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/packages/${id}/publish`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to publish package')
        }

        // Update the package status in the list
        set(state => ({
          packages: state.packages.map(pkg => 
            pkg.id === id ? { ...pkg, published: true, status: 'PUBLISHED' } : pkg
          ),
          loading: false
        }))
        
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to publish package',
          loading: false 
        })
        return false
      }
    },
    
    unpublishPackage: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/packages/${id}/unpublish`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to unpublish package')
        }

        // Update the package status in the list
        set(state => ({
          packages: state.packages.map(pkg => 
            pkg.id === id ? { ...pkg, published: false, status: 'DRAFT' } : pkg
          ),
          loading: false
        }))
        
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to unpublish package',
          loading: false 
        })
        return false
      }
    },
    
    schedulePackage: async (id, scheduledAt) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/packages/${id}/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scheduledAt }),
        })

        if (!response.ok) {
          throw new Error('Failed to schedule package')
        }

        // Update the package status in the list
        set(state => ({
          packages: state.packages.map(pkg => 
            pkg.id === id ? { ...pkg, scheduledAt, status: 'SCHEDULED' } : pkg
          ),
          loading: false
        }))
        
        return true
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to schedule package',
          loading: false 
        })
        return false
      }
    },
    
    // UI State setters
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setCategoryFilter: (category) => set({ categoryFilter: category }),
    setTourTypeFilter: (tourType) => set({ tourTypeFilter: tourType }),
    setCurrentPage: (page) => set({ currentPage: page }),
}))