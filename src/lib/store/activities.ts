import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Activity {
  id: string
  name: string
  title: string
  description: string
  price: number
  duration: string
  location: string
  category: string
  difficulty: string
  status: 'active' | 'inactive' | 'draft'
  published: boolean
  publishedAt?: Date
  scheduledAt?: Date
  mediaGallery: {
    images: string[]
    videos: string[]
  }
  maxParticipants: number
  minParticipants: number
  ageRestriction?: {
    min?: number
    max?: number
  }
  equipment: string[]
  included: string[]
  excluded: string[]
  itinerary: {
    time: string
    activity: string
    description: string
  }[]
  meetingPoint: string
  cancellationPolicy: string
  weatherPolicy: string
  safetyGuidelines: string[]
  languages: string[]
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  trending: boolean
  popular: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  version: number
  slug: string
  availability: {
    startDate: Date
    endDate: Date
    daysOfWeek: number[]
    timeSlots: {
      startTime: string
      endTime: string
      maxParticipants: number
    }[]
  }
  pricing: {
    adult: number
    child?: number
    infant?: number
    group?: {
      minSize: number
      price: number
    }
    seasonal?: {
      startDate: Date
      endDate: Date
      multiplier: number
    }[]
  }
  reviews: {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  bookingSettings: {
    advanceBooking: {
      min: number // hours
      max: number // days
    }
    cancellation: {
      freeUntil: number // hours before
      partialRefundUntil: number // hours before
      refundPercentage: number
    }
    confirmation: 'instant' | 'manual'
    paymentRequired: 'full' | 'deposit' | 'none'
    depositPercentage?: number
  }
  customFields: {
    [key: string]: any
  }
}

export interface ActivityFilters {
  search?: string
  category?: string
  difficulty?: string
  location?: string
  language?: string
  minPrice?: number
  maxPrice?: number
  trending?: boolean
  popular?: boolean
  featured?: boolean
  status?: 'active' | 'inactive' | 'draft'
  published?: boolean
}

export interface ActivitiesState {
  activities: Activity[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalCount: number
  searchQuery: string
  searchTerm: string
  statusFilter: string
  categoryFilter: string
  difficultyFilter: string
  locationFilter: string
  languageFilter: string
  minPriceFilter: number | null
  maxPriceFilter: number | null
  trendingFilter: boolean | null
  popularFilter: boolean | null
  featuredFilter: boolean | null
  
  // Actions
  fetchActivities: (page?: number, filters?: ActivityFilters) => Promise<void>
  createActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<void>
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  publishActivity: (id: string) => Promise<void>
  unpublishActivity: (id: string) => Promise<void>
  scheduleActivity: (id: string, scheduledAt: Date) => Promise<void>
  duplicateActivity: (id: string) => Promise<void>
  bulkUpdateActivities: (ids: string[], updates: Partial<Activity>) => Promise<void>
  bulkDeleteActivities: (ids: string[]) => Promise<void>
  
  // Search and filters
  setSearchQuery: (query: string) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setCategoryFilter: (category: string) => void
  setDifficultyFilter: (difficulty: string) => void
  setLocationFilter: (location: string) => void
  setLanguageFilter: (language: string) => void
  setPriceFilter: (min: number | null, max: number | null) => void
  setTrendingFilter: (trending: boolean | null) => void
  setPopularFilter: (popular: boolean | null) => void
  setFeaturedFilter: (featured: boolean | null) => void
  clearFilters: () => void
  applyFilters: (filters: ActivityFilters) => void
  
  // Pagination
  setCurrentPage: (page: number) => void
  
  // Utility
  getActivityById: (id: string) => Activity | undefined
  getActivitiesByCategory: (category: string) => Activity[]
  getActivitiesByLocation: (location: string) => Activity[]
  getFeaturedActivities: () => Activity[]
  getTrendingActivities: () => Activity[]
  getPopularActivities: () => Activity[]
  searchActivities: (query: string) => Activity[]
}

export const useActivitiesStore = create<ActivitiesState>()(
  devtools((set, get) => ({
    activities: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    searchQuery: '',
    searchTerm: '',
    statusFilter: '',
    categoryFilter: '',
    difficultyFilter: '',
    locationFilter: '',
    languageFilter: '',
    minPriceFilter: null,
    maxPriceFilter: null,
    trendingFilter: null,
    popularFilter: null,
    featuredFilter: null,

    fetchActivities: async (page = 1, filters = {}) => {
      set({ loading: true, error: null })
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
          )
        })
        
        const response = await fetch(`/api/activities?${queryParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        
        const data = await response.json()
        set({
          activities: data.activities,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
          currentPage: page,
          loading: false
        })
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch activities',
          loading: false 
        })
      }
    },

    createActivity: async (activityData) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(activityData),
        })
        
        if (!response.ok) {
          throw new Error('Failed to create activity')
        }
        
        const newActivity = await response.json()
        set(state => ({
          activities: [newActivity, ...state.activities],
          totalCount: state.totalCount + 1,
          loading: false
        }))
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create activity',
          loading: false 
        })
      }
    },

    updateActivity: async (id, updates) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })
        
        if (!response.ok) {
          throw new Error('Failed to update activity')
        }
        
        const updatedActivity = await response.json()
        set(state => ({
          activities: state.activities.map(activity => 
            activity.id === id ? updatedActivity : activity
          ),
          loading: false
        }))
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to update activity',
          loading: false 
        })
      }
    },

    deleteActivity: async (id) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete activity')
        }
        
        set(state => ({
          activities: state.activities.filter(activity => activity.id !== id),
          totalCount: state.totalCount - 1,
          loading: false
        }))
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete activity',
          loading: false 
        })
      }
    },

    publishActivity: async (id) => {
      await get().updateActivity(id, { published: true, publishedAt: new Date() })
    },

    unpublishActivity: async (id) => {
      await get().updateActivity(id, { published: false, publishedAt: undefined })
    },

    scheduleActivity: async (id, scheduledAt) => {
      await get().updateActivity(id, { scheduledAt })
    },

    duplicateActivity: async (id) => {
      const activity = get().getActivityById(id)
      if (!activity) {
        throw new Error('Activity not found')
      }
      
      const { id: _, createdAt, updatedAt, version, slug, ...activityData } = activity
      const duplicatedActivity = {
        ...activityData,
        name: `${activity.name} (Copy)`,
        title: `${activity.title} (Copy)`,
        slug: `${activity.slug}-copy`,
        published: false,
        status: 'draft' as const
      }
      
      await get().createActivity(duplicatedActivity)
    },

    bulkUpdateActivities: async (ids, updates) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/activities/bulk', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids, updates }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to bulk update activities')
        }
        
        const updatedActivities = await response.json()
        set(state => ({
          activities: state.activities.map(activity => {
            const updated = updatedActivities.find((u: Activity) => u.id === activity.id)
            return updated || activity
          }),
          loading: false
        }))
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to bulk update activities',
          loading: false 
        })
      }
    },

    bulkDeleteActivities: async (ids) => {
      set({ loading: true, error: null })
      try {
        const response = await fetch('/api/activities/bulk', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to bulk delete activities')
        }
        
        set(state => ({
          activities: state.activities.filter(activity => !ids.includes(activity.id)),
          totalCount: state.totalCount - ids.length,
          loading: false
        }))
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to bulk delete activities',
          loading: false 
        })
      }
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setCategoryFilter: (category) => set({ categoryFilter: category }),
    setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty }),
    setLocationFilter: (location) => set({ locationFilter: location }),
    setLanguageFilter: (language) => set({ languageFilter: language }),
    setPriceFilter: (min, max) => set({ minPriceFilter: min, maxPriceFilter: max }),
    setTrendingFilter: (trending) => set({ trendingFilter: trending }),
    setPopularFilter: (popular) => set({ popularFilter: popular }),
    setFeaturedFilter: (featured) => set({ featuredFilter: featured }),
    
    clearFilters: () => set({
      searchQuery: '',
      searchTerm: '',
      statusFilter: '',
      categoryFilter: '',
      difficultyFilter: '',
      locationFilter: '',
      languageFilter: '',
      minPriceFilter: null,
      maxPriceFilter: null,
      trendingFilter: null,
      popularFilter: null,
      featuredFilter: null,
      currentPage: 1
    }),

    applyFilters: (filters) => {
      set({
        searchQuery: filters.search || '',
        categoryFilter: filters.category || '',
        difficultyFilter: filters.difficulty || '',
        locationFilter: filters.location || '',
        languageFilter: filters.language || '',
        minPriceFilter: filters.minPrice || null,
        maxPriceFilter: filters.maxPrice || null,
        trendingFilter: filters.trending !== undefined ? filters.trending : null,
        popularFilter: filters.popular !== undefined ? filters.popular : null,
        featuredFilter: filters.featured !== undefined ? filters.featured : null,
        currentPage: 1
      })
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    getActivityById: (id) => {
      return get().activities.find(activity => activity.id === id)
    },

    getActivitiesByCategory: (category) => {
      return get().activities.filter(activity => activity.category === category)
    },

    getActivitiesByLocation: (location) => {
      return get().activities.filter(activity => activity.location === location)
    },

    getFeaturedActivities: () => {
      return get().activities.filter(activity => activity.featured)
    },

    getTrendingActivities: () => {
      return get().activities.filter(activity => activity.trending)
    },

    getPopularActivities: () => {
      return get().activities.filter(activity => activity.popular)
    },

    searchActivities: (query) => {
      const activities = get().activities
      const lowercaseQuery = query.toLowerCase()
      return activities.filter(activity => 
        activity.name.toLowerCase().includes(lowercaseQuery) ||
        activity.title.toLowerCase().includes(lowercaseQuery) ||
        activity.description.toLowerCase().includes(lowercaseQuery) ||
        activity.category.toLowerCase().includes(lowercaseQuery) ||
        activity.location.toLowerCase().includes(lowercaseQuery) ||
        activity.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    },


  }), { name: 'activities-store' })
);